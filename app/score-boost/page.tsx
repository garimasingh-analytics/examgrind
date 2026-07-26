import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";
import { ensureSubscriptionFreshness } from "@/lib/subscription";

export const dynamic = "force-dynamic";

type RoadmapDay = { day: number; subject: string; focus: string; action: string };
type Entitlement = { id: string; expires_at: string; roadmap: RoadmapDay[] | null };

function makeRoadmap(subjects: string[]): RoadmapDay[] {
  const usable = subjects.length ? subjects : ["your selected exam syllabus"];
  return Array.from({ length: 21 }, (_, index) => {
    const day = index + 1;
    const subject = usable[index % usable.length];
    const phase = day <= 7 ? "Foundation" : day <= 14 ? "Repair" : "Exam mode";
    const action = day % 7 === 0
      ? "Review mistakes, revise your notes, then take one timed mixed quiz."
      : day <= 7
      ? "Learn one small topic, attempt a focused quiz, and write down each error."
      : day <= 14
      ? "Start with your weakest area, then do a timed repair round."
      : "Take a timed mixed set, analyse every error, and revise the weakest concept.";
    return { day, subject, focus: phase, action };
  });
}

export default async function ScoreBoostPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const admin = createAdminSupabase();
  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice, subscription_status, paid_until")
    .eq("id", user.id)
    .maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid"; paid_until: string | null }>();
  const isCoach = (await ensureSubscriptionFreshness(user.id, profile?.subscription_status ?? "free", profile?.paid_until ?? null)) === "paid";
  const { data: entitlement } = await admin
    .from("purchase_entitlements")
    .select("id, expires_at, roadmap")
    .eq("user_id", user.id)
    .eq("product", "score_boost_21d")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Entitlement>();
  if (!isCoach && !entitlement) redirect("/home");

  let roadmap = entitlement?.roadmap ?? null;
  if (!roadmap) {
    const { data: exam } = await admin.from("exams").select("id").eq("slug", profile?.exam_choice ?? "cuet").maybeSingle<{ id: string }>();
    const { data: subjects } = exam?.id
      ? await admin.from("subjects").select("name").eq("exam_id", exam.id).order("order_index", { ascending: true })
      : { data: [] as Array<{ name: string }> };
    roadmap = makeRoadmap((subjects ?? []).map((subject) => subject.name));
    if (entitlement) {
      await admin.from("purchase_entitlements").update({ roadmap }).eq("id", entitlement.id);
    }
  }
  const today = Math.max(1, Math.min(21, 21 - Math.ceil(((new Date(entitlement?.expires_at ?? Date.now()).getTime() - Date.now()) / 86400000))));
  const todayPlan = roadmap[today - 1] ?? roadmap[0];

  return <main className="min-h-screen bg-warm-wash pb-16">
    <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><Link href="/home" className="font-serif text-xl font-bold text-cocoa-900">ExamGrind</Link><Link href="/home" className="text-sm font-semibold text-cocoa-700">Home</Link></header>
    <section className="mx-auto max-w-3xl px-5"><div className="rounded-3xl bg-cocoa-900 p-6 text-cream-50 shadow-warm-lg sm:p-8"><Chick state="excited" size={84}/><p className="mt-3 text-xs font-bold uppercase tracking-[.18em] text-sun-400">21-Day Score Boost</p><h1 className="mt-1 font-serif text-3xl font-bold">A clear plan. One day at a time.</h1><p className="mt-2 max-w-xl text-sm text-cream-100/80">This is your fixed roadmap. It does not auto-renew or make extra AI calls.</p></div>
      <div className="mt-6 rounded-3xl border border-ember-600/20 bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-wider text-ember-700">Day {today} · today&apos;s focus</p><h2 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">{todayPlan.subject}</h2><p className="mt-1 text-sm font-semibold text-cocoa-700">{todayPlan.focus}</p><p className="mt-3 text-sm leading-relaxed text-cocoa-700">{todayPlan.action}</p><Link href="/home" className="mt-4 inline-flex rounded-xl bg-ember-600 px-4 py-2.5 text-sm font-bold text-cream-50">Start today&apos;s practice</Link></div>
      <ol className="mt-6 space-y-3">{roadmap.map((day) => <li key={day.day} className="rounded-2xl border border-cocoa-900/[.06] bg-cream-50 p-4"><div className="flex items-baseline justify-between gap-3"><strong className="text-cocoa-900">Day {day.day}: {day.subject}</strong><span className="text-xs font-semibold text-cocoa-500">{day.focus}</span></div><p className="mt-1 text-sm text-cocoa-700">{day.action}</p></li>)}</ol>
    </section></main>;
}
