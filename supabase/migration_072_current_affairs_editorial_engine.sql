-- Current-affairs editorial engine: source registry, daily-run audit trail,
-- and a stable Government Schemes library. Current affairs remain free and
-- each public record must point to a primary official source.

create table if not exists public.current_affairs_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  publisher text not null,
  source_url text not null,
  source_type text not null check (source_type in ('rss', 'portal', 'magazine', 'report')),
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly', 'as_published')),
  is_active boolean not null default true,
  editorial_focus text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.current_affairs_daily_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null check (status in ('started', 'completed', 'partial', 'failed')),
  sources_checked integer not null default 0,
  candidate_count integer not null default 0,
  published_count integer not null default 0,
  notes text,
  unique (run_date)
);

create table if not exists public.government_schemes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  ministry text not null,
  status text not null default 'active' check (status in ('active', 'archived', 'superseded')),
  what_it_is text not null,
  who_it_is_for text not null,
  why_it_matters text not null,
  exam_links jsonb not null default '[]'::jsonb,
  official_source_title text not null,
  official_source_url text not null,
  last_official_check date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists government_schemes_status_idx on public.government_schemes (status, name);
create index if not exists current_affairs_daily_runs_date_idx on public.current_affairs_daily_runs (run_date desc);

alter table public.current_affairs_sources enable row level security;
alter table public.current_affairs_daily_runs enable row level security;
alter table public.government_schemes enable row level security;

drop policy if exists "Current-affairs sources are public" on public.current_affairs_sources;
create policy "Current-affairs sources are public" on public.current_affairs_sources for select to anon, authenticated using (is_active = true);
drop policy if exists "Government schemes are public" on public.government_schemes;
create policy "Government schemes are public" on public.government_schemes for select to anon, authenticated using (status = 'active');

