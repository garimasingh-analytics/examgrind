import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/debug/create-plan
 *
 * One-shot helper to create the ExamGrind Monthly plan in the current
 * Razorpay account at the *current* launch price. Re-added for the
 * 2026-06 ₹75 → ₹199 pricing change.
 *
 * Idempotent: if a plan with the same (name, amount, period) already
 * exists, returns its plan_id instead of creating a duplicate.
 *
 * After this returns ok=true, paste the returned plan_id into Vercel's
 * RAZORPAY_PLAN_ID env var and redeploy.
 *
 * Sign-in required so random visitors can't enumerate or mutate the
 * merchant's plans. We'll delete this endpoint again after the new
 * plan_id is wired in (same pattern as the prior ₹75-era helper).
 */

const PLAN_NAME = "ExamGrind Monthly";
const PLAN_AMOUNT_PAISE = 19900; // ₹199

export async function GET() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { ok: false, error: "Razorpay key id/secret env vars missing." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // Look for an existing plan that matches name + price exactly.
  // Important: the old ₹75 plan must NOT be returned — we want a fresh
  // ₹199 plan even though the name is unchanged.
  try {
    const list = await razorpay.plans.all({ count: 100 });
    const items = (list?.items ?? []) as Array<{
      id: string;
      period?: string;
      interval?: number;
      item?: { name?: string; amount?: number; currency?: string };
    }>;
    const existing = items.find(
      (p) =>
        p.item?.name === PLAN_NAME &&
        p.period === "monthly" &&
        p.item?.amount === PLAN_AMOUNT_PAISE
    );
    if (existing) {
      return NextResponse.json({
        ok: true,
        action: "reused_existing",
        plan_id: existing.id,
        amount_paise: PLAN_AMOUNT_PAISE,
        message: `Found existing ₹${PLAN_AMOUNT_PAISE / 100} plan ${existing.id}. Set this as RAZORPAY_PLAN_ID in Vercel.`,
      });
    }
  } catch (e) {
    console.error("[debug/create-plan] list failed", e);
  }

  try {
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: PLAN_NAME,
        amount: PLAN_AMOUNT_PAISE,
        currency: "INR",
        description: "ExamGrind monthly — unlimited quizzes + mocks + Deep Analysis",
      },
      notes: {
        created_by: "examgrind /api/debug/create-plan",
        version: "2026-06-pricing-change",
      },
    });
    return NextResponse.json({
      ok: true,
      action: "created",
      plan_id: plan.id,
      amount_paise: PLAN_AMOUNT_PAISE,
      message: `Created ₹${PLAN_AMOUNT_PAISE / 100} plan ${plan.id}. Set this as RAZORPAY_PLAN_ID in Vercel.`,
    });
  } catch (e) {
    const err = e as {
      statusCode?: number;
      error?: { code?: string; description?: string; reason?: string };
      message?: string;
    };
    return NextResponse.json(
      {
        ok: false,
        razorpay_error: {
          statusCode: err.statusCode ?? null,
          code: err.error?.code ?? null,
          description: err.error?.description ?? null,
          reason: err.error?.reason ?? null,
          message: err.message ?? null,
        },
      },
      { status: 502 }
    );
  }
}
