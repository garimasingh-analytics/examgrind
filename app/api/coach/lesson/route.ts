import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { generateWithRetry } from "@/lib/anthropic-resilient";
import { DAILY_COACH_LESSON_LIMIT, consumeCoachLessonSlot } from "@/lib/ai-rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import { findCoachVisualAsset } from "@/lib/coach-visual-assets";
import { findReusableCommonsVisual } from "@/lib/coach-visual-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type LessonRequest = { topicId?: unknown; directTopic?: unknown };
type LessonStep = { title: string; explanation: string; example: string; visualLabel: string };
type LessonVisual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type IllustrationKind = "biology-process" | "biology-taxonomy" | "chemistry-bond" | "quant-model" | "physics-vector" | "reasoning-tree" | "generic";
type LessonIllustration = { kind: IllustrationKind; title: string; labels: string[] };
type CoachLesson = {
  opening: string;
  lessonCardCount: 4 | 6 | 8 | 10;
  steps: LessonStep[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: LessonVisual;
  illustration?: LessonIllustration;
};

function text(value: unknown, max: number) {
  // Coach content is rendered as plain text. Do not let Markdown emphasis leak
  // into the learning canvas as visible asterisks.
  return typeof value === "string" ? value.replace(/\*\*/g, "").trim().slice(0, max) : "";
}

function normalizeCoachLesson(value: unknown): CoachLesson | null {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : null;
  if (!raw) return null;
  const rawCheckpoint = raw.checkpoint && typeof raw.checkpoint === "object" ? raw.checkpoint as Record<string, unknown> : null;
  const steps = Array.isArray(raw.steps) ? raw.steps.slice(0, 10).flatMap((item) => {
    const step = item && typeof item === "object" ? item as Record<string, unknown> : null;
    if (!step) return [];
    const title = text(step.title, 110);
    const explanation = text(step.explanation, 1400);
    const visualLabel = text(step.visualLabel, 90);
    const example = text(step.example, 620);
    return title && explanation && example && visualLabel ? [{ title, explanation, example, visualLabel }] : [];
  }) : [];
  const options = Array.isArray(rawCheckpoint?.options)
    ? rawCheckpoint.options.map((option) => text(option, 220)).filter(Boolean).slice(0, 4)
    : [];
  const correctIndex = typeof rawCheckpoint?.correctIndex === "number"
    ? Math.trunc(rawCheckpoint.correctIndex)
    : Number.parseInt(String(rawCheckpoint?.correctIndex ?? ""), 10);
  const lesson: CoachLesson = {
    opening: text(raw.opening, 900),
    lessonCardCount: raw.lessonCardCount === 4 || raw.lessonCardCount === 6 || raw.lessonCardCount === 8 || raw.lessonCardCount === 10
      ? raw.lessonCardCount
      : 6,
    steps,
    commonTrap: text(raw.commonTrap, 600),
    memoryAnchor: text(raw.memoryAnchor, 400),
    checkpoint: {
      question: text(rawCheckpoint?.question, 500),
      options,
      correctIndex,
      explanation: text(rawCheckpoint?.explanation, 700),
    },
    visual: normalizeVisual(raw.visual),
    illustration: normalizeIllustration(raw.illustration),
  };
  return isCoachLesson(lesson) ? lesson : null;
}

function normalizeIllustration(value: unknown): LessonIllustration | undefined {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : null;
  if (!raw) return undefined;
  const accepted: IllustrationKind[] = ["biology-process", "biology-taxonomy", "chemistry-bond", "quant-model", "physics-vector", "reasoning-tree", "generic"];
  const kind = accepted.includes(raw.kind as IllustrationKind) ? raw.kind as IllustrationKind : "generic";
  const title = text(raw.title, 110);
  const labels = Array.isArray(raw.labels) ? raw.labels.map((label) => text(label, 70)).filter(Boolean).slice(0, 4) : [];
  return title && labels.length >= 2 ? { kind, title, labels } : undefined;
}

function normalizeVisual(value: unknown): LessonVisual | undefined {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : null;
  if (!raw) return undefined;
  const kind = raw.kind === "formula" || raw.kind === "comparison" || raw.kind === "cycle" ? raw.kind : "flow";
  const nodes = Array.isArray(raw.nodes) ? raw.nodes.map((node) => text(node, 100)).filter(Boolean).slice(0, 4) : [];
  const caption = text(raw.caption, 180);
  return caption && nodes.length >= 2 ? { kind, caption, nodes } : undefined;
}

function extractJson(text: string): unknown {
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? clean.slice(start, end + 1) : clean);
}

