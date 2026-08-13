"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type LearnTopic = { id: string; name: string; chapterName: string; subjectName: string };
type LessonStep = { title: string; explanation: string; visualLabel: string };
type LessonVisual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type CoachLesson = {
  opening: string;
  steps: LessonStep[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: LessonVisual;
};

export default function CoachLearningStudio({ topics, priorityTopicIds }: { topics: LearnTopic[]; priorityTopicIds: string[] }) {
  const suggestedTopics = useMemo(() => topics.filter((topic) => priorityTopicIds.includes(topic.id)).slice(0, 3), [priorityTopicIds, topics]);
  const [selectedTopicId, setSelectedTopicId] = useState(suggestedTopics[0]?.id ?? topics[0]?.id ?? "");
  const [lessonFocus, setLessonFocus] = useState("");
  const [lesson, setLesson] = useState<CoachLesson | null>(null);
  const [lessonTopic, setLessonTopic] = useState<LearnTopic | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);
  const buildLesson = (topicId = selectedTopicId) => {
    if (!topicId) return;
    setError(null);
    setSelectedAnswer(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/coach/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, focus: lessonFocus.trim() || undefined }),
        });
        const payload = await response.json() as { lesson?: CoachLesson; topic?: LearnTopic; error?: string };
        if (!response.ok || !payload.lesson || !payload.topic) throw new Error(payload.error ?? "Coach couldn't build that lesson.");
        setLesson(payload.lesson);
        setLessonTopic(payload.topic);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Coach couldn't build that lesson.");
      }
    });
  };

  return <section id="learn-with-coach" className="mx-auto mt-5 max-w-4xl px-5">
    <div className="overflow-hidden rounded-3xl border border-violet-700/15 bg-[radial-gradient(circle_at_90%_10%,rgba(250,196,57,.28),transparent_30%),linear-gradient(135deg,#2d1d4a,#51376f)] p-5 text-cream-50 shadow-warm-lg sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-sun-300">Coach lesson studio</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h2 className="font-serif text-3xl font-bold leading-tight">Learn it. Check it. Prove it.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-cream-100/85">Choose a topic from your syllabus. Coach gives you a focused virtual walkthrough, checks the idea, then gets you into practice on that exact topic.</p></div>
        {lessonTopic && <Link href={`/topic/${lessonTopic.id}`} className="shrink-0 rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300">Practice {lessonTopic.name} →</Link>}
      </div>

      {topics.length === 0 ? <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-cream-100">Add subjects to your study preferences first. Coach will then bring in those syllabus topics.</p> : <>
        {suggestedTopics.length > 0 && <div className="mt-6"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-cream-100/65">Start with your evidence</p><div className="mt-2 flex flex-wrap gap-2">{suggestedTopics.map((topic) => <button key={topic.id} type="button" disabled={pending} onClick={() => { setSelectedTopicId(topic.id); buildLesson(topic.id); }} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-left text-xs font-bold text-cream-50 transition hover:bg-white/20 disabled:opacity-60">{topic.name} <span className="font-medium text-cream-100/65">· {topic.subjectName}</span></button>)}</div></div>}
        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="coach-topic">Topic to learn</label><select id="coach-topic" value={selectedTopicId} disabled={pending} onChange={(event) => setSelectedTopicId(event.target.value)} className="min-w-0 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-cocoa-900 outline-none focus:ring-2 focus:ring-sun-300"><option value="">Choose a topic to learn</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.subjectName} · {topic.chapterName} · {topic.name}</option>)}</select><button type="button" onClick={() => buildLesson()} disabled={pending || !selectedTopic} className="rounded-xl bg-sun-400 px-5 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Coach is teaching…" : "Teach me this"}</button></div>
        <div className="mt-2"><label htmlFor="coach-focus" className="text-[11px] font-bold uppercase tracking-[.14em] text-cream-100/65">Want a smaller slice?</label><div className="mt-1 grid gap-2 sm:grid-cols-[1fr_auto]"><input id="coach-focus" value={lessonFocus} maxLength={120} disabled={pending} onChange={(event) => setLessonFocus(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); buildLesson(); } }} placeholder="Type the exact subtopic — e.g. successive discounts" className="min-w-0 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-cream-50 placeholder:text-cream-100/55 outline-none focus:border-sun-300 focus:ring-2 focus:ring-sun-300/45 disabled:opacity-60" /><button type="button" onClick={() => buildLesson()} disabled={pending || !selectedTopic || !lessonFocus.trim()} className="rounded-xl border border-sun-300/45 bg-sun-400/15 px-4 py-3 text-sm font-extrabold text-sun-200 transition hover:bg-sun-400 hover:text-cocoa-900 disabled:cursor-not-allowed disabled:opacity-50">Teach this slice →</button></div><p className="mt-1 text-xs text-cream-100/60">Coach will teach this within the selected syllabus topic, then send you to the relevant practice.</p></div>
      </>}
      {error && <p role="alert" className="mt-3 rounded-xl bg-coral-500/20 px-3 py-2 text-sm font-semibold text-cream-50">{error}</p>}
      <p className="mt-3 text-xs text-cream-100/65">A short interactive lesson, then a focused topic quiz. No generic timetable and no filler.</p>
    </div>

    {pending && <div role="status" aria-live="polite" className="mt-4 rounded-3xl border border-violet-700/15 bg-cream-50 p-5 text-center shadow-warm"><div className="mx-auto h-9 w-9 animate-pulse rounded-full bg-gradient-to-br from-sun-300 to-ember-500" /><p className="mt-3 font-serif text-xl font-bold text-cocoa-900">Coach is building your explanation…</p><p className="mt-1 text-sm text-cocoa-600">It will stay tied to your selected syllabus topic.</p></div>}

    {lesson && lessonTopic && !pending && <LessonCanvas lesson={lesson} topic={lessonTopic} selectedAnswer={selectedAnswer} onChooseAnswer={setSelectedAnswer} />}
  </section>;
}

