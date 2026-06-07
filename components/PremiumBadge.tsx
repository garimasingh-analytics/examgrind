import Link from "next/link";

/**
 * Persistent Premium chip for the app header.
 *
 * Why this exists separate from PlanPanel:
 *   PlanPanel is the big paid-status card on /me. This is the small,
 *   always-visible badge that lives next to the streak / Level / XP
 *   pills on every page header so paid users can SEE they're on the
 *   paid tier from anywhere in the app. Visual reward = retention.
 *
 * Renders nothing for free users — silent for the 99% case.
 *
 * Variants:
 *   • "header" (default) — gold-gradient pill matched to streak/XP chip sizing
 *   • "compact" — same content, smaller — used in tight headers like /quiz
 *
 * Clicking takes the user to /me where they can see renewal date,
 * manage their subscription, etc.
 */

type Props = {
  isPaid: boolean;
  variant?: "header" | "compact";
  className?: string;
};

export default function PremiumBadge({
  isPaid,
  variant = "header",
  className = "",
}: Props) {
  if (!isPaid) return null;

  const sizing =
    variant === "compact"
      ? "gap-1 px-2 py-1 text-[10px]"
      : "gap-1 px-2.5 py-1.5 sm:gap-1.5 sm:px-3 text-xs";

  return (
    <Link
      href="/me"
      title="ExamGrind Premium — manage subscription"
      className={`flex items-center rounded-full bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 shadow-warm transition hover:scale-[1.02] ${sizing} ${className}`}
    >
      <span className="leading-none" aria-hidden>👑</span>
      <span className="font-bold uppercase tracking-wider text-cocoa-900">
        Premium
      </span>
    </Link>
  );
}
