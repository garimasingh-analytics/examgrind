import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * OAuth callback handler.
 *
 * Supabase redirects the browser here after Google sign-in with `?code=...`.
 * We:
 *   1. Exchange the code for a session (sets auth cookies).
 *   2. If the URL carried `?exam=ssc-cgl` (set by the landing page card the
 *      user clicked), persist that to users.exam_choice so /home knows which
 *      exam to filter subjects by. First sign-in also gets the user row
 *      created here so /home doesn't need a defensive insert.
 *   3. Redirect to the destination (default: /home).
 *
 * The exam slug is whitelisted server-side so a malicious referrer can't
 * write garbage to users.exam_choice via the OAuth round trip.
 */
const ALLOWED_EXAMS = new Set(["cuet", "ssc-cgl", "neet-ug"]);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";
  const examParam = searchParams.get("exam");
  const examChoice =
    examParam && ALLOWED_EXAMS.has(examParam) ? examParam : null;

  // We may swap the default landing destination for admins below.
  let finalNext = next;
  let authEvent: "sign_up" | "login" | null = null;

  // `exchangeCodeForSession` writes the Supabase session through the client's
  // cookie adapter. The old callback used the shared server helper and then
  // created a *different* redirect response, which discarded those writes.
  // The browser therefore reached /home without a session and was sent back
  // to the public landing page. Keep cookie writes on this response and copy
  // them to the eventual redirect below.
  const cookieResponse = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            cookieResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("[auth/callback] session exchange failed:", exchangeError.message);
    }

    // After session exchange, fetch the authenticated user once and reuse
    // it for (a) the optional exam_choice write, and (b) the admin auto-
    // route decision below.
    const {
      data: { user: signedInUser },
    } = await supabase.auth.getUser();

    // If the signed-in user is on the admin allow-list AND they were
    // headed to the default /home landing, redirect them straight to
    // /admin. We preserve an explicit ?next= because the user might be
    // mid-flow (e.g., resuming a quiz link or returning from /me) and
    // overriding that would be hostile.
    if (signedInUser && isAdminEmail(signedInUser.email) && next === "/home") {
      finalNext = "/admin";
    }

    // Handle user-row insert (first signup) + welcome email + exam_choice update.
    // This runs for ANY successful sign-in, regardless of whether ?exam= was
    // passed in the OAuth round trip. That matters because:
    //   - Users who click an exam card carry ?exam=cuet etc.
    //   - Users who sign in via any other entrypoint (direct OAuth, magic link,
    //     etc.) don't carry the param — but they still need a user row + welcome.
    const user = signedInUser;
    if (user) {
      // Use the service-role client to bypass the intermittent RLS-cookie-
      // timing issue documented in lib/supabase/admin.ts. The user.id has
      // already been verified via the cookie session's auth.getUser() above.
      const admin = createAdminSupabase();
      const { data: existing } = await admin
        .from("users")
        .select("id, exam_choice")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        // First sign-in: create the row. examChoice may be null if the user
        // didn't go through an exam-card click — that's fine, /start/[slug]
        // will set it later.
        const { error: insertError } = await admin.from("users").insert({
          id: user.id,
          email: user.email ?? "",
          exam_choice: examChoice,
        });
        if (!insertError) {
          authEvent = "sign_up";
          // AWAIT the welcome email send. Fire-and-forget gets killed by
          // Vercel serverless lambda termination after the redirect response
          // is sent — confirmed empirically. Adds ~1-2 sec to the OAuth round
          // trip but guarantees delivery. SMTP failure won't break signup
          // since sendEmail catches errors and returns false.
          if (user.email) {
            try {
              // Pass the exam SLUG (cuet / ssc-cgl / neet-ug) so the email
              // can render the exam-specific proof block. Falls back to neet-ug
              // template if no exam was picked.
              console.log("[auth/callback] sending welcome email to", user.email, "exam:", examChoice ?? "(none → default NEET)");
              const sent = await sendWelcomeEmail(user.email, examChoice ?? undefined);
              console.log("[auth/callback] welcome email send result:", sent);
            } catch (e) {
              console.error("[auth/callback] welcome email send threw:", e);
            }
          }
        } else {
          // A concurrent OAuth callback may have created the profile first.
          // Treat that harmless race as a returning login; do not send a
          // misleading signup event or a second welcome email.
          console.error("[auth/callback] user row insert failed:", insertError);
        }
      } else if (examChoice && !existing.exam_choice) {
        // Returning user with no exam choice set yet — fill it in.
        // Returning users with an existing choice keep their pick.
        await admin
          .from("users")
          .update({ exam_choice: examChoice })
          .eq("id", user.id);
      }

      if (!authEvent) authEvent = "login";
    }
  }

  // `next` comes from the browser. Preserve in-app destinations but never
  // turn the authentication callback into an open redirect.
  const requestedDestination = new URL(finalNext, origin);
  const destination =
    requestedDestination.origin === origin
      ? requestedDestination
      : new URL("/home", origin);
  if (authEvent) destination.searchParams.set("auth_event", authEvent);
  const response = NextResponse.redirect(destination);
  cookieResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}
