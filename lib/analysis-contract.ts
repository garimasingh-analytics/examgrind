/**
 * Runtime contract for Deep Analysis responses.
 *
 * This intentionally lives outside the API routes: cached analyses are also
 * rendered directly by Server Components, so every entry point must receive a
 * complete UI-safe shape.  AI output is untrusted input, even when it is valid
 * JSON.
 */

export type AnalysisJson = {
  verdict: string;
  strengths: Array<{ concept: string; evidence: string }>;
  weaknesses: Array<{
    concept: string;
    severity: "high" | "medium" | "low";
    evidence: string;
    improve: {
      read: { source: string; minutes: number; distill: string };
      watch?: { query: string; channel_hint?: string; video_url?: string };
      work: {
        questionIdx: number;
        walkthrough_steps: string[];
        your_mistake: string;
        correct_answer: string;
      };
      practice: { concept_focus: string; drill_size: number };
    };
  }>;
  perQuestion: Array<{
    idx: number;
    verdict: "correct" | "wrong-conceptual" | "wrong-careless" | "wrong-partial" | "skipped";
    concept: string;
    explanation: string;
  }>;
  patterns: string[];
  pacing?: {
    median_seconds_per_question?: number;
    exam_budget_seconds?: number;
    over_budget?: boolean;
    slow_questions?: Array<{ idx: number; seconds: number; reason: string }>;
    rushed_questions?: Array<{
      idx: number;
      seconds: number;
      verdict: "fast-correct" | "rushed-wrong";
      reason: string;
    }>;
    verdict?: string;
    exam_pacing_projection?: string;
  };
  studyPlan: { next_15_min: string; next_session: string; this_week: string };
};

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value.trim() || fallback : fallback;
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const number = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/** Convert a model response or legacy cache into the only shape the UI renders. */
export function normalizeAnalysis(value: unknown): AnalysisJson {
  const raw = record(value);
  const weaknesses = list(raw.weaknesses).map((item) => {
    const weakness = record(item);
    const improve = record(weakness.improve);
    const read = record(improve.read);
    const watch = record(improve.watch);
    const work = record(improve.work);
    const practice = record(improve.practice);
    const severity = text(weakness.severity, "medium");
    return {
      concept: text(weakness.concept, "Concept to revisit"),
      severity: (severity === "high" || severity === "low" ? severity : "medium") as "high" | "medium" | "low",
      evidence: text(weakness.evidence, "Review the linked questions."),
      improve: {
        read: {
          source: text(read.source, "Review the relevant chapter notes"),
          minutes: Math.max(1, Math.min(60, Math.round(number(read.minutes, 10)))),
          distill: text(read.distill, "Revisit the core rule, then solve one example without notes."),
        },
        ...(text(watch.query)
          ? { watch: { query: text(watch.query), channel_hint: text(watch.channel_hint) || undefined } }
          : {}),
        work: {
          questionIdx: Math.max(0, Math.round(number(work.questionIdx, 0))),
          walkthrough_steps: list(work.walkthrough_steps).map((step) => text(step)).filter(Boolean).slice(0, 5),
          your_mistake: text(work.your_mistake, "Compare your choice with the worked solution."),
          correct_answer: text(work.correct_answer, "Use the answer key and explanation in the review below."),
        },
        practice: {
          concept_focus: text(practice.concept_focus, text(weakness.concept, "this concept")),
          drill_size: Math.max(3, Math.min(25, Math.round(number(practice.drill_size, 5)))),
        },
      },
    };
  });

  const pacingRaw = record(raw.pacing);
  const pacing = Object.keys(pacingRaw).length
    ? {
        median_seconds_per_question: number(pacingRaw.median_seconds_per_question, 0),
        exam_budget_seconds: number(pacingRaw.exam_budget_seconds, 0),
        over_budget: Boolean(pacingRaw.over_budget),
        slow_questions: list(pacingRaw.slow_questions).map((item) => {
          const row = record(item);
          return { idx: Math.max(0, Math.round(number(row.idx))), seconds: Math.max(0, Math.round(number(row.seconds))), reason: text(row.reason, "Review this question's solution.") };
        }),
        rushed_questions: list(pacingRaw.rushed_questions).map((item) => {
          const row = record(item);
          return { idx: Math.max(0, Math.round(number(row.idx))), seconds: Math.max(0, Math.round(number(row.seconds))), verdict: text(row.verdict) === "fast-correct" ? "fast-correct" as const : "rushed-wrong" as const, reason: text(row.reason, "Check whether speed caused an avoidable error.") };
        }),
        verdict: text(pacingRaw.verdict),
        exam_pacing_projection: text(pacingRaw.exam_pacing_projection),
      }
    : undefined;

  const plan = record(raw.studyPlan);
  return {
    verdict: text(raw.verdict, "Your results are ready. Focus on the most repeated mistakes first."),
    strengths: list(raw.strengths).map((item) => {
      const strength = record(item);
      return { concept: text(strength.concept, "A strong area"), evidence: text(strength.evidence, "Keep this approach consistent.") };
    }),
    weaknesses,
    // Per-question teaching is already persisted with every quiz/mock row.
    // Never depend on an LLM to generate 100–180 extra explanations.
    perQuestion: [],
    patterns: list(raw.patterns).map((item) => text(item)).filter(Boolean).slice(0, 4),
    ...(pacing ? { pacing } : {}),
    studyPlan: {
      next_15_min: text(plan.next_15_min, "Review one weak concept and solve two questions."),
      next_session: text(plan.next_session, "Take a focused practice drill."),
      this_week: text(plan.this_week, "Revisit your weakest section before the next test."),
    },
  };
}

/** JSON schema sent to Claude; it stops prose/fences and constrains the shape. */
export const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "strengths", "weaknesses", "patterns", "studyPlan"],
  properties: {
    verdict: { type: "string" },
    strengths: { type: "array", maxItems: 4, items: { type: "object", additionalProperties: false, required: ["concept", "evidence"], properties: { concept: { type: "string" }, evidence: { type: "string" } } } },
    weaknesses: { type: "array", maxItems: 5, items: { type: "object", additionalProperties: true } },
    patterns: { type: "array", maxItems: 4, items: { type: "string" } },
    pacing: { type: "object", additionalProperties: true },
    studyPlan: { type: "object", additionalProperties: false, required: ["next_15_min", "next_session", "this_week"], properties: { next_15_min: { type: "string" }, next_session: { type: "string" }, this_week: { type: "string" } } },
  },
} as const;
