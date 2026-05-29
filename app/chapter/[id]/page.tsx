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

  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice")
    .eq("id", authUser.id)
    .maybeSingle<{ exam_choice: string | null }>();
  const examSlug = profile?.exam_choice ?? "cuet";

  // Chapter + subject
  const { data: chapterData } = await supabase
    .from("chapters")
    .select("*, subject:subjects(*)")
    .eq("id", id)
    .maybeSingle();
  if (!chapterData) notFound();
  const chapter = chapterData as Chapter & { subject: Subject };

  // Topics for this chapter
  const { data: topicsData } = await supabase
    .from("topics")
    .select("*")
    .eq("chapter_id", id)
    .order("order_index", { ascending: true });
  const topics = (topicsData ?? []) as Topic[];

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

      {/* Title block */}
      <section className="mx-auto max-w-3xl px-4 pt-2 text-center sm:px-6 sm:pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
          {chapter.cuet_unit ?? "Chapter"}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
          {chapter.name}
        </h1>
        <p className="mt-3 text-base text-cocoa-700">
          {topics.length > 0
            ? `Walk the path. ${topics.length} topic${topics.length === 1 ? "" : "s"}.`
            : "Topics for this chapter are coming soon."}
        </p>
      </section>

      {/* The Path */}
      {topics.length > 0 ? (
        <section className="mx-auto mt-12 max-w-md px-6">
          <ol className="relative">
            {enriched.map((t, i) => (
              <PathNode key={t.id} topic={t} index={i} total={enriched.length} />
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
 * One node on the Duolingo-style winding path.
 * Alternates left/right so it reads as a meandering trail.
 *
 * Mastery rendering:
 *   - the main circle's color graduates from sun (apprentice) →
 *     ember (adept) → gold (master) so the path itself shows progress
 *   - stars below the topic name give a 4-step mastery progress bar
 *   - master tier adds a subtle pulsing golden glow ring + ✨
 */
function PathNode({
  topic,
  index,
  total,
}: {
  topic: TopicWithMastery;
  index: number;
  total: number;
}) {
  const align = index % 2 === 0 ? "left" : "right";
  const isLast = index === total - 1;

  // Map cumulative mastery → completed-circle styling.
  const masteredStyle =
    topic.mastery_level === "master"
      ? "bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 ring-sun-400/60"
    : topic.mastery_level === "adept"
      ? "bg-ember-500 ring-ember-400/40"
    : "bg-sun-500 ring-sun-400/40"; // apprentice / novice with completed status

  const circleClass =
    topic.status === "completed"
      ? masteredStyle
    : topic.status === "available"
      ? "bg-ember-600 ring-ember-500/30 hover:scale-105"
    : "bg-cream-200 ring-cream-300/50";

  const Inner = (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "relative flex size-20 items-center justify-center rounded-full shadow-warm-lg ring-4 transition",
          circleClass,
        ].join(" ")}
      >
        {topic.status === "completed" ? (
          topic.mastery_level === "master" ? (
            // Crown for master tier
            <svg viewBox="0 0 24 24" className="size-10" fill="none">
              <path
                d="M3 8l4 4 5-8 5 8 4-4-2 11H5L3 8z"
                fill="#FFFDF6"
                stroke="#1F1A14"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="15" r="1.5" fill="#1F1A14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-9" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#1F1A14"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        ) : topic.status === "available" ? (
          <span className="font-serif text-2xl font-bold text-cream-50">
            {index + 1}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="size-7 text-cocoa-500" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}

        {/* Pulsing rings */}
        {topic.status === "available" && (
          <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-ember-500 opacity-25" />
        )}
        {topic.mastery_level === "master" && (
          <span className="absolute -inset-2 -z-10 animate-ping rounded-full bg-sun-500 opacity-40" />
        )}
      </div>

      <p
        className={[
          "flex max-w-[200px] items-center justify-center gap-1 text-center text-sm font-semibold leading-tight",
          topic.status === "locked" ? "text-cocoa-500" : "text-cocoa-900",
        ].join(" ")}
      >
        {topic.name}
        {topic.mastery_level === "master" && <span aria-hidden="true">✨</span>}
      </p>

      {/* Mastery stars — only show once the user has attempted */}
      {topic.questions_attempted > 0 && (
        <MasteryStars level={topic.mastery_level} />
      )}

      {topic.questions_attempted > 0 && (
        <p className="text-xs text-cocoa-500">
          Best: {Math.round(topic.accuracy * 100)}%
        </p>
      )}
    </div>
  );

  return (
    <li
      className={[
        "relative flex pb-12 last:pb-0",
        align === "left" ? "justify-start pl-2" : "justify-end pr-2",
      ].join(" ")}
    >
      {/* Curved connector to the next node (skip if last) */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={[
            "absolute top-20 z-0 h-12 w-2/3 border-cream-300",
            align === "left"
              ? "left-12 border-b-[3px] border-r-[3px] rounded-br-[3rem]"
              : "right-12 border-b-[3px] border-l-[3px] rounded-bl-[3rem]",
          ].join(" ")}
        />
      )}

      {topic.status === "locked" ? (
        <div className="z-10 cursor-not-allowed">{Inner}</div>
      ) : (
        <Link
          href={`/topic/${topic.id}`}
          className="z-10 transition hover:-translate-y-0.5"
        >
          {Inner}
        </Link>
      )}
    </li>
  );
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
