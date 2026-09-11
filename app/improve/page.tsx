import Link from "next/link";
import { redirect } from "next/navigation";
import StudentPageHeader from "@/components/StudentPageHeader";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RecentQuiz = { id: string; subject: string; subtopic: string | null; score: number | null; created_at: string };
type Profile = { exam_choice: string | null };

export default async function ImprovePage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const [{ data: profile }, { data: latestQuiz }] = await Promise.all([
    supabase.from("users").select("exam_choice").eq("id", user.id).maybeSingle<Profile>(),
    supabase.from("quizzes").select("id, subject, subtopic, score, created_at").eq("user_id", user.id).not("score", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle<RecentQuiz>(),
  ]);
  return <main className="min-h-[100svh] bg-warm-wash pb-28"><StudentPageHeader examSlug={profile?.exam_choice ?? "cuet"} section="Improve" /><section className="mx-auto max-w-5xl px-4 pt-3 sm:px-6 sm:pt-7"><div className="border-y border-ember-600/30 bg-cream-50 px-5 py-7 shadow-warm-lg sm:px-8 sm:py-10"><p className="eg-kicker text-ember-700">Improve</p><h1 className="mt-2 max-w-2xl font-serif text-4xl font-bold leading-[.92] tracking-[-.055em] text-cocoa-900 sm:text-6xl">Use each quiz to plan your next study session.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-cocoa-700">Review your mistakes, practise the topic with fresh questions and revisit it later.</p>{latestQuiz ? <Link href={`/results/${latestQuiz.id}#deep-analysis`} className="mt-6 inline-flex rounded-xl bg-ember-600 px-5 py-3 text-sm font-extrabold text-cream-50 transition hover:bg-ember-700">Review my latest quiz →</Link> : <Link href="/practice" className="mt-6 inline-flex rounded-xl bg-ember-600 px-5 py-3 text-sm font-extrabold text-cream-50 transition hover:bg-ember-700">Take your first quiz →</Link>}</div></section><section className="mx-auto mt-6 grid max-w-5xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3"><ImproveCard href="/recovery" number="01" label="Topics to revisit" detail="See which topics still need practice and start a fresh question set." /><ImproveCard href="/mistakes" number="02" label="Mistake Book" detail="Review wrong answers and spot the mistakes that keep repeating." /><ImproveCard href="/revision" number="03" label="Smart Revision" detail="Bring back topics at the right time so you do not forget them." /></section><section className="mx-auto mt-6 max-w-5xl px-4 sm:px-6"><div className="border-l-2 border-ember-600 bg-sun-300/15 px-5 py-5"><p className="eg-kicker text-ember-700">After every quiz</p><p className="mt-2 font-serif text-2xl font-bold tracking-[-.04em] text-cocoa-900">Review the mistakes before starting another quiz.</p><p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">Deep Analysis uses your answers, the correct answer, timing when available and the topic you attempted. It gives you a clear place to begin.</p></div></section></main>;
}

function ImproveCard({ href, number, label, detail }: { href: string; number: string; label: string; detail: string }) { return <Link href={href} className="group border-y border-cocoa-900/[.11] bg-cream-50 p-5 shadow-warm transition hover:bg-sun-300/10 hover:shadow-warm-lg"><span className="font-mono text-xs font-bold tracking-[.14em] text-ember-700">{number}</span><h2 className="mt-4 font-serif text-2xl font-bold tracking-[-.04em] text-cocoa-900">{label}</h2><p className="mt-2 min-h-16 text-sm leading-6 text-cocoa-700">{detail}</p><span className="mt-4 inline-flex text-sm font-bold text-ember-700">Open →</span></Link>; }
