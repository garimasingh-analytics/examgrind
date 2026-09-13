import type { Metadata } from "next";
import Link from "next/link";
import Chick from "@/components/Chick";
import DeepAnalysis, { type AnalysisJson } from "@/app/results/[id]/DeepAnalysis";

export const metadata: Metadata = {
  title: "ExamGrind reviewer deep analysis",
  robots: { index: false, follow: false },
};

const analysis: AnalysisJson = {
  verdict: "The percentage basics are in place. The repair point is compounded change: each percentage acts on the amount that remains after the previous change.",
  strengths: [{ concept: "Marked price and discount", evidence: "You recognised that a discount is applied to the marked price." }],
  weaknesses: [{
    concept: "Successive percentage change",
    severity: "high",
    evidence: "The two discounts were added instead of compounded.",
    improve: {
      read: { source: "Coach lesson: Percentage change", minutes: 5, distill: "Write the remaining percentage after each change, then multiply." },
      work: { questionIdx: 2, walkthrough_steps: ["After 20% off, 80% remains.", "A further 10% off leaves 90% of that 80%.", "0.8 × 0.9 = 0.72, so the total discount is 28%."], your_mistake: "Adding 20% and 10% produces 30%, which uses the original value twice.", correct_answer: "The equivalent discount is 28%." },
      practice: { concept_focus: "successive discounts", drill_size: 5 },
    },
  }],
  perQuestion: [],
  patterns: ["Multi-step percentage questions need a written remaining-value step.", "A short repair drill is more useful here than revising the whole chapter."],
  pacing: { median_seconds_per_question: 42, exam_budget_seconds: 60, over_budget: false, verdict: "The pace is healthy. Preserve that time for questions with two linked changes.", rushed_questions: [], slow_questions: [] },
  studyPlan: { next_15_min: "Solve five successive-discount questions without using the shortcut formula.", next_session: "Mix profit, discount, and marked-price questions in one ten-question drill.", this_week: "Retest the method after two days and aim for 4/5 or better." },
};

export default function PlayReviewResultsPage() {
  return (
    <main className="results-stage min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/play-review" className="font-serif text-lg font-bold text-cocoa-900">ExamGrind · reviewer demo</Link>
        <Link href="/play-review/quiz" className="rounded-full bg-cocoa-900 px-3 py-2 text-xs font-bold text-cream-50">Restart demo</Link>
      </header>
      <section className="mx-auto max-w-2xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="result-dossier rounded-4xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="result-chick-frame"><Chick state="happy" size={126} /></div>
            <p className="result-kicker mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">SSC CGL · successive percentage change</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-cocoa-900 sm:text-5xl">Here&apos;s the next repair.</h1>
          </div>
          <div className="result-stat-grid mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Correct" value="2 / 3" />
            <Stat label="Accuracy" value="67%" accent="text-ember-600" />
            <Stat label="XP earned" value="+20" accent="text-sun-600" />
          </div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
        <DeepAnalysis quizId="play-review-analysis" topicId={null} initialAnalysis={analysis} initialIsDeepDive={false} freeAnalysisUsed={false} hasAnalysisCredit={false} isPaid previewRepairHref="/play-review/quiz" />
      </section>
    </main>
  );
}

function Stat({ label, value, accent = "text-cocoa-900" }: { label: string; value: string; accent?: string }) {
  return <div className="result-stat rounded-2xl border border-cocoa-900/[0.06] bg-cream-100 p-4 text-center"><p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-500">{label}</p><p className={`mt-1 font-serif text-2xl font-bold tabular-nums ${accent}`}>{value}</p></div>;
}
