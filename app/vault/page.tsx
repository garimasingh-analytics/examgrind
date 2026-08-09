import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import AdSlot from "@/components/AdSlot";
import VaultStudio from "./VaultStudio";

export const dynamic = "force-dynamic";

type VaultItem = { id: string; item_type: "flashcard_set" | "mnemonic"; topic: string; content: Record<string, unknown>; created_at: string };

export default async function VaultPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("users").select("exam_choice, subscription_status").eq("id", user.id).maybeSingle<{ exam_choice: string | null; subscription_status: "free" | "trial" | "paid" }>();
  const { data: exam } = await supabase.from("exams").select("id, name").eq("slug", profile?.exam_choice ?? "cuet").maybeSingle<{ id: string; name: string }>();
  const [{ data: subjects }, { data: items }] = exam?.id ? await Promise.all([
    supabase.from("subjects").select("id, name").eq("exam_id", exam.id).order("order_index"),
    supabase.from("study_vault_items").select("id, item_type, topic, content, created_at").eq("exam_id", exam.id).order("created_at", { ascending: false }).limit(50),
  ]) : [{ data: [] }, { data: [] }];
  return <main className="min-h-[100svh] bg-warm-wash pb-20"><header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><Link href="/home" className="font-serif text-lg font-bold text-cocoa-900">ExamGrind</Link><Link href="/home" className="text-sm font-bold text-ember-700">Home →</Link></header><section className="mx-auto max-w-5xl px-5"><VaultStudio subjects={(subjects ?? []) as { id: string; name: string }[]} initialItems={(items ?? []) as VaultItem[]} /></section>{profile?.subscription_status !== "paid" && <AdSlot className="mt-8" />}</main>;
}
