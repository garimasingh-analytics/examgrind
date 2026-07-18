import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { generateWithRetry } from "@/lib/anthropic-resilient";
import { checkFreemium, paywallError } from "@/lib/freemium";
import { sendAdminSMS } from "@/lib/sms";
import { extractJSON } from "@/lib/json-extract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Mocks have MORE questions than chapter quizzes (NEET = 180, SSC = 100).
// Ceiling of 300s matches quiz/analyze — gives Anthropic retry backoffs room
// (5 attempts × up to 10s = 50s of retry budget) + Sonnet→Haiku fallback path.
// Regressed twice on quiz/analyze — protected by scripts/verify-critical-invariants.mjs.
// If you remove this line, the build FAILS at prebuild.
export const maxDuration = 300;

/**
 * POST /api/mock/analyze
 *
 * Mirrors /api/quiz/analyze for FULL-LENGTH MOCK TESTS. Pulls from
 * mock_attempt_questions instead of questions, threads section context
 * into the prompt, and persists to mock_analyses (parallel cache table).
 *
 * Reuses the freemium gate ("analysis" kind) — a free user's 1 analysis
 * is cumulative across quizzes AND mocks. A paid user gets unlimited.
 *
 * Same correctness defences from the 2026-06 chapter-quiz fix:
 *  1. The prompt is given the ground-truth correct count and forbidden
 *     from contradicting it in the prose verdict.
 *  2. After parsing, perQuestion verdicts are server-side overridden to
 *     match user_answer vs correct_answer — Claude doesn't get to
 *     regrade a wrong answer as "correct" however confident it is.
 */

type AnalyzeBody = { attemptId: string; deepDive?: boolean };

type Letter = "A" | "B" | "C" | "D";

type MockQuestionRow = {
  question_index: number;
  section_name: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: Letter;
  user_answer: Letter | null;
  time_spent_seconds: number | null;
};

type Verdict =
  | "correct"
  | "wrong-conceptual"
  | "wrong-careless"
  | "wrong-partial"
  | "skipped";

type PerQuestionResult = {
  idx: number;
  verdict: Verdict;
  concept?: string;
  explanation?: string;
};

type AnalysisShape = {
  perQuestion?: PerQuestionResult[];
  [key: string]: unknown;
};

