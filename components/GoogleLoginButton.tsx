"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  /** Where to send the user after a successful sign-in. Defaults to /home. */
  redirectTo?: string;
  /** Override the button label. Defaults to "Sign in with Google". */
  label?: string;
  /** Extra Tailwind classes to merge into the button. */
  className?: string;
  /**
   * Exam slug the user picked on the landing page (e.g. 'cuet', 'ssc-cgl',
   * 'neet-ug'). The OAuth callback reads this and writes it to
   * users.exam_choice so /home knows which exam to filter subjects by.
   */
  examSlug?: string;
};

export default function GoogleLoginButton({
  redirectTo = "/home",
  label = "Sign in with Google",
  className = "",
  examSlug,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

      // Pipe the exam slug through the OAuth round trip via the callback URL.
      // Supabase preserves our `redirectTo` query string verbatim, so by the
      // time /auth/callback runs we can read ?exam=ssc-cgl and write it to
      // users.exam_choice on the first sign-in.
      const callbackParams = new URLSearchParams({ next: redirectTo });
      if (examSlug) callbackParams.set("exam", examSlug);
      const callbackUrl = `${siteUrl}/auth/callback?${callbackParams.toString()}`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) {
        throw signInError;
      }
      // On success, Supabase redirects the browser away — nothing else to do here.
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Sign-in failed.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className={
          "inline-flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-md ring-1 ring-gray-200 transition hover:shadow-lg hover:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60 " +
          className
        }
      >
        {/* Google "G" mark */}
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.45-1.13 2.68-2.4 3.5v2.91h3.88c2.27-2.09 3.57-5.18 3.57-8.65z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.91c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.71-4.95H1.29v3.09C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.29 14.39c-.24-.72-.38-1.49-.38-2.39s.14-1.67.38-2.39V6.52H1.29A11.94 11.94 0 0 0 0 12c0 1.94.46 3.78 1.29 5.48l4-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.21 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.52l4 3.09C6.23 6.86 8.88 4.75 12 4.75z"
          />
        </svg>
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
