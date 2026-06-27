-- Migration 035 — SSC patch for 7 chapters whose names weren't visible during 034 authoring
-- ssc-ga: World History
-- ssc-quant: Heights & Distances, Mensuration (2D & 3D)
-- ssc-reasoning: Analogies, Cause & Effect, Classification (Odd one out), Cube & Dice
-- Applied 2026-06-24. All 4 SSC subjects now at exactly 6.0 topics per chapter.

with raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values
  ('ssc-ga','World History','Ancient Civilizations','ancient',1),
  ('ssc-ga','World History','Industrial Revolution','industrial',2),
  ('ssc-ga','World History','French & American Revolutions','revolutions',3),
  ('ssc-ga','World History','World Wars I & II','world-wars',4),
  ('ssc-ga','World History','Cold War & UN Formation','cold-war',5),
  ('ssc-ga','World History','Modern World Events','modern',6),

  ('ssc-quant','Heights & Distances','Angle of Elevation','elevation',1),
  ('ssc-quant','Heights & Distances','Angle of Depression','depression',2),
  ('ssc-quant','Heights & Distances','Tower Problems','tower',3),
  ('ssc-quant','Heights & Distances','Two-Tower Problems','two-tower',4),
  ('ssc-quant','Heights & Distances','Moving Object Problems','moving',5),
  ('ssc-quant','Heights & Distances','PYQ Patterns','pyq',6),

  ('ssc-quant','Mensuration (2D & 3D)','2D — Triangles & Quadrilaterals','2d-tri-quad',1),
  ('ssc-quant','Mensuration (2D & 3D)','2D — Circles & Sectors','2d-circles',2),
  ('ssc-quant','Mensuration (2D & 3D)','3D — Cube & Cuboid','3d-cube',3),
  ('ssc-quant','Mensuration (2D & 3D)','3D — Cylinder & Cone','3d-cyl-cone',4),
  ('ssc-quant','Mensuration (2D & 3D)','3D — Sphere & Hemisphere','3d-sphere',5),
  ('ssc-quant','Mensuration (2D & 3D)','Combined & Frustum','combined',6),

  ('ssc-reasoning','Analogies','Word Analogy','word',1),
  ('ssc-reasoning','Analogies','Number Analogy','number',2),
  ('ssc-reasoning','Analogies','Letter Analogy','letter',3),
  ('ssc-reasoning','Analogies','Choose the Pair','pair',4),
  ('ssc-reasoning','Analogies','Mixed Analogies','mixed',5),
  ('ssc-reasoning','Analogies','PYQ Patterns','pyq',6),

  ('ssc-reasoning','Cause & Effect','Direct Causation','direct',1),
  ('ssc-reasoning','Cause & Effect','Multi-Step Causation','multi-step',2),
  ('ssc-reasoning','Cause & Effect','Independent Events','independent',3),
  ('ssc-reasoning','Cause & Effect','Common Cause','common',4),
  ('ssc-reasoning','Cause & Effect','Effect-Without-Cause Logic','no-cause',5),
  ('ssc-reasoning','Cause & Effect','PYQ Patterns','pyq',6),

  ('ssc-reasoning','Classification (Odd one out)','Word Odd-One-Out','word',1),
  ('ssc-reasoning','Classification (Odd one out)','Number Odd-One-Out','number',2),
  ('ssc-reasoning','Classification (Odd one out)','Letter Odd-One-Out','letter',3),
  ('ssc-reasoning','Classification (Odd one out)','Pair Odd-One-Out','pair',4),
  ('ssc-reasoning','Classification (Odd one out)','Mixed Classification','mixed',5),
  ('ssc-reasoning','Classification (Odd one out)','PYQ Patterns','pyq',6),

  ('ssc-reasoning','Cube & Dice','Standard Dice Faces','faces',1),
  ('ssc-reasoning','Cube & Dice','Opposite-Side Logic','opposite',2),
  ('ssc-reasoning','Cube & Dice','Painted Cube Counting','painted',3),
  ('ssc-reasoning','Cube & Dice','Cut-Cube Problems','cut-cube',4),
  ('ssc-reasoning','Cube & Dice','Two-Dice Probability','two-dice',5),
  ('ssc-reasoning','Cube & Dice','PYQ Patterns','pyq',6)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name),
       r.ord
from raw r
join public.chapters c on c.name = r.chapter_name
join public.subjects s on s.id = c.subject_id and s.id = r.subject_id
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
