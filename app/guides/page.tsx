import type { Metadata } from "next";
import Link from "next/link";
import { studyGuides } from "@/lib/study-guides";

export const metadata: Metadata = {
  title: "Free SSC CGL study guides · ExamGrind",
  description: "Practical, original SSC CGL guides for mock analysis, revision, mistakes and focused score improvement.",
};

export default function GuidesPage() {
  return (
    <main className="min-h-[100svh] bg-warm-wash text-cocoa-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
        <Link href="/ssc-cgl-2026" className="rounded-full bg-cocoa-900 px-4 py-2 text-sm font-bold text-cream-50">Try SSC diagnosis →</Link>
      </header>
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-700">The ExamGrind study desk</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-6xl">Useful SSC CGL study guides. No filler.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa-700">Clear ways to analyse a mock, revise what you forget, and turn repeated mistakes into a practical next session.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {studyGuides.map((guide, index) => (
            <article key={guide.slug} className={`rounded-[2rem] border p-6 shadow-warm sm:p-8 ${index % 2 === 0 ? "border-coral-500/20 bg-cream-50" : "border-cocoa-900/[0.08] bg-sun-400/10"}`}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cocoa-500">{guide.eyebrow} · {guide.readTime}</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight"><Link href={`/guides/${guide.slug}`} className="transition hover:text-coral-700">{guide.title}</Link></h2>
              <p className="mt-4 leading-7 text-cocoa-700">{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">Read the guide →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
