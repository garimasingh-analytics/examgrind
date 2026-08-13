import Link from "next/link";
import { redirect } from "next/navigation";
import Chick from "@/components/Chick";
import { isAdminEmail } from "@/lib/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import CoachLearningStudio from "./CoachLearningStudio";

export const dynamic = "force-dynamic";

type Subject = { id: string; name: string };
type StudyPreference = { selected_subject_ids: string[] };
type TopicSignal = {
  topicId: string;
  topicName: string;
  subjectId: string;
  accuracy: number;
  mastery: string;
  lastQuizzedAt: string | null;
};
type LearnTopic = { id: string; name: string; chapterName: string; subjectName: string };

const revisionDays: Record<string, number> = {
  novice: 1,
  apprentice: 3,
  adept: 7,
  master: 14,
};

function dueForRecall(signal: TopicSignal) {
  if (!signal.lastQuizzedAt || signal.accuracy < 0.7) return false;
  return new Date(signal.lastQuizzedAt).getTime() +
    (revisionDays[signal.mastery] ?? 3) * 86_400_000 <= Date.now();
}

export default async function CoachPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice, subscription_status, paid_until")
    .eq("id", user.id)
    .maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid"; paid_until: string | null }>();
  const isCoach = (await ensureSubscriptionFreshness(
    user.id,
    profile?.subscription_status ?? "free",
    profile?.paid_until ?? null,
  )) === "paid";
  const founderPreview = isAdminEmail(user.email);
  if (!isCoach && !founderPreview) {
    return <main className="min-h-[100svh] bg-warm-wash pb-20"><header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><Link href="/home" className="font-serif text-lg font-bold text-cocoa-900">ExamGrind</Link><Link href="/home" className="text-sm font-bold text-ember-700">Home →</Link></header><section className="mx-auto max-w-2xl px-5 pt-8 text-center"><Chick state="idle" size={110} className="mx-auto" /><p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-ember-700">ExamGrind Coach</p><h1 className="mt-2 font-serif text-3xl font-bold text-cocoa-900">Coach isn&apos;t active for you yet.</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-cocoa-700">Unlock a living study system that responds to every quiz and mock—not a generic timetable.</p><div className="mt-6 grid gap-3 text-left sm:grid-cols-2">{["Unlimited quizzes, mocks and AI Deep Analyses","A live Coach briefing after every completed practice","Adaptive daily actions and smart revision","Readiness recalculation and progress timeline","Mistake Book, reports and new premium tools"].map((benefit) => <div key={benefit} className="rounded-2xl border border-cocoa-900/[.07] bg-cream-50 p-4 text-sm font-medium text-cocoa-800 shadow-warm">✓ {benefit}</div>)}</div><Link href="/me" className="mt-7 inline-flex rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-4 text-base font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01]">Unlock Coach — ₹199 / month</Link><p className="mt-3 text-xs text-cocoa-500">Cancel anytime from your profile.</p></section></main>;
  }

  const examSlug = profile?.exam_choice ?? "cuet";
  const { data: exam } = await supabase
    .from("exams")
    .select("id, name")
    .eq("slug", examSlug)
    .maybeSingle<{ id: string; name: string }>();
  const [{ data: subjectRows }, { data: preferenceRaw }] = exam?.id
    ? await Promise.all([
        supabase.from("subjects").select("id, name").eq("exam_id", exam.id).order("order_index"),
        supabase.from("user_exam_preferences").select("selected_subject_ids").eq("user_id", user.id).eq("exam_id", exam.id).maybeSingle<StudyPreference>(),
      ])
    : [{ data: [] }, { data: null }];
  const examSubjects = (subjectRows ?? []) as Subject[];
  const examSubjectIds = new Set(examSubjects.map((subject) => subject.id));
  const selectedIds = (preferenceRaw?.selected_subject_ids ?? [])
    .filter((id) => examSubjectIds.has(id));
  const subjects = selectedIds.length > 0
    ? examSubjects.filter((subject) => selectedIds.includes(subject.id))
    : examSubjects;
  const activeSubjectIds = new Set(subjects.map((subject) => subject.id));
  const subjectName = (id: string) => subjects.find((subject) => subject.id === id)?.name ?? "your subject";

  // Coach only teaches real syllabus topics belonging to the learner's
  // selected subjects, so every lesson can lead straight into valid practice.
  const { data: chapterRows } = activeSubjectIds.size
    ? await supabase
      .from("chapters")
      .select("id, name, subject_id")
      .in("subject_id", [...activeSubjectIds])
      .order("order_index")
    : { data: [] };
  const chapters = (chapterRows ?? []) as Array<{ id: string; name: string; subject_id: string }>;
  const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const chapterIds = chapters.map((chapter) => chapter.id);
  const { data: topicRows } = chapterIds.length
    ? await supabase
      .from("topics")
      .select("id, name, chapter_id")
      .in("chapter_id", chapterIds)
      .order("order_index")
      .limit(900)
    : { data: [] };
  const learningTopics: LearnTopic[] = ((topicRows ?? []) as Array<{ id: string; name: string; chapter_id: string }>)
    .flatMap((topic) => {
      const chapter = chapterById.get(topic.chapter_id);
      if (!chapter) return [];
      return [{ id: topic.id, name: topic.name, chapterName: chapter.name, subjectName: subjectName(chapter.subject_id) }];
    });

  const { data: masteryRows } = await supabase
    .from("user_topic_mastery")
    .select("topic_id, mastery_level, questions_attempted, questions_correct, last_quizzed_at, topics!inner(name, chapters!inner(subject_id))")
    .eq("user_id", user.id);
  const signals: TopicSignal[] = [];
  for (const row of (masteryRows ?? []) as Array<{
    topic_id: string;
    mastery_level: string;
    questions_attempted: number;
    questions_correct: number;
    last_quizzed_at: string | null;
    topics: { name: string; chapters: { subject_id: string } | { subject_id: string }[] } | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }[];
  }>) {
    if (row.questions_attempted <= 0) continue;
    const topic = Array.isArray(row.topics) ? row.topics[0] : row.topics;
    const chapter = topic && (Array.isArray(topic.chapters) ? topic.chapters[0] : topic.chapters);
    if (!topic || !chapter || !activeSubjectIds.has(chapter.subject_id)) continue;
    signals.push({
      topicId: row.topic_id,
      topicName: topic.name,
      subjectId: chapter.subject_id,
      accuracy: row.questions_correct / row.questions_attempted,
      mastery: row.mastery_level,
      lastQuizzedAt: row.last_quizzed_at,
    });
  }

  const weakest = [...signals].filter((signal) => signal.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const recall = [...signals].filter(dueForRecall)
    .sort((a, b) => new Date(a.lastQuizzedAt ?? 0).getTime() - new Date(b.lastQuizzedAt ?? 0).getTime())[0];
  const coveredBySubject = new Map<string, number>();
  for (const signal of signals) coveredBySubject.set(signal.subjectId, (coveredBySubject.get(signal.subjectId) ?? 0) + 1);
  const coverageSubject = [...subjects].sort((a, b) =>
    (coveredBySubject.get(a.id) ?? 0) - (coveredBySubject.get(b.id) ?? 0),
  )[0];
  const weakSignals = [...signals].filter((signal) => signal.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const recallSignals = [...signals].filter(dueForRecall)
    .sort((a, b) => new Date(a.lastQuizzedAt ?? 0).getTime() - new Date(b.lastQuizzedAt ?? 0).getTime()).slice(0, 3);
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date());

  const actions = [
    weakest && {
      label: "Repair first",
      title: `Strengthen ${weakest.topicName}`,
      detail: `You were at ${Math.round(weakest.accuracy * 100)}% in ${subjectName(weakest.subjectId)}. A focused retry is your highest-impact action.`,
      href: `/topic/${weakest.topicId}`,
      cta: "Start repair",
    },
    recall && recall.topicId !== weakest?.topicId && {
      label: "Keep it reliable",
      title: `Recall ${recall.topicName}`,
      detail: `This ${subjectName(recall.subjectId)} topic is due for spaced recall before it fades.`,
      href: `/topic/${recall.topicId}`,
      cta: "Start recall",
    },
    coverageSubject && {
      label: "Grow coverage",
      title: `Add one ${coverageSubject.name} signal`,
      detail: `${coveredBySubject.get(coverageSubject.id) ?? 0} topics started here so far. One focused quiz gives the Coach better evidence for tomorrow.`,
      href: `/subject/${coverageSubject.id}`,
      cta: "Choose a topic",
    },
  ].filter(Boolean) as Array<{ label: string; title: string; detail: string; href: string; cta: string }>;

  return (
    <main className="coach-stage min-h-[100svh] pb-20">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900">ExamGrind</Link>
        <Link href="/home" className="text-sm font-bold text-ember-700">Home →</Link>
      </header>
      <section className="mx-auto max-w-4xl px-5 pt-4">
        {founderPreview && !isCoach && <p className="mb-3 rounded-xl bg-sun-400/20 px-3 py-2 text-center text-xs font-bold text-cocoa-900">Founder preview — students need an active Coach plan to use this live briefing.</p>}
        <div className="coach-cover rounded-3xl bg-gradient-to-br from-cocoa-900 via-cocoa-900 to-ember-900 p-6 text-cream-50 shadow-warm-lg sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-sun-300">ExamGrind Coach · live briefing</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Here&apos;s exactly what to do next.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-cream-100/80">{today} · Based on your completed {exam?.name ?? "exam"} practice. This briefing changes after each finished quiz or mock.</p></div><Chick state="excited" size={76} /></div>
        </div>
      </section>
      <section className="mx-auto mt-6 max-w-4xl px-5">
        <div className="coach-section-head mb-3"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Your adaptive action queue</p><h2 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">No generic motivation. Just the next best work.</h2></div>
        <ol className="coach-action-grid grid gap-4 md:grid-cols-3">
          {actions.map((action, index) => <li key={action.href} className="coach-action-card flex min-h-64 flex-col rounded-3xl border border-cocoa-900/[.07] bg-cream-50 p-5 shadow-warm"><span className="coach-action-number flex h-7 w-7 items-center justify-center rounded-full bg-sun-400 text-xs font-bold text-cocoa-900">{index + 1}</span><p className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-ember-700">{action.label}</p><h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">{action.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-cocoa-700">{action.detail}</p><Link href={action.href} className="mt-5 inline-flex font-bold text-ember-700 hover:text-ember-800">{action.cta} →</Link></li>)}
        </ol>
        {actions.length === 0 && <div className="rounded-3xl border border-cocoa-900/[.07] bg-cream-50 p-6 text-cocoa-700 shadow-warm"><h2 className="font-serif text-2xl font-bold text-cocoa-900">Start with one focused quiz.</h2><p className="mt-2 text-sm">Once you complete it, your Coach will turn that result into a precise repair and revision plan.</p><Link href="/home" className="mt-4 inline-flex font-bold text-ember-700">Choose a subject →</Link></div>}
      </section>
      <CoachLearningStudio topics={learningTopics} priorityTopicIds={weakSignals.map((signal) => signal.topicId)} />
      <section className="mx-auto mt-6 grid max-w-4xl gap-3 px-5 sm:grid-cols-3">
        <CoachMetric href="/home" label="Topics studied" value={String(signals.length)} detail="Open your syllabus and continue coverage." />
        <CoachMetric href={weakSignals[0] ? `/topic/${weakSignals[0].topicId}` : "/mistakes"} label="Repair queue" value={String(weakSignals.length)} detail={weakSignals.length ? "Open your highest-impact repair." : "Open Mistake Book."} />
        <CoachMetric href={recallSignals[0] ? `/topic/${recallSignals[0].topicId}` : "/revision"} label="Revision due" value={String(recallSignals.length)} detail={recallSignals.length ? "Start the next recall round." : "Open Smart Revision."} />
      </section>
      <section className="mx-auto mt-6 grid max-w-4xl gap-4 px-5 md:grid-cols-2">
        <div className="rounded-3xl border border-cocoa-900/[.07] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Coach diagnosis</p><h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">What needs attention</h2>{weakSignals.length ? <ol className="mt-4 space-y-3">{weakSignals.map((signal, index) => <li key={signal.topicId} className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-3 py-3"><div><p className="text-sm font-bold text-cocoa-900">{index + 1}. {signal.topicName}</p><p className="text-xs text-cocoa-600">{subjectName(signal.subjectId)} · {Math.round(signal.accuracy * 100)}% accuracy</p></div><Link href={`/topic/${signal.topicId}`} className="text-xs font-bold text-ember-700">Repair →</Link></li>)}</ol> : <p className="mt-3 text-sm leading-6 text-cocoa-700">Complete a few quizzes and Coach will rank the concepts costing you the most marks.</p>}</div>
        <div className="rounded-3xl border border-cocoa-900/[.07] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Retention plan</p><h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">What to revisit</h2>{recallSignals.length ? <ol className="mt-4 space-y-3">{recallSignals.map((signal) => <li key={signal.topicId} className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-3 py-3"><div><p className="text-sm font-bold text-cocoa-900">{signal.topicName}</p><p className="text-xs text-cocoa-600">{subjectName(signal.subjectId)} · recall is due</p></div><Link href={`/topic/${signal.topicId}`} className="text-xs font-bold text-ember-700">Recall →</Link></li>)}</ol> : <p className="mt-3 text-sm leading-6 text-cocoa-700">Your revision queue will appear here as soon as Coach has enough completed practice to schedule spaced recall.</p>}</div>
      </section>
      <section className="mx-auto mt-6 max-w-4xl px-5"><div className="rounded-3xl border border-moss-500/20 bg-moss-500/10 p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-moss-700">Why Coach is different</p><p className="mt-2 text-sm leading-6 text-cocoa-800">Your ₹49 Score Boost is a fixed 21-day roadmap. Coach is the living layer: it reads each new quiz or mock, then changes the next actions as your strengths and weak areas change.</p></div></section>
    </main>
  );
}

function CoachMetric({ href, label, value, detail }: { href: string; label: string; value: string; detail: string }) {
  return <Link href={href} className="coach-metric rounded-2xl border border-cocoa-900/[.07] bg-cream-50 p-4 shadow-warm transition hover:-translate-y-0.5 hover:bg-white"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cocoa-500">{label}</p><p className="mt-1 font-serif text-3xl font-bold text-cocoa-900">{value}</p><p className="mt-1 text-xs leading-relaxed text-cocoa-600">{detail}</p><p className="mt-3 text-xs font-bold text-ember-700">Open →</p></Link>;
}
