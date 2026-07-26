import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";
import { sendPaymentConfirmation } from "@/lib/email";
import { sendAdminSMS } from "@/lib/sms";
import { isOneTimeProduct, ONE_TIME_PRODUCTS } from "@/lib/billing-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/webhook
 *
 * The single endpoint Razorpay calls for every subscription lifecycle
 * event. Configure in the Razorpay Dashboard:
 *   Settings → Webhooks → + Add New
 *     URL: https://<your-domain>/api/billing/webhook
 *     Secret: a long random string — paste the same value into
 *             RAZORPAY_WEBHOOK_SECRET in Vercel env.
 *     Active events: payment.captured, payment.failed, subscription.activated, subscription.charged,
 *                    subscription.cancelled, subscription.completed,
 *                    subscription.pending, subscription.halted,
 *                    subscription.paused, subscription.resumed,
 *                    payment.failed
 *
 * Security:
 *   - HMAC-SHA256(raw body, webhook_secret) must match X-Razorpay-Signature.
 *     We use the RAW body — JSON.parse(JSON.stringify) would mangle key
 *     ordering and break the signature.
 *   - X-Razorpay-Event-Id is unique per logical event. We dedupe in the
 *     razorpay_webhook_events table so a retried delivery doesn't
 *     extend a subscription twice.
 */

type RazorpaySubscriptionEntity = {
  id: string;
  plan_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
  charge_at?: number;
  paid_count?: number;
  remaining_count?: number;
  notes?: { user_id?: string; email?: string };
};

type RazorpayPaymentLinkEntity = {
  id: string;
  amount: number;
  status: string;
};

