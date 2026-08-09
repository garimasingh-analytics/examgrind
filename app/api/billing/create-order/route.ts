import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  isOneTimeProduct,
  ONE_TIME_PRODUCTS,
  type OneTimeProduct,
} from "@/lib/billing-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/create-order
 *
 * Creates a Razorpay Order for a one-time ExamGrind product.
 *
 * Flow:
 *   1. Verify the caller is signed in.
 *   2. Create an order on Razorpay's side (server-only).
 *   3. Mirror the order to public.payments with status='created' so we
 *      can audit every attempt — even ones that never get paid.
 *   4. Return { orderId, amount, currency, key } to the client.
 *
 * The client opens Razorpay Checkout with this order. Both the client-side
 * HMAC verification and payment.captured webhook reconcile the entitlement.
 */

type Body = { product?: OneTimeProduct };

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const requestedProduct: unknown = body.product;
  if (!isOneTimeProduct(requestedProduct)) {
    return NextResponse.json({ error: "Choose a valid one-time product." }, { status: 400 });
  }
  const product: OneTimeProduct = requestedProduct;
  const catalogProduct = ONE_TIME_PRODUCTS[product];

  // Annual access is deliberately a one-time charge rather than a recurring
  // yearly mandate. Do not let a currently-paid student buy overlapping
  // access by accident; their existing plan already unlocks everything.
  if (product === "coach_yearly") {
    const admin = createAdminSupabase();
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("subscription_status, paid_until")
      .eq("id", user.id)
      .maybeSingle<{ subscription_status: string; paid_until: string | null }>();
    if (profileError) {
      console.error("[billing/create-order] annual access check failed", profileError);
      return NextResponse.json({ error: "Payment is temporarily unavailable. Please try again shortly." }, { status: 503 });
    }
    const isAlreadyActive = profile?.subscription_status === "paid" &&
      Boolean(profile.paid_until && new Date(profile.paid_until).getTime() > Date.now());
    if (isAlreadyActive) {
      return NextResponse.json({ error: "Your full ExamGrind access is already active." }, { status: 409 });
    }
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
      amount: catalogProduct.pricePaise,
      currency: "INR",
      receipt: `eg_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email ?? "",
        product,
      },
    });
  } catch (e) {
    console.error("[billing/create-order] Razorpay order creation failed", e);
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
    amount_paise: catalogProduct.pricePaise,
    currency: "INR",
    status: "created",
    product,
  });
  if (insertErr) {
    // Do not return an order that we cannot bind to a product in our own
    // database. A payment without this row must never be
    // able to infer an entitlement.
    console.error("[billing/create-order] mirror insert failed", insertErr);
    return NextResponse.json(
      { error: "Payment is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    amount: catalogProduct.pricePaise,
    currency: "INR",
    key: keyId,
    name: "ExamGrind",
    description: catalogProduct.description,
    prefill: { email: user.email ?? "" },
  });
}
