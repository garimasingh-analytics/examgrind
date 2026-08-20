"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type Topic = { id: string; name: string; chapterName: string; subjectName: string; practiceTopicId?: string };
type Step = { title: string; explanation: string; example: string; visualLabel: string };
type Visual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type VisualAsset = {
  id: string;
  src: string;
  alt: string;
  title: string;
  sourceLabel: string;
  sourceUrl: string;
  licenceLabel: string;
  licenceUrl: string;
  attribution: string;
};
type Lesson = {
  opening: string;
  steps: Step[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: Visual;
};

export default function CourseCanvas({ lesson, topic, visualAsset }: { lesson: Lesson; topic: Topic; visualAsset?: VisualAsset }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const step = lesson.steps[stepIndex];
  const nodes = useMemo(() => {
    const fromLesson = lesson.visual?.nodes?.filter(Boolean).slice(0, 4) ?? [];
    return fromLesson.length >= 2 ? fromLesson : lesson.steps.map((item) => item.visualLabel).slice(0, 4);
  }, [lesson]);
  const visualKind = lesson.visual?.kind ?? "flow";
  const finalStep = stepIndex === lesson.steps.length - 1;
  const answered = answer !== null;
  const correct = answer === lesson.checkpoint.correctIndex;

  return <article className="course-canvas eg-page-enter mt-5 overflow-hidden rounded-[2rem] border border-cocoa-900/[.12] bg-[#fffaf0] shadow-warm-lg">
    <header className="course-canvas-head">
      <div><p className="course-canvas-kicker">Coach Canvas · {topic.subjectName}</p><h3>{topic.name}</h3></div>
      <p className="course-canvas-count">{stepIndex + 1} / {lesson.steps.length}</p>
    </header>
    <div className="course-canvas-progress" aria-label={`Lesson step ${stepIndex + 1} of ${lesson.steps.length}`}>
      {lesson.steps.map((item, index) => <span key={`${item.title}-${index}`} className={index <= stepIndex ? "is-read" : ""} />)}
    </div>
    <div className="course-canvas-intro"><p>{lesson.opening}</p></div>

    <div className="course-canvas-body">
      <CanvasScene kind={visualKind} nodes={nodes} visualAsset={visualAsset} activeIndex={stepIndex} topic={topic.name} />
      <section className="course-canvas-teach" aria-live="polite">
        <p className="course-canvas-step-label">{step.visualLabel}</p>
        <h4>{step.title}</h4>
        <p>{step.explanation}</p>
        <aside className="mt-5 rounded-2xl border border-violet-700/15 bg-violet-50 px-4 py-3 text-sm leading-6 text-cocoa-800"><span className="font-mono text-[10px] font-extrabold uppercase tracking-[.12em] text-violet-700">See it in context</span><p className="mt-1">{step.example}</p></aside>
        <div className="course-canvas-controls">
          <button type="button" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={stepIndex === 0}>← Back</button>
          {!finalStep ? <button type="button" className="course-canvas-next" onClick={() => setStepIndex((index) => Math.min(lesson.steps.length - 1, index + 1))}>Show next idea →</button> : <a href="#coach-canvas-check" className="course-canvas-next">Check what stuck ↓</a>}
        </div>
      </section>
    </div>

    <div className="course-canvas-notes">
      <aside><span>EXAM TRAP</span><p>{lesson.commonTrap}</p></aside>
      <aside><span>KEEP THIS</span><p>{lesson.memoryAnchor}</p></aside>
    </div>

    <section id="coach-canvas-check" className="course-canvas-check">
      <p className="course-canvas-kicker">One honest check</p>
      <h4>{lesson.checkpoint.question}</h4>
      <div>{lesson.checkpoint.options.map((option, index) => {
        const isCorrect = index === lesson.checkpoint.correctIndex;
        const chosen = index === answer;
        const state = answered ? (isCorrect ? "is-correct" : chosen ? "is-wrong" : "") : "";
        return <button key={`${option}-${index}`} type="button" disabled={answered} onClick={() => setAnswer(index)} className={state}><b>{String.fromCharCode(65 + index)}</b>{option}</button>;
      })}</div>
      {answered && <p className={`course-canvas-answer ${correct ? "is-correct" : "is-wrong"}`}><b>{correct ? "That’s it." : "Look at the distinction again."}</b> {lesson.checkpoint.explanation}</p>}
    </section>

    <footer className="course-canvas-footer"><div><p>{topic.practiceTopicId ? "Next, prove it with questions." : "Keep this explanation for your next revision."}</p><span>{topic.practiceTopicId ? "Coach matched this concept to a syllabus topic for practice." : "Coach can teach this exact concept without forcing it into a dropdown topic."}</span></div>{topic.practiceTopicId && <Link href={`/topic/${topic.practiceTopicId}`}>Practise {topic.name} →</Link>}</footer>
  </article>;
}

function CanvasScene({ kind, nodes, visualAsset, activeIndex, topic }: { kind: Visual["kind"]; nodes: string[]; visualAsset?: VisualAsset; activeIndex: number; topic: string }) {
  if (visualAsset) return <CuratedVisualAsset asset={visualAsset} activeIndex={activeIndex} topic={topic} nodes={nodes} />;
  // This is intentionally a concept map, not a claim that every unmatched topic
  // already has a bespoke subject illustration.
  const visible = nodes.slice(0, Math.min(nodes.length, activeIndex + 1));
  return <figure className={`course-canvas-scene course-canvas-${kind}`} aria-label={`Animated visual for ${topic}`}>
    <figcaption>{kind === "comparison" ? "See the difference" : kind === "formula" ? "Watch the relationship change" : kind === "cycle" ? "Follow the loop" : "Follow the movement"}</figcaption>
    <div className="course-canvas-stage" aria-hidden="true">
      <span className="course-canvas-star one">✦</span><span className="course-canvas-star two">✦</span>
      {kind === "cycle" && <span className="course-canvas-orbit" />}
      {kind === "flow" && <svg className="course-canvas-flowline" viewBox="0 0 400 180" preserveAspectRatio="none"><path d="M25 92 C 103 20, 150 162, 232 86 S 340 60, 380 90" /><path className="course-canvas-flowdot" d="M25 92 C 103 20, 150 162, 232 86 S 340 60, 380 90" /></svg>}
      {kind === "formula" && <div className="course-canvas-formula-line">{visible.map((node, index) => <span key={`${node}-${index}`} className={index === activeIndex ? "is-active" : ""}>{node}{index < visible.length - 1 && <i>→</i>}</span>)}</div>}
      {kind === "comparison" && <div className="course-canvas-divider"><span>vs</span></div>}
      <div className="course-canvas-shapes">{visible.map((node, index) => <div key={`${node}-${index}`} className={`course-canvas-shape shape-${index} ${index === activeIndex ? "is-active" : ""}`}><span>{index + 1}</span><b>{node}</b></div>)}</div>
    </div>
    <p>{activeIndex + 1 <= nodes.length ? `Step ${activeIndex + 1}: ${nodes[Math.min(activeIndex, nodes.length - 1)]}` : "Review the connection before moving on."}</p>
  </figure>;
}

function CuratedVisualAsset({ asset, activeIndex, topic, nodes }: { asset: VisualAsset; activeIndex: number; topic: string; nodes: string[] }) {
  const visibleNodes = nodes.slice(0, Math.min(nodes.length, activeIndex + 1));
  const currentFocus = nodes[Math.min(activeIndex, Math.max(nodes.length - 1, 0))] ?? "the relationship being taught";
  return <figure className="course-canvas-curated-asset" aria-label={`${asset.title}: visual explanation for ${topic}`}>
    <figcaption><span>Visual reference</span><b>{asset.title}</b></figcaption>
    <div className="course-canvas-curated-frame">
      <Image src={asset.src} alt={asset.alt} width={1200} height={800} unoptimized={asset.src.startsWith("http")} className={activeIndex > 0 ? "is-revealed" : ""} />
      <div className="absolute left-3 right-3 top-3 flex flex-wrap gap-1.5" aria-hidden="true">{visibleNodes.map((node, index) => <span key={`${node}-${index}`} className={`rounded-full border px-2 py-1 text-[10px] font-extrabold shadow-sm ${index === visibleNodes.length - 1 ? "border-sun-400 bg-sun-300 text-cocoa-900" : "border-white/70 bg-white/90 text-cocoa-800"}`}>{index + 1}. {node}</span>)}</div>
      <p className="absolute bottom-3 left-3 right-3 rounded-lg border border-cocoa-900/10 bg-[#fffdf8]/95 px-2.5 py-2 text-[11px] font-bold leading-4 text-cocoa-800"><span className="font-mono text-[9px] uppercase tracking-[.1em] text-ember-700">Look here:</span> {currentFocus}</p>
    </div>
    <p className="course-canvas-asset-credit">Visual: <a href={asset.sourceUrl} target="_blank" rel="noreferrer">{asset.sourceLabel}</a> · <a href={asset.licenceUrl} target="_blank" rel="noreferrer">{asset.licenceLabel}</a> · {asset.attribution}</p>
  </figure>;
}

/* Retired generic subject renderer. Curated assets now take priority; this
   implementation is intentionally kept out of the bundle while the matching
   visual library expands.
function SubjectIllustration({ illustration, activeIndex, topic }: { illustration: Illustration; activeIndex: number; topic: string }) {
  const labels = illustration.labels.slice(0, 4);
  const show = (index: number) => index <= activeIndex;
  return <figure className={`course-canvas-subject-scene course-canvas-illustration-${illustration.kind}`} aria-label={`${illustration.title}: visual explanation for ${topic}`}>
    <figcaption><span>Original subject illustration</span><b>{illustration.title}</b></figcaption>
    <div className="course-canvas-subject-stage" aria-hidden="true">
      {illustration.kind === "chemistry-bond" && <><div className={`bond-atom left ${show(0) ? "show" : ""}`}><i>+ +</i><b>{labels[0] ?? "Atom A"}</b></div><div className={`bond-electrons ${show(1) ? "show" : ""}`}><i>• •</i><span /></div><div className={`bond-atom right ${show(2) ? "show" : ""}`}><i>+ +</i><b>{labels[2] ?? labels[1] ?? "Atom B"}</b></div><p className={`bond-caption ${show(3) ? "show" : ""}`}>{labels[3] ?? "Head-on overlap makes one sigma bond"}</p></>}
      {illustration.kind === "biology-process" && <><svg className="biology-dna" viewBox="0 0 300 170"><path d="M78 8 C210 34 90 65 220 91 S92 139 219 165"/><path d="M222 8 C90 34 210 65 80 91 S208 139 81 165"/>{[28,57,87,116,145].map((y) => <line key={y} x1="112" y1={y} x2="188" y2={y} />)}</svg><div className={`biology-split split-left ${show(1) ? "show" : ""}`}>↙</div><div className={`biology-split split-right ${show(2) ? "show" : ""}`}>↘</div><div className="biology-labels">{labels.slice(0, 3).map((label, index) => <span key={label} className={show(index) ? "show" : ""}>{label}</span>)}</div><p className={`biology-caption ${show(3) ? "show" : ""}`}>{labels[3] ?? "Each step preserves the information in the sequence."}</p></>}
      {illustration.kind === "biology-taxonomy" && <><svg className="taxonomy-tree" viewBox="0 0 330 190"><path d="M165 22 V65 M65 65 H265 M65 65 V112 M165 65 V112 M265 65 V112 M30 112 H300"/>{[30,98,165,232,300].map((x) => <circle key={x} cx={x} cy="142" r="16"/>)}</svg><div className="taxonomy-labels">{labels.map((label, index) => <span key={label} className={show(index) ? "show" : ""}>{label}</span>)}</div></>}
      {illustration.kind === "quant-model" && <><div className="quant-board">{labels.slice(0, 3).map((label, index) => <div key={label} className={`quant-row ${show(index) ? "show" : ""}`}><b>{label}</b><span style={{ width: `${92 - index * 23}%` }} /></div>)}</div><p className={`quant-caption ${show(3) ? "show" : ""}`}>{labels[3] ?? "Compare the parts before calculating the whole."}</p></>}
      {illustration.kind === "physics-vector" && <><div className="physics-origin">●</div>{labels.slice(0, 4).map((label, index) => <div key={label} className={`physics-arrow arrow-${index} ${show(index) ? "show" : ""}`}><i>➜</i><span>{label}</span></div>)}</>}
      {illustration.kind === "reasoning-tree" && <><svg className="reason-tree-lines" viewBox="0 0 330 190"><path d="M165 25 V72 M58 72 H272 M58 72 V122 M272 72 V122"/></svg><div className="reason-tree-nodes">{labels.map((label, index) => <span key={label} className={`node-${index} ${show(index) ? "show" : ""}`}>{label}</span>)}</div></>}
    </div>
    <p>{activeIndex + 1 <= labels.length ? labels[Math.min(activeIndex, labels.length - 1)] : "Move through the idea one piece at a time."}</p>
  </figure>;
} */
