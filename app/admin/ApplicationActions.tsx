"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "contacted" | "approved" | "rejected";

const NEXT_LABEL: Record<Status, { label: string; next: Status }[]> = {
  pending: [
    { label: "Mark contacted", next: "contacted" },
    { label: "Reject", next: "rejected" },
  ],
  contacted: [
    { label: "Approve", next: "approved" },
    { label: "Reject", next: "rejected" },
    { label: "Back to pending", next: "pending" },
  ],
  approved: [{ label: "Revert to contacted", next: "contacted" }],
  rejected: [{ label: "Reopen as pending", next: "pending" }],
};

/**
 * Inline status-update controls for a single partner application.
 *
 * Optimistic UX: we call router.refresh() after a successful update so
 * the server-rendered list re-fetches and reflects the new status.
 * Errors are surfaced inline — admin shouldn't have to dig into
 * console for a failed action.
 */
export default function ApplicationActions({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const update = (next: Status) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: next }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Update failed");
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed");
      }
    });
  };

  const actions = NEXT_LABEL[status] ?? [];

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        {actions.map((a) => (
          <button
            key={a.next}
            onClick={() => update(a.next)}
            disabled={pending}
            className="rounded-full border border-cocoa-900/[0.08] bg-cream-50 px-3 py-1 text-[11px] font-semibold text-cocoa-700 transition hover:border-cocoa-900/[0.2] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {a.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[11px] font-medium text-ember-700">{error}</p>
      )}
    </div>
  );
}
