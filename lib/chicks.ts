/**
 * Chick variants — cosmetic skins unlocked by XP or premium status.
 *
 * Each variant overlays accessories on the base chick SVG. The base
 * chick body/eyes/animations remain unchanged across variants — only
 * the cosmetic overlay differs. Premium users get the royal chick for
 * free regardless of XP; everyone else unlocks via accumulated XP.
 */

export type ChickVariant =
  | "classic"
  | "scholar"
  | "ninja"
  | "bookworm"
  | "dragon"
  | "doctor"
  | "cyber"
  | "police"
  | "warrior"
  | "royal"
  | "cosmic"
  | "squad"
  | "phoenix";

export type ChickDefinition = {
  id: ChickVariant;
  name: string;
  blurb: string;
  unlockXp: number; // 0 for default; -1 for premium-only
  emoji: string;
};

export const CHICK_VARIANTS: ChickDefinition[] = [
  { id: "classic",  name: "Classic chick",   blurb: "The OG. Fluffy and fearless.",            unlockXp: 0,    emoji: "🐥" },
  { id: "scholar",  name: "Scholar chick",   blurb: "Graduation cap energy. You read it.",     unlockXp: 500,  emoji: "🎓" },
  { id: "ninja",    name: "Ninja chick",     blurb: "Silent grind. Red headband. Focus.",      unlockXp: 1000, emoji: "🥷" },
  { id: "bookworm", name: "Bookworm chick",  blurb: "Round glasses. Every NCERT footnote.",    unlockXp: 1500, emoji: "📚" },
  { id: "dragon",   name: "Dragon chick",    blurb: "Horns. Fire. Untouchable.",               unlockXp: 2500, emoji: "🐉" },
  { id: "doctor",   name: "Doctor chick",    blurb: "Stethoscope swagger. NEET dreams.",       unlockXp: 3000, emoji: "🩺" },
  { id: "cyber",    name: "Cyber chick",     blurb: "Blue visor. E-sport energy. Glitching.",  unlockXp: 4000, emoji: "🤖" },
  { id: "police",   name: "SSC chick",       blurb: "Beret and badge. Selection mode: ON.",    unlockXp: 5000, emoji: "👮" },
  { id: "warrior",  name: "Warrior chick",   blurb: "Bronze helmet. Red plume. Top dog.",      unlockXp: 7500, emoji: "⚔️" },
  { id: "royal",    name: "Royal chick",     blurb: "Crown. For premium royalty only 👑",      unlockXp: -1,   emoji: "👑" },
  // Code-only chicks — never unlock via XP. Redeemed by promo codes.
  { id: "cosmic",   name: "Cosmic chick",    blurb: "Sparkle aura. Code-only rare.",           unlockXp: -2,   emoji: "🌟" },
  { id: "squad",    name: "Squad chick",     blurb: "Friend referral exclusive.",              unlockXp: -2,   emoji: "🤝" },
  { id: "phoenix",  name: "Phoenix chick",   blurb: "Ultra-rare. Earned, never bought.",       unlockXp: -2,   emoji: "🔥" },
];

/** Returns whether a given variant is unlocked for a user.
 *  unlockXp === -1  → premium-only
 *  unlockXp === -2  → code-only (only unlocked if explicitly granted via promo redemption;
 *                     this fn returns false; the API endpoint that saves picks should
 *                     additionally consult the user_unlocked_chicks table). */
export function isChickUnlocked(
  variant: ChickVariant,
  userXp: number,
  isPremium: boolean,
  explicitlyGranted: ChickVariant[] = []
): boolean {
  const def = CHICK_VARIANTS.find((c) => c.id === variant);
  if (!def) return false;
  if (def.unlockXp === -1) return isPremium;
  if (def.unlockXp === -2) return explicitlyGranted.includes(variant);
  return userXp >= def.unlockXp;
}

/** Returns the list of unlocked variants for a user. */
export function getUnlockedChicks(
  userXp: number,
  isPremium: boolean,
  explicitlyGranted: ChickVariant[] = []
): ChickVariant[] {
  return CHICK_VARIANTS.filter((c) =>
    isChickUnlocked(c.id, userXp, isPremium, explicitlyGranted)
  ).map((c) => c.id);
}

/** Safely validate a string as a variant id. */
export function asChickVariant(v: string | null | undefined): ChickVariant {
  if (!v) return "classic";
  const found = CHICK_VARIANTS.find((c) => c.id === v);
  return found?.id ?? "classic";
}
