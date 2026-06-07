import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateWithRetry } from "@/lib/anthropic-resilient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deep Analysis API.
 *
 * Reads the user's answers + the questions, asks Claude to produce a
 * structured diagnosis (READ / WORK / PRACTICE per weakness), persists it,
 * and returns it. Idempotent: a quiz that's already been analyzed serves
 * from cache without burning quota.
 *
 * Quota: every user gets ONE free deep analysis. After that, the response
 * is `402 Payment Required` with a paywall hint. The "Deep dive" upgrade
 * button (which uses Sonnet) is gated entirely behind the paid tier — for
 * now we surface the paywall and ask the client to handle the upgrade UX.
 */

type AnalyzeBody = { quizId: string; deepDive?: boolean };

type Letter = "A" | "B" | "C" | "D";
type QuestionRow = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: Letter;
  user_answer: Letter | null;
  time_taken: number | null;
};

const FREE_ANALYSES = 1;
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
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { quizId, deepDive = false } = body;
  if (!quizId || typeof quizId !== "string") {
    return NextResponse.json({ error: "Missing quizId." }, { status: 400 });
  }

  // ---- Quiz must exist, be the caller's, and be completed ----
  const { data: quizRow } = await supabase
    .from("quizzes")
    .select("id, user_id, subject, topic, subtopic, score, chapter_id, topic_id")
    .eq("id", quizId)
    .maybeSingle();
  if (!quizRow) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }
  if (quizRow.user_id !== user.id) {
    return NextResponse.json({ error: "Not your quiz." }, { status: 403 });
  }
  if (quizRow.score == null) {
    return NextResponse.json(
      { error: "Quiz hasn't been completed yet." },
      { status: 400 }
    );
  }

  // ---- Idempotency: serve cache if we've analyzed this quiz before ----
  const { data: existing } = await supabase
    .from("quiz_analyses")
    .select("analysis, model, is_deep_dive, generated_at")
    .eq("quiz_id", quizId)
    .maybeSingle();

  // If we already have a non-deep analysis and the user is asking for one
  // that isn't a deep-dive upgrade, just return it.
  if (existing && !deepDive) {
    return NextResponse.json({
      cached: true,
      analysis: existing.analysis,
      model: existing.model,
      is_deep_dive: existing.is_deep_dive,
    });
  }

  // ---- Free-tier quota check ----
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, analyses_taken")
    .eq("id", user.id)
    .maybeSingle<{
      subscription_status: "free" | "trial" | "paid";
      analyses_taken: number;
    }>();

  const isPaid = profile?.subscription_status === "paid";
  const used = profile?.analyses_taken ?? 0;

  // Deep dives (Sonnet) are paid-only.
  if (deepDive && !isPaid) {
    return NextResponse.json(
      {
        error: "Deep dive is a paid feature.",
        paywall: { reason: "deep-dive", currentTier: "free" },
      },
      { status: 402 }
    );
  }

  // Free tier: 1 analysis total. After that, paywall.
  if (!isPaid && used >= FREE_ANALYSES && !existing) {
    return NextResponse.json(
      {
        error:
          "You've used your free deep analysis. Upgrade to unlock unlimited analyses + Deep Dive.",
        paywall: { reason: "quota-exhausted", currentTier: "free", used, limit: FREE_ANALYSES },
      },
      { status: 402 }
    );
  }

  // ---- Pull questions for this quiz ----
  const { data: qData } = await supabase
    .from("questions")
    .select(
      "id, question_text, option_a, option_b, option_c, option_d, correct_answer, user_answer, time_taken"
    )
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true });
  const questions = (qData ?? []) as QuestionRow[];
  if (questions.length === 0) {
    return NextResponse.json(
      { error: "Quiz has no questions." },
      { status: 500 }
    );
  }

  // ---- Build prompt for Claude ----
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const subject = quizRow.subject;
  const chapter = quizRow.topic ?? "";
  const topic = quizRow.subtopic ?? "";

  // Resolve exam via topic_id → chapter → subject → exam join. Fall back to
  // 'cuet' for legacy quizzes from before migration_006 (when there was only
  // CUET and exam_id didn't exist).
  let examSlug = "cuet";
  let examName = "CUET UG";
  if (quizRow.topic_id) {
    const { data: examLookup } = await supabase
      .from("topics")
      .select(
        "chapter:chapters(subject:subjects(exam:exams(slug, name)))"
      )
      .eq("id", quizRow.topic_id)
      .maybeSingle();
    type ExamLookup = {
      chapter: {
        subject: { exam: { slug: string; name: string } | null } | null;
      } | null;
    };
    const exam = (examLookup as ExamLookup | null)?.chapter?.subject?.exam;
    if (exam) {
      examSlug = exam.slug;
      examName = exam.name;
    }
  }

  const questionsForPrompt = questions.map((q, idx) => ({
    idx,
    question: q.question_text,
    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    correct: q.correct_answer,
    user_answer: q.user_answer,
    time_seconds: q.time_taken,
  }));

  const prompt = buildAnalysisPrompt({
    examSlug,
    examName,
    subject,
    chapter,
    topic,
    questions: questionsForPrompt,
    deepDive,
  });

  // ---- Call Claude with resilient retry + classified errors ----
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = deepDive ? SONNET_MODEL : HAIKU_MODEL;

  const result = await generateWithRetry(anthropic, {
    model,
    max_tokens: deepDive ? 8000 : 4500,
    messages: [{ role: "user", content: prompt }],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.userMessage, kind: result.kind },
      { status: result.httpStatus }
    );
  }

  let analysis: unknown;
  try {
    const cleaned = result.text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
    analysis = JSON.parse(cleaned);
  } catch (e) {
    console.error("[quiz/analyze] parse failed:", e);
    return NextResponse.json(
      { error: "Couldn't generate the analysis. Please try again in a moment." },
      { status: 502 }
    );
  }

  // ---- Persist (upsert: deep-dive overwrites a prior haiku analysis) ----
  const { error: upsertErr } = await supabase.from("quiz_analyses").upsert(
    {
      quiz_id: quizId,
      user_id: user.id,
      analysis,
      model,
      is_deep_dive: deepDive,
    },
    { onConflict: "quiz_id" }
  );
  if (upsertErr) {
    console.error("[quiz/analyze] upsert failed:", upsertErr);
    return NextResponse.json(
      { error: "Couldn't save the analysis." },
      { status: 500 }
    );
  }

  // Increment quota only for the FIRST analysis of this quiz (not for
  // re-runs / deep-dive upgrades on a quiz that's already been analyzed).
  if (!existing) {
    await supabase
      .from("users")
      .update({ analyses_taken: used + 1 })
      .eq("id", user.id);
  }

  return NextResponse.json({
    cached: false,
    analysis,
    model,
    is_deep_dive: deepDive,
  });
}

