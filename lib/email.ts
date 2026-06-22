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

type ExamSlug = "cuet" | "ssc-cgl" | "neet-ug";

const EXAM_LABEL_MAP: Record<ExamSlug, string> = {
  cuet: "CUET UG",
  "ssc-cgl": "SSC CGL",
  "neet-ug": "NEET UG",
};

type ProofTrap = {
  question: string;
  wrongPick: string;
  rightPick: string;
  headline: string;
  explanation: string;
  drill: string;
};

const PROOF_TRAP: Record<ExamSlug, ProofTrap> = {
  "neet-ug": {
    question: "Q: Which statement about the lac operon is INCORRECT?",
    wrongPick: "c",
    rightPick: "d",
    headline: "71% of NEET aspirants miss this.",
    explanation:
      "<strong>Allolactose</strong> — not lactose itself — is the actual inducer. Lactose is the substrate; allolactose is its isomer that binds the repressor.",
    drill: "NCERT Class 12 Bio · Ch 6 · Gene regulation",
  },
  cuet: {
    question: "Q: The word \"ubiquitous\" most nearly means:",
    wrongPick: "a",
    rightPick: "b",
    headline: "Half of CUET English takers pick (a). It's a root-trap.",
    explanation:
      "<strong>Ubiquitous = present everywhere</strong> (Latin <em>ubique</em> = everywhere). The trap is \"unique\" which sounds similar but means rare — exact opposite meaning. Root awareness is the single highest-leverage vocab skill for CUET English.",
    drill: "CUET English Language · Vocabulary builders",
  },
  "ssc-cgl": {
    question: "Q: If x + 1/x = 3, find the value of x⁴ + 1/x⁴.",
    wrongPick: "a",
    rightPick: "b",
    headline: "This trap appears in 4 SSC papers since 2018.",
    explanation:
      "<strong>Two squarings needed.</strong> (x + 1/x)² = 9 → x² + 1/x² = 7. Then square again: 49 → x⁴ + 1/x⁴ = 47. Most students stop after one squaring and pick 27.",
    drill: "SSC CGL Algebra · Square-cube identities",
  },
};

function proofBlockHtml(slug: ExamSlug): string {
  const p = PROOF_TRAP[slug];
  return `
        <div style="background:#FFFFFF;border:1px solid rgba(44,24,16,0.08);border-radius:18px;padding:22px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#FF6B6B;margin-bottom:10px;">
            ↓ Here's what you'll see when you get one wrong
          </div>
          <div style="font-size:14px;font-weight:600;color:#2C1810;margin-bottom:12px;line-height:1.4;">
            ${p.question}
          </div>
          <div style="background:#FFE8E1;border-left:3px solid #FF6B6B;padding:14px 16px;border-radius:6px;font-size:13px;line-height:1.6;color:#2C1810;">
            <div style="font-weight:700;color:#C74A3A;margin-bottom:6px;">✕ You picked (${p.wrongPick}). Real answer: (${p.rightPick}).</div>
            <div style="color:#2C1810;">${p.headline} ${p.explanation}</div>
            <div style="margin-top:8px;font-size:12px;color:#7A6A5C;">📚 Drill: ${p.drill}</div>
          </div>
        </div>`;
}

