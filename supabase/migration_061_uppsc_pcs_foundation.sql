-- UPPSC PCS foundation, prepared for founder review.
--
-- The source record distinguishes the official 2026 PCS route and recent
-- UPPSC paper archive from the original ExamGrind learning structure below.
-- Nothing here claims that a future notification will use this exact practice
-- structure, marking scheme or timing. Keep the exam and mock inactive until
-- the final source-and-founder review is complete.

insert into public.exams (slug, name, status, description, display_order, hero_color)
values (
  'uppsc-pcs',
  'UPPSC PCS',
  'coming_soon',
  'An official-source-first foundation route for General Studies, CSAT skills and Uttar Pradesh context.',
  100,
  'moss'
)
on conflict (slug) do update set
  name = excluded.name,
  status = excluded.status,
  description = excluded.description,
  display_order = excluded.display_order,
  hero_color = excluded.hero_color;

insert into public.exam_reference_sources (exam_id, title, source_url, source_type, checked_at, notes)
select e.id, s.title, s.source_url, s.source_type, s.checked_at, s.notes
from public.exams e
join (
  values
    (
      'uppsc-pcs',
      'UPPSC official notification board',
      'https://uppsc.up.nic.in/Default.aspx/CandidatePages/Notifications.aspx',
      'official_portal',
      date '2026-08-28',
      'The UPPSC portal listed the Combined State / Upper Subordinate Services (PCS) (General/Special Recruitment) Examination 2026. Verify any current application, date, eligibility or scheme detail against the live official notice.'
    ),
    (
      'uppsc-pcs',
      'UPPSC previous question-paper desk',
      'https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues',
      'official_scheme',
      date '2026-08-28',
      'The official archive lists PCS Preliminary General Studies I and II papers and PCS Mains papers. It is evidence for study design, not a promise that a later cycle is identical.'
    )
) as s(exam_slug, title, source_url, source_type, checked_at, notes)
  on e.slug = s.exam_slug
on conflict (exam_id, source_url) do update set
  title = excluded.title,
  source_type = excluded.source_type,
  checked_at = excluded.checked_at,
  notes = excluded.notes;

insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  (
    'uppsc-pcs-gs',
    'General Studies Foundation',
    (select id from public.exams where slug = 'uppsc-pcs'),
    '🗺️',
    1,
    'History, polity, geography, economy, science, environment and issue-based General Studies foundations.'
  ),
  (
    'uppsc-pcs-csat',
    'General Studies II / CSAT Skills',
    (select id from public.exams where slug = 'uppsc-pcs'),
    '🧩',
    2,
    'Comprehension, reasoning, decision-making and elementary numeracy practice with visible working.'
  ),
  (
    'uppsc-pcs-up-context',
    'Uttar Pradesh Context',
    (select id from public.exams where slug = 'uppsc-pcs'),
    '🏛️',
    3,
    'Uttar Pradesh geography, history, public issues and contextual revision links.'
  )
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  icon = excluded.icon,
  order_index = excluded.order_index,
  description = excluded.description;

with chapter_seed(subject_id, name, slug, order_index) as (values
  ('uppsc-pcs-gs', 'Indian Polity and Governance', 'indian-polity-governance', 1),
  ('uppsc-pcs-gs', 'History, Culture and Society', 'history-culture-society', 2),
  ('uppsc-pcs-gs', 'Geography, Economy and Environment', 'geography-economy-environment', 3),
  ('uppsc-pcs-gs', 'Science, Technology and Public Issues', 'science-tech-public-issues', 4),
  ('uppsc-pcs-csat', 'Reading and Comprehension', 'reading-comprehension', 1),
  ('uppsc-pcs-csat', 'Logic, Decisions and Conditions', 'logic-decisions-conditions', 2),
  ('uppsc-pcs-csat', 'Numeracy and Data Interpretation', 'numeracy-data-interpretation', 3),
  ('uppsc-pcs-up-context', 'UP Geography and Rivers', 'up-geography-rivers', 1),
  ('uppsc-pcs-up-context', 'UP History and Culture', 'up-history-culture', 2),
  ('uppsc-pcs-up-context', 'UP Economy, Governance and Infrastructure', 'up-economy-governance', 3),
  ('uppsc-pcs-up-context', 'Current-Issue Revision Method', 'current-issue-revision', 4)
)
insert into public.chapters (subject_id, name, slug, order_index)
select subject_id, name, slug, order_index from chapter_seed
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

