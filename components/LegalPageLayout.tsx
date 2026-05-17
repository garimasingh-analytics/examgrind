import Link from "next/link";

type Props = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

/**
 * Shared layout for /terms /privacy /refund /contact.
 * Plain reader-friendly typography, links back to /, "Last updated" stamp.
 */
export default function LegalPageLayout({ title, updated, children }: Props) {
  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl"
        >
          ExamGrind
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
        >
          ← Home
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
          {updated}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
          {title}
        </h1>
        <div className="prose-legal mt-8 space-y-5 text-[15px] leading-relaxed text-cocoa-700">
          {children}
        </div>
      </article>
    </main>
  );
}
