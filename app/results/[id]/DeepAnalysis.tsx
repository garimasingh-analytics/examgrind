"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import UpgradeModal, { type PaywallReason } from "@/components/UpgradeModal";

/* ------------------------------------------------------------------ *
 * Types — mirror the JSON shape Claude returns                       *
 * ------------------------------------------------------------------ */

type Verdict =
  | "correct"
  | "wrong-conceptual"
  | "wrong-careless"
  | "wrong-partial"
  | "skipped";

type Strength = { concept: string; evidence: string };

type Weakness = {
  concept: string;
  severity: "high" | "medium" | "low";
  evidence: string;
  improve: {
    read: { source: string; minutes: number; distill: string };
    work: {
      questionIdx: number;
      walkthrough_steps: string[];
      your_mistake: string;
      correct_answer: string;
    };
    practice: { concept_focus: string; drill_size: number };
  };
};

type PerQuestion = {
  idx: number;
  verdict: Verdict;
  concept: string;
  explanation: string;
};

type PacingSlow = { idx: number; seconds: number; reason: string };
type PacingRushed = {
  idx: number;
  seconds: number;
  verdict: "fast-correct" | "rushed-wrong";
  reason: string;
};

export type AnalysisJson = {
  verdict: string;
  strengths: Strength[];
  weaknesses: Weakness[];
  perQuestion: PerQuestion[];
  patterns: string[];
  // Pacing block — present when any time_seconds were recorded.
  // Older quizzes (pre-time-tracking) won't have this field; the UI
  // renders nothing for them, which is the right behaviour.
  pacing?: {
    median_seconds_per_question?: number;
    exam_budget_seconds?: number;
    over_budget?: boolean;
    slow_questions?: PacingSlow[];
    rushed_questions?: PacingRushed[];
    verdict?: string;
    exam_pacing_projection?: string;
  };
  studyPlan: {
    next_15_min: string;
    next_session: string;
    this_week: string;
  };
};

type AnalyzeResponse =
  | {
      cached: boolean;
      analysis: AnalysisJson;
      model: string;
      is_deep_dive: boolean;
    }
  | {
      error: string;
      paywall?: { reason: string; currentTier: string; used?: number; limit?: number };
    };

type Props = {
  quizId: string;
  topicId: string | null;
  /** Pre-fetched analysis if it already exists in DB. */
  initialAnalysis: AnalysisJson | null;
  initialIsDeepDive: boolean;
  /** Has the user already used their free analysis? */
  freeAnalysisUsed: boolean;
  isPaid: boolean;
};

/* ------------------------------------------------------------------ *
 * Component                                                           *
 * ------------------------------------------------------------------ */

