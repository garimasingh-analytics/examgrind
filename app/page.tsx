import CinematicLanding from "@/components/CinematicLanding";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Public acquisition surface.
 *
 * This deliberately does not share the signed-in app's dashboard grammar.
 * A visitor first needs to understand the promise and choose their exam;
 * the product UI comes after that choice.
 */
type LandingPageProps = {
  searchParams: Promise<{ code?: string; next?: string }>;
};

export default async function LandingPage({ searchParams }: LandingPageProps) {
  const { code, next } = await searchParams;

  // Supabase falls back to the configured Site URL when a requested OAuth
  // callback URL is absent from its redirect allow-list. In production that
  // fallback is `/?code=…`. Never render the landing page with an unexchanged
  // code: forward it into our single session-exchange route instead.
  if (code) {
    const callback = new URLSearchParams({ code, next: next?.startsWith("/") ? next : "/home" });
    redirect(`/auth/callback?${callback.toString()}`);
  }

  // The cinematic introduction is for first-time visitors. A returning
  // authenticated student should never need to dismiss marketing to resume
  // their preparation.
  let signedIn = false;
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  } catch {
    // A missing/expired auth cookie must not make the public page fail.
  }
  if (signedIn) redirect("/home");

  return <CinematicLanding />;
}
