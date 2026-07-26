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
 * Creates a Razorpay-hosted payment link for a one-time ExamGrind product.
 * This intentionally avoids depending on checkout.js: privacy extensions and
 * restrictive in-app browsers commonly block that third-party script.
 *
 * Flow:
 *   1. Verify the caller is signed in.
 *   2. Create a hosted payment link on Razorpay's side (server-only).
 *   3. Mirror the link to public.payments with status='created' so we
 *      can audit every attempt — even ones that never get paid.
 *   4. Return { orderId, amount, currency, key } to the client.
 *
 * Razorpay posts payment_link.paid to our signed webhook after payment.
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

  let paymentLink;
  try {
    paymentLink = await razorpay.paymentLink.create({
      amount: catalogProduct.pricePaise,
      currency: "INR",
      accept_partial: false,
      reference_id: `eg_${user.id.slice(0, 8)}_${Date.now()}`,
      description: catalogProduct.description,
      customer: {
        name: user.user_metadata.full_name ?? "ExamGrind student",
        email: user.email ?? "",
      },
      notify: { email: false, sms: false },
      callback_url: "https://www.examgrind.in/me?payment=processing",
      callback_method: "get",
      notes: {
        user_id: user.id,
        email: user.email ?? "",
        product,
      },
    });
  } catch (e) {
    console.error("[billing/create-order] Razorpay payment-link creation failed", e);
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
    razorpay_order_id: paymentLink.id,
    amount_paise: catalogProduct.pricePaise,
    currency: "INR",
    status: "created",
    product,
  });
  if (insertErr) {
    // Do not return a link that we cannot bind to a product in our own
    // database. A payment without this row must never be
    // able to infer an entitlement.
    console.error("[billing/create-order] mirror insert failed", insertErr);
    return NextResponse.json(
      { error: "Payment is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    paymentUrl: paymentLink.short_url,
  });
}
