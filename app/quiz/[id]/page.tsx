import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import QuizRunner from "./QuizRunner";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function QuizPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: quizRow } = await supabase
    .from("quizzes")
    .select("id, user_id, score, subtopic, subject")
    .eq("id", id)
    .maybeSingle();

  if (!quizRow) notFound();
  if (quizRow.user_id !== user.id) redirect("/home");
  // Already completed → jump to results
  if (quizRow.score != null) redirect(`/results/${id}`);

  // We DO NOT send correct_answer to the client — score is computed server-side
  // when the user submits via /api/quiz/complete.
  const { data: questionsData } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d")
    .eq("quiz_id", id)
    .order("created_at", { ascending: true });

  const questions = questionsData ?? [];

  if (questions.length === 0) {
    return (
      <main className="bg-warm-wash flex min-h-[100svh] items-center justify-center px-6">
        <p className="text-cocoa-700">No questions for this quiz. Please start a new one.</p>
      </main>
    );
  }

  return (
    <QuizRunner
      quizId={id}
      topicLabel={`${quizRow.subject} · ${quizRow.subtopic}`}
      questions={questions.map((q) => ({
        id: q.id,
        question: q.question_text,
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d,
      }))}
    />
  );
}
