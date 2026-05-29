"use client";

import { useState } from "react";

/**
 * Inline application form for coaching-centre partners.
 *
 * The form is intentionally short — we just need enough to qualify the lead
 * and pick up the phone. The "Tell us about your students" textarea is a
 * tickle field; people who fill it tend to convert faster.
 */
export default function PartnerApplyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          centreName: fd.get("centreName"),
          contactName: fd.get("contactName"),
          contactEmail: fd.get("contactEmail"),
          contactPhone: fd.get("contactPhone"),
          city: fd.get("city"),
          studentCount: fd.get("studentCount"),
          examsTaught: fd.get("examsTaught"),
          notes: fd.get("notes"),
          utmSource:
            typeof window !== "undefined"
              ? new URLSearchParams(window.location.search).get("utm_source") ?? ""
              : "",
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          json.error ?? "Couldn't submit. Please try again."
        );
      }
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-moss-500/30 bg-moss-500/10 p-8 text-center shadow-warm"
      >
        <p className="font-serif text-2xl font-bold text-moss-700">
          Got it — we&apos;ll be in touch within 48 hours.
        </p>
        <p className="mt-3 text-cocoa-700">
          We&apos;ll WhatsApp you a short demo video and a unique referral
          code your students can sign up with. No paperwork, no contract.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg sm:p-8"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Your name"
          name="contactName"
          required
          placeholder="Ravi Kumar"
          autoComplete="name"
        />
        <Field
          label="Coaching centre name"
          name="centreName"
          required
          placeholder="Bright Future Academy"
          autoComplete="organization"
        />
        <Field
          label="Email"
          name="contactEmail"
          type="email"
          required
          placeholder="ravi@brightfuture.in"
          autoComplete="email"
        />
        <Field
          label="WhatsApp number"
          name="contactPhone"
          type="tel"
          required
          placeholder="+91 98xxxxxxxx"
          autoComplete="tel"
        />
        <Field
          label="City"
          name="city"
          required
          placeholder="Greater Noida"
          autoComplete="address-level2"
        />
        <Field
          label="Students per batch"
          name="studentCount"
          placeholder="~120"
        />
      </div>

      <Field
        label="Exams you teach"
        name="examsTaught"
        placeholder="CUET UG, SSC CGL, Banking"
      />

      <label className="block">
        <span className="text-sm font-semibold text-cocoa-700">
          Anything else we should know? <span className="font-normal text-cocoa-500">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Tell us about your students — which batch sizes, which exams, what their biggest pain is right now."
          className="mt-1.5 w-full rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500/70 focus:border-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600/30"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-ember-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-ember-600 px-7 py-3.5 text-base font-bold text-cream-50 shadow-warm-lg transition hover:bg-ember-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Apply to be a partner →"}
      </button>

      <p className="text-center text-xs text-cocoa-500">
        We&apos;ll respond within 48 hours. No commitment until you say yes.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-cocoa-700">
        {label}
        {required && <span className="text-ember-600"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500/70 focus:border-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600/30"
      />
    </label>
  );
}
