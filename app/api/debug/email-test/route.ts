import { NextResponse, type NextRequest } from "next/server";
import { sendEmail, sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary diagnostic endpoint to debug SMTP + welcome email.
 *
 * Usage:
 *   GET /api/debug/email-test?to=you@example.com
 *     → sends the SMTP diagnostic ping
 *   GET /api/debug/email-test?to=you@example.com&template=welcome&exam=cuet
 *     → fires the REAL welcome email (CUET / SSC / NEET) so you can preview
 *       it without going through a fresh OAuth signup that bumps a user row.
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
      { error: "Pass ?to=email@example.com (optional: &template=welcome&exam=cuet|ssc-cgl|neet-ug)" },
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
    let ok = false;
    if (template === "welcome") {
      ok = await sendWelcomeEmail(to, exam);
    } else {
      ok = await sendEmail({
        to,
        subject: "🧪 ExamGrind SMTP diagnostic test",
        html: `<p>If you received this, SMTP is working from production.</p><p>Time: ${new Date().toISOString()}</p>`,
      });
    }
    return NextResponse.json({ sent: ok, template: template ?? "ping", exam, env: envSummary });
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
