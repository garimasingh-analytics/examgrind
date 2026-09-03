import type { Metadata } from "next";
import Link from "next/link";
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
  what_it_is: string;
  who_it_is_for: string;
  why_it_matters: string;
  exam_links: unknown;
  official_source_title: string;
  official_source_url: string;
  last_official_check: string;
};

const tags = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export default async function GovernmentSchemesPage() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("government_schemes")
    .select("slug, name, ministry, what_it_is, who_it_is_for, why_it_matters, exam_links, official_source_title, official_source_url, last_official_check")
    .eq("status", "active")
    .order("name");
  const schemes = (data ?? []) as Scheme[];

  return <main className="min-h-[100svh] bg-warm-wash pb-16 text-cocoa-900">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
      <div className="flex items-center gap-3"><Link href="/current-affairs" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">Current Affairs</Link><Link href="/guides" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">Study Guides</Link></div>
    </header>
    <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-ember-700">Always free · static revision desk</p>
      <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[.96] tracking-tight sm:text-6xl">Government schemes, without the coaching-note fog.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-cocoa-700">Each card explains the scheme, who it is for, why it matters in an exam, and links back to the official source. We update this library when an official change becomes relevant.</p>
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {schemes.map((scheme) => <article key={scheme.slug} className="rounded-[2rem] border border-cocoa-900/[.09] bg-cream-50 p-6 shadow-warm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-ember-700">{scheme.ministry}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">{scheme.name}</h2>
          <section className="mt-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">What it is</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.what_it_is}</p></section>
          <section className="mt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">Who it is for</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.who_it_is_for}</p></section>
          <section className="mt-4 rounded-2xl bg-sun-300/20 p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-ember-700">Why an aspirant should remember it</p><p className="mt-2 leading-7 text-cocoa-800">{scheme.why_it_matters}</p></section>
          {tags(scheme.exam_links).length ? <div className="mt-4 flex flex-wrap gap-2">{tags(scheme.exam_links).map((tag) => <span key={tag} className="rounded-full bg-warm-wash px-3 py-1 text-xs font-bold text-cocoa-700">{tag}</span>)}</div> : null}
          <div className="mt-5 border-t border-cocoa-900/[.08] pt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-cocoa-500">Official source</p><a href={scheme.official_source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">{scheme.official_source_title} ↗</a><p className="mt-2 text-xs text-cocoa-500">Last official check: {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${scheme.last_official_check}T12:00:00`))}</p></div>
        </article>)}
      </div>
    </section>
  </main>;
}
