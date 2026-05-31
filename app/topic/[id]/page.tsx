import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import QuestionCountPicker from "./QuestionCountPicker";
import Chick from "@/components/Chick";
import ExamSwitcher from "@/components/ExamSwitcher";
import type { Topic, Chapter, Subject, UserTopicMastery } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function TopicLauncherPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  // PERFORMANCE: topic + mastery + user profile are all independent. Also
  // combined the previously-separate gateProfile + examProfile queries into
  // one users-table fetch (was doing the same select twice).
  type Joined = Topic & {
    chapter: Chapter & { subject: Subject };
  };
  type UserProfile = {
    subscription_status: "free" | "trial" | "paid";
    quizzes_started: number;
    exam_choice: string | null;
  };
  const [topicRes, masteryRes, profileRes] = await Promise.all([
    supabase
      .from("topics")
      .select("*, chapter:chapters(*, subject:subjects(*))")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("user_topic_mastery")
      .select("*")
      .eq("user_id", authUser.id)
      .eq("topic_id", id)
      .maybeSingle(),
    supabase
      .from("users")
      .select("subscription_status, quizzes_started, exam_choice")
      .eq("id", authUser.id)
      .maybeSingle<UserProfile>(),
  ]);

  if (!topicRes.data) notFound();
  const topic = topicRes.data as Joined;
  const mastery = masteryRes.data as UserTopicMastery | null;
  const profile = profileRes.data;

  const isPaid = profile?.subscription_status === "paid";
  const freeQuizzesLeft = Math.max(0, 3 - (profile?.quizzes_started ?? 0));
  const examSlug = profile?.exam_choice ?? "cuet";

  const previouslyAttempted = (mastery?.questions_attempted ?? 0) > 0;
  const accuracy = mastery && mastery.questions_attempted > 0
    ? Math.round((mastery.questions_correct / mastery.questions_attempted) * 100)
    : null;

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-20">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          <ExamSwitcher currentSlug={examSlug} />
        </div>
        <Link
          href={`/chapter/${topic.chapter_id}`}
          className="max-w-[45%] truncate text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
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
