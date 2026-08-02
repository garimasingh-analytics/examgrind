import Link from "next/link";
import { redirect } from "next/navigation";
import Chick from "@/components/Chick";
import DeepAnalysis, { type AnalysisJson } from "@/app/results/[id]/DeepAnalysis";
import { isAdminEmail } from "@/lib/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const previewAnalysis: AnalysisJson = {
  verdict: "You understand the percentage mechanics, but the second discount is being added instead of compounded. That is a repairable method gap — not a broad weakness.",
  strengths: [{ concept: "Marked price and discount", evidence: "You identified the right base for the first discount." }],
  weaknesses: [{
    concept: "Successive percentage change",
    severity: "high",
    evidence: "The two discounts were treated as a simple sum.",
    improve: {
      read: { source: "Your percentage-change notes", minutes: 5, distill: "Apply each percentage to the remaining amount, not the original amount." },
      work: { questionIdx: 2, walkthrough_steps: ["After 20% off, 80% remains.", "Then 10% off that leaves 90% of 80%.", "0.8 × 0.9 = 0.72, so the effective discount is 28%."], your_mistake: "You added 20% + 10% and got 30%.", correct_answer: "The equivalent discount is 28%." },
      practice: { concept_focus: "successive discounts", drill_size: 5 },
    },
  }],
  perQuestion: [],
  patterns: ["You are more accurate when the question gives one percentage change at a time.", "Slow down when two changes happen in sequence — write the remaining percentage before calculating."],
  pacing: { median_seconds_per_question: 42, exam_budget_seconds: 60, over_budget: false, verdict: "Your pace is healthy. Keep the extra time for multi-step percentage questions.", rushed_questions: [], slow_questions: [] },
  studyPlan: { next_15_min: "Solve five successive-discount questions without looking at formulas.", next_session: "Mix marked price, profit, and discount in one 10-question repair round.", this_week: "Revisit this concept after two days and aim for 4/5 or better." },
};

export default async function FounderResultsPreviewPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/home");

  return (
    <main className="results-stage min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/admin" className="font-serif text-lg font-bold text-cocoa-900">ExamGrind · Founder View</Link>
        <Link href="/admin/experience-preview/quiz" className="rounded-full bg-cocoa-900 px-3 py-2 text-xs font-bold text-cream-50">Restart preview</Link>
      </header>
      <section className="mx-auto max-w-2xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="result-dossier rounded-4xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="result-chick-frame"><Chick state="happy" size={126} /></div>
            <p className="result-kicker mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">SSC CGL · Basic Profit/Loss</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-cocoa-900 sm:text-5xl">Nicely done.</h1>
          </div>
          <div className="result-stat-grid mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Correct" value="2 / 3" />
            <Stat label="Accuracy" value="67%" accent="text-ember-600" />
            <Stat label="XP earned" value="+20" accent="text-sun-600" />
          </div>
          <div className="result-next-action mt-6 rounded-2xl border border-ember-600/20 bg-ember-600/10 p-4 text-left sm:flex sm:items-center sm:justify-between sm:gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ember-700">One next action</p><p className="mt-1 font-semibold text-cocoa-900">Repair successive discounts</p><p className="mt-1 text-sm leading-6 text-cocoa-700">One focused retry is the fastest way to turn this into reliable marks.</p></div><Link href="/admin/experience-preview/quiz" className="mt-3 inline-flex shrink-0 justify-center rounded-xl bg-ember-600 px-3 py-2.5 text-sm font-bold text-cream-50 sm:mt-0">Start a repair round →</Link></div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-2xl px-4 sm:px-6"><DeepAnalysis quizId="founder-analysis-preview" topicId={null} initialAnalysis={previewAnalysis} initialIsDeepDive={false} freeAnalysisUsed={false} hasAnalysisCredit={false} isPaid /></section>
    </main>
  );
}

function Stat({ label, value, accent = "text-cocoa-900" }: { label: string; value: string; accent?: string }) {
  return <div className="result-stat rounded-2xl border border-cocoa-900/[0.06] bg-cream-100 p-4 text-center"><p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-500">{label}</p><p className={`mt-1 font-serif text-2xl font-bold tabular-nums ${accent}`}>{value}</p></div>;
}
