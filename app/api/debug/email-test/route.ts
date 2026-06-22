import { NextResponse, type NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary diagnostic endpoint to debug SMTP delivery.
 *
 * Usage: GET /api/debug/email-test?to=your@email.com
 *
 * Awaits the send synchronously and returns a JSON report of exactly what
 * the SMTP transport said. Use this to isolate fire-and-forget log-loss
 * issues from real send failures.
 *
 * REMOVE THIS FILE once welcome email is verified working end-to-end.
 */
export async function GET(req: NextRequest) {
  const to = new URL(req.url).searchParams.get("to");
  if (!to) {
    return NextResponse.json(
      { error: "Pass ?to=email@example.com" },
      { status: 400 }
    );
  }

  const envSummary = {
    SMTP_USER_set: !!process.env.SMTP_USER,
    SMTP_PASS_set: !!process.env.SMTP_PASS,
    SMTP_PASS_length: process.env.SMTP_PASS?.length ?? 0,
    SMTP_HOST: process.env.SMTP_HOST ?? "smtp.hostinger.com (default)",
    SMTP_PORT: process.env.SMTP_PORT ?? "465 (default)",
    EMAIL_FROM: process.env.EMAIL_FROM ?? "ExamGrind <info@examgrind.in> (default)",
  };

  try {
    const ok = await sendEmail({
      to,
      subject: "🧪 ExamGrind SMTP diagnostic test",
      html: `<p>If you received this, SMTP is working from production.</p><p>Time: ${new Date().toISOString()}</p>`,
    });
    return NextResponse.json({ sent: ok, env: envSummary });
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
