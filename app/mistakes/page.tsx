import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { scopeQuizzesToActiveExam } from "@/lib/active-exam";
import MistakeBook, { type Mistake } from "./MistakeBook";

export const dynamic = "force-dynamic";

type QuizRow = {
  id: string;
  subject: string;
  subtopic: string | null;
  topic_id: string | null;
};

type QuestionRow = {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  user_answer: "A" | "B" | "C" | "D" | null;
  created_at: string;
};

export default async function MistakesPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: quizzesRaw } = await supabase
    .from("quizzes")
    .select("id, subject, subtopic, topic_id")
    .eq("user_id", user.id)
    .not("score", "is", null)
    .order("created_at", { ascending: false })
    .limit(200);
  const quizzes = await scopeQuizzesToActiveExam(
    supabase,
    user.id,
    (quizzesRaw ?? []) as QuizRow[],
  );
  const quizById = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
  const quizIds = quizzes.map((quiz) => quiz.id);

  let questions: QuestionRow[] = [];
  if (quizIds.length > 0) {
    const { data } = await supabase
      .from("questions")
      .select("id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, user_answer, created_at")
      .in("quiz_id", quizIds)
      .not("user_answer", "is", null)
      .order("created_at", { ascending: false })
      .limit(500);
    questions = (data ?? []) as QuestionRow[];
  }

  const mistakes: Mistake[] = questions
    .filter((question) => question.user_answer !== question.correct_answer)
    .flatMap((question) => {
      const quiz = quizById.get(question.quiz_id);
      if (!quiz || !question.user_answer) return [];
      return [{
        id: question.id,
        question: question.question_text,
        userAnswer: question.user_answer,
        correctAnswer: question.correct_answer,
        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },
        subject: quiz.subject,
        topic: quiz.subtopic,
        topicId: quiz.topic_id,
        resultId: quiz.id,
        createdAt: question.created_at,
      }];
    });

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">ExamGrind</Link>
        <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">← Home</Link>
      </header>
      <section className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">Mistake Book</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-cocoa-900 sm:text-5xl">Turn mistakes into marks.</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-cocoa-700">Every incorrect answer stays here until you are ready to repair the topic. No guessing what to revise.</p>
      </section>
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <MistakeBook mistakes={mistakes} />
      </section>
    </main>
  );
}
