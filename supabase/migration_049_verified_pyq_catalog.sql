-- Verified Previous-Year Questions (PYQ) foundation.
-- A paper is never student-visible until its source, answer key and review
-- state have all been recorded. This deliberately separates real PYQs from
-- AI-generated practice.

create table if not exists public.pyq_papers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  subject_id text references public.subjects(id) on delete set null,
  exam_year integer not null check (exam_year between 2000 and 2100),
  paper_name text not null,
  exam_date date,
  shift_label text,
  total_questions integer not null check (total_questions > 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds > 0),
  official_source_url text not null,
  answer_key_url text,
  source_note text,
  verification_status text not null default 'draft'
    check (verification_status in ('draft', 'source_checked', 'verified', 'archived')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_id, subject_id, exam_year, paper_name, shift_label)
);

create table if not exists public.pyq_questions (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.pyq_papers(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  subject_id text references public.subjects(id) on delete set null,
  question_number integer not null check (question_number > 0),
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  explanation text,
  source_page text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (paper_id, question_number)
);

create index if not exists pyq_papers_exam_year_idx
  on public.pyq_papers (exam_id, exam_year desc);
create index if not exists pyq_questions_paper_number_idx
  on public.pyq_questions (paper_id, question_number);
create index if not exists pyq_questions_topic_idx
  on public.pyq_questions (topic_id) where topic_id is not null;

alter table public.pyq_papers enable row level security;
alter table public.pyq_questions enable row level security;

drop policy if exists "pyq_papers_select_verified" on public.pyq_papers;
create policy "pyq_papers_select_verified" on public.pyq_papers
  for select using (is_active and verification_status = 'verified');

drop policy if exists "pyq_questions_select_verified" on public.pyq_questions;
create policy "pyq_questions_select_verified" on public.pyq_questions
  for select using (
    is_verified and exists (
      select 1 from public.pyq_papers paper
      where paper.id = pyq_questions.paper_id
        and paper.is_active
        and paper.verification_status = 'verified'
    )
  );

drop trigger if exists pyq_papers_updated_at on public.pyq_papers;
create trigger pyq_papers_updated_at before update on public.pyq_papers
  for each row execute function public.set_updated_at();
drop trigger if exists pyq_questions_updated_at on public.pyq_questions;
create trigger pyq_questions_updated_at before update on public.pyq_questions
  for each row execute function public.set_updated_at();

comment on table public.pyq_papers is
  'Source-backed exam papers. Only active, verified papers may be shown to students.';
comment on table public.pyq_questions is
  'Question-level PYQ content with verification and source-page traceability.';

notify pgrst, 'reload schema';