type WebhookPayload = {
  event: string;
  payload: {
    subscription?: { entity: RazorpaySubscriptionEntity };
    payment?: {
      entity: {
        id: string;
        order_id?: string;
        status: string;
        amount?: number;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    payment_link?: { entity: RazorpayPaymentLinkEntity };
  };
};

function tsToIso(secs: number | undefined): string | null {
  if (!secs) return null;
  return new Date(secs * 1000).toISOString();
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

async function requireWrite(
  label: string,
  operation: PromiseLike<{ error: { message?: string } | null }>
) {
  const { error } = await operation;
  if (error) throw new Error(`${label}: ${error.message ?? "database write failed"}`);
}

export async function POST(req: NextRequest) {
  console.log("[billing/webhook] ⚡ RECEIVED webhook from Razorpay");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[billing/webhook] ❌ missing RAZORPAY_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  // RAW body for HMAC verification.
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const eventId = req.headers.get("x-razorpay-event-id") ?? "";
  const durableEventId = eventId || crypto.randomUUID();

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) {
    void fireAlert("Razorpay webhook signature mismatch", {
      eventId,
      severity: "P1",
    });
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  let body: WebhookPayload;
  try {
    body = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Idempotency check: have we processed this event before?
  let priorEvent: { id: string; processed_at: string | null } | null = null;
  if (eventId) {
    const { data: dupe, error: dedupeErr } = await admin
      .from("razorpay_webhook_events")
      .select("id, processed_at")
      .eq("event_id", eventId)
      .maybeSingle();
    if (dedupeErr) {
      console.error("[billing/webhook] dedupe lookup failed", dedupeErr);
      return NextResponse.json({ error: "Database unavailable." }, { status: 500 });
    }
    priorEvent = dupe;
    if (priorEvent?.processed_at) {
      // Already processed — Razorpay is retrying, ack with 200.
      return NextResponse.json({ ok: true, deduped: true });
    }
  }

  // Record the event up front so a crash mid-processing still lets us
  // reconcile manually from the payload column.
  if (!priorEvent) {
    const { error: eventInsertErr } = await admin.from("razorpay_webhook_events").insert({
      event_id: durableEventId,
      event_type: body.event,
      payload: body,
      processed_at: null,
    });
    if (eventInsertErr) {
      console.error("[billing/webhook] event log insert failed", eventInsertErr);
      return NextResponse.json({ error: "Database unavailable." }, { status: 500 });
    }
  }

  const sub = body.payload.subscription?.entity;
  const payment = body.payload.payment?.entity;
  const paymentLink = body.payload.payment_link?.entity;

  try {
    switch (body.event) {
      case "subscription.activated":
      case "subscription.charged": {
        if (!sub) break;
        const userId = sub.notes?.user_id;
        if (!userId) {
          void fireAlert("subscription event without user_id in notes", {
            subscription_id: sub.id,
            event: body.event,
          });
          break;
        }

        const paidUntilIso =
          tsToIso(sub.current_end) ??
          new Date(Date.now() + 30 * MS_PER_DAY).toISOString();

        await requireWrite("subscription mirror update", admin
          .from("subscriptions")
          .update({
            state: sub.status,
            current_start: tsToIso(sub.current_start),
            current_end: tsToIso(sub.current_end),
            charge_at: tsToIso(sub.charge_at),
            paid_count: sub.paid_count ?? 0,
            remaining_count: sub.remaining_count ?? null,
          })
          .eq("razorpay_subscription_id", sub.id));

        await requireWrite("user entitlement update", admin
          .from("users")
          .update({
            subscription_status: "paid",
            subscription_state: sub.status,
            paid_until: paidUntilIso,
          })
          .eq("id", userId));

        const emailForAlert = sub.notes?.email;
        const userTag = emailForAlert ?? `user ${userId.slice(0, 8)}`;
        if (body.event === "subscription.activated") {
          void fireAlert(
            `New SUBSCRIPTION activated — ₹199/mo recurring from ${userTag}`,
            { subscription_id: sub.id, paid_until: paidUntilIso }
          );
          // 📱 real-time SMS to Malkin — new paid sub
          void sendAdminSMS(
            `ExamGrind: NEW sub Rs 199/mo. ${userTag}. sub=${sub.id.slice(-8)}`
          );
        } else {
          void fireAlert(
            `Subscription RENEWED — auto-charge succeeded for ${userTag}`,
            { subscription_id: sub.id, paid_until: paidUntilIso }
          );
          // 📱 real-time SMS to Malkin — renewal charged
          void sendAdminSMS(
            `ExamGrind: RENEW Rs 199. ${userTag}. sub=${sub.id.slice(-8)}`
          );
        }

        // Send payment confirmation email (no-op if SMTP not configured)
        const email = sub.notes?.email;
        console.log(`[billing/webhook] ✉️  payment confirmation: email=${email ?? "<none>"} sub_id=${sub.id}`);
        if (email) {
          const periodEndsAt = new Date(paidUntilIso).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });
          try {
            const sent = await sendPaymentConfirmation(email, 199, periodEndsAt, sub.id);
            console.log(`[billing/webhook] ✉️  email sent: ${sent}`);
          } catch (err) {
            console.error("[billing/webhook] ❌ email send threw:", err);
          }
        } else {
          console.warn("[billing/webhook] ⚠️ no email in sub.notes — receipt not sent. user_id=" + userId);
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired": {
        if (!sub) break;
        const userId = sub.notes?.user_id;
        await requireWrite("subscription cancellation update", admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id));

        if (userId) {
          // Don't immediately downgrade to 'free' — the user paid for
          // the current cycle; let it run out naturally. The pg_cron
          // sweep + lib/subscription lazy-downgrade handle the flip.
          await requireWrite("user cancellation update", admin
            .from("users")
            .update({ subscription_state: sub.status })
            .eq("id", userId));
        }
        break;
      }

      case "subscription.pending":
      case "subscription.halted":
      case "subscription.paused": {
        if (!sub) break;
        const userId = sub.notes?.user_id;
        await requireWrite("subscription status update", admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id));
        if (userId) {
          await requireWrite("user subscription state update", admin
            .from("users")
            .update({ subscription_state: sub.status })
            .eq("id", userId));
        }
        if (body.event === "subscription.halted") {
          void fireAlert(
            `Subscription HALTED — bank rejected renewal twice for ${userId?.slice(0, 8) ?? "unknown"}`,
            { subscription_id: sub.id, severity: "P1" }
          );
        }
        break;
      }

      case "subscription.resumed": {
        if (!sub) break;
        await requireWrite("subscription resume update", admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id));
        break;
      }

      case "payment.captured": {
        // One-time ₹19 / ₹49 checkouts may be completed after the student
        // closes the browser. Reconcile from the order we created server-side
        // rather than trusting client notes or the displayed amount.
        if (!payment?.order_id) break;
        const { data: order, error: orderError } = await admin
          .from("payments")
          .select("user_id, product, amount_paise, status")
          .eq("razorpay_order_id", payment.order_id)
          .maybeSingle<{
            user_id: string;
            product: string;
            amount_paise: number;
            status: string;
          }>();
        if (orderError) throw new Error(`payment order lookup: ${orderError.message}`);
        // Subscription charges have a different entitlement path. Ignore
        // unknown Razorpay orders instead of granting access from metadata.
        if (!order || !isOneTimeProduct(order.product)) break;
        const product = order.product;
        const expected = ONE_TIME_PRODUCTS[product].pricePaise;
        if (order.amount_paise !== expected || payment.amount !== expected) {
          throw new Error(`payment amount mismatch for ${payment.order_id}`);
        }

        await requireWrite("one-time payment mirror update", admin
          .from("payments")
          .update({
            razorpay_payment_id: payment.id,
            amount_paise: expected,
            status: "paid",
          })
          .eq("razorpay_order_id", payment.order_id));

        const { error: entitlementError } = await admin.rpc("grant_one_time_entitlement", {
          p_user_id: order.user_id,
          p_product: product,
          p_order_id: payment.order_id,
          p_payment_id: payment.id,
        });
        if (entitlementError) throw new Error(`one-time entitlement grant: ${entitlementError.message}`);

        // The checkout callback may have already handled this; grant is still
        // idempotent, but avoid duplicate founder SMS/alerts.
        if (order.status !== "paid") {
          const label = ONE_TIME_PRODUCTS[product].label;
          void fireAlert(`One-time purchase captured — ${label}`, {
            user_id: order.user_id, payment_id: payment.id, product,
          });
          void sendAdminSMS(`ExamGrind: ${label} captured. pay=${payment.id.slice(-8)}`);
        }
        break;
      }

      case "payment_link.paid": {
        // Hosted links are the durable fallback for browsers that block
        // Razorpay checkout.js. Trust only the server-created link ID and
        // the signed webhook payload — never callback query parameters.
        if (!paymentLink || !payment?.id) break;
        const { data: linkPayment, error: linkError } = await admin
          .from("payments")
          .select("user_id, product, amount_paise, status")
          .eq("razorpay_payment_link_id", paymentLink.id)
          .maybeSingle<{
            user_id: string;
            product: string;
            amount_paise: number;
            status: string;
          }>();
        if (linkError) throw new Error(`payment-link lookup: ${linkError.message}`);
        if (!linkPayment || !isOneTimeProduct(linkPayment.product)) break;
        const product = linkPayment.product;
        const expected = ONE_TIME_PRODUCTS[product].pricePaise;
        if (linkPayment.amount_paise !== expected || paymentLink.amount !== expected || payment.amount !== expected) {
          throw new Error(`payment-link amount mismatch for ${paymentLink.id}`);
        }

        await requireWrite("hosted payment mirror update", admin
          .from("payments")
          .update({ razorpay_payment_id: payment.id, amount_paise: expected, status: "paid" })
          .eq("razorpay_payment_link_id", paymentLink.id));

        const { error: entitlementError } = await admin.rpc("grant_one_time_entitlement", {
          p_user_id: linkPayment.user_id,
          p_product: product,
          p_order_id: paymentLink.id,
          p_payment_id: payment.id,
        });
        if (entitlementError) throw new Error(`hosted entitlement grant: ${entitlementError.message}`);

        if (linkPayment.status !== "paid") {
          const label = ONE_TIME_PRODUCTS[product].label;
          void fireAlert(`One-time purchase captured — ${label}`, {
            user_id: linkPayment.user_id, payment_id: payment.id, product,
          });
          void sendAdminSMS(`ExamGrind: ${label} captured. pay=${payment.id.slice(-8)}`);
        }
        break;
      }

      case "payment.failed": {
        // Standalone payment failures (not part of a subscription cycle)
        // — log + alert. Subscription-cycle failures come through as
        // subscription.pending / halted, handled above.
        if (payment) {
          void fireAlert(
            `Payment FAILED — ${payment.error_description ?? "unknown reason"}`,
            {
              payment_id: payment.id,
              order_id: payment.order_id,
              severity: "P2",
            }
          );
        }
        break;
      }

      default:
        // Quietly ignore — we record every event in the log table for
        // forensics anyway.
        break;
    }
  } catch (e) {
    console.error("[billing/webhook] processing failed", e);
    await admin
      .from("razorpay_webhook_events")
      .update({ last_error: e instanceof Error ? e.message.slice(0, 500) : "unknown processing error" })
      .eq("event_id", durableEventId);
    // Return 500 so Razorpay retries. Idempotency dedupe will save us
    // from double-processing once the underlying issue is resolved.
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }

  await requireWrite(
    "mark webhook processed",
    admin
      .from("razorpay_webhook_events")
      .update({ processed_at: new Date().toISOString(), last_error: null })
      .eq("event_id", durableEventId)
  );

  return NextResponse.json({ ok: true });
}
