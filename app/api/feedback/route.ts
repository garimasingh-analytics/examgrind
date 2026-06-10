import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { fireAlert } from "@/lib/alert";
import { sendFeedbackAck } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/feedback
 *
 * Accepts in-app feedback from the floating widget. Persists to
 * public.feedbacks AND fires a real-time alert via fireAlert (Discord /
 * Slack webhook if ALERT_WEBHOOK_URL is set; otherwise console.error,
 * which Vercel logs surface).
 *
 * Auth is optional: signed-in users get their user_id + email attached;
 * anonymous visitors can still submit feedback (we want low friction).
 *
 * Defences:
 *   - Message length cap (5000 chars) to prevent abuse / paste-the-DB
 *   - Very light rate limit at the DB level (5/min per IP, optional
 *     follow-up — not built here; the admin client doesn't add the
 *     request IP to feedbacks yet).
 */

type Body = {
  message?: string;
  email?: string;
  sourcePath?: string;
};

const MAX_MESSAGE_LEN = 5000;

export async function POST(req: NextRequest) {
  // Auth lookup is optional — we save anonymous feedback too.
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json(
      { error: "Please type your feedback before sending." },
      { status: 400 }
    );
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LEN} characters).` },
      { status: 400 }
    );
  }

  const email = (body.email ?? user?.email ?? "").trim().slice(0, 200) || null;
  const sourcePath = (body.sourcePath ?? "").trim().slice(0, 300) || null;
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);

  const admin = createAdminSupabase();
  const { data: row, error } = await admin
    .from("feedbacks")
    .insert({
      user_id: user?.id ?? null,
      email,
      message,
      source_path: sourcePath,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[feedback] insert failed:", error);
    return NextResponse.json(
      {
        error:
          "Couldn't save your feedback right now. Please email garimakalhansh@gmail.com directly — sorry!",
      },
      { status: 500 }
    );
  }

  // Fire-and-forget alert. Never blocks the response. If no
  // ALERT_WEBHOOK_URL is set, fireAlert console.errors to Vercel
  // logs — no failure path. The DB row is the source of truth.
  void fireAlert(`New feedback from ${email ?? "anonymous"}`, {
    feedback_id: row.id,
    message: message.length > 300 ? message.slice(0, 297) + "…" : message,
    source_path: sourcePath,
    user_id: user?.id,
  });

  // Send acknowledgment to the user (no-op if SMTP not configured)
  if (email) {
    void sendFeedbackAck(email);
  }

  return NextResponse.json({ ok: true, id: row.id });
}