insert into public.current_affairs_sources (slug, name, publisher, source_url, source_type, cadence, editorial_focus) values
  ('pib-releases', 'Press releases', 'Press Information Bureau', 'https://pib.gov.in/RssMain.aspx?reg=3&lang=2', 'rss', 'daily', 'Government decisions, ministries, programmes, reports and public initiatives.'),
  ('rbi-press-releases', 'Press releases and notifications', 'Reserve Bank of India', 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx', 'portal', 'as_published', 'Monetary policy, banking, payments, financial inclusion and regulation.'),
  ('mygov', 'Citizen participation and government updates', 'MyGov India', 'https://www.mygov.in/', 'portal', 'as_published', 'Public campaigns, consultations, digital initiatives and government explainers.'),
  ('yojana', 'Yojana', 'Ministry of Information and Broadcasting', 'https://yojana.gov.in/', 'magazine', 'monthly', 'Policy context, development programmes and issue-based background.'),
  ('kurukshetra', 'Kurukshetra', 'Ministry of Information and Broadcasting', 'https://kurukshetra.gov.in/', 'magazine', 'monthly', 'Rural development, agriculture, governance and implementation context.'),
  ('myscheme', 'myScheme', 'Government of India', 'https://www.myscheme.gov.in/', 'portal', 'as_published', 'Official scheme discovery and eligibility cross-checking.')
on conflict (slug) do update set
  name = excluded.name, publisher = excluded.publisher, source_url = excluded.source_url,
  source_type = excluded.source_type, cadence = excluded.cadence,
  editorial_focus = excluded.editorial_focus, is_active = true, updated_at = now();

insert into public.government_schemes (slug, name, ministry, what_it_is, who_it_is_for, why_it_matters, exam_links, official_source_title, official_source_url, last_official_check) values
  ('pm-kisan', 'PM-KISAN', 'Ministry of Agriculture & Farmers Welfare', 'An income-support scheme for eligible farmer families, administered through the PM-KISAN portal.', 'Eligible landholding farmer families, subject to the scheme rules and exclusions.', 'Useful for agriculture, rural development, direct benefit transfer and welfare-policy questions.', '["Agriculture", "Rural development", "Direct benefit transfer"]', 'PM-KISAN official portal', 'https://pmkisan.gov.in/', date '2026-09-03'),
  ('ayushman-bharat-pmjay', 'Ayushman Bharat PM-JAY', 'National Health Authority', 'A public health-assurance scheme implemented through the National Health Authority framework.', 'Eligible beneficiary families identified under the scheme framework.', 'Useful for public health, social-sector schemes, health financing and governance questions.', '["Health", "Social justice", "Public policy"]', 'Ayushman Bharat PM-JAY official portal', 'https://pmjay.gov.in/', date '2026-09-03'),
  ('mgnregs', 'Mahatma Gandhi National Rural Employment Guarantee Scheme', 'Ministry of Rural Development', 'A legal employment-guarantee programme for rural households under the MGNREGA framework.', 'Rural households seeking wage employment, subject to the Act and local implementation.', 'Useful for rural development, rights-based welfare, decentralisation and employment questions.', '["Rural development", "Employment", "Governance"]', 'MGNREGA official portal', 'https://nrega.nic.in/', date '2026-09-03'),
  ('jal-jeevan-mission', 'Jal Jeevan Mission', 'Department of Drinking Water and Sanitation', 'A mission focused on household drinking-water service delivery and related local infrastructure.', 'Rural households and local water-supply systems under the mission framework.', 'Useful for water resources, public health, local governance and sustainable development questions.', '["Water resources", "Public health", "Rural development"]', 'Jal Jeevan Mission official portal', 'https://jaljeevanmission.gov.in/', date '2026-09-03'),
  ('pmay-g', 'Pradhan Mantri Awaas Yojana – Gramin', 'Ministry of Rural Development', 'A rural housing programme delivered through the PMAY-G framework.', 'Eligible rural households identified through the programme process.', 'Useful for housing, poverty alleviation, rural development and welfare-delivery questions.', '["Housing", "Rural development", "Social welfare"]', 'PMAY-G official portal', 'https://pmayg.nic.in/', date '2026-09-03'),
  ('pm-svanidhi', 'PM SVANidhi', 'Ministry of Housing and Urban Affairs', 'A working-capital support programme for eligible street vendors.', 'Eligible street vendors under the programme guidelines.', 'Useful for urban livelihoods, financial inclusion, microcredit and informal-sector questions.', '["Urban development", "Financial inclusion", "Livelihoods"]', 'PM SVANidhi official portal', 'https://pmsvanidhi.mohua.gov.in/', date '2026-09-03'),
  ('pm-vishwakarma', 'PM Vishwakarma', 'Ministry of Micro, Small and Medium Enterprises', 'A support scheme for recognised traditional artisans and craftspeople.', 'Eligible artisans and craftspeople under the scheme guidelines.', 'Useful for MSMEs, traditional skills, livelihoods and inclusive-development questions.', '["MSMEs", "Livelihoods", "Skill development"]', 'PM Vishwakarma official portal', 'https://pmvishwakarma.gov.in/', date '2026-09-03'),
  ('pm-poshan', 'PM POSHAN', 'Ministry of Education', 'A school-meal programme under the Ministry of Education.', 'Children in covered schools, in line with programme guidelines.', 'Useful for nutrition, education, child development and social-sector policy questions.', '["Education", "Nutrition", "Child development"]', 'PM POSHAN official portal', 'https://pmposhan.education.gov.in/', date '2026-09-03')
on conflict (slug) do update set
  name = excluded.name, ministry = excluded.ministry, what_it_is = excluded.what_it_is,
  who_it_is_for = excluded.who_it_is_for, why_it_matters = excluded.why_it_matters,
  exam_links = excluded.exam_links, official_source_title = excluded.official_source_title,
  official_source_url = excluded.official_source_url, last_official_check = excluded.last_official_check,
  updated_at = now();
