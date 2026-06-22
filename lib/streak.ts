/**
 * Streak Insurance — XP-purchased shields that auto-protect daily streaks.
 *
 * Economics:
 *   - Cost: 500 XP per shield (≈5 chapter quizzes at 10 XP/correct).
 *   - Max held: 3 (anti-hoard).
 *   - Auto-consume in app/api/quiz/complete/route.ts: when the user comes
 *     back after a 2+ day gap, debit 1 shield and pretend last_active_date
 *     was yesterday — the streak survives, count keeps incrementing.
 *
 * Pure helpers — no DB calls. The caller does the read + write inside its
 * own transaction. Logging goes through public.shield_events (see
 * migration_025).
 */
export const SHIELD_COST_XP = 500;
export const MAX_SHIELDS = 3;

/** YYYY-MM-DD in UTC. Matches the convention in app/api/quiz/complete/route.ts. */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayUtc(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

/**
 * Compute the day-gap between two YYYY-MM-DD dates (later minus earlier).
 * Returns null if either date is malformed. Treats both inputs as UTC.
 */
export function dayGap(laterIso: string, earlierIso: string): number | null {
  const a = Date.parse(laterIso + "T00:00:00Z");
  const b = Date.parse(earlierIso + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / 86_400_000);
}

/**
 * Decide what should happen to the streak given a fresh quiz submission today.
 *
 * Inputs:
 *   - lastActiveDate (string | null) — users.last_active_date before this call
 *   - currentStreak (int) — users.streak_count before this call
 *   - shields (int) — users.streak_shields before this call
 *
 * Returns:
 *   - newStreak (int) — what to write back to streak_count
 *   - shieldConsumed (bool) — true means decrement streak_shields by 1 and
 *     log a shield_events row of kind 'auto_use'
 *   - reason ('first' | 'same-day' | 'next-day' | 'shield-saved' | 'reset')
 *
 * The auto-protect rule: if the gap is exactly 2 days AND the user has at
 * least 1 shield, we burn one shield and treat the gap as "next-day". Gaps
 * of 3+ days are NOT protected (would let a user disappear for a week and
 * keep their streak — that's not a streak).
 */
export type StreakDecision = {
  newStreak: number;
  shieldConsumed: boolean;
  reason: "first" | "same-day" | "next-day" | "shield-saved" | "reset";
};

export function decideStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  shields: number
): StreakDecision {
  const today = todayUtc();

  if (!lastActiveDate) {
    return { newStreak: 1, shieldConsumed: false, reason: "first" };
  }

  const gap = dayGap(today, lastActiveDate);

  if (gap === null) {
    // Malformed date — treat as fresh.
    return { newStreak: 1, shieldConsumed: false, reason: "first" };
  }

  if (gap <= 0) {
    // Same day or weird future date — leave streak as is, no extra increment.
    return {
      newStreak: Math.max(currentStreak, 1),
      shieldConsumed: false,
      reason: "same-day",
    };
  }

  if (gap === 1) {
    // Clean next-day continuation.
    return {
      newStreak: currentStreak + 1,
      shieldConsumed: false,
      reason: "next-day",
    };
  }

  if (gap === 2 && shields >= 1) {
    // One missed day, user has a shield — auto-save the streak.
    return {
      newStreak: currentStreak + 1,
      shieldConsumed: true,
      reason: "shield-saved",
    };
  }

  // Anything else (gap ≥ 3, or gap = 2 with zero shields) — reset.
  return { newStreak: 1, shieldConsumed: false, reason: "reset" };
}

/** UI helper: how many shields can this user still buy right now? */
export function shieldsAvailableToBuy(currentShields: number): number {
  return Math.max(0, MAX_SHIELDS - currentShields);
}

/** UI helper: does this XP balance afford a shield? */
export function canAffordShield(xp: number): boolean {
  return xp >= SHIELD_COST_XP;
}
