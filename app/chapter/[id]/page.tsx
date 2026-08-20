import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";
import ExamSwitcher from "@/components/ExamSwitcher";
import type { Chapter, Subject, Topic, UserTopicMastery, TopicWithMastery } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const COMPLETION_THRESHOLD = 0.7; // 70% accuracy = "completed"

export default async function ChapterPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  // PERFORMANCE: profile / chapter / topics are independent — parallelise.
  const [profileRes, chapterRes, topicsRes] = await Promise.all([
    supabase
      .from("users")
      .select("exam_choice")
      .eq("id", authUser.id)
      .maybeSingle<{ exam_choice: string | null }>(),
    supabase
      .from("chapters")
      .select("*, subject:subjects(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("topics")
      .select("*")
      .eq("chapter_id", id)
      .order("order_index", { ascending: true }),
  ]);

  const examSlug = profileRes.data?.exam_choice ?? "cuet";
  if (!chapterRes.data) notFound();
  const chapter = chapterRes.data as Chapter & { subject: Subject };
  const topics = (topicsRes.data ?? []) as Topic[];

  // User's mastery for these topics
  const topicIds = topics.map((t) => t.id);
  let masteryByTopic = new Map<string, UserTopicMastery>();
  if (topicIds.length > 0) {
    const { data: masteryData } = await supabase
      .from("user_topic_mastery")
      .select("*")
      .eq("user_id", authUser.id)
      .in("topic_id", topicIds);
    masteryByTopic = new Map(
      (masteryData ?? []).map((m) => [m.topic_id, m as UserTopicMastery])
    );
  }

  // Compute per-topic state for the path UI.
  // Linear unlock: topic[0] always available; topic[i] available when topic[i-1] completed.
  let prevCompleted = true;
  const enriched: TopicWithMastery[] = topics.map((t) => {
    const m = masteryByTopic.get(t.id);
    const attempted = m?.questions_attempted ?? 0;
    const correct = m?.questions_correct ?? 0;
    const accuracy = attempted > 0 ? correct / attempted : 0;
    const completed = attempted > 0 && accuracy >= COMPLETION_THRESHOLD;

    let status: TopicWithMastery["status"] = "locked";
    if (completed) status = "completed";
    else if (prevCompleted) status = "available";

    prevCompleted = completed;
    return {
      ...t,
      questions_correct: correct,
      questions_attempted: attempted,
      mastery_level: m?.mastery_level ?? "novice",
      accuracy,
      status,
    };
  });

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-32">
      {/* Header */}
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          <ExamSwitcher currentSlug={examSlug} />
        </div>
        <Link
          href={`/subject/${chapter.subject_id}`}
          className="max-w-[45%] truncate text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
        >
          ← {chapter.subject?.name}
        </Link>
      </header>

      {/* A chapter is an illustrated route, not a dry topic index. */}
      <section className="mx-auto max-w-3xl px-4 pt-2 sm:px-6 sm:pt-6">
        <div className="chapter-cover">
        <div className="relative z-10 max-w-lg">
        <p className="eg-kicker text-sun-400">
          {chapter.cuet_unit ?? "Chapter"}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[.9] tracking-[-.055em] text-cream-50 sm:text-5xl">
          {chapter.name}
        </h1>
        <p className="mt-4 max-w-md text-base leading-6 text-cream-200">
          {topics.length > 0
            ? `${topics.length} topic${topics.length === 1 ? "" : "s"}. Follow the marks, choose the next open page, and make a visible move.`
            : "Topics for this chapter are coming soon."}
        </p>
        </div>
        <div className="chapter-cover-meta relative z-10"><span>{enriched.filter((topic) => topic.status === "completed").length} stamped</span><span>{topics.length} pages</span></div>
        <div className="chapter-cover-guide"><span className="chapter-cover-loop" aria-hidden /><span className="chapter-cover-star" aria-hidden>✦</span><Chick state="idle" size={92} /></div>
        </div>
      </section>

      {/* The Path */}
      {topics.length > 0 ? (
        <section className="chapter-atlas mx-auto mt-8 max-w-md px-6">
          <div className="chapter-atlas-head"><p className="eg-kicker">Your route</p><p>One open page at a time</p></div>
          <ol className="topic-atlas relative">
            {enriched.map((t, i) => (
              <PathNode key={t.id} topic={t} index={i} />
            ))}
          </ol>
        </section>
      ) : (
        <section className="mx-auto mt-10 max-w-md px-6">
          <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center shadow-warm">
            <Chick state="idle" size={100} className="mx-auto mb-3" />
            <p className="text-cocoa-700">
              No topics yet for this chapter. We&apos;ll add them soon — try a different chapter for now.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * A sequential chapter list. The earlier winding trail let decorative lines
 * collide with the lock marker on smaller screens, so this prioritises a
 * legible action, status, and topic name over ornamental navigation.
 */
function PathNode({
  topic,
  index,
}: {
  topic: TopicWithMastery;
  index: number;
}) {
  const state = topic.status === "completed" ? "Completed" : topic.status === "available" ? "Ready now" : "Unlock next";
  const markerClass = topic.status === "completed"
    ? "bg-moss-500 text-cream-50"
    : topic.status === "available"
      ? "bg-ember-500 text-cream-50"
      : "bg-cream-200 text-cocoa-500";
  const cardClass = topic.status === "completed"
    ? "border-moss-500/25 bg-moss-500/[.08]"
    : topic.status === "available"
      ? "border-ember-500/30 bg-cream-50 shadow-warm transition hover:-translate-y-0.5 hover:shadow-warm-lg"
      : "border-cocoa-900/[.09] bg-cream-100/60 opacity-75";
  const card = <div className={`flex min-h-24 items-center gap-3 rounded-2xl border p-3.5 sm:p-4 ${cardClass}`}>
    <span className={`grid size-11 shrink-0 place-items-center rounded-xl font-mono text-xs font-black shadow-sm ${markerClass}`}>
      {topic.status === "completed" ? "✓" : topic.status === "available" ? String(index + 1).padStart(2, "0") : <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-label="Locked"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" /></svg>}
    </span>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-[10px] font-extrabold uppercase tracking-[.12em] text-cocoa-500">Topic {index + 1} · {state}</p>{topic.mastery_level === "master" && <span className="text-xs" aria-label="Mastered">✦</span>}</div><h2 className={`mt-1 font-serif text-xl font-bold leading-tight ${topic.status === "locked" ? "text-cocoa-600" : "text-cocoa-900"}`}>{topic.name}</h2>{topic.questions_attempted > 0 ? <div className="mt-2 flex items-center gap-2"><MasteryStars level={topic.mastery_level} /><span className="text-xs font-semibold text-cocoa-600">Best {Math.round(topic.accuracy * 100)}%</span></div> : <p className="mt-1 text-xs text-cocoa-600">{topic.status === "available" ? "Open this topic to build your first signal." : "Complete the topic above to continue."}</p>}</div>
    {topic.status !== "locked" && <span className="text-xl font-black text-ember-600" aria-hidden="true">→</span>}
  </div>;

  return <li className="pb-3 last:pb-0">{topic.status === "locked" ? <div aria-disabled="true">{card}</div> : <Link href={`/topic/${topic.id}`} className="block">{card}</Link>}</li>;
}

/**
 * Mastery progress bar — 4 stars, fills based on cumulative accuracy.
 *   novice      → 1 / 4
 *   apprentice  → 2 / 4
 *   adept       → 3 / 4
 *   master      → 4 / 4 (gold)
 */
function MasteryStars({ level }: { level: "novice" | "apprentice" | "adept" | "master" }) {
  const filled = level === "master" ? 4
              : level === "adept" ? 3
              : level === "apprentice" ? 2
              : 1;
  const fillColor = level === "master" ? "#FDCB40" : "#E5A823";

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${level} — ${filled} of 4`}
    >
      {[0, 1, 2, 3].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="size-3"
          fill={i < filled ? fillColor : "none"}
          stroke={i < filled ? fillColor : "#D4C9B5"}
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M12 3 L14.5 9.5 L21.5 10 L16 14.5 L17.5 21 L12 17.5 L6.5 21 L8 14.5 L2.5 10 L9.5 9.5 Z" />
        </svg>
      ))}
    </div>
  );
}