/* ------------------------------------------------------------------ *
 * Prompt construction
 * ------------------------------------------------------------------ */

function buildAnalysisPrompt(input: {
  examSlug: string;
  examName: string;
  subject: string;
  chapter: string;
  topic: string;
  questions: Array<{
    idx: number;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correct: Letter;
    user_answer: Letter | null;
    time_seconds: number | null;
  }>;
  deepDive: boolean;
}) {
  const { examSlug, examName, subject, chapter, topic, questions, deepDive } =
    input;

  const depthHint = deepDive
    ? "DEEP DIVE — be exhaustive. Walk through every wrong question step-by-step. Identify second-order patterns. Suggest a 7-day plan."
    : "Be precise but concise. Pick the 2-3 most important weaknesses to highlight.";

  // Exam-specific coach persona. Mirrors the framing in quiz/start so the
  // diagnosis voice matches the test the student is studying for.
  const coachIntro: Record<string, string> = {
    cuet: `You are a CUET UG coach analyzing a student's quiz attempt for an Indian undergraduate aspirant. Reference NCERT Class 11/12 sections where possible.`,
    "ssc-cgl": `You are an SSC CGL coach analyzing a graduate aspirant's quiz attempt. Speak in the language of SSC prep — time pressure, modal shortcuts, common SSC traps. Reference standard SSC books (R.S. Aggarwal Quant, S.P. Bakshi English, Lucent GK) where helpful, not NCERT.`,
    "neet-ug": `You are a NEET UG coach analyzing an Indian medical aspirant's quiz attempt. Reference NCERT Class 11/12 line-by-line — NEET aspirants live in NCERT. For Biology, prefer NCERT vocabulary verbatim. For Physics/Chemistry, point to the exact NCERT section number.`,
  };

  const intro = coachIntro[examSlug] ?? coachIntro.cuet;

  return `${intro}

CONTEXT
Exam: ${examName}
Subject: ${subject}
Chapter: ${chapter}
Topic: ${topic}

ATTEMPT
${JSON.stringify(questions, null, 2)}

${depthHint}

TONE
Warm-coach but no-nonsense. Cut the fluff. Lead with the diagnosis. Use the student's own choice of wrong option as evidence ("you picked B, which assumes …"). For source citations, follow the exam-specific guidance in the opening line — don't push NCERT references on an SSC CGL student or push SSC books on a NEET aspirant.

PACING ANALYSIS — use the time_seconds field per question
- Compute the student's median seconds per question; flag any question that took more than 1.5× the median as a "slow" question, and explain *why* in terms of the concept they likely struggled with (not just "you spent X seconds").
- Flag questions answered in < 10 seconds as either "fast-correct" (good — they knew it) or "rushed-wrong" (bad — they didn't read carefully).
- Compare the student's median against the real exam's per-question budget (CUET ≈ 54s, SSC CGL ≈ 36s, NEET ≈ 60s). If they're over budget overall, say so concretely — "you'd run out of time on real NEET by Q120 at this pace".
- Tie pacing to a specific behavior change: "skip and come back" / "trust your first instinct" / "read the stem twice before working".
- If time_seconds is null for every question (older quiz before timing existed), skip pacing and don't fabricate numbers.

VERDICT TYPES (use exactly these strings)
- "correct"            — they got it right
- "wrong-conceptual"   — they don't understand the underlying concept
- "wrong-careless"     — they understand the concept but made a slip (units, sign, arithmetic)
- "wrong-partial"      — they got partway and stopped at the wrong step
- "skipped"            — they didn't answer

OUTPUT — return ONLY this JSON shape, no prose, no markdown fences:
{
  "verdict": "1-2 sentences. Lead with the diagnosis.",
  "strengths": [
    { "concept": "string", "evidence": "Q1, Q4 — both correct quickly" }
  ],
  "weaknesses": [
    {
      "concept": "string — be specific",
      "severity": "high" | "medium" | "low",
      "evidence": "Which questions and what they got wrong",
      "improve": {
        "read": {
          "source": "Exam-appropriate source — e.g. 'NCERT Class XX [Subject], Ch X, §X.X' for CUET/NEET, or 'R.S. Aggarwal Quant, Ch X' / 'Lucent GK, p. NNN' for SSC CGL",
          "minutes": 5,
          "distill": "1-2 sentence concept distillation in plain English"
        },
        "watch": {
          "query": "Exam-aware YouTube search query that will reliably surface a strong free explainer. Lead with a known Indian education channel name + the specific concept. For CUET/NEET prefer: 'Physics Wallah', 'Khan Academy Hindi', 'Unacademy NEET', 'NEETprep', 'Vedantu NEET'. For SSC CGL prefer: 'Adda247', 'Study IQ', 'BYJU's Exam Prep SSC', 'Mahendra Guru'. Example good queries: 'Physics Wallah laws of motion class 11 friction problems', 'Adda247 SSC CGL profit and loss tricks'. The query should be 6-12 words — specific enough that the first 1-3 results will be the right video.",
          "channel_hint": "Short channel name shown to the user — e.g. 'Physics Wallah' or 'Adda247'."
        },
        "work": {
          "questionIdx": 2,
          "walkthrough_steps": [
            "Step 1: ...",
            "Step 2: ...",
            "Step 3: ..."
          ],
          "your_mistake": "You picked B = ... — skipped the X step.",
          "correct_answer": "What the right answer is, with units"
        },
        "practice": {
          "concept_focus": "short string for the question generator",
          "drill_size": 5
        }
      }
    }
  ],
  "perQuestion": [
    {
      "idx": 0,
      "verdict": "correct" | "wrong-conceptual" | "wrong-careless" | "wrong-partial" | "skipped",
      "concept": "Specific concept tested",
      "explanation": "1 sentence — why right or why wrong, citing their actual choice"
    }
  ],
  "patterns": [
    "Up to 3 cross-question patterns about pacing, confusion, or skill gaps."
  ],
  "pacing": {
    "median_seconds_per_question": 42,
    "exam_budget_seconds": 54,
    "over_budget": false,
    "slow_questions": [
      {
        "idx": 2,
        "seconds": 95,
        "reason": "Concept-level hesitation: paused at the integration step. You were stuck on which substitution to use."
      }
    ],
    "rushed_questions": [
      {
        "idx": 5,
        "seconds": 7,
        "verdict": "rushed-wrong",
        "reason": "Picked B without checking units. Slow down to 20+s on stoichiometry."
      }
    ],
    "verdict": "Single-sentence pacing diagnosis tied to a behavior change.",
    "exam_pacing_projection": "On the real exam, at this pace you'd finish Q90 with 20 minutes left — comfortable. Push hardest concepts first."
  },
  "studyPlan": {
    "next_15_min": "Specific microaction.",
    "next_session": "Specific drill.",
    "this_week": "Specific milestone."
  }
}

RULES
- Every weakness MUST include all four rungs: read, watch, work, practice.
- "watch.query" must be a YouTube-style search query — no quotation marks around the whole thing, no URL. Always include a recognised Indian education channel name first (Physics Wallah / Khan Academy Hindi / Unacademy NEET / Adda247 / Study IQ etc.) so the first result is reliable.
- "work.questionIdx" must reference an actual wrong-conceptual question idx.
- If there are no wrong-conceptual questions, drop weaknesses to length 0.
- "practice.concept_focus" must be a concise phrase like "latent heat at phase change" — it'll be fed back into a drill question generator.
- "perQuestion" must include exactly one entry for every question, in idx order.
- No "Read NCERT" without a chapter number. No "Practice more" without specifying what.
- Currency in Indian rupees. Use NCERT Class 11/12 conventions.`;
}
