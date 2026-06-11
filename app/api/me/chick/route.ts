import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isChickUnlocked, asChickVariant, type ChickVariant } from "@/lib/chicks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/me/chick — Updates the user's selected_chick column.
 * Server enforces unlock; rejects with 403 if not yet earned.
 */
export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save your chick." }, { status: 401 });
  }

  let body: { variant?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const variant: ChickVariant = asChickVariant(body.variant);

  const admin = createAdminSupabase();
  const { data: row, error } = await admin
    .from("users")
    .select("xp, subscription_status, paid_until")
    .eq("id", user.id)
    .single();
  if (error || !row) {
    return NextResponse.json({ error: "Couldn't load your profile." }, { status: 500 });
  }

  const xp = (row as { xp: number | null }).xp ?? 0;
  const paid = (row as { subscription_status?: string | null }).subscription_status === "paid";

  if (!isChickUnlocked(variant, xp, paid)) {
    return NextResponse.json(
      { error: "This chick isn't unlocked yet — keep grinding 🐥" },
      { status: 403 }
    );
  }

  const { error: updateErr } = await admin
    .from("users")
    .update({ selected_chick: variant })
    .eq("id", user.id);

  if (updateErr) {
    console.error("[me/chick] update failed", updateErr);
    return NextResponse.json({ error: "Couldn't save." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, variant });
}
