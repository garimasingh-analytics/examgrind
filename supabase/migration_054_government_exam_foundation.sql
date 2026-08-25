-- Government-exam expansion foundation.
--
-- These exams deliberately begin as `coming_soon`. A row here is not a launch:
-- it merely creates a verified research record and lets us connect a complete
-- syllabus, original diagnostics, practice, Coach context, guides, and founder
-- QA before changing the status to `live`.

insert into exams (slug, name, status, description, display_order, hero_color) values
  ('delhi-police-constable', 'Delhi Police Constable', 'live',
   'GK, reasoning, numerical ability and computer practice with a clear repair route after every attempt.', 70, 'ember'),
  ('uppsc-ro-aro', 'UPPSC RO / ARO', 'coming_soon',
   'Hindi, General Studies and office-skills route under review.', 80, 'moss'),
  ('up-secretariat-ro-aro', 'UP Samiksha Adhikari / Sahayak Samiksha Adhikari', 'coming_soon',
   'Dedicated UP government-exam route under review.', 90, 'moss'),
  ('allahabad-high-court-ro-aro', 'Allahabad High Court RO / ARO', 'coming_soon',
   'Court recruitment route under review.', 100, 'cocoa')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  hero_color = excluded.hero_color;

-- Keeps the public source, the fact it supports, and the date we last checked
-- it together. This prevents a generic coaching-blog syllabus from silently
-- becoming product truth when a notification changes.
create table if not exists exam_reference_sources (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  title text not null,
  source_url text not null,
  source_type text not null check (source_type in ('official_notice', 'official_scheme', 'official_rules', 'official_portal')),
  checked_at date not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (exam_id, source_url)
);

create index if not exists exam_reference_sources_exam_id_idx on exam_reference_sources(exam_id);
alter table exam_reference_sources enable row level security;
drop policy if exists "Exam reference sources are public" on exam_reference_sources;
create policy "Exam reference sources are public"
  on exam_reference_sources for select to anon, authenticated using (true);

insert into exam_reference_sources (exam_id, title, source_url, source_type, checked_at, notes)
select e.id, s.title, s.source_url, s.source_type, s.checked_at, s.notes
from exams e
join (
  values
    ('delhi-police-constable', 'Staff Selection Commission notice board', 'https://ssc.gov.in/', 'official_portal', date '2026-08-25', 'Exact scheme and dates must be reconfirmed against the next relevant SSC notice before launch.'),
    ('uppsc-ro-aro', 'UPPSC RO/ARO mains notice', 'https://uppsc.up.nic.in/Open_PDF.aspx?I4PnQ0tBaglwnfngIftCPVDktv%2FkQUnE=', 'official_notice', date '2026-08-25', 'Use as an official recruitment reference; verify the next notification before exposing pattern claims.'),
    ('up-secretariat-ro-aro', 'UPPSC Samiksha Adhikari / Sahayak Samiksha Adhikari notice board', 'https://uppsc.up.nic.in/Default.aspx', 'official_portal', date '2026-08-25', 'The official portal lists the 2023 recruitment process; do not infer a future schedule.'),
    ('allahabad-high-court-ro-aro', 'Allahabad High Court staff recruitment rules', 'https://www.allahabadhighcourt.in/rules/TheHighCourtOfficersStaffRules1976_01-07-2025.pdf', 'official_rules', date '2026-08-25', 'Review the specific vacancy notification before producing a public pattern or practice set.')
) as s(exam_slug, title, source_url, source_type, checked_at, notes)
  on e.slug = s.exam_slug
on conflict (exam_id, source_url) do update set
  title = excluded.title,
  source_type = excluded.source_type,
  checked_at = excluded.checked_at,
  notes = excluded.notes;
