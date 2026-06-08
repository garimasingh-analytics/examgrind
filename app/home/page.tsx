import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";
import SubjectGrid, { type SubjectWithProgress } from "@/components/SubjectGrid";
import ExamSwitcher from "@/components/ExamSwitcher";
import PremiumBadge from "@/components/PremiumBadge";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Subject = {
  id: string;
  name: string;
  cuet_code: string | null;
  icon: string | null;
  order_index: number;
};

type UserRow = {
  xp: number;
  level: number;
  coins: number;
  email: string;
  streak_count: number;
  longest_streak: number;
  last_active_date: string | null;
  subscription_status: "free" | "trial" | "paid";
  quizzes_started: number;
  exam_choice: string | null;
  paid_until: string | null;
};

// Exam display copy now lives inside ExamSwitcher — this header used to
// show a static pill from the EXAM_DISPLAY map, replaced by the
// switcher dropdown so users can change exam in one click.

export default async function HomePage() {
  const supabase = createServerSupabase();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  // PERFORMANCE: /home used to do 5 sequential awaits (profile → exam →
  // subjects → counts → mastery) which added ~500-1000ms of network time.
  // Three of those queries are independent — profile, topic counts, and
  // mastery — so we fire them in parallel here. Subjects still needs the
  // user's exam_choice, so it stays sequential after the parallel batch.
  const [profileRes, countsRes, masteryRes] = await Promise.all([
    supabase
      .from("users")
      .select(
        "email, xp, level, coins, streak_count, longest_streak, last_active_date, subscription_status, quizzes_started, exam_choice, paid_until"
      )
      .eq("id", authUser.id)
      .maybeSingle<UserRow>(),
    supabase
      .from("subject_topic_counts")
      .select("subject_id, topic_count"),
    supabase
      .from("user_topic_mastery")
      .select("mastery_level, topics!inner(chapters!inner(subject_id))")
      .eq("user_id", authUser.id),
  ]);

  let profile = profileRes.data;
  const countsData = countsRes.data;
  const masteryRaw = masteryRes.data;

  if (!profile) {
    // Defensive insert on first visit. New rows get exam_choice='cuet'
    // as a safe default — anyone who took a non-CUET path will already
    // have gotten exam_choice set by the OAuth callback or /start/[slug].
    const { data: created } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email ?? "",
        exam_choice: "cuet",
      })
      .select(
        "email, xp, level, coins, streak_count, longest_streak, last_active_date, subscription_status, quizzes_started, exam_choice, paid_until"
      )
      .single<UserRow>();
    profile = created;
  }

  const examSlug = profile?.exam_choice ?? "cuet";

  // Lazy downgrade: if the user's paid_until has lapsed but their
  // status is still 'paid', flip them to 'free' right now. Costs at
  // most a single conditional UPDATE per expired user per visit.
  const liveSubscriptionStatus = await ensureSubscriptionFreshness(
    authUser.id,
    profile?.subscription_status ?? "free",
    profile?.paid_until ?? null
  );

  // Explicit two-query path: look up exam_id by slug, then filter subjects
  // by exam_id. We tried the nested-filter approach (.eq("exam.slug",...))
  // for a single-roundtrip speedup but PostgREST returns inconsistent
  // results across exams with that pattern — SSC CGL specifically came
  // back unfiltered. The 50-100ms extra over the network is not worth
  // shipping wrong subjects to a brand-new user.
  const { data: examRow } = await supabase
    .from("exams")
    .select("id")
    .eq("slug", examSlug)
    .maybeSingle<{ id: string }>();

  let subjectsQuery = supabase
    .from("subjects")
    .select("id, name, cuet_code, icon, order_index")
    .order("order_index", { ascending: true });
  if (examRow?.id) {
    subjectsQuery = subjectsQuery.eq("exam_id", examRow.id);
  }
  const { data: subjectsData } = await subjectsQuery;
  const subjects = (subjectsData ?? []) as Subject[];

  // ---- Per-subject progress ----
  // Total topics per subject — pre-aggregated in a DB view so we don't hit
  // PostgREST's 1000-row cap (we have ~1600 topics across 41 subjects).
  const totalTopicsBySubject = new Map<string, number>();
  for (const row of (countsData ?? []) as Array<{
    subject_id: string;
    topic_count: number;
  }>) {
    totalTopicsBySubject.set(row.subject_id, row.topic_count);
  }
  const masteredBySubject = new Map<string, number>();
  const attemptedBySubject = new Map<string, number>();
  for (const m of (masteryRaw ?? []) as Array<{
    mastery_level: string;
    topics:
      | { chapters: { subject_id: string } | { subject_id: string }[] }
      | { chapters: { subject_id: string } | { subject_id: string }[] }[];
  }>) {
    const topicNode = Array.isArray(m.topics) ? m.topics[0] : m.topics;
    if (!topicNode) continue;
    const chNode = Array.isArray(topicNode.chapters)
      ? topicNode.chapters[0]
      : topicNode.chapters;
    if (!chNode) continue;
    const subjId = chNode.subject_id;
    attemptedBySubject.set(subjId, (attemptedBySubject.get(subjId) ?? 0) + 1);
    if (m.mastery_level === "master") {
      masteredBySubject.set(subjId, (masteredBySubject.get(subjId) ?? 0) + 1);
    }
  }

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const isPaid = liveSubscriptionStatus === "paid";
  const freeQuizzesLeft = Math.max(0, 3 - (profile?.quizzes_started ?? 0));
  // First-time user: truly brand-new account, zero activity.
  // We check BOTH counters AND XP — quizzes_started is the freemium-
  // gate counter (may be zero for historical accounts that pre-date
  // the gate), so XP > 0 is the surer signal of "this account has
  // done anything". Show the nudge only when nothing has ever
  // happened on this account.
  const isFirstTimeUser =
    (profile?.quizzes_started ?? 0) === 0 && xp === 0;
  // Admins get a visible "Admin →" pill in the header. The auto-redirect
  // on /auth/callback already sends them to /admin on sign-in, but the
  // pill is the fallback for when they click "Back to app" and want to
  // jump straight back.
  const isAdmin = isAdminEmail(authUser.email);

  // Streak gets shown only if it's still "alive" — i.e. the user practiced
  // today or yesterday. Otherwise we show 0 (the streak is broken even if
  // we haven't yet reset it in the DB on this view).
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);
  const lastDate = profile?.last_active_date ?? null;
  const streakAlive = lastDate === today || lastDate === yesterday;
  const streak = streakAlive ? profile?.streak_count ?? 0 : 0;

  // Pull first name from Google's user_metadata, falling back to the email handle.
  const fullName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    "";
  const firstName =
    fullName.trim().split(/\s+/)[0] ||
    (authUser.email?.split("@")[0] ?? "there");

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-20">
      {/* Header */}
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          {/* Admin pill — visible only to admin emails (the route itself
              is already gated server-side; this just gives admins a
              one-tap way back to /admin without typing the URL). */}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-full bg-cocoa-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cream-50 shadow-warm transition hover:scale-[1.03]"
              title="Open the admin dashboard"
            >
              <span aria-hidden>🛡️</span>
              <span>Admin</span>
            </Link>
          )}
          {/* One-click exam switcher dropdown */}
          <ExamSwitcher currentSlug={examSlug} />
        </div>
        <Link
          href="/me"
          className="flex items-center gap-2 transition hover:opacity-90 sm:gap-3"
          title="View your profile"
        >
          {/* Premium badge — paid users only. Free users see nothing here */}
          {/* (the Upgrade button lives elsewhere). Lives next to streak so   */}
          {/* it reads as a status pill, not a CTA.                           */}
          <PremiumBadge isPaid={isPaid} />
          {/* Daily streak — only render the flame when streak > 0 */}
          {streak > 0 && (
            <div
              className="flex items-center gap-1 rounded-full bg-ember-600/10 px-2.5 py-1.5 shadow-warm sm:gap-1.5 sm:px-3"
              title={`${streak}-day streak · longest ${profile?.longest_streak ?? streak}`}
            >
              <span className="text-sm leading-none sm:text-base">🔥</span>
              <span className="font-mono text-sm font-bold text-ember-700">
                {streak}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 rounded-full bg-cream-50 px-2.5 py-1.5 shadow-warm sm:gap-1.5 sm:px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cocoa-500 sm:text-xs">Lvl</span>
            <span className="font-serif text-sm font-bold text-cocoa-900 sm:text-base">{level}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-cream-50 px-2.5 py-1.5 shadow-warm sm:gap-1.5 sm:px-3">
            <span className="text-sm sm:text-base">⛁</span>
            <span className="font-mono text-xs font-bold text-cocoa-900 sm:text-sm">{xp}</span>
            <span className="text-[10px] text-cocoa-500 sm:text-xs">XP</span>
          </div>
          {/* Explicit "Profile" pill — Garima flagged that the streak /
              Lvl / XP chips were the only way to reach /me but weren't
              labeled as such. This pill adds a clear, named CTA so new
              students don't have to guess. The whole row is inside the
              <Link> so clicking any chip OR the Profile pill goes to /me. */}
          <div className="flex items-center gap-1 rounded-full bg-cocoa-900 px-2.5 py-1.5 text-cream-50 shadow-warm transition group-hover:scale-[1.03] sm:gap-1.5 sm:px-3">
            <span className="text-sm sm:text-base" aria-hidden>👤</span>
            <span className="text-xs font-bold uppercase tracking-wider sm:text-[13px]">
              Profile
            </span>
          </div>
        </Link>
      </header>

      {/* Free-tier banner — visible only when relevant */}
      {!isPaid && (
        <div className="mx-auto max-w-5xl px-4 pt-3 sm:px-6 sm:pt-5">
          <Link
            href="/me"
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 shadow-warm transition hover:-translate-y-0.5 ${
              freeQuizzesLeft === 0
                ? "border-ember-600/30 bg-gradient-to-r from-sun-400/15 to-ember-500/15"
                : "border-cocoa-900/[0.06] bg-cream-50"
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              <span className="text-base leading-none">
                {freeQuizzesLeft === 0 ? "👑" : "🎁"}
              </span>
              <span className="text-cocoa-700">
                {freeQuizzesLeft === 0 ? (
                  <>
                    <span className="font-bold text-cocoa-900">
                      You&apos;ve used your 3 free quizzes.
                    </span>{" "}
                    Upgrade to keep practicing.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-cocoa-900">
                      {freeQuizzesLeft}
                    </span>{" "}
                    of <span className="font-mono">3</span> free quiz
                    {freeQuizzesLeft === 1 ? "" : "zes"} left
                  </>
                )}
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-ember-700">
              Upgrade →
            </span>
          </Link>
        </div>
      )}

      {/* First-time user welcome nudge — visible only when the account
          has never started a quiz. Self-dismisses on first quiz_started
          (no state to clear, the condition just goes false). Warm, low-
          friction copy to bridge from sign-up → first tap. */}
      {isFirstTimeUser && (
        <div className="mx-auto max-w-5xl px-4 pt-3 sm:px-6 sm:pt-5">
          <div className="flex items-start gap-3 rounded-2xl border border-sun-500/30 bg-gradient-to-br from-sun-400/15 via-cream-50 to-ember-500/10 px-4 py-3 shadow-warm sm:items-center sm:px-5">
            <span className="text-2xl leading-none" aria-hidden>🎉</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-cocoa-900 sm:text-base">
                Welcome to ExamGrind! Tap any subject below to start your first quiz.
              </p>
              <p className="mt-0.5 text-xs text-cocoa-700 sm:text-sm">
                Every wrong answer comes with an AI diagnosis — not just a red X.
                First 3 quizzes free, no card needed.
              </p>
            </div>
            <span className="hidden text-xl sm:inline" aria-hidden>↓</span>
          </div>
        </div>
      )}

      {/* Greeting + chick */}
      <section className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cocoa-500">
              Hi, {firstName}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
              What do you want to practice?
            </h1>
            <p className="mt-3 max-w-xl text-base text-cocoa-700">
              Tap a subject. Walk the path. Earn XP.
            </p>
          </div>
          <Chick state="idle" size={120} className="hidden sm:block" />
        </div>
      </section>

      {/* Mock test CTA — surfaces the new full-length mode. Stays subtle:
          one row, not a giant banner, so it doesn't compete with the
          chapter-quiz path that drives daily engagement. */}
      <section className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
        <Link
          href="/mock"
          className="flex items-center justify-between gap-3 rounded-2xl border border-cocoa-900/[0.06] bg-gradient-to-r from-sun-400/15 via-sun-500/10 to-ember-500/15 px-4 py-3 shadow-warm transition hover:-translate-y-0.5 sm:px-5 sm:py-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📝</span>
            <div>
              <p className="text-sm font-bold text-cocoa-900">
                Take a full-length mock test
              </p>
              <p className="text-[11px] text-cocoa-700">
                Real exam timing, real scoring, sectional breakdown.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-cocoa-900 px-3 py-1.5 text-xs font-bold text-cream-50">
            Open →
          </span>
        </Link>
      </section>

      {/* Subject grid (Client Component handles search filter) */}
      <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
        <SubjectGrid
          subjects={subjects.map<SubjectWithProgress>((s) => ({
            id: s.id,
            name: s.name,
            cuet_code: s.cuet_code,
            icon: s.icon,
            total: totalTopicsBySubject.get(s.id) ?? 0,
            attempted: attemptedBySubject.get(s.id) ?? 0,
            mastered: masteredBySubject.get(s.id) ?? 0,
          }))}
        />
      </section>
    </main>
  );
}
