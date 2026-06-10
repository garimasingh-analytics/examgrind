import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";
import { sendPaymentConfirmation } from "@/lib/email";

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
 *     Active events: subscription.activated, subscription.charged,
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
  };
};

function tsToIso(secs: number | undefined): string | null {
  if (!secs) return null;
  return new Date(secs * 1000).toISOString();
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[billing/webhook] missing RAZORPAY_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  // RAW body for HMAC verification.
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const eventId = req.headers.get("x-razorpay-event-id") ?? "";

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
  if (eventId) {
    const { data: dupe } = await admin
      .from("razorpay_webhook_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();
    if (dupe) {
      // Already processed — Razorpay is retrying, ack with 200.
      return NextResponse.json({ ok: true, deduped: true });
    }
  }

  // Record the event up front so a crash mid-processing still lets us
  // reconcile manually from the payload column.
  await admin.from("razorpay_webhook_events").insert({
    event_id: eventId || crypto.randomUUID(),
    event_type: body.event,
    payload: body,
  });

  const sub = body.payload.subscription?.entity;
  const payment = body.payload.payment?.entity;

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

        await admin
          .from("subscriptions")
          .update({
            state: sub.status,
            current_start: tsToIso(sub.current_start),
            current_end: tsToIso(sub.current_end),
            charge_at: tsToIso(sub.charge_at),
            paid_count: sub.paid_count ?? 0,
            remaining_count: sub.remaining_count ?? null,
          })
          .eq("razorpay_subscription_id", sub.id);

        await admin
          .from("users")
          .update({
            subscription_status: "paid",
            subscription_state: sub.status,
            paid_until: paidUntilIso,
          })
          .eq("id", userId);

        if (body.event === "subscription.activated") {
          void fireAlert(
            `New SUBSCRIPTION activated — ₹199/mo recurring from user ${userId.slice(0, 8)}`,
            { subscription_id: sub.id, paid_until: paidUntilIso }
          );
        } else {
          void fireAlert(
            `Subscription RENEWED — auto-charge succeeded for ${userId.slice(0, 8)}`,
            { subscription_id: sub.id, paid_until: paidUntilIso }
          );
        }

        // Send payment confirmation email (no-op if SMTP not configured)
        const email = sub.notes?.email;
        if (email) {
          const periodEndsAt = new Date(paidUntilIso).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });
          void sendPaymentConfirmation(email, 199, periodEndsAt);
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired": {
        if (!sub) break;
        const userId = sub.notes?.user_id;
        await admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id);

        if (userId) {
          // Don't immediately downgrade to 'free' — the user paid for
          // the current cycle; let it run out naturally. The pg_cron
          // sweep + lib/subscription lazy-downgrade handle the flip.
          await admin
            .from("users")
            .update({ subscription_state: sub.status })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.pending":
      case "subscription.halted":
      case "subscription.paused": {
        if (!sub) break;
        const userId = sub.notes?.user_id;
        await admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id);
        if (userId) {
          await admin
            .from("users")
            .update({ subscription_state: sub.status })
            .eq("id", userId);
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
        await admin
          .from("subscriptions")
          .update({ state: sub.status })
          .eq("razorpay_subscription_id", sub.id);
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
    // Return 500 so Razorpay retries. Idempotency dedupe will save us
    // from double-processing once the underlying issue is resolved.
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
