-- Current Affairs hub + UPPSC PCS Prelims subject map.
--
-- Editorial rule: only a human-reviewed, source-backed brief may be marked
-- published. This schema deliberately has no public INSERT/UPDATE policy.

alter table public.subjects
  add column if not exists is_active boolean not null default true;

-- The initial PCS foundation used three broad lanes. Keep those records for
-- historical attempts, but do not present them as a complete syllabus.
update public.subjects
set is_active = false
where id in ('uppsc-pcs-gs', 'uppsc-pcs-csat', 'uppsc-pcs-up-context');

insert into public.subjects (id, exam_id, name, cuet_code, description, icon, order_index, is_active)
select
  s.id,
  e.id,
  s.name,
  null,
  s.description,
  s.icon,
  s.order_index,
  true
from public.exams e
cross join (
  values
    ('uppsc-pcs-history-culture', 'History & Culture', 'Ancient, medieval and modern India; art, culture and society.', '🏛️', 1),
    ('uppsc-pcs-polity-governance', 'Indian Polity & Governance', 'Constitution, institutions, public policy and governance.', '⚖️', 2),
    ('uppsc-pcs-geography', 'Geography', 'India, world and Uttar Pradesh geography, environment links and mapping.', '🗺️', 3),
    ('uppsc-pcs-economy', 'Economy', 'Indian economy, Uttar Pradesh economy and public-finance foundations.', '📈', 4),
    ('uppsc-pcs-environment', 'Environment & Ecology', 'Ecology, biodiversity, climate and sustainable-development foundations.', '🌿', 5),
    ('uppsc-pcs-science-tech', 'General Science & Technology', 'Everyday science, scientific awareness and technology in public life.', '🔬', 6),
    ('uppsc-pcs-up-special', 'Uttar Pradesh Special', 'UP geography, history, culture, economy, governance and schemes.', '🧭', 7),
    ('uppsc-pcs-csat-skills', 'CSAT Skills', 'Comprehension, reasoning, numeracy and data interpretation.', '🧩', 8)
) as s(id, name, description, icon, order_index)
where e.slug = 'uppsc-pcs'
on conflict (id) do update set
  exam_id = excluded.exam_id,
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  order_index = excluded.order_index,
  is_active = true;

insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index)
values
  ('uppsc-pcs-history-culture', 'Indian History', 'indian-history', null, null, 1),
  ('uppsc-pcs-history-culture', 'Art, Culture & Society', 'art-culture-society', null, null, 2),
  ('uppsc-pcs-polity-governance', 'Constitution & Institutions', 'constitution-institutions', null, null, 1),
  ('uppsc-pcs-polity-governance', 'Governance & Public Policy', 'governance-public-policy', null, null, 2),
  ('uppsc-pcs-geography', 'India & World Geography', 'india-world-geography', null, null, 1),
  ('uppsc-pcs-geography', 'Uttar Pradesh Geography', 'uttar-pradesh-geography', null, null, 2),
  ('uppsc-pcs-economy', 'Indian Economy', 'indian-economy', null, null, 1),
  ('uppsc-pcs-economy', 'Uttar Pradesh Economy', 'uttar-pradesh-economy', null, null, 2),
  ('uppsc-pcs-environment', 'Ecology & Biodiversity', 'ecology-biodiversity', null, null, 1),
  ('uppsc-pcs-environment', 'Climate & Environment', 'climate-environment', null, null, 2),
  ('uppsc-pcs-science-tech', 'Everyday Science', 'everyday-science', null, null, 1),
  ('uppsc-pcs-science-tech', 'Science, Technology & Public Issues', 'science-tech-public-issues', null, null, 2),
  ('uppsc-pcs-up-special', 'UP History, Culture & Geography', 'up-history-culture-geography', null, null, 1),
  ('uppsc-pcs-up-special', 'UP Economy & Governance', 'up-economy-governance', null, null, 2),
  ('uppsc-pcs-csat-skills', 'Comprehension & Reasoning', 'comprehension-reasoning', null, null, 1),
  ('uppsc-pcs-csat-skills', 'Numeracy & Data Interpretation', 'numeracy-data-interpretation', null, null, 2)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, t.name, t.slug, t.description, t.order_index
