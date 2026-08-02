import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SaveStudyProfileBody = {
  examSlug?: unknown;
  subjectIds?: unknown;
  targetExamDate?: unknown;
  targetScore?: unknown;
  dailyStudyMinutes?: unknown;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Saves a user's plan only after every selected subject is verified for their exam. */
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save your study plan." }, { status: 401 });
  }

  let body: SaveStudyProfileBody;
  try {
    body = await request.json() as SaveStudyProfileBody;
  } catch {
    return NextResponse.json({ error: "Invalid study-plan data." }, { status: 400 });
  }

  const examSlug = typeof body.examSlug === "string" ? body.examSlug.trim() : "";
  const rawSubjectIds = Array.isArray(body.subjectIds) ? body.subjectIds : [];
  const subjectIds = Array.from(new Set(rawSubjectIds.filter((id): id is string => typeof id === "string" && id.length > 0)));
  const targetExamDate = typeof body.targetExamDate === "string" && body.targetExamDate.trim()
    ? body.targetExamDate.trim()
    : null;
  const targetScore = typeof body.targetScore === "string" && body.targetScore.trim()
    ? body.targetScore.trim().slice(0, 60)
    : null;
  const dailyStudyMinutes = typeof body.dailyStudyMinutes === "number"
    ? body.dailyStudyMinutes
    : Number(body.dailyStudyMinutes);

  if (!examSlug || subjectIds.length === 0) {
    return NextResponse.json({ error: "Choose at least one subject." }, { status: 400 });
  }
  if (targetExamDate && !ISO_DATE.test(targetExamDate)) {
    return NextResponse.json({ error: "Use a valid exam date." }, { status: 400 });
  }
  if (!Number.isInteger(dailyStudyMinutes) || dailyStudyMinutes < 15 || dailyStudyMinutes > 840) {
    return NextResponse.json({ error: "Choose 15 minutes to 14 hours a day." }, { status: 400 });
  }

  // Service role is used only after auth.getUser verified the caller. This
  // avoids the known RLS-cookie timing problem documented in supabase/admin.
  const admin = createAdminSupabase();
  const { data: exam, error: examError } = await admin
    .from("exams")
    .select("id")
    .eq("slug", examSlug)
    .maybeSingle<{ id: string }>();
  if (examError || !exam) {
    return NextResponse.json({ error: "That exam is not available." }, { status: 400 });
  }

  const { data: validSubjects, error: subjectsError } = await admin
    .from("subjects")
    .select("id")
    .eq("exam_id", exam.id)
    .in("id", subjectIds);
  if (subjectsError || (validSubjects?.length ?? 0) !== subjectIds.length) {
    return NextResponse.json({ error: "Every selected subject must belong to this exam." }, { status: 400 });
  }

  const { error: saveError } = await admin
    .from("user_exam_preferences")
    .upsert({
      user_id: user.id,
      exam_id: exam.id,
      selected_subject_ids: subjectIds,
      target_exam_date: targetExamDate,
      target_score: targetScore,
      daily_study_minutes: dailyStudyMinutes,
      onboarding_completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,exam_id" });
  if (saveError) {
    console.error("[me/study-profile] save failed", saveError);
    return NextResponse.json({ error: "Couldn't save your study plan. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
