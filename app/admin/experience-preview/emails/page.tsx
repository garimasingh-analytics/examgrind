import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { buildLifecycleEmail, type LifecycleEmailTemplate } from "@/lib/email";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const templates: Array<{ template: LifecycleEmailTemplate; label: string; reason: string }> = [
  { template: "first_topic", label: "Day 1 · Coach discovery", reason: "Only if they opted in and still have not started a quiz." },
  { template: "first_repair", label: "Day 4 · Turn the attempt into a repair", reason: "Only if they opted in, started practice, and have not opened an analysis." },
  { template: "weekly_direction", label: "Day 8 · Weekly direction", reason: "Only if they opted in; a gentle return to their study guide." },
];

export default async function EmailLifecyclePreviewPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/home");

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8 text-cocoa-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eg-kicker text-ember-700">Founder preview · not live</p>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight">Learner email sequence</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa-700">These are drafts only. Nothing is scheduled or sent until you approve the copy, the database migration is applied, and the cron secret is configured.</p>
          </div>
          <Link href="/admin" className="rounded-2xl border border-cocoa-900/10 bg-cream-50 px-4 py-2 text-sm font-bold text-cocoa-700">← Admin</Link>
        </div>

        <div className="mt-8 space-y-8">
          {templates.map(({ template, label, reason }) => {
            const email = buildLifecycleEmail("founder-preview@examgrind.in", template, "ssc-cgl");
            return (
              <section key={template} className="overflow-hidden rounded-3xl border border-cocoa-900/10 bg-cream-50 shadow-warm">
                <div className="border-b border-cocoa-900/10 bg-warm-wash px-5 py-4 sm:px-6">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-cocoa-900">Subject: {email.subject}</p>
                  <p className="mt-1 text-xs text-cocoa-600">Send rule: {reason}</p>
                </div>
                <div className="bg-[#F7EFE6] p-4 sm:p-8">
                  <div className="mx-auto max-w-[560px] overflow-hidden rounded-xl bg-white shadow-warm">
                    <div dangerouslySetInnerHTML={{ __html: email.html }} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
