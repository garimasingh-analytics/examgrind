import type { Metadata } from "next";
import Link from "next/link";
import CurrentAffairsCalendar from "@/components/CurrentAffairsCalendar";
import CurrentAffairsTracking from "@/components/CurrentAffairsTracking";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Daily current affairs for competitive exams · ExamGrind",
  description: "Free, source-backed daily current affairs with exam relevance, background concepts and quick recall checks.",
};

export const dynamic = "force-dynamic";

type Brief = {
  id: string; slug: string; published_on: string; title: string; summary: string; why_it_matters: string; background: string;
  source_title: string; source_url: string; source_publisher: string | null; source_published_on: string | null;
  prelims_takeaways: unknown; quick_check: unknown; visual_data: unknown;
};
type BriefWithTags = Brief & { tags: string[] };
type Visual = { title: string; steps: string[] };

type PageProps = { searchParams: Promise<{ date?: string }> };

function indiaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function safeDate(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : indiaToday();
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function quickChecks(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    return typeof record.question === "string" && typeof record.answer === "string" ? [{ question: record.question, answer: record.answer }] : [];
  });
}

function visual(value: unknown): Visual | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title : "";
  const steps = list(record.steps);
  return title && steps.length ? { title, steps } : null;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export default async function CurrentAffairsPage({ searchParams }: PageProps) {
  const { date } = await searchParams;
  const selectedDate = safeDate(date);
  const supabase = createServerSupabase();
  const [{ data: briefsRaw }, { data: datesRaw }] = await Promise.all([
    supabase.from("current_affairs_briefs").select("id, slug, published_on, title, summary, why_it_matters, background, source_title, source_url, source_publisher, source_published_on, prelims_takeaways, quick_check, visual_data").eq("status", "published").eq("published_on", selectedDate).order("created_at"),
    supabase.from("current_affairs_briefs").select("published_on").eq("status", "published").order("published_on", { ascending: false }).limit(366),
  ]);
  const briefs = (briefsRaw ?? []) as Brief[];
  const publishedDates = Array.from(new Set((datesRaw ?? []).map((item) => item.published_on)));
  const briefIds = briefs.map((brief) => brief.id);
  const [{ data: examTagsRaw }, { data: subjectTagsRaw }] = briefIds.length ? await Promise.all([
    supabase.from("current_affairs_exam_tags").select("brief_id, exams(name)").in("brief_id", briefIds),
    supabase.from("current_affairs_subject_tags").select("brief_id, subjects(name)").in("brief_id", briefIds),
  ]) : [{ data: [] }, { data: [] }];
  const tagsByBrief = new Map<string, string[]>();
  for (const row of [...(examTagsRaw ?? []), ...(subjectTagsRaw ?? [])] as Array<{ brief_id: string; exams?: { name?: string } | null; subjects?: { name?: string } | null }>) {
    const name = row.exams?.name ?? row.subjects?.name;
    if (name) tagsByBrief.set(row.brief_id, [...(tagsByBrief.get(row.brief_id) ?? []), name]);
  }
  const taggedBriefs: BriefWithTags[] = briefs.map((brief) => ({ ...brief, tags: Array.from(new Set(tagsByBrief.get(brief.id) ?? [])) }));

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-16 text-cocoa-900">
      <CurrentAffairsTracking date={selectedDate} briefCount={briefs.length} />
      <header className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-3"><Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link><div className="flex items-center gap-3"><Link href="/guides" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">Study Guides</Link><Link href="/diagnose" className="rounded-full bg-cocoa-900 px-4 py-2 text-sm font-bold text-cream-50">Find my weak topics →</Link></div></div>
        <nav aria-label="Current affairs resources" className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <Link href="/current-affairs" className="rounded-full bg-cocoa-900 px-4 py-3 text-center text-sm font-bold text-cream-50">Daily Current Affairs</Link>
          <Link href="/government-schemes" className="rounded-full border border-ember-700/20 bg-sun-300/25 px-4 py-3 text-center text-sm font-bold text-cocoa-900 transition hover:-translate-y-0.5">Government Schemes →</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-ember-700">The daily current-affairs desk</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[.96] tracking-tight sm:text-6xl">News is only useful when you know where it fits.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-cocoa-700">Free, source-backed briefs that connect a current event to the subject, background concept and recall you need for an exam.</p>
          <p className="mt-7 text-sm font-bold text-cocoa-700">{formatDate(selectedDate)}</p>
          {taggedBriefs.length === 0 ? <EmptyDay date={selectedDate} /> : <div className="mt-5 grid gap-5">{taggedBriefs.map((brief) => <BriefCard key={brief.id} brief={brief} />)}</div>}
        </div>
        <aside className="lg:sticky lg:top-6"><CurrentAffairsCalendar selectedDate={selectedDate} publishedDates={publishedDates} /><Link href="/government-schemes" className="mt-4 block rounded-[1.8rem] border border-ember-700/15 bg-sun-300/25 p-6 shadow-warm transition hover:-translate-y-0.5"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Static revision library</p><h2 className="mt-2 font-serif text-2xl font-semibold">Government Schemes →</h2><p className="mt-3 text-sm leading-6 text-cocoa-700">Keep the current update here. Learn the scheme behind it in one clean, source-linked card.</p></Link><section className="mt-4 rounded-[1.8rem] bg-cocoa-900 p-6 text-cream-50"><p className="text-xs font-bold uppercase tracking-[.16em] text-sun-300">Always free</p><h2 className="mt-2 font-serif text-2xl font-semibold">Read the brief. Then make it stick.</h2><p className="mt-3 text-sm leading-6 text-cream-100/75">ExamGrind keeps public current affairs free. Your paid learning route is the personalised practice, repair and revision that follows.</p></section></aside>
      </section>
    </main>
  );
}