from public.chapters c
join (
  values
    ('uppsc-pcs-history-culture', 'indian-history', 'Ancient and Medieval India', 'ancient-medieval-india', 'Build chronology, themes and cultural context before memorising isolated facts.', 1),
    ('uppsc-pcs-history-culture', 'indian-history', 'Modern India and National Movement', 'modern-india-national-movement', 'Connect events, organisations, leaders and constitutional outcomes.', 2),
    ('uppsc-pcs-history-culture', 'art-culture-society', 'Art, Architecture and Heritage', 'art-architecture-heritage', 'Use comparison, region and period to make cultural facts recallable.', 1),
    ('uppsc-pcs-history-culture', 'art-culture-society', 'Indian Society and Social Issues', 'indian-society-social-issues', 'Link social issues to institutions, evidence and policy responses.', 2),
    ('uppsc-pcs-polity-governance', 'constitution-institutions', 'Constitutional Framework', 'constitutional-framework', 'Learn the structure before individual articles and bodies.', 1),
    ('uppsc-pcs-polity-governance', 'constitution-institutions', 'Rights, Duties and Directive Principles', 'rights-duties-directives', 'Differentiate enforceable rights, duties and directive principles.', 2),
    ('uppsc-pcs-polity-governance', 'constitution-institutions', 'Constitutional and Statutory Bodies', 'constitutional-statutory-bodies', 'Compare mandate, appointment, independence and accountability.', 3),
    ('uppsc-pcs-polity-governance', 'governance-public-policy', 'Governance and Accountability', 'governance-accountability', 'Connect citizen services, transparency and institutional accountability.', 1),
    ('uppsc-pcs-geography', 'india-world-geography', 'Physical Geography and Climate', 'physical-geography-climate', 'Understand processes before map-based facts.', 1),
    ('uppsc-pcs-geography', 'india-world-geography', 'Resources, Agriculture and Industry', 'resources-agriculture-industry', 'Connect location, resource conditions and economic activity.', 2),
    ('uppsc-pcs-geography', 'uttar-pradesh-geography', 'Rivers, Regions and Physical Features', 'rivers-regions-physical-features', 'Use maps to connect rivers, regions, soils and settlement patterns.', 1),
    ('uppsc-pcs-economy', 'indian-economy', 'Growth, Inflation and Public Finance', 'growth-inflation-public-finance', 'Learn terms, mechanisms and policy trade-offs together.', 1),
    ('uppsc-pcs-economy', 'indian-economy', 'Banking, Budget and External Sector', 'banking-budget-external-sector', 'Practise cause-and-effect instead of headline recall.', 2),
    ('uppsc-pcs-economy', 'uttar-pradesh-economy', 'UP Economy and Infrastructure', 'up-economy-infrastructure', 'Link sectors, infrastructure and state-development context.', 1),
    ('uppsc-pcs-environment', 'ecology-biodiversity', 'Ecosystems and Biodiversity', 'ecosystems-biodiversity', 'Master relationships among species, habitats and conservation.', 1),
    ('uppsc-pcs-environment', 'climate-environment', 'Climate Change and Disaster Basics', 'climate-change-disaster-basics', 'Understand causes, impacts, adaptation and disaster-risk terms.', 1),
    ('uppsc-pcs-science-tech', 'everyday-science', 'Physics, Chemistry and Biology in Daily Life', 'science-daily-life', 'Build clear concepts before one-line science facts.', 1),
    ('uppsc-pcs-science-tech', 'science-tech-public-issues', 'Technology and Public Applications', 'technology-public-applications', 'Study technology through its working, uses, benefits and limits.', 1),
    ('uppsc-pcs-up-special', 'up-history-culture-geography', 'UP History, Culture and Places', 'up-history-culture-places', 'Connect place, period, cultural contribution and map location.', 1),
    ('uppsc-pcs-up-special', 'up-economy-governance', 'UP Governance and Public Services', 'up-governance-public-services', 'Relate institutions and public services to citizens and outcomes.', 1),
    ('uppsc-pcs-csat-skills', 'comprehension-reasoning', 'Main Idea, Inference and Evidence', 'main-idea-inference-evidence', 'Read for claim, evidence and scope before choosing an option.', 1),
    ('uppsc-pcs-csat-skills', 'comprehension-reasoning', 'Statements, Conditions and Conclusions', 'statements-conditions-conclusions', 'Translate wording into conditions before making a judgement.', 2),
    ('uppsc-pcs-csat-skills', 'numeracy-data-interpretation', 'Percentages, Ratios and Averages', 'percentages-ratios-averages', 'Use base values and units to prevent calculation traps.', 1),
    ('uppsc-pcs-csat-skills', 'numeracy-data-interpretation', 'Tables, Charts and Data Decisions', 'tables-charts-data-decisions', 'Read the question first and calculate only what it asks.', 2)
) as t(subject_id, chapter_slug, name, slug, description, order_index)
  on c.subject_id = t.subject_id and c.slug = t.chapter_slug
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

create table if not exists public.current_affairs_briefs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  published_on date not null,
  title text not null,
  summary text not null,
  why_it_matters text not null,
  background text not null,
  source_title text not null,
  source_url text not null,
  source_publisher text,
  source_published_on date,
  prelims_takeaways jsonb not null default '[]'::jsonb,
  quick_check jsonb not null default '[]'::jsonb,
  visual_data jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists current_affairs_briefs_published_date_idx
  on public.current_affairs_briefs (published_on desc)
  where status = 'published';

create table if not exists public.current_affairs_exam_tags (
  brief_id uuid not null references public.current_affairs_briefs(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  primary key (brief_id, exam_id)
);

create table if not exists public.current_affairs_subject_tags (
  brief_id uuid not null references public.current_affairs_briefs(id) on delete cascade,
  subject_id text not null references public.subjects(id) on delete cascade,
  primary key (brief_id, subject_id)
);

create index if not exists current_affairs_exam_tags_exam_idx
  on public.current_affairs_exam_tags (exam_id);
create index if not exists current_affairs_subject_tags_subject_idx
  on public.current_affairs_subject_tags (subject_id);

alter table public.current_affairs_briefs enable row level security;
alter table public.current_affairs_exam_tags enable row level security;
alter table public.current_affairs_subject_tags enable row level security;

drop policy if exists "Published current-affairs briefs are public" on public.current_affairs_briefs;
create policy "Published current-affairs briefs are public"
  on public.current_affairs_briefs for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Published brief exam tags are public" on public.current_affairs_exam_tags;
create policy "Published brief exam tags are public"
  on public.current_affairs_exam_tags for select to anon, authenticated
  using (exists (
    select 1 from public.current_affairs_briefs b
    where b.id = brief_id and b.status = 'published'
  ));

drop policy if exists "Published brief subject tags are public" on public.current_affairs_subject_tags;
create policy "Published brief subject tags are public"
  on public.current_affairs_subject_tags for select to anon, authenticated
  using (exists (
    select 1 from public.current_affairs_briefs b
    where b.id = brief_id and b.status = 'published'
  ));
