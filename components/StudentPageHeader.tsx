import Link from "next/link";
import ExamSwitcher from "@/components/ExamSwitcher";

type StudentPageHeaderProps = {
  examSlug: string;
  section: string;
};

/** A quiet, shared header for the four signed-in study routes. */
export default function StudentPageHeader({ examSlug, section }: StudentPageHeaderProps) {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <div className="min-w-0">
        <Link href="/home" className="font-serif text-xl font-bold tracking-[-.035em] text-cocoa-900">
          ExamGrind
        </Link>
        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.16em] text-cocoa-500">{section}</p>
      </div>
      <div className="flex items-center gap-2">
        <ExamSwitcher currentSlug={examSlug} />
        <Link href="/home" className="hidden border-b border-cocoa-900/25 pb-0.5 text-xs font-bold text-cocoa-800 sm:inline-flex">
          Home
        </Link>
      </div>
    </header>
  );
}
