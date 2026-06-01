import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";
import ApplicationActions from "./ApplicationActions";

export const metadata: Metadata = {
  title: "Admin · ExamGrind",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Application = {
  id: string;
  centre_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  student_count: string | null;
  exams_taught: string | null;
  notes: string | null;
  status: "pending" | "contacted" | "approved" | "rejected";
  created_at: string;
};

type Waitlist = {
  email: string;
  exam_slug: string;
  source: string | null;
  created_at: string;
};

const STATUS_TONE: Record<Application["status"], string> = {
  pending: "bg-sun-400/20 text-cocoa-900",
  contacted: "bg-ember-600/15 text-ember-700",
  approved: "bg-moss-500/15 text-moss-700",
  rejected: "bg-cocoa-500/15 text-cocoa-500",
};

/**
 * Internal admin dashboard at /admin.
 *
 * Gated by ADMIN_EMAILS allow-list (lib/admin-auth.ts). Non-admins are
 * redirected to /home — we don't leak that /admin exists.
 *
 * Sections:
 *  1. Stats — total users, exam-choice distribution, signups this week
 *  2. Partner applications — full list with inline status controls
 *  3. Waitlist signups — historical record (kept since we may still
 *     get them when launching new exams)
 *
 * All queries go through the service-role admin client because the
 * partner_applications / waitlist_signups tables have no public SELECT
 * policy (insert-only from the public form).
 */
export default async function AdminPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAdminEmail(user.email)) redirect("/home");

  const admin = createAdminSupabase();

  // Fire all queries in parallel — admin loads should be snappy.
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [
    applicationsRes,
    waitlistRes,
    examCountsRes,
    recentUsersRes,
    quizzesRes,
  ] = await Promise.all([
    admin
      .from("partner_applications")
      .select(
        "id, centre_name, contact_name, contact_email, contact_phone, city, student_count, exams_taught, notes, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    admin
      .from("waitlist_signups")
      .select("email, exam_slug, source, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    admin
      .from("users")
      .select("exam_choice", { count: "exact" }),
    admin
      .from("users")
      .select("email", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    admin
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
  ]);

  const applications = (applicationsRes.data ?? []) as Application[];
  const waitlist = (waitlistRes.data ?? []) as Waitlist[];

  // Aggregate exam distribution from the users-table result.
  const examCounts: Record<string, number> = {};
  for (const row of (examCountsRes.data ?? []) as Array<{
    exam_choice: string | null;
  }>) {
    const k = row.exam_choice ?? "unset";
    examCounts[k] = (examCounts[k] ?? 0) + 1;
  }
  const totalUsers = examCountsRes.count ?? 0;
  const usersThisWeek = recentUsersRes.count ?? 0;
  const quizzesThisWeek = quizzesRes.count ?? 0;

  const pendingCount = applications.filter((a) => a.status === "pending")
    .length;

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/home"
            className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl"
          >
            ExamGrind
          </Link>
          <span className="rounded-full bg-cocoa-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream-50">
            Admin
          </span>
        </div>
        <Link
          href="/home"
          className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
        >
          ← Back to app
        </Link>
      </header>

      {/* Stats */}
      <section className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-cocoa-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-cocoa-500">
          Last 7 days, plus everything ever submitted to /partners.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total users" value={totalUsers.toLocaleString("en-IN")} />
          <Stat label="New (7d)" value={usersThisWeek.toLocaleString("en-IN")} />
          <Stat label="Quizzes (7d)" value={quizzesThisWeek.toLocaleString("en-IN")} />
          <Stat
            label="Pending applications"
            value={pendingCount.toString()}
            highlight={pendingCount > 0}
          />
        </div>

        {/* Exam distribution */}
        <div className="mt-6 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">
            Users by exam
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(examCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => (
                <span
                  key={slug}
                  className="inline-flex items-center gap-2 rounded-full bg-warm-wash px-3 py-1.5 text-sm"
                >
                  <span className="font-mono text-xs uppercase text-cocoa-500">
                    {slug}
                  </span>
                  <span className="font-mono text-sm font-bold text-cocoa-900">
                    {count}
                  </span>
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold text-cocoa-900">
            Partner applications
          </h2>
          <p className="text-sm text-cocoa-500">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-10 text-center text-cocoa-500 shadow-warm">
            No applications yet. Share <Link href="/partners" className="underline">/partners</Link> with coaching centres.
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {applications.map((a) => (
              <li
                key={a.id}
                className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-serif text-lg font-bold text-cocoa-900">
                        {a.centre_name}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_TONE[a.status]}`}
                      >
                        {a.status}
                      </span>
                      <span className="text-xs text-cocoa-500">
                        {a.city} ·{" "}
                        {new Date(a.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-cocoa-700">
                      <span className="font-medium">{a.contact_name}</span>
                      {" · "}
                      <a
                        href={`mailto:${a.contact_email}`}
                        className="hover:text-cocoa-900"
                      >
                        {a.contact_email}
                      </a>
                      {" · "}
                      <a
                        href={`https://wa.me/${a.contact_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cocoa-900"
                      >
                        {a.contact_phone}
                      </a>
                    </p>

                    {(a.student_count || a.exams_taught) && (
                      <p className="mt-1 text-xs text-cocoa-500">
                        {a.student_count && <>~{a.student_count} students</>}
                        {a.student_count && a.exams_taught && " · "}
                        {a.exams_taught}
                      </p>
                    )}

                    {a.notes && (
                      <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-warm-wash p-3 text-sm text-cocoa-700">
                        {a.notes}
                      </p>
                    )}
                  </div>

                  <ApplicationActions id={a.id} status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Waitlist */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold text-cocoa-900">
            Waitlist signups
          </h2>
          <p className="text-sm text-cocoa-500">
            {waitlist.length}{" "}
            {waitlist.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {waitlist.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-10 text-center text-cocoa-500 shadow-warm">
            No waitlist signups yet.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-cocoa-900/[0.06] bg-warm-wash">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-cocoa-500 text-xs">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-cocoa-500 text-xs">
                    Exam
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-cocoa-500 text-xs">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-cocoa-500 text-xs">
                    When
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-900/[0.04]">
                {waitlist.map((w, i) => (
                  <tr key={`${w.email}-${w.exam_slug}-${i}`}>
                    <td className="px-4 py-3 font-mono text-cocoa-900">
                      <a href={`mailto:${w.email}`} className="hover:underline">
                        {w.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-cocoa-700">
                      <span className="font-mono text-xs uppercase">
                        {w.exam_slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cocoa-500">
                      {w.source ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-cocoa-500">
                      {new Date(w.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-warm ${
        highlight
          ? "border-ember-600/30 bg-ember-600/10"
          : "border-cocoa-900/[0.06] bg-cream-50"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-500">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl font-bold text-cocoa-900">
        {value}
      </p>
    </div>
  );
}
