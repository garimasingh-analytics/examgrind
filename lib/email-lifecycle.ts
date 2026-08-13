import "server-only";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { sendLifecycleEmail, type LifecycleEmailTemplate } from "@/lib/email";

const LIFECYCLE_STEPS: Array<{ template: LifecycleEmailTemplate; delayDays: number }> = [
  { template: "first_topic", delayDays: 1 },
  { template: "first_repair", delayDays: 4 },
  { template: "weekly_direction", delayDays: 8 },
];

type LearnerProfile = {
  email: string;
  exam_choice: string | null;
  quizzes_started: number | null;
  analyses_started: number | null;
};

function scheduleAt(delayDays: number) {
  return new Date(Date.now() + delayDays * 86_400_000).toISOString();
}

/**
 * A learner opts in from their profile. Re-enabling starts a fresh journey,
 * but already-sent messages are never duplicated.
 */
export async function syncMarketingLifecycle(input: {
  userId: string;
  email: string;
  examSlug: string | null;
  enabled: boolean;
}) {
  const admin = createAdminSupabase();

  if (!input.enabled) {
    await admin
      .from("email_lifecycle_messages")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", input.userId)
      .eq("status", "pending");
    return;
  }

  const { data: existing } = await admin
    .from("email_lifecycle_messages")
    .select("template, status")
    .eq("user_id", input.userId);
  const sentTemplates = new Set(
    (existing ?? [])
      .filter((row) => row.status === "sent")
      .map((row) => row.template),
  );

  const rows = LIFECYCLE_STEPS
    .filter((step) => !sentTemplates.has(step.template))
    .map((step) => ({
      user_id: input.userId,
      email: input.email,
      exam_slug: input.examSlug,
      template: step.template,
      scheduled_for: scheduleAt(step.delayDays),
      status: "pending",
      attempts: 0,
      sent_at: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length) {
    const { error } = await admin
      .from("email_lifecycle_messages")
      .upsert(rows, { onConflict: "user_id,template" });
    if (error) throw error;
  }
}

function shouldSend(template: LifecycleEmailTemplate, profile: LearnerProfile) {
  switch (template) {
    case "first_topic":
      return (profile.quizzes_started ?? 0) === 0;
    case "first_repair":
      return (profile.quizzes_started ?? 0) > 0 && (profile.analyses_started ?? 0) === 0;
    case "weekly_direction":
      return true;
  }
}

/** Process a small, idempotent daily batch. Called only by Vercel Cron. */
export async function deliverDueLifecycleEmails(limit = 40) {
  const admin = createAdminSupabase();
  const now = new Date().toISOString();
  const { data: due, error } = await admin
    .from("email_lifecycle_messages")
    .select("id, user_id, email, exam_slug, template, attempts")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(limit);
  if (error) throw error;

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const message of due ?? []) {
    // Claim before sending so a second cron invocation cannot send a duplicate.
    const { data: claimed } = await admin
      .from("email_lifecycle_messages")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", message.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (!claimed) continue;

    const [{ data: preference }, { data: profile }] = await Promise.all([
      admin
        .from("email_preferences")
        .select("marketing_email_opt_in")
        .eq("user_id", message.user_id)
        .maybeSingle<{ marketing_email_opt_in: boolean }>(),
      admin
        .from("users")
        .select("email, exam_choice, quizzes_started, analyses_started")
        .eq("id", message.user_id)
        .maybeSingle<LearnerProfile>(),
    ]);

    const template = message.template as LifecycleEmailTemplate;
    if (!preference?.marketing_email_opt_in || !profile || !shouldSend(template, profile)) {
      await admin
        .from("email_lifecycle_messages")
        .update({ status: "skipped", updated_at: new Date().toISOString() })
        .eq("id", message.id);
      skipped += 1;
      continue;
    }

    const ok = await sendLifecycleEmail(profile.email || message.email, template, profile.exam_choice ?? message.exam_slug ?? undefined);
    if (ok) {
      await admin
        .from("email_lifecycle_messages")
        .update({
          status: "sent",
          attempts: message.attempts + 1,
          sent_at: new Date().toISOString(),
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", message.id);
      sent += 1;
      continue;
    }

    const nextAttempts = message.attempts + 1;
    const retry = nextAttempts < 3;
    await admin
      .from("email_lifecycle_messages")
      .update({
        status: retry ? "pending" : "failed",
        attempts: nextAttempts,
        scheduled_for: retry ? new Date(Date.now() + 6 * 60 * 60_000).toISOString() : now,
        last_error: "SMTP provider returned no delivery confirmation",
        updated_at: new Date().toISOString(),
      })
      .eq("id", message.id);
    failed += 1;
  }

  return { scanned: due?.length ?? 0, sent, skipped, failed };
}
