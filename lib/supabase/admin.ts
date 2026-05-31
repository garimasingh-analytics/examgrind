import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — BYPASSES Row-Level Security.
 *
 * ⚠️  Server-only. Never import this from a client component.
 *
 * Why we need this:
 * The cookie-based server client (lib/supabase/server.ts) had silent UPDATE
 * failures when writing to users.exam_choice from /start/[slug] and the
 * OAuth callback. The auth.uid() inside the RLS policy was sometimes
 * returning NULL in Server Component contexts because Next.js doesn't
 * always refresh the cookie session in time for the same render pass.
 *
 * The pattern is:
 *   1) Use the cookie-based client to verify the user (auth.getUser()).
 *   2) Use the admin client to perform the privileged write, scoped to
 *      that verified user.id only.
 *
 * This keeps the security boundary intact: we never trust client input
 * for the user_id; we use the verified id from the cookie session.
 */
export const createAdminSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
