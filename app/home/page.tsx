import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import Chick from "@/components/Chick";
import SubjectGrid, { type SubjectWithProgress } from "@/components/SubjectGrid";
import ExamSwitcher from "@/components/ExamSwitcher";
import PremiumBadge from "@/components/PremiumBadge";
import DailyMissionCard, { type MissionStep } from "@/components/DailyMissionCard";
import AdSlot from "@/components/AdSlot";
import StudyPlanSetup from "@/components/StudyPlanSetup";
import MonthlyProgressCalendar from "@/components/MonthlyProgressCalendar";
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

type TodayQuiz = { id: string; topic_id: string | null };
type TodayQuestion = {
  quiz_id: string;
  correct_answer: string;
  user_answer: string | null;
  time_taken: number | null;
};
type ActivityQuiz = { created_at: string };

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

type StudyPreference = {
  selected_subject_ids: string[];
  target_exam_date: string | null;
  target_score: string | null;
  daily_study_minutes: number | null;
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
  const indiaDateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const indiaDateParts = indiaDateFormatter.formatToParts(new Date());
  const indiaPart = (type: Intl.DateTimeFormatPartTypes) => Number(
    indiaDateParts.find((part) => part.type === type)?.value ?? 0,
  );
  // Store timestamps in UTC, but define "today" in the students' Indian
  // timezone so a late-night practice session is never credited to tomorrow.
  const todayIndiaStart = new Date(
    Date.UTC(indiaPart("year"), indiaPart("month") - 1, indiaPart("day")) -
      5.5 * 60 * 60 * 1000,
  ).toISOString();
  const indiaDateKey = (value: Date | string) => {
    const parts = indiaDateFormatter.formatToParts(new Date(value));
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "00";
    return `${part("year")}-${part("month").padStart(2, "0")}-${part("day").padStart(2, "0")}`;
  };

  const [profileRes, countsRes, masteryRes, todayQuizzesRes, activityRes] = await Promise.all([
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
      .select("topic_id, mastery_level, questions_attempted, questions_correct, last_quizzed_at, topics!inner(name, chapters!inner(subject_id))")
      .eq("user_id", authUser.id),
    supabase
      .from("quizzes")
      .select("id, topic_id")
      .eq("user_id", authUser.id)
      .not("score", "is", null)
      .gte("created_at", todayIndiaStart)
      .limit(100),
    supabase
      .from("quizzes")
      .select("created_at")
      .eq("user_id", authUser.id)
      .not("score", "is", null)
      .gte("created_at", new Date(Date.now() - 35 * 86_400_000).toISOString())
      .limit(500),
  ]);

  let profile = profileRes.data;
  const countsData = countsRes.data;
  const masteryRaw = masteryRes.data;
  const todayQuizzes = (todayQuizzesRes.data ?? []) as TodayQuiz[];
  const activeDateKeys = Array.from(new Set(
    ((activityRes.data ?? []) as ActivityQuiz[]).map((quiz) => indiaDateKey(quiz.created_at)),
  ));

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
  const admin = createAdminSupabase();
  const { data: scoreBoostPurchase } = await admin
    .from("purchase_entitlements")
    .select("starts_at, expires_at")
    .eq("user_id", authUser.id)
    .eq("product", "score_boost_21d")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ starts_at: string; expires_at: string }>();
  const scoreBoostDay = scoreBoostPurchase
    ? Math.max(1, Math.min(21, Math.floor((Date.now() - new Date(scoreBoostPurchase.starts_at).getTime()) / 86_400_000) + 1))
    : null;

  // Explicit two-query path: look up exam_id by slug, then filter subjects
  // by exam_id. We tried the nested-filter approach (.eq("exam.slug",...))
  // for a single-roundtrip speedup but PostgREST returns inconsistent
  // results across exams with that pattern — SSC CGL specifically came
  // back unfiltered. The 50-100ms extra over the network is not worth
  // shipping wrong subjects to a brand-new user.
  const { data: examRow } = await supabase
    .from("exams")
    .select("id, name")
    .eq("slug", examSlug)
    .maybeSingle<{ id: string; name: string }>();

  let subjectsQuery = supabase
    .from("subjects")
    .select("id, name, cuet_code, icon, order_index")
    .order("order_index", { ascending: true });
  if (examRow?.id) {
    subjectsQuery = subjectsQuery.eq("exam_id", examRow.id);
  }
  const { data: subjectsData } = await subjectsQuery;
  const subjects = (subjectsData ?? []) as Subject[];
  const { data: studyPreferenceRaw } = examRow?.id
    ? await admin
        .from("user_exam_preferences")
        .select("selected_subject_ids, target_exam_date, target_score, daily_study_minutes")
        .eq("user_id", authUser.id)
        .eq("exam_id", examRow.id)
        .maybeSingle<StudyPreference>()
    : { data: null };
  const studyPreference = studyPreferenceRaw as StudyPreference | null;
  const examDaysLeft = studyPreference?.target_exam_date
    ? Math.ceil((new Date(`${studyPreference.target_exam_date}T00:00:00+05:30`).getTime() - Date.now()) / 86_400_000)
    : null;
  const allExamSubjectIds = new Set(subjects.map((subject) => subject.id));
  const preferredSubjectIds = new Set(
    (studyPreference?.selected_subject_ids ?? []).filter((id) => allExamSubjectIds.has(id)),
  );
  const hasStudyProfile = preferredSubjectIds.size > 0;
  // Until the student completes setup, preserve the existing whole-exam
  // experience behind the required setup sheet. Once saved, every home
  // calculation below switches to only their actual papers.
  const studySubjects = hasStudyProfile
    ? subjects.filter((subject) => preferredSubjectIds.has(subject.id))
    : subjects;
  const activeSubjectIds = new Set(studySubjects.map((subject) => subject.id));

  // Today's dashboard proof follows the active exam too. Resolve quiz topics
  // through chapters → subjects rather than relying on subject names, which
  // can overlap between exams (for example Physics in CUET and NEET).
  const todayTopicIds = todayQuizzes.flatMap((quiz) => quiz.topic_id ? [quiz.topic_id] : []);
  const { data: todayTopicsRaw } = todayTopicIds.length > 0
    ? await supabase
        .from("topics")
        .select("id, chapters!inner(subject_id)")
        .in("id", todayTopicIds)
    : { data: [] };
  const activeTodayTopicIds = new Set(
    ((todayTopicsRaw ?? []) as Array<{
      id: string;
      chapters: { subject_id: string } | { subject_id: string }[];
    }>)
      .filter((topic) => {
        const chapter = Array.isArray(topic.chapters)
          ? topic.chapters[0]
          : topic.chapters;
        return chapter && activeSubjectIds.has(chapter.subject_id);
      })
      .map((topic) => topic.id),
  );
  const activeTodayQuizIds = todayQuizzes
    .filter((quiz) => quiz.topic_id && activeTodayTopicIds.has(quiz.topic_id))
    .map((quiz) => quiz.id);
  let todayQuestions: TodayQuestion[] = [];
  if (activeTodayQuizIds.length > 0) {
    const { data } = await supabase
      .from("questions")
      .select("quiz_id, correct_answer, user_answer, time_taken")
      .in("quiz_id", activeTodayQuizIds)
      .not("user_answer", "is", null)
      .limit(500);
    todayQuestions = (data ?? []) as TodayQuestion[];
  }
  const todayCorrect = todayQuestions.filter(
    (question) => question.user_answer === question.correct_answer,
  ).length;
  const todayAccuracy = todayQuestions.length > 0
    ? Math.round((todayCorrect / todayQuestions.length) * 100)
    : 0;
  const todayMinutes = Math.round(
    todayQuestions.reduce(
      (total, question) => total + Math.max(0, question.time_taken ?? 0),
      0,
    ) / 60,
  );

  // ---- Per-subject progress ----
  // Total topics per subject — pre-aggregated in a DB view so we don't hit
  // PostgREST's 1000-row cap (we have ~1600 topics across 41 subjects).
  const totalTopicsBySubject = new Map<string, number>();
  for (const row of (countsData ?? []) as Array<{
    subject_id: string;
    topic_count: number;
  }>) {
    if (!activeSubjectIds.has(row.subject_id)) continue;
    totalTopicsBySubject.set(row.subject_id, row.topic_count);
  }
  const masteredBySubject = new Map<string, number>();
  const attemptedBySubject = new Map<string, number>();
  const readinessPointsBySubject = new Map<string, number>();
  const masteryWeight: Record<string, number> = {
    novice: 0.25,
    apprentice: 0.6,
    adept: 0.8,
    master: 1,
  };
  for (const m of (masteryRaw ?? []) as Array<{
    topic_id: string;
    mastery_level: string;
    questions_attempted: number;
    questions_correct: number;
    topics:
      | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }
      | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }[];
  }>) {
    const topicNode = Array.isArray(m.topics) ? m.topics[0] : m.topics;
    if (!topicNode) continue;
    const chNode = Array.isArray(topicNode.chapters)
      ? topicNode.chapters[0]
      : topicNode.chapters;
    if (!chNode) continue;
    const subjId = chNode.subject_id;
    // Mastery is loaded once for the signed-in user. Only include topics
    // belonging to the active exam; otherwise switching exams would make
    // the readiness denominator and score blend separate syllabi.
    if (!activeSubjectIds.has(subjId)) continue;
    attemptedBySubject.set(subjId, (attemptedBySubject.get(subjId) ?? 0) + 1);
    readinessPointsBySubject.set(
      subjId,
      (readinessPointsBySubject.get(subjId) ?? 0) +
        (masteryWeight[m.mastery_level] ?? 0),
    );
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
  const totalTopics = Array.from(totalTopicsBySubject.values()).reduce(
    (total, count) => total + count,
    0,
  );
  const attemptedTopicCount = Array.from(attemptedBySubject.values()).reduce(
    (total, count) => total + count,
    0,
  );
  const readinessPoints = Array.from(readinessPointsBySubject.values()).reduce(
    (total, points) => total + points,
    0,
  );
  const readiness = totalTopics > 0
    ? Math.round((readinessPoints / totalTopics) * 100)
    : 0;

  // Daily Mission uses only completed learning evidence: the weakest attempted
  // topic gets priority; brand-new learners get the first available topic in
  // their selected exam. No AI call or new table is required on page load.
  type MissionTopic = {
    id: string;
    name: string;
    subjectId: string;
    accuracy: number;
    masteryLevel: string;
    lastQuizzedAt: string | null;
  };
  const attemptedTopics: MissionTopic[] = [];
  for (const m of (masteryRaw ?? []) as Array<{
    topic_id: string;
    questions_attempted: number;
    questions_correct: number;
    mastery_level: string;
    last_quizzed_at: string | null;
    topics:
      | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }
      | { name: string; chapters: { subject_id: string } | { subject_id: string }[] }[];
  }>) {
    if (m.questions_attempted <= 0) continue;
    const topicNode = Array.isArray(m.topics) ? m.topics[0] : m.topics;
    const chapterNode = topicNode && (Array.isArray(topicNode.chapters)
      ? topicNode.chapters[0]
      : topicNode.chapters);
    if (!topicNode || !chapterNode) continue;
    if (!activeSubjectIds.has(chapterNode.subject_id)) continue;
    attemptedTopics.push({
      id: m.topic_id,
      name: topicNode.name,
      subjectId: chapterNode.subject_id,
      accuracy: m.questions_correct / m.questions_attempted,
      masteryLevel: m.mastery_level,
      lastQuizzedAt: m.last_quizzed_at,
    });
  }
  const weakestTopic = attemptedTopics
    .filter((topic) => topic.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const revisionIntervalDays: Record<string, number> = {
    novice: 1,
    apprentice: 3,
    adept: 7,
    master: 14,
  };
  const revisionDueTopics = attemptedTopics
    .filter((topic) => {
      if (topic.accuracy < 0.7 || !topic.lastQuizzedAt) return false;
      const dueAt = new Date(topic.lastQuizzedAt).getTime() +
        (revisionIntervalDays[topic.masteryLevel] ?? 3) * 86_400_000;
      return dueAt <= Date.now();
    })
    .sort((a, b) => {
      const aDueAt = new Date(a.lastQuizzedAt ?? 0).getTime() +
        (revisionIntervalDays[a.masteryLevel] ?? 3) * 86_400_000;
      const bDueAt = new Date(b.lastQuizzedAt ?? 0).getTime() +
        (revisionIntervalDays[b.masteryLevel] ?? 3) * 86_400_000;
      return aDueAt - bDueAt;
    });
  // A daily mission is a compact study session, not a single quiz. We always
  // lead with real learning evidence (repair + due recall), then use the
  // least-covered subjects in the selected exam to fill the remaining steps.
  // This remains deterministic and does not spend an AI credit on page load.
  const missionSteps: MissionStep[] = [];
  const missionTopicIds = new Set<string>();
  const subjectNameFor = (subjectId: string) =>
    studySubjects.find((subject) => subject.id === subjectId)?.name ?? "your subject";
  const addMissionTopic = (
    topic: MissionTopic,
    type: MissionStep["type"],
  ) => {
    if (missionSteps.length >= 3 || missionTopicIds.has(topic.id)) return;
    missionTopicIds.add(topic.id);
    missionSteps.push({
      href: `/topic/${topic.id}`,
      subjectId: topic.subjectId,
      subjectName: subjectNameFor(topic.subjectId),
      topicName: topic.name,
      type,
      accuracy: Math.round(topic.accuracy * 100),
      completed: activeTodayTopicIds.has(topic.id),
    });
  };

  if (weakestTopic) addMissionTopic(weakestTopic, "repair");
  for (const topic of revisionDueTopics) {
    addMissionTopic(topic, "revision");
    if (missionSteps.length >= 2) break;
  }

  const leastCoveredSubjects = [...studySubjects].sort((a, b) => {
    const aProgress = (attemptedBySubject.get(a.id) ?? 0) /
      Math.max(totalTopicsBySubject.get(a.id) ?? 1, 1);
    const bProgress = (attemptedBySubject.get(b.id) ?? 0) /
      Math.max(totalTopicsBySubject.get(b.id) ?? 1, 1);
    return aProgress - bProgress;
  });
  const selectedMissionSubjectIds = new Set(missionSteps.map((step) => step.subjectId));
  const seedSubjectIds = [
    ...leastCoveredSubjects.filter((subject) => !selectedMissionSubjectIds.has(subject.id)),
    ...leastCoveredSubjects,
  ]
    .map((subject) => subject.id)
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .slice(0, Math.max(0, 3 - missionSteps.length));
  if (seedSubjectIds.length > 0) {
    const { data: seedTopicsRaw } = await supabase
      .from("topics")
      .select("id, name, chapters!inner(subject_id)")
      .in("chapters.subject_id", seedSubjectIds)
      .order("order_index", { ascending: true })
      .limit(100);
    const firstSeedBySubject = new Map<string, { id: string; name: string }>();
    for (const raw of (seedTopicsRaw ?? []) as Array<{
      id: string;
      name: string;
      chapters: { subject_id: string } | { subject_id: string }[];
    }>) {
      const chapter = Array.isArray(raw.chapters) ? raw.chapters[0] : raw.chapters;
      if (chapter && !firstSeedBySubject.has(chapter.subject_id)) {
        firstSeedBySubject.set(chapter.subject_id, { id: raw.id, name: raw.name });
      }
    }
    for (const subjectId of seedSubjectIds) {
      if (missionSteps.length >= 3) break;
      const seedTopic = firstSeedBySubject.get(subjectId);
      const subject = studySubjects.find((item) => item.id === subjectId);
      if (!subject) continue;
      if (seedTopic) {
        missionTopicIds.add(seedTopic.id);
        missionSteps.push({
          href: `/topic/${seedTopic.id}`,
          subjectId,
          subjectName: subject.name,
          topicName: seedTopic.name,
          type: attemptedTopics.length === 0 ? "foundation" : "advance",
          accuracy: null,
          completed: activeTodayTopicIds.has(seedTopic.id),
        });
      } else {
        missionSteps.push({
          href: `/subject/${subject.id}`,
          subjectId,
          subjectName: subject.name,
          topicName: null,
          type: attemptedTopics.length === 0 ? "foundation" : "advance",
          accuracy: null,
          completed: false,
        });
      }
    }
  }

  // Streak gets shown only if it's still "alive" — i.e. the user practiced
  // today or yesterday. Otherwise we show 0 (the streak is broken even if
  // we haven't yet reset it in the DB on this view).
  const today = indiaDateKey(new Date());
  const yesterday = indiaDateKey(new Date(Date.now() - 86_400_000));
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
        <div className="flex items-center gap-2">
          <Link href="/coach" className="inline-flex items-center gap-1 rounded-full border border-cocoa-900/[.1] bg-cream-50 px-2.5 py-1.5 text-xs font-bold text-cocoa-900 shadow-warm transition hover:-translate-y-0.5" title="Open ExamGrind Coach">
            <span aria-hidden>🧠</span><span className="hidden sm:inline">Coach</span>
          </Link>
        <Link href="/me" className="flex items-center gap-2 transition hover:opacity-90" title="View your profile">
          {/* Premium badge — paid users only. Free users see nothing here */}
          {/* (the Upgrade button lives elsewhere). Lives next to streak so   */}
          {/* it reads as a status pill, not a CTA.                           */}
          <PremiumBadge isPaid={isPaid} />
          {/* Daily streak — only render the flame when streak > 0 */}
          {streak > 0 && (
            <div
              className="hidden items-center gap-1 rounded-full bg-ember-600/10 px-2.5 py-1.5 shadow-warm sm:flex"
              title={`${streak}-day streak · longest ${profile?.longest_streak ?? streak}`}
            >
              <span className="text-sm leading-none sm:text-base">🔥</span>
              <span className="font-mono text-sm font-bold text-ember-700">
                {streak}
              </span>
            </div>
          )}
          <div className="hidden items-center gap-1 rounded-full bg-cream-50 px-2.5 py-1.5 shadow-warm sm:flex">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cocoa-500">Lvl</span>
            <span className="font-serif text-sm font-bold text-cocoa-900">{level}</span>
            <span className="ml-1 text-sm">⛁</span>
            <span className="font-mono text-xs font-bold text-cocoa-900">{xp}</span>
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
        </div>
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

      <section className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="rounded-3xl border border-cocoa-900/[.07] bg-gradient-to-br from-cream-50 via-cream-50 to-sun-400/10 px-5 py-6 shadow-warm sm:px-7 sm:py-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cocoa-500">Hi, {firstName}</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cocoa-900 sm:text-4xl">Your next best step.</h1>
            <p className="mt-2 text-sm text-cocoa-700 sm:text-base">One focused session is enough for today. Start there; the rest can wait.</p>
            {hasStudyProfile && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {examDaysLeft !== null && examDaysLeft >= 0 && (
                  <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs font-extrabold tracking-wide text-white shadow-warm">
                    {examDaysLeft === 0 ? "Your exam is today" : `${examDaysLeft} days to go`}
                  </span>
                )}
                <p className="text-sm font-semibold text-ember-700">
                  {studySubjects.length} chosen {studySubjects.length === 1 ? "subject" : "subjects"}
                  {studyPreference?.daily_study_minutes ? ` · ${studyPreference.daily_study_minutes} min/day` : ""}
                  {studyPreference?.target_exam_date ? ` · target ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${studyPreference.target_exam_date}T00:00:00`))}` : ""}
                </p>
              </div>
            )}
          </div>
          <Chick state="idle" size={92} className="hidden sm:block" />
        </div>
        <MonthlyProgressCalendar
          today={today}
          activeDates={activeDateKeys}
          streak={streak}
          longestStreak={profile?.longest_streak ?? 0}
        />
        </div>
      </section>

      {missionSteps.length > 0 && <DailyMissionCard steps={missionSteps} scoreBoostDay={scoreBoostDay} />}

      <section className="mx-auto mt-4 max-w-5xl px-4 sm:px-6">
        <Link href="/weekly" className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-cocoa-900/[.07] bg-cream-50 px-4 py-3 shadow-warm transition hover:-translate-y-0.5 hover:bg-white">
          <span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-cocoa-500">Today</span><span className="mt-0.5 block text-sm font-bold text-cocoa-900">{todayQuestions.length} questions{todayQuestions.length > 0 ? ` · ${todayAccuracy}% · ${todayMinutes} min` : ""}</span></span>
          <span className="hidden h-7 w-px bg-cocoa-900/[.08] sm:block" />
          <span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-cocoa-500">Readiness</span><span className="mt-0.5 block text-sm font-bold text-cocoa-900">{readiness}% · {attemptedTopicCount}/{totalTopics} started</span></span>
          <span className="ml-auto text-xs font-bold text-ember-700">Weekly proof →</span>
        </Link>
      </section>
      {/* Premium is a genuinely focused, ad-free study experience. The
          AdSense tag lives inside AdSlot, so omitting this component also
          prevents an Offerwall from being eligible on a paid user's Home. */}
      {!isPaid && <AdSlot />}

      {/* The syllabus is the primary workspace. Everything else stays secondary. */}
      <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">{hasStudyProfile ? "Your chosen subjects" : "Your syllabus"}</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-cocoa-900">{hasStudyProfile ? "Your preparation, in one place" : "Choose a subject"}</h2>
          </div>
          <div className="flex items-center gap-3">
            <StudyPlanSetup
              examSlug={examSlug}
              examName={examRow?.name ?? "selected exam"}
              subjects={subjects}
              initialSubjectIds={hasStudyProfile ? Array.from(preferredSubjectIds) : []}
              initialTargetExamDate={studyPreference?.target_exam_date ?? null}
              initialTargetScore={studyPreference?.target_score ?? null}
              initialDailyStudyMinutes={studyPreference?.daily_study_minutes ?? null}
              needsSetup={!hasStudyProfile}
            />
            <Link href="/weekly" className="text-sm font-bold text-ember-700 hover:text-ember-800">Weekly proof →</Link>
          </div>
        </div>
        <SubjectGrid
          subjects={studySubjects.map<SubjectWithProgress>((s) => ({
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

      <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">When you need it</p><h2 className="mt-1 font-serif text-xl font-semibold text-cocoa-900">Study tools</h2></div><p className="hidden text-xs text-cocoa-500 sm:block">These stay out of your way until you need them.</p></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <CompactTool href="/vault" icon="🗂️" title="Study Vault" detail="Create flashcards and mnemonics." />
          <CompactTool href="/mistakes" icon="📘" title="Mistake Book" detail="Repair incorrect answers." />
          <CompactTool href="/revision" icon="🧠" title="Smart Revision" detail={revisionDueTopics.length > 0 ? `${revisionDueTopics.length} due for recall.` : "Recall when it is due."} />
          <CompactTool href="/mock" icon="📝" title="Mock test" detail="Try full exam timing." />
        </div>
      </section>
    </main>
  );
}

function CompactTool({ href, icon, title, detail }: { href: string; icon: string; title: string; detail: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm transition hover:-translate-y-0.5 hover:bg-white">
      <span className="text-xl" aria-hidden>{icon}</span>
      <span className="min-w-0"><span className="block text-sm font-bold text-cocoa-900">{title}</span><span className="block truncate text-xs text-cocoa-700">{detail}</span></span>
      <span className="ml-auto text-sm font-bold text-ember-700" aria-hidden>→</span>
    </Link>
  );
}
