import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/debug/create-plan
 *
 * One-shot helper to create the ExamGrind Monthly plan in the current
 * Razorpay account (whichever account NEXT_PUBLIC_RAZORPAY_KEY_ID +
 * RAZORPAY_KEY_SECRET belong to). Idempotent: if a plan named
 * "ExamGrind Monthly" already exists, returns that one's ID instead
 * of creating a duplicate.
 *
 * Used to recover from the case where RAZORPAY_PLAN_ID was set to a
 * plan that lives in a different Razorpay account from the keys —
 * Razorpay returns "ID provided is invalid" because plans are
 * account-scoped.
 *
 * After this returns ok=true, paste the returned plan_id into
 * Vercel's RAZORPAY_PLAN_ID env var and redeploy.
 *
 * Sign-in required so a random visitor can't enumerate or mutate
 * the merchant's plans.
 */

const PLAN_NAME = "ExamGrind Monthly";
const PLAN_AMOUNT_PAISE = 7500; // ₹75

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

  // 1. Try to find an existing plan with the same name first. Razorpay
  //    doesn't dedupe by name on its end, so we do that ourselves to
  //    avoid stacking up duplicate "ExamGrind Monthly" entries when
  //    this endpoint gets hit more than once.
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
        message: `Found existing plan ${existing.id}. Set this as RAZORPAY_PLAN_ID in Vercel.`,
      });
    }
  } catch (e) {
    // List failed — fall through to create. The error here would be
    // the same kind of auth failure that would also break create, so
    // we'll surface it there.
    console.error("[debug/create-plan] list failed, will try create", e);
  }

  // 2. Create a new plan.
  try {
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: PLAN_NAME,
        amount: PLAN_AMOUNT_PAISE,
        currency: "INR",
        description: "Unlimited quizzes + Deep Analysis on every quiz",
      },
      notes: {
        created_by: "examgrind /api/debug/create-plan",
      },
    });
    return NextResponse.json({
      ok: true,
      action: "created",
      plan_id: plan.id,
      message: `Created new plan ${plan.id}. Set this as RAZORPAY_PLAN_ID in Vercel.`,
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
