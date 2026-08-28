import type { Metadata } from "next";
import Link from "next/link";
import { examGuideMeta, studyGuides } from "@/lib/study-guides";
import { StudyHubViewed } from "@/components/StudyHubTracking";

export const metadata: Metadata = {
  title: "Free study guides for competitive exams · ExamGrind",
  description: "Practical, original study guides for SSC CGL, Delhi Police, CUET, NEET, UPPSC RO/ARO, UP Secretariat RO/ARO and UPPSC PCS: preparation, revision and focused improvement.",
};

type GuideHubProps = { searchParams: Promise<{ exam?: string }> };
const examSlugs = ["ssc-cgl", "delhi-police-constable", "cuet", "neet-ug", "uppsc-ro-aro", "up-secretariat-ro-aro", "uppsc-pcs"] as const;

export default async function GuidesPage({ searchParams }: GuideHubProps) {
  const { exam } = await searchParams;
  const selectedExam = examSlugs.includes(exam as (typeof examSlugs)[number])
    ? exam as (typeof examSlugs)[number]
    : null;
  const visibleGuides = selectedExam
    ? studyGuides.filter((guide) => guide.examSlug === selectedExam)
    : studyGuides;
  const headline = selectedExam
    ? `Useful ${examGuideMeta[selectedExam].label} study guides. No filler.`
    : "Useful study guides. No filler.";
  const intro = selectedExam
    ? `Clear ways to prepare for ${examGuideMeta[selectedExam].label}, analyse attempts, revise what you forget, and turn repeated mistakes into a practical next session.`
    : "Clear ways to prepare, analyse attempts, revise what you forget, and turn repeated mistakes into a practical next session.";

  return (
    <main className="min-h-[100svh] bg-warm-wash text-cocoa-900">
      <StudyHubViewed surface="guides" examScope={selectedExam ?? "all"} />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
        <Link href={selectedExam ? examGuideMeta[selectedExam].diagnosisHref : "/"} className="rounded-full bg-cocoa-900 px-4 py-2 text-sm font-bold text-cream-50">{selectedExam ? `Try ${examGuideMeta[selectedExam].label} diagnosis →` : "Start a diagnosis →"}</Link>
      </header>
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-700">The ExamGrind study desk</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-6xl">{headline}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa-700">{intro}</p>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filter guides by exam">
          <GuideFilter href="/guides" label="All guides" active={!selectedExam} />
          {examSlugs.map((slug) => <GuideFilter key={slug} href={`/guides?exam=${slug}`} label={examGuideMeta[slug].label} active={selectedExam === slug} />)}
        </nav>
        <section className="mt-8 rounded-[2rem] border border-cocoa-900/[.08] bg-sun-400/10 p-6 shadow-warm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Official updates desk</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">Exam dates and notices belong at the official source.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">Use our source desk for the right official exam portal, then return here for preparation guidance. We never turn a social-media rumour into a deadline.</p>
          </div>
          <Link href="/updates" className="mt-4 inline-flex shrink-0 rounded-full bg-cocoa-900 px-5 py-3 text-sm font-bold text-cream-50 sm:mt-0">Open updates desk →</Link>
        </section>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {visibleGuides.map((guide, index) => (
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

function GuideFilter({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <Link href={href} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${active ? "border-cocoa-900 bg-cocoa-900 text-cream-50" : "border-cocoa-900/10 bg-cream-50 text-cocoa-700 hover:border-cocoa-900/30"}`}>{label}</Link>;
}
