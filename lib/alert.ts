/**
 * Best-effort alert webhook for ops-relevant events.
 *
 * Fires a POST to ALERT_WEBHOOK_URL if configured. Falls back to
 * console.error with an [ALERT] prefix so Vercel logs still show
 * the event even without a webhook.
 *
 * Works with Slack incoming webhooks, Discord webhooks, or any
 * endpoint that accepts JSON `{ text: "..." }`.
 *
 * Never throws, never blocks the user response for more than 2s.
 * Use this everywhere we want to know about something in real time —
 * Anthropic credit failures, new partner applications, etc.
 */
export async function fireAlert(
  message: string,
  context: Record<string, unknown> = {}
): Promise<void> {
  const url = process.env.ALERT_WEBHOOK_URL;
  const severity = typeof context.severity === "string" ? context.severity : "";

  // A missing optional webhook must not mean a P0/P1 incident goes unseen.
  // Fast2SMS is already configured for the founder's payment alerts, so use
  // it as the durable no-new-account fallback for critical incidents only.
  if ((severity === "P0" || severity === "P1") && !url) {
    void sendAdminSMS(`ExamGrind ALERT ${severity}: ${message}`);
  }
  if (!url) {
    console.error("[ALERT]", message, JSON.stringify(context));
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 ExamGrind: ${message}`,
        ...context,
      }),
      signal: AbortSignal.timeout(2000),
    });
    // A non-2xx webhook is also an operational failure. Fall back to SMS for
    // critical alerts rather than silently treating it as delivered.
    if (!response.ok && (severity === "P0" || severity === "P1")) {
      void sendAdminSMS(`ExamGrind ALERT ${severity}: ${message}`);
    }
  } catch (e) {
    console.error("[ALERT] webhook failed:", e);
    if (severity === "P0" || severity === "P1") {
      void sendAdminSMS(`ExamGrind ALERT ${severity}: ${message}`);
    }
  }
}
import { sendAdminSMS } from "./sms";
