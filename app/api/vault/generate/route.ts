import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { generateWithRetry } from "@/lib/anthropic-resilient";
import { consumeVaultGenerationSlot, DAILY_VAULT_GENERATION_LIMIT } from "@/lib/ai-rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RequestBody = { topic?: unknown; subjectId?: unknown };
type Card = { front: string; back: string; hint: string };
type GeneratedVault = {
  mnemonic: { phrase: string; explanation: string };
  flashcards: Card[];
};

function extractJson(text: string): unknown {
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  return JSON.parse(clean);
}

function isGeneratedVault(value: unknown): value is GeneratedVault {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GeneratedVault>;
  return Boolean(
    candidate.mnemonic && typeof candidate.mnemonic.phrase === "string" &&
    typeof candidate.mnemonic.explanation === "string" &&
    Array.isArray(candidate.flashcards) && candidate.flashcards.length >= 5 &&
    candidate.flashcards.every((card) => card && typeof card.front === "string" && typeof card.back === "string" && typeof card.hint === "string"),
  );
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to create study material." }, { status: 401 });

  let body: RequestBody;
  try { body = await request.json() as RequestBody; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const topic = typeof body.topic === "string" ? body.topic.trim().replace(/\s+/g, " ") : "";
  const subjectId = typeof body.subjectId === "string" && body.subjectId.trim() ? body.subjectId.trim() : null;
  if (topic.length < 2 || topic.length > 160) return NextResponse.json({ error: "Enter a topic between 2 and 160 characters." }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "Study Vault is temporarily unavailable." }, { status: 503 });

  const admin = createAdminSupabase();
  const { data: profile } = await admin.from("users").select("exam_choice").eq("id", user.id).maybeSingle<{
    exam_choice: string | null;
  }>();
  const { data: exam } = await admin.from("exams").select("id, name").eq("slug", profile?.exam_choice ?? "cuet").maybeSingle<{ id: string; name: string }>();
  if (!exam) return NextResponse.json({ error: "Choose an exam before creating study material." }, { status: 400 });

  let subjectName = "General";
  if (subjectId) {
    const { data: subject } = await admin.from("subjects").select("id, name").eq("id", subjectId).eq("exam_id", exam.id).maybeSingle<{ id: string; name: string }>();
    if (!subject) return NextResponse.json({ error: "That subject is not part of your selected exam." }, { status: 400 });
    subjectName = subject.name;
  }

  // Check storage before calling the model. This prevents a failed or stale
  // Supabase schema from consuming AI credits for material that cannot be kept.
  const { error: vaultStorageError } = await admin
    .from("study_vault_items")
    .select("id", { head: true })
    .limit(1);
  if (vaultStorageError) {
    console.error("[vault/generate] storage unavailable before generation", {
      code: vaultStorageError.code,
      message: vaultStorageError.message,
    });
    return NextResponse.json({
      error: "Study Vault is temporarily unavailable. Please try again in a moment.",
    }, { status: 503 });
  }

  // Free means free: there is no plan gate. The per-day guard prevents an
  // automated account from exhausting the shared AI budget, while every
  // saved flashcard and mnemonic stays available indefinitely.
  const allowed = await consumeVaultGenerationSlot(supabase, user.id);
  if (!allowed) {
    return NextResponse.json({
      error: `You can create up to ${DAILY_VAULT_GENERATION_LIMIT} study sets per day. Your saved sets are always available to revise.`,
    }, { status: 429 });
  }

  const prompt = `You are an expert ${exam.name} tutor. Create reliable active-recall material for an Indian exam aspirant.\n\nExam: ${exam.name}\nSubject: ${subjectName}\nTopic: ${topic}\n\nReturn ONLY valid JSON, exactly this shape:\n{\n  "mnemonic": { "phrase": "short memorable phrase", "explanation": "what each part maps to and any limitation" },\n  "flashcards": [\n    { "front": "precise recall question", "back": "correct concise answer", "hint": "small retrieval cue" }\n  ]\n}\n\nRequirements:\n- Write exactly 8 flashcards: 3 foundations, 3 application/traps, 2 rapid revision.\n- Do not invent statistics, dates, official rules, or source citations. If the topic has a common exception, say it clearly.\n- Keep every front under 150 characters and every back under 280 characters.\n- Make the mnemonic useful, not decorative. If a mnemonic would be misleading, use a compact memory structure instead.`;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const generated = await generateWithRetry(anthropic, {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2600,
    messages: [{ role: "user", content: prompt }],
  });
  if (!generated.ok) return NextResponse.json({ error: generated.userMessage, kind: generated.kind }, { status: generated.httpStatus });

  let vault: GeneratedVault;
  try {
    const value = extractJson(generated.text);
    if (!isGeneratedVault(value)) throw new Error("Invalid vault structure");
    vault = value;
  } catch (error) {
    console.error("[vault/generate] invalid AI response", error);
    return NextResponse.json({ error: "Study material generation needs one more try." }, { status: 502 });
  }

  const rows = [
    { user_id: user.id, exam_id: exam.id, subject_id: subjectId, topic, item_type: "flashcard_set", content: { cards: vault.flashcards } },
    { user_id: user.id, exam_id: exam.id, subject_id: subjectId, topic, item_type: "mnemonic", content: vault.mnemonic },
  ];
  const { data: saved, error: saveError } = await admin.from("study_vault_items").insert(rows).select("id, item_type, topic, content, created_at");
  if (saveError) {
    console.error("[vault/generate] save failed", { code: saveError.code, message: saveError.message });
    return NextResponse.json({ error: "Your material was created but couldn't be saved. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ items: saved });
}