function EmptyDay({ date }: { date: string }) {
  return <section className="mt-5 rounded-[2rem] border border-dashed border-cocoa-900/20 bg-cream-50 p-7 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">No brief yet</p><h2 className="mt-3 font-serif text-3xl font-semibold">Nothing has been published for {formatDate(date)}.</h2><p className="mt-3 max-w-xl leading-7 text-cocoa-700">We publish only when a brief has an original explanation, clear exam relevance and a checkable source—not simply because a news cycle is moving.</p><Link href="/guides" className="mt-5 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">Use a study guide while you wait →</Link></section>;
}

function BriefCard({ brief }: { brief: BriefWithTags }) {
  const takeaways = list(brief.prelims_takeaways);
  const checks = quickChecks(brief.quick_check);
  const conceptMap = visual(brief.visual_data);
  return <article className="overflow-hidden rounded-[2rem] border border-cocoa-900/[.09] bg-cream-50 shadow-warm"><div className="border-b border-cocoa-900/[.08] bg-sun-300/20 px-6 py-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Source-backed brief</p><h2 className="mt-2 font-serif text-3xl font-semibold leading-tight">{brief.title}</h2>{brief.tags.length ? <div className="mt-3 flex flex-wrap gap-2">{brief.tags.map((tag) => <span key={tag} className="rounded-full bg-cream-50 px-3 py-1 text-xs font-bold text-cocoa-700">{tag}</span>)}</div> : null}<p className="mt-3 max-w-3xl leading-7 text-cocoa-700">{brief.summary}</p></div><div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8"><section><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Why it matters</p><p className="mt-2 leading-7 text-cocoa-800">{brief.why_it_matters}</p></section><section><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Background you need</p><p className="mt-2 leading-7 text-cocoa-800">{brief.background}</p></section>{conceptMap ? <section className="sm:col-span-2 rounded-2xl bg-cocoa-900 p-5 text-cream-50"><p className="text-xs font-bold uppercase tracking-[.16em] text-sun-300">Concept map</p><h3 className="mt-2 font-serif text-2xl font-semibold">{conceptMap.title}</h3><ol className="mt-4 grid gap-3 sm:grid-cols-2">{conceptMap.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl bg-cream-50/10 p-3 text-sm leading-6"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sun-300 font-bold text-cocoa-900">{index + 1}</span>{step}</li>)}</ol></section> : null}{takeaways.length > 0 ? <section className="sm:col-span-2 rounded-2xl bg-warm-wash p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Prelims recall</p><ul className="mt-3 grid gap-2 sm:grid-cols-2">{takeaways.map((item) => <li key={item} className="text-sm leading-6 text-cocoa-800">• {item}</li>)}</ul></section> : null}{checks.length > 0 ? <section className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Quick check</p><div className="mt-3 grid gap-3">{checks.map((check) => <details key={check.question} className="rounded-2xl border border-cocoa-900/[.08] p-4"><summary className="cursor-pointer font-bold text-cocoa-900">{check.question}</summary><p className="mt-3 text-sm leading-6 text-cocoa-700">{check.answer}</p></details>)}</div></section> : null}<section className="sm:col-span-2 border-t border-cocoa-900/[.08] pt-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Original source</p><a href={brief.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">{brief.source_title}{brief.source_publisher ? ` · ${brief.source_publisher}` : ""} ↗</a></section></div></article>;
}
