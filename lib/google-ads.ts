const PAID_SUBSCRIPTION_DESTINATION =
  "AW-18332457479/YvDpCOWWt9QcEIe0zKVE";
const SIGN_UP_DESTINATION = "AW-18332457479/S5I2CKCahtscEIe0zKVE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Records a verified Razorpay checkout as the Google Ads conversion that
 * Performance Max should optimize for. transaction_id prevents duplicate
 * reporting if Razorpay invokes its success callback more than once.
 */
export function trackPaidSubscriptionConversion(transactionId: string, value = 199) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  const gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  gtag("event", "conversion", {
    send_to: PAID_SUBSCRIPTION_DESTINATION,
    value,
    currency: "INR",
    transaction_id: transactionId,
  });
}

/**
 * Records a completed account creation. This gives the Search campaign an
 * earlier, meaningful learning signal while subscription volume is still low.
 * The auth lifecycle component guarantees this fires only once per signup.
 */
export function trackSignUpConversion() {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  const gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  gtag("event", "conversion", {
    send_to: SIGN_UP_DESTINATION,
    value: 1,
    currency: "INR",
  });
}
