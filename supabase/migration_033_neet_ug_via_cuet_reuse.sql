-- Migration 033 — NEET UG topic depth via CUET reuse
-- Strategy: 75% of NEET chapters share names with CUET (just "and" vs "&" diff).
-- Copy CUET topics to NEET via normalized name match for 44 chapters.
-- Then explicit mapping for 14 near-matches + fresh authoring for 1 NEET-only chapter.
-- Applied successfully 2026-06-24 — all 59 NEET chapters seeded (Bio 10/60, Chem 30/181, Phys 19/118).

-- 1) Clear placeholder topics
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id in ('neet-physics','neet-chemistry','neet-biology');

-- 2) Auto-copy from CUET via normalized name match (44 chapters x 6 topics = 264 rows)
insert into public.topics (chapter_id, name, slug, description, order_index)
select neet_c.id, src_t.name, src_t.slug,
       format('Practice questions on %s within %s.', src_t.name, neet_c.name),
       src_t.order_index
from public.subjects neet_s
join public.chapters neet_c on neet_c.subject_id = neet_s.id
join public.chapters cuet_c on
     cuet_c.subject_id = case neet_s.id
       when 'neet-physics' then 'physics'
       when 'neet-chemistry' then 'chemistry'
       when 'neet-biology' then 'biology' end
     and replace(lower(cuet_c.name), '&', 'and') = replace(lower(neet_c.name), '&', 'and')
join public.topics src_t on src_t.chapter_id = cuet_c.id
where neet_s.id in ('neet-physics','neet-chemistry','neet-biology')
on conflict (chapter_id, slug) do nothing;

-- 3) Explicit mapping for 14 near-matches (84 rows)
with manual_map(neet_subj, neet_name, cuet_subj, cuet_name) as (values
  ('neet-biology', 'Biology and Human Welfare', 'biology', 'Biology in Human Welfare'),
  ('neet-biology', 'Biotechnology and its Applications', 'biology', 'Biotechnology'),
  ('neet-biology', 'Cell Structure and Function', 'biology', 'Cell — Structure and Function'),
  ('neet-biology', 'Diversity in Living World', 'biology', 'Diversity in the Living World'),
  ('neet-biology', 'Structural Organisation in Animals & Plants', 'biology', 'Structural Organisation in Plants and Animals'),
  ('neet-chemistry', 'Classification of Elements & Periodicity', 'chemistry', 'Classification & Periodicity'),
  ('neet-chemistry', 'd- and f-Block Elements', 'chemistry', 'd & f Block Elements'),
  ('neet-chemistry', 'p-Block Elements (Group 13-14)', 'chemistry', 'p-Block Elements (Class 11)'),
  ('neet-chemistry', 'p-Block Elements (Group 15-18)', 'chemistry', 'p-Block Elements (Class 12)'),
  ('neet-chemistry', 'States of Matter (Gases & Liquids)', 'chemistry', 'States of Matter'),
  ('neet-chemistry', 'Thermodynamics', 'chemistry', 'Chemical Thermodynamics'),
  ('neet-physics', 'Electronic Devices (Semiconductors)', 'physics', 'Electronic Devices'),
  ('neet-physics', 'Motion of System of Particles and Rigid Body', 'physics', 'Motion of System of Particles'),
  ('neet-physics', 'Optics (Ray + Wave)', 'physics', 'Optics')
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select neet_c.id, src_t.name, src_t.slug,
       format('Practice questions on %s within %s.', src_t.name, neet_c.name),
       src_t.order_index
from manual_map mm
join public.chapters neet_c on neet_c.name = mm.neet_name
  and neet_c.subject_id = mm.neet_subj
join public.chapters cuet_c on cuet_c.name = mm.cuet_name
  and cuet_c.subject_id = mm.cuet_subj
join public.topics src_t on src_t.chapter_id = cuet_c.id
on conflict (chapter_id, slug) do nothing;

-- 4) Fresh topics for "General Principles of Isolation of Elements" (6 rows)
insert into public.topics (chapter_id, name, slug, description, order_index)
select neet_c.id, t.topic_name, t.topic_slug,
       format('Practice questions on %s within %s.', t.topic_name, neet_c.name),
       t.ord
from public.chapters neet_c
cross join (values
  ('Occurrence & Principles of Extraction', 'occurrence', 1),
  ('Concentration of Ore', 'concentration', 2),
  ('Roasting, Calcination & Reduction', 'roasting', 3),
  ('Electrolytic Reduction', 'electrolytic', 4),
  ('Refining & Purification of Metals', 'refining', 5),
  ('Thermodynamic Principles (Ellingham)', 'ellingham', 6)
) as t(topic_name, topic_slug, ord)
where neet_c.name = 'General Principles of Isolation of Elements'
  and neet_c.subject_id = 'neet-chemistry'
on conflict (chapter_id, slug) do nothing;
