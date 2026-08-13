"use client";

import { useState } from "react";

export default function EmailPreferencesCard({ initialOptIn }: { initialOptIn: boolean }) {
  const [enabled, setEnabled] = useState(initialOptIn);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function save(next: boolean) {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/me/email-preferences", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ marketingEmailOptIn: next }),
      });
      const body = await response.json() as { error?: string; marketingEmailOptIn?: boolean };
      if (!response.ok) throw new Error(body.error ?? "Couldn't save your preference.");
      setEnabled(Boolean(body.marketingEmailOptIn));
      setNotice(next ? "You’re on the learning loop. We’ll keep it useful, not noisy." : "Email updates are off. Transactional account emails still continue.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Couldn't save your preference.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
      <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">Study updates</p>
            <h2 className="mt-1 font-serif text-xl font-bold text-cocoa-900">Let ExamGrind bring you back to the right next step.</h2>
            <p className="mt-2 text-sm leading-6 text-cocoa-700">Practical Coach, practice and repair prompts based on your activity—never more than two emails a week. You can switch this off whenever you want.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => save(!enabled)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${enabled ? "bg-cocoa-900 text-cream-50" : "border border-cocoa-900/[0.1] bg-cream-100 text-cocoa-700"} disabled:cursor-wait disabled:opacity-60`}
          >
            <span aria-hidden>{enabled ? "✓" : "✦"}</span>
            {saving ? "Saving…" : enabled ? "Updates on" : "Get study updates"}
          </button>
        </div>
        {notice && <p className="mt-4 rounded-2xl bg-warm-wash px-3 py-2 text-xs font-medium text-cocoa-700" role="status">{notice}</p>}
      </div>
    </section>
  );
}
