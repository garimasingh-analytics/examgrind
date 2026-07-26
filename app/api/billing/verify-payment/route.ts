import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";
import { sendAdminSMS } from "@/lib/sms";
import { isOneTimeProduct, ONE_TIME_PRODUCTS, type OneTimeProduct } from "@/lib/billing-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/verify-payment
 *
 * Razorpay Checkout calls this with the payment proof after a successful
 * card/UPI/wallet charge. We:
 *
 *   1. Verify the caller's cookie session — sanity check; the HMAC alone
 *      would be enough, but defence in depth.
 *   2. Validate the body has the three required Razorpay fields.
 *   3. Recompute the HMAC: SHA256(order_id|payment_id, key_secret). If
 *      it doesn't match the signature Razorpay sent, this is either a
 *      replay attack or a man-in-the-middle — refuse.
 *   4. Look up the server-created order. Its product and amount are never
 *      accepted from the browser.
 *   5. Mark the payment paid and grant only that product's entitlement.
 *   6. Fire a real-time alert so the founder sees revenue immediately.
 *   7. Invalidate /me and /home so the upgrade reflects instantly.
 */

type Body = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment proof." }, { status: 400 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("[billing/verify] missing RAZORPAY_KEY_SECRET");
    return NextResponse.json(
      { error: "Payment system misconfigured." },
      { status: 500 }
    );
  }

  // Reconstruct the signature Razorpay would have generated.
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Timing-safe compare. Plain === can leak timing info to a determined
  // attacker; this prevents that micro-attack surface.
  const valid =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

  if (!valid) {
    // Could be: stale checkout, malicious client, or a misconfigured
    // key_secret mismatch. Alert because legitimate users shouldn't ever
    // hit this branch — if they do we want to know.
    void fireAlert("Razorpay signature mismatch", {
      user_id: user.id,
      email: user.email ?? "",
      razorpay_order_id,
      severity: "P1",
    });
    return NextResponse.json(
      { error: "Payment proof failed verification. Please contact support." },
      { status: 400 }
    );
  }

  const admin = createAdminSupabase();

  // An HMAC proves Razorpay signed the payment, but not which ExamGrind
  // product it should unlock. Bind it to our original order before granting
  // anything. This is the critical guard against a ₹19 order becoming ₹199
  // membership access.
  const { data: order, error: orderError } = await admin
    .from("payments")
    .select("user_id, amount_paise, product, status")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle<{
      user_id: string;
      amount_paise: number;
      product: string;
      status: string;
    }>();
  if (orderError || !order || order.user_id !== user.id || !isOneTimeProduct(order.product)) {
    void fireAlert("Verified Razorpay payment without a matching one-time order", {
      user_id: user.id,
      razorpay_order_id,
      severity: "P1",
    });
    return NextResponse.json({ error: "This checkout could not be matched to your account." }, { status: 409 });
  }
  const product: OneTimeProduct = order.product;
  const catalogProduct = ONE_TIME_PRODUCTS[product];
  if (order.amount_paise !== catalogProduct.pricePaise) {
    void fireAlert("Razorpay order amount does not match catalog", {
      user_id: user.id, razorpay_order_id, product, severity: "P0",
    });
    return NextResponse.json({ error: "Checkout amount verification failed." }, { status: 409 });
  }

  // Idempotent: if the webhook fires twice (Razorpay can replay), this
  // upsert keeps the row consistent and doesn't double-extend access.
  // The razorpay_payment_id has a UNIQUE constraint, so this is the
  // natural conflict key.
  const { error: paymentErr } = await admin
    .from("payments")
    .upsert(
      {
        user_id: user.id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount_paise: catalogProduct.pricePaise,
        currency: "INR",
        status: "paid",
        product,
      },
      { onConflict: "razorpay_payment_id" }
    );

  if (paymentErr) {
    console.error("[billing/verify] payments upsert failed", paymentErr);
    // We still want to grant access — the user paid Razorpay, and our
    // bookkeeping shouldn't punish them. But alert so we can reconcile.
    void fireAlert("Payments table write failed after verified payment", {
      user_id: user.id,
      razorpay_payment_id,
      severity: "P1",
    });
  }

  const { error: entitlementError } = await admin.rpc("grant_one_time_entitlement", {
    p_user_id: user.id,
    p_product: product,
    p_order_id: razorpay_order_id,
    p_payment_id: razorpay_payment_id,
  });
  if (entitlementError) {
    console.error("[billing/verify] one-time entitlement grant failed", entitlementError);
    void fireAlert("ONE-TIME ENTITLEMENT FAILED despite verified payment", {
      user_id: user.id, razorpay_payment_id, product, severity: "P0",
    });
    return NextResponse.json(
      {
        error:
          "Your payment went through, but we couldn't activate it immediately. Please contact support with your payment ID.",
      },
      { status: 500 }
    );
  }

  // Revenue ping 🎉
  void fireAlert(
    `One-time purchase — ${catalogProduct.label} from ${user.email ?? "unknown"}`,
    {
      user_id: user.id,
      razorpay_payment_id,
      product,
    }
  );
  // 📱 real-time SMS to Malkin — one-time paid unlock
  void sendAdminSMS(
    `ExamGrind: ${catalogProduct.label} bought by ${user.email ?? "unknown"}. pay=${razorpay_payment_id.slice(-8)}`
  );

  // The next render of /me and /home should see the upgrade.
  revalidatePath("/me");
  revalidatePath("/home");

  return NextResponse.json({
    ok: true,
    product,
  });
}
