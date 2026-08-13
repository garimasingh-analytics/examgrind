import Link from "next/link";
import Chick from "@/components/Chick";
import GoogleLoginButton from "@/components/GoogleLoginButton";

/**
 * Dedicated returning-student entry point.
 *
 * `/home` is intentionally protected and redirects anonymous visitors back to
 * `/`. Linking the landing-page "I already study here" action here avoids that
 * redirect loop and gives people a real sign-in screen.
 */
type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  // Keep the destination inside ExamGrind. The callback repeats this check
  // server-side; validating here prevents an unexpected value in the UI flow.
  const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : "/home?resume=1";
  return (
    <main className="min-h-[100svh] bg-warm-wash">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </Link>
        <Link href="/" className="text-sm font-semibold text-cocoa-500 hover:text-cocoa-900">
          ← Back to home
        </Link>
      </header>

      <section className="mx-auto flex max-w-xl flex-col items-center px-6 pb-20 pt-16 text-center">
        <Chick state="happy" size={132} className="mb-7" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-600">
          Welcome back
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-cocoa-900 sm:text-5xl">
          Pick up where you left off.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-balance text-base leading-relaxed text-cocoa-700">
          Sign in to see your preparation, mistakes, study plan, and Coach.
        </p>
        <div className="mt-9">
          <GoogleLoginButton label="Continue with Google" redirectTo={redirectTo} />
        </div>
      </section>
    </main>
  );
}