function LessonCanvas({ lesson, topic, selectedAnswer, onChooseAnswer }: { lesson: CoachLesson; topic: LearnTopic; selectedAnswer: number | null; onChooseAnswer: (index: number) => void }) {
  const answered = selectedAnswer !== null;
  const correct = selectedAnswer === lesson.checkpoint.correctIndex;
  return <article className="mt-5 overflow-hidden rounded-3xl border border-cocoa-900/[.08] bg-cream-50 shadow-warm-lg">
    <header className="border-b border-cocoa-900/[.08] bg-cream-100 px-5 py-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">{topic.subjectName} · {topic.chapterName}</p><h3 className="mt-1 font-serif text-3xl font-bold text-cocoa-900">{topic.name}</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-cocoa-700">{lesson.opening}</p></header>
    <div className="p-5 sm:p-6"><CoachVisualWalkthrough lesson={lesson} topic={topic} /><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Follow the idea</p><ol className="mt-4 grid gap-3 md:grid-cols-2">{lesson.steps.map((step, index) => <li key={`${step.title}-${index}`} className="relative overflow-hidden rounded-2xl border border-violet-700/15 bg-violet-700/[.045] p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">{index + 1}</span><p className="text-[11px] font-bold uppercase tracking-[.13em] text-violet-700">{step.visualLabel}</p></div><h4 className="mt-4 font-serif text-xl font-bold text-cocoa-900">{step.title}</h4><p className="mt-2 text-sm leading-6 text-cocoa-700">{step.explanation}</p>{index < lesson.steps.length - 1 && <span aria-hidden className="absolute -bottom-2 right-4 text-2xl text-violet-700/45 md:hidden">↓</span>}</li>)}</ol>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><aside className="rounded-2xl border border-coral-500/20 bg-coral-500/[.07] p-4"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-coral-700">Common trap</p><p className="mt-2 text-sm leading-6 text-cocoa-800">{lesson.commonTrap}</p></aside><aside className="rounded-2xl border border-sun-500/30 bg-sun-400/15 p-4"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-800">Memory anchor</p><p className="mt-2 font-serif text-lg font-bold leading-6 text-cocoa-900">{lesson.memoryAnchor}</p></aside></div>
      <section className="mt-5 rounded-2xl border border-cocoa-900/[.08] bg-white p-4 sm:p-5"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-moss-700">Quick check</p><h4 className="mt-2 font-serif text-xl font-bold leading-7 text-cocoa-900">{lesson.checkpoint.question}</h4><div className="mt-4 grid gap-2">{lesson.checkpoint.options.map((option, index) => { const isCorrect = index === lesson.checkpoint.correctIndex; const chosen = index === selectedAnswer; const resultClass = answered ? (isCorrect ? "border-moss-500 bg-moss-500/10 text-cocoa-900" : chosen ? "border-coral-500 bg-coral-500/[.08] text-cocoa-900" : "border-cocoa-900/[.08] text-cocoa-600") : "border-cocoa-900/[.08] text-cocoa-800 hover:border-violet-700/45 hover:bg-violet-700/[.04]"; return <button key={option} type="button" disabled={answered} onClick={() => onChooseAnswer(index)} className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition disabled:cursor-default ${resultClass}`}><span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>{option}</button>; })}</div>{answered && <div className={`mt-4 rounded-xl p-3 text-sm leading-6 ${correct ? "bg-moss-500/10 text-cocoa-800" : "bg-coral-500/[.08] text-cocoa-800"}`}><p className="font-bold">{correct ? "You have the idea." : "Almost — notice the trap."}</p><p className="mt-1">{lesson.checkpoint.explanation}</p></div>}</section>
      <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl bg-cocoa-900 p-4 text-cream-50 sm:flex-row sm:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-sun-300">Now make it stick</p><p className="mt-1 text-sm text-cream-100/80">Practice this exact topic with a short, serious round.</p></div><Link href={`/topic/${topic.id}`} className="shrink-0 rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300">Start {topic.name} quiz →</Link></div>
    </div>
  </article>;
}

