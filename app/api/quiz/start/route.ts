import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { FREE_LIMITS } from "@/lib/freemium";
import { isLiveExamSlug, type LiveExamSlug } from "@/lib/exam-catalog";
import {
  generateTopicQuizWithRecovery,
  type GeneratedTopicQuestion,
} from "@/lib/topic-quiz-recovery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Topic quizzes use the same resilient generation contract as full mocks.
// A provider retry or backup-model pass must have enough time to finish
// rather than being cut short into a generic student-facing server error.
export const maxDuration = 300;

type StartBody = {
  topicId: string;
  questionCount: number;
  /** Optional concept to drill — narrows the question generator. */
  conceptFocus?: string;
  /** Present only when a Deep Analysis launches a targeted repair round. */
  repair?: {
    sourceQuizId: string;
    concept: string;
    evidence: string;
    severity: "high" | "medium" | "low";
  };
};

const MIN_Q = 5;
const MAX_Q = 25;
const DATABASE_RETRY_DELAYS = [0, 500, 1_500];

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function createQuizWithRetry(
  admin: ReturnType<typeof createAdminSupabase>,
  input: {
    userId: string;
    subject: string;
    topic: string;
    subtopic: string;
    chapterId: string;
    topicId: string;
  }
) {
  const quizId = crypto.randomUUID();
  let lastError: unknown;

  for (const delay of DATABASE_RETRY_DELAYS) {
    if (delay) await pause(delay);
    const { data, error } = await admin
      .from("quizzes")
      .insert({ id: quizId, user_id: input.userId, subject: input.subject, topic: input.topic, subtopic: input.subtopic, chapter_id: input.chapterId, topic_id: input.topicId })
      .select("id")
      .maybeSingle();
    if (!error && data?.id) return data.id as string;

    if (error?.code === "23505") {
      const { data: existing } = await admin
        .from("quizzes")
        .select("id")
        .eq("id", quizId)
        .maybeSingle();
      if (existing?.id) return existing.id as string;
    }
    lastError = error;
  }

  throw lastError ?? new Error("Unable to create quiz.");
}

async function saveQuizQuestionsWithRetry(
  admin: ReturnType<typeof createAdminSupabase>,
  input: { quizId: string; questions: GeneratedTopicQuestion[] }
) {
  const rows = input.questions.map((question) => ({
    quiz_id: input.quizId,
    question_text: question.question,
    option_a: question.options.A,
    option_b: question.options.B,
    option_c: question.options.C,
    option_d: question.options.D,
    correct_answer: question.correct,
    explanation: typeof question.explanation === "string" ? question.explanation : null,
  }));
  let lastError: unknown;

  for (const delay of DATABASE_RETRY_DELAYS) {
    if (delay) await pause(delay);
    const { error } = await admin.from("questions").insert(rows);
    if (!error) return;

    if (error.code === "23505") {
      const { count, error: countError } = await admin
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("quiz_id", input.quizId);
      if (!countError && count === rows.length) return;
    }
    lastError = error;
  }

  throw lastError ?? new Error("Unable to save quiz questions.");
}

