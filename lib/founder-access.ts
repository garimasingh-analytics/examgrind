export const FOUNDER_PAID_UNTIL = "9999-12-31T23:59:59.999Z";
const DEFAULT_FOUNDER_ACCESS_EMAIL = "garimakalhansh@gmail.com";

/**
 * Founder entitlement is intentionally separate from the broader admin list.
 * A production operator must never receive a permanent paid plan merely for
 * being allowed into internal tools.
 */
export function getFounderAccessEmail(): string {
  return (process.env.FOUNDER_ACCESS_EMAIL ?? DEFAULT_FOUNDER_ACCESS_EMAIL)
    .trim()
    .toLowerCase();
}

export function isFounderAccessEmail(email: string | null | undefined): boolean {
  return Boolean(email && email.toLowerCase() === getFounderAccessEmail());
}

export function hasFounderAccess(
  subscriptionStatus: string | null | undefined,
  paidUntil: string | null | undefined
): boolean {
  return Boolean(
    subscriptionStatus === "paid" &&
      paidUntil &&
      new Date(paidUntil).getFullYear() >= 9999
  );
}