function CoachVisualWalkthrough({ lesson, topic }: { lesson: CoachLesson; topic: LearnTopic }) {
  const visual = lesson.visual;
  const visualNodes = Array.isArray(visual?.nodes) ? visual.nodes.filter((node) => typeof node === "string" && node.trim()).slice(0, 4) : [];
  const nodes = visualNodes.length >= 2
    ? visualNodes
    : lesson.steps.map((step) => step.visualLabel).slice(0, 4);
  const kind = visual?.kind === "formula" || visual?.kind === "comparison" || visual?.kind === "cycle" ? visual.kind : "flow";
  const caption = typeof visual?.caption === "string" && visual.caption.trim() ? visual.caption : `See how ${topic.name} connects before you practise it.`;

  return <figure className={`coach-visual coach-visual-${kind}`} aria-label={`Visual walkthrough for ${topic.name}`}>
    <figcaption><p className="text-[11px] font-bold uppercase tracking-[.16em] text-violet-700">Visual walkthrough</p><p className="mt-1 font-serif text-xl font-bold text-cocoa-900">{caption}</p></figcaption>
    <div className="coach-visual-stage mt-4" aria-hidden>
      <span className="coach-visual-spark coach-visual-spark-one">✦</span><span className="coach-visual-spark coach-visual-spark-two">✦</span>
      <div className="coach-visual-path"><span /></div>
      <div className="coach-visual-nodes">{nodes.map((node, index) => <div key={`${node}-${index}`} className="coach-visual-node"><span className="coach-visual-number">{index + 1}</span><span>{node}</span></div>)}</div>
    </div>
    <p className="mt-3 text-xs leading-5 text-cocoa-600">The sequence is an original study visual for this lesson—not a copied textbook diagram.</p>
  </figure>;
}
