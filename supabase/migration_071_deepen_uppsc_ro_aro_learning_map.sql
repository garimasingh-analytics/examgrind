-- Deepen the UPPSC RO/ARO learning map using the already-reviewed
-- Samiksha Adhikari written-preparation map as a syllabus-equivalent source.
--
-- Topic rows are copied into UPPSC RO/ARO's own chapter IDs. This keeps both
-- exams independently trackable: no learner attempt, completion or evidence
-- is shared between routes.
--
-- This covers the written-preparation foundation only. A specific UPPSC
-- notification remains the source of truth for its current scheme, dates,
-- eligibility and any skill test.

insert into public.topics (chapter_id, name, slug, description, order_index)
select target_chapter.id,
       source_topic.name,
       source_topic.slug,
       format('Learn %s as a focused UPPSC RO/ARO preparation unit, then practise and revisit it.', source_topic.name),
       source_topic.order_index
from public.chapters source_chapter
join public.topics source_topic on source_topic.chapter_id = source_chapter.id
join public.chapters target_chapter on target_chapter.slug = source_chapter.slug
join public.subjects target_subject on target_subject.id = target_chapter.subject_id
where source_chapter.subject_id in (
  'up-secretariat-gs',
  'up-secretariat-hindi',
  'up-secretariat-computer',
  'up-secretariat-reasoning'
)
and target_subject.id = replace(source_chapter.subject_id, 'up-secretariat-', 'uppsc-ro-')
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
