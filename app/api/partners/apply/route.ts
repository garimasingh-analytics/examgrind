import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { fireAlert } from "@/lib/alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public partner-program application endpoint.
 *
 * Coaching centres submit the form on /partners; this writes a row to
 * partner_applications with status='pending'. We do the standard four
 * things every public form endpoint should do:
 *   1) Validate required fields server-side (don't trust the client).
 *   2) Normalise / cap inputs so a spammer can't blow up the DB.
 *   3) Insert via the anon Supabase client (RLS allows this).
 *   4) Return a friendly success / error response — never echo what the
 *      DB said verbatim, which can leak schema details.
 */

const MAX_FIELD = 500;
const MAX_NOTES = 2000;

type ApplyBody = {
  centreName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  city?: string;
  studentCount?: string;
  examsTaught?: string;
  notes?: string;
  utmSource?: string;
};

function clamp(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, max);
}

function isValidEmail(s: string): boolean {
  // Permissive but rejects obviously-broken values.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidPhone(s: string): boolean {
  // Indian-friendly: allow +, digits, spaces, hyphens. Need ≥ 10 digits.
  const digits = s.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(req: NextRequest) {
  let body: ApplyBody;
  try {
    body = (await req.json()) as ApplyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const centreName = clamp(body.centreName, MAX_FIELD);
  const contactName = clamp(body.contactName, MAX_FIELD);
  const contactEmail = clamp(body.contactEmail, MAX_FIELD);
  const contactPhone = clamp(body.contactPhone, MAX_FIELD);
  const city = clamp(body.city, MAX_FIELD);
  const studentCount = clamp(body.studentCount, MAX_FIELD);
  const examsTaught = clamp(body.examsTaught, MAX_FIELD);
  const notes = clamp(body.notes, MAX_NOTES);
  const utmSource = clamp(body.utmSource, MAX_FIELD);

  if (!centreName) {
    return NextResponse.json(
      { error: "Please tell us your coaching centre's name." },
      { status: 400 }
    );
  }
  if (!contactName) {
    return NextResponse.json(
      { error: "Please share your name." },
      { status: 400 }
    );
  }
  if (!contactEmail || !isValidEmail(contactEmail)) {
    return NextResponse.json(
      { error: "That email looks off. Mind double-checking?" },
      { status: 400 }
    );
  }
  if (!contactPhone || !isValidPhone(contactPhone)) {
    return NextResponse.json(
      { error: "Please share a phone number we can WhatsApp." },
      { status: 400 }
    );
  }
  if (!city) {
    return NextResponse.json(
      { error: "Which city is your centre in?" },
      { status: 400 }
    );
  }

  // Best-effort IP capture for spam triage. Vercel sets x-forwarded-for.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const supabase = createServerSupabase();
  const { error } = await supabase.from("partner_applications").insert({
    centre_name: centreName,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    city,
    student_count: studentCount || null,
    exams_taught: examsTaught || null,
    notes: notes || null,
    utm_source: utmSource || null,
    ip_address: ip,
  });

  if (error) {
    console.error("[partners/apply] insert failed:", error);
    return NextResponse.json(
      { error: "Couldn't submit your application. Please try again." },
      { status: 500 }
    );
  }

  // Real-time ping so the founder knows about coaching-centre interest
  // immediately, not when they happen to check /admin. Best-effort — a
  // failed webhook never blocks the response to the applicant.
  void fireAlert(`New partner application from ${centreName} (${city})`, {
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    student_count: studentCount || "(not provided)",
    exams_taught: examsTaught || "(not provided)",
    admin_url: "/admin",
  });

  return NextResponse.json({ ok: true });
}
