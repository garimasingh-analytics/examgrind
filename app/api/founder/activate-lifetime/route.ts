import { NextResponse } from "next/server";
import { FOUNDER_PAID_UNTIL, isFounderAccessEmail } from "@/lib/founder-access";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Gives the currently signed-in founder the app's normal permanent paid
 * entitlement. The route never accepts an email or user id from the client,
 * so it cannot be used to change somebody else's access.
 */
export async function POST() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to activate founder access." }, { status: 401 });
  }

  if (!isFounderAccessEmail(user.email)) {
    return NextResponse.json(
      { error: "This signed-in account is not authorised for founder access." },
      { status: 403 }
    );
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("users")
    .update({
      subscription_status: "paid",
      paid_until: FOUNDER_PAID_UNTIL,
    })
    .eq("id", user.id)
    .select("subscription_status, paid_until")
    .maybeSingle();

  if (error || !data) {
    console.error("[founder/activate-lifetime] entitlement update failed", error);
    return NextResponse.json(
      { error: "We couldn't activate founder access right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    subscriptionStatus: data.subscription_status,
    paidUntil: data.paid_until,
  });
}
