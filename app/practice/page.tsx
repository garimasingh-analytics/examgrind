import Link from "next/link";
import { redirect } from "next/navigation";
import StudentPageHeader from "@/components/StudentPageHeader";
import SubjectGrid, { type SubjectWithProgress } from "@/components/SubjectGrid";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Profile = { exam_choice: string | null };
type Subject = { id: string; name: string; cuet_code: string | null; icon: string | null };

export default async function PracticePage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("users").select("exam_choice").eq("id", user.id).maybeSingle<Profile>();
  const examSlug = profile?.exam_choice ?? "cuet";
  const { data: exam } = await supabase.from("exams").select("id, name").eq("slug", examSlug).maybeSingle<{ id: string; name: string }>();
  const { data: subjectsData } = exam?.id
    ? await supabase.from("subjects").select("id, name, cuet_code, icon").eq("exam_id", exam.id).eq("is_active", true).order("order_index")
    : { data: [] };
  const subjects = (subjectsData ?? []) as Subject[];
  const subjectIds = subjects.map((subject) => subject.id);
  const [{ data: countsData }, { data: masteryData }] = subjectIds.length ? await Promise.all([
    supabase.from("subject_topic_counts").select("subject_id, topic_count").in("subject_id", subjectIds),
    supabase.from("user_topic_mastery").select("mastery_level, topics!inner(chapters!inner(subject_id))").eq("user_id", user.id),
  ]) : [{ data: [] }, { data: [] }];
  const totals = new Map((countsData ?? []).map((row) => [row.subject_id as string, Number(row.topic_count ?? 0)]));
  const attempted = new Map<string, number>();
  const mastered = new Map<string, number>();
  type MasteryRelation = { mastery_level: string; topics: Array<{ chapters: Array<{ subject_id: string }> }> };
  for (const row of (masteryData ?? []) as unknown as MasteryRelation[]) {
    const subjectId = row.topics?.[0]?.chapters?.[0]?.subject_id;
    if (!subjectId || !subjectIds.includes(subjectId)) continue;
    attempted.set(subjectId, (attempted.get(subjectId) ?? 0) + 1);
    if (row.mastery_level === "master") mastered.set(subjectId, (mastered.get(subjectId) ?? 0) + 1);
  }
  const gridSubjects: SubjectWithProgress[] = subjects.map((subject) => ({ ...subject, total: totals.get(subject.id) ?? 0, attempted: attempted.get(subject.id) ?? 0, mastered: mastered.get(subject.id) ?? 0 }));

  return <main className="min-h-[100svh] bg-warm-wash pb-28"><StudentPageHeader examSlug={examSlug} section="Practice" /><section className="mx-auto max-w-5xl px-4 pt-3 sm:px-6 sm:pt-7"><div className="border-y border-cocoa-900/[.13] bg-cocoa-900 px-5 py-7 text-cream-50 shadow-warm-lg sm:px-8 sm:py-9"><p className="eg-kicker text-sun-300">Practice · {exam?.name ?? "Your exam"}</p><h1 className="mt-2 font-serif text-4xl font-bold leading-[.92] tracking-[-.055em] sm:text-6xl">Turn one topic into proof.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-cream-100/80">Choose a subject, answer a focused round, and open Deep Analysis before moving to the next thing.</p><div className="mt-5 flex flex-wrap gap-4"><Link href="/mock" className="rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900">Take a mock →</Link><Link href="/recovery" className="border-b border-cream-50/40 pb-0.5 text-sm font-bold text-cream-50">Open a repair round →</Link></div></div></section><section className="mx-auto mt-6 max-w-5xl px-4 sm:px-6"><div className="syllabus-issue"><div className="syllabus-head"><p className="eg-kicker text-cream-50/70">Choose a subject</p><h2 className="mt-1 font-serif text-3xl font-semibold leading-[.92] tracking-[-.045em] text-cream-50">What do you want to practise?</h2></div><div className="syllabus-body"><SubjectGrid subjects={gridSubjects} /></div></div></section></main>;
}
