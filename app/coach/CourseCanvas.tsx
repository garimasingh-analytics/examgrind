"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Topic = { id: string; name: string; chapterName: string; subjectName: string };
type Step = { title: string; explanation: string; visualLabel: string };
type Visual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type Lesson = {
  opening: string;
  steps: Step[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: Visual;
};

export default function CourseCanvas({ lesson, topic }: { lesson: Lesson; topic: Topic }) {
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
      <CanvasScene kind={visualKind} nodes={nodes} activeIndex={stepIndex} topic={topic.name} />
      <section className="course-canvas-teach" aria-live="polite">
        <p className="course-canvas-step-label">{step.visualLabel}</p>
        <h4>{step.title}</h4>
        <p>{step.explanation}</p>
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

    <footer className="course-canvas-footer"><div><p>Next, prove it with questions.</p><span>Coach will connect the result to your revision and repair queue.</span></div><Link href={`/topic/${topic.id}`}>Practise {topic.name} →</Link></footer>
  </article>;
}

function CanvasScene({ kind, nodes, activeIndex, topic }: { kind: Visual["kind"]; nodes: string[]; activeIndex: number; topic: string }) {
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
