import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/create-subscription
 *
 * Creates a Razorpay Subscription (UPI Autopay / Card eMandate) for the
 * caller. Replaces /api/billing/create-order — that one is for one-tap
 * monthly; this one is for real auto-renew.
 *
 * Flow:
 *   1. Auth check.
 *   2. Reuse the user's existing subscription if it's already 'active'
 *      or 'authenticated' — avoids accidentally double-subscribing.
 *   3. Create a Razorpay Subscription against RAZORPAY_PLAN_ID.
 *   4. Mirror to public.subscriptions with state='created'.
 *   5. Return the subscription_id + key so the client can open Razorpay
 *      Checkout in "subscription" mode and walk the user through the
 *      UPI mandate.
 *
 * On the next page load (post-checkout) the webhook will have flipped
 * state to 'active' and we'll show the renewal date on /me.
 */

// 12 months × ₹75 = one full year of student practice before we even
// have to think about "completed". We renew this rolling window via
// the webhook anyway, so the user experience is effectively unlimited.
const TOTAL_BILLING_CYCLES = 12;

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
  const planId = process.env.RAZORPAY_PLAN_ID;
  if (!keyId || !keySecret || !planId) {
    console.error(
      "[billing/create-subscription] missing env: keyId/secret/planId"
    );
    return NextResponse.json(
      {
        error:
          "Subscriptions aren't configured yet. Please try the one-tap upgrade or contact support.",
      },
      { status: 500 }
    );
  }

  const admin = createAdminSupabase();

  // Don't let a user accidentally double-subscribe.
  const { data: existing } = await admin
    .from("subscriptions")
    .select("razorpay_subscription_id, state")
    .eq("user_id", user.id)
    .in("state", ["created", "authenticated", "active", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.state === "active" || existing?.state === "authenticated") {
    return NextResponse.json({
      subscriptionId: existing.razorpay_subscription_id,
      alreadyActive: true,
      key: keyId,
    });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  let subscription;
  try {
    subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      // Razorpay expects total_count = how many cycles to bill. We pick
      // 12 (a full year) and the webhook will fire a 'completed' event
      // we can use to nudge the user to re-subscribe.
      total_count: TOTAL_BILLING_CYCLES,
      // customer_notify=1 tells Razorpay to send the mandate-signing
      // SMS / email on our behalf. Good free tier UX.
      customer_notify: 1,
      notes: {
        user_id: user.id,
        email: user.email ?? "",
        product: "ExamGrind monthly",
      },
    });
  } catch (e) {
    console.error("[billing/create-subscription] Razorpay create failed", e);
    return NextResponse.json(
      { error: "Couldn't start subscription. Please try again." },
      { status: 502 }
    );
  }

  // Mirror to our DB so admin/me can read it without a Razorpay roundtrip.
  await admin.from("subscriptions").insert({
    user_id: user.id,
    razorpay_subscription_id: subscription.id,
    razorpay_plan_id: planId,
    state: "created",
  });

  await admin
    .from("users")
    .update({
      razorpay_subscription_id: subscription.id,
      subscription_state: "created",
    })
    .eq("id", user.id);

  return NextResponse.json({
    subscriptionId: subscription.id,
    key: keyId,
    name: "ExamGrind",
    description: "ExamGrind monthly — auto-renews ₹75 via UPI / card",
    prefill: { email: user.email ?? "" },
  });
}
