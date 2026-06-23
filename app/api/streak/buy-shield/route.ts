import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  SHIELD_COST_XP,
  MAX_SHIELDS,
  canAffordShield,
  shieldsAvailableToBuy,
} from "@/lib/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/streak/buy-shield
 *
 * Spends SHIELD_COST_XP (500) XP to buy one streak shield. Caps at
 * MAX_SHIELDS (3). Returns the updated balance so the /me page can re-render
 * without a full page reload.
 *
 * Race-safety: the read-then-write pattern is fine here because XP only ever
 * grows monotonically from quiz/complete writes (no concurrent debit path),
 * and the only other writer to streak_shields is quiz/complete's auto-use
 * which decrements — at worst two near-simultaneous calls cost an extra
 * 500 XP but never give the user more than MAX_SHIELDS shields (CHECK
 * constraint enforces).
 */
export async function POST() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const { data: profile, error: readErr } = await admin
    .from("users")
    .select("xp, streak_shields")
    .eq("id", user.id)
    .maybeSingle<{ xp: number; streak_shields: number }>();

  if (readErr || !profile) {
    return NextResponse.json(
      { error: "Profile not found." },
      { status: 404 }
    );
  }

  const currentXp = profile.xp ?? 0;
  const currentShields = profile.streak_shields ?? 0;

  if (!canAffordShield(currentXp)) {
    return NextResponse.json(
      {
        error: "not_enough_xp",
        message: `You need ${SHIELD_COST_XP} XP to buy a shield. You have ${currentXp}.`,
        cost: SHIELD_COST_XP,
        currentXp,
      },
      { status: 402 }
    );
  }

  if (shieldsAvailableToBuy(currentShields) <= 0) {
    return NextResponse.json(
      {
        error: "shields_capped",
        message: `You can hold at most ${MAX_SHIELDS} shields. Use one before buying more.`,
        max: MAX_SHIELDS,
      },
      { status: 409 }
    );
  }

  const newXp = currentXp - SHIELD_COST_XP;
  const newShields = currentShields + 1;

  const { error: writeErr } = await admin
    .from("users")
    .update({ xp: newXp, streak_shields: newShields })
    .eq("id", user.id);

  if (writeErr) {
    return NextResponse.json(
      { error: "write_failed", message: writeErr.message },
      { status: 500 }
    );
  }

  // Log the purchase. Failure here is non-fatal — the spend already
  // happened, the log is just for the /me history UI.
  await admin.from("shield_events").insert({
    user_id: user.id,
    kind: "purchase",
    xp_cost: SHIELD_COST_XP,
    shields_after: newShields,
  });

  return NextResponse.json({
    ok: true,
    xp: newXp,
    streak_shields: newShields,
    cost: SHIELD_COST_XP,
  });
}
