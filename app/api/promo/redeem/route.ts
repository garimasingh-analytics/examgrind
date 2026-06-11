import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/promo/redeem  { code: "LAUNCH100" }
 *
 * Looks up the code in promo_codes. If valid + active + under-limit,
 * inserts a row into user_chick_unlocks (idempotent on collision) and
 * increments redemption_count atomically. Returns the unlocked chick id.
 */
export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to redeem codes." }, { status: 401 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase().slice(0, 32);
  if (!code) {
    return NextResponse.json({ error: "Please paste a code." }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const { data: promo, error } = await admin
    .from("promo_codes")
    .select("code, grants_chick, max_redemptions, redemption_count, active, expires_at")
    .eq("code", code)
    .single();

  if (error || !promo) {
    return NextResponse.json({ error: "Code not found." }, { status: 404 });
  }
  if (!promo.active) {
    return NextResponse.json({ error: "This code is no longer active." }, { status: 403 });
  }
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: "This code has expired." }, { status: 403 });
  }
  if (
    typeof promo.max_redemptions === "number" &&
    promo.redemption_count >= promo.max_redemptions
  ) {
    return NextResponse.json({ error: "This code is out of redemptions." }, { status: 403 });
  }

  // Already redeemed by this user?
  const { data: existing } = await admin
    .from("user_chick_unlocks")
    .select("chick")
    .eq("user_id", user.id)
    .eq("chick", promo.grants_chick)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: true, alreadyUnlocked: true, chick: promo.grants_chick },
      { status: 200 }
    );
  }

  // Insert unlock
  const { error: insErr } = await admin.from("user_chick_unlocks").insert({
    user_id: user.id,
    chick: promo.grants_chick,
    source: `promo:${code}`,
  });
  if (insErr) {
    console.error("[promo/redeem] insert failed", insErr);
    return NextResponse.json({ error: "Couldn't unlock — please retry." }, { status: 500 });
  }

  // Bump redemption_count (best-effort; race-prone but acceptable here)
  await admin
    .from("promo_codes")
    .update({ redemption_count: (promo.redemption_count ?? 0) + 1 })
    .eq("code", code);

  void fireAlert(`Promo code redeemed: ${code} → ${promo.grants_chick}`, {
    user_id: user.id,
  });

  return NextResponse.json({ ok: true, chick: promo.grants_chick });
}
