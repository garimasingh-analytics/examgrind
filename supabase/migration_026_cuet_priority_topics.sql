-- Migration 026 — CUET priority subject topic rebuild (English + General Test)
--
-- Migration 012 seeded a generic 5-topic template ("Concepts & Definitions /
-- Worked Examples / Formulae & Shortcuts / Common Mistakes / Mixed Practice")
-- across ALL 319 CUET chapters. Migration 014 fixed SSC CGL + NEET UG but
-- explicitly skipped CUET — leaving the entire CUET experience on placeholder
-- topics. Audit on 2026-06-22 showed 319 / 322 CUET chapters still on the
-- generic 5-topic template. Unlaunchable.
--
-- This migration is PHASE 1 of the CUET rebuild — targeting only the two
-- universal-uptake subjects (every CUET student takes English + General Test,
-- regardless of stream). Phase 2 migrations (027, 028, ...) will tackle the
-- domain subjects.
--
-- Approach:
--   1. Delete the generic 5-topic template ONLY for English + General Test
--      chapters. user_topic_mastery cascades — acceptable pre-launch since
--      no real users have engaged with these placeholder topics meaningfully.
--   2. Insert real NCERT-aligned per-chapter sub-topics. Each chapter gets
--      6 sub-topics chosen to match how CUET aspirants actually study (PYQ
--      patterns + standard prep-book divisions).
--
-- Run with: paste into Supabase SQL Editor. Click 'Run query' when prompted
-- about destructive operations.
-- Reversibility: re-running migration 012 would NOT recreate the placeholder
-- topics for these subjects (012 is INSERT only). To restore the generic
-- template, you'd need to delete the new rows and re-INSERT the 5 generic
-- topics via a custom rollback.

-- 1) Delete generic placeholders for English + General Test ----------------
delete from public.topics t
 using public.chapters c, public.subjects s, public.exams e
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.exam_id    = e.id
   and e.slug       = 'cuet'
   and s.id        in ('english', 'general')
   and t.slug      in ('concepts','worked','formulae','common-mistakes','mixed');

