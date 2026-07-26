import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { sendAdminSMS } from "@/lib/sms";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Founder-only Fast2SMS diagnostic.
 *
 * It deliberately sends only to SMS_ADMIN_PHONE (never an arbitrary request
 * parameter), so this cannot become an SMS relay if the URL is discovered.
 */
export async function POST() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const sent = await sendAdminSMS(
    `ExamGrind SMS test OK — ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );

  return NextResponse.json({ sent });
}
