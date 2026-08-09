import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateWithRetry } from "@/lib/anthropic-resilient";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { FREE_LIMITS } from "@/lib/freemium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

type GeneratedQuestion = {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: "A" | "B" | "C" | "D";
  explanation?: string;
};

const MIN_Q = 5;
const MAX_Q = 25;
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
      { error: "Couldn't verify your plan. Please try again in a moment." },
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
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const focusLine = conceptFocus
    ? `\n\nDRILL FOCUS — every question must test this specific concept: "${conceptFocus}". Bias toward medium-hard difficulty so the student has to actually work through it.`
    : "";

  // Exam-specific framing. Each block tells Claude (a) who the aspirant is,
  // (b) what the canonical question style for that exam looks like, and
  // (c) any source-material constraints (NCERT, official syllabus, etc.).
  // Keep these tight — the LLM is good at calibrating difficulty when it
  // knows the exam, but only if we name the exam explicitly.
  const examFraming: Record<string, string> = {
    cuet: `Generate ${questionCount} CUET-style multiple-choice questions for an Indian undergraduate aspirant (class 12 pass / first-year college). Use NCERT Class 11–12 conventions. Stick to the NTA CUET UG difficulty band — slightly above board level, with one-step application as the modal difficulty.`,
    "ssc-cgl": `Generate ${questionCount} SSC CGL Tier-1/Tier-2 style multiple-choice questions for an Indian graduate aspirant preparing for central-government clerical/officer posts (CGL, CHSL, MTS). Match the SSC question style: numeric, time-bound, no fluff. For Quant target ~SSC CGL Tier-1 difficulty (≈ board-level arithmetic with one twist). For Reasoning use canonical SSC patterns. For English use 1980s–2010s SSC vocab register. For GA prefer static facts and high-yield current affairs.`,
    "neet-ug": `Generate ${questionCount} NEET UG style multiple-choice questions for an Indian medical undergraduate aspirant (class 12 / dropper). Source material is strictly NCERT Class ${ncertClass ?? "11–12"}. Match NTA NEET difficulty — concept-heavy, single-correct, plausible distractors drawn from sibling concepts. Use scientific notation and SI units. Biology questions should reflect NCERT line-by-line phrasing where possible. Physics and Chemistry should be application-level, not derivation-heavy.`,
  };

  const examIntro =
    examFraming[examSlug] ?? examFraming.cuet;

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

  // Resilient generation: 3 attempts with backoff, friendly per-kind
  // error messages, and an alert fired to ALERT_WEBHOOK_URL if our
  // Anthropic balance hits zero.
  const result = await generateWithRetry(anthropic, {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.userMessage, kind: result.kind },
      { status: result.httpStatus }
    );
  }

  let generated: GeneratedQuestion[];
  try {
    // Strip optional markdown fences just in case.
    const cleaned = result.text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    generated = JSON.parse(cleaned) as GeneratedQuestion[];
    if (!Array.isArray(generated) || generated.length === 0) {
      throw new Error("Claude returned no questions.");
    }
  } catch (e) {
    console.error("[quiz/start] parse failed:", e);
    return NextResponse.json(
      { error: "Couldn't generate questions. Please try again." },
      { status: 502 }
    );
  }

  // Trim to requested count if Claude over/under-shot, validate shape.
  const valid = generated
    .slice(0, questionCount)
    .filter(
      (q): q is GeneratedQuestion =>
        !!q &&
        typeof q.question === "string" &&
        !!q.options &&
        ["A", "B", "C", "D"].every(
          (k) => typeof q.options?.[k as "A"] === "string"
        ) &&
        ["A", "B", "C", "D"].includes(q.correct)
    );

  if (valid.length === 0) {
    return NextResponse.json(
      { error: "Generated questions failed validation. Please try again." },
      { status: 502 }
    );
  }

  // ---- 5. Insert quiz + question rows ----
  const { data: quizRow, error: quizErr } = await supabase
    .from("quizzes")
    .insert({
      user_id: user.id,
      subject: subjectName,
      topic: chapterName,
      subtopic: topicName,
      chapter_id: topic.chapter.id,
      topic_id: topic.id,
    })
    .select("id")
    .single();

  if (quizErr || !quizRow) {
    console.error("[quiz/start] quiz insert failed:", quizErr);
    return NextResponse.json(
      { error: "Couldn't save the quiz. Please try again." },
      { status: 500 }
    );
  }

  const questionRows = valid.map((q) => ({
    quiz_id: quizRow.id,
    question_text: q.question,
    option_a: q.options.A,
    option_b: q.options.B,
    option_c: q.options.C,
    option_d: q.options.D,
    correct_answer: q.correct,
    explanation: typeof q.explanation === "string" ? q.explanation : null,
  }));

  const { error: qErr } = await supabase.from("questions").insert(questionRows);
  if (qErr) {
    console.error("[quiz/start] questions insert failed:", qErr);
    // Best-effort cleanup of the quiz row to avoid orphans
    await supabase.from("quizzes").delete().eq("id", quizRow.id);
    return NextResponse.json(
      { error: "Couldn't save questions. Please try again." },
      { status: 500 }
    );
  }

  if (repair) {
    const { error: repairError } = await admin.from("repair_cycles").insert({
      user_id: user.id,
      source_quiz_id: repair.sourceQuizId,
      repair_quiz_id: quizRow.id,
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

  return NextResponse.json({ quizId: quizRow.id });
}
