/**
 * Transactional email via Hostinger SMTP.
 *
 * Reads SMTP credentials from env vars (set in Vercel):
 *   SMTP_HOST           default smtp.hostinger.com
 *   SMTP_PORT           default 465 (SSL) — use 587 for TLS
 *   SMTP_USER           full email, e.g. info@examgrind.in
 *   SMTP_PASS           the Hostinger email account password
 *   EMAIL_FROM          display address, default "ExamGrind <info@examgrind.in>"
 *
 * If SMTP_USER or SMTP_PASS are unset, sendEmail() is a NO-OP and logs a
 * warning. This is intentional so the app keeps building/deploying even
 * before the SMTP password is wired up.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = port === 465;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return transporter;
}

export type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/** Send a transactional email. Returns true on success, false on no-op or error. */
export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP not configured (SMTP_USER/SMTP_PASS missing). Skipping send.");
    return false;
  }
  const from = process.env.EMAIL_FROM ?? "ExamGrind <info@examgrind.in>";
  try {
    await t.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? stripHtml(opts.html),
      replyTo: opts.replyTo ?? "info@examgrind.in",
    });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// ============================================================
// Template helpers — each returns { subject, html } pre-built.
// ============================================================

const BRAND_HEADER = `
  <div style="background:linear-gradient(135deg,#FF6B6B,#FFB84D);padding:24px;text-align:center;border-radius:8px 8px 0 0;">
    <div style="font-size:28px;font-weight:800;color:white;letter-spacing:-0.5px;">ExamGrind 🐥</div>
    <div style="color:rgba(255,255,255,0.92);font-size:13px;margin-top:4px;">AI-graded practice for CUET · NEET UG · SSC CGL</div>
  </div>`;

const BRAND_FOOTER = `
  <div style="background:#F8F8F8;padding:20px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#888;">
    Questions? Reply to this email — we read every one.<br/>
    <a href="https://examgrind.in" style="color:#FF6B6B;text-decoration:none;font-weight:600;">examgrind.in</a>
  </div>`;

function wrap(bodyHtml: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;background:white;border:1px solid #EEE;border-radius:8px;">
    ${BRAND_HEADER}
    <div style="padding:32px 24px;color:#222;line-height:1.6;font-size:15px;">
      ${bodyHtml}
    </div>
    ${BRAND_FOOTER}
  </div>`;
}

/** Welcome email after first signup. */
export async function sendWelcomeEmail(to: string, examName?: string) {
  const exam = examName ?? "your exam";
  return sendEmail({
    to,
    subject: "Welcome to ExamGrind 🐥 — your AI tutor is ready",
    html: wrap(`
      <h2 style="margin:0 0 16px;color:#FF6B6B;">You're in.</h2>
      <p>Hi there,</p>
      <p>Welcome to ExamGrind. You're about to practice for ${exam} with an AI tutor that doesn't just say <em>"wrong answer"</em> — it diagnoses exactly which concept tripped you up and shows you the fix.</p>
      <p><strong>You have 3 free quizzes, 1 free mock test, and 1 free Deep Analysis</strong> waiting. No card needed.</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="https://examgrind.in/home" style="background:#FF6B6B;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Start a quiz →</a>
      </p>
      <p style="color:#888;font-size:13px;">— The ExamGrind team</p>
    `),
  });
}

/** Payment receipt — automated, sent after Razorpay subscription.activated or .charged. */
export async function sendPaymentConfirmation(
  to: string,
  amount: number,
  periodEndsAt: string,
  txnRef?: string
) {
  const txnLine = txnRef
    ? `<tr><td style="padding:12px 16px;color:#666;border-top:1px solid #FFE;">Transaction ID</td><td style="padding:12px 16px;text-align:right;font-family:monospace;font-size:13px;border-top:1px solid #FFE;">${txnRef}</td></tr>`
    : "";
  return sendEmail({
    to,
    subject: `Receipt — ExamGrind Premium ₹${amount}`,
    html: wrap(`
      <h2 style="margin:0 0 8px;color:#FF6B6B;">Payment received 👑</h2>
      <p style="color:#888;font-size:13px;margin:0 0 20px;">Your ExamGrind Premium subscription is active.</p>

      <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#FFF8E8;border-radius:6px;">
        <tr><td style="padding:12px 16px;color:#666;">Plan</td><td style="padding:12px 16px;text-align:right;font-weight:600;">ExamGrind Premium · monthly</td></tr>
        <tr><td style="padding:12px 16px;color:#666;border-top:1px solid #FFE;">Amount</td><td style="padding:12px 16px;text-align:right;font-weight:600;border-top:1px solid #FFE;">₹${amount} (incl. GST)</td></tr>
        <tr><td style="padding:12px 16px;color:#666;border-top:1px solid #FFE;">Next renewal</td><td style="padding:12px 16px;text-align:right;font-weight:600;border-top:1px solid #FFE;">${periodEndsAt}</td></tr>
        ${txnLine}
      </table>

      <p style="font-size:14px;color:#444;margin:0 0 20px;">
        Unlimited quizzes, mocks, and Deep Analyses are now unlocked.
      </p>
      <p style="text-align:center;margin:0 0 28px;">
        <a href="https://examgrind.in/home" style="background:#FF6B6B;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Back to practice →</a>
      </p>

      <hr style="border:none;border-top:1px solid #EEE;margin:24px 0;" />
      <p style="color:#888;font-size:12px;line-height:1.5;margin:0;">
        <strong>This is an automated receipt — please do not reply to this email.</strong><br/>
        For questions, contact <a href="mailto:info@examgrind.in" style="color:#FF6B6B;">info@examgrind.in</a>.
        Cancel anytime at <a href="https://examgrind.in/me" style="color:#FF6B6B;">examgrind.in/me</a>.<br/><br/>
        Sold by Mobizone Technologies Private Limited<br/>
        Registered office: A2/544A 3rd Floor, Shiv Arcade, Acharya Niketan, Mayur Vihar Phase-1, Delhi-110091<br/>
        GSTIN: 09AAICM6882B1Z8
      </p>
    `),
  });
}

/** Acknowledgment when a user submits feedback. */
export async function sendFeedbackAck(to: string) {
  return sendEmail({
    to,
    subject: "Got your feedback — we're on it 🐥",
    html: wrap(`
      <p>Thanks for the feedback.</p>
      <p>One of the cool things about being a tiny team is we read every single message. If your note needs a reply, you'll hear back within 24 hours.</p>
      <p>Keep cooking 🔥</p>
      <p style="color:#888;font-size:13px;">— ExamGrind team</p>
    `),
  });
}
