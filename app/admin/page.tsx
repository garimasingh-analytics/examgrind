import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin · ExamGrind",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Internal admin dashboard at /admin.
 *
 * Gated by ADMIN_EMAILS allow-list (lib/admin-auth.ts). Non-admins are
 * redirected to /home — we don't leak that /admin exists.
 *
 * Sections (2026-06 rewrite):
 *  1. Enrollment + Activity — total users, new last 7d, active 7d,
 *     quizzes/mocks last 7d, exam distribution.
 *  2. Subscription funnel — free/trial/paid breakdown, active
 *     subscriptions, lapsed last 30d, conversion rate.
 *  3. Quiz / mock activity — top topics, bottom topics, avg per user.
 *  4. Revenue + Anthropic spend — MRR, total revenue, ARPU,
 *     estimated Claude cost based on persisted analyses.
 *  5. Feedback inbox — recent submissions from the floating widget.
 *  6. Waitlist signups — historical record (new exam launches).
 */

type Waitlist = {
  email: string;
  exam_slug: string;
  source: string | null;
  created_at: string;
};

type Feedback = {
  id: string;
  email: string | null;
  message: string;
  source_path: string | null;
  status: "open" | "triaged" | "closed";
  created_at: string;
};

// Anthropic price estimates per call type (₹). Used purely for cost
// estimation — these are rough but enough to spot runaway spend. The
// numbers come from observing actual prompts: input chars ÷ 4 ≈ tokens,
// output ÷ 4 ≈ tokens, Haiku 4.5 at ~$1/M in + ~$5/M out, 1 USD ≈ ₹83.
const COST_PER_QUIZ_GEN_INR     = 1.9;
const COST_PER_QUIZ_ANALYZE_INR = 1.7;
const COST_PER_MOCK_GEN_INR     = 7.0;
const COST_PER_MOCK_ANALYZE_INR = 3.1;

const MONTHLY_PRICE_INR = 199;

