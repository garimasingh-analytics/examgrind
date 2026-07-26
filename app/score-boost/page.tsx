import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";
import { ensureSubscriptionFreshness } from "@/lib/subscription";

export const dynamic = "force-dynamic";

type RoadmapDay = { day: number; subject: string; focus: string; action: string };
type Entitlement = {
  id: string;
  starts_at: string;
  expires_at: string;
  roadmap: RoadmapDay[] | null;
};
type FocusSignal = { concept: string; evidence: string; severity: "high" | "medium" | "low" };

function signalsFromAnalyses(analyses: Array<{ analysis: unknown }>): FocusSignal[] {
  const seen = new Set<string>();
  const signals: FocusSignal[] = [];
  for (const row of analyses) {
    const analysis = row.analysis && typeof row.analysis === "object"
      ? row.analysis as { weaknesses?: unknown }
      : null;
    const weaknesses = Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [];
    for (const item of weaknesses) {
      if (!item || typeof item !== "object") continue;
      const weakness = item as { concept?: unknown; evidence?: unknown; severity?: unknown };
      const concept = typeof weakness.concept === "string" ? weakness.concept.trim() : "";
      if (!concept || seen.has(concept.toLowerCase())) continue;
      seen.add(concept.toLowerCase());
      signals.push({
        concept,
        evidence: typeof weakness.evidence === "string" ? weakness.evidence.trim() : "",
        severity: weakness.severity === "high" || weakness.severity === "low" ? weakness.severity : "medium",
      });
    }
  }
  return signals.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]));
}

function makeRoadmap(subjects: string[], signals: FocusSignal[]): RoadmapDay[] {
  const usableSubjects = subjects.length ? subjects : ["your selected exam syllabus"];
  const usableSignals = signals.length
    ? signals
    : usableSubjects.map((subject) => ({ concept: subject, evidence: "Build a reliable baseline before moving on.", severity: "medium" as const }));
  return Array.from({ length: 21 }, (_, index) => {
    const day = index + 1;
    const signal = usableSignals[index % usableSignals.length];
    const subject = signal.concept;
    const phase = day <= 7 ? "Foundation" : day <= 14 ? "Repair" : "Exam mode";
    const action = day % 7 === 0
      ? `Review every error around ${subject}, revise your notes, then take one timed mixed quiz.`
      : day <= 7
      ? `Spend 20 minutes rebuilding ${subject}, then attempt a focused quiz and log each error.${signal.evidence ? ` Your recent signal: ${signal.evidence}` : ""}`
      : day <= 14
      ? `Start with ${subject}, then do a timed repair round without notes.`
      : `Take a timed mixed set with ${subject} in focus, analyse every error, and revise the rule you missed.`;
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
    .select("id, starts_at, expires_at, roadmap")
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
    // Score Boost is a fixed paid product: take one performance snapshot when
    // the roadmap is first opened, then persist it. Later quizzes never
    // silently rewrite the plan or consume additional AI credits.
    const { data: analyses } = await admin
      .from("quiz_analyses")
      .select("analysis")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false })
      .limit(5);
    roadmap = makeRoadmap(
      (subjects ?? []).map((subject) => subject.name),
      signalsFromAnalyses((analyses ?? []) as Array<{ analysis: unknown }>)
    );
    if (entitlement) {
      await admin.from("purchase_entitlements").update({ roadmap }).eq("id", entitlement.id);
    }
  }
  const today = entitlement
    ? Math.max(1, Math.min(21, Math.floor((Date.now() - new Date(entitlement.starts_at).getTime()) / 86400000) + 1))
    : 1;
  const todayPlan = roadmap[today - 1] ?? roadmap[0];
  const startsAt = entitlement ? new Date(entitlement.starts_at) : new Date();
  const revisionDays = [3, 7, 14, 21].map((day) => {
    const date = new Date(startsAt);
    date.setDate(date.getDate() + day - 1);
    return { day, date };
  });
  const formatDay = (date: Date) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short",
  }).format(date);

  return <main className="min-h-screen bg-warm-wash pb-16">
    <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><Link href="/home" className="font-serif text-xl font-bold text-cocoa-900">ExamGrind</Link><Link href="/home" className="text-sm font-semibold text-cocoa-700">Home</Link></header>
    <section className="mx-auto max-w-3xl px-5"><div className="rounded-3xl bg-cocoa-900 p-6 text-cream-50 shadow-warm-lg sm:p-8"><Chick state="excited" size={84}/><p className="mt-3 text-xs font-bold uppercase tracking-[.18em] text-sun-400">21-Day Score Boost</p><h1 className="mt-1 font-serif text-3xl font-bold">A clear plan. One day at a time.</h1><p className="mt-2 max-w-xl text-sm text-cream-100/80">This is your fixed roadmap. It does not auto-renew or make extra AI calls.</p></div>
      <div className="mt-6 rounded-3xl border border-ember-600/20 bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-wider text-ember-700">Day {today} · today&apos;s target</p><h2 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">{todayPlan.subject}</h2><p className="mt-1 text-sm font-semibold text-cocoa-700">{todayPlan.focus}</p><p className="mt-3 text-sm leading-relaxed text-cocoa-700">{todayPlan.action}</p><p className="mt-3 rounded-xl bg-sun-400/15 px-3 py-2 text-xs font-semibold text-cocoa-700">Today&apos;s completion rule: one focused practice session, then review every error before you stop.</p><Link href="/home" className="mt-4 inline-flex rounded-xl bg-ember-600 px-4 py-2.5 text-sm font-bold text-cream-50">Start today&apos;s practice</Link></div>
      <section className="mt-6 rounded-3xl border border-cocoa-900/[.06] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Fixed revision calendar</p><h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">Your planned recall checkpoints</h2><p className="mt-1 text-sm text-cocoa-700">These dates are part of your ₹49 plan. Revisit the concepts you repaired instead of only moving forward.</p><ol className="mt-4 grid gap-3 sm:grid-cols-4">{revisionDays.map(({ day, date }) => <li key={day} className={`rounded-2xl border p-3 ${day < today ? "border-moss-500/25 bg-moss-500/10" : day === today ? "border-ember-600/30 bg-sun-400/15" : "border-cocoa-900/[.06] bg-cream-100"}`}><p className="text-[10px] font-bold uppercase tracking-wider text-cocoa-500">Day {day}</p><p className="mt-1 font-serif text-lg font-bold text-cocoa-900">{formatDay(date)}</p><p className="mt-1 text-[11px] leading-relaxed text-cocoa-700">{day === 21 ? "Final mixed review" : "Recall + error review"}</p></li>)}</ol></section>
      <ol className="mt-6 space-y-3">{roadmap.map((day) => <li key={day.day} className="rounded-2xl border border-cocoa-900/[.06] bg-cream-50 p-4"><div className="flex items-baseline justify-between gap-3"><strong className="text-cocoa-900">Day {day.day}: {day.subject}</strong><span className="text-xs font-semibold text-cocoa-500">{day.focus}</span></div><p className="mt-1 text-sm text-cocoa-700">{day.action}</p></li>)}</ol>
    </section></main>;
}
