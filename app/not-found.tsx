import Link from "next/link";
import Chick from "@/components/Chick";

/**
 * 404 page. Rendered for any unknown route.
 *
 * Chick mascot stays consistent with the in-app empty states, so it
 * doesn't feel like the user got bumped to a different product. One
 * clear way back home, one optional link to /partners in case they
 * arrived via a stale coaching-centre flyer.
 */
export default function NotFound() {
  return (
    <main className="bg-warm-wash flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center">
      <Chick state="sad" size={140} className="mb-7" />

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-balance text-base leading-relaxed text-cocoa-700">
        The link might be old, or we might have moved things. Either way,
        let&apos;s get you back to studying.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-cocoa-900 px-7 py-3.5 text-base font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700"
        >
          Take me home →
        </Link>
        <Link
          href="/partners"
          className="text-sm font-semibold text-cocoa-500 hover:text-cocoa-900"
        >
          Partner program
        </Link>
      </div>
    </main>
  );
}