/** Welcome email after first signup — bespoke marketing-grade HTML. */
export async function sendWelcomeEmail(to: string, examSlug?: string) {
  const slug: ExamSlug =
    examSlug === "cuet" || examSlug === "ssc-cgl" || examSlug === "neet-ug"
      ? examSlug
      : "neet-ug";
  const exam = EXAM_LABEL_MAP[slug];
  const proofHtml = proofBlockHtml(slug);
  return sendEmail({
    to,
    subject: `Welcome to ExamGrind 🐥 — your ${exam} AI coach is ready`,
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome to ExamGrind</title>
</head>
<body style="margin:0;padding:0;background:#F7EFE6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#2C1810;-webkit-font-smoothing:antialiased;">
  <!-- preheader (shows as preview in inbox) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F7EFE6;">Your AI coach for ${exam} just woke up. 3 free quizzes + 1 mock + 1 Deep Analysis are ready. No card, no catch.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7EFE6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFCF7;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px rgba(255,107,107,0.10);">

          <!-- HERO -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B6B 0%,#FD7C29 60%,#FFB84D 100%);padding:40px 32px 36px;text-align:center;">
              <div style="font-size:64px;line-height:1;margin-bottom:8px;">🐥</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:700;color:#FFFCF7;letter-spacing:-0.5px;line-height:1.15;">
                You're in.
              </div>
              <div style="font-size:16px;color:rgba(255,252,247,0.92);margin-top:10px;font-weight:500;">
                Your ${exam} AI coach just woke up.
              </div>
            </td>
          </tr>

          <!-- INTRO -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 14px;font-size:17px;line-height:1.55;color:#2C1810;">
                Hey 👋
              </p>
              <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#2C1810;">
                Most quiz apps tell you "wrong answer" and move on. <strong style="color:#FF6B6B;">ExamGrind is different.</strong> Every wrong answer comes with a concept-level diagnosis — the actual gap in your understanding — and exactly which NCERT chapter / R.S. Aggarwal section to revise.
              </p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#2C1810;">
                It's a coach, not a marker.
              </p>
            </td>
          </tr>

          <!-- VISUAL PROOF — exam-specific trap -->
          <tr>
            <td style="padding:28px 32px 4px;">
              ${proofHtml}
            </td>
          </tr>

          <!-- FREE BENEFITS GRID -->
          <tr>
            <td style="padding:28px 32px 8px;">
              <div style="text-align:center;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#7A6A5C;margin-bottom:14px;">
                What's free in your account right now
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" align="center" style="padding:4px;">
                    <div style="background:#FFF4EB;border-radius:14px;padding:18px 10px;">
                      <div style="font-size:28px;line-height:1;margin-bottom:6px;">🎯</div>
                      <div style="font-size:22px;font-weight:800;color:#FF6B6B;line-height:1;">3</div>
                      <div style="font-size:11px;color:#7A6A5C;margin-top:4px;line-height:1.3;">Concept<br/>quizzes</div>
                    </div>
                  </td>
                  <td width="33%" align="center" style="padding:4px;">
                    <div style="background:#FFF4EB;border-radius:14px;padding:18px 10px;">
                      <div style="font-size:28px;line-height:1;margin-bottom:6px;">📝</div>
                      <div style="font-size:22px;font-weight:800;color:#FF6B6B;line-height:1;">1</div>
                      <div style="font-size:11px;color:#7A6A5C;margin-top:4px;line-height:1.3;">Full-length<br/>mock test</div>
                    </div>
                  </td>
                  <td width="33%" align="center" style="padding:4px;">
                    <div style="background:#FFF4EB;border-radius:14px;padding:18px 10px;">
                      <div style="font-size:28px;line-height:1;margin-bottom:6px;">🔍</div>
                      <div style="font-size:22px;font-weight:800;color:#FF6B6B;line-height:1;">1</div>
                      <div style="font-size:11px;color:#7A6A5C;margin-top:4px;line-height:1.3;">Deep<br/>Analysis</div>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="text-align:center;font-size:12px;color:#7A6A5C;margin-top:10px;">No card. No catch. ₹199/month after you outgrow the free tier.</div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:28px 32px 12px;">
              <a href="https://examgrind.in/home" style="display:inline-block;background:#2C1810;color:#FFFCF7;font-size:16px;font-weight:700;padding:16px 38px;border-radius:14px;text-decoration:none;letter-spacing:0.2px;box-shadow:0 4px 0 rgba(0,0,0,0.10);">
                Take your first quiz →
              </a>
            </td>
          </tr>

          <!-- Secondary CTA -->
          <tr>
            <td align="center" style="padding:0 32px 32px;">
              <a href="https://examgrind.in/diagnose" style="font-size:14px;color:#FF6B6B;font-weight:600;text-decoration:none;border-bottom:1px dashed rgba(255,107,107,0.4);padding-bottom:1px;">
                ⚡ Or take the 60-sec weakness diagnosis →
              </a>
            </td>
          </tr>

          <!-- FOUNDER NOTE -->
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="background:#F7EFE6;border-radius:14px;padding:18px 20px;font-size:14px;line-height:1.55;color:#2C1810;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#7A6A5C;margin-bottom:6px;">
                  From the founder
                </div>
                I'm 24. I watched people around me grind through NEET, CUET, and SSC and saw how broken Indian test prep is — ₹50K coaching fees for the same rote drills, no real diagnosis of what's actually weak. So I built ExamGrind. If anything here breaks, just reply to this email — I read every single one.
                <div style="margin-top:10px;font-style:italic;color:#7A6A5C;">— Garima, founder</div>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#F7EFE6;padding:24px 32px;text-align:center;font-size:12px;color:#7A6A5C;line-height:1.6;">
              <a href="https://examgrind.in" style="color:#FF6B6B;text-decoration:none;font-weight:700;">examgrind.in</a> ·
              <a href="https://examgrind.in/terms" style="color:#7A6A5C;text-decoration:none;">Terms</a> ·
              <a href="https://examgrind.in/privacy" style="color:#7A6A5C;text-decoration:none;">Privacy</a> ·
              <a href="https://examgrind.in/refund" style="color:#7A6A5C;text-decoration:none;">Refund</a>
              <div style="margin-top:10px;font-size:11px;color:#9A8C7C;">
                Mobizone Technologies Private Limited
              </div>
              <div style="margin-top:8px;font-size:11px;color:#9A8C7C;">© 2026 ExamGrind · Made in India 🇮🇳</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
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
