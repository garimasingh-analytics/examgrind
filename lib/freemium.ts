import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Freemium gate — single source of truth.
 *
 * The pricing model (decided 2026-06):
 *   FREE TIER (cumulative, not per exam):
 *     • 3 chapter quizzes
 *     • 1 mock test
 *     • 1 deep analysis
 *   After any limit is hit, the user must upgrade.
 *
 * Each kind has its own counter on public.users:
 *   quizzes_started  / mock_tests_started / analyses_started
 *
 * We gate on the *started* counters, not *taken* — so a user who starts
 * a quiz and abandons it still burns one of their free attempts. That's
 * intentional: it prevents anyone from gaming the gate by quitting at
 * Q1 and restarting.
 */

export type Gate = "quiz" | "mock" | "analysis";

export const FREE_LIMITS: Record<Gate, number> = {
  quiz: 3,
  mock: 1,
  analysis: 1,
};

const COUNTER_COL: Record<Gate, string> = {
  quiz: "quizzes_started",
  mock: "mock_tests_started",
  analysis: "analyses_started",
};

export type FreemiumDecision = {
  allowed: boolean;
  isPaid: boolean;
  used: number;
  limit: number;
  gate: Gate;
};

/**
 * Read the user's gate state. Always reads from the canonical row so a
 * stale client snapshot can't be used to bypass.
 */
export async function checkFreemium(
  supabase: SupabaseClient,
  userId: string,
  gate: Gate
): Promise<FreemiumDecision> {
  const col = COUNTER_COL[gate];
  const { data } = await supabase
    .from("users")
    .select(`subscription_status, ${col}`)
    .eq("id", userId)
    .maybeSingle();

  const profile = data as
    | (Record<string, unknown> & {
        subscription_status?: "free" | "trial" | "paid";
      })
    | null;

  const isPaid = profile?.subscription_status === "paid";
  const used = ((profile as Record<string, unknown> | null)?.[col] as number) ?? 0;
  const limit = FREE_LIMITS[gate];
  const allowed = isPaid || used < limit;

  return { allowed, isPaid, used, limit, gate };
}

/**
 * Friendly message + paywall payload for a blocked gate. Lines up with
 * the existing UpgradeModal shape (paywall.reason drives the copy).
 */
export function paywallError(decision: FreemiumDecision) {
  const reasonByGate: Record<Gate, string> = {
    quiz: "quiz-limit",
    mock: "mock-limit",
    analysis: "analysis-limit",
  };
  const messageByGate: Record<Gate, string> = {
    quiz: "You've used your 3 free quizzes. Upgrade to keep practicing.",
    mock: "You've used your 1 free mock test. Upgrade to take more full-length mocks.",
    analysis:
      "You've used your 1 free Deep Analysis. Upgrade to get AI feedback on every quiz.",
  };
  return {
    error: messageByGate[decision.gate],
    paywall: {
      reason: reasonByGate[decision.gate],
      currentTier: decision.isPaid ? "paid" : "free",
      used: decision.used,
      limit: decision.limit,
    },
  };
}
