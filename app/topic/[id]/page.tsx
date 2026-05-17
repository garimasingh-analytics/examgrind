import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import QuestionCountPicker from "./QuestionCountPicker";
import Chick from "@/components/Chick";
import type { Topic, Chapter, Subject, UserTopicMastery } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function TopicLauncherPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  const { data: topicData } = await supabase
    .from("topics")
    .select("*, chapter:chapters(*, subject:subjects(*))")
    .eq("id", id)
    .maybeSingle();
  if (!topicData) notFound();

  type Joined = Topic & {
    chapter: Chapter & { subject: Subject };
  };
  const topic = topicData as Joined;

  const { data: masteryData } = await supabase
    .from("user_topic_mastery")
    .select("*")
    .eq("user_id", authUser.id)
    .eq("topic_id", id)
    .maybeSingle();
  const mastery = masteryData as UserTopicMastery | null;

  // Free-tier gate state — passed to the picker.
  const { data: gateProfile } = await supabase
    .from("users")
    .select("subscription_status, quizzes_started")
    .eq("id", authUser.id)
    .maybeSingle<{
      subscription_status: "free" | "trial" | "paid";
      quizzes_started: number;
    }>();
  const isPaid = gateProfile?.subscription_status === "paid";
  const freeQuizzesLeft = Math.max(
    0,
    3 - (gateProfile?.quizzes_started ?? 0)
  );

  const previouslyAttempted = (mastery?.questions_attempted ?? 0) > 0;
  const accuracy = mastery && mastery.questions_attempted > 0
    ? Math.round((mastery.questions_correct / mastery.questions_attempted) * 100)
    : null;

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-20">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
          ExamGrind
        </Link>
        <Link
          href={`/chapter/${topic.chapter_id}`}
          className="max-w-[55%] truncate text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
        >
          ← {topic.chapter.name}
        </Link>
      </header>

      <section className="mx-auto max-w-2xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="flex flex-col items-center text-center">
          <Chick state="idle" size={140} className="mb-6" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            {topic.chapter.subject.name} · {topic.chapter.name}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
            {topic.name}
          </h1>

          {previouslyAttempted ? (
            <p className="mt-3 text-base text-cocoa-700">
              You&apos;ve practiced this before — best accuracy <span className="font-semibold text-cocoa-900">{accuracy}%</span>. Let&apos;s go again.
            </p>
          ) : (
            <p className="mt-3 text-base text-cocoa-700">
              First time on this topic. Pick how many questions you want.
            </p>
          )}
        </div>

        {/* The slider lives in a Client Component */}
        <div className="mt-10">
          <QuestionCountPicker
            topicId={topic.id}
            freeQuizzesLeft={freeQuizzesLeft}
            isPaid={isPaid}
          />
        </div>
      </section>
    </main>
  );
}
