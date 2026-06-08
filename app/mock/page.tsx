import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import { FREE_LIMITS } from "@/lib/freemium";
import Chick from "@/components/Chick";
import ExamSwitcher from "@/components/ExamSwitcher";
import PremiumBadge from "@/components/PremiumBadge";

export const dynamic = "force-dynamic";

type MockCard = {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  total_questions: number;
  duration_seconds: number;
  positive_marks: number;
  negative_marks: number;
  subject_id: string | null;
};

type Section = { name: string; questions: number };

/**
 * /mock — full-length mock test hub.
 *
 * Renders the mocks available for the user's chosen exam, plus their
 * recent attempts (resume-or-review depending on status).
 *
 * Strict-mode gating: if the user has an in_progress attempt, we steer
 * them straight back to /mock/take/[attemptId] rather than letting them
 * start a new one — that would be a second mock_tests_started bump on
 * what's really a single attempt.
 */
export default async function MockHubPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("users")
    .select(
      "email, exam_choice, subscription_status, paid_until, quizzes_started, mock_tests_started, analyses_started"
    )
    .eq("id", user.id)
    .maybeSingle<{
      email: string;
      exam_choice: string | null;
      subscription_status: "free" | "trial" | "paid";
      paid_until: string | null;
      quizzes_started: number;
      mock_tests_started: number;
      analyses_started: number;
    }>();

  const liveSubStatus = await ensureSubscriptionFreshness(
    user.id,
    profile?.subscription_status ?? "free",
    profile?.paid_until ?? null
  );
  const isPaid = liveSubStatus === "paid";
  const examSlug = profile?.exam_choice ?? "cuet";

  // Mocks for this exam.
  const { data: examRow } = await supabase
    .from("exams")
    .select("id, name")
    .eq("slug", examSlug)
    .maybeSingle();

  const examId = examRow?.id;
  const examName = examRow?.name ?? "Mock";

  const { data: mocks } = examId
    ? await supabase
        .from("mock_tests")
        .select(
          "id, slug, display_name, description, total_questions, duration_seconds, positive_marks, negative_marks, subject_id, sections"
        )
        .eq("exam_id", examId)
        .eq("is_active", true)
        .order("display_name", { ascending: true })
    : { data: [] as MockCard[] };

  // Recent attempts for this user (any exam) for the "Resume / Review" rail.
  const { data: attempts } = await supabase
    .from("mock_attempts")
    .select(
      "id, mock_test_id, status, score, started_at, submitted_at, mock_test:mock_tests(display_name, total_questions, exam_id)"
    )
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(6);

  type AttemptRow = {
    id: string;
    mock_test_id: string;
    status: "in_progress" | "submitted" | "abandoned";
    score: number | null;
    started_at: string;
    submitted_at: string | null;
    mock_test: { display_name: string; total_questions: number } | null;
  };
  const attemptList = (attempts ?? []) as unknown as AttemptRow[];
  const inProgress = attemptList.find((a) => a.status === "in_progress");

  const freeUsed = profile?.mock_tests_started ?? 0;
  const freeLeft = isPaid ? Infinity : Math.max(0, FREE_LIMITS.mock - freeUsed);

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/home"
          className="font-serif text-2xl font-bold tracking-tight text-cocoa-900"
        >
          ExamGrind
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <PremiumBadge isPaid={isPaid} />
          <ExamSwitcher currentSlug={examSlug} />
          {/* Explicit Profile pill — same pattern as /home so /me is
              one tap from anywhere in the app. */}
          <Link
            href="/me"
            className="inline-flex items-center gap-1 rounded-full bg-cocoa-900 px-2.5 py-1.5 text-cream-50 shadow-warm transition hover:scale-[1.03] sm:gap-1.5 sm:px-3"
            title="View your profile"
          >
            <span aria-hidden>👤</span>
            <span className="text-xs font-bold uppercase tracking-wider sm:text-[13px]">
              Profile
            </span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-12 sm:px-8">
        {/* Resume banner */}
        {inProgress && (
          <Link
            href={`/mock/take/${inProgress.id}`}
            className="mb-6 flex items-center justify-between rounded-2xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 transition hover:bg-ember-500/15"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ember-700">
                In progress
              </p>
              <p className="text-sm font-semibold text-cocoa-900">
                {inProgress.mock_test?.display_name ?? "Mock test"} — resume
              </p>
            </div>
            <span className="rounded-xl bg-ember-600 px-3 py-1.5 text-xs font-bold text-cream-50">
              Continue →
            </span>
          </Link>
        )}

        {/* Hero */}
        <div className="flex items-start gap-3">
          <Chick state="idle" size={56} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
              {examName} mock tests
            </p>
            <h1 className="font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
              Real exam, real timer.
            </h1>
            <p className="mt-1.5 text-sm text-cocoa-700">
              {isPaid
                ? "Unlimited mocks — take one whenever you're ready."
                : freeLeft > 0
                ? `${freeLeft} free mock left this account. Choose carefully — quitting still burns it.`
                : "You've used your free mock. Upgrade to keep practicing under real conditions."}
            </p>
          </div>
        </div>

        {/* Catalog */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {(mocks ?? []).map((m) => (
            <MockCardLink
              key={m.id}
              mock={m}
              sections={(m as unknown as { sections: Section[] }).sections}
            />
          ))}
        </div>
        {(!mocks || mocks.length === 0) && (
          <p className="mt-8 rounded-2xl bg-cocoa-100 px-5 py-6 text-center text-sm text-cocoa-700">
            No mocks live for {examName} yet. We&apos;re adding more — check
            back soon.
          </p>
        )}

        {/* Past attempts */}
        {attemptList.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-3 font-serif text-xl font-bold text-cocoa-900">
              Your recent attempts
            </h2>
            <ul className="divide-y divide-cocoa-900/[0.06] overflow-hidden rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm">
              {attemptList.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between px-4 py-3 sm:px-5"
                >
                  <div>
                    <p className="text-sm font-semibold text-cocoa-900">
                      {a.mock_test?.display_name ?? "Mock"}
                    </p>
                    <p className="text-[11px] text-cocoa-500">
                      {new Date(a.started_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      ·{" "}
                      <StatusPill status={a.status} />
                    </p>
                  </div>
                  {a.status === "submitted" ? (
                    <Link
                      href={`/mock/results/${a.id}`}
                      className="rounded-xl bg-cocoa-900 px-3 py-1.5 text-xs font-bold text-cream-50"
                    >
                      View result
                    </Link>
                  ) : a.status === "in_progress" ? (
                    <Link
                      href={`/mock/take/${a.id}`}
                      className="rounded-xl bg-ember-600 px-3 py-1.5 text-xs font-bold text-cream-50"
                    >
                      Resume
                    </Link>
                  ) : (
                    <span className="text-[11px] font-semibold text-cocoa-500">
                      Abandoned
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

function StatusPill({
  status,
}: {
  status: "in_progress" | "submitted" | "abandoned";
}) {
  const cls =
    status === "submitted"
      ? "text-moss-700"
      : status === "in_progress"
      ? "text-ember-700"
      : "text-cocoa-500";
  const label =
    status === "submitted"
      ? "Submitted"
      : status === "in_progress"
      ? "In progress"
      : "Abandoned";
  return <span className={`font-semibold ${cls}`}>{label}</span>;
}

function MockCardLink({
  mock,
  sections,
}: {
  mock: MockCard;
  sections: Section[];
}) {
  const mins = Math.round(mock.duration_seconds / 60);
  return (
    <Link
      href={`/mock/start/${mock.id}`}
      className="group flex flex-col gap-2 rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm transition hover:shadow-warm-lg sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg font-bold text-cocoa-900">
          {mock.display_name}
        </h3>
        <span className="rounded-full bg-moss-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-moss-700">
          Free sample
        </span>
      </div>
      {mock.description && (
        <p className="text-[13px] text-cocoa-700">{mock.description}</p>
      )}
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-cocoa-500">
        <span>{mock.total_questions} questions</span>
        <span>·</span>
        <span>{mins} min</span>
        <span>·</span>
        <span>
          +{Number(mock.positive_marks)} / −{Number(mock.negative_marks)}
        </span>
      </div>
      {sections.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <span
              key={s.name}
              className="rounded-lg bg-cocoa-100 px-2 py-0.5 text-[10px] font-semibold text-cocoa-700"
            >
              {s.name} · {s.questions}
            </span>
          ))}
        </div>
      )}
      <span className="mt-3 inline-flex items-center gap-1 self-end text-xs font-semibold text-ember-700 group-hover:underline">
        Start →
      </span>
    </Link>
  );
}