const HAIKU_MODEL = "claude-haiku-4-5-20251001";
const SONNET_MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  // ---- Auth ----
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // ---- Body ----
  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { attemptId, deepDive = false } = body;
  if (!attemptId || typeof attemptId !== "string") {
    return NextResponse.json({ error: "Missing attemptId." }, { status: 400 });
  }

  // ---- Attempt must exist, be the caller's, be submitted ----
  const { data: attempt } = await supabase
    .from("mock_attempts")
    .select(
      "id, user_id, mock_test_id, status, score, total_correct, total_wrong"
    )
    .eq("id", attemptId)
    .maybeSingle();
  if (!attempt) {
    return NextResponse.json(
      { error: "Mock attempt not found." },
      { status: 404 }
    );
  }
  if (attempt.user_id !== user.id) {
    return NextResponse.json(
      { error: "Not your attempt." },
      { status: 403 }
    );
  }
  if (attempt.status !== "submitted") {
    return NextResponse.json(
      { error: "Mock test isn't completed yet." },
      { status: 400 }
    );
  }

  const admin = createAdminSupabase();

  // ---- Idempotency: cache hit ----
  // We read through the admin client because mock_analyses RLS is owner-
  // select; the admin client bypasses RLS and we already auth-checked.
  const { data: existing } = await admin
    .from("mock_analyses")
    .select("analysis, model, is_deep_dive, generated_at")
    .eq("mock_attempt_id", attemptId)
    .maybeSingle();

  if (existing && !deepDive) {
    // Same trust-but-verify pass as the chapter-quiz path — defends
    // against cached analyses that were saved before any future
    // verdict-rule change.
    const fixed = await reconcileCachedAnalysis(
      admin,
      existing.analysis as AnalysisShape,
      attemptId
    );
    return NextResponse.json({
      cached: true,
      analysis: fixed,
      model: existing.model,
      is_deep_dive: existing.is_deep_dive,
    });
  }

  // ---- Freemium gate (shared "analysis" gate with chapter quizzes) ----
  const decision = await checkFreemium(supabase, user.id, "analysis");

  // Deep dives (Sonnet) are paid-only regardless of free quota left.
  if (deepDive && !decision.isPaid) {
    return NextResponse.json(
      {
        error: "Deep dive is a paid feature.",
        paywall: { reason: "deep-dive", currentTier: "free" },
      },
      { status: 402 }
    );
  }

  if (!decision.allowed && !existing) {
    return NextResponse.json(paywallError(decision), { status: 402 });
  }

  // ---- Pull questions ----
  const { data: qData } = await admin
    .from("mock_attempt_questions")
    .select(
      "question_index, section_name, question_text, option_a, option_b, option_c, option_d, correct_answer, user_answer, time_spent_seconds"
    )
    .eq("attempt_id", attemptId)
    .order("question_index", { ascending: true });

  const questions = (qData ?? []) as MockQuestionRow[];
  if (questions.length === 0) {
    return NextResponse.json(
      { error: "Mock attempt has no questions." },
      { status: 500 }
    );
  }

  // ---- Resolve mock + exam metadata ----
  const { data: mock } = await admin
    .from("mock_tests")
    .select("display_name, exam_id, exam:exams(slug, name)")
    .eq("id", attempt.mock_test_id)
    .maybeSingle();
  type MockLookup = {
    display_name: string;
    exam: { slug: string; name: string } | null;
  };
  const m = mock as MockLookup | null;
  const examSlug = m?.exam?.slug ?? "cuet";
  const examName = m?.exam?.name ?? "CUET UG";
  const mockName = m?.display_name ?? "Mock test";

  // ---- Build prompt ----
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const actualCorrectCount = questions.filter(
    (q) => q.user_answer != null && q.user_answer === q.correct_answer
  ).length;
  const totalCount = questions.length;

  // Strip huge text from the prompt — for 180 NEET questions we'd blow
  // through context. Truncate any single question_text past 400 chars
  // (chemistry/biology stems can sprawl). Keep options shorter still.
  const trimmed = questions.map((q) => ({
    idx: q.question_index,
    section: q.section_name,
    question: shorten(q.question_text, 400),
    options: {
      A: shorten(q.option_a, 160),
      B: shorten(q.option_b, 160),
      C: shorten(q.option_c, 160),
      D: shorten(q.option_d, 160),
    },
    correct: q.correct_answer,
    user_answer: q.user_answer,
    time_seconds: q.time_spent_seconds,
  }));

  const prompt = buildMockPrompt({
    examSlug,
    examName,
    mockName,
    questions: trimmed,
    deepDive,
    actualCorrectCount,
    totalCount,
  });

  // ---- Call Claude with retry + Sonnet→Haiku fallback + SMS alerts ----
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const requestedModel = deepDive ? SONNET_MODEL : HAIKU_MODEL;
  let actualModel = requestedModel;

  console.log(
    `[mock/analyze] START user=${user.id.slice(0, 8)} attempt=${attemptId.slice(0, 8)} deepDive=${deepDive} model=${requestedModel}`
  );
  const t0 = Date.now();

  // Mock analyses have MORE questions (100-180) so JSON is larger.
  // Bumped 2026-07-18 in solidarity with quiz/analyze — mocks were even
  // closer to the truncation edge.
  let result = await generateWithRetry(anthropic, {
    model: requestedModel,
    max_tokens: deepDive ? 16000 : 10000,
    messages: [{ role: "user", content: prompt }],
  });

  // FALLBACK: Sonnet died → Haiku so user gets something back.
  if (!result.ok && deepDive && result.kind !== "auth" && result.kind !== "invalid_request") {
    console.warn(
      `[mock/analyze] Sonnet failed (${result.kind}) — falling back to Haiku for user=${user.id.slice(0, 8)}`
    );
    result = await generateWithRetry(anthropic, {
      model: HAIKU_MODEL,
      max_tokens: 10000,
      messages: [{ role: "user", content: prompt }],
    });
    if (result.ok) {
      actualModel = HAIKU_MODEL;
    }
  }

  if (!result.ok) {
    // SMS alert for paid-user failures (they're the USP audience).
    if (decision.isPaid) {
      void sendAdminSMS(
        `ExamGrind ALERT: Mock Deep Analysis FAILED for paid user ${user.email ?? user.id.slice(0, 8)} (${result.kind})`
      );
    }
    console.error(
      `[mock/analyze] FAILED user=${user.id.slice(0, 8)} model=${requestedModel} kind=${result.kind} elapsed=${Date.now() - t0}ms`
    );
    return NextResponse.json(
      { error: result.userMessage, kind: result.kind },
      { status: result.httpStatus }
    );
  }
  console.log(
    `[mock/analyze] Claude OK user=${user.id.slice(0, 8)} model=${actualModel} elapsed=${Date.now() - t0}ms tokens=${result.text.length}`
  );

  // Tolerant JSON extraction — see lib/json-extract.ts.
  // Handles the 2026-07-18 "Unterminated string in JSON" incident.
  const extracted = extractJSON<AnalysisShape>(result.text);
  if (!extracted.ok) {
    console.error(
      `[mock/analyze] parse failed after all salvage attempts: ${extracted.error} — snippet: ${extracted.snippet}`
    );
    if (decision.isPaid) {
      void sendAdminSMS(
        `ExamGrind ALERT: Mock DA parse failed for paid user ${user.email ?? user.id.slice(0, 8)} — Claude returned malformed JSON`
      );
    }
    return NextResponse.json(
      { error: "Couldn't generate the analysis. Please try again in a moment." },
      { status: 502 }
    );
  }
  const analysis: AnalysisShape = extracted.value;
  if (extracted.strategy !== "clean") {
    console.warn(
      `[mock/analyze] JSON extracted via strategy=${extracted.strategy} user=${user.id.slice(0, 8)} — Claude's output needed salvage but we recovered`
    );
  }

  // ---- Server-side verdict correction (defence in depth) ----
  if (Array.isArray(analysis?.perQuestion)) {
    // Index by question_index for O(1) lookup; mock questions are
    // not necessarily 0..N-1, they could have gaps if the schema
    // ever evolves.
    const byIdx = new Map<number, MockQuestionRow>();
    for (const q of questions) byIdx.set(q.question_index, q);

    analysis.perQuestion = analysis.perQuestion.map((pq) => {
      const q = byIdx.get(pq.idx);
      if (!q) return pq;
      const truthVerdict: Verdict =
        q.user_answer == null
          ? "skipped"
          : q.user_answer === q.correct_answer
          ? "correct"
          : pq.verdict === "wrong-careless" ||
            pq.verdict === "wrong-conceptual" ||
            pq.verdict === "wrong-partial"
          ? pq.verdict
          : "wrong-conceptual";
      return { ...pq, verdict: truthVerdict };
    });
  }

  // ---- Persist ----
  // actualModel reflects what actually served — may be Haiku even if user asked Sonnet.
  const isDeepDiveActual = deepDive && actualModel === SONNET_MODEL;
  const { error: upsertErr } = await admin.from("mock_analyses").upsert(
    {
      mock_attempt_id: attemptId,
      user_id: user.id,
      analysis,
      model: actualModel,
      is_deep_dive: isDeepDiveActual,
    },
    { onConflict: "mock_attempt_id" }
  );
  if (upsertErr) {
    console.error("[mock/analyze] upsert failed:", upsertErr);
    return NextResponse.json(
      { error: "Couldn't save the analysis." },
      { status: 500 }
    );
  }

  // Increment quota only on first analysis for this attempt.
  // We share the analyses_started counter with chapter quizzes —
  // a free user's 1 analysis is cumulative across the app.
  if (!existing) {
    await admin
      .from("users")
      .update({ analyses_started: decision.used + 1 })
      .eq("id", user.id);
  }

  return NextResponse.json({
    cached: false,
    analysis,
    model: actualModel,
    is_deep_dive: isDeepDiveActual,
    // If Sonnet degraded to Haiku, tell client so it can offer a retry.
    degraded: deepDive && !isDeepDiveActual,
  });
}

