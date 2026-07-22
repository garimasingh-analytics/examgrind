declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Records a completed ₹199 subscription for Meta Ads optimisation. */
export function trackMetaSubscriptionPurchase(transactionId: string) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq(
    "track",
    "Purchase",
    { value: 199, currency: "INR" },
    { eventID: transactionId }
  );
}
