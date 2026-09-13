import type { Metadata } from "next";
import Link from "next/link";
import Chick from "@/components/Chick";

export const metadata: Metadata = {
  title: "ExamGrind reviewer preview",
  robots: { index: false, follow: false },
};

/**
 * A read-only, data-free route for Google Play reviewers.
 * It demonstrates the core learning loop without exposing an account,
 * subscription, payment flow, or another student's preparation data.
 */
export default function PlayReviewPage() {
  return (
    <main className="min-h-[100svh] bg-cream-100 px-4 py-6 text-cocoa-900 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-cocoa-900/10 bg-cream-50 p-6 shadow-warm-lg sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-ember-700">Google Play review</p>
              <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">ExamGrind, in one guided loop.</h1>
            </div>
            <Chick state="happy" size={82} />
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-cocoa-700">
            This is a safe review preview. It contains no personal data, no live payments, and no access to another learner&apos;s account.
            It shows the core experience a student gets after studying and practising on ExamGrind.
          </p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            <PreviewStep number="01" title="Learn" body="Coach breaks one concept into a focused lesson." />
            <PreviewStep number="02" title="Practise" body="A short topic quiz checks whether the method landed." />
            <PreviewStep number="03" title="Improve" body="Deep Analysis explains the mistake and gives the next repair step." />
          </ol>

          <div className="mt-8 rounded-3xl bg-cocoa-900 p-5 text-cream-50 sm:flex sm:items-center sm:justify-between sm:gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-sun-400">Try the complete review flow</p>
              <p className="mt-1 text-sm leading-6 text-cream-100/80">Take three SSC CGL percentage questions, then open a sample deep analysis.</p>
            </div>
            <Link href="/play-review/quiz" className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-sun-400 px-5 py-3 text-sm font-bold text-cocoa-900 transition hover:bg-sun-300 sm:mt-0">
              Start reviewer demo →
            </Link>
          </div>

          <p className="mt-6 text-sm leading-6 text-cocoa-600">
            Student accounts use Google Sign-In to save personalised progress. This reviewer flow is deliberately account-free so Google Play can inspect the product without credentials.
          </p>
        </div>
      </section>
    </main>
  );
}

function PreviewStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <li className="list-none rounded-2xl border border-cocoa-900/10 bg-cream-100 p-4">
      <p className="text-xs font-bold tracking-[.16em] text-ember-700">{number}</p>
      <h2 className="mt-2 font-serif text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-cocoa-700">{body}</p>
    </li>
  );
}