export async function POST(req: NextRequest) {
  // ---- 1. Auth ----
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // ---- 2. Validate body ----
  let body: StartBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { topicId, questionCount, conceptFocus, repair } = body;
  if (!topicId || typeof topicId !== "string") {
    return NextResponse.json({ error: "Missing topicId." }, { status: 400 });
  }
  if (
    !Number.isInteger(questionCount) ||
    questionCount < MIN_Q ||
    questionCount > MAX_Q
  ) {
    return NextResponse.json(
      { error: `questionCount must be between ${MIN_Q} and ${MAX_Q}.` },
      { status: 400 }
    );
  }
  if (conceptFocus !== undefined && (typeof conceptFocus !== "string" || conceptFocus.trim().length === 0 || conceptFocus.length > 120)) {
    return NextResponse.json({ error: "Invalid concept focus." }, { status: 400 });
  }
  if (repair) {
    const validRepair =
      typeof repair.sourceQuizId === "string" &&
      typeof repair.concept === "string" &&
      repair.concept.trim().length > 0 &&
      repair.concept.length <= 180 &&
      typeof repair.evidence === "string" &&
      repair.evidence.length <= 600 &&
      ["high", "medium", "low"].includes(repair.severity);
    if (!validRepair) {
      return NextResponse.json({ error: "Invalid repair context." }, { status: 400 });
    }
    const { data: sourceQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("id", repair.sourceQuizId)
      .maybeSingle();
    if (!sourceQuiz) {
      return NextResponse.json({ error: "Original quiz not found." }, { status: 404 });
    }
  }

  // ---- 3. Pull topic context (subject + chapter + topic name) ----
  const { data: topicRow, error: topicErr } = await supabase
    .from("topics")
    .select(
      "id, name, slug, chapter:chapters(id, name, ncert_class, subject:subjects(id, name, exam:exams(slug, name)))"
    )
    .eq("id", topicId)
    .maybeSingle();

  if (topicErr || !topicRow) {
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });
  }

  type TopicCtx = {
    id: string;
    name: string;
    chapter: {
      id: string;
      name: string;
      ncert_class: number | null;
      subject: {
        id: string;
        name: string;
        exam: { slug: string; name: string } | null;
      };
    };
  };
  const topic = topicRow as unknown as TopicCtx;
  const subjectName = topic.chapter.subject.name;
  const chapterName = topic.chapter.name;
  const topicName = topic.name;
  const examSlug = topic.chapter.subject.exam?.slug ?? "cuet";
  const examName = topic.chapter.subject.exam?.name ?? "CUET UG";
  if (!isLiveExamSlug(examSlug)) {
    return NextResponse.json({ error: "This exam is coming soon." }, { status: 404 });
  }
  const ncertClass = topic.chapter.ncert_class; // 11 / 12 for NEET UG, null otherwise

  // ---- 3b. Atomically reserve a free slot before AI generation ----
  // This is a database row lock, not a read-then-write counter. Parallel
  // requests can therefore never both see the same final free slot. Topic
  // validation above intentionally happens first, so malformed requests do
  // not burn an attempt.
  const admin = createAdminSupabase();
  const { data: slotRows, error: slotError } = await admin.rpc(
    "consume_quiz_slot",
    { p_user_id: user.id, p_limit: FREE_LIMITS.quiz },
  );
  const slot = Array.isArray(slotRows) ? slotRows[0] : slotRows;
  if (slotError || !slot) {
    console.error("[quiz/start] entitlement check failed", slotError);
    return NextResponse.json(
      {
        error: "We are checking your access and will retry automatically.",
        retryable: true,
      },
      { status: 503 },
    );
  }
  if (!slot.allowed) {
    return NextResponse.json(
      {
        error:
          "You've used your 3 free quizzes. Upgrade to keep practicing.",
        paywall: {
          reason: "quiz-limit",
          currentTier: "free",
          used: slot.used,
          limit: FREE_LIMITS.quiz,
        },
      },
      { status: 402 }
    );
  }

  // ---- 4. Generate questions with Claude ----
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[quiz/start] ANTHROPIC_API_KEY is not configured");
    return NextResponse.json(
      {
        error:
          "We are restoring question generation and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const normalizedFocus = conceptFocus?.trim();
  const focusLine = normalizedFocus
    ? `\n\nDRILL FOCUS — every question must test this specific concept: "${normalizedFocus}". Bias toward medium-hard difficulty so the student has to actually work through it.`
    : "";

  // Exam-specific framing. Each block tells Claude (a) who the aspirant is,
  // (b) what the canonical question style for that exam looks like, and
  // (c) any source-material constraints (NCERT, official syllabus, etc.).
  // Keep these tight — the LLM is good at calibrating difficulty when it
  // knows the exam, but only if we name the exam explicitly.
  // `satisfies` makes it impossible to mark a new catalog exam as live
  // without giving it an explicit question-generation brief. That is a
  // compile-time release blocker, not a convention someone can forget.
  const examFraming = {
    cuet: `Generate ${questionCount} CUET-style multiple-choice questions for an Indian undergraduate aspirant (class 12 pass / first-year college). Use NCERT Class 11–12 conventions. Stick to the NTA CUET UG difficulty band — slightly above board level, with one-step application as the modal difficulty.`,
    "ssc-cgl": `Generate ${questionCount} SSC CGL Tier-1/Tier-2 style multiple-choice questions for an Indian graduate aspirant preparing for central-government clerical/officer posts (CGL, CHSL, MTS). Match the SSC question style: numeric, time-bound, no fluff. For Quant target ~SSC CGL Tier-1 difficulty (≈ board-level arithmetic with one twist). For Reasoning use canonical SSC patterns. For English use 1980s–2010s SSC vocab register. For GA prefer static facts and high-yield current affairs.`,
    "neet-ug": `Generate ${questionCount} NEET UG style multiple-choice questions for an Indian medical undergraduate aspirant (class 12 / dropper). Source material is strictly NCERT Class ${ncertClass ?? "11–12"}. Match NTA NEET difficulty — concept-heavy, single-correct, plausible distractors drawn from sibling concepts. Use scientific notation and SI units. Biology questions should reflect NCERT line-by-line phrasing where possible. Physics and Chemistry should be application-level, not derivation-heavy.`,
    "delhi-police-constable": `Generate ${questionCount} original Delhi Police Constable objective-practice questions for an Indian aspirant. Match the supplied subject, chapter and topic exactly. Keep stems direct, short and accessible; use standard police-recruitment reasoning patterns, practical numerical ability, basic computer awareness, or carefully verified static General Knowledge as the topic requires. Do not invent a notification-specific marks split, cutoff, eligibility rule, or current-affairs fact.`,
    "uppsc-ro-aro": `Generate ${questionCount} original UPPSC RO/ARO foundation-practice questions for an Indian aspirant. Match the supplied subject, chapter and topic exactly. Use Hindi where the topic requires it; make General Studies UP-aware when relevant; and keep computer, office-skills and reasoning questions practical and objective. Do not invent notification-specific post eligibility, typing requirements, marks splits, cutoffs, or current-affairs claims.`,
    "up-secretariat-ro-aro": `Generate ${questionCount} original UP Secretariat RO/ARO foundation-practice questions for an Indian aspirant. Match the supplied subject, chapter and topic exactly. Use Hindi where the topic requires it; make General Studies UP-aware when relevant; and keep computer, office-skills and reasoning questions practical and objective. Do not invent notification-specific post eligibility, skill-test requirements, marks splits, cutoffs, or current-affairs claims.`,
    "uiic-ao": `Generate ${questionCount} original UIIC Administrative Officer (Generalist) Tier I practice questions for an Indian insurance-sector aspirant. Match the supplied subject, chapter and topic exactly. Use the objective style expected in English Language, Reasoning, Quantitative Aptitude, General Awareness or Computer Knowledge. Keep insurance and current-affairs questions factual and durable; never invent UIIC notification-specific vacancies, dates, eligibility rules, marks splits or cutoffs.`,
  } satisfies Record<LiveExamSlug, string>;

  // A live exam must never silently inherit CUET's question style. Failing
  // closed protects students from receiving plausibly-worded but irrelevant
  // practice whenever a new live exam is added without its own framing.
  const examIntro = examFraming[examSlug];
  if (!examIntro) {
    console.error("[quiz/start] missing exam-specific question framing", { examSlug });
    return NextResponse.json(
      { error: "Practice for this exam is being calibrated. Please try another topic shortly." },
      { status: 503 }
    );
  }

  const prompt = `${examIntro}

Exam: ${examName}
Subject: ${subjectName}
Chapter: ${chapterName}
Topic: ${topicName}${focusLine}

Rules:
- Each question must have exactly 4 options labelled A, B, C, D, with one correct answer.
- Mix difficulty: ~30% easy (recall), ~50% medium (one-step application), ~20% hard (multi-step reasoning).
- Stems under 60 words. Options under 20 words each.
- Distractors must be plausible — common student errors, sign flips, or conceptual confusions.
- No "All of the above" / "None of the above".
- Use Indian context (rupees, Indian names, Indian geography) where natural.
- Never include disclaimers, meta-commentary, or "as an AI" language.
- For every question, write a 1-2 sentence "explanation" that does TWO things:
  (a) states why the correct answer is correct, citing the concept/rule that makes it so;
  (b) names the most likely wrong choice and says exactly which misconception leads to it
      (e.g. "B is the common trap — students forget to convert minutes to seconds before plugging into v=u+at").
  Keep it concrete — no "this question tests your understanding of X" filler.

Return ONLY a valid JSON array with this exact shape — no prose, no markdown fences:

[
  {
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct": "B",
    "explanation": "..."
  }
]`;

  // The shared wrapper retries transient Anthropic/network failures. This
  // helper then switches models, retries a malformed batch, and refuses to
  // save a short quiz, so students receive a complete question set or an
  // automatic retry — never a raw infrastructure dead end.
  const generated = await generateTopicQuizWithRecovery(
    anthropic,
    prompt,
    questionCount
  );
  if (!generated.ok) {
    console.error("[quiz/start] complete topic-quiz generation failed", {
      examSlug,
      topicId,
      error: generated.error,
    });
    return NextResponse.json(
      {
        error:
          "We are still preparing a complete fresh quiz and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  // ---- 5. Insert quiz + question rows ----
  let quizId: string;
  try {
    quizId = await createQuizWithRetry(admin, {
      userId: user.id,
      subject: subjectName,
      topic: chapterName,
      subtopic: topicName,
      chapterId: topic.chapter.id,
      topicId: topic.id,
    });
  } catch (quizError) {
    console.error("[quiz/start] quiz insert failed:", quizError);
    return NextResponse.json(
      {
        error:
          "We are saving your complete quiz and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  try {
    await saveQuizQuestionsWithRetry(admin, {
      quizId,
      questions: generated.questions,
    });
  } catch (questionError) {
    console.error("[quiz/start] questions insert failed:", questionError);
    // Best-effort cleanup prevents a later request from ever opening an
    // empty quiz shell after a persistence interruption.
    await admin.from("quizzes").delete().eq("id", quizId);
    return NextResponse.json(
      {
        error:
          "We are saving your complete quiz and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  if (repair) {
    const { error: repairError } = await admin.from("repair_cycles").insert({
      user_id: user.id,
      source_quiz_id: repair.sourceQuizId,
      repair_quiz_id: quizId,
      concept: repair.concept.trim(),
      evidence: repair.evidence.trim(),
      severity: repair.severity,
    });
    if (repairError) {
      // Keep the generated quiz usable. This can only fail when the migration
      // is missing or the database is unavailable; it must never strand a student.
      console.error("[quiz/start] repair cycle insert failed:", repairError);
    }
  }

  return NextResponse.json({ quizId });
}
