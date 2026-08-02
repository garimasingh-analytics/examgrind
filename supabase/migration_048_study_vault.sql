-- Study Vault: durable, exam-scoped AI study material.
-- Each card set/mnemonic belongs to exactly one verified user and exam.

create table if not exists public.study_vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  subject_id text references public.subjects(id) on delete set null,
  topic text not null check (char_length(trim(topic)) between 2 and 160),
  item_type text not null check (item_type in ('flashcard_set', 'mnemonic')),
  content jsonb not null,
  review_count integer not null default 0 check (review_count >= 0),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists study_vault_items_user_exam_created_idx
  on public.study_vault_items (user_id, exam_id, created_at desc);

alter table public.study_vault_items enable row level security;

drop policy if exists "study_vault_items_select_own" on public.study_vault_items;
drop policy if exists "study_vault_items_insert_own" on public.study_vault_items;
drop policy if exists "study_vault_items_update_own" on public.study_vault_items;
drop policy if exists "study_vault_items_delete_own" on public.study_vault_items;

create policy "study_vault_items_select_own" on public.study_vault_items
  for select using (auth.uid() = user_id);
create policy "study_vault_items_insert_own" on public.study_vault_items
  for insert with check (auth.uid() = user_id);
create policy "study_vault_items_update_own" on public.study_vault_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "study_vault_items_delete_own" on public.study_vault_items
  for delete using (auth.uid() = user_id);

drop trigger if exists study_vault_items_updated_at on public.study_vault_items;
create trigger study_vault_items_updated_at
  before update on public.study_vault_items
  for each row execute function public.set_updated_at();

comment on table public.study_vault_items is
  'Student-owned AI flashcard sets and mnemonics, scoped to the active exam.';

notify pgrst, 'reload schema';
