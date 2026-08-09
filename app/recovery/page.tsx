import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { scopeQuizzesToActiveExam } from "@/lib/active-exam";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import AdSlot from "@/components/AdSlot";
import RecoveryHistoryViewed from "@/components/RecoveryHistoryViewed";

export const dynamic = "force-dynamic";

type RepairCycle = {
  id: string;
  source_quiz_id: string;
  repair_quiz_id: string;
  concept: string;
  severity: "high" | "medium" | "low";
  status: "started" | "completed";
  repair_correct: number | null;
  repair_total: number | null;
  completed_at: string | null;
  created_at: string;
};

type SourceQuiz = {
  id: string;
  subject: string;
  subtopic: string | null;
  topic_id: string | null;
};

type RecoveryState = "ready" | "active" | "holding";

function stateFor(cycle: RepairCycle): RecoveryState {
  if (cycle.status === "started") return "ready";
  const accuracy = cycle.repair_total && cycle.repair_correct != null
    ? cycle.repair_correct / cycle.repair_total
    : 0;
  return accuracy >= 0.7 ? "holding" : "active";
}

const stateCopy: Record<RecoveryState, { label: string; className: string }> = {
  ready: { label: "Ready to repair", className: "bg-sun-400/20 text-cocoa-900" },
  active: { label: "Still active", className: "bg-coral-500/15 text-coral-700" },
  holding: { label: "Holding", className: "bg-moss-500/15 text-moss-700" },
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
}

