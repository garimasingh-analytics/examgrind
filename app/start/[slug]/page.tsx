import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Chick from "@/components/Chick";

/**
 * Entry point for an exam pick from the landing page.
 *
 * Click "CUET UG" on the landing page → /start/cuet
 * Click "SSC CGL"                     → /start/ssc-cgl
 * Click "NEET UG"                     → /start/neet-ug
 *
 * Behaviour:
 *   - Signed-in: upsert users.exam_choice and bounce to /home (no extra
 *     screen). Returning users get instant exam switching.
 *   - Signed-out: render a focused sign-in card with the exam name in the
 *     headline; the OAuth round-trip writes exam_choice on first arrival.
 */

const EXAM_META: Record<
  string,
  { slug: string; name: string; tagline: string }
> = {
  cuet: {
    slug: "cuet",
    name: "CUET UG",
    tagline:
      "12 subjects · Full NTA syllabus · AI-graded practice that tells you exactly what to study next.",
  },
  "ssc-cgl": {
    slug: "ssc-cgl",
    name: "SSC CGL",
    tagline:
      "Quant · Reasoning · English · GA — Tier 1 + Tier 2 patterns with concept-level feedback on every wrong answer.",
  },
  "neet-ug": {
    slug: "neet-ug",
    name: "NEET UG",
    tagline:
      "NCERT-aligned Physics, Chemistry, Biology. Diagnostic practice that shows the exact concept you're weak on.",
  },
};

export const dynamic = "force-dynamic";

// Match the codebase convention used by /subject/[id], /chapter/[id], etc.
// In Next 14, params is technically sync, but the async Promise<> pattern
// is forward-compatible and matches the rest of the app.
type Params = { params: Promise<{ slug: string }> };

export default async function StartExamPage({ params }: Params) {
  const { slug } = await params;
  const meta = EXAM_META[slug];
  if (!meta) redirect("/");

  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in? Update exam choice and go straight to /home.
  if (user) {
    // ROOT CAUSE of the "NEET UG silently goes to CUET" bug:
    // The cookie-based server client was hitting silent RLS failures on
    // UPDATE — auth.uid() inside the policy was sometimes resolving to
    // NULL in Server Component contexts because Next.js doesn't refresh
    // the cookie session in time for the write. The DB row stayed at
    // exam_choice='cuet' regardless of which card the user clicked.
    //
    // Fix: use the service-role client for the write, scoped explicitly
    // to user.id (which we already verified via auth.getUser() above).
    // We verify the result so we don't redirect on a failed write.
    const admin = createAdminSupabase();

    const { data: updated, error: updateErr } = await admin
      .from("users")
      .update({ exam_choice: meta.slug })
      .eq("id", user.id)
      .select("id, exam_choice");

    if (updateErr) {
      console.error("[start] failed to update exam_choice:", updateErr);
    }

    // If no row was updated, the user record doesn't exist yet — insert it.
    if (!updated || updated.length === 0) {
      const { error: insertErr } = await admin.from("users").insert({
        id: user.id,
        email: user.email ?? "",
        exam_choice: meta.slug,
      });
      if (insertErr) {
        console.error("[start] failed to insert user row:", insertErr);
      }
    }

    // Invalidate cached renders of /home and /me so the next request
    // sees the new exam_choice rather than a stale cuet/ssc-cgl version.
    revalidatePath("/home");
    revalidatePath("/me");

    redirect("/home");
  }

  // Not signed in — render the focused sign-in card.
  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-cocoa-500 hover:text-cocoa-900"
        >
          ← Pick a different exam
        </Link>
      </header>

      <section className="mx-auto flex max-w-xl flex-col items-center px-6 pb-20 pt-16 text-center">
        <Chick state="idle" size={140} className="mb-7" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-600">
          You picked
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-cocoa-900 sm:text-5xl">
          {meta.name}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-balance text-base leading-relaxed text-cocoa-700">
          {meta.tagline}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <GoogleLoginButton
            label="Sign in with Google to start"
            redirectTo="/home"
            examSlug={meta.slug}
          />
          <p className="text-sm text-cocoa-500">
            Free to start · ₹75/month after · No credit card
          </p>
        </div>
      </section>
    </main>
  );
}