export default function DeepAnalysis({
  quizId,
  topicId,
  initialAnalysis,
  initialIsDeepDive,
  freeAnalysisUsed,
  isPaid,
}: Props) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisJson | null>(initialAnalysis);
  const [isDeepDive, setIsDeepDive] = useState(initialIsDeepDive);
  const [pending, startTransition] = useTransition();
  const [drilling, setDrilling] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<null | {
    reason: PaywallReason;
    used?: number;
    limit?: number;
  }>(null);

  const analyze = (deepDive: boolean) => {
    setError(null);
    setPaywall(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/quiz/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, deepDive }),
        });
        const body: AnalyzeResponse = await res.json();
        if (!res.ok) {
          if (res.status === 402 && "paywall" in body && body.paywall) {
            const rawReason = body.paywall.reason ?? "analysis-limit";
            // Server uses "quota-exhausted" for the free-tier analysis cap.
            // Map it to the modal's known reasons.
            const reason: PaywallReason =
              rawReason === "deep-dive"
                ? "deep-dive"
                : rawReason === "quiz-limit"
                ? "quiz-limit"
                : "analysis-limit";
            setPaywall({
              reason,
              used: body.paywall.used,
              limit: body.paywall.limit,
            });
            return;
          }
          throw new Error(("error" in body && body.error) || `Failed (${res.status})`);
        }
        if ("analysis" in body) {
          setAnalysis(body.analysis);
          setIsDeepDive(body.is_deep_dive);
        }
      } catch (e: unknown) {
        setError(
          e instanceof TypeError
            ? "Couldn't reach the server. Check your internet and try again."
            : e instanceof Error
            ? e.message
            : "Couldn't analyze the quiz."
        );
      }
    });
  };

  const drill = (conceptFocus: string, drillSize: number) => {
    if (!topicId) return;
    setError(null);
    setDrilling(async () => {
      try {
        const res = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId,
            questionCount: Math.max(5, Math.min(25, drillSize)),
            conceptFocus,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Failed (${res.status})`);
        }
        const { quizId: newQuizId } = (await res.json()) as { quizId: string };
        router.push(`/quiz/${newQuizId}`);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Couldn't start the drill quiz."
        );
      }
    });
  };

  /* ---------- Empty state: not yet analyzed ---------- */
  if (!analysis && !pending) {
    const blocked = freeAnalysisUsed && !isPaid;
    return (
      <div className="rounded-3xl border-2 border-dashed border-ember-600/30 bg-cream-50 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Chick state="idle" size={96} />
          <h2 className="mt-3 font-serif text-2xl font-bold text-cocoa-900 sm:text-3xl">
            See exactly where you went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-cocoa-700">
            Deep analysis pinpoints the concept gap behind every wrong answer,
            shows you the right reasoning step-by-step, and recommends what to
            study next.
          </p>
          {!blocked ? (
            <button
              onClick={() => analyze(false)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-ember-600 px-6 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-ember-700"
            >
              <span>✨</span>
              <span>Analyze my quiz</span>
            </button>
          ) : (
            <div className="mt-5 flex flex-col items-center gap-3">
              <p className="rounded-xl bg-ember-600/10 px-4 py-2 text-xs font-semibold text-ember-700">
                You&apos;ve used your free analysis
              </p>
              <button
                onClick={() => analyze(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-3 text-sm font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.02]"
              >
                <span>👑</span>
                <span>Upgrade for unlimited Deep Dives</span>
              </button>
            </div>
          )}
          {!blocked && (
            <p className="mt-3 text-[11px] text-cocoa-500">
              {isPaid
                ? "Unlimited analyses on your plan."
                : "1 free deep analysis on the house."}
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-coral-500" role="alert">
              {error}
            </p>
          )}
        </div>

        <UpgradeModal
          open={!!paywall}
          onClose={() => setPaywall(null)}
          reason={paywall?.reason ?? "manual"}
          used={paywall?.used}
          limit={paywall?.limit}
        />
      </div>
    );
  }

  /* ---------- Loading ---------- */
  if (pending && !analysis) {
    return (
      <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-8 text-center shadow-warm-lg">
        <Chick state="idle" size={96} className="mx-auto" />
        <h2 className="mt-3 font-serif text-2xl font-bold text-cocoa-900">
          Reading your answers…
        </h2>
        <p className="mt-1 text-sm text-cocoa-700">
          Looking at every choice you made and why.
        </p>
        <div className="mx-auto mt-4 h-1.5 w-60 overflow-hidden rounded-full bg-cream-200">
          <div className="h-full w-1/3 animate-quiz-loader rounded-full bg-gradient-to-r from-sun-500 to-ember-600" />
        </div>
      </div>
    );
  }

  /* ---------- Rendered analysis ---------- */
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Verdict banner */}
      <div className="rounded-3xl border border-cocoa-900/[0.06] bg-gradient-to-br from-cream-50 to-cream-100 p-6 shadow-warm-lg">
        <div className="flex items-start gap-4">
          <Chick state="happy" size={64} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Deep Analysis {isDeepDive && <span className="text-ember-700">· Deep Dive 👑</span>}
            </p>
            <p className="mt-2 font-serif text-lg font-semibold leading-snug text-cocoa-900 sm:text-xl">
              {analysis.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      {analysis.strengths.length > 0 && (
        <section>
          <h3 className="mb-3 font-serif text-lg font-bold text-cocoa-900">
            What&apos;s working
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-moss-500/20 bg-moss-500/5 px-4 py-3"
              >
                <span className="text-moss-500" aria-hidden="true">✓</span>
                <div className="min-w-0">
                  <p className="font-semibold text-cocoa-900">{s.concept}</p>
                  <p className="mt-0.5 text-xs text-cocoa-500">{s.evidence}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {analysis.weaknesses.length > 0 && (
        <section>
          <h3 className="mb-3 font-serif text-lg font-bold text-cocoa-900">
            Where to focus
          </h3>
          <div className="space-y-4">
            {analysis.weaknesses.map((w, i) => (
              <WeaknessCard
                key={i}
                weakness={w}
                onDrill={() => drill(w.improve.practice.concept_focus, w.improve.practice.drill_size)}
                drilling={drilling}
                topicAvailable={!!topicId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Patterns */}
      {analysis.patterns.length > 0 && (
        <section className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
          <h3 className="font-serif text-lg font-bold text-cocoa-900">Patterns</h3>
          <ul className="mt-3 space-y-2">
            {analysis.patterns.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-cocoa-700">
                <span className="text-cocoa-500" aria-hidden="true">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pacing — only renders when time data was recorded */}
      {analysis.pacing && (
        <section className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-lg font-bold text-cocoa-900">
              ⏱ Pacing
            </h3>
            {typeof analysis.pacing.median_seconds_per_question === "number" && (
              <span
                className={[
                  "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                  analysis.pacing.over_budget
                    ? "bg-ember-500/15 text-ember-700"
                    : "bg-moss-500/15 text-moss-700",
                ].join(" ")}
              >
                {analysis.pacing.median_seconds_per_question}s typical
                {typeof analysis.pacing.exam_budget_seconds === "number" &&
                  ` · budget ${analysis.pacing.exam_budget_seconds}s`}
              </span>
            )}
          </div>

          {analysis.pacing.verdict && (
            <p className="mt-3 text-sm text-cocoa-900">
              {analysis.pacing.verdict}
            </p>
          )}

          {analysis.pacing.slow_questions &&
            analysis.pacing.slow_questions.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
                  Slow questions
                </p>
                <ul className="mt-2 space-y-1.5">
                  {analysis.pacing.slow_questions.map((s) => (
                    <li
                      key={`slow-${s.idx}`}
                      className="rounded-xl bg-ember-500/10 px-3 py-2 text-xs text-cocoa-900"
                    >
                      <span className="font-semibold">
                        Q{s.idx + 1} · {s.seconds}s
                      </span>{" "}
                      — {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {analysis.pacing.rushed_questions &&
            analysis.pacing.rushed_questions.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
                  Fast answers
                </p>
                <ul className="mt-2 space-y-1.5">
                  {analysis.pacing.rushed_questions.map((r) => (
                    <li
                      key={`rushed-${r.idx}`}
                      className={[
                        "rounded-xl px-3 py-2 text-xs text-cocoa-900",
                        r.verdict === "rushed-wrong"
                          ? "bg-ember-500/10"
                          : "bg-moss-500/10",
                      ].join(" ")}
                    >
                      <span className="font-semibold">
                        Q{r.idx + 1} · {r.seconds}s
                      </span>{" "}
                      — {r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {analysis.pacing.exam_pacing_projection && (
            <p className="mt-4 rounded-xl bg-cocoa-100 px-3 py-2 text-xs text-cocoa-700">
              <span className="font-semibold text-cocoa-900">
                On the real exam:
              </span>{" "}
              {analysis.pacing.exam_pacing_projection}
            </p>
          )}
        </section>
      )}

      {/* Study plan */}
      <section className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
        <h3 className="font-serif text-lg font-bold text-cocoa-900">Study next</h3>
        <ul className="mt-3 space-y-3">
          <PlanRow label="Next 15 min" value={analysis.studyPlan.next_15_min} />
          <PlanRow label="Next session" value={analysis.studyPlan.next_session} />
          <PlanRow label="This week" value={analysis.studyPlan.this_week} />
        </ul>
      </section>

      {/* Deep Dive upgrade button (if not already deep-dived) */}
      {!isDeepDive && (
        <div className="rounded-3xl border-2 border-dashed border-sun-500/40 bg-sun-500/5 p-5 text-center">
          <p className="font-semibold text-cocoa-900">
            Want exhaustive walkthroughs + a 7-day plan?
          </p>
          <button
            onClick={() => analyze(true)}
            disabled={pending}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-5 py-2.5 text-sm font-bold text-cocoa-900 shadow-warm transition hover:scale-[1.02] disabled:opacity-60"
          >
            <span>👑</span>
            <span>{pending ? "Diving deep…" : "Run Deep Dive"}</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-coral-500" role="alert">
          {error}
        </p>
      )}

      <UpgradeModal
        open={!!paywall}
        onClose={() => setPaywall(null)}
        reason={paywall?.reason ?? "manual"}
        used={paywall?.used}
        limit={paywall?.limit}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Weakness card — the three-rung ladder (READ / WORK / PRACTICE)     *
 * ------------------------------------------------------------------ */

function WeaknessCard({
  weakness,
  onDrill,
  drilling,
  topicAvailable,
}: {
  weakness: Weakness;
  onDrill: () => void;
  drilling: boolean;
  topicAvailable: boolean;
}) {
  const sevColor =
    weakness.severity === "high"
      ? "text-coral-500"
      : weakness.severity === "medium"
      ? "text-ember-600"
      : "text-sun-600";
  const sevDots = weakness.severity === "high" ? "●●●" : weakness.severity === "medium" ? "●●○" : "●○○";

  return (
    <article className="overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm">
      {/* Header */}
      <header className="flex items-start gap-3 border-b border-cocoa-900/[0.04] px-5 py-4">
        <span className={`mt-0.5 font-mono text-xs font-bold leading-none ${sevColor}`} aria-label={`severity ${weakness.severity}`}>
          {sevDots}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-bold text-cocoa-900">
            {weakness.concept}
          </p>
          <p className="mt-0.5 text-xs text-cocoa-500">{weakness.evidence}</p>
        </div>
      </header>

      {/* READ */}
      <Rung
        emoji="📖"
        label="Read"
        title={weakness.improve.read.source}
        body={weakness.improve.read.distill}
        meta={`~${weakness.improve.read.minutes} min`}
      />

      {/* WORK */}
      <Rung
        emoji="🧮"
        label="Work it through"
        title={`Walkthrough — Q${weakness.improve.work.questionIdx + 1}`}
        body={
          <div className="space-y-2">
            <ol className="ml-4 list-decimal space-y-1 text-sm text-cocoa-700 marker:text-cocoa-500">
              {weakness.improve.work.walkthrough_steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="rounded-xl bg-coral-500/10 px-3 py-2 text-sm font-medium text-cocoa-900">
              <span className="text-coral-500">✗ </span>
              {weakness.improve.work.your_mistake}
            </p>
            <p className="rounded-xl bg-moss-500/10 px-3 py-2 text-sm font-medium text-cocoa-900">
              <span className="text-moss-500">✓ </span>
              {weakness.improve.work.correct_answer}
            </p>
          </div>
        }
      />

      {/* PRACTICE */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none" aria-hidden="true">🎯</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Drill
            </p>
            <p className="mt-1 text-sm text-cocoa-700">
              A focused {weakness.improve.practice.drill_size}-question quiz on{" "}
              <span className="font-semibold text-cocoa-900">
                {weakness.improve.practice.concept_focus}
              </span>
              . Closes the loop.
            </p>
            {topicAvailable ? (
              <button
                onClick={onDrill}
                disabled={drilling}
                className="mt-3 inline-flex items-center justify-center rounded-2xl bg-ember-600 px-4 py-2 text-xs font-bold text-cream-50 shadow-warm transition hover:bg-ember-700 disabled:opacity-60"
              >
                {drilling ? "Building drill…" : "Drill this concept →"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function Rung({
  emoji,
  label,
  title,
  body,
  meta,
}: {
  emoji: string;
  label: string;
  title: string;
  body: React.ReactNode;
  meta?: string;
}) {
  return (
    <div className="border-b border-cocoa-900/[0.04] px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none" aria-hidden="true">{emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              {label}
            </p>
            {meta && <p className="text-[10px] text-cocoa-500">{meta}</p>}
          </div>
          <p className="mt-1 text-sm font-semibold text-cocoa-900">{title}</p>
          <div className="mt-2 text-sm text-cocoa-700">{body}</div>
        </div>
      </div>
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex shrink-0 rounded-md bg-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cocoa-700">
        {label}
      </span>
      <span className="text-sm text-cocoa-900">{value}</span>
    </li>
  );
}
