-- Complete the chapters added in migration 064 that did not yet have
-- drill-down topics. This is an original learning map for Delhi Police
-- Constable objective practice, not a claim about a notification-specific
-- paper pattern.

with raw(subject_id, chapter_slug, name, slug, ord) as (values
  ('dp-reasoning', 'directions-distance', 'Compass Directions & Turns', 'compass-directions-turns', 1),
  ('dp-reasoning', 'directions-distance', 'Distance and Final Position', 'distance-final-position', 2),
  ('dp-reasoning', 'blood-relations', 'Family-tree Relations', 'family-tree-relations', 1),
  ('dp-reasoning', 'blood-relations', 'Coded and Pointing Relations', 'coded-pointing-relations', 2),
  ('dp-reasoning', 'ranking-order-seating', 'Rank and Position', 'rank-position', 1),
  ('dp-reasoning', 'ranking-order-seating', 'Linear and Circular Seating', 'linear-circular-seating', 2),
  ('dp-reasoning', 'ranking-order-seating', 'Order-based Conditions', 'order-based-conditions', 3),
  ('dp-reasoning', 'venn-set-relations', 'Set Overlap and Classification', 'set-overlap-classification', 1),
  ('dp-reasoning', 'venn-set-relations', 'Counting in Venn Diagrams', 'venn-counting', 2),
  ('dp-reasoning', 'syllogism-statement-logic', 'Syllogism and Possibility', 'syllogism-possibility', 1),
  ('dp-reasoning', 'syllogism-statement-logic', 'Statements and Assumptions', 'statements-assumptions', 2),
  ('dp-reasoning', 'syllogism-statement-logic', 'Conclusions and Arguments', 'conclusions-arguments', 3),
  ('dp-reasoning', 'figure-analogy-classification', 'Figure Analogies', 'figure-analogies', 1),
  ('dp-reasoning', 'figure-analogy-classification', 'Figure Classification', 'figure-classification', 2),
  ('dp-reasoning', 'mirror-water-embedded-figures', 'Mirror and Water Images', 'mirror-water-images', 1),
  ('dp-reasoning', 'mirror-water-embedded-figures', 'Embedded Figure Recognition', 'embedded-figure-recognition', 2),
  ('dp-reasoning', 'paper-folding-cube-dice', 'Paper Folding and Cutting', 'paper-folding-cutting', 1),
  ('dp-reasoning', 'paper-folding-cube-dice', 'Cube and Dice Rules', 'cube-dice-rules', 2),
  ('dp-quant', 'ratio-proportion-partnership', 'Ratio and Proportion', 'ratio-proportion', 1),
  ('dp-quant', 'ratio-proportion-partnership', 'Partnership and Distribution', 'partnership-distribution', 2),
  ('dp-quant', 'time-speed-distance', 'Speed, Time and Distance', 'speed-time-distance', 1),
  ('dp-quant', 'time-speed-distance', 'Relative Speed', 'relative-speed', 2),
  ('dp-quant', 'trains-boats-streams', 'Trains and Platform Problems', 'trains-platforms', 1),
  ('dp-quant', 'trains-boats-streams', 'Boats and Streams', 'boats-streams', 2),
  ('dp-quant', 'trains-boats-streams', 'Average Speed Applications', 'average-speed-applications', 3)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.name, r.slug,
       format('Build %s for Delhi Police Constable objective practice.', r.name), r.ord
from raw r
join public.chapters c on c.subject_id = r.subject_id and c.slug = r.chapter_slug
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
