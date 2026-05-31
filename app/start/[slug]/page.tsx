import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
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
    // Use update if the row exists, insert otherwise. Upsert was masking
    // edge cases where Supabase didn't recognise the conflict properly
    // for some users — split into explicit insert/update so we can verify
    // the row actually got the new exam_choice before redirecting.
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("users")
        .update({ exam_choice: meta.slug })
        .eq("id", user.id);
    } else {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email ?? "",
        exam_choice: meta.slug,
      });
    }

    // Tell Next.js the /home cache for this user is stale. Without this,
    // the redirect can land on a stale rendering of /home showing the
    // previous exam_choice — which is what was happening when users
    // tried to switch to NEET UG: /start/neet-ug updated the DB but
    // /home rendered from cache with the old exam_choice = cuet.
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