-- 2) Seed real per-chapter sub-topics --------------------------------------
-- Pattern: (subject_id, chapter_slug, topic_name, topic_slug, order_index).
-- Joined to chapters by (subject_id, chapter_slug) so this is idempotent.
with raw(subject_id, chapter_slug, topic_name, topic_slug, ord) as (values

  -- ============ ENGLISH LANGUAGE & COMPREHENSION (8 chapters × 6 topics) ============

  -- Reading Comprehension (Factual): non-fiction passages, info extraction
  ('english', 'rc-factual', 'Main Idea & Central Theme',       'main-idea',        1),
  ('english', 'rc-factual', 'Inference & Implication',         'inference',        2),
  ('english', 'rc-factual', 'Detail-Based Questions',          'detail',           3),
  ('english', 'rc-factual', 'Author''s Tone & Purpose',        'tone-purpose',     4),
  ('english', 'rc-factual', 'Vocabulary in the Passage',       'vocab-passage',    5),
  ('english', 'rc-factual', 'Title, Summary & Conclusion',     'title-summary',    6),

  -- Reading Comprehension (Literary): fiction/poetry/excerpts
  ('english', 'rc-literary', 'Character Analysis',              'character',        1),
  ('english', 'rc-literary', 'Theme & Message',                 'theme',            2),
  ('english', 'rc-literary', 'Literary Devices (Metaphor, Simile, Personification)', 'devices', 3),
  ('english', 'rc-literary', 'Tone & Mood',                     'tone-mood',        4),
  ('english', 'rc-literary', 'Symbolism & Imagery',             'symbolism',        5),
  ('english', 'rc-literary', 'Inference from Subtext',          'subtext',          6),

  -- Grammar & Sentence Structure
  ('english', 'grammar', 'Subject–Verb Agreement',          'subject-verb',     1),
  ('english', 'grammar', 'Tense & Aspect',                  'tense',            2),
  ('english', 'grammar', 'Active & Passive Voice',          'voice',            3),
  ('english', 'grammar', 'Direct & Indirect Speech',        'speech',           4),
  ('english', 'grammar', 'Articles, Determiners & Prepositions', 'articles',    5),
  ('english', 'grammar', 'Modifiers & Parallelism',         'modifiers',        6),

  -- Idioms & Phrases
  ('english', 'idioms-phrases', 'Common Idioms (Daily Use)',       'common',           1),
  ('english', 'idioms-phrases', 'Phrasal Verbs',                   'phrasal-verbs',    2),
  ('english', 'idioms-phrases', 'Body-Part Idioms (head, heart, hand)', 'body-part',  3),
  ('english', 'idioms-phrases', 'Animal & Colour Idioms',          'animal-colour',    4),
  ('english', 'idioms-phrases', 'Origin-Based Idioms',             'origin',           5),
  ('english', 'idioms-phrases', 'Contextual Usage in Sentences',   'context-usage',    6),

  -- One-Word Substitution
  ('english', 'one-word', 'People & Personality',             'people',           1),
  ('english', 'one-word', 'Government & Politics',            'government',       2),
  ('english', 'one-word', 'Religion & Belief',                'religion',         3),
  ('english', 'one-word', 'Phobias & Manias',                 'phobias',          4),
  ('english', 'one-word', 'Place & Location',                 'place',            5),
  ('english', 'one-word', 'Action & Behaviour',               'action',           6),

  -- Synonyms & Antonyms
  ('english', 'synonyms-antonyms', 'Common Word Pairs',          'common-pairs',     1),
  ('english', 'synonyms-antonyms', 'Latin & Greek Root Words',   'roots',            2),
  ('english', 'synonyms-antonyms', 'Shades of Meaning',          'shades',           3),
  ('english', 'synonyms-antonyms', 'Formal vs Informal Register', 'register',        4),
  ('english', 'synonyms-antonyms', 'Literary Vocabulary',        'literary',         5),
  ('english', 'synonyms-antonyms', 'High-Frequency PYQ Words',   'pyq-words',        6),

  -- Verbal Ability
  ('english', 'verbal-ability', 'Sentence Correction',           'correction',       1),
  ('english', 'verbal-ability', 'Sentence Improvement',          'improvement',      2),
  ('english', 'verbal-ability', 'Para Jumbles',                  'para-jumbles',     3),
  ('english', 'verbal-ability', 'Cloze Tests',                   'cloze',            4),
  ('english', 'verbal-ability', 'Fill in the Blanks',            'fill-blanks',      5),
  ('english', 'verbal-ability', 'Spotting Errors',               'spotting',         6),

  -- Vocabulary in Context
  ('english', 'vocab-context', 'Inferring Meaning from Context', 'infer-context',    1),
  ('english', 'vocab-context', 'Confusing Word Pairs (affect/effect, lie/lay)', 'confusing', 2),
  ('english', 'vocab-context', 'Connotation & Denotation',       'connotation',      3),
  ('english', 'vocab-context', 'Register Awareness',             'register',         4),
  ('english', 'vocab-context', 'Idiomatic vs Literal Meaning',   'idiomatic',        5),
  ('english', 'vocab-context', 'Word Roots & Prefixes',          'prefixes',         6),

  -- ============ GENERAL TEST (6 chapters × 6 topics) ============

  -- Current Affairs (rolling 12-month window)
  ('general', 'current-affairs', 'National Affairs',              'national',         1),
  ('general', 'current-affairs', 'International Affairs',         'international',    2),
  ('general', 'current-affairs', 'Economy & Business',            'economy',          3),
  ('general', 'current-affairs', 'Sports & Awards',               'sports-awards',    4),
  ('general', 'current-affairs', 'Science & Technology',          'sci-tech',         5),
  ('general', 'current-affairs', 'Government Schemes & Policies', 'schemes',          6),

  -- General Knowledge (static)
  ('general', 'gk', 'Indian History (Ancient to Modern)',    'history',          1),
  ('general', 'gk', 'Geography (India + World)',             'geography',        2),
  ('general', 'gk', 'Indian Polity & Constitution',          'polity',           3),
  ('general', 'gk', 'Indian Economy Basics',                 'economy',          4),
  ('general', 'gk', 'Static GK (Books, Authors, Capitals)',  'static',           5),
  ('general', 'gk', 'Art, Culture & Heritage',               'art-culture',      6),

  -- Logical & Analytical Reasoning
  ('general', 'logical-reasoning', 'Syllogisms',                  'syllogisms',       1),
  ('general', 'logical-reasoning', 'Statement & Assumption',      'assumption',       2),
  ('general', 'logical-reasoning', 'Cause & Effect',              'cause-effect',     3),
  ('general', 'logical-reasoning', 'Logical Sequences',           'sequences',        4),
  ('general', 'logical-reasoning', 'Coding–Decoding',             'coding',           5),
  ('general', 'logical-reasoning', 'Blood Relations',             'blood-relations',  6),

  -- General Mental Ability
  ('general', 'mental-ability', 'Series Completion',              'series',           1),
  ('general', 'mental-ability', 'Analogies',                      'analogies',        2),
  ('general', 'mental-ability', 'Odd One Out',                    'odd-one-out',      3),
  ('general', 'mental-ability', 'Classification',                 'classification',   4),
  ('general', 'mental-ability', 'Pattern Recognition',            'patterns',         5),
  ('general', 'mental-ability', 'Mirror & Water Images',          'mirror-water',     6),

  -- Numerical Ability
  ('general', 'numerical-ability', 'Percentages & Ratios',         'percentages',      1),
  ('general', 'numerical-ability', 'Profit & Loss',                'profit-loss',      2),
  ('general', 'numerical-ability', 'Simple & Compound Interest',   'interest',         3),
  ('general', 'numerical-ability', 'Time, Speed & Distance',       'time-distance',    4),
  ('general', 'numerical-ability', 'Time & Work',                  'time-work',        5),
  ('general', 'numerical-ability', 'Averages & Mixtures',          'averages',         6),

  -- Quantitative Reasoning
  ('general', 'quant-reasoning', 'Number Series',                  'number-series',    1),
  ('general', 'quant-reasoning', 'Data Interpretation (Tables)',   'di-tables',        2),
  ('general', 'quant-reasoning', 'Data Interpretation (Graphs)',   'di-graphs',        3),
  ('general', 'quant-reasoning', 'Direction Sense',                'direction',        4),
  ('general', 'quant-reasoning', 'Seating Arrangement',            'seating',          5),
  ('general', 'quant-reasoning', 'Calendar & Clock',               'calendar-clock',   6)

)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name) as description,
       r.ord
from raw r
join public.chapters c on c.slug = r.chapter_slug
join public.subjects s on s.id = c.subject_id and s.id = r.subject_id
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

-- Verify with:
--   select s.name, c.name, count(t.id) as topics
--     from chapters c
--     join subjects s on s.id = c.subject_id
--     join exams e on e.id = s.exam_id
--     left join topics t on t.chapter_id = c.id
--    where e.slug = 'cuet' and s.id in ('english', 'general')
--    group by s.name, c.name
--    order by s.name, c.name;
--   -- expect: each chapter shows 6 topics
