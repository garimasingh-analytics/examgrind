# Supabase migration ledger

Production changes are applied in numeric order through the Supabase SQL
Editor and recorded here in the same commit as the application code that needs
them. Never apply a migration from an uncommitted working tree.

| Latest | Purpose | Production status |
| --- | --- | --- |
| 036 | RLS for production public tables | applied 2026-07-16 |
| 037 | Reproducible `quiz_analyses` cache | applied 2026-07-21 |
| 038 | Webhook retry safety and AI daily fair-use guard | applied 2026-07-21 |
| 039 | Protect billing entitlements and quota counters | applied 2026-07-23 |

After applying a new migration, update this table in the same pull request and
save the Supabase SQL Editor result in the deployment notes. The migration files
are intentionally append-only: never edit an already-applied migration.
