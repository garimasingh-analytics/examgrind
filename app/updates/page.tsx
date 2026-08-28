import type { Metadata } from "next";
import Link from "next/link";
import { StudyHubViewed } from "@/components/StudyHubTracking";

export const metadata: Metadata = {
  title: "Official exam updates desk · ExamGrind",
  description: "Find official sources for ExamGrind's live exam routes: SSC CGL, Delhi Police, CUET UG, NEET UG, UPPSC RO/ARO and UP Secretariat RO/ARO.",
};

const officialDesks = [
  {
    exam: "SSC CGL",
    detail: "Recruitment notices, dates, documents and official updates.",
    href: "https://ssc.gov.in/",
    label: "Open SSC official portal",
  },
  {
    exam: "CUET UG",
    detail: "University entrance notices and National Testing Agency updates.",
    href: "https://cuet.nta.nic.in/",
    label: "Open CUET official portal",
  },
  {
    exam: "NEET UG",
    detail: "Official NEET notices, information bulletins and National Testing Agency updates.",
    href: "https://neet.nta.nic.in/",
    label: "Open NEET official portal",
  },
  {
    exam: "Delhi Police Constable",
    detail: "Recruitment notices and candidate documents should be verified on the SSC and Delhi Police official portals.",
    href: "https://ssc.gov.in/",
    label: "Open SSC official portal",
  },
  {
    exam: "UPPSC RO / ARO",
    detail: "UPPSC notices, calendars and previous-question-paper records. Verify the applicable notification before acting on a pattern or date.",
    href: "https://uppsc.up.nic.in/",
    label: "Open UPPSC official portal",
  },
  {
    exam: "UP Secretariat RO / ARO",
    detail: "Use the official UPPSC portal to confirm the applicable recruitment notice, conditions and examination scheme.",
    href: "https://uppsc.up.nic.in/",
    label: "Open UPPSC official portal",
  },
];

export default function UpdatesDeskPage() {
  return (
    <main className="min-h-[100svh] bg-warm-wash text-cocoa-900">
      <StudyHubViewed surface="updates" examScope="all" />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/guides" className="text-sm font-bold text-cocoa-600 hover:text-cocoa-900">← Study Hub</Link>
        <Link href="/" className="font-serif text-xl font-bold">ExamGrind</Link>
      </header>
      <section className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-coral-700">The ExamGrind updates desk</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-6xl">Find the official notice. Then plan around it.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa-700">Exam dates, admit cards, eligibility and notices can change. We link to the official source so you can verify a decision before acting on it.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {officialDesks.map((desk, index) => <article key={desk.exam} className={`rounded-[2rem] border p-6 shadow-warm sm:p-8 ${index === 1 ? "border-coral-500/20 bg-cream-50" : "border-cocoa-900/[.08] bg-sun-400/10"}`}>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Official source</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold">{desk.exam}</h2>
            <p className="mt-4 min-h-20 leading-7 text-cocoa-700">{desk.detail}</p>
            <a href={desk.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex font-bold text-ember-700 underline decoration-ember-500/40 underline-offset-4">{desk.label} ↗</a>
          </article>)}
        </div>
        <section className="mt-12 rounded-[2rem] bg-cocoa-900 p-7 text-cream-50 shadow-warm sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-sun-300">Current-affairs habit</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Keep current affairs small, regular, and recall-based.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-cream-50/80">Use one dependable current-affairs source, make short recall prompts from what you study, and revise them in small batches. Do not let an endless news feed replace your core preparation.</p>
          <Link href="/guides/ssc-cgl-current-affairs-revision-system" className="mt-6 inline-flex rounded-full bg-sun-400 px-5 py-3 text-sm font-bold text-cocoa-900">Read the current-affairs system →</Link>
        </section>
      </section>
    </main>
  );
}