/* ------------------------------------------------------------------ *
 * Cache reconciliation — same role as in /api/quiz/analyze; lifted
 * for symmetry. Keeps wrong perQuestion verdicts from persisting.
 * ------------------------------------------------------------------ */
async function reconcileCachedAnalysis(
  admin: ReturnType<typeof createAdminSupabase>,
  cached: AnalysisShape,
  attemptId: string
): Promise<AnalysisShape> {
  if (!Array.isArray(cached?.perQuestion)) return cached;
  const { data } = await admin
    .from("mock_attempt_questions")
    .select("question_index, user_answer, correct_answer")
    .eq("attempt_id", attemptId);
  const byIdx = new Map<number, { user_answer: Letter | null; correct_answer: Letter }>();
  for (const r of (data ?? []) as Array<{
    question_index: number;
    user_answer: Letter | null;
    correct_answer: Letter;
  }>) {
    byIdx.set(r.question_index, {
      user_answer: r.user_answer,
      correct_answer: r.correct_answer,
    });
  }
  if (byIdx.size === 0) return cached;
  return {
    ...cached,
    perQuestion: cached.perQuestion.map((pq) => {
      const q = byIdx.get(pq.idx);
      if (!q) return pq;
      const truthVerdict: Verdict =
        q.user_answer == null
          ? "skipped"
          : q.user_answer === q.correct_answer
          ? "correct"
          : pq.verdict === "wrong-careless" ||
            pq.verdict === "wrong-conceptual" ||
            pq.verdict === "wrong-partial"
          ? pq.verdict
          : "wrong-conceptual";
      return { ...pq, verdict: truthVerdict };
    }),
  };
}

