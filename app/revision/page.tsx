import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

type MasteryRow = {
  topic_id: string;
  mastery_level: string;
  questions_attempted: number;
  questions_correct: number;
  last_quizzed_at: string | null;
  topics:
    | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }
    | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }[];
};

type RevisionTopic = {
  id: string;
  name: string;
  subject: string;
  accuracy: number;
  lastQuizzedAt: string;
  dueAt: number;
};
type StudyPreference = { selected_subject_ids: string[] };

const INTERVAL_DAYS: Record<string, number> = {
  novice: 1,
  apprentice: 3,
  adept: 7,
  master: 14,
};

function dueCopy(dueAt: number) {
  const hoursLate = Math.max(0, Math.floor((Date.now() - dueAt) / 3_600_000));
  if (hoursLate < 24) return "Due today";
  const daysLate = Math.floor(hoursLate / 24);
  return `${daysLate} ${daysLate === 1 ? "day" : "days"} overdue`;
}

/** A selected-exam-only, spaced-repetition queue based on completed practice. */
export default async function RevisionPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice, subscription_status, paid_until")
    .eq("id", user.id)
    .maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid"; paid_until: string | null }>();
  const liveStatus = await ensureSubscriptionFreshness(user.id, profile?.subscription_status ?? "free", profile?.paid_until ?? null);
  const { data: exam } = await supabase
    .from("exams")
    .select("id, name")
    .eq("slug", profile?.exam_choice ?? "cuet")
    .maybeSingle<{ id: string; name: string }>();
  if (!exam) redirect("/home");

  const [{ data: subjectsRaw }, { data: masteryRaw }, { data: preferenceRaw }] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name")
      .eq("exam_id", exam.id),
    supabase
      .from("user_topic_mastery")
      .select("topic_id, mastery_level, questions_attempted, questions_correct, last_quizzed_at, topics!inner(name, chapters!inner(subject_id))")
      .eq("user_id", user.id),
    supabase
      .from("user_exam_preferences")
      .select("selected_subject_ids")
      .eq("user_id", user.id)
      .eq("exam_id", exam.id)
      .maybeSingle<StudyPreference>(),
  ]);

  const examSubjects = (subjectsRaw ?? []) as Array<{ id: string; name: string }>;
  const examSubjectIds = new Set(examSubjects.map((subject) => subject.id));
  const selectedIds = (preferenceRaw?.selected_subject_ids ?? [])
    .filter((id) => examSubjectIds.has(id));
  const studySubjects = selectedIds.length > 0
    ? examSubjects.filter((subject) => selectedIds.includes(subject.id))
    : examSubjects;
  const subjectNames = new Map(studySubjects.map((subject) => [subject.id, subject.name]));
  const now = Date.now();
  const queue: RevisionTopic[] = [];
  for (const mastery of (masteryRaw ?? []) as MasteryRow[]) {
    if (mastery.questions_attempted <= 0 || !mastery.last_quizzed_at) continue;
    const topic = Array.isArray(mastery.topics) ? mastery.topics[0] : mastery.topics;
    const chapter = topic && (Array.isArray(topic.chapters) ? topic.chapters[0] : topic.chapters);
    if (!topic || !chapter) continue;
    const subject = subjectNames.get(chapter.subject_id);
    if (!subject) continue;
    const accuracy = mastery.questions_correct / mastery.questions_attempted;
    // Topics below 70% belong in the Mistake Book repair loop first. This
    // queue is for recall of concepts that have already been demonstrated.
    if (accuracy < 0.7) continue;
    const dueAt = new Date(mastery.last_quizzed_at).getTime() +
      (INTERVAL_DAYS[mastery.mastery_level] ?? 3) * 86_400_000;
    if (dueAt > now) continue;
    queue.push({
      id: mastery.topic_id,
      name: topic.name,
      subject,
      accuracy: Math.round(accuracy * 100),
      lastQuizzedAt: mastery.last_quizzed_at,
      dueAt,
    });
  }
  queue.sort((a, b) => a.dueAt - b.dueAt);

  return (
    <main className="revision-stage min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">ExamGrind</Link>
        <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">← Home</Link>
      </header>
      <section className="revision-cover mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">Smart revision · {exam.name}</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-cocoa-900 sm:text-5xl">Recall before you forget.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-cocoa-700">This queue uses your completed practice and a simple spaced schedule. Weak topics stay in your Mistake Book; these are the skills you have already started to build.</p>
      </section>
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        {queue.length === 0 ? (
          <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center shadow-warm sm:p-10">
            <p className="text-3xl" aria-hidden>🧠</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-cocoa-900">Nothing is due right now.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cocoa-700">Finish a topic with at least 70% accuracy and ExamGrind will bring it back at the right time for recall.</p>
            <Link href="/home" className="mt-5 inline-flex rounded-2xl bg-cocoa-900 px-4 py-3 text-sm font-bold text-cream-50 transition hover:bg-cocoa-800">Choose a topic →</Link>
          </div>
        ) : (
          <div className="revision-queue space-y-3">
            <p className="text-sm font-semibold text-cocoa-700">{queue.length} {queue.length === 1 ? "topic" : "topics"} ready for a short recall round.</p>
            {queue.map((topic) => (
              <article key={topic.id} className="revision-ticket flex flex-col gap-4 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-500">{topic.subject} · {dueCopy(topic.dueAt)}</p>
                  <h2 className="mt-1 font-serif text-xl font-semibold text-cocoa-900">{topic.name}</h2>
                  <p className="mt-1 text-sm text-cocoa-700">Last demonstrated accuracy: {topic.accuracy}% · last practiced {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(topic.lastQuizzedAt))}</p>
                </div>
                <Link href={`/topic/${topic.id}`} className="inline-flex shrink-0 justify-center rounded-xl bg-ember-600 px-4 py-2.5 text-sm font-bold text-cream-50 transition hover:bg-ember-700">Start recall round →</Link>
              </article>
            ))}
          </div>
        )}
      </section>
      {liveStatus !== "paid" && <AdSlot />}
    </main>
  );
}
