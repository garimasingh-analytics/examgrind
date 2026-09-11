import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Chick from "@/components/Chick";

type PriorityExam = "delhi-police-constable" | "uppsc-ro-aro" | "up-secretariat-ro-aro";

const pages: Record<PriorityExam, {
  label: string;
  kicker: string;
  title: string;
  description: string;
  signal: string;
  route: string[];
  guide: string;
  guideLabel: string;
  note: string;
}> = {
  "delhi-police-constable": {
    label: "Delhi Police Constable",
    kicker: "Delhi Police Constable · focused preparation",
    title: "Stop guessing which Delhi Police section needs your time.",
    description: "Take five focused questions. ExamGrind shows the first concept or section to repair, then gives you a clear route into targeted practice.",
    signal: "Your first signal might be: Numerical Ability · percentage change · repair before your next mixed check.",
    route: ["Check one weak area", "Learn the smallest missing idea", "Practise fresh questions", "Retest before moving on"],
    guide: "/guides/delhi-police-constable-four-section-week",
    guideLabel: "Read the 4-section weekly plan",
    note: "Recruitment dates, eligibility and the applicable paper scheme must always be verified from SSC and Delhi Police official notices.",
  },
  "uppsc-ro-aro": {
    label: "UPPSC RO / ARO",
    kicker: "UPPSC RO / ARO · preparation foundation",
    title: "Build the skills now. Let your next attempt decide what to repair.",
    description: "Take a five-question foundation check across Hindi, General Studies, computer skills and reasoning. Start with the topic that needs your attention first.",
    signal: "Your first signal might be: General Hindi · a grammar decision is repeating · practise the contrast, then retest it.",
    route: ["Find your repeated error", "Learn the rule or method behind it", "Practise with unseen examples", "Keep the repair in revision"],
    guide: "/guides/uppsc-ro-aro-hindi-practice-system",
    guideLabel: "Read the Hindi practice system",
    note: "ExamGrind teaches durable foundations. Confirm the current recruitment details and final paper scheme on the UPPSC portal.",
  },
  "up-secretariat-ro-aro": {
    label: "UP Secretariat RO / ARO",
    kicker: "UP Secretariat RO / ARO · preparation foundation",
    title: "Turn Hindi, computer, GS and reasoning into a clear next move.",
    description: "Use a five-question foundation check to find the skill that needs attention first. Then learn, practise and revisit it with a simple route.",
    signal: "Your first signal might be: Computer Awareness · close terms are blurring · build a contrast card and test it in context.",
    route: ["Take a short foundation check", "Choose one skill to repair", "Use focused practice instead of random sets", "Return with a fresh retest"],
    guide: "/guides/up-secretariat-ro-aro-computer-office-skills",
    guideLabel: "Read the computer study method",
    note: "Use the UPPSC official notice board for live post, date, eligibility and scheme information before taking any application decision.",
  },
};

function isPriorityExam(slug: string): slug is PriorityExam {
  return slug in pages;
}

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  if (!isPriorityExam(params.slug)) return {};
  const page = pages[params.slug];
  return {
    title: `${page.label} preparation: find what to study next · ExamGrind`,
    description: page.description,
    alternates: { canonical: `/exam/${params.slug}` },
    openGraph: { title: page.title, description: page.description, type: "website" },
  };
}

export default function PriorityExamLanding({ params }: Props) {
  if (!isPriorityExam(params.slug)) notFound();
  const page = pages[params.slug];
  const diagnosisHref = `/diagnose/${params.slug}`;

  return (
    <main className="min-h-[100svh] overflow-hidden bg-warm-wash text-cocoa-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
        <Link href="/guides" className="text-sm font-bold text-cocoa-600 transition hover:text-cocoa-900">Free study guides →</Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-coral-700">{page.kicker}</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[.96] tracking-[-.045em] sm:text-7xl">{page.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa-700">{page.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={diagnosisHref} className="eg-press inline-flex justify-center rounded-full bg-cocoa-900 px-6 py-3.5 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700">Find my first weak area →</Link>
            <Link href={page.guide} className="inline-flex justify-center rounded-full border border-cocoa-900/15 bg-cream-50 px-6 py-3.5 text-sm font-bold text-cocoa-900 transition hover:border-cocoa-900/35">{page.guideLabel}</Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-cocoa-600">
            <li>✓ 5 focused questions</li><li>✓ No card</li><li>✓ No signup to begin</li>
          </ul>
          <p className="mt-7 max-w-2xl text-xs leading-5 text-cocoa-500">{page.note}</p>
        </div>

        <aside className="relative rounded-[2.4rem] border border-cocoa-900/[.08] bg-cream-50 p-6 shadow-warm sm:p-8">
          <div className="absolute -right-2 -top-6 rotate-6"><Chick state="happy" size={94} /></div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-ember-700">After your five answers</p>
          <h2 className="mt-3 max-w-sm font-serif text-3xl font-semibold leading-tight">You leave with one useful next move.</h2>
          <div className="mt-6 rounded-2xl border border-coral-500/20 bg-coral-500/[.07] p-5">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-coral-700">Example signal</p>
            <p className="mt-2 text-base font-semibold leading-7 text-cocoa-800">{page.signal}</p>
          </div>
          <ol className="mt-6 space-y-3">
            {page.route.map((step, index) => <li key={step} className="flex items-center gap-3 text-sm font-semibold text-cocoa-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun-400 font-mono text-xs text-cocoa-900">0{index + 1}</span>{step}</li>)}
          </ol>
          <Link href={diagnosisHref} className="mt-8 inline-flex text-sm font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">Start my free diagnosis →</Link>
        </aside>
      </section>
    </main>
  );
}
