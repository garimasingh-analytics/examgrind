import type { Metadata } from "next";
import Link from "next/link";
import StudentPageHeader from "@/components/StudentPageHeader";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Government schemes for competitive exams · ExamGrind",
  description: "Free, source-linked government scheme notes for competitive-exam revision.",
};

export const dynamic = "force-dynamic";

type Scheme = {
  slug: string;
  name: string;
  ministry: string;
  category: string;
  government_level: string;
  what_it_is: string;
  who_it_is_for: string;
  benefit_summary: string | null;
  eligibility_summary: string | null;
  benefit_details: string | null;
  application_process: string | null;
  documents_and_conditions: string | null;
  exam_answer: string | null;
  factsheet_verified: boolean;
  why_it_matters: string;
  exam_links: unknown;
  official_source_title: string;
  official_source_url: string;
  last_official_check: string;
};

const tags = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
type PageProps = { searchParams: Promise<{ category?: string }> };

export default async function GovernmentSchemesPage({ searchParams }: PageProps) {
  const { category: requestedCategory } = await searchParams;
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const schemesQuery = supabase
    .from("government_schemes")
    .select("slug, name, ministry, category, government_level, what_it_is, who_it_is_for, benefit_summary, eligibility_summary, benefit_details, application_process, documents_and_conditions, exam_answer, factsheet_verified, why_it_matters, exam_links, official_source_title, official_source_url, last_official_check")
    .eq("status", "active")
    .eq("government_level", "central")
    .order("name");
  if (requestedCategory) schemesQuery.eq("category", requestedCategory);
  const [{ data }, { data: allSchemesRaw }, { data: profile }] = await Promise.all([
    schemesQuery,
    supabase.from("government_schemes").select("category").eq("status", "active").eq("government_level", "central"),
    user
      ? supabase.from("users").select("exam_choice").eq("id", user.id).maybeSingle<{ exam_choice: string | null }>()
      : Promise.resolve({ data: null }),
  ]);
  const schemes = (data ?? []) as Scheme[];
  const categoryCounts = new Map<string, number>();
  for (const row of (allSchemesRaw ?? []) as Array<{ category: string }>) categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
  const categories = Array.from(categoryCounts.entries()).sort(([a], [b]) => a.localeCompare(b));
  const examSlug = profile?.exam_choice ?? "cuet";

  return <main className="min-h-[100svh] bg-warm-wash pb-16 text-cocoa-900">
    {user ? <StudentPageHeader examSlug={examSlug} section="Stay current" /> : <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8"><Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link><div className="flex items-center gap-3"><Link href="/current-affairs" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">Current Affairs</Link><Link href="/guides" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">Study Guides</Link></div></header>}
    <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-ember-700">Always free · official-source revision desk</p>
      <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-[.96] tracking-tight sm:text-6xl">Government schemes for exam preparation.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-cocoa-700">Use this free library to revise what a scheme does, who can use it, its benefits and how to apply. Each card links to the official scheme page.</p>
      <section className="mt-7 rounded-[1.6rem] border border-cocoa-900/[.09] bg-cream-50 p-5 shadow-warm"><p className="text-sm font-bold text-cocoa-900">{categoryCounts.size ? Array.from(categoryCounts.values()).reduce((total, count) => total + count, 0) : 0} Central schemes in this library</p><p className="mt-2 max-w-3xl text-sm leading-6 text-cocoa-700">Some schemes already include full eligibility, benefit, application and condition details. We are adding the same level of detail to every remaining scheme from its official source.</p></section>
      <nav aria-label="Filter government schemes by category" className="mt-7 flex flex-wrap gap-2"><Link href="/government-schemes" className={`rounded-full px-4 py-2 text-sm font-bold transition ${!requestedCategory ? "bg-cocoa-900 text-cream-50" : "border border-cocoa-900/[.12] bg-cream-50 text-cocoa-700 hover:border-ember-600"}`}>All Central schemes</Link>{categories.map(([category, count]) => <Link key={category} href={`/government-schemes?category=${encodeURIComponent(category)}`} className={`rounded-full px-4 py-2 text-sm font-bold transition ${requestedCategory === category ? "bg-cocoa-900 text-cream-50" : "border border-cocoa-900/[.12] bg-cream-50 text-cocoa-700 hover:border-ember-600"}`}>{category} <span className="opacity-60">{count}</span></Link>)}</nav>
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {schemes.map((scheme) => <article key={scheme.slug} className="rounded-[2rem] border border-cocoa-900/[.09] bg-cream-50 p-6 shadow-warm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[.15em] text-ember-700">{scheme.category}</p><span className="rounded-full bg-warm-wash px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-cocoa-600">Central scheme</span></div>
          <p className="mt-3 text-sm font-semibold text-cocoa-600">{scheme.ministry}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">{scheme.name}</h2>
          <section className="mt-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">What the scheme does</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.what_it_is}</p></section>
          <section className="mt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">Who it is for</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.eligibility_summary ?? scheme.who_it_is_for}</p></section>
          <section className="mt-4 rounded-2xl border border-ember-500/20 bg-ember-500/[.07] p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-ember-700">Current benefit</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.benefit_details ?? scheme.benefit_summary ?? "Open the official source for the current benefit and component-wise support."}</p></section>
          {scheme.factsheet_verified ? <>
            <section className="mt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">How to access it</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.application_process}</p></section>
            <section className="mt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">Conditions to know</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.documents_and_conditions}</p></section>
          </> : <p className="mt-4 rounded-2xl bg-warm-wash p-4 text-sm leading-6 text-cocoa-700">We are adding eligibility, documents and application steps from this scheme’s official source.</p>}
          <section className="mt-4 rounded-2xl bg-sun-300/20 p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-ember-700">Exam answer in one line</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.exam_answer ?? scheme.why_it_matters}</p></section>
          {tags(scheme.exam_links).length ? <div className="mt-4 flex flex-wrap gap-2">{tags(scheme.exam_links).map((tag) => <span key={tag} className="rounded-full bg-warm-wash px-3 py-1 text-xs font-bold text-cocoa-700">{tag}</span>)}</div> : null}
          <div className="mt-5 border-t border-cocoa-900/[.08] pt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">Official source</p><a href={scheme.official_source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">{scheme.official_source_title} ↗</a><p className="mt-2 text-xs text-cocoa-500">Last official check: {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${scheme.last_official_check}T12:00:00`))}</p></div>
        </article>)}
      </div>
    </section>
  </main>;
}
