"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import CourseCanvas from "./CourseCanvas";

type LearnTopic = { id: string; name: string; chapterName: string; subjectName: string; practiceTopicId?: string; practiceFocus?: string };
type LessonStep = { title: string; explanation: string; example: string; visualLabel: string };
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
type RecentLesson = { id: string; requested_topic: string; topic_id: string | null; created_at: string };

export default function CoachLearningStudio({ topics, priorityTopicIds, recentLessons }: { topics: LearnTopic[]; priorityTopicIds: string[]; recentLessons: RecentLesson[] }) {
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
    <div className="overflow-hidden rounded-3xl border border-ember-700/20 bg-cream-50 p-5 text-cocoa-900 shadow-warm-lg sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-ember-700">Coach lesson studio</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h2 className="font-serif text-3xl font-bold leading-tight text-cocoa-900">Learn a topic. Then practise it.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">Choose a syllabus topic for a full lesson, or ask Coach about one specific concept. Each lesson ends with practice on what you just learned.</p></div>
        {lessonTopic?.practiceTopicId && <Link href={`/topic/${lessonTopic.practiceTopicId}${lessonTopic.practiceFocus ? `?focus=${encodeURIComponent(lessonTopic.practiceFocus)}` : ""}`} className="shrink-0 rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300">Practice {lessonTopic.name} →</Link>}
      </div>

      <div className="mt-6 rounded-2xl border border-cocoa-900/[.12] bg-cream-50/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.85)]">
        <label htmlFor="coach-direct-topic" className="text-[11px] font-bold uppercase tracking-[.14em] text-ember-700">Ask Coach about any exact concept</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]"><input id="coach-direct-topic" value={directTopic} maxLength={120} disabled={pending} onChange={(event) => setDirectTopic(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); buildLesson({ directTopic: directTopic.trim() }); } }} placeholder="Type a concept: sigma bond, DNA replication, percentage change…" className="min-w-0 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500 outline-none focus:border-sun-300 focus:ring-2 focus:ring-sun-300/45 disabled:opacity-60" /><button type="button" onClick={() => buildLesson({ directTopic: directTopic.trim() })} disabled={pending || !directTopic.trim()} className="rounded-xl border border-sun-300 bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-50">Learn this concept →</button></div>
        <p className="mt-2 text-xs text-cocoa-600">Type exactly what you want to understand. Coach can explain a full topic or one small concept.</p>
      </div>

      {topics.length > 0 && <details className="mt-4 rounded-2xl border border-cocoa-900/[.12] bg-cream-50/60 p-3"><summary className="cursor-pointer text-sm font-extrabold text-cocoa-900">Or choose a full syllabus topic</summary>
        {suggestedTopics.length > 0 && <div className="mt-4"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-cocoa-600">Suggested from your evidence</p><div className="mt-2 flex flex-wrap gap-2">{suggestedTopics.map((topic) => <button key={topic.id} type="button" disabled={pending} onClick={() => { setSelectedTopicId(topic.id); buildLesson({ topicId: topic.id }); }} className="rounded-full border border-cocoa-900/[.16] bg-cream-50 px-3 py-2 text-left text-xs font-bold text-cocoa-900 transition hover:bg-sun-300/35 disabled:opacity-60">{topic.name} <span className="font-medium text-cocoa-600">· {topic.subjectName}</span></button>)}</div></div>}
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"><select id="coach-topic" value={selectedTopicId} disabled={pending} onChange={(event) => setSelectedTopicId(event.target.value)} className="min-w-0 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-cocoa-900 outline-none focus:ring-2 focus:ring-sun-300"><option value="">Choose a syllabus topic to learn</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.subjectName} · {topic.chapterName} · {topic.name}</option>)}</select><button type="button" onClick={() => buildLesson({ topicId: selectedTopicId })} disabled={pending || !selectedTopic} className="rounded-xl bg-sun-400 px-5 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Coach is preparing your lesson…" : "Learn full topic →"}</button></div>
      </details>}
      {recentLessons.length > 0 && <div className="mt-4 rounded-2xl border border-cocoa-900/[.12] bg-cream-50/60 p-3"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-cocoa-600">Continue a recent Coach lesson</p><div className="mt-2 flex flex-wrap gap-2">{recentLessons.map((item) => <button key={item.id} type="button" disabled={pending} onClick={() => { setDirectTopic(item.requested_topic); buildLesson(item.topic_id ? { topicId: item.topic_id } : { directTopic: item.requested_topic }); }} className="rounded-full border border-cocoa-900/[.16] bg-cream-50 px-3 py-2 text-left text-xs font-bold text-cocoa-900 transition hover:bg-sun-300/35 disabled:opacity-60">{item.requested_topic} <span className="font-medium text-cocoa-600">· reopen</span></button>)}</div></div>}
      {error && <p role="alert" className="mt-3 rounded-xl bg-coral-500/20 px-3 py-2 text-sm font-semibold text-cocoa-900">{error}</p>}
      <p className="mt-3 text-xs text-cocoa-600">Each lesson explains the idea, checks your understanding and gives you practice.</p>
    </div>

    {pending && <div role="status" aria-live="polite" className="mt-4 rounded-3xl border border-ember-700/15 bg-cream-50 p-5 text-center shadow-warm"><div className="mx-auto h-9 w-9 animate-pulse rounded-full bg-sun-400" /><p className="mt-3 font-serif text-xl font-bold text-cocoa-900">Coach is building your explanation…</p><p className="mt-1 text-sm text-cocoa-600">Coach is mapping the teaching sequence and the right practice.</p></div>}
    {lesson && lessonTopic && !pending && <CourseCanvas lesson={lesson} topic={lessonTopic} visualAsset={lessonVisualAsset} />}
  </section>;
}
