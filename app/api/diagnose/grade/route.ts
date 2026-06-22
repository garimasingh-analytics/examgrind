import { NextResponse, type NextRequest } from "next/server";
import { DIAGNOSE_QUESTIONS, EXAM_LABEL, type DiagnoseExam } from "@/lib/diagnose-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GradeBody = {
  exam: DiagnoseExam;
  answers: Array<{ id: string; picked: "A" | "B" | "C" | "D" | null }>;
};

const VALID_EXAMS = ["neet-ug", "cuet", "ssc-cgl"];

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

  if (!VALID_EXAMS.includes(body.exam)) {
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
    return `Perfect ${total}/${total}. These traps catch 60-78% of ${examLabel} aspirants. You're in the top decile on this 5-Q sample — your gaps are likely in topics we didn't test. Run the full 30-Q diagnostic to find them.`;
  }
  if (score >= total - 1) {
    return `Strong ${score}/${total}. One gap caught you: ${wrongConcepts[0]}. The full diagnostic surfaces 8-12 more gaps across the syllabus you didn't see here.`;
  }
  if (score >= Math.ceil(total / 2)) {
    return `Middle band: ${score}/${total}. Real gaps in ${wrongConcepts.slice(0, 2).join(" + ")}. Drill below + run the full 30-Q for the complete picture.`;
  }
  return `${score}/${total} — these traps are real PYQs that you'd see again. Your weakness pattern: ${wrongConcepts.slice(0, 3).join(" / ")}. Don't panic — this is exactly the diagnostic information the app is designed to surface.`;
}
