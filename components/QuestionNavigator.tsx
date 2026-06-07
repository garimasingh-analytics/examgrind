"use client";

/**
 * Question navigator — the side palette every Indian competitive exam
 * portal renders. Each cell is a numbered question, color-coded by
 * status:
 *
 *   • not visited       → cocoa-100 bg, cocoa-700 text
 *   • visited unanswered → ember-500/20 bg, ember-700 text
 *   • answered          → moss-500 bg, cream-50 text
 *   • marked for review → ember-600 bg, cream-50 text (only-mark)
 *   • answered + marked → purple-ish (we use sun gradient) — rare but
 *                         matches NTA convention
 *
 * Cells are clickable and call onSelect(index).
 */

export type NavQuestion = {
  index: number;
  sectionName: string;
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
};

type Props = {
  questions: NavQuestion[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export default function QuestionNavigator({
  questions,
  currentIndex,
  onSelect,
}: Props) {
  // Group by section to render section headers above each block.
  const sections: { name: string; items: NavQuestion[] }[] = [];
  for (const q of questions) {
    const last = sections[sections.length - 1];
    if (!last || last.name !== q.sectionName) {
      sections.push({ name: q.sectionName, items: [q] });
    } else {
      last.items.push(q);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <Legend />
      {sections.map((s) => (
        <div key={s.name}>
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
            {s.name}
          </h3>
          <div className="grid grid-cols-5 gap-1.5">
            {s.items.map((q) => (
              <button
                key={q.index}
                type="button"
                onClick={() => onSelect(q.index)}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition",
                  cellClass(q, q.index === currentIndex),
                ].join(" ")}
                aria-current={q.index === currentIndex ? "true" : undefined}
                aria-label={[
                  `Question ${q.index}`,
                  q.answered ? "answered" : "not answered",
                  q.markedForReview ? "marked for review" : "",
                ]
                  .filter(Boolean)
                  .join(", ")}
              >
                {q.index}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function cellClass(q: NavQuestion, isCurrent: boolean): string {
  const ring = isCurrent ? "ring-2 ring-cocoa-900 ring-offset-1 ring-offset-cream-50" : "";
  if (q.answered && q.markedForReview) {
    return `bg-gradient-to-br from-sun-400 to-ember-500 text-cocoa-900 ${ring}`;
  }
  if (q.markedForReview) {
    return `bg-ember-600 text-cream-50 ${ring}`;
  }
  if (q.answered) {
    return `bg-moss-500 text-cream-50 ${ring}`;
  }
  if (q.visited) {
    return `bg-ember-500/15 text-ember-700 ${ring}`;
  }
  return `bg-cocoa-100 text-cocoa-700 ${ring}`;
}

function Legend() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px] text-cocoa-700">
      <LegendItem swatch="bg-moss-500" label="Answered" />
      <LegendItem swatch="bg-ember-600" label="Marked" />
      <LegendItem swatch="bg-ember-500/15" label="Skipped" />
      <LegendItem swatch="bg-cocoa-100" label="Not visited" />
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded ${swatch}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
