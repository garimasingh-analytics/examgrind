import CinematicLanding from "@/components/CinematicLanding";

/**
 * Public acquisition surface.
 *
 * This deliberately does not share the signed-in app's dashboard grammar.
 * A visitor first needs to understand the promise and choose their exam;
 * the product UI comes after that choice.
 */
export default function LandingPage() {
  return <CinematicLanding />;
}
