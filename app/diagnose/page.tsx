import Link from "next/link";
import type { Metadata } from "next";
import Chick from "@/components/Chick";
import { EXAM_LABEL, EXAM_TAGLINE, type DiagnoseExam } from "@/lib/diagnose-questions";

export const metadata: Metadata = {
  title: "60-sec diagnosis — find your exam weak spot · ExamGrind",
  description:
    "Take 5 real PYQ trap questions. Get an AI weakness report in 60 seconds. No signup. Free.",
  openGraph: {
    title: "60-sec exam weakness diagnosis · ExamGrind",
    description:
      "5 PYQ traps. AI tells you exactly where you'd score lower. No signup, no card.",
  },
};

const EXAMS: DiagnoseExam[] = ["neet-ug", "cuet", "ssc-cgl"];

const EXAM_EMOJI: Record<DiagnoseExam, string> = {
  "neet-ug": "🩺",
  cuet: "🎓",
  "ssc-cgl": "📊",
};

export default function DiagnoseHubPage() {
  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-cocoa-500 transition hover:text-cocoa-700"
        >
          ← Home
        </Link>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-4 text-center sm:pt-12">
        <Chick state="idle" size={120} className="mb-6" />

        <p className="mb-3 inline-flex items-center rounded-full bg-cocoa-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-50">
          60-second diagnosis · No signup
        </p>

        <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-cocoa-900 sm:text-5xl">
          Find your exam weak spot.
          <br />
          In 60 seconds.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-cocoa-700 sm:text-lg">
          5 real PYQ trap questions. Pick your exam. We tell you exactly where you&apos;d score lower — and what to do about it.
        </p>

        <div className="mt-2 text-sm text-cocoa-500">
          Free · No card · No signup for the diagnosis · 60 seconds total
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="sr-only">Pick your exam</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMS.map((exam) => (
            <li key={exam}>
              <Link
                href={`/diagnose/${exam}`}
                className="group flex h-full flex-col rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm transition hover:-translate-y-0.5 hover:border-coral-500/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{EXAM_EMOJI[exam]}</span>
                  <span className="rounded-full bg-coral-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-coral-600">
                    5 traps · 60s
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-cocoa-900">
                  {EXAM_LABEL[exam]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
                  {EXAM_TAGLINE[exam]}
                </p>
                <p className="mt-auto pt-4 text-sm font-semibold text-cocoa-900 group-hover:text-coral-600">
                  Start diagnosis →
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50/60 p-6 text-sm text-cocoa-700">
          <p className="font-semibold text-cocoa-900">What you&apos;ll get at the end:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your score (X out of 5)</li>
            <li>The exact concept gap each wrong answer reveals</li>
            <li>The NCERT chapter / R.S. Aggarwal section to drill</li>
            <li>One CTA to the full 30-question diagnostic (free, requires signup)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
