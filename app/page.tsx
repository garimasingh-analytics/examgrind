import GoogleLoginButton from "@/components/GoogleLoginButton";
import Chick from "@/components/Chick";

export default function LandingPage() {
  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto max-w-5xl px-6 py-6">
        <span className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </span>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-10 text-center sm:pt-20">
        <Chick state="idle" size={180} className="mb-8" />

        <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-cocoa-900 sm:text-6xl md:text-7xl">
          Practice CUET, one chapter at a time.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-cocoa-700">
          A small, warm app for CUET UG students. Pick a chapter,
          take a short quiz, and a little chicken cheers you on while you learn.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <GoogleLoginButton label="Sign in with Google" redirectTo="/home" />
          <p className="text-sm text-cocoa-500">Free to start. No credit card.</p>
        </div>
      </section>
    </main>
  );
}
