export const FOUNDER_PAID_UNTIL = "9999-12-31T23:59:59.999Z";

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
