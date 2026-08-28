import { NextResponse, type NextRequest } from "next/server";
import { DIAGNOSE_QUESTIONS, EXAM_LABEL, isDiagnoseExam, type DiagnoseExam } from "@/lib/diagnose-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GradeBody = {
  exam: DiagnoseExam;
  answers: Array<{ id: string; picked: "A" | "B" | "C" | "D" | null }>;
};

/**
 * Public grading endpoint for /diagnose.
 *
 * NO authentication required — this is the marketing trojan horse. Cold visitors
 * complete the 5-Q diagnosis and get a personalized weakness report. They then
 * convert to signup at the result screen.
 *
 * No DB writes. No PII captured. Stateless grading.
 */
export async function POST(req: NextRequest) {
  let body: GradeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isDiagnoseExam(body.exam)) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: "answers must be an array" }, { status: 400 });
  }

  const questions = DIAGNOSE_QUESTIONS[body.exam];

  const pickedById = new Map<string, "A" | "B" | "C" | "D" | null>();
  for (const a of body.answers) {
    if (typeof a?.id === "string") pickedById.set(a.id, a.picked ?? null);
  }

  const perQuestion = questions.map((q) => {
    const picked = pickedById.get(q.id) ?? null;
    const isCorrect = picked === q.correct;
    return {
      id: q.id,
      question: q.question,
      picked,
      correct: q.correct,
      isCorrect,
      concept: q.concept,
      subjectId: q.subjectId,
      drill: q.drill,
      whenWrong: q.whenWrong,
      optionLabels: q.options,
    };
  });

  const score = perQuestion.filter((r) => r.isCorrect).length;
  const total = questions.length;
  const examLabel = EXAM_LABEL[body.exam];

  const narrative = pickNarrative(score, total, examLabel, perQuestion);

  return NextResponse.json({
    score,
    total,
    perQuestion,
    narrative,
  });
}

function pickNarrative(
  score: number,
  total: number,
  examLabel: string,
  perQuestion: ReturnType<typeof Array.prototype.map>
): string {
  const wrongConcepts = (
    perQuestion as Array<{ isCorrect: boolean; concept: string }>
  )
    .filter((r) => !r.isCorrect)
    .map((r) => r.concept);

  if (score === total) {
    return `Perfect ${total}/${total} on this five-question signal. That is a strong start, but it is not a full-syllabus assessment — a real chapter attempt will give a more useful picture.`;
  }
  if (score >= total - 1) {
    return `Strong ${score}/${total}. This sample surfaced one clear priority: ${wrongConcepts[0]}. Fix that first, then use chapter practice to test more of the syllabus.`;
  }
  if (score >= Math.ceil(total / 2)) {
    return `${score}/${total}. This quick signal surfaced gaps in ${wrongConcepts.slice(0, 2).join(" + ")}. Start with the first priority below, then validate it in a real chapter attempt.`;
  }
  return `${score}/${total}. This quick signal surfaced ${wrongConcepts.slice(0, 3).join(" / ")}. Do not treat five questions as a verdict; use the first repair below, then build evidence through chapter practice.`;
}
