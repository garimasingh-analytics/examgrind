-- Migration 008: SSC CGL Tier 1 + Tier 2 syllabus
--
-- Seeds the full SSC CGL syllabus into subjects + chapters.
-- 4 subjects (Quant, Reasoning, English, GA) covering the standard
-- SSC CGL Tier 1 + Tier 2 pattern. Topics get added closer to launch
-- (August 2026) once we lock our question authoring pipeline.
--
-- Slug strategy: prefix every subject with `ssc-` to avoid collisions
-- with CUET's `physics`, `chemistry`, etc. The exam_id foreign key
-- keeps things tidy in queries.
--
-- Run with: paste into Supabase SQL Editor
-- Reversibility: delete from subjects where exam_id = (select id from exams where slug='ssc-cgl');

-- 1) Subjects -------------------------------------------------------------
insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  ('ssc-quant',     'Quantitative Aptitude', (select id from exams where slug='ssc-cgl'), '∑',  1, 'Arithmetic, algebra, geometry, trigonometry, data interpretation'),
  ('ssc-reasoning', 'General Intelligence & Reasoning', (select id from exams where slug='ssc-cgl'), '🧩', 2, 'Verbal, non-verbal, analytical and logical reasoning'),
  ('ssc-english',   'English Language & Comprehension', (select id from exams where slug='ssc-cgl'), '🔤', 3, 'Grammar, vocabulary, reading comprehension, error spotting'),
  ('ssc-ga',        'General Awareness', (select id from exams where slug='ssc-cgl'), '🌍', 4, 'Current affairs, history, geography, polity, economics, science')
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  description = excluded.description,
  icon = excluded.icon,
  order_index = excluded.order_index;

-- 2) Chapters: Quantitative Aptitude --------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('ssc-quant', 'Number Systems',           'number-systems',         1),
  ('ssc-quant', 'Simplification & Approximation', 'simplification',   2),
  ('ssc-quant', 'Percentages',              'percentages',            3),
  ('ssc-quant', 'Profit, Loss & Discount',  'profit-loss',            4),
  ('ssc-quant', 'Ratio & Proportion',       'ratio-proportion',       5),
  ('ssc-quant', 'Average',                  'average',                6),
  ('ssc-quant', 'Time, Speed & Distance',   'time-speed-distance',    7),
  ('ssc-quant', 'Time & Work',              'time-work',              8),
  ('ssc-quant', 'Simple & Compound Interest', 'interest',             9),
  ('ssc-quant', 'Mixtures & Alligation',    'mixtures-alligation',   10),
  ('ssc-quant', 'Algebra',                  'algebra',               11),
  ('ssc-quant', 'Geometry',                 'geometry',              12),
  ('ssc-quant', 'Mensuration (2D & 3D)',    'mensuration',           13),
  ('ssc-quant', 'Trigonometry',             'trigonometry',          14),
  ('ssc-quant', 'Heights & Distances',      'heights-distances',     15),
  ('ssc-quant', 'Data Interpretation',      'data-interpretation',   16),
  ('ssc-quant', 'Statistics & Probability', 'statistics',            17)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

-- 3) Chapters: Reasoning --------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('ssc-reasoning', 'Analogies',                    'analogies',           1),
  ('ssc-reasoning', 'Classification (Odd one out)', 'classification',      2),
  ('ssc-reasoning', 'Series (Number, Letter, Mixed)', 'series',            3),
  ('ssc-reasoning', 'Coding-Decoding',              'coding-decoding',     4),
  ('ssc-reasoning', 'Blood Relations',              'blood-relations',     5),
  ('ssc-reasoning', 'Direction Sense',              'direction-sense',     6),
  ('ssc-reasoning', 'Ranking & Order',              'ranking-order',       7),
  ('ssc-reasoning', 'Seating Arrangement',          'seating-arrangement', 8),
  ('ssc-reasoning', 'Syllogism',                    'syllogism',           9),
  ('ssc-reasoning', 'Statement & Conclusion',       'statement-conclusion',10),
  ('ssc-reasoning', 'Statement & Assumption',       'statement-assumption',11),
  ('ssc-reasoning', 'Statement & Argument',         'statement-argument',  12),
  ('ssc-reasoning', 'Cause & Effect',               'cause-effect',        13),
  ('ssc-reasoning', 'Mirror & Water Images',        'mirror-water-images', 14),
  ('ssc-reasoning', 'Paper Folding & Cutting',      'paper-folding',       15),
  ('ssc-reasoning', 'Figure Counting',              'figure-counting',     16),
  ('ssc-reasoning', 'Embedded Figures',             'embedded-figures',    17),
  ('ssc-reasoning', 'Cube & Dice',                  'cube-dice',           18),
  ('ssc-reasoning', 'Venn Diagrams',                'venn-diagrams',       19)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

-- 4) Chapters: English ----------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('ssc-english', 'Reading Comprehension',     'reading-comprehension', 1),
  ('ssc-english', 'Cloze Test',                'cloze-test',            2),
  ('ssc-english', 'Para Jumbles',              'para-jumbles',          3),
  ('ssc-english', 'Spotting Errors',           'spotting-errors',       4),
  ('ssc-english', 'Sentence Improvement',      'sentence-improvement',  5),
  ('ssc-english', 'Sentence Completion',       'sentence-completion',   6),
  ('ssc-english', 'Active & Passive Voice',    'active-passive',        7),
  ('ssc-english', 'Direct & Indirect Speech',  'direct-indirect',       8),
  ('ssc-english', 'Synonyms & Antonyms',       'synonyms-antonyms',     9),
  ('ssc-english', 'One Word Substitution',     'one-word-substitution', 10),
  ('ssc-english', 'Idioms & Phrases',          'idioms-phrases',        11),
  ('ssc-english', 'Spellings',                 'spellings',             12),
  ('ssc-english', 'Fill in the Blanks',        'fill-in-blanks',        13)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

-- 5) Chapters: General Awareness ------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('ssc-ga', 'Indian History',           'indian-history',     1),
  ('ssc-ga', 'World History',            'world-history',      2),
  ('ssc-ga', 'Indian Geography',         'indian-geography',   3),
  ('ssc-ga', 'World Geography',          'world-geography',    4),
  ('ssc-ga', 'Indian Polity',            'indian-polity',      5),
  ('ssc-ga', 'Indian Economy',           'indian-economy',     6),
  ('ssc-ga', 'General Science: Physics', 'science-physics',    7),
  ('ssc-ga', 'General Science: Chemistry', 'science-chemistry', 8),
  ('ssc-ga', 'General Science: Biology', 'science-biology',    9),
  ('ssc-ga', 'Computer Awareness',       'computer-awareness', 10),
  ('ssc-ga', 'Current Affairs',          'current-affairs',    11),
  ('ssc-ga', 'Static GK',                'static-gk',          12),
  ('ssc-ga', 'Books & Authors',          'books-authors',      13),
  ('ssc-ga', 'Awards & Honours',         'awards-honours',     14),
  ('ssc-ga', 'Sports',                   'sports',             15),
  ('ssc-ga', 'Important Days',           'important-days',     16)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

-- Done. Verify with:
--   select s.name as subject, count(c.id) as chapters from subjects s
--     left join chapters c on c.subject_id = s.id
--    where s.exam_id = (select id from exams where slug='ssc-cgl')
--    group by s.name order by s.name;
