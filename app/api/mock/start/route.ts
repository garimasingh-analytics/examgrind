import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { checkFreemium, paywallError } from "@/lib/freemium";
import { generateMockQuestions, type MockSection } from "@/lib/anthropic-mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/mock/start
 * Body: { mockTestId: string }
 *
 * Creates a mock_attempts row, generates the full question set in
 * parallel batches via Claude, persists mock_attempt_questions, and
 * bumps users.mock_tests_started for the freemium gate.
 *
 * Returns: { attemptId: string }
 *
 * The user is then redirected to /mock/take/[attemptId] which renders
 * the strict timed UI. Re-entering /mock/take/[attemptId] later is a
 * no-op because mock_attempts.status is still 'in_progress'.
 */
export async function POST(req: NextRequest) {
  // ---- 1. Auth ----
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // ---- 2. Body ----
  let body: { mockTestId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const mockTestId = body.mockTestId;
  if (!mockTestId || typeof mockTestId !== "string") {
    return NextResponse.json({ error: "Missing mockTestId." }, { status: 400 });
  }

  // ---- 3. Freemium gate ----
  const decision = await checkFreemium(supabase, user.id, "mock");
  if (!decision.allowed) {
    return NextResponse.json(paywallError(decision), { status: 402 });
  }

  // ---- 4. Load the mock catalog row + exam slug ----
  const { data: mockRow, error: mockErr } = await supabase
    .from("mock_tests")
    .select(
      "id, slug, display_name, duration_seconds, total_questions, sections, exam:exams(slug, name), is_active"
    )
    .eq("id", mockTestId)
    .maybeSingle();

  if (mockErr || !mockRow) {
    return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
  }

  type MockRow = {
    id: string;
    slug: string;
    display_name: string;
    duration_seconds: number;
    total_questions: number;
    sections: MockSection[];
    exam: { slug: string; name: string } | null;
    is_active: boolean;
  };
  const mock = mockRow as unknown as MockRow;

  if (!mock.is_active) {
    return NextResponse.json(
      { error: "This mock test is no longer active." },
      { status: 410 }
    );
  }

  // ---- 5. Don't create a second in-progress attempt for the same mock ----
  const admin = createAdminSupabase();
  const { data: existing } = await admin
    .from("mock_attempts")
    .select("id, status, started_at")
    .eq("user_id", user.id)
    .eq("mock_test_id", mock.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    // Resume rather than duplicate. The freemium counter stays at its
    // current value (we never double-bumped).
    return NextResponse.json({ attemptId: existing.id, resumed: true });
  }

  // ---- 6. Generate questions ----
  const gen = await generateMockQuestions({
    examSlug: mock.exam?.slug ?? "cuet",
    examName: mock.exam?.name ?? "CUET UG",
    sections: mock.sections,
  });
  if (!gen.ok) {
    return NextResponse.json({ error: gen.error }, { status: 502 });
  }

  // ---- 7. Persist attempt + question rows ----
  const { data: attemptRow, error: attemptErr } = await admin
    .from("mock_attempts")
    .insert({
      user_id: user.id,
      mock_test_id: mock.id,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (attemptErr || !attemptRow) {
    console.error("[mock/start] attempt insert failed", attemptErr);
    return NextResponse.json(
      { error: "Couldn't create the attempt. Please try again." },
      { status: 500 }
    );
  }

  const qRows = gen.questions.map((q) => ({
    attempt_id: attemptRow.id,
    section_name: q.section_name,
    question_index: q.question_index,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_answer: q.correct_answer,
    explanation: q.explanation ?? null,
  }));

  const { error: qErr } = await admin
    .from("mock_attempt_questions")
    .insert(qRows);

  if (qErr) {
    console.error("[mock/start] questions insert failed", qErr);
    // Best-effort cleanup so we don't leave a broken attempt around.
    await admin.from("mock_attempts").delete().eq("id", attemptRow.id);
    return NextResponse.json(
      { error: "Couldn't save the questions. Please try again." },
      { status: 500 }
    );
  }

  // ---- 8. Bump the freemium counter ----
  if (!decision.isPaid) {
    await admin
      .from("users")
      .update({ mock_tests_started: decision.used + 1 })
      .eq("id", user.id);
  }

  return NextResponse.json({ attemptId: attemptRow.id });
}
