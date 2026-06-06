import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/mock/quit
 * Body: { attemptId: string }
 *
 * User pressed Quit during a mock. Strict mode: this burns the attempt
 * — status flips to 'abandoned', they can't resume, and the free-mock
 * counter stays bumped (it was bumped at start, not submit).
 *
 * Idempotent. Trying to quit an already-submitted or already-abandoned
 * attempt returns ok=true with no DB write.
 */
export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { attemptId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const attemptId = body.attemptId;
  if (!attemptId || typeof attemptId !== "string") {
    return NextResponse.json({ error: "Missing attemptId." }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data: attempt } = await admin
    .from("mock_attempts")
    .select("id, user_id, status")
    .eq("id", attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }

  if (attempt.status !== "in_progress") {
    return NextResponse.json({ ok: true, alreadyEnded: true });
  }

  const { error: updErr } = await admin
    .from("mock_attempts")
    .update({
      status: "abandoned",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", attempt.id);

  if (updErr) {
    console.error("[mock/quit] update failed", updErr);
    return NextResponse.json({ error: "Couldn't end the attempt." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
