import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/applications
 *
 * Body: { id: uuid, status: 'pending' | 'contacted' | 'approved' | 'rejected', reviewer_notes?: string }
 *
 * Auth: the caller's email (from their cookie session) must be in the
 * ADMIN_EMAILS allow-list. Any non-admin request gets a 403 — we don't
 * leak that the endpoint exists by returning 404.
 */

const VALID_STATUSES = new Set([
  "pending",
  "contacted",
  "approved",
  "rejected",
]);

type Body = {
  id?: string;
  status?: string;
  reviewer_notes?: string;
};

export async function PATCH(req: NextRequest) {
  // 1. Verify caller is an admin
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Validate body
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = body.id?.trim();
  const status = body.status?.trim();
  const reviewerNotes = body.reviewer_notes?.slice(0, 2000) ?? null;

  if (!id || !status || !VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "Missing or invalid id/status" },
      { status: 400 }
    );
  }

  // 3. Update — service role bypasses the no-read RLS policy
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("partner_applications")
    .update({
      status,
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    console.error("[admin/applications] update failed:", error);
    return NextResponse.json(
      { error: "Couldn't update application" },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, application: data });
}
