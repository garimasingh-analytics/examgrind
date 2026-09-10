import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { currentAffairsRunAudit, loadReviewedCurrentAffairs } from "@/lib/current-affairs-migration-publisher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function indiaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminSupabase();
  const runDate = indiaToday();
  const editorialAudit = currentAffairsRunAudit(runDate);
  let publishedFromMigrations = 0;
  try {
    const reviewedBriefs = await loadReviewedCurrentAffairs();
    const { error: publishError } = await admin.from("current_affairs_briefs").upsert(reviewedBriefs, { onConflict: "slug" });
    if (publishError) throw publishError;
    const { data: savedBriefs, error: savedBriefsError } = await admin.from("current_affairs_briefs").select("id").in("slug", reviewedBriefs.map((brief) => brief.slug));
    if (savedBriefsError) throw savedBriefsError;
    const { data: exams, error: examsError } = await admin.from("exams").select("id").in("slug", ["cuet", "ssc-cgl", "uppsc-ro-aro", "up-secretariat-ro-aro"]);
    if (examsError) throw examsError;
    const tags = (savedBriefs ?? []).flatMap((brief) => (exams ?? []).map((exam) => ({ brief_id: brief.id, exam_id: exam.id })));
    if (tags.length) {
      const { error: tagsError } = await admin.from("current_affairs_exam_tags").upsert(tags, { onConflict: "brief_id,exam_id" });
      if (tagsError) throw tagsError;
    }
    publishedFromMigrations = reviewedBriefs.length;
  } catch (error) {
    console.error("[current-affairs] editorial migration publish failed", error);
    await admin.from("current_affairs_daily_runs").upsert({ run_date: runDate, status: "failed", sources_checked: 0, candidate_count: 0, published_count: 0, notes: "Reviewed editorial briefs could not be published." }, { onConflict: "run_date" });
    return NextResponse.json({ error: "Reviewed current-affairs briefs could not be published." }, { status: 500 });
  }
  const { data: sources, error: sourcesError } = await admin.from("current_affairs_sources").select("name, source_url, cadence").eq("is_active", true);
  if (sourcesError) return NextResponse.json({ error: "Could not load the source registry." }, { status: 500 });

  await admin.from("current_affairs_daily_runs").upsert({ run_date: runDate, status: "started", sources_checked: 0, candidate_count: editorialAudit?.candidateCount ?? 0, published_count: 0, notes: editorialAudit?.notes ?? null }, { onConflict: "run_date" });
  const results = await Promise.all((sources ?? []).map(async (source) => {
    try {
      const response = await fetch(source.source_url, { headers: { "user-agent": "ExamGrindCurrentAffairsDesk/1.0 (+https://www.examgrind.in)" }, signal: AbortSignal.timeout(12_000), cache: "no-store" });
      return { name: source.name, ok: response.ok, status: response.status };
    } catch {
      return { name: source.name, ok: false, status: 0 };
    }
  }));
  const available = results.filter((item) => item.ok);
  const publishedCount = await admin.from("current_affairs_briefs").select("id", { count: "exact", head: true }).eq("published_on", runDate).eq("status", "published");
  const availabilityNote = available.length === results.length
    ? "Official source desk reachable."
    : `Unavailable: ${results.filter((item) => !item.ok).map((item) => item.name).join(", ") || "none"}.`;
  const notes = editorialAudit ? `${editorialAudit.notes} ${availabilityNote}` : availabilityNote;
  const { error: updateError } = await admin.from("current_affairs_daily_runs").update({
    completed_at: new Date().toISOString(),
    status: available.length === results.length ? "completed" : "partial",
    sources_checked: results.length,
    candidate_count: editorialAudit?.candidateCount ?? available.length,
    published_count: publishedCount.count ?? 0,
    notes,
  }).eq("run_date", runDate);
  if (updateError) return NextResponse.json({ error: "Current-affairs run could not be recorded." }, { status: 500 });
  return NextResponse.json({ ok: true, runDate, sourcesChecked: results.length, sourcesReachable: available.length, publishedBriefs: publishedCount.count ?? 0, publishedFromMigrations, results });
}
