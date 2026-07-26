import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type QuizRow = { id: string; subject: string; created_at: string };
type QuestionRow = {
  quiz_id: string;
  correct_answer: string;
  user_answer: string | null;
  time_taken: number | null;
};
type Week = { label: string; answered: number; correct: number; seconds: number };
type SubjectStats = { answered: number; correct: number };

function percent(correct: number, answered: number) {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds} min`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
}

/** A factual 30-day practice record — deliberately not an exam-score prediction. */
export default async function MonthlyReportPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const now = Date.now();
  const start = new Date(now - 28 * 86_400_000).toISOString();
  const { data: quizzesRaw } = await supabase
    .from("quizzes")
    .select("id, subject, created_at")
    .eq("user_id", user.id)
    .not("score", "is", null)
    .gte("created_at", start)
    .order("created_at", { ascending: false })
    .limit(400);
  const quizzes = (quizzesRaw ?? []) as QuizRow[];
  const quizById = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
  const quizIds = quizzes.map((quiz) => quiz.id);

  let questions: QuestionRow[] = [];
  if (quizIds.length > 0) {
    const { data } = await supabase
      .from("questions")
      .select("quiz_id, correct_answer, user_answer, time_taken")
      .in("quiz_id", quizIds)
      .not("user_answer", "is", null)
      .limit(2500);
    questions = (data ?? []) as QuestionRow[];
  }

  const weeks: Week[] = [
    { label: "4 weeks ago", answered: 0, correct: 0, seconds: 0 },
    { label: "3 weeks ago", answered: 0, correct: 0, seconds: 0 },
    { label: "2 weeks ago", answered: 0, correct: 0, seconds: 0 },
    { label: "This week", answered: 0, correct: 0, seconds: 0 },
  ];
  const bySubject = new Map<string, SubjectStats>();
  for (const question of questions) {
    const quiz = quizById.get(question.quiz_id);
    if (!quiz) continue;
    const age = Math.max(0, now - new Date(quiz.created_at).getTime());
    const weekIndex = Math.min(3, 3 - Math.floor(age / (7 * 86_400_000)));
    const week = weeks[weekIndex];
    week.answered += 1;
    week.seconds += Math.max(0, question.time_taken ?? 0);
    if (question.user_answer === question.correct_answer) week.correct += 1;
    const stat = bySubject.get(quiz.subject) ?? { answered: 0, correct: 0 };
    stat.answered += 1;
    if (question.user_answer === question.correct_answer) stat.correct += 1;
    bySubject.set(quiz.subject, stat);
  }

  const totalAnswered = weeks.reduce((sum, week) => sum + week.answered, 0);
  const totalCorrect = weeks.reduce((sum, week) => sum + week.correct, 0);
  const totalSeconds = weeks.reduce((sum, week) => sum + week.seconds, 0);
  const activeWeeks = weeks.filter((week) => week.answered > 0).length;
  const mostPracticed = Array.from(bySubject.entries())
    .sort(([, a], [, b]) => b.answered - a.answered)[0];
  const bestAccuracy = Array.from(bySubject.entries())
    .filter(([, stat]) => stat.answered >= 5)
    .sort(([, a], [, b]) => percent(b.correct, b.answered) - percent(a.correct, a.answered))[0];
  const maxQuestions = Math.max(1, ...weeks.map((week) => week.answered));

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">ExamGrind</Link>
        <div className="flex items-center gap-3">
          <Link href="/weekly" className="text-sm font-semibold text-ember-700 hover:text-ember-800">Weekly proof</Link>
          <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">← Home</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">Monthly proof</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-cocoa-900 sm:text-5xl">Your last 28 days.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-cocoa-700">Your actual completed practice, week by week. It shows momentum—not a made-up exam prediction.</p>
      </section>
      <section className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Questions solved" value={String(totalAnswered)} />
        <Stat label="Accuracy" value={totalAnswered > 0 ? `${percent(totalCorrect, totalAnswered)}%` : "—"} />
        <Stat label="Study time" value={formatTime(totalSeconds)} />
        <Stat label="Active weeks" value={`${activeWeeks}/4`} />
      </section>
      <section className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">Practice volume</p>
          {totalAnswered === 0 ? (
            <p className="mt-3 text-sm leading-6 text-cocoa-700">No completed practice in the last 28 days yet. Start today’s mission and this chart will build from real evidence.</p>
          ) : (
            <div className="mt-5 grid grid-cols-4 items-end gap-3" aria-label="Questions completed by week">
              {weeks.map((week) => (
                <div key={week.label} className="flex min-w-0 flex-col items-center gap-2">
                  <p className="text-sm font-bold text-cocoa-900">{week.answered}</p>
                  <div className="flex h-28 w-full items-end rounded-xl bg-cocoa-900/[0.05] p-1.5">
                    <div className="w-full rounded-lg bg-ember-600 transition-all" style={{ height: `${Math.max(8, Math.round((week.answered / maxQuestions) * 100))}%` }} />
                  </div>
                  <p className="text-center text-[10px] font-medium leading-4 text-cocoa-500">{week.label}</p>
                  <p className="text-[11px] text-cocoa-700">{week.answered > 0 ? `${percent(week.correct, week.answered)}%` : "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto mt-6 grid max-w-3xl gap-3 px-4 sm:grid-cols-2 sm:px-6">
        <Insight label="Most practiced" value={mostPracticed ? `${mostPracticed[0]} · ${mostPracticed[1].answered} questions` : "Complete a quiz to reveal this"} />
        <Insight label="Best demonstrated accuracy" value={bestAccuracy ? `${bestAccuracy[0]} · ${percent(bestAccuracy[1].correct, bestAccuracy[1].answered)}%` : "Answer 5 questions in a subject to reveal this"} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm"><p className="text-xs text-cocoa-500">{label}</p><p className="mt-1 font-serif text-2xl font-semibold text-cocoa-900">{value}</p></div>;
}

function Insight({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-cocoa-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-cocoa-900">{value}</p></div>;
}
