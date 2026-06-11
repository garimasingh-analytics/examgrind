import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import Chick from "@/components/Chick";
import PlanPanel from "./PlanPanel";
import ChickPicker from "@/components/ChickPicker";
import PromoCodeRedeemer from "@/components/PromoCodeRedeemer";
import type { ChickVariant } from "@/lib/chicks";
import CancelSubButton from "./CancelSubButton";
import { ensureSubscriptionFreshness } from "@/lib/subscription";

export const dynamic = "force-dynamic";

type UserRow = {
  email: string;
  xp: number;
  level: number;
  quizzes_taken: number;
  quizzes_started: number;
  analyses_taken: number;
  subscription_status: "free" | "trial" | "paid";
  streak_count: number;
  longest_streak: number;
  last_active_date: string | null;
  exam_choice: string | null;
  paid_until: string | null;
};

type QuizRow = {
  id: string;
  subject: string;
  subtopic: string | null;
  score: number | null;
  xp_awarded: number;
  created_at: string;
  topic_id: string | null;
};

type MasteryRow = {
  topic_id: string;
  questions_attempted: number;
  questions_correct: number;
  mastery_level: "novice" | "apprentice" | "adept" | "master";
  topics: { name: string } | { name: string }[] | null;
};

export default async function ProfilePage() {
  const supabase = createServerSupabase();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  // ---- Profile + identity ----
  const { data: profile } = await supabase
    .from("users")
    .select(
      "email, xp, level, quizzes_taken, quizzes_started, analyses_taken, subscription_status, streak_count, longest_streak, last_active_date, exam_choice, paid_until"
    )
    .eq("id", authUser.id)
    .maybeSingle<UserRow>();

  // Load explicitly-granted chicks (promo redemptions etc.)
  const adminForChicks = createAdminSupabase();
  const { data: chickUnlocksRows } = await adminForChicks
    .from("user_chick_unlocks")
    .select("chick")
    .eq("user_id", authUser.id);
  const grantedChicks = ((chickUnlocksRows ?? []) as { chick: string }[])
    .map((r) => r.chick) as ChickVariant[];

  // Lazy downgrade if paid_until has lapsed but status is still 'paid'.
  const liveSubscriptionStatus = await ensureSubscriptionFreshness(
    authUser.id,
    profile?.subscription_status ?? "free",
    profile?.paid_until ?? null
  );

  const fullName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    "";

  // Streak — only "alive" if practiced today/yesterday, else dormant.
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);
  const lastDate = profile?.last_active_date ?? null;
  const streakAlive = lastDate === today || lastDate === yesterday;
  const streak = streakAlive ? profile?.streak_count ?? 0 : 0;

  // ---- Recent quizzes ----
  const { data: recentRaw } = await supabase
    .from("quizzes")
    .select("id, subject, subtopic, score, xp_awarded, created_at, topic_id")
    .eq("user_id", authUser.id)
    .not("score", "is", null)
    .order("created_at", { ascending: false })
    .limit(8);
  const recent = (recentRaw ?? []) as QuizRow[];

  // ---- Top mastered topics (master tier first, then adept) ----
  const { data: masteryRaw } = await supabase
    .from("user_topic_mastery")
    .select(
      "topic_id, questions_attempted, questions_correct, mastery_level, topics(name)"
    )
    .eq("user_id", authUser.id)
    .order("questions_correct", { ascending: false })
    .limit(50);
  const masteryRows = (masteryRaw ?? []) as MasteryRow[];

  const topicName = (m: MasteryRow) => {
    const t = Array.isArray(m.topics) ? m.topics[0] : m.topics;
    return t?.name ?? "Unknown topic";
  };
  const masterTopics = masteryRows.filter((m) => m.mastery_level === "master");
  const adeptTopics = masteryRows.filter((m) => m.mastery_level === "adept");
  const masteredCount = masterTopics.length;

  // ---- Cross-quiz weakness map ----
  // Pull every analysis the user has, aggregate weaknesses by concept.
  type AnalysisRow = {
    quiz_id: string;
    generated_at: string;
    analysis: {
      weaknesses?: Array<{
        concept: string;
        severity: "high" | "medium" | "low";
        improve?: {
          practice?: { concept_focus?: string; drill_size?: number };
          read?: { source?: string };
        };
      }>;
    };
    quizzes: { topic_id: string | null } | { topic_id: string | null }[] | null;
  };

  const { data: analysesRaw } = await supabase
    .from("quiz_analyses")
    .select("quiz_id, generated_at, analysis, quizzes(topic_id)")
    .eq("user_id", authUser.id)
    .order("generated_at", { ascending: false })
    .limit(20);
  const analyses = (analysesRaw ?? []) as AnalysisRow[];

  // Roll up: concept → { count, severityScore, lastSeen, fix, conceptFocus, topicId }
  type WeaknessAgg = {
    concept: string;
    count: number;
    severityScore: number;
    lastSeen: string;
    source: string;
    conceptFocus: string;
    drillSize: number;
    topicId: string | null;
  };
  const weaknessMap = new Map<string, WeaknessAgg>();
  const sevWeight = { high: 3, medium: 2, low: 1 } as const;
  for (const a of analyses) {
    const topicNode = Array.isArray(a.quizzes) ? a.quizzes[0] : a.quizzes;
    const topicId = topicNode?.topic_id ?? null;
    for (const w of a.analysis?.weaknesses ?? []) {
      const key = w.concept.trim().toLowerCase();
      const prev = weaknessMap.get(key);
      const sev = sevWeight[w.severity] ?? 1;
      if (prev) {
        prev.count += 1;
        prev.severityScore += sev;
        if (a.generated_at > prev.lastSeen) prev.lastSeen = a.generated_at;
      } else {
        weaknessMap.set(key, {
          concept: w.concept,
          count: 1,
          severityScore: sev,
          lastSeen: a.generated_at,
          source: w.improve?.read?.source ?? "",
          conceptFocus: w.improve?.practice?.concept_focus ?? w.concept,
          drillSize: w.improve?.practice?.drill_size ?? 5,
          topicId,
        });
      }
    }
  }
  const topWeaknesses = Array.from(weaknessMap.values())
    .sort((a, b) => b.severityScore - a.severityScore || b.count - a.count)
    .slice(0, 5);

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/home"
          className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl"
        >
          ExamGrind
        </Link>
        <Link
          href="/home"
          className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
        >
          ← Home
        </Link>
      </header>

      {/* Identity */}
      <section className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:gap-8 sm:text-left">
          <Chick state="idle" size={120} />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Profile
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
              {fullName || authUser.email?.split("@")[0]}
            </h1>
            <p className="mt-1 text-sm text-cocoa-500">{authUser.email}</p>
          </div>
        </div>
      </section>

      {/* Plan panel — tier + freemium meters + upgrade CTA */}
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <PlanPanel
          subscriptionStatus={liveSubscriptionStatus}
          quizzesStarted={profile?.quizzes_started ?? 0}
          analysesTaken={profile?.analyses_taken ?? 0}
        />
        {/* Cancel-subscription affordance — only shown for active paid */}
        {/* users. Two-tap confirmation so accidental clicks don't fire. */}
        {liveSubscriptionStatus === "paid" && (
          <div className="mt-3 flex justify-end">
            <CancelSubButton paidUntil={profile?.paid_until ?? null} />
          </div>
        )}
      </section>

      {/* Cosmetic chick wardrobe — XP-gated skins + promo redemption */}
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <ChickPicker
          userXp={profile?.xp ?? 0}
          isPremium={liveSubscriptionStatus === "paid"}
          grantedChicks={grantedChicks}
        />
        <PromoCodeRedeemer />
      </section>

      {/* Exam switcher — three pills, current one highlighted. Clicks go */}
      {/* through /start/[slug] which upserts exam_choice + bounces to /home */}
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-bold text-cocoa-900">
              Your exam
            </h2>
            <p className="text-xs text-cocoa-500">
              Switching keeps your XP and streak — only the subject grid changes.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { slug: "cuet", name: "CUET UG" },
              { slug: "ssc-cgl", name: "SSC CGL" },
              { slug: "neet-ug", name: "NEET UG" },
            ].map((e) => {
              const active = (profile?.exam_choice ?? "cuet") === e.slug;
              return (
                <Link
                  key={e.slug}
                  href={`/start/${e.slug}`}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-cocoa-900 text-cream-50 shadow-warm"
                      : "border border-cocoa-900/[0.08] bg-cream-50 text-cocoa-700 hover:bg-warm-wash"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  {active && <span aria-hidden>✓</span>}
                  {e.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Level" value={profile?.level ?? 1} accent="text-cocoa-900" />
          <Stat
            label="XP"
            value={profile?.xp ?? 0}
            accent="text-sun-600"
            mono
          />
          <Stat
            label="Streak"
            value={streak}
            suffix="🔥"
            accent="text-ember-700"
          />
          <Stat
            label="Longest streak"
            value={profile?.longest_streak ?? 0}
            accent="text-cocoa-900"
          />
          <Stat
            label="Quizzes"
            value={profile?.quizzes_taken ?? 0}
            accent="text-cocoa-900"
          />
          <Stat
            label="Topics mastered"
            value={masteredCount}
            suffix="✨"
            accent="text-ember-700"
          />
          <Stat
            label="Adept topics"
            value={adeptTopics.length}
            accent="text-cocoa-900"
          />
          <Stat
            label="In progress"
            value={Math.max(
              0,
              masteryRows.length - masteredCount - adeptTopics.length
            )}
            accent="text-cocoa-900"
          />
        </div>
      </section>

      {/* Mastered topics */}
      {masterTopics.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-xl font-bold text-cocoa-900">
            Mastered ✨
          </h2>
          <p className="mt-1 text-sm text-cocoa-500">
            Topics you&apos;ve drilled to ≥95% accuracy.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {masterTopics.map((m) => (
              <li
                key={m.topic_id}
                className="rounded-full bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-4 py-1.5 text-xs font-bold text-cocoa-900 shadow-warm"
              >
                {topicName(m)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Weakness map (cross-quiz) */}
      {topWeaknesses.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-xl font-bold text-cocoa-900">
            Your weak spots
          </h2>
          <p className="mt-1 text-sm text-cocoa-500">
            Concepts the analyses keep flagging across your quizzes. Drill them
            until they don&apos;t come back.
          </p>
          <ul className="mt-4 space-y-2">
            {topWeaknesses.map((w, i) => (
              <li
                key={i}
                className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold ${
                          w.severityScore >= 6
                            ? "text-coral-500"
                            : w.severityScore >= 3
                            ? "text-ember-600"
                            : "text-sun-600"
                        }`}
                      >
                        {"●".repeat(Math.min(3, Math.ceil(w.severityScore / 3)))}
                        {"○".repeat(3 - Math.min(3, Math.ceil(w.severityScore / 3)))}
                      </span>
                      <p className="font-serif text-base font-bold text-cocoa-900">
                        {w.concept}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-cocoa-500">
                      Flagged {w.count} time{w.count === 1 ? "" : "s"} ·
                      last seen{" "}
                      {new Date(w.lastSeen).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {w.source && (
                        <>
                          {" · "}
                          <span className="text-cocoa-700">{w.source}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent quizzes */}
      <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        <h2 className="font-serif text-xl font-bold text-cocoa-900">Recent quizzes</h2>
        {recent.length === 0 ? (
          <p className="mt-3 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 text-center text-sm text-cocoa-700 shadow-warm">
            You haven&apos;t finished a quiz yet. Start one from any subject and it&apos;ll show up here.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recent.map((q) => (
              <RecentQuiz key={q.id} quiz={q} />
            ))}
          </ul>
        )}
      </section>

      {/* Account / sign out */}
      <section className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
        <h2 className="font-serif text-xl font-bold text-cocoa-900">Account</h2>
        <div className="mt-4 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-cocoa-900">
                Signed in as {fullName || authUser.email?.split("@")[0]}
              </p>
              <p className="text-xs text-cocoa-500">{authUser.email}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-coral-500/30 bg-cream-50 px-5 py-2.5 text-sm font-bold text-coral-500 transition hover:border-coral-500/60 hover:bg-coral-500/5"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = "text-cocoa-900",
  suffix,
  mono,
}: {
  label: string;
  value: number | string;
  accent?: string;
  suffix?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-500">
        {label}
      </p>
      <p
        className={[
          "mt-1.5 font-serif text-3xl font-bold leading-none tabular-nums",
          mono ? "font-mono" : "",
          accent,
        ].join(" ")}
      >
        {value}
        {suffix && (
          <span className="ml-1.5 text-base align-middle">{suffix}</span>
        )}
      </p>
    </div>
  );
}

function RecentQuiz({ quiz }: { quiz: QuizRow }) {
  // Best-effort accuracy rendering: we don't store total separately on the
  // quiz row, so we approximate from xp_awarded (10 XP per correct answer).
  // The Results page is the source of truth — link there for detail.
  const correct = quiz.score ?? 0;
  const date = new Date(quiz.created_at);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  return (
    <li className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 px-5 py-4 shadow-warm transition hover:-translate-y-0.5 hover:border-cocoa-900/[0.12] hover:bg-white hover:shadow-warm-lg">
      <Link
        href={`/results/${quiz.id}`}
        className="flex items-center justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base font-semibold text-cocoa-900">
            {quiz.subtopic ?? quiz.subject}
          </p>
          <p className="truncate text-xs text-cocoa-500">
            {quiz.subject} · {dateLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-base font-bold text-cocoa-900 tabular-nums">
              {correct}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-cocoa-500">
              correct
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-base font-bold text-sun-600 tabular-nums">
              +{quiz.xp_awarded ?? 0}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-cocoa-500">
              XP
            </p>
          </div>
          <span className="text-cocoa-400">→</span>
        </div>
      </Link>
    </li>
  );
}