function shorten(s: string | null | undefined, max: number): string {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

/* ------------------------------------------------------------------ *
 * Prompt construction
 * ------------------------------------------------------------------ */

function buildMockPrompt(input: {
  examSlug: string;
  examName: string;
  mockName: string;
  questions: Array<{
    idx: number;
    section: string;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correct: Letter;
    user_answer: Letter | null;
    time_seconds: number | null;
  }>;
  deepDive: boolean;
  actualCorrectCount: number;
  totalCount: number;
}) {
  const {
    examSlug,
    examName,
    mockName,
    questions,
    deepDive,
    actualCorrectCount,
    totalCount,
  } = input;

  const depthHint = deepDive
    ? "DEEP DIVE — be exhaustive. Walk through every wrong question step-by-step. Identify second-order patterns. Suggest a 14-day plan for the next mock."
    : "Be precise but concise. Pick the 3-5 most important weaknesses across all sections.";

  const coachIntro: Record<string, string> = {
    cuet: `You are a CUET UG coach analyzing a full-length mock attempt by an Indian undergraduate aspirant. Reference NCERT Class 11/12 sections where possible.`,
    "ssc-cgl": `You are an SSC CGL coach analyzing a full-length mock attempt by a graduate aspirant. Speak in SSC prep language: time pressure, modal shortcuts, common SSC traps. Reference R.S. Aggarwal Quant, S.P. Bakshi English, Lucent GK where helpful — not NCERT.`,
    "neet-ug": `You are a NEET UG coach analyzing a full-length mock attempt by an Indian medical aspirant. Reference NCERT Class 11/12 line-by-line. For Biology, prefer NCERT vocabulary verbatim. For Physics/Chemistry, point to the exact NCERT section number.`,
  };

  const intro = coachIntro[examSlug] ?? coachIntro.cuet;

  return `${intro}

CONTEXT
Exam: ${examName}
Mock: ${mockName}
Total questions: ${totalCount} across ${
    new Set(questions.map((q) => q.section)).size
  } section(s)

SCORE (ground truth — do NOT recompute or contradict)
The student got ${actualCorrectCount} / ${totalCount} correct.
Your verdict prose MUST cite this exact score if it mentions a score at all.
Your perQuestion array MUST contain exactly ${actualCorrectCount} entries with verdict="correct".

ATTEMPT (each question has a "section" field — use it for section-level weakness diagnosis)
${JSON.stringify(questions, null, 2)}

${depthHint}

TONE
Warm-coach but no-nonsense. Lead with the diagnosis. Reference the student's actual wrong choice as evidence ("you picked B in Physics Q12, which assumes …"). Group weaknesses by section where it helps clarity.

PACING ANALYSIS — use the time_seconds field per question
- Compute the student's median seconds per question (overall and per section). Flag the slowest 3 questions: explain WHY they took long (concept hesitation? careless re-reading?), not just the seconds.
- Flag questions answered < 10s as fast-correct (good) or rushed-wrong (bad — drop on stoichiometry, signs, NEGATIVE marking).
- Compare median to real exam per-question budget: NEET 60s, SSC CGL 36s, CUET 54s. If overall is over budget, say "at this pace you'd finish Q[N] with [M] minutes left" concretely.
- Tie pacing to a specific behaviour change.

VERDICT TYPES
- "correct" / "wrong-conceptual" / "wrong-careless" / "wrong-partial" / "skipped"

VERDICT RULE — HARD, NO EXCEPTIONS
- verdict is string comparison of user_answer vs correct, nothing more.
- If user_answer is null → verdict MUST be "skipped".
- If user_answer === correct → verdict MUST be "correct".
- Otherwise → one of wrong-conceptual / wrong-careless / wrong-partial.
- DO NOT regrade. Treat correct as ground truth. Count of verdict="correct" MUST equal ${actualCorrectCount}.

OUTPUT — return ONLY this JSON shape, no prose, no markdown fences:
{
  "verdict": "1-2 sentences. Lead with the diagnosis at the exam-level. Cite the section that's strongest and the one that's weakest.",
  "strengths": [
    { "concept": "string — section + concept", "evidence": "Section + question idx + speed" }
  ],
  "weaknesses": [
    {
      "concept": "Section · concept — be specific",
      "severity": "high" | "medium" | "low",
      "evidence": "Section + which questions + what they got wrong",
      "improve": {
        "read": {
          "source": "Exam-appropriate source citation (NCERT Class XX or R.S. Aggarwal Ch X or Lucent p. NNN)",
          "minutes": 8,
          "distill": "1-2 sentence concept distillation"
        },
        "watch": {
          "query": "YouTube search query led by a known Indian education channel (Physics Wallah / Khan Academy Hindi / Unacademy NEET / Adda247 / Study IQ) + the concept. 6-12 words.",
          "channel_hint": "Short channel name shown to the user"
        },
        "work": {
          "questionIdx": 12,
          "walkthrough_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
          "your_mistake": "You picked B in [Section] Q[N] = ... — skipped the X step.",
          "correct_answer": "Right answer with units / reasoning"
        },
        "practice": {
          "concept_focus": "concise phrase for the drill generator",
          "drill_size": 5
        }
      }
    }
  ],
  "perQuestion": [
    {
      "idx": 0,
      "verdict": "correct" | "wrong-conceptual" | "wrong-careless" | "wrong-partial" | "skipped",
      "concept": "Section + concept tested",
      "explanation": "1 sentence — why right or why wrong, citing the actual choice"
    }
  ],
  "patterns": [
    "Up to 4 cross-question patterns about pacing, sectional gaps, careless trends, exam-strategy issues."
  ],
  "pacing": {
    "median_seconds_per_question": 38,
    "exam_budget_seconds": 60,
    "over_budget": false,
    "slow_questions": [{"idx": 12, "seconds": 95, "reason": "..."}],
    "rushed_questions": [{"idx": 7, "seconds": 6, "verdict": "rushed-wrong", "reason": "..."}],
    "verdict": "Single-sentence pacing diagnosis.",
    "exam_pacing_projection": "At this pace, on the real ${examName} you'd finish Q[N] with [M] minutes left."
  },
  "studyPlan": {
    "next_15_min": "Specific microaction tied to the weakest section.",
    "next_session": "Specific drill or read.",
    "this_week": "A milestone before the next mock."
  }
}

RULES
- Every weakness MUST include all four rungs: read, watch, work, practice.
- "watch.query" must be a YouTube search query (no quotes, no URL) leading with a recognised Indian channel name.
- "work.questionIdx" must reference an actual wrong-conceptual question idx.
- "perQuestion" must include exactly one entry per question, in idx order.
- No "Read NCERT" without a chapter number. No "Practice more" without specifying what.
- Currency in Indian rupees.`;
}
