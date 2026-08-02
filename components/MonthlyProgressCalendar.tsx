import Link from "next/link";

type Props = {
  today: string;
  activeDates: string[];
  streak: number;
  longestStreak: number;
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function MonthlyProgressCalendar({ today, activeDates, streak, longestStreak }: Props) {
  const active = new Set(activeDates);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const days = Array.from({ length: 7 }, (_, index) => new Date(todayDate.getTime() - (6 - index) * 86_400_000));
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(todayDate);

  return <Link href="/weekly" className="mt-3 flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-cocoa-900/[.08] bg-cream-50/90 px-3 py-2 shadow-warm transition hover:bg-white" aria-label="Open your weekly progress">
    <span className="text-xs font-bold text-cocoa-900">{dateLabel}</span>
    <span className="text-xs font-bold text-ember-700">🔥 {streak}</span>
    <span className="hidden text-[11px] text-cocoa-500 sm:inline">7-day trail</span>
    <span className="flex items-center gap-1.5">{days.map((day) => {
      const key = dateKey(day);
      const practiced = active.has(key);
      const isToday = key === today;
      const past = key < today;
      return <span key={key} title={practiced ? "Study completed" : isToday ? "Today" : past ? "No practice recorded" : "Upcoming"} className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${practiced ? "bg-moss-500 text-white" : isToday ? "border-2 border-ember-600 bg-sun-400/20 text-cocoa-900" : past ? "bg-cocoa-900/[.06] text-cocoa-500" : "text-cocoa-400"}`}>{day.getUTCDate()}</span>;
    })}</span>
    <span className="hidden text-[10px] text-cocoa-500 md:inline">Best {longestStreak} days</span>
  </Link>;
}
