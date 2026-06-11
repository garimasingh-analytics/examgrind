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
  | "bookworm"
  | "doctor"
  | "police"
  | "royal";

export type ChickDefinition = {
  id: ChickVariant;
  name: string;
  blurb: string;
  unlockXp: number; // 0 for default; -1 for premium-only
  emoji: string;
};

export const CHICK_VARIANTS: ChickDefinition[] = [
  {
    id: "classic",
    name: "Classic chick",
    blurb: "The OG. Fluffy and fearless.",
    unlockXp: 0,
    emoji: "🐥",
  },
  {
    id: "scholar",
    name: "Scholar chick",
    blurb: "Graduation cap energy. You read the textbook.",
    unlockXp: 500,
    emoji: "🎓",
  },
  {
    id: "bookworm",
    name: "Bookworm chick",
    blurb: "Round glasses. Knows every NCERT footnote.",
    unlockXp: 1500,
    emoji: "📚",
  },
  {
    id: "doctor",
    name: "Doctor chick",
    blurb: "Stethoscope swagger. NEET dreams.",
    unlockXp: 3000,
    emoji: "🩺",
  },
  {
    id: "police",
    name: "SSC chick",
    blurb: "Beret and badge. Selection mode: ON.",
    unlockXp: 5000,
    emoji: "👮",
  },
  {
    id: "royal",
    name: "Royal chick",
    blurb: "Crown. For premium royalty only 👑",
    unlockXp: -1, // premium-only
    emoji: "👑",
  },
];

/** Returns whether a given variant is unlocked for a user. */
export function isChickUnlocked(
  variant: ChickVariant,
  userXp: number,
  isPremium: boolean
): boolean {
  const def = CHICK_VARIANTS.find((c) => c.id === variant);
  if (!def) return false;
  if (def.unlockXp === -1) return isPremium;
  return userXp >= def.unlockXp;
}

/** Returns the list of unlocked variants for a user. */
export function getUnlockedChicks(
  userXp: number,
  isPremium: boolean
): ChickVariant[] {
  return CHICK_VARIANTS.filter((c) => isChickUnlocked(c.id, userXp, isPremium)).map(
    (c) => c.id
  );
}

/** Safely validate a string as a variant id. */
export function asChickVariant(v: string | null | undefined): ChickVariant {
  if (!v) return "classic";
  const found = CHICK_VARIANTS.find((c) => c.id === v);
  return found?.id ?? "classic";
}
