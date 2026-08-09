"use client";

import Link from "next/link";
import Chick from "@/components/Chick";
import { trackDailyMissionStarted } from "@/lib/product-analytics";

type Props = {
  steps: MissionStep[];
  scoreBoostDay?: number | null;
  firstName?: string;
  examName?: string;
  daysLeft?: number | null;
  todayProof?: string;
  readinessProof?: string;
};

export type MissionStep = {
  href: string;
  subjectId: string;
  subjectName: string;
  topicName: string | null;
  type: "foundation" | "repair" | "revision" | "advance";
  accuracy: number | null;
  completed: boolean;
  minutes: number;
  reason: string;
};

type IssueTone = "repair" | "recall" | "build";
type IssueCopy = { label: string; time: string; note: string; button: string; colour: IssueTone };

const copy = (step: MissionStep): IssueCopy => {
  if (step.type === "repair") return { label: "Repair", time: `${step.minutes} min`, note: step.accuracy == null ? step.reason : `Earlier accuracy: ${step.accuracy}% · ${step.reason}`, button: "Repair marks", colour: "repair" };
  if (step.type === "revision") return { label: "Recall", time: `${step.minutes} min`, note: step.reason, button: "Recall now", colour: "recall" };
  return { label: "Build", time: `${step.minutes} min`, note: step.reason, button: "Build coverage", colour: "build" };
};

export default function DailyMissionCard({ steps, scoreBoostDay, firstName = "there", examName = "your exam", daysLeft, todayProof, readinessProof }: Props) {
  const completedCount = steps.filter((step) => step.completed).length;
  const complete = steps.length > 0 && completedCount === steps.length;
  const minutes = steps.reduce((total, step) => total + step.minutes, 0);
  const start = (type: MissionStep["type"]) => {
    window.sessionStorage.setItem("examgrind:active-mission", JSON.stringify({ type, startedAt: Date.now() }));
    trackDailyMissionStarted({ mission_type: type });
  };

  return <section id="daily-mission" className="mx-auto max-w-5xl scroll-mt-5 px-4 pt-6 sm:px-6 sm:pt-10">
    <div className="issue-shell">
      <header className="issue-cover">
        <div className="relative z-10 flex items-start justify-between gap-3"><div><p className="eg-kicker text-sun-400">Today&apos;s issue · {examName}</p><h1 className="mt-2 font-serif text-4xl font-semibold leading-[.9] tracking-[-.055em] text-cream-50 sm:text-5xl">{complete ? "Issue closed.\nGood work." : `Hi, ${firstName}.\nBuild your edge.`}</h1></div><Chick state={complete ? "excited" : "idle"} size={88} /></div>
        <div className="relative z-10 mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream-50/15 pt-4 text-xs font-bold text-cream-200"><span>{steps.length} MOVES</span><span>{minutes} MIN STARTING BLOCK</span><span>{daysLeft == null ? "SET YOUR EXAM DATE" : daysLeft === 0 ? "EXAM TODAY" : `${daysLeft} DAYS TO GO`}</span></div>
        <span className="issue-sun" aria-hidden /><span className="issue-scribble" aria-hidden>↝</span>
      </header>
      <div className="issue-route" aria-hidden><span /><span /><span /></div>
      <ol className="grid gap-3 p-3 sm:grid-cols-3 sm:p-5">
        {steps.map((step, index) => {
          const item = copy(step);
          return <li key={`${step.type}-${step.href}`} className={`issue-page issue-${item.colour} ${step.completed ? "is-done" : ""}`}>
            <IssueDoodle type={item.colour} />
            <div className="relative z-10 flex items-start justify-between gap-3"><p className="eg-kicker">{String(index + 1).padStart(2, "0")} · {item.label}</p><span className="font-mono text-[11px] font-bold">{step.completed ? "DONE" : item.time}</span></div>
            <div className="relative z-10 mt-auto pt-16"><p className="font-serif text-3xl font-semibold leading-[.92] tracking-[-.05em]">{step.topicName ?? step.subjectName}</p><p className="mt-3 max-w-[16rem] text-sm leading-5">{step.subjectName} · {item.note}</p>{step.completed ? <p className="mt-5 inline-flex rounded-full border border-current/25 px-3 py-1.5 text-xs font-extrabold">Stamped today ✓</p> : <Link href={step.href} onClick={() => start(step.type)} className="eg-press mt-5 inline-flex items-center gap-2 rounded-2xl bg-cocoa-900 px-3.5 py-2.5 text-xs font-extrabold text-cream-50 shadow-warm">{item.button} <span aria-hidden>→</span></Link>}</div>
          </li>;
        })}
      </ol>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-cocoa-900/[.08] bg-cream-50 px-5 py-4 text-xs font-semibold text-cocoa-700"><span>{todayProof ?? "Your first completed quiz creates today’s proof."}</span><span>{readinessProof ?? "Your readiness will build from real practice."}</span><span className="font-bold text-cocoa-900">Chosen from your weak signals, revision due dates, and coverage gaps.</span>{scoreBoostDay && <Link href="/score-boost" className="font-bold text-ember-700">Score Boost · Day {scoreBoostDay} →</Link>}</footer>
    </div>
  </section>;
}

function IssueDoodle({ type }: { type: "repair" | "recall" | "build" }) {
  const path = type === "repair" ? <><circle cx="47" cy="47" r="27" /><path d="m35 47 8 8 17-19" /></> : type === "recall" ? <><path d="M72 40A28 28 0 1 0 69 62" /><path d="m70 28 4 14-14-3" /></> : <><path d="M47 73V39" /><path d="M47 53C23 50 21 31 24 25c18 0 26 11 23 28Z" /><path d="M48 61c19-3 25-18 22-27-17 0-24 11-22 27Z" /></>;
  return <svg className="issue-doodle" viewBox="0 0 94 94" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{path}</svg>;
}