/** The persistent, exam-scoped proof that turns repair rounds into a study history. */
export default async function RecoveryPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: profile }, { data: cyclesRaw }] = await Promise.all([
    supabase
      .from("users")
      .select("exam_choice, subscription_status, paid_until")
      .eq("id", user.id)
      .maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid"; paid_until: string | null }>(),
    supabase
      .from("repair_cycles")
      .select("id, source_quiz_id, repair_quiz_id, concept, severity, status, repair_correct, repair_total, completed_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const liveStatus = await ensureSubscriptionFreshness(user.id, profile?.subscription_status ?? "free", profile?.paid_until ?? null);
  const allCycles = (cyclesRaw ?? []) as RepairCycle[];
  const sourceQuizIds = Array.from(new Set(allCycles.map((cycle) => cycle.source_quiz_id)));
  const { data: sourceQuizzesRaw } = sourceQuizIds.length > 0
    ? await supabase
        .from("quizzes")
        .select("id, subject, subtopic, topic_id")
        .in("id", sourceQuizIds)
    : { data: [] };

  // A student can switch exams. Keep the recovery view truthful to the active
  // exam rather than mixing SSC, CUET, and NEET repair signals together.
  const activeSourceQuizzes = await scopeQuizzesToActiveExam(
    supabase,
    user.id,
    (sourceQuizzesRaw ?? []) as SourceQuiz[],
  );
  const activeSourceQuizIds = new Set(activeSourceQuizzes.map((quiz) => quiz.id));
  const cycles = allCycles.filter((cycle) => activeSourceQuizIds.has(cycle.source_quiz_id));
  const sourceById = new Map(activeSourceQuizzes.map((quiz) => [quiz.id, quiz]));

  // One status per concept: the newest repair is its current signal. The
  // history below remains chronological so students can still see prior work.
  const latestByConcept = new Map<string, RepairCycle>();
  for (const cycle of cycles) {
    if (!latestByConcept.has(cycle.concept)) latestByConcept.set(cycle.concept, cycle);
  }
  const currentSignals = Array.from(latestByConcept.values()).sort((a, b) => {
    const rank = { ready: 0, active: 1, holding: 2 } as const;
    return rank[stateFor(a)] - rank[stateFor(b)];
  });
  const activeCount = currentSignals.filter((cycle) => stateFor(cycle) !== "holding").length;
  const completedCount = cycles.filter((cycle) => cycle.status === "completed").length;
  const nextCycle = currentSignals.find((cycle) => stateFor(cycle) === "ready")
    ?? currentSignals.find((cycle) => stateFor(cycle) === "active")
    ?? null;
  const nextHref = nextCycle
    ? stateFor(nextCycle) === "ready"
      ? `/quiz/${nextCycle.repair_quiz_id}`
      : `/results/${nextCycle.source_quiz_id}`
    : "/home";
  const nextLabel = nextCycle
    ? stateFor(nextCycle) === "ready" ? "Start repair round →" : "Review recovery map →"
    : "Continue today’s mission →";

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-24">
      <header className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">ExamGrind</Link>
        <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">← Home</Link>
      </header>

      <section className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-700">Recovery history</p>
        <h1 className="mt-2 max-w-2xl font-serif text-4xl font-semibold tracking-tight text-cocoa-900 sm:text-5xl">See what you fixed. Know what is still asking for work.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-cocoa-700">Each signal begins with an analysis, then earns its place here only after a fresh-question repair round. This is evidence—not a promise of marks.</p>
      </section>

      <section className="mx-auto mt-7 max-w-4xl px-4 sm:px-6">
        <RecoveryHistoryViewed activeCount={activeCount} completedCount={completedCount} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Current signals" value={String(currentSignals.length)} note="concepts with repair evidence" />
          <Metric label="Need attention" value={String(activeCount)} note="ready or still active" tone={activeCount > 0 ? "coral" : "moss"} />
          <Metric label="Repair rounds" value={String(completedCount)} note="completed on fresh questions" tone="moss" />
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cocoa-900 p-5 text-cream-50 shadow-warm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-sun-300">Your next honest move</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">{nextCycle ? nextCycle.concept : "Your repair loop is clear for now."}</h2>
            <p className="mt-1 text-sm leading-6 text-cream-50/75">{nextCycle ? stateFor(nextCycle) === "ready" ? "A targeted fresh-question round is ready when you are." : "The last fresh round is still below the reliability signal. Review the original evidence before trying again." : "Complete a quiz and use its analysis to create the next repair signal."}</p>
          </div>
          <Link href={nextHref} className="mt-4 inline-flex shrink-0 justify-center rounded-2xl bg-cream-50 px-4 py-3 text-sm font-bold text-cocoa-900 transition hover:bg-cream-100 sm:mt-0">{nextLabel}</Link>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">Current map</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-cocoa-900">The concepts carrying a signal.</h2>
          </div>
          <span className="font-mono text-xs font-bold text-cocoa-500">{currentSignals.length} total</span>
        </div>

        {currentSignals.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center shadow-warm sm:p-10">
            <p className="text-3xl" aria-hidden>↗</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-cocoa-900">Your first repair will appear here.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cocoa-700">Finish a real quiz, open its Deep Analysis, then start a targeted repair round. The fresh-question result becomes your first proof point.</p>
            <Link href="/home" className="mt-5 inline-flex rounded-2xl bg-cocoa-900 px-4 py-3 text-sm font-bold text-cream-50 transition hover:bg-cocoa-800">Choose a topic →</Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {currentSignals.map((cycle) => {
              const source = sourceById.get(cycle.source_quiz_id);
              const state = stateFor(cycle);
              const accuracy = cycle.repair_total && cycle.repair_correct != null
                ? Math.round((cycle.repair_correct / cycle.repair_total) * 100)
                : null;
              const href = state === "ready" ? `/quiz/${cycle.repair_quiz_id}` : `/results/${cycle.source_quiz_id}`;
              const action = state === "ready" ? "Start repair →" : state === "active" ? "Review signal →" : "View proof →";
              return (
                <article key={cycle.id} className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-cocoa-500">{source?.subject ?? "Practice"} · {cycle.severity} signal</p>
                      <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-cocoa-900">{cycle.concept}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${stateCopy[state].className}`}>{stateCopy[state].label}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-cocoa-700">{accuracy == null ? "Your targeted fresh-question round is ready." : `Fresh-question repair result: ${cycle.repair_correct} / ${cycle.repair_total} · ${accuracy}%.`}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-cocoa-900/[0.07] pt-3">
                    <span className="text-xs font-medium text-cocoa-500">{state === "ready" ? `Created ${dateLabel(cycle.created_at)}` : `Completed ${dateLabel(cycle.completed_at ?? cycle.created_at)}`}</span>
                    <Link href={href} className="text-sm font-bold text-ember-700 underline decoration-ember-600/30 underline-offset-4 hover:text-ember-800">{action}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {cycles.length > 0 && (
        <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">All repair rounds</p>
          <div className="mt-3 overflow-hidden rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 shadow-warm">
            {cycles.slice(0, 20).map((cycle) => {
              const source = sourceById.get(cycle.source_quiz_id);
              const state = stateFor(cycle);
              const score = cycle.repair_total && cycle.repair_correct != null ? `${cycle.repair_correct}/${cycle.repair_total}` : "Not started";
              return <div key={cycle.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-cocoa-900/[0.07] px-5 py-4 last:border-0"><div><p className="font-semibold text-cocoa-900">{cycle.concept}</p><p className="mt-0.5 text-xs text-cocoa-500">{source?.subject ?? "Practice"} · {cycle.status === "completed" ? `Fresh result ${score}` : "Fresh round waiting"}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${stateCopy[state].className}`}>{stateCopy[state].label}</span></div>;
            })}
          </div>
        </section>
      )}

      {liveStatus !== "paid" && <AdSlot />}
    </main>
  );
}

function Metric({ label, value, note, tone = "cocoa" }: { label: string; value: string; note: string; tone?: "cocoa" | "coral" | "moss" }) {
  const colour = tone === "coral" ? "text-coral-700" : tone === "moss" ? "text-moss-700" : "text-cocoa-900";
  return <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm"><p className="text-xs font-semibold uppercase tracking-[.14em] text-cocoa-500">{label}</p><p className={`mt-1 font-serif text-3xl font-semibold ${colour}`}>{value}</p><p className="mt-1 text-xs leading-5 text-cocoa-600">{note}</p></div>;
}
