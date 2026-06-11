-- Migration 023 — Cosmetic chick variant per user
--
-- Adds a single column to public.users to track which chick skin the
-- user has selected. Unlock logic is computed on read (xp >= threshold
-- or premium), so we don't need a separate user_chicks junction table.
-- Default 'classic' covers existing rows.

alter table public.users
  add column if not exists selected_chick text
    not null default 'classic'
    check (selected_chick in ('classic', 'scholar', 'bookworm', 'doctor', 'police', 'royal'));

comment on column public.users.selected_chick is
  'Cosmetic chick variant the user has selected. Read with isChickUnlocked() — server enforces unlock at write time, this column just remembers the pick.';
