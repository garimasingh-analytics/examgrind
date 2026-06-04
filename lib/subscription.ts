import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Lazily downgrade a user's subscription_status when paid_until has
 * passed.
 *
 * Called from server pages that read subscription_status (/home, /me).
 * If paid_until < now and the user is still marked 'paid', we flip them
 * to 'free'. Cheap (single conditional update) and the user sees the
 * correct state on the next request after expiry.
 *
 * A pg_cron job (migration_016) does the same thing nightly as a
 * backstop for users who haven't logged in — keeps reports honest
 * and avoids the awkward "Why am I still 'paid' on the admin view?"
 *
 * Returns the corrected status so the caller doesn't have to re-read.
 */
export async function ensureSubscriptionFreshness(
  userId: string,
  currentStatus: "free" | "trial" | "paid",
  paidUntil: string | null
): Promise<"free" | "trial" | "paid"> {
  if (currentStatus !== "paid") return currentStatus;
  if (!paidUntil) return currentStatus;

  const expired = new Date(paidUntil).getTime() < Date.now();
  if (!expired) return currentStatus;

  // Service role: we just verified expiry server-side, and RLS would
  // block the user from downgrading themselves via the cookie client.
  const admin = createAdminSupabase();
  const { error } = await admin
    .from("users")
    .update({ subscription_status: "free" })
    .eq("id", userId)
    .eq("subscription_status", "paid"); // double-check to avoid races

  if (error) {
    // Don't crash the page — just log and let the next request retry.
    console.error("[subscription] lazy downgrade failed", error);
    return currentStatus;
  }
  return "free";
}
