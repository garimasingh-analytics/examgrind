import Link from "next/link";

type Props = {
  today: string;
  activeDates: string[];
  streak: number;
  longestStreak: number;
};

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function MonthlyProgressCalendar({ today, activeDates, streak, longestStreak }: Props) {
  const active = new Set(activeDates);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const monthStart = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), 1));
  const lastDay = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth() + 1, 0)).getUTCDate();
  const startOffset = (monthStart.getUTCDay() + 6) % 7;
  const days = Array.from({ length: startOffset + lastDay }, (_, index) => {
    if (index < startOffset) return null;
    return new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), index - startOffset + 1));
  });
  const monthName = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(todayDate);

  return <Link href="/weekly" className="block rounded-3xl border border-cocoa-900/[.08] bg-cream-50 p-4 shadow-warm transition hover:-translate-y-0.5 hover:bg-white sm:p-5" aria-label="Open your weekly progress">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">This month</p><h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">{monthName}</h2></div><span className="rounded-full bg-ember-600/10 px-2.5 py-1 text-xs font-bold text-ember-700">🔥 {streak} day{streak === 1 ? "" : "s"}</span></div>
    <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">{weekDays.map((day, index) => <span key={`${day}-${index}`} className="text-[10px] font-bold text-cocoa-500">{day}</span>)}{days.map((day, index) => {
      if (!day) return <span key={`blank-${index}`} />;
      const key = dateKey(day);
      const practiced = active.has(key);
      const isToday = key === today;
      const past = key < today;
      return <span key={key} title={practiced ? "Study completed" : isToday ? "Today" : past ? "No practice recorded" : "Upcoming"} className={`flex aspect-square items-center justify-center rounded-full text-[11px] font-bold ${practiced ? "bg-moss-500 text-white" : isToday ? "border-2 border-ember-600 bg-sun-400/20 text-cocoa-900" : past ? "bg-cocoa-900/[.06] text-cocoa-500" : "text-cocoa-400"}`}>{day.getUTCDate()}</span>;
    })}</div>
    <p className="mt-4 text-xs text-cocoa-700"><span className="font-bold text-moss-700">Green</span> = you studied · <span className="font-bold text-ember-700">outlined</span> = today · longest streak {longestStreak} days</p>
  </Link>;
}
