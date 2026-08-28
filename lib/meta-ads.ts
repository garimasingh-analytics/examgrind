declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * A completed public diagnosis is the first high-intent action from a cold
 * visitor. Meta calls this a Lead: the student has given us a full learning
 * signal, not merely clicked an ad or viewed a page. Keep the payload generic
 * and never send answers, scores, or subject-level performance to ad platforms.
 */
export function trackMetaDiagnosisLead(
  exam:
    | "cuet"
    | "ssc-cgl"
    | "neet-ug"
    | "delhi-police-constable"
    | "uppsc-ro-aro"
    | "up-secretariat-ro-aro"
    | "uppsc-pcs",
) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "Lead", {
    content_name: "free_diagnosis",
    content_category: exam,
  });
}

/** Records a completed account creation without transmitting identity data. */
export function trackMetaRegistration() {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "CompleteRegistration", {
    content_name: "examgrind_account",
  });
}

/** Lets Meta learn from visitors who genuinely open a checkout. */
export function trackMetaCheckoutStarted(product: string) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "InitiateCheckout", {
    content_name: product,
    currency: "INR",
  });
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
