import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { scopeQuizzesToActiveExam } from "@/lib/active-exam";

export const dynamic = "force-dynamic";

type QuizRow = { id: string; subject: string; topic_id: string | null; created_at: string };
type QuestionRow = {
  quiz_id: string;
  correct_answer: string;
  user_answer: string | null;
  time_taken: number | null;
};
type SubjectStats = { answered: number; correct: number };

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds} min`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
}

function percent(correct: number, answered: number) {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

export default async function WeeklyReportPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const now = Date.now();
  const currentStart = new Date(now - 7 * 86_400_000).toISOString();
  const previousStart = new Date(now - 14 * 86_400_000).toISOString();
  const { data: quizzesRaw } = await supabase
    .from("quizzes")
    .select("id, subject, topic_id, created_at")
    .eq("user_id", user.id)
    .not("score", "is", null)
    .gte("created_at", previousStart)
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
      .select("quiz_id, correct_answer, user_answer, time_taken")
      .in("quiz_id", quizIds)
      .not("user_answer", "is", null)
      .limit(1000);
    questions = (data ?? []) as QuestionRow[];
  }

  const current = { answered: 0, correct: 0, seconds: 0, quizzes: new Set<string>() };
  const previous = { answered: 0, correct: 0, seconds: 0, quizzes: new Set<string>() };
  const bySubject = new Map<string, SubjectStats>();
  for (const question of questions) {
    const quiz = quizById.get(question.quiz_id);
    if (!quiz) continue;
    const bucket = quiz.created_at >= currentStart ? current : previous;
    bucket.answered += 1;
    bucket.seconds += Math.max(0, question.time_taken ?? 0);
    if (question.user_answer === question.correct_answer) bucket.correct += 1;
    bucket.quizzes.add(quiz.id);
    if (bucket === current) {
      const stat = bySubject.get(quiz.subject) ?? { answered: 0, correct: 0 };
      stat.answered += 1;
      if (question.user_answer === question.correct_answer) stat.correct += 1;
      bySubject.set(quiz.subject, stat);
    }
  }
  const currentAccuracy = percent(current.correct, current.answered);
  const previousAccuracy = percent(previous.correct, previous.answered);
  const accuracyDelta = current.answered > 0 && previous.answered > 0
    ? currentAccuracy - previousAccuracy
    : null;
  const rankedSubjects = Array.from(bySubject.entries())
    .filter(([, stat]) => stat.answered >= 3)
    .sort(([, a], [, b]) => percent(b.correct, b.answered) - percent(a.correct, a.answered));
  const strongest = rankedSubjects[0];
  const weakest = rankedSubjects.at(-1);

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">ExamGrind</Link>
        <div className="flex items-center gap-3">
          <Link href="/monthly" className="text-sm font-semibold text-ember-700 hover:text-ember-800">30-day view</Link>
          <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">← Home</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">Weekly proof</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-cocoa-900 sm:text-5xl">Your last 7 days.</h1>
        <p className="mt-3 text-base leading-7 text-cocoa-700">Progress you can verify from completed practice—not empty motivation.</p>
      </section>
      <section className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Questions solved" value={String(current.answered)} />
        <Stat label="Accuracy" value={current.answered > 0 ? `${currentAccuracy}%` : "—"} detail={accuracyDelta == null ? undefined : `${accuracyDelta >= 0 ? "+" : ""}${accuracyDelta} pts vs prior week`} />
        <Stat label="Study time" value={formatTime(current.seconds)} />
        <Stat label="Quizzes finished" value={String(current.quizzes.size)} />
      </section>
      <section className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">What the week shows</p>
          {current.answered === 0 ? (
            <p className="mt-3 text-sm leading-6 text-cocoa-700">No completed practice in the last 7 days yet. Start today’s mission to create your first proof point.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Insight label="Strongest this week" value={strongest ? `${strongest[0]} · ${percent(strongest[1].correct, strongest[1].answered)}%` : "Keep practicing to reveal this"} />
              <Insight label="Repair next" value={weakest ? `${weakest[0]} · ${percent(weakest[1].correct, weakest[1].answered)}%` : "Complete a few more questions"} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm"><p className="text-xs text-cocoa-500">{label}</p><p className="mt-1 font-serif text-2xl font-semibold text-cocoa-900">{value}</p>{detail && <p className="mt-1 text-[11px] font-medium text-ember-700">{detail}</p>}</div>;
}
function Insight({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-sun-500/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-cocoa-500">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-cocoa-900">{value}</p></div>;
}
