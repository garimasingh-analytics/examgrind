import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/create-order
 *
 * Creates a Razorpay order for one month of ExamGrind paid tier (₹199).
 * Returns the order ID + amount so the client can open Razorpay Checkout.
 *
 * Flow:
 *   1. Verify the caller is signed in.
 *   2. Create an order on Razorpay's side (server-only, uses key secret).
 *   3. Mirror the order to public.payments with status='created' so we
 *      can audit every attempt — even ones that never get paid.
 *   4. Return { orderId, amount, currency, key } to the client.
 *
 * The client then opens Razorpay Checkout with these values. On success
 * the SDK calls back with razorpay_payment_id + razorpay_signature
 * which the client posts to /api/billing/verify-payment for HMAC check.
 */

const PRICE_PAISE = 19900; // ₹199 = 19900 paise

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
    console.error("[billing/create-order] missing Razorpay env vars");
    return NextResponse.json(
      { error: "Payment is temporarily unavailable. Please try later." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  let order;
  try {
    order = await razorpay.orders.create({
      amount: PRICE_PAISE,
      currency: "INR",
      // Receipt is shown in the Razorpay dashboard — make it traceable
      // back to our user without leaking PII.
      receipt: `eg_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email ?? "",
        product: "ExamGrind monthly",
      },
    });
  } catch (e) {
    console.error("[billing/create-order] Razorpay order failed", e);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }

  // Mirror to our DB so we have an audit trail before the user pays.
  // Admin client because the payments table has no public policies.
  const admin = createAdminSupabase();
  const { error: insertErr } = await admin.from("payments").insert({
    user_id: user.id,
    razorpay_order_id: order.id,
    amount_paise: PRICE_PAISE,
    currency: "INR",
    status: "created",
  });
  if (insertErr) {
    // Non-fatal — the Razorpay order is created, and we'll capture the
    // payment via the verify endpoint regardless. But log it.
    console.error("[billing/create-order] mirror insert failed", insertErr);
  }

  return NextResponse.json({
    orderId: order.id,
    amount: PRICE_PAISE,
    currency: "INR",
    key: keyId,
    name: "ExamGrind",
    description: "ExamGrind monthly — unlimited quizzes + Deep Analysis",
    prefill: {
      email: user.email ?? "",
      // Razorpay also accepts name + contact; we don't store name yet.
    },
  });
}
