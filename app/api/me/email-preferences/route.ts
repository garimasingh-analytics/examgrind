import { NextResponse, type NextRequest } from "next/server";
import { syncMarketingLifecycle } from "@/lib/email-lifecycle";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage email preferences." }, { status: 401 });

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("email_preferences")
    .select("marketing_email_opt_in")
    .eq("user_id", user.id)
    .maybeSingle<{ marketing_email_opt_in: boolean }>();
  if (error) return NextResponse.json({ error: "Couldn't load email preferences." }, { status: 500 });
  return NextResponse.json({ marketingEmailOptIn: data?.marketing_email_opt_in ?? false });
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage email preferences." }, { status: 401 });

  let enabled = false;
  try {
    const body = await request.json() as { marketingEmailOptIn?: unknown };
    if (typeof body.marketingEmailOptIn !== "boolean") throw new Error("invalid preference");
    enabled = body.marketingEmailOptIn;
  } catch {
    return NextResponse.json({ error: "Send a valid email preference." }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const { data: profile, error: profileError } = await admin
    .from("users")
    .select("email, exam_choice")
    .eq("id", user.id)
    .maybeSingle<{ email: string; exam_choice: string | null }>();
  if (profileError || !profile?.email) return NextResponse.json({ error: "Couldn't load your profile." }, { status: 500 });

  const now = new Date().toISOString();
  const { error } = await admin
    .from("email_preferences")
    .upsert({
      user_id: user.id,
      marketing_email_opt_in: enabled,
      opted_in_at: enabled ? now : null,
      updated_at: now,
    }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "Couldn't save your preference." }, { status: 500 });

  try {
    await syncMarketingLifecycle({
      userId: user.id,
      email: profile.email,
      examSlug: profile.exam_choice,
      enabled,
    });
  } catch (scheduleError) {
    console.error("[email-preferences] lifecycle scheduling failed", scheduleError);
    return NextResponse.json({ error: "Preference saved, but we couldn't schedule the learning emails yet." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, marketingEmailOptIn: enabled });
}
