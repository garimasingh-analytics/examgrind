import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { generateWithRetry } from "@/lib/anthropic-resilient";
import { DAILY_COACH_LESSON_LIMIT, consumeCoachLessonSlot } from "@/lib/ai-rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type LessonRequest = { topicId?: unknown; directTopic?: unknown };
type LessonStep = { title: string; explanation: string; visualLabel: string };
type LessonVisual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type CoachLesson = {
  opening: string;
  steps: LessonStep[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: LessonVisual;
};

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizeCoachLesson(value: unknown): CoachLesson | null {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : null;
  if (!raw) return null;
  const rawCheckpoint = raw.checkpoint && typeof raw.checkpoint === "object" ? raw.checkpoint as Record<string, unknown> : null;
  const steps = Array.isArray(raw.steps) ? raw.steps.slice(0, 6).flatMap((item) => {
    const step = item && typeof item === "object" ? item as Record<string, unknown> : null;
    if (!step) return [];
    const title = text(step.title, 110);
    const explanation = text(step.explanation, 900);
    const visualLabel = text(step.visualLabel, 90);
    return title && explanation && visualLabel ? [{ title, explanation, visualLabel }] : [];
  }) : [];
  const options = Array.isArray(rawCheckpoint?.options)
    ? rawCheckpoint.options.map((option) => text(option, 220)).filter(Boolean).slice(0, 4)
    : [];
  const correctIndex = typeof rawCheckpoint?.correctIndex === "number"
    ? Math.trunc(rawCheckpoint.correctIndex)
    : Number.parseInt(String(rawCheckpoint?.correctIndex ?? ""), 10);
  const lesson: CoachLesson = {
    opening: text(raw.opening, 700),
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
  };
  return isCoachLesson(lesson) ? lesson : null;
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
    isShortText(lesson.opening, 700) &&
    Array.isArray(lesson.steps) && lesson.steps.length >= 4 && lesson.steps.length <= 6 &&
    lesson.steps.every((step) => step && isShortText(step.title, 110) && isShortText(step.explanation, 900) && isShortText(step.visualLabel, 90)) &&
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

function words(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((word) => word.length > 1);
}

function conceptMatchScore(query: string, topic: TopicRecord) {
  const needle = query.toLowerCase().trim();
  const name = topic.name.toLowerCase();
  if (name === needle) return 1000;
  if (name.includes(needle) || needle.includes(name)) return 700;
  const queryWords = words(query);
  const topicWords = new Set([...words(topic.name), ...words(topic.description ?? "")]);
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
    if (candidates[0]?.score && candidates[0].score >= 100) rawTopic = candidates[0].candidate;
  }
  const topic = rawTopic as TopicRecord | null;
  const subject = topic?.chapter?.subject;
  const exam = subject?.exam;
  if (!topic || !subject || !exam || exam.slug !== (profile?.exam_choice ?? "cuet")) {
    return NextResponse.json({ error: "That topic is not part of your selected exam." }, { status: 400 });
  }

  const { data: preference } = await admin
    .from("user_exam_preferences")
    .select("selected_subject_ids")
    .eq("user_id", user.id)
    .eq("exam_id", exam.id)
    .maybeSingle<{ selected_subject_ids: string[] }>();
  if (preference?.selected_subject_ids?.length && !preference.selected_subject_ids.includes(subject.id)) {
    return NextResponse.json({ error: "Choose this subject in your study preferences before learning it with Coach." }, { status: 400 });
  }

  const scope = directTopic
    ? `The learner asked directly about: ${directTopic}. Teach that exact concept in depth. If it is one element of the matched syllabus topic, do not turn this into an overview of the parent topic.`
    : `The learner selected the full topic. Teach its important sub-ideas separately and in a logical teaching order. Do not compress the whole topic into a revision summary.`;
  const prompt = `You are ExamGrind Coach, a precise, encouraging teacher for an Indian exam aspirant. Your job is to TEACH, not summarize notes. A first-time learner should understand the idea after this lesson, then be ready for practice.\n\nExam: ${exam.name}\nSubject: ${subject.name}\nChapter: ${topic.chapter?.name}\nMatched syllabus topic: ${topic.name}\nSyllabus note: ${topic.description ?? "No additional note provided."}\nLesson scope: ${scope}\n\nReturn ONLY valid JSON in this exact shape:\n{\n  "opening": "2 concise sentences: what the learner will understand and why it matters",\n  "visual": { "kind": "flow", "caption": "a short statement of the visual idea", "nodes": ["first visual label", "second visual label", "third visual label"] },\n  "steps": [\n    { "title": "the specific sub-idea being taught", "explanation": "real explanation: define it, show how it works or changes, and use a tiny concrete example where useful", "visualLabel": "short label for this visual beat" }\n  ],\n  "commonTrap": "one specific exam-relevant misconception or trap",\n  "memoryAnchor": "a compact, accurate recall hook",\n  "checkpoint": {\n    "question": "one single-best-answer conceptual check question",\n    "options": ["A", "B", "C", "D"],\n    "correctIndex": 0,\n    "explanation": "why the right answer is right and the likely trap"\n  }\n}\n\nRequirements:\n- Write 5 or 6 steps for a full selected topic; write 4 or 5 steps for a direct concept. Each step must teach a distinct sub-idea, not restate the opening.\n- Use the order a good teacher would use: foundations first, then categories/process/mechanism, then how to distinguish or apply it.\n- Give enough depth to teach, but keep each step readable on a phone. Avoid vague instructions such as “understand the hierarchy” or “remember the concept.” Explain the hierarchy or concept itself.\n- Do not invent official facts, dates, rules, formulas, sources, or exam trends.\n- If the topic needs a formula, use correct notation and define each variable once.\n- The visual labels and nodes must name real entities, transformations, categories, or relationships—not decorative words.\n- Never mention being AI, this prompt, unavailable visuals, or that this is a summary.\n- The checkpoint must test an idea learned here, not trivial wording recall.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    let lesson: unknown = null;
    for (let attempt = 0; attempt < 3 && !isCoachLesson(lesson); attempt += 1) {
      const generated = await generateWithRetry(anthropic, {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4200,
        temperature: 0.15,
        messages: [{ role: "user", content: `${prompt}\n\nThis is structure attempt ${attempt + 1}. Do not add commentary or markdown outside the JSON object.` }],
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
    return NextResponse.json({ lesson, topic: { id: topic.id, name: topic.name, chapterName: topic.chapter?.name, subjectName: subject.name } });
  } catch (error) {
    console.error("[coach/lesson] lesson generation failed", error);
    return NextResponse.json({ error: "Coach couldn't create that lesson right now. Please try once more." }, { status: 502 });
  }
}
