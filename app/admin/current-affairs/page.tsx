import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";
import CurrentAffairsEditor from "./CurrentAffairsEditor";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsAdminPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  if (!isAdminEmail(user.email)) redirect("/home");
  const admin = createAdminSupabase();
  const archiveStart = "2026-01-01";
  const [{ data: exams }, { data: subjectRows }, { data: publishedBriefs }] = await Promise.all([
    admin.from("exams").select("id, slug, name").eq("status", "live").order("display_order"),
    admin.from("subjects").select("id, name, exam_id, exams!inner(name)").eq("is_active", true).order("order_index"),
    admin.from("current_affairs_briefs").select("published_on").eq("status", "published").gte("published_on", archiveStart),
  ]);
  type SubjectRow = { id: string; name: string; exams: { name: string } | { name: string }[] | null };
  const subjects = ((subjectRows ?? []) as unknown as SubjectRow[]).map((subject) => ({ id: subject.id, name: subject.name, examName: Array.isArray(subject.exams) ? subject.exams[0]?.name ?? "Exam" : subject.exams?.name ?? "Exam" }));
  const publishedDates = new Set((publishedBriefs ?? []).map((brief) => brief.published_on));
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const dayCount = Math.max(1, Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${archiveStart}T00:00:00Z`)) / 86_400_000) + 1);
  const coveredDays = publishedDates.size;
  return <main className="min-h-[100svh] bg-warm-wash px-5 py-8 text-cocoa-900 sm:px-8"><header className="mx-auto flex max-w-4xl items-center justify-between"><Link href="/admin" className="text-sm font-bold text-ember-700">← Admin</Link><Link href="/current-affairs" className="text-sm font-bold text-cocoa-700">View public hub →</Link></header><section className="mx-auto mt-8 max-w-4xl space-y-6"><section className="rounded-[2rem] border border-cocoa-900/[.08] bg-cream-50 p-6 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Editorial coverage</p><div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-serif text-3xl font-semibold tracking-tight">Source-backed archive, not filler.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">Every published brief needs a primary source, original explanation, exam relevance and a recall check. The 5 a.m. India source desk checks official coverage; this meter keeps the historic archive accountable.</p></div><div className="rounded-2xl bg-warm-wash px-5 py-4 text-left sm:text-right"><p className="text-2xl font-bold text-cocoa-900">{coveredDays} <span className="text-base font-medium text-cocoa-600">/ {dayCount} days</span></p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-cocoa-600">covered since 1 Jan 2026</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-cocoa-900/[.08]"><div className="h-full rounded-full bg-ember-700 transition-all" style={{ width: `${Math.min(100, Math.round((coveredDays / dayCount) * 100))}%` }} /></div></section><CurrentAffairsEditor exams={(exams ?? []).map((exam) => ({ slug: exam.slug, name: exam.name }))} subjects={subjects} /></section></main>;
}
