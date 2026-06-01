/**
 * Admin email allow-list.
 *
 * Comma-separated emails in env var ADMIN_EMAILS, fallback to the
 * founder's address so the admin view works out of the box even if
 * the env var hasn't been set in Vercel yet.
 *
 * Why an env var instead of a `users.is_admin` column: launches faster,
 * no migration, no risk of accidentally giving a normal user admin
 * powers via SQL. Trade-off is that adding a new admin requires a
 * Vercel redeploy, which is fine at this stage.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "garimakalhansh@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
