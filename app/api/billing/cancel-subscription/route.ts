import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/cancel-subscription
 *
 * User-initiated cancel. We always call Razorpay with
 * cancel_at_cycle_end=true so the user keeps access through the time
 * they already paid for. The webhook will then mark the row cancelled
 * when the current cycle ends.
 *
 * Body: {}  (we look up the user's active subscription server-side)
 */
export async function POST() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment system not configured." },
      { status: 500 }
    );
  }

  const admin = createAdminSupabase();

  // Find the user's most recent non-terminal subscription.
  const { data: sub } = await admin
    .from("subscriptions")
    .select("razorpay_subscription_id, state")
    .eq("user_id", user.id)
    .in("state", ["created", "authenticated", "active", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) {
    return NextResponse.json(
      { error: "No active subscription to cancel." },
      { status: 404 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    // cancel_at_cycle_end = true → access continues through paid period.
    // false would cancel immediately, no refund.
    await razorpay.subscriptions.cancel(
      sub.razorpay_subscription_id,
      true /* cancel_at_cycle_end */
    );
  } catch (e) {
    console.error("[billing/cancel] Razorpay cancel failed", e);
    return NextResponse.json(
      { error: "Couldn't cancel right now. Please try again." },
      { status: 502 }
    );
  }

  // Mirror locally — Razorpay's webhook will confirm with the final
  // 'cancelled' state, but we set the user-visible flag now so /me
  // shows "Cancels on <date>" immediately.
  await admin
    .from("subscriptions")
    .update({ cancel_at_cycle_end: true })
    .eq("razorpay_subscription_id", sub.razorpay_subscription_id);

  void fireAlert(
    `Subscription CANCELLED at cycle end — user ${user.id.slice(0, 8)}`,
    {
      subscription_id: sub.razorpay_subscription_id,
      email: user.email ?? "",
    }
  );

  return NextResponse.json({ ok: true });
}
