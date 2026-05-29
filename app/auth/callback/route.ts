import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

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

  if (code) {
    const supabase = createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);

    // After session exchange, fetch the authenticated user and ensure they
    // have a row in public.users with the right exam_choice.
    if (examChoice) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // For the callback path we set exam_choice only when it's missing
        // (i.e. first sign-in). Returning users keep whatever they last
        // chose — that way "Sign in with Google" from elsewhere doesn't
        // silently reset an existing pick. Explicit exam switches happen
        // on /start/[slug] and (later) the /me exam switcher.
        const { data: existing } = await supabase
          .from("users")
          .select("id, exam_choice")
          .eq("id", user.id)
          .maybeSingle();

        if (!existing) {
          // First sign-in: create the row with the picked exam.
          await supabase.from("users").insert({
            id: user.id,
            email: user.email ?? "",
            exam_choice: examChoice,
          });
        } else if (!existing.exam_choice) {
          // Row exists but exam_choice never got set (legacy account, or
          // user landed via a path that didn't carry a slug). Set it now.
          await supabase
            .from("users")
            .update({ exam_choice: examChoice })
            .eq("id", user.id);
        }
        // else: keep their existing pick. Card-click switching is handled
        // explicitly by /start/[slug] (which upserts unconditionally).
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
