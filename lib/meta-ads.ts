declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Records a completed paid access purchase for Meta Ads optimisation. */
export function trackMetaSubscriptionPurchase(transactionId: string, value = 199) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq(
    "track",
    "Purchase",
    { value, currency: "INR" },
    { eventID: transactionId }
  );
}
