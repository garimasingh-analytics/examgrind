"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Props = { selectedDate: string; publishedDates: string[] };

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CurrentAffairsCalendar({ selectedDate, publishedDates }: Props) {
  const selected = new Date(`${selectedDate}T12:00:00`);
  const [month, setMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const published = useMemo(() => new Set(publishedDates), [publishedDates]);
  const firstOffset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstOffset + daysInMonth) / 7) * 7 }, (_, index) => index - firstOffset + 1);
  const monthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(month);

  return (
    <section className="rounded-[1.8rem] border border-cocoa-900/[.08] bg-cream-50 p-5 shadow-warm">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-ember-700">Archive</p><h2 className="mt-1 font-serif text-2xl font-semibold text-cocoa-900">Pick a day</h2></div>
        <div className="flex gap-2"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" className="grid size-9 place-items-center rounded-full border border-cocoa-900/10 text-cocoa-700 hover:bg-cream-100">←</button><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" className="grid size-9 place-items-center rounded-full border border-cocoa-900/10 text-cocoa-700 hover:bg-cream-100">→</button></div>
      </div>
      <p className="mt-5 text-center text-sm font-bold text-cocoa-800">{monthLabel}</p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-cocoa-500">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day < 1 || day > daysInMonth) return <span key={`blank-${index}`} className="aspect-square" />;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const iso = toIsoDate(date);
          const isPublished = published.has(iso);
          const isSelected = iso === selectedDate;
          return <Link key={iso} href={`/current-affairs?date=${iso}`} aria-current={isSelected ? "date" : undefined} className={`relative grid aspect-square place-items-center rounded-xl text-xs font-bold transition ${isSelected ? "bg-cocoa-900 text-cream-50" : isPublished ? "bg-sun-300/55 text-cocoa-900 hover:bg-sun-300" : "text-cocoa-500 hover:bg-cream-100"}`}>{day}{isPublished && !isSelected ? <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-ember-600" /> : null}</Link>;
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-cocoa-600"><span className="mr-1 inline-block size-2 rounded-full bg-ember-600" /> A sourced brief was published on this date.</p>
    </section>
  );
}