with topic_seed(subject_id, chapter_slug, name, slug, order_index) as (values
  ('uppsc-pcs-gs', 'indian-polity-governance', 'Constitutional Framework', 'constitutional-framework', 1),
  ('uppsc-pcs-gs', 'indian-polity-governance', 'Rights, Duties and Directive Principles', 'rights-duties-directives', 2),
  ('uppsc-pcs-gs', 'indian-polity-governance', 'Constitutional Bodies', 'constitutional-bodies', 3),
  ('uppsc-pcs-gs', 'history-culture-society', 'Modern Indian History', 'modern-indian-history', 1),
  ('uppsc-pcs-gs', 'history-culture-society', 'Art, Culture and Heritage', 'art-culture-heritage', 2),
  ('uppsc-pcs-gs', 'history-culture-society', 'Society and Social Issues', 'society-social-issues', 3),
  ('uppsc-pcs-gs', 'geography-economy-environment', 'Indian Physical Geography', 'indian-physical-geography', 1),
  ('uppsc-pcs-gs', 'geography-economy-environment', 'Indian Economy Basics', 'indian-economy-basics', 2),
  ('uppsc-pcs-gs', 'geography-economy-environment', 'Environment and Sustainability', 'environment-sustainability', 3),
  ('uppsc-pcs-gs', 'science-tech-public-issues', 'Everyday Science', 'everyday-science', 1),
  ('uppsc-pcs-gs', 'science-tech-public-issues', 'Science and Technology Awareness', 'science-technology-awareness', 2),
  ('uppsc-pcs-gs', 'science-tech-public-issues', 'Public-Issue Analysis', 'public-issue-analysis', 3),
  ('uppsc-pcs-csat', 'reading-comprehension', 'Main Idea and Scope', 'main-idea-scope', 1),
  ('uppsc-pcs-csat', 'reading-comprehension', 'Inference and Evidence', 'inference-evidence', 2),
  ('uppsc-pcs-csat', 'reading-comprehension', 'Question Selection Under Time', 'question-selection-time', 3),
  ('uppsc-pcs-csat', 'logic-decisions-conditions', 'Statement and Conclusion', 'statement-conclusion', 1),
  ('uppsc-pcs-csat', 'logic-decisions-conditions', 'Venn and Set Logic', 'venn-set-logic', 2),
  ('uppsc-pcs-csat', 'logic-decisions-conditions', 'Condition-First Reasoning', 'condition-first-reasoning', 3),
  ('uppsc-pcs-csat', 'numeracy-data-interpretation', 'Percentage Change', 'percentage-change', 1),
  ('uppsc-pcs-csat', 'numeracy-data-interpretation', 'Ratio and Average', 'ratio-average', 2),
  ('uppsc-pcs-csat', 'numeracy-data-interpretation', 'Table and Chart Reading', 'table-chart-reading', 3),
  ('uppsc-pcs-up-context', 'up-geography-rivers', 'River Systems and Locations', 'river-systems-locations', 1),
  ('uppsc-pcs-up-context', 'up-geography-rivers', 'Regions and Physical Features', 'regions-physical-features', 2),
  ('uppsc-pcs-up-context', 'up-history-culture', 'Historical Milestones', 'historical-milestones', 1),
  ('uppsc-pcs-up-context', 'up-history-culture', 'Culture, Places and Heritage', 'culture-places-heritage', 2),
  ('uppsc-pcs-up-context', 'up-economy-governance', 'Economy and Infrastructure', 'economy-infrastructure', 1),
  ('uppsc-pcs-up-context', 'up-economy-governance', 'Governance and Public Services', 'governance-public-services', 2),
  ('uppsc-pcs-up-context', 'current-issue-revision', 'Issue Log and Source Check', 'issue-log-source-check', 1),
  ('uppsc-pcs-up-context', 'current-issue-revision', 'Static Link Revision', 'static-link-revision', 2)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, t.name, t.slug,
       format('Build %s with focused practice, visible working and a clear revision note.', t.name),
       t.order_index
from topic_seed t
join public.chapters c on c.subject_id = t.subject_id and c.slug = t.chapter_slug
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

insert into public.mock_tests (
  exam_id, subject_id, slug, display_name, description,
  duration_seconds, total_questions, positive_marks, negative_marks,
  sections, is_free_sample, is_active
)
select
  e.id,
  null::text,
  'uppsc-pcs-foundation-practice',
  'UPPSC PCS · Foundation Practice',
  '40 original questions across General Studies, CSAT skills and Uttar Pradesh context. This is an ExamGrind learning foundation, not a prediction of any official paper format, marks or timing.',
  2100,
  40,
  1,
  0,
  jsonb_build_array(
    jsonb_build_object('name', 'General Studies Foundation', 'questions', 18, 'subject_slug', 'uppsc-pcs-gs'),
    jsonb_build_object('name', 'General Studies II / CSAT Skills', 'questions', 16, 'subject_slug', 'uppsc-pcs-csat'),
    jsonb_build_object('name', 'Uttar Pradesh Context', 'questions', 6, 'subject_slug', 'uppsc-pcs-up-context')
  ),
  true,
  false
from public.exams e
where e.slug = 'uppsc-pcs'
on conflict (exam_id, slug) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  duration_seconds = excluded.duration_seconds,
  total_questions = excluded.total_questions,
  positive_marks = excluded.positive_marks,
  negative_marks = excluded.negative_marks,
  sections = excluded.sections,
  is_free_sample = excluded.is_free_sample,
  is_active = excluded.is_active;
