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
export default async function LandingPage() {
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
