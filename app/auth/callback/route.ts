import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";

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

  if (code) {
    const supabase = createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);

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

    if (examChoice) {
      const user = signedInUser;

      if (user) {
        // For the callback path we set exam_choice only when it's missing
        // (i.e. first sign-in). Returning users keep whatever they last
        // chose — that way "Sign in with Google" from elsewhere doesn't
        // silently reset an existing pick. Explicit exam switches happen
        // on /start/[slug].
        //
        // Use the service-role client for the write to bypass the
        // intermittent RLS-cookie-timing issue documented in
        // lib/supabase/admin.ts. The user.id has already been verified
        // via the cookie session's auth.getUser() above.
        const admin = createAdminSupabase();
        const { data: existing } = await admin
          .from("users")
          .select("id, exam_choice")
          .eq("id", user.id)
          .maybeSingle();

        if (!existing) {
          // First sign-in: create the row with the picked exam.
          await admin.from("users").insert({
            id: user.id,
            email: user.email ?? "",
            exam_choice: examChoice,
          });
        } else if (!existing.exam_choice) {
          // Row exists but exam_choice never got set (legacy account, or
          // user landed via a path that didn't carry a slug). Set it now.
          await admin
            .from("users")
            .update({ exam_choice: examChoice })
            .eq("id", user.id);
        }
        // else: keep their existing pick.
      }
    }
  }

  return NextResponse.redirect(`${origin}${finalNext}`);
}
