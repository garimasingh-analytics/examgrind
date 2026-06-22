import { NextResponse, type NextRequest } from "next/server";
import {
  sendEmail,
  sendWelcomeEmail,
  sendPaymentConfirmation,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary diagnostic endpoint to debug SMTP + transactional emails.
 *
 * Usage:
 *   GET /api/debug/email-test?to=you@example.com
 *     → sends the SMTP diagnostic ping
 *   GET /api/debug/email-test?to=you@example.com&template=welcome&exam=cuet
 *     → fires the REAL welcome email (CUET / SSC / NEET) so you can preview
 *       it without going through a fresh OAuth signup that bumps a user row.
 *   GET /api/debug/email-test?to=you@example.com&template=payment
 *     → fires the REAL subscription thank-you email with sample values so
 *       you can preview it before flipping Razorpay to live mode. No actual
 *       payment is processed.
 *
 * REMOVE THIS FILE once everything is verified working end-to-end.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const to = url.searchParams.get("to");
  const template = url.searchParams.get("template");
  const exam = url.searchParams.get("exam") ?? "neet-ug";

  if (!to) {
    return NextResponse.json(
      {
        error:
          "Pass ?to=email@example.com (optional: &template=welcome&exam=cuet|ssc-cgl|neet-ug or &template=payment)",
      },
      { status: 400 }
    );
  }

  const envSummary = {
    SMTP_USER_set: !!process.env.SMTP_USER,
    SMTP_PASS_set: !!process.env.SMTP_PASS,
    SMTP_PASS_length: process.env.SMTP_PASS?.length ?? 0,
    SMTP_HOST: process.env.SMTP_HOST ?? "smtp.hostinger.com (default)",
    SMTP_PORT: process.env.SMTP_PORT ?? "465 (default)",
    EMAIL_FROM:
      process.env.EMAIL_FROM ?? "ExamGrind <info@examgrind.in> (default)",
  };

  try {
    let ok = false;
    if (template === "welcome") {
      ok = await sendWelcomeEmail(to, exam);
    } else if (template === "payment") {
      // Preview with realistic sample values. The next renewal date is set
      // ~30 days out so the email looks correct end-to-end. No real payment
      // is processed — this is purely a render test.
      const nextRenewal = new Date();
      nextRenewal.setDate(nextRenewal.getDate() + 30);
      const periodEndsAt = nextRenewal.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ok = await sendPaymentConfirmation(
        to,
        199,
        periodEndsAt,
        "pay_PREVIEW_TXN_xxxxxxxxx"
      );
    } else {
      ok = await sendEmail({
        to,
        subject: "🧪 ExamGrind SMTP diagnostic test",
        html: `<p>If you received this, SMTP is working from production.</p><p>Time: ${new Date().toISOString()}</p>`,
      });
    }
    return NextResponse.json({
      sent: ok,
      template: template ?? "ping",
      exam,
      env: envSummary,
    });
  } catch (err) {
    return NextResponse.json(
      {
        sent: false,
        env: envSummary,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack?.slice(0, 1500) : undefined,
      },
      { status: 500 }
    );
  }
}
