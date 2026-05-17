import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components and Route Handlers
 * (app/api/.../route.ts, app/auth/callback/route.ts, etc.).
 *
 * Server Components cannot mutate cookies — that's fine, the middleware
 * refreshes the session on every request.
 */
export const createServerSupabase = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore. Middleware handles refresh.
          }
        },
      },
    }
  );
};

// Backwards-compat alias for existing imports.
export const createRouteClient = createServerSupabase;
export const createServerClient_ = createServerSupabase;