export default async function AdminPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAdminEmail(user.email)) redirect("/home");

  const admin = createAdminSupabase();
  const now = Date.now();
  const sevenDaysAgo  = new Date(now - 7  * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date(now).toISOString();

  // ----- All queries in parallel ----------------------------------------
  const [
    usersAllRes,
    usersRecentCountRes,
    quizzesAllRes,
    quizzesRecentRes,
    mockAttemptsRes,
    quizAnalysesCountRes,
    mockAnalysesCountRes,
    paymentsRes,
    feedbackRes,
    waitlistRes,
  ] = await Promise.all([
    // Users — pull exam_choice + subscription_status + paid_until so we
    // can compute multiple slices client-side without re-querying.
    admin
      .from("users")
      .select("id, exam_choice, subscription_status, paid_until, created_at"),
    // Count of users created in last 7d (head request — no rows).
    admin
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    // All quizzes (just topic_id + user_id + created_at) — used for
    // popular-topics aggregation + active-users + total counts.
    admin
      .from("quizzes")
      .select("user_id, topic_id, created_at"),
    // Quizzes in last 7d (head count).
    admin
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    // Mock attempts in last 7d (head count).
    admin
      .from("mock_attempts")
      .select("id", { count: "exact", head: true })
      .gte("started_at", sevenDaysAgo),
    // Counts of analyses (drives Anthropic cost estimate).
    admin
      .from("quiz_analyses")
      .select("id", { count: "exact", head: true }),
    admin
      .from("mock_analyses")
      .select("id", { count: "exact", head: true }),
    // Payments — for MRR/ARPU/total revenue we sum amount_paise.
    admin
      .from("payments")
      .select("amount_paise, status, created_at")
      .eq("status", "paid"),
    // Recent feedback (50 latest).
    admin
      .from("feedbacks")
      .select("id, email, message, source_path, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    // Waitlist (50 latest).
    admin
      .from("waitlist_signups")
      .select("email, exam_slug, source, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  type UserRow = {
    id: string;
    exam_choice: string | null;
    subscription_status: "free" | "trial" | "paid";
    paid_until: string | null;
    created_at: string;
  };
  type QuizRow = {
    user_id: string;
    topic_id: string | null;
    created_at: string;
  };
  type PaymentRow = { amount_paise: number; status: string; created_at: string };

  const allUsers  = (usersAllRes.data ?? []) as UserRow[];
  const allQuizzes = (quizzesAllRes.data ?? []) as QuizRow[];
  const payments  = (paymentsRes.data ?? []) as PaymentRow[];
  const feedbacks = (feedbackRes.data ?? []) as Feedback[];
  const waitlist  = (waitlistRes.data ?? []) as Waitlist[];

  // ============ 1. Enrollment + Activity ===============================
  const totalUsers      = allUsers.length;
  const usersThisWeek   = usersRecentCountRes.count ?? 0;
  const quizzesThisWeek = quizzesRecentRes.count ?? 0;
  const mocksThisWeek   = mockAttemptsRes.count ?? 0;
  const activeUserIds = new Set<string>();
  for (const q of allQuizzes) {
    if (new Date(q.created_at).getTime() > now - 7 * 24 * 60 * 60 * 1000) {
      activeUserIds.add(q.user_id);
    }
  }
  const activeUsersWeek = activeUserIds.size;
  const examDistribution: Record<string, number> = {};
  for (const u of allUsers) {
    const k = u.exam_choice ?? "unset";
    examDistribution[k] = (examDistribution[k] ?? 0) + 1;
  }

  // ============ 2. Subscription funnel =================================
  let countFree = 0, countTrial = 0, countPaid = 0;
  let activeSubs = 0, lapsedLast30d = 0;
  for (const u of allUsers) {
    if (u.subscription_status === "paid") {
      countPaid += 1;
      const exp = u.paid_until ? new Date(u.paid_until).getTime() : 0;
      if (exp >= now) activeSubs += 1;
      else if (exp >= now - 30 * 24 * 60 * 60 * 1000) lapsedLast30d += 1;
    } else if (u.subscription_status === "trial") {
      countTrial += 1;
    } else {
      countFree += 1;
    }
  }
  const conversionPct = totalUsers > 0
    ? Math.round((countPaid / totalUsers) * 1000) / 10
    : 0;

  // ============ 3. Quiz / mock activity ================================
  const topicCounts: Record<string, number> = {};
  for (const q of allQuizzes) {
    if (!q.topic_id) continue;
    topicCounts[q.topic_id] = (topicCounts[q.topic_id] ?? 0) + 1;
  }
  const topicEntries = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const topTopicIds   = topicEntries.slice(0, 10).map(([id]) => id);
  const bottomTopicIds = topicEntries.length > 10
    ? topicEntries.slice(-5).map(([id]) => id)
    : [];
  // Resolve topic names for top/bottom — single query, only for the
  // ids we'll display, to keep this snappy.
  const topicIdsToResolve = Array.from(new Set([...topTopicIds, ...bottomTopicIds]));
  const { data: topicMeta } = topicIdsToResolve.length
    ? await admin
        .from("topics")
        .select(
          "id, name, chapter:chapters(name, subject:subjects(name))"
        )
        .in("id", topicIdsToResolve)
    : { data: [] as unknown };
  type TopicMeta = {
    id: string;
    name: string;
    chapter: { name: string; subject: { name: string } | null } | null;
  };
  const topicLookup = new Map<string, TopicMeta>();
  for (const t of (topicMeta ?? []) as TopicMeta[]) topicLookup.set(t.id, t);

  const avgQuizzesPerUser = totalUsers > 0
    ? Math.round((allQuizzes.length / totalUsers) * 10) / 10
    : 0;

  // ============ 4. Revenue + Anthropic spend ===========================
  const totalRevenueInr = payments.reduce((s, p) => s + p.amount_paise / 100, 0);
  const mrrInr = activeSubs * MONTHLY_PRICE_INR;
  const arpuInr = countPaid > 0
    ? Math.round(totalRevenueInr / countPaid)
    : 0;
  // Anthropic spend estimate — count × per-call cost.
  const quizGenCount      = allQuizzes.length;
  const quizAnalyzeCount  = quizAnalysesCountRes.count ?? 0;
  // For mock gen count we'd want a "mock generations" table; we don't
  // store it separately, so we approximate: each mock attempt = 1 gen
  // (questions are pre-generated when the attempt starts).
  const mockGenCount      = mocksThisWeek; // approximate, last 7d only — that's the recent burn
  const mockAnalyzeCount  = mockAnalysesCountRes.count ?? 0;
  const estimatedSpendInr =
    quizGenCount     * COST_PER_QUIZ_GEN_INR +
    quizAnalyzeCount * COST_PER_QUIZ_ANALYZE_INR +
    mockGenCount     * COST_PER_MOCK_GEN_INR +
    mockAnalyzeCount * COST_PER_MOCK_ANALYZE_INR;

  const openFeedbackCount = feedbacks.filter((f) => f.status === "open").length;

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          <span className="rounded-full bg-cocoa-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream-50">
            Admin
          </span>
          <span className="text-xs text-cocoa-500">
            as {user.email}
          </span>
        </div>
        <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">
          ← Back to app
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-cocoa-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-cocoa-500">
          Snapshot as of {new Date(nowIso).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}.
        </p>
      </div>

      {/* ============ 1. Enrollment + Activity ============ */}
      <Section title="Enrollment & activity">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total users"  value={totalUsers.toLocaleString("en-IN")} />
          <Stat label="New (7d)"     value={usersThisWeek.toLocaleString("en-IN")} good={usersThisWeek > 0} />
          <Stat label="Active (7d)"  value={activeUsersWeek.toLocaleString("en-IN")} />
          <Stat label="Quizzes (7d)" value={quizzesThisWeek.toLocaleString("en-IN")} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Mocks (7d)" value={mocksThisWeek.toLocaleString("en-IN")} />
        </div>
        <Card title="Users by exam">
          <div className="flex flex-wrap gap-2">
            {Object.entries(examDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([slug, n]) => (
                <Chip key={slug} label={slug.toUpperCase()} value={n} />
              ))}
          </div>
        </Card>
      </Section>

      {/* ============ 2. Subscription funnel ============ */}
      <Section title="Subscription funnel">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Free"       value={countFree.toLocaleString("en-IN")} />
          <Stat label="Trial"      value={countTrial.toLocaleString("en-IN")} />
          <Stat label="Paid"       value={countPaid.toLocaleString("en-IN")} good={countPaid > 0} />
          <Stat label="Conversion" value={`${conversionPct}%`} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Active subs"      value={activeSubs.toLocaleString("en-IN")} good={activeSubs > 0} />
          <Stat label="Lapsed (30d)"     value={lapsedLast30d.toLocaleString("en-IN")} bad={lapsedLast30d > 0} />
        </div>
        {countPaid === 0 && (
          <p className="mt-4 rounded-2xl bg-sun-400/15 px-4 py-3 text-xs text-cocoa-700">
            No paid users yet. Once the first subscription comes through Razorpay, MRR and ARPU will populate.
          </p>
        )}
      </Section>

      {/* ============ 3. Quiz / mock activity ============ */}
      <Section title="Quiz & mock activity">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Total quizzes"      value={allQuizzes.length.toLocaleString("en-IN")} />
          <Stat label="Avg per user"       value={avgQuizzesPerUser.toString()} />
          <Stat label="Topics played"      value={Object.keys(topicCounts).length.toLocaleString("en-IN")} />
        </div>

        <Card title="Top 10 most-attempted topics">
          {topTopicIds.length === 0 ? (
            <p className="text-sm text-cocoa-500">No quiz data yet.</p>
          ) : (
            <ol className="space-y-2">
              {topTopicIds.map((id, i) => {
                const meta = topicLookup.get(id);
                const count = topicCounts[id];
                return (
                  <li key={id} className="flex items-center justify-between gap-3 rounded-xl bg-warm-wash px-3 py-2">
                    <span className="flex min-w-0 items-baseline gap-2 text-sm">
                      <span className="font-mono text-xs font-bold text-cocoa-500">{i + 1}.</span>
                      <span className="truncate">
                        <span className="font-semibold text-cocoa-900">{meta?.name ?? id}</span>
                        {meta?.chapter && (
                          <span className="ml-2 text-xs text-cocoa-500">
                            {meta.chapter.subject?.name} · {meta.chapter.name}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums text-ember-700">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        {bottomTopicIds.length > 0 && (
          <Card title="Bottom 5 — least-attempted with at least one play">
            <ol className="space-y-2">
              {bottomTopicIds.map((id) => {
                const meta = topicLookup.get(id);
                const count = topicCounts[id];
                return (
                  <li key={id} className="flex items-center justify-between gap-3 rounded-xl bg-warm-wash px-3 py-2">
                    <span className="truncate text-sm">
                      <span className="font-semibold text-cocoa-900">{meta?.name ?? id}</span>
                      {meta?.chapter && (
                        <span className="ml-2 text-xs text-cocoa-500">
                          {meta.chapter.subject?.name} · {meta.chapter.name}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums text-cocoa-500">{count}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        )}
      </Section>

      {/* ============ 4. Revenue + Anthropic spend ============ */}
      <Section title="Revenue & Anthropic spend">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="MRR"           value={fmtINR(mrrInr)} good={mrrInr > 0} />
          <Stat label="Total revenue" value={fmtINR(totalRevenueInr)} />
          <Stat label="ARPU"          value={countPaid > 0 ? fmtINR(arpuInr) : "—"} />
          <Stat label="Est. AI spend" value={fmtINR(Math.round(estimatedSpendInr))} bad={estimatedSpendInr > mrrInr && mrrInr > 0} />
        </div>
        <p className="mt-3 text-[11px] text-cocoa-500">
          AI spend is estimated from persisted analyses + total quizzes (Haiku 4.5 at ~$1/M input + ~$5/M output, 1 USD ≈ ₹83). For exact spend check the Anthropic Console.
        </p>
        {estimatedSpendInr > mrrInr && mrrInr > 0 && (
          <p className="mt-3 rounded-2xl bg-ember-600/10 px-4 py-3 text-xs font-medium text-ember-700">
            Heads-up: estimated AI spend exceeds MRR. Watch unit economics.
          </p>
        )}
      </Section>

      {/* ============ 5. Feedback inbox ============ */}
      <Section
        title="Feedback inbox"
        subtitle={`${openFeedbackCount} open · ${feedbacks.length} total`}
      >
        {feedbacks.length === 0 ? (
          <Card title="">
            <p className="text-sm text-cocoa-500">
              No feedback yet. The widget is live on every page.
            </p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {feedbacks.map((f) => (
              <li
                key={f.id}
                className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    {f.email ? (
                      <a
                        href={`mailto:${f.email}?subject=Re: your ExamGrind feedback`}
                        className="font-mono text-sm font-bold text-cocoa-900 hover:underline"
                      >
                        {f.email}
                      </a>
                    ) : (
                      <span className="font-mono text-sm font-bold text-cocoa-500">anonymous</span>
                    )}
                    <FeedbackStatusPill status={f.status} />
                    {f.source_path && (
                      <span className="font-mono text-[10px] text-cocoa-500">
                        from {f.source_path}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-cocoa-500">
                    {new Date(f.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-warm-wash p-3 text-sm text-cocoa-900">
                  {f.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ============ 6. Waitlist ============ */}
      <Section
        title="Waitlist"
        subtitle={`${waitlist.length} ${waitlist.length === 1 ? "entry" : "entries"}`}
      >
        {waitlist.length === 0 ? (
          <Card title="">
            <p className="text-sm text-cocoa-500">No waitlist signups yet.</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-cocoa-900/[0.06] bg-warm-wash">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cocoa-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cocoa-500">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cocoa-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cocoa-500">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-900/[0.04]">
                {waitlist.map((w, i) => (
                  <tr key={`${w.email}-${w.exam_slug}-${i}`}>
                    <td className="px-4 py-3 font-mono text-cocoa-900">
                      <a href={`mailto:${w.email}`} className="hover:underline">{w.email}</a>
                    </td>
                    <td className="px-4 py-3 text-cocoa-700">
                      <span className="font-mono text-xs uppercase">{w.exam_slug}</span>
                    </td>
                    <td className="px-4 py-3 text-cocoa-500">{w.source ?? "—"}</td>
                    <td className="px-4 py-3 text-cocoa-500">
                      {new Date(w.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </main>
  );
}

/* -------------------- helpers -------------------- */

function fmtINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-cocoa-900">{title}</h2>
        {subtitle && <p className="text-sm text-cocoa-500">{subtitle}</p>}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
      {title && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
          {title}
        </p>
      )}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}

function Stat({
  label, value, good, bad,
}: {
  label: string;
  value: string;
  good?: boolean;
  bad?: boolean;
}) {
  const tone =
    good ? "border-moss-500/30 bg-moss-500/10" :
    bad  ? "border-ember-600/30 bg-ember-600/10" :
           "border-cocoa-900/[0.06] bg-cream-50";
  return (
    <div className={`rounded-2xl border ${tone} p-4 shadow-warm`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900">{value}</p>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-warm-wash px-3 py-1.5 text-sm">
      <span className="font-mono text-xs uppercase text-cocoa-500">{label}</span>
      <span className="font-mono text-sm font-bold text-cocoa-900">{value}</span>
    </span>
  );
}

function FeedbackStatusPill({ status }: { status: Feedback["status"] }) {
  const tone =
    status === "open"     ? "bg-sun-400/20 text-cocoa-900" :
    status === "triaged"  ? "bg-ember-600/15 text-ember-700" :
                            "bg-moss-500/15 text-moss-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>
      {status}
    </span>
  );
}
