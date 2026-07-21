const PAID_SUBSCRIPTION_DESTINATION =
  "AW-18332457479/YvDpCOWWt9QcEIe0zKVE";

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
export function trackPaidSubscriptionConversion(transactionId: string) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  const gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  gtag("event", "conversion", {
    send_to: PAID_SUBSCRIPTION_DESTINATION,
    value: 199,
    currency: "INR",
    transaction_id: transactionId,
  });
}
