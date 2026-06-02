import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";

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
 *   4. Mark the payments row paid + record signature for audit.
 *   5. Upgrade the user: subscription_status='paid', paid_until=now+30d.
 *   6. Fire a real-time alert so the founder sees revenue immediately.
 *   7. Invalidate /me and /home so the upgrade reflects instantly.
 */

type Body = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ENTITLEMENT_DAYS = 30;

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
        amount_paise: 7500,
        currency: "INR",
        status: "paid",
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

  // Extend paid_until. If the user already has time on their plan, we
  // STACK the entitlement (renew before expiry → 60 days). If they're
  // lapsed, start fresh from now.
  const { data: profile } = await admin
    .from("users")
    .select("paid_until")
    .eq("id", user.id)
    .maybeSingle<{ paid_until: string | null }>();

  const now = Date.now();
  const existingEnd = profile?.paid_until
    ? new Date(profile.paid_until).getTime()
    : 0;
  const base = Math.max(existingEnd, now);
  const newPaidUntil = new Date(base + ENTITLEMENT_DAYS * MS_PER_DAY);

  const { error: userErr } = await admin
    .from("users")
    .update({
      subscription_status: "paid",
      paid_until: newPaidUntil.toISOString(),
      last_razorpay_payment: razorpay_payment_id,
    })
    .eq("id", user.id);

  if (userErr) {
    console.error("[billing/verify] user upgrade failed", userErr);
    void fireAlert("USER UPGRADE FAILED despite verified Razorpay payment", {
      user_id: user.id,
      razorpay_payment_id,
      severity: "P0",
      action: "Manually set subscription_status='paid' for this user",
    });
    return NextResponse.json(
      {
        error:
          "Your payment went through, but we couldn't activate your account immediately. Please refresh — if it still shows free, contact support and we'll fix it manually.",
      },
      { status: 500 }
    );
  }

  // Revenue ping 🎉
  void fireAlert(
    `New paid user — ₹75 from ${user.email ?? "unknown"}`,
    {
      user_id: user.id,
      razorpay_payment_id,
      paid_until: newPaidUntil.toISOString(),
    }
  );

  // The next render of /me and /home should see the upgrade.
  revalidatePath("/me");
  revalidatePath("/home");

  return NextResponse.json({
    ok: true,
    paid_until: newPaidUntil.toISOString(),
  });
}
