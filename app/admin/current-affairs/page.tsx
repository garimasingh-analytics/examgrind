import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";
import CurrentAffairsEditor from "./CurrentAffairsEditor";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsAdminPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  if (!isAdminEmail(user.email)) redirect("/home");
  const admin = createAdminSupabase();
  const [{ data: exams }, { data: subjectRows }] = await Promise.all([
    admin.from("exams").select("id, slug, name").eq("status", "live").order("display_order"),
    admin.from("subjects").select("id, name, exam_id, exams!inner(name)").eq("is_active", true).order("order_index"),
  ]);
  type SubjectRow = { id: string; name: string; exams: { name: string } | { name: string }[] | null };
  const subjects = ((subjectRows ?? []) as unknown as SubjectRow[]).map((subject) => ({ id: subject.id, name: subject.name, examName: Array.isArray(subject.exams) ? subject.exams[0]?.name ?? "Exam" : subject.exams?.name ?? "Exam" }));
  return <main className="min-h-[100svh] bg-warm-wash px-5 py-8 text-cocoa-900 sm:px-8"><header className="mx-auto flex max-w-4xl items-center justify-between"><Link href="/admin" className="text-sm font-bold text-ember-700">← Admin</Link><Link href="/current-affairs" className="text-sm font-bold text-cocoa-700">View public hub →</Link></header><section className="mx-auto mt-8 max-w-4xl"><CurrentAffairsEditor exams={(exams ?? []).map((exam) => ({ slug: exam.slug, name: exam.name }))} subjects={subjects} /></section></main>;
}
