import Link from "next/link";

type Props = {
  today: string;
  activeDates: string[];
  streak: number;
  longestStreak: number;
  variant?: "dark" | "paper";
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function MonthlyProgressCalendar({ today, activeDates, streak, longestStreak, variant = "dark" }: Props) {
  const active = new Set(activeDates);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const days = Array.from({ length: 7 }, (_, index) => new Date(todayDate.getTime() - (6 - index) * 86_400_000));
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(todayDate);

  const paper = variant === "paper";
  return <Link href="/weekly" className={`eg-press flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border px-3 py-2 transition ${paper ? "border-cocoa-900/[.08] bg-cream-100 hover:bg-cream-200" : "border-cream-50/15 bg-cream-50/10 text-cream-50 hover:bg-cream-50/15"}`} aria-label="Open your weekly progress">
    <span className={`text-xs font-bold ${paper ? "text-cocoa-900" : "text-cream-50"}`}>{dateLabel}</span>
    <span className={`text-xs font-bold ${paper ? "text-ember-700" : "text-sun-400"}`}>🔥 {streak}</span>
    <span className={`hidden text-[11px] sm:inline ${paper ? "text-cocoa-500" : "text-cream-200/65"}`}>7-day trail</span>
    <span className="flex items-center gap-1.5">{days.map((day) => {
      const key = dateKey(day);
      const practiced = active.has(key);
      const isToday = key === today;
      const past = key < today;
      return <span key={key} title={practiced ? "Study completed" : isToday ? "Today" : past ? "No practice recorded" : "Upcoming"} className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${practiced ? "bg-moss-500 text-white" : isToday ? paper ? "border-2 border-ember-600 bg-sun-400/20 text-cocoa-900" : "border-2 border-sun-400 bg-sun-400/20 text-cream-50" : past ? paper ? "bg-cocoa-900/[.06] text-cocoa-500" : "bg-cream-50/10 text-cream-200/60" : paper ? "text-cocoa-500" : "text-cream-200/40"}`}>{day.getUTCDate()}</span>;
    })}</span>
    <span className={`hidden text-[10px] md:inline ${paper ? "text-cocoa-500" : "text-cream-200/65"}`}>Best {longestStreak} days</span>
  </Link>;
}
