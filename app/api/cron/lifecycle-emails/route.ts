import { NextResponse, type NextRequest } from "next/server";
import { deliverDueLifecycleEmails } from "@/lib/email-lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deliverDueLifecycleEmails();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[lifecycle-emails] cron failed", error);
    return NextResponse.json({ error: "Lifecycle delivery failed." }, { status: 500 });
  }
}
