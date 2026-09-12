import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";

type Payload = {
  publishedOn?: unknown; title?: unknown; summary?: unknown; whyItMatters?: unknown; background?: unknown;
  sourceTitle?: unknown; sourceUrl?: unknown; sourcePublisher?: unknown; takeaways?: unknown; quickCheckQuestion?: unknown; quickCheckAnswer?: unknown; visualTitle?: unknown; visualSteps?: unknown; status?: unknown;
  examSlugs?: unknown; subjectIds?: unknown;
};

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const stringList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : [];
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const body = await request.json().catch(() => null) as Payload | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const publishedOn = text(body.publishedOn, 10);
  const title = text(body.title, 180);
  const summary = text(body.summary, 600);
  const whyItMatters = text(body.whyItMatters, 1000);
  const background = text(body.background, 2400);
  const sourceTitle = text(body.sourceTitle, 220);
  const sourceUrl = text(body.sourceUrl, 2000);
  const quickCheckQuestion = text(body.quickCheckQuestion, 280);
  const quickCheckAnswer = text(body.quickCheckAnswer, 600);
  const visualTitle = text(body.visualTitle, 120);
  const visualSteps = stringList(body.visualSteps).slice(0, 6);
  const status = body.status === "published" ? "published" : "draft";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedOn) || !title || !summary || !whyItMatters || !background || !sourceTitle || !/^https:\/\//.test(sourceUrl)) {
    return NextResponse.json({ error: "Add a date, title, full explanation and an HTTPS primary source before saving." }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const baseSlug = `${publishedOn}-${slugify(title)}`;
  const { data: existing } = await admin.from("current_affairs_briefs").select("id").eq("slug", baseSlug).maybeSingle<{ id: string }>();
  const briefPayload = {
    slug: baseSlug,
    published_on: publishedOn,
    title,
    summary,
    why_it_matters: whyItMatters,
    background,
    source_title: sourceTitle,
    source_url: sourceUrl,
    source_publisher: text(body.sourcePublisher, 120) || null,
    prelims_takeaways: stringList(body.takeaways),
    quick_check: quickCheckQuestion && quickCheckAnswer ? [{ question: quickCheckQuestion, answer: quickCheckAnswer }] : [],
    visual_data: visualTitle && visualSteps.length ? { title: visualTitle, steps: visualSteps } : {},
    status,
    reviewed_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const write = existing
    ? admin.from("current_affairs_briefs").update(briefPayload).eq("id", existing.id).select("id").single<{ id: string }>()
    : admin.from("current_affairs_briefs").insert(briefPayload).select("id").single<{ id: string }>();
  const { data: brief, error } = await write;
  if (error || !brief) return NextResponse.json({ error: "The brief could not be saved." }, { status: 500 });

  const examSlugs = stringList(body.examSlugs);
  const subjectIds = stringList(body.subjectIds);
  await Promise.all([
    admin.from("current_affairs_exam_tags").delete().eq("brief_id", brief.id),
    admin.from("current_affairs_subject_tags").delete().eq("brief_id", brief.id),
  ]);
  if (examSlugs.length) {
    const { data: exams } = await admin.from("exams").select("id, slug").in("slug", examSlugs);
    const tags = (exams ?? []).map((exam) => ({ brief_id: brief.id, exam_id: exam.id }));
    if (tags.length) await admin.from("current_affairs_exam_tags").insert(tags);
  }
  if (subjectIds.length) {
    const { data: subjects } = await admin.from("subjects").select("id").in("id", subjectIds);
    const tags = (subjects ?? []).map((subject) => ({ brief_id: brief.id, subject_id: subject.id }));
    if (tags.length) await admin.from("current_affairs_subject_tags").insert(tags);
  }
  return NextResponse.json({ ok: true, status, slug: baseSlug });
}
