import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { fireAlert } from "@/lib/alert";

/**
 * POST /api/waitlist
 *
 * Body: { email: string, exam_slug: string }
 *
 * Inserts into waitlist_signups. Idempotent by (email, exam_slug) so a
 * user spamming the button doesn't pollute the table. RLS is OFF for
 * inserts on this table — public form, anyone can sign up. Reads are
 * locked down to service role only.
 *
 * We accept slugs of the form "suggest:<free text>" when the user
 * picked the "Suggest an exam" card. Validation just caps length.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, exam_slug } = (body ?? {}) as {
    email?: string;
    exam_slug?: string;
  };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Email is required and must be valid." },
      { status: 400 }
    );
  }
  if (!exam_slug || typeof exam_slug !== "string") {
    return NextResponse.json(
      { error: "exam_slug is required." },
      { status: 400 }
    );
  }

  // Defensive caps — protects the DB column and gives a friendlier
  // error than Supabase's raw constraint violation
  const cleanEmail = email.trim().toLowerCase().slice(0, 255);
  const cleanSlug = exam_slug.trim().slice(0, 100);

  const supabase = createServerSupabase();

  // Upsert on (email, exam_slug) so users can spam the button safely.
  // The unique constraint in migration_006 enforces dedupe at the DB.
  const { error } = await supabase
    .from("waitlist_signups")
    .upsert(
      { email: cleanEmail, exam_slug: cleanSlug },
      { onConflict: "email,exam_slug", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[waitlist] insert failed", { error, cleanEmail, cleanSlug });
    return NextResponse.json(
      { error: "Could not save signup. Try again in a moment." },
      { status: 500 }
    );
  }

  // Real-time ping so we know interest is coming in. Best-effort —
  // never blocks the response. The dedupe-on-upsert may fire this for
  // duplicates too, but that's fine; we'd rather over-notify on day 1.
  void fireAlert(`New waitlist signup for ${cleanSlug}`, {
    email: cleanEmail,
    exam_slug: cleanSlug,
    admin_url: "/admin",
  });

  return NextResponse.json({ ok: true });
}