function isShortText(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isCoachLesson(value: unknown): value is CoachLesson {
  if (!value || typeof value !== "object") return false;
  const lesson = value as Partial<CoachLesson>;
  return Boolean(
    isShortText(lesson.opening, 900) && typeof lesson.opening === "string" && lesson.opening.length >= 120 &&
    (lesson.lessonCardCount === 4 || lesson.lessonCardCount === 6 || lesson.lessonCardCount === 8 || lesson.lessonCardCount === 10) &&
    Array.isArray(lesson.steps) && lesson.steps.length === lesson.lessonCardCount &&
    lesson.steps.every((step) => step && isShortText(step.title, 110) && isShortText(step.explanation, 1400) && typeof step.explanation === "string" && step.explanation.length >= 280 && isShortText(step.example, 620) && typeof step.example === "string" && step.example.length >= 80 && isShortText(step.visualLabel, 90)) &&
    isShortText(lesson.commonTrap, 600) &&
    isShortText(lesson.memoryAnchor, 400) &&
    lesson.checkpoint && isShortText(lesson.checkpoint.question, 500) &&
    Array.isArray(lesson.checkpoint.options) && lesson.checkpoint.options.length === 4 &&
    lesson.checkpoint.options.every((option) => isShortText(option, 220)) &&
    Number.isInteger(lesson.checkpoint.correctIndex) && lesson.checkpoint.correctIndex! >= 0 && lesson.checkpoint.correctIndex! <= 3 &&
    isShortText(lesson.checkpoint.explanation, 700),
  );
}

type TopicRecord = {
  id: string;
  name: string;
  description: string | null;
  chapter: { id: string; name: string; subject: { id: string; name: string; exam: { id: string; slug: string; name: string } | null } | null } | null;
};
type ExamRecord = { id: string; slug: string; name: string };

function words(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((word) => word.length > 1);
}

function conceptMatchScore(query: string, topic: TopicRecord) {
  const needle = query.toLowerCase().trim();
  const name = topic.name.toLowerCase();
  if (name === needle) return 1000;
  if (name.includes(needle) || needle.includes(name)) return 700;
  const queryWords = words(query);
  const topicWords = new Set([...words(topic.name), ...words(topic.description ?? ""), ...words(topic.chapter?.name ?? ""), ...words(topic.chapter?.subject?.name ?? "")]);
  const overlaps = queryWords.filter((word) => topicWords.has(word)).length;
  return overlaps * 100 - Math.abs(queryWords.length - topicWords.size);
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to learn with Coach." }, { status: 401 });

  let body: LessonRequest;
  try { body = await request.json() as LessonRequest; } catch { return NextResponse.json({ error: "Invalid lesson request." }, { status: 400 }); }
  const topicId = typeof body.topicId === "string" ? body.topicId.trim() : "";
  const directTopic = typeof body.directTopic === "string" ? body.directTopic.trim().slice(0, 120) : "";
  if (!topicId && !directTopic) return NextResponse.json({ error: "Choose a syllabus topic or type one concept." }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "Coach is temporarily unavailable." }, { status: 503 });

  const admin = createAdminSupabase();
  const { data: profile } = await admin
    .from("users")
    .select("exam_choice, subscription_status, paid_until")
    .eq("id", user.id)
    .maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid"; paid_until: string | null }>();
  const status = await ensureSubscriptionFreshness(user.id, profile?.subscription_status ?? "free", profile?.paid_until ?? null);
  const founderPreview = isAdminEmail(user.email);
  if (status !== "paid" && !founderPreview) {
    return NextResponse.json({ error: "Coach is available with an active Coach plan." }, { status: 402 });
  }

  let rawTopic: unknown = null;
  if (topicId) {
    const { data } = await admin
      .from("topics")
      .select("id, name, description, chapter:chapters(id, name, subject:subjects(id, name, exam:exams(id, slug, name)))")
      .eq("id", topicId)
      .maybeSingle();
    rawTopic = data;
  } else {
    const { data } = await admin
      .from("topics")
      .select("id, name, description, chapter:chapters(id, name, subject:subjects(id, name, exam:exams(id, slug, name)))")
      .limit(3200);
    const candidates = ((data ?? []) as unknown as TopicRecord[])
      .filter((candidate) => candidate.chapter?.subject?.exam?.slug === (profile?.exam_choice ?? "cuet"))
      .map((candidate) => ({ candidate, score: conceptMatchScore(directTopic, candidate) }))
      .sort((a, b) => b.score - a.score);
    // A direct concept must resolve to a genuine syllabus topic before Coach
    // offers practice. This prevents a convincing lesson from linking to an
    // unrelated quiz just because its title was vaguely similar.
    // One meaningful shared term is enough for an exact-concept lesson to map to
    // its parent chapter. This covers concepts such as “sigma bond”, which may
    // live inside a broader “Chemical bonding” syllabus row.
    if (candidates[0]?.score && candidates[0].score >= 80) rawTopic = candidates[0].candidate;
  }
  const topic = rawTopic as TopicRecord | null;
  const subject = topic?.chapter?.subject;
  const matchedExam = subject?.exam;
  let exam: ExamRecord | null = matchedExam ?? null;
  if (!exam) {
    const { data } = await admin
      .from("exams")
      .select("id, slug, name")
      .eq("slug", profile?.exam_choice ?? "cuet")
      .maybeSingle<ExamRecord>();
    exam = data;
  }
  // Typed Coach lessons are deliberately independent from the syllabus picker.
  // We use a matched topic only to offer a precise practice link afterwards;
  // a student can still learn a valid, specific concept that has no standalone
  // row in the current topic catalogue.
  if (!exam || exam.slug !== (profile?.exam_choice ?? "cuet") || (topicId && (!topic || !subject || matchedExam?.slug !== exam.slug))) {
    return NextResponse.json({ error: "Choose a topic from your selected exam." }, { status: 400 });
  }

  const { data: preference } = await admin
    .from("user_exam_preferences")
    .select("selected_subject_ids")
    .eq("user_id", user.id)
    .eq("exam_id", exam.id)
    .maybeSingle<{ selected_subject_ids: string[] }>();
  if (!directTopic && preference?.selected_subject_ids?.length && subject && !preference.selected_subject_ids.includes(subject.id)) {
    return NextResponse.json({ error: "Choose this subject in your study preferences before learning it with Coach." }, { status: 400 });
  }

  const scope = directTopic
    ? `The learner asked directly about: ${directTopic}. Teach that exact concept in depth. If it is one element of the matched syllabus topic, do not turn this into an overview of the parent topic.`
    : `The learner selected the full topic. Teach its important sub-ideas separately and in a logical teaching order. Do not compress the whole topic into a revision summary.`;
  const lessonCardRule = `Add a numeric "lessonCardCount" field to the JSON. Choose exactly one of 4, 6, 8, or 10 based on real teaching scope: 4 for one narrow mechanism or distinction, 6 for a normal concept, 8 for a broad process or connected topic, and 10 only for a genuinely broad full syllabus topic. Return exactly that many step objects. Five is not an option and must never be a default.`;
  const prompt = `You are ExamGrind Coach, a precise, encouraging teacher for an Indian exam aspirant. Your job is to TEACH, not summarize notes. A first-time learner should understand the idea after this lesson, then be ready for practice.\n\nExam: ${exam.name}\n${subject ? `Subject: ${subject.name}` : "Subject: infer from the requested concept"}\n${topic?.chapter?.name ? `Chapter: ${topic.chapter.name}` : "Chapter: no parent chapter is required for this direct lesson"}\n${topic?.name ? `Matched syllabus topic: ${topic.name}` : "Matched syllabus topic: none; teach the requested concept directly"}\nSyllabus note: ${topic?.description ?? "No additional note provided."}\nLesson scope: ${scope}\n\nReturn ONLY valid JSON in this exact shape:\n{\n  "opening": "2 concise sentences: what the learner will understand and why it matters",\n  "visual": { "kind": "flow", "caption": "a short statement of the visual idea", "nodes": ["first visual label", "second visual label", "third visual label"] },\n  "steps": [\n    { "title": "the specific sub-idea being taught", "explanation": "a real 2-4 sentence explanation: define it, show how it works or changes, and connect it to the next idea", "example": "one short concrete example, contrast, or real-world consequence that makes this step stick", "visualLabel": "short label for this visual beat" }\n  ],\n  "commonTrap": "one specific exam-relevant misconception or trap",\n  "memoryAnchor": "a compact, accurate recall hook",\n  "checkpoint": {\n    "question": "one single-best-answer conceptual check question",\n    "options": ["A", "B", "C", "D"],\n    "correctIndex": 0,\n    "explanation": "why the right answer is right and the likely trap"\n  }\n}\n\nRequirements:\n- Choose the number of steps from the actual teaching scope: exactly 4 for one narrow concept, 6 for a normal topic, 8 for a broad process or connected topic, and 10 only when the selected full topic genuinely contains several independent sub-ideas. Never pad or compress solely to hit a number.\n- Each step must teach a distinct sub-idea, not restate the opening.\n- Use the order a good teacher would use: foundations first, then categories/process/mechanism, then how to distinguish or apply it.\n- Every explanation must be at least 180 characters and every example must be at least 45 characters. Give enough depth to teach, but keep each step readable on a phone. Avoid vague instructions such as “understand the hierarchy” or “remember the concept.” Explain the hierarchy or concept itself.\n- Do not invent official facts, dates, rules, formulas, sources, or exam trends.\n- If the topic needs a formula, use correct notation and define each variable once.\n- Visual nodes must name real entities, examples, transformations, quantities, or relationships—not decorative words.\n- Never mention being AI, this prompt, unavailable visuals, or that this is a summary.\n- The checkpoint must test an idea learned here, not trivial wording recall.`;

  const depthRule = `Depth contract: The lesson must teach rather than compress. Use a 3-sentence opening that names the learning goal, big idea, and exam relevance. Every step must contain 3-5 useful sentences (280-1,400 characters): define the exact sub-idea, explain the mechanism/order/cause, make the distinction that matters, then connect it to the next idea. Every example must be 80-620 characters and add a concrete mini-case, comparison, worked use, or consequence; it cannot paraphrase the explanation or tell the learner merely to practise. Broad topics must teach their meaningful subtopics separately. Never write vague revision language such as “understand this,” “learn the hierarchy,” or “remember the concept”; explain the thing itself. Add the required numeric lessonCardCount field to the JSON object and return exactly that many steps.`;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    let lesson: unknown = null;
    for (let attempt = 0; attempt < 3 && !isCoachLesson(lesson); attempt += 1) {
      const generated = await generateWithRetry(anthropic, {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 6200,
        temperature: 0.15,
        messages: [{ role: "user", content: `${prompt}\n\n${lessonCardRule}\n\n${depthRule}\n\nThis is structure attempt ${attempt + 1}. Do not add commentary or markdown outside the JSON object.` }],
      });
      if (!generated.ok) {
        return NextResponse.json({ error: generated.userMessage, kind: generated.kind }, { status: generated.httpStatus });
      }
      try { lesson = normalizeCoachLesson(extractJson(generated.text)); } catch { lesson = null; }
    }
    if (!isCoachLesson(lesson)) throw new Error("Invalid Coach lesson structure after retries");
    if (!founderPreview) {
      const allowed = await consumeCoachLessonSlot(supabase, user.id);
      if (!allowed) {
        return NextResponse.json({ error: `You can build up to ${DAILY_COACH_LESSON_LIMIT} Coach lessons a day. Your topic quizzes and saved Study Vault material remain available.` }, { status: 429 });
      }
    }
    const lessonTopic = directTopic
      ? { id: topic?.id ?? "", name: directTopic, chapterName: topic?.chapter?.name ?? "Independent Coach lesson", subjectName: subject?.name ?? exam.name, practiceTopicId: topic?.id, practiceFocus: topic?.id ? directTopic : undefined }
      : { id: topic!.id, name: topic!.name, chapterName: topic!.chapter?.name, subjectName: subject!.name, practiceTopicId: topic!.id };
    const curatedVisual = findCoachVisualAsset(directTopic, topic?.name, topic?.chapter?.name, topic?.description);
    // The hand-picked library remains the first choice. For any other exact
    // concept, look up a separately licensed Commons visual with attribution.
    // It is intentionally non-blocking: an unavailable/uncertain visual never
    // breaks the lesson or substitutes an unrelated image.
    const visualQuery = directTopic || topic?.name || topic?.chapter?.name;
    const visualAsset = curatedVisual ?? (visualQuery ? await findReusableCommonsVisual(visualQuery) : undefined);
    return NextResponse.json({ lesson, topic: lessonTopic, visualAsset });
  } catch (error) {
    console.error("[coach/lesson] lesson generation failed", error);
    return NextResponse.json({ error: "Coach couldn't create that lesson right now. Please try once more." }, { status: 502 });
  }
}
