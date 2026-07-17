/**
 * Best-effort admin SMS alerts.
 *
 * Uses Fast2SMS "Quick SMS" route — no DLT registration required, works
 * for any Indian mobile number, ~Rs 0.20 per SMS.
 *
 * Env vars (set in Vercel):
 *   FAST2SMS_API_KEY      — from https://www.fast2sms.com/dashboard/settings
 *   SMS_ADMIN_PHONE       — Malkin's 10-digit mobile (no country code, no +)
 *
 * If either is missing, this is a no-op with a console.warn. Never throws,
 * never blocks the caller for more than 3s.
 *
 * Usage:
 *   await sendAdminSMS("New subscription — ₹199 from user@example.com");
 */
export async function sendAdminSMS(message: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const phone = process.env.SMS_ADMIN_PHONE;

  if (!apiKey || !phone) {
    console.warn(
      "[sms] FAST2SMS_API_KEY or SMS_ADMIN_PHONE missing — SMS skipped:",
      message
    );
    return false;
  }

  // Fast2SMS caps Quick SMS at 160 chars. Trim safely.
  const text = message.length > 160 ? message.slice(0, 157) + "..." : message;

  try {
    const params = new URLSearchParams({
      route: "q",
      message: text,
      numbers: phone,
      flash: "0",
    });
    const url = `https://www.fast2sms.com/dev/bulkV2?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        authorization: apiKey,
        "cache-control": "no-cache",
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `[sms] Fast2SMS non-2xx: ${res.status} — body: ${body.slice(0, 200)}`
      );
      return false;
    }
    const data = (await res.json().catch(() => null)) as
      | { return?: boolean; message?: string | string[] }
      | null;

    if (data?.return === true) {
      console.log(`[sms] ✅ sent to ${phone}: ${text}`);
      return true;
    }
    console.error("[sms] Fast2SMS returned falsy:", data);
    return false;
  } catch (e) {
    console.error("[sms] send threw:", e);
    return false;
  }
}
