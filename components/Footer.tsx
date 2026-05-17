import Link from "next/link";

/**
 * Slim footer with legal links — Razorpay requires Terms / Privacy / Refund
 * / Contact to be linked from every page on the live site.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-cocoa-900/[0.06] bg-cream-50/40 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-xs text-cocoa-500">
          © {year} ExamGrind · Practice CUET, one chapter at a time.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-cocoa-500">
          <Link href="/terms" className="hover:text-cocoa-900">Terms</Link>
          <Link href="/privacy" className="hover:text-cocoa-900">Privacy</Link>
          <Link href="/refund" className="hover:text-cocoa-900">Refund</Link>
          <Link href="/contact" className="hover:text-cocoa-900">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
