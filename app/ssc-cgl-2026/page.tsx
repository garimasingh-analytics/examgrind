import type { Metadata } from "next";
import Link from "next/link";
import Chick from "@/components/Chick";

export const metadata: Metadata = {
  title: "SSC CGL 2026 practice that finds your weak topics · ExamGrind",
  description:
    "Take a free 60-second SSC CGL weakness diagnosis, practise Quant, Reasoning, English and GA, and learn exactly what to revise next.",
  openGraph: {
    title: "Find your weakest SSC CGL topic in 60 seconds",
    description:
      "Five SSC traps. A clear weakness report. Personalised practice that explains why you got an answer wrong.",
  },
};

const diagnosisHref = "/diagnose/ssc-cgl";

export default function SscCglCampaignPage() {
  return (
    <main className="min-h-[100svh] bg-warm-wash text-cocoa-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold">
          ExamGrind
        </Link>
        <Link
          href={diagnosisHref}
          className="rounded-xl bg-cocoa-900 px-4 py-2 text-sm font-bold text-cream-50 transition hover:bg-cocoa-700"
        >
          Try it free
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 sm:px-8 md:grid-cols-[1.25fr_0.75fr] md:items-center md:pb-24 md:pt-16">
        <div>
          <p className="inline-flex rounded-full bg-coral-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-coral-700">
            SSC CGL Tier I + II · Quant · Reasoning · English · GA
          </p>
          <h1 className="mt-5 text-balance font-serif text-5xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">
            Your mock score is not a study plan.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-cocoa-700">
            ExamGrind finds the concept behind every wrong answer, shows the
            weak topics holding your SSC score back, and gives you the next
            drill to practise.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href={diagnosisHref}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cocoa-900 px-7 py-3.5 text-base font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700 sm:w-auto"
            >
              Find my weakest SSC topic →
            </Link>
            <p className="text-sm text-cocoa-500">
              5 questions · No signup · No card
            </p>
          </div>

          <ul className="mt-7 grid gap-2 text-sm text-cocoa-700 sm:grid-cols-2">
            <li>✓ 3 full quizzes free</li>
            <li>✓ 1 free Deep Analysis</li>
            <li>✓ Topic-by-topic weakness tracking</li>
            <li>✓ ₹199/month after the free tier</li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-cocoa-900/[0.07] bg-cream-50 p-6 shadow-warm-lg sm:p-8">
          <Chick state="idle" size={100} className="mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-coral-600">
            Example diagnosis
          </p>
          <p className="mt-3 font-serif text-2xl font-bold">
            “Percentages” is not the real problem.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cocoa-700">
            You are converting the percentage correctly, but applying it to
            the wrong base value. Revise successive percentage change, then
            attempt a five-question base-value drill.
          </p>
          <div className="mt-5 rounded-2xl bg-moss-500/10 p-4 text-sm font-semibold text-moss-700">
            Next step: Successive change → Base-value traps → Timed drill
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-cocoa-500">
            How it works
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center font-serif text-3xl font-bold sm:text-4xl">
            Practise less randomly. Improve more deliberately.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Step
              number="1"
              title="Take a focused quiz"
              body="Choose an SSC subject, chapter or topic and practise in an exam-style format."
            />
            <Step
              number="2"
              title="See the concept gap"
              body="Get more than a red X: see the misconception or reasoning step that caused the error."
            />
            <Step
              number="3"
              title="Drill what is actually weak"
              body="Use the recommended revision source and follow-up questions instead of restarting the entire syllabus."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cocoa-500">
              Built for the full SSC syllabus
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
              One account for every section.
            </h2>
            <p className="mt-4 leading-relaxed text-cocoa-700">
              Switch between subjects without losing your streak, progress or
              weakness history.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Quantitative Aptitude", "Arithmetic · Algebra · Geometry · DI"],
              ["General Intelligence", "Series · Coding · Syllogism · Spatial"],
              ["English", "Grammar · Vocabulary · Comprehension"],
              ["General Awareness", "Static GK · Science · Current affairs"],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-cocoa-900/[0.07] bg-cream-50 p-4 shadow-warm"
              >
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-cocoa-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cocoa-900 py-16 text-cream-50 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-400">
            Start with evidence, not another promise
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl font-bold">
            Find one weak topic before you spend anything.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream-50/75">
            The 60-second diagnosis is free and requires no account. If the
            result is useful, continue with three free quizzes and one Deep
            Analysis.
          </p>
          <Link
            href={diagnosisHref}
            className="mt-8 inline-flex rounded-2xl bg-coral-500 px-7 py-3.5 font-bold text-white transition hover:bg-coral-600"
          >
            Start the free SSC diagnosis →
          </Link>
          <p className="mt-4 text-xs text-cream-50/60">
            Premium is ₹199/month and auto-renews. Cancel anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="text-center font-serif text-3xl font-bold">Quick answers</h2>
        <div className="mt-8 space-y-3">
          <Faq
            q="Is the diagnosis really free?"
            a="Yes. The five-question diagnosis needs no signup or payment information. Creating an account unlocks three full quizzes and one Deep Analysis."
          />
          <Faq
            q="Does it cover both SSC CGL tiers?"
            a="Yes. The seeded syllabus covers SSC CGL Tier I and Tier II topics across Quant, Reasoning, English and General Awareness."
          />
          <Faq
            q="What happens after the free quizzes?"
            a="Premium costs ₹199 per month and unlocks unlimited quizzes, mocks and Deep Analyses. It auto-renews through your selected Razorpay payment mandate and can be cancelled from your account."
          />
          <Faq
            q="Can ExamGrind guarantee my selection?"
            a="No honest practice platform can guarantee a rank or selection. ExamGrind helps you diagnose mistakes and practise deliberately; your result still depends on preparation and exam performance."
          />
        </div>
      </section>

    </main>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-cocoa-900/[0.07] bg-warm-wash p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cocoa-900 text-sm font-bold text-cream-50">
        {number}
      </span>
      <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{body}</p>
    </article>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-cocoa-900/[0.07] bg-cream-50 px-5 py-4 shadow-warm">
      <summary className="cursor-pointer list-none font-bold marker:hidden">
        <span className="flex items-center justify-between gap-4">
          {q}
          <span className="text-coral-600 transition group-open:rotate-45">+</span>
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-cocoa-700">{a}</p>
    </details>
  );
}
