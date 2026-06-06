import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/debug/razorpay-check
 *
 * Admin-only sanity check for the Razorpay env wiring. Returns:
 *   - whether the keys look like test or live mode
 *   - whether RAZORPAY_PLAN_ID is fetchable with those keys
 *   - if fetch fails, the verbatim Razorpay error so we can see the
 *     real reason ("plan not found" vs "auth failed" vs subscriptions
 *     not enabled, etc).
 *
 * Never logs or returns the secret. Truncates the plan_id and key_id
 * to first few chars only.
 *
 * Gated to ADMIN_EMAILS (defaults to garimakalhansh@gmail.com via
 * lib/admin-auth) so a random signed-in user can't enumerate or
 * probe the merchant's Razorpay config.
 */
export async function GET() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (!isAdminEmail(user.email ?? "")) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const planId = process.env.RAZORPAY_PLAN_ID;

  const summary = {
    has_key_id: !!keyId,
    has_key_secret: !!keySecret,
    has_plan_id: !!planId,
    key_id_mode: keyId?.startsWith("rzp_test_")
      ? "test"
      : keyId?.startsWith("rzp_live_")
      ? "live"
      : "unknown",
    key_id_preview: keyId ? `${keyId.slice(0, 12)}…` : null,
    plan_id_preview: planId ? `${planId.slice(0, 12)}…` : null,
  };

  if (!keyId || !keySecret || !planId) {
    return NextResponse.json({
      ok: false,
      stage: "env",
      summary,
      message:
        "One or more of NEXT_PUBLIC_RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_PLAN_ID is missing.",
    });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const plan = await razorpay.plans.fetch(planId);
    return NextResponse.json({
      ok: true,
      stage: "plan_fetch",
      summary,
      plan: {
        id: plan.id,
        status: (plan as { status?: string }).status,
        period: (plan as { period?: string }).period,
        interval: (plan as { interval?: number }).interval,
        item: (plan as { item?: { amount?: number; currency?: string; name?: string } }).item,
      },
    });
  } catch (e) {
    const err = e as {
      statusCode?: number;
      error?: { code?: string; description?: string; reason?: string };
      message?: string;
    };
    return NextResponse.json({
      ok: false,
      stage: "plan_fetch",
      summary,
      razorpay_error: {
        statusCode: err.statusCode ?? null,
        code: err.error?.code ?? null,
        description: err.error?.description ?? null,
        reason: err.error?.reason ?? null,
        message: err.message ?? null,
      },
    });
  }
}
