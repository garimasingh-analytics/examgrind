import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { examGuideMeta, getStudyGuide, studyGuides } from "@/lib/study-guides";
import { StudyGuideViewed } from "@/components/StudyHubTracking";

type GuideProps = { params: { slug: string } };

export function generateStaticParams() {
  return studyGuides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: GuideProps): Metadata {
  const guide = getStudyGuide(params.slug);
  if (!guide) return {};
  return { title: `${guide.title} · ExamGrind`, description: guide.description };
}

export default function GuidePage({ params }: GuideProps) {
  const guide = getStudyGuide(params.slug);
  if (!guide) notFound();
  const exam = examGuideMeta[guide.examSlug];

  return (
    <main className="min-h-[100svh] bg-cream-50 text-cocoa-900">
      <StudyGuideViewed exam={guide.examSlug} guideSlug={guide.slug} />
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href={`/guides?exam=${guide.examSlug}`} className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">← {exam.label} guides</Link>
        <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-700">{guide.eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">{guide.title}</h1>
        <p className="mt-6 text-lg leading-8 text-cocoa-700">{guide.description}</p>
        <p className="mt-5 text-sm font-medium text-cocoa-500">{guide.readTime} · Updated {guide.publishedAt}</p>
        <div className="mt-12 space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[1.05rem] leading-8 text-cocoa-700">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets && <ul className="mt-5 space-y-3 rounded-2xl border border-cocoa-900/[0.08] bg-warm-wash p-5 text-cocoa-700">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="mt-1 text-coral-600">✦</span><span>{bullet}</span></li>)}</ul>}
            </section>
          ))}
        </div>
        <section className="mt-14 rounded-[2rem] bg-cocoa-900 p-7 text-cream-50 shadow-warm sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun-300">Keep this</p>
          <p className="mt-3 font-serif text-2xl leading-snug sm:text-3xl">{guide.takeaway}</p>
          <p className="mt-5 text-sm leading-6 text-cream-50/75">When you are ready, use a focused {exam.label} diagnosis to turn your own attempts into the next specific repair.</p>
          <Link href={exam.diagnosisHref} className="mt-6 inline-flex rounded-full bg-sun-400 px-5 py-3 text-sm font-bold text-cocoa-900">Find my weak {exam.label} topic →</Link>
        </section>
      </article>
    </main>
  );
}
