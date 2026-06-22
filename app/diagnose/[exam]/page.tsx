import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import DiagnoseRunner from "./DiagnoseRunner";
import {
  DIAGNOSE_QUESTIONS,
  EXAM_LABEL,
  EXAM_TAGLINE,
  type DiagnoseExam,
} from "@/lib/diagnose-questions";

export const dynamic = "force-static";

const VALID_EXAMS = ["neet-ug", "cuet", "ssc-cgl"] as const;

type Params = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { exam } = await params;
  if (!(VALID_EXAMS as readonly string[]).includes(exam)) return {};
  const label = EXAM_LABEL[exam as DiagnoseExam];
  return {
    title: `60-sec ${label} weakness diagnosis · ExamGrind`,
    description: `5 PYQ trap questions. AI tells you exactly where you'd lose marks. No signup. Free.`,
  };
}

export async function generateStaticParams() {
  return VALID_EXAMS.map((exam) => ({ exam }));
}

export default async function DiagnoseExamPage({ params }: Params) {
  const { exam } = await params;
  if (!(VALID_EXAMS as readonly string[]).includes(exam)) notFound();

  const examKey = exam as DiagnoseExam;
  const questions = DIAGNOSE_QUESTIONS[examKey];
  const publicQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));

  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-lg font-bold text-cocoa-900">
          ExamGrind
        </Link>
        <Link
          href="/diagnose"
          className="text-sm font-medium text-cocoa-500 transition hover:text-cocoa-700"
        >
          ← All exams
        </Link>
      </header>

      <DiagnoseRunner
        exam={examKey}
        examLabel={EXAM_LABEL[examKey]}
        tagline={EXAM_TAGLINE[examKey]}
        questions={publicQuestions}
      />
    </main>
  );
}
