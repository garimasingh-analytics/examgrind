"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import CourseCanvas from "./CourseCanvas";

type LearnTopic = { id: string; name: string; chapterName: string; subjectName: string };
type LessonStep = { title: string; explanation: string; visualLabel: string };
type LessonVisual = { kind: "flow" | "formula" | "comparison" | "cycle"; caption: string; nodes: string[] };
type VisualAsset = { id: string; src: string; alt: string; title: string; sourceLabel: string; sourceUrl: string; licenceLabel: string; licenceUrl: string; attribution: string };
type CoachLesson = {
  opening: string;
  steps: LessonStep[];
  commonTrap: string;
  memoryAnchor: string;
  checkpoint: { question: string; options: string[]; correctIndex: number; explanation: string };
  visual?: LessonVisual;
};
type LessonResponse = { lesson?: CoachLesson; topic?: LearnTopic; visualAsset?: VisualAsset; error?: string };

export default function CoachLearningStudio({ topics, priorityTopicIds }: { topics: LearnTopic[]; priorityTopicIds: string[] }) {
  const suggestedTopics = useMemo(() => topics.filter((topic) => priorityTopicIds.includes(topic.id)).slice(0, 3), [priorityTopicIds, topics]);
  const [selectedTopicId, setSelectedTopicId] = useState(suggestedTopics[0]?.id ?? topics[0]?.id ?? "");
  const [directTopic, setDirectTopic] = useState("");
  const [lesson, setLesson] = useState<CoachLesson | null>(null);
  const [lessonTopic, setLessonTopic] = useState<LearnTopic | null>(null);
  const [lessonVisualAsset, setLessonVisualAsset] = useState<VisualAsset | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  const buildLesson = (request: { topicId?: string; directTopic?: string }) => {
    if (!request.topicId && !request.directTopic?.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/coach/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        const payload = await response.json() as LessonResponse;
        if (!response.ok || !payload.lesson || !payload.topic) throw new Error(payload.error ?? "Coach couldn't build that lesson.");
        setLesson(payload.lesson);
        setLessonTopic(payload.topic);
        setLessonVisualAsset(payload.visualAsset);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Coach couldn't build that lesson.");
      }
    });
  };

  return <section id="learn-with-coach" className="mx-auto mt-5 max-w-4xl px-5">
    <div className="overflow-hidden rounded-3xl border border-violet-700/15 bg-[radial-gradient(circle_at_90%_10%,rgba(250,196,57,.28),transparent_30%),linear-gradient(135deg,#2d1d4a,#51376f)] p-5 text-cream-50 shadow-warm-lg sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-sun-300">Coach lesson studio</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h2 className="font-serif text-3xl font-bold leading-tight">Learn it. Check it. Prove it.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-cream-100/85">Learn a full syllabus topic like a proper lesson—or ask Coach about one exact concept. Both end in practice that fits what you just learned.</p></div>
        {lessonTopic && <Link href={`/topic/${lessonTopic.id}`} className="shrink-0 rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300">Practice {lessonTopic.name} →</Link>}
      </div>

      {topics.length === 0 ? <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-cream-100">Add subjects to your study preferences first. Coach will then bring in those syllabus topics.</p> : <>
        {suggestedTopics.length > 0 && <div className="mt-6"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-cream-100/65">Start with your evidence</p><div className="mt-2 flex flex-wrap gap-2">{suggestedTopics.map((topic) => <button key={topic.id} type="button" disabled={pending} onClick={() => { setSelectedTopicId(topic.id); buildLesson({ topicId: topic.id }); }} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-left text-xs font-bold text-cream-50 transition hover:bg-white/20 disabled:opacity-60">{topic.name} <span className="font-medium text-cream-100/65">· {topic.subjectName}</span></button>)}</div></div>}

        <div className="mt-5 rounded-2xl border border-white/15 bg-black/10 p-3">
          <label className="text-[11px] font-bold uppercase tracking-[.14em] text-cream-100/65" htmlFor="coach-topic">Teach a full syllabus topic</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]"><select id="coach-topic" value={selectedTopicId} disabled={pending} onChange={(event) => setSelectedTopicId(event.target.value)} className="min-w-0 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-cocoa-900 outline-none focus:ring-2 focus:ring-sun-300"><option value="">Choose a topic to learn</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.subjectName} · {topic.chapterName} · {topic.name}</option>)}</select><button type="button" onClick={() => buildLesson({ topicId: selectedTopicId })} disabled={pending || !selectedTopic} className="rounded-xl bg-sun-400 px-5 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Coach is teaching…" : "Teach full topic →"}</button></div>
          <p className="mt-2 text-xs text-cream-100/60">Coach breaks the selected topic into its actual sub-ideas. This is a lesson—not a chapter summary.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-sun-300/35 bg-sun-400/[.09] p-3">
          <label htmlFor="coach-direct-topic" className="text-[11px] font-bold uppercase tracking-[.14em] text-sun-200">Ask about one exact concept</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]"><input id="coach-direct-topic" list="coach-syllabus-topics" value={directTopic} maxLength={120} disabled={pending} onChange={(event) => setDirectTopic(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); buildLesson({ directTopic: directTopic.trim() }); } }} placeholder="e.g. sigma bond, homologous organs, successive discounts" className="min-w-0 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500 outline-none focus:border-sun-300 focus:ring-2 focus:ring-sun-300/45 disabled:opacity-60" /><datalist id="coach-syllabus-topics">{topics.map((topic) => <option key={topic.id} value={topic.name}>{topic.subjectName} · {topic.chapterName}</option>)}</datalist><button type="button" onClick={() => buildLesson({ directTopic: directTopic.trim() })} disabled={pending || !directTopic.trim()} className="rounded-xl border border-sun-300 bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-50">Teach this concept →</button></div>
          <p className="mt-2 text-xs text-cream-100/70">No parent-topic selection required. Coach finds the matching concept in your selected syllabus, explains it, then links the right practice.</p>
        </div>
      </>}
      {error && <p role="alert" className="mt-3 rounded-xl bg-coral-500/20 px-3 py-2 text-sm font-semibold text-cream-50">{error}</p>}
      <p className="mt-3 text-xs text-cream-100/65">Each lesson is built to explain, check, and practise—never to pad a screen with generic notes.</p>
    </div>

    {pending && <div role="status" aria-live="polite" className="mt-4 rounded-3xl border border-violet-700/15 bg-cream-50 p-5 text-center shadow-warm"><div className="mx-auto h-9 w-9 animate-pulse rounded-full bg-gradient-to-br from-sun-300 to-ember-500" /><p className="mt-3 font-serif text-xl font-bold text-cocoa-900">Coach is building your explanation…</p><p className="mt-1 text-sm text-cocoa-600">Coach is mapping the teaching sequence and the right practice.</p></div>}
    {lesson && lessonTopic && !pending && <CourseCanvas lesson={lesson} topic={lessonTopic} visualAsset={lessonVisualAsset} />}
  </section>;
}
