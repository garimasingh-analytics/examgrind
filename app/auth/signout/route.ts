import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sign-out handler.
 *
 * Clears the Supabase auth cookies + revokes the session, then sends the
 * user back to the landing page. POST-only so a stray link visit can't
 * accidentally log someone out.
 */
export async function POST() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  // 303 = "see other" — forces a GET on the redirect target, which is what
  // we want after a POST.
  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    { status: 303 }
  );
}
