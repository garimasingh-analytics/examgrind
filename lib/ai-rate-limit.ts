import type { SupabaseClient } from "@supabase/supabase-js";

// Deep Dive uses Sonnet and can run for more than a minute. This is a
// generous fair-use safety valve, not a replacement for normal practice:
// cached analyses and regular analyses are unaffected.
export const DAILY_DEEP_DIVE_LIMIT = 5;
// Study Vault is free for every learner. This only limits new AI generations
// per day; everything a student has already created remains available.
export const DAILY_VAULT_GENERATION_LIMIT = 4;
// Coach lessons are deliberately distinct from the permanently-free Vault.
// A learner can teach themselves from saved cards without spending a lesson,
// while the live explanation remains protected from automated use.
export const DAILY_COACH_LESSON_LIMIT = 5;

export async function consumeDeepDiveSlot(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("consume_deep_dive_slot", {
    p_user_id: userId,
    p_limit: DAILY_DEEP_DIVE_LIMIT,
  });
  if (error) {
    // Fail closed: otherwise a migration/configuration regression turns into
    // unlimited expensive Sonnet traffic without anyone noticing.
    console.error("[ai-rate-limit] consume failed", error);
    return false;
  }
  return data === true;
}

export async function consumeVaultGenerationSlot(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("consume_vault_generation_slot", {
    p_user_id: userId,
    p_limit: DAILY_VAULT_GENERATION_LIMIT,
  });
  if (error) {
    console.error("[ai-rate-limit] vault generation consume failed", error);
    return false;
  }
  return data === true;
}

export async function consumeCoachLessonSlot(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("consume_coach_lesson_slot", {
    p_user_id: userId,
    p_limit: DAILY_COACH_LESSON_LIMIT,
  });
  if (error) {
    // Fail closed: a missing migration must never become unlimited live AI.
    console.error("[ai-rate-limit] coach lesson consume failed", error);
    return false;
  }
  return data === true;
}
