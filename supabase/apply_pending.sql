-- ===========================================================================
-- APPLY-PENDING — combined migration 025 + 026 in one paste.
-- Both are idempotent (IF NOT EXISTS / ON CONFLICT DO UPDATE) so re-running
-- on a partially-applied DB is safe. Returns a verification result at the end.
-- ===========================================================================

-- ---- MIGRATION 025: Streak Insurance ---------------------------------------
alter table public.users
  add column if not exists streak_shields integer not null default 0
    check (streak_shields >= 0 and streak_shields <= 3);

alter table public.users
  add column if not exists total_shields_used integer not null default 0
    check (total_shields_used >= 0);

comment on column public.users.streak_shields is
  'XP-purchased shields available to auto-protect daily streak. Max 3.';
comment on column public.users.total_shields_used is
  'Lifetime count of shields auto-consumed by the streak sweep.';

create table if not exists public.shield_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  kind         text not null check (kind in ('purchase', 'auto_use')),
  xp_cost      integer,
  shields_after integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists shield_events_user_id_idx
  on public.shield_events(user_id, created_at desc);

alter table public.shield_events enable row level security;

drop policy if exists "shield_events read own" on public.shield_events;
create policy "shield_events read own"
  on public.shield_events for select
  using (user_id = auth.uid());

-- ---- MIGRATION 026: CUET English + General Test real topics ---------------
delete from public.topics t
 using public.chapters c, public.subjects s, public.exams e
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.exam_id    = e.id
   and e.slug       = 'cuet'
   and s.id        in ('english', 'general')
   and t.slug      in ('concepts','worked','formulae','common-mistakes','mixed');

with raw(subject_id, chapter_slug, topic_name, topic_slug, ord) as (values
  ('english', 'rc-factual', 'Main Idea & Central Theme', 'main-idea', 1),
  ('english', 'rc-factual', 'Inference & Implication', 'inference', 2),
  ('english', 'rc-factual', 'Detail-Based Questions', 'detail', 3),
  ('english', 'rc-factual', 'Author''s Tone & Purpose', 'tone-purpose', 4),
  ('english', 'rc-factual', 'Vocabulary in the Passage', 'vocab-passage', 5),
  ('english', 'rc-factual', 'Title, Summary & Conclusion', 'title-summary', 6),
  ('english', 'rc-literary', 'Character Analysis', 'character', 1),
  ('english', 'rc-literary', 'Theme & Message', 'theme', 2),
  ('english', 'rc-literary', 'Literary Devices (Metaphor, Simile, Personification)', 'devices', 3),
  ('english', 'rc-literary', 'Tone & Mood', 'tone-mood', 4),
  ('english', 'rc-literary', 'Symbolism & Imagery', 'symbolism', 5),
  ('english', 'rc-literary', 'Inference from Subtext', 'subtext', 6),
  ('english', 'grammar', 'Subject-Verb Agreement', 'subject-verb', 1),
  ('english', 'grammar', 'Tense & Aspect', 'tense', 2),
  ('english', 'grammar', 'Active & Passive Voice', 'voice', 3),
  ('english', 'grammar', 'Direct & Indirect Speech', 'speech', 4),
  ('english', 'grammar', 'Articles, Determiners & Prepositions', 'articles', 5),
  ('english', 'grammar', 'Modifiers & Parallelism', 'modifiers', 6),
  ('english', 'idioms-phrases', 'Common Idioms (Daily Use)', 'common', 1),
  ('english', 'idioms-phrases', 'Phrasal Verbs', 'phrasal-verbs', 2),
  ('english', 'idioms-phrases', 'Body-Part Idioms (head, heart, hand)', 'body-part', 3),
  ('english', 'idioms-phrases', 'Animal & Colour Idioms', 'animal-colour', 4),
  ('english', 'idioms-phrases', 'Origin-Based Idioms', 'origin', 5),
  ('english', 'idioms-phrases', 'Contextual Usage in Sentences', 'context-usage', 6),
  ('english', 'one-word', 'People & Personality', 'people', 1),
  ('english', 'one-word', 'Government & Politics', 'government', 2),
  ('english', 'one-word', 'Religion & Belief', 'religion', 3),
  ('english', 'one-word', 'Phobias & Manias', 'phobias', 4),
  ('english', 'one-word', 'Place & Location', 'place', 5),
  ('english', 'one-word', 'Action & Behaviour', 'action', 6),
  ('english', 'synonyms-antonyms', 'Common Word Pairs', 'common-pairs', 1),
  ('english', 'synonyms-antonyms', 'Latin & Greek Root Words', 'roots', 2),
  ('english', 'synonyms-antonyms', 'Shades of Meaning', 'shades', 3),
  ('english', 'synonyms-antonyms', 'Formal vs Informal Register', 'register', 4),
  ('english', 'synonyms-antonyms', 'Literary Vocabulary', 'literary', 5),
  ('english', 'synonyms-antonyms', 'High-Frequency PYQ Words', 'pyq-words', 6),
  ('english', 'verbal-ability', 'Sentence Correction', 'correction', 1),
  ('english', 'verbal-ability', 'Sentence Improvement', 'improvement', 2),
  ('english', 'verbal-ability', 'Para Jumbles', 'para-jumbles', 3),
  ('english', 'verbal-ability', 'Cloze Tests', 'cloze', 4),
  ('english', 'verbal-ability', 'Fill in the Blanks', 'fill-blanks', 5),
  ('english', 'verbal-ability', 'Spotting Errors', 'spotting', 6),
  ('english', 'vocab-context', 'Inferring Meaning from Context', 'infer-context', 1),
  ('english', 'vocab-context', 'Confusing Word Pairs (affect/effect, lie/lay)', 'confusing', 2),
  ('english', 'vocab-context', 'Connotation & Denotation', 'connotation', 3),
  ('english', 'vocab-context', 'Register Awareness', 'register', 4),
  ('english', 'vocab-context', 'Idiomatic vs Literal Meaning', 'idiomatic', 5),
  ('english', 'vocab-context', 'Word Roots & Prefixes', 'prefixes', 6),
  ('general', 'current-affairs', 'National Affairs', 'national', 1),
  ('general', 'current-affairs', 'International Affairs', 'international', 2),
  ('general', 'current-affairs', 'Economy & Business', 'economy', 3),
  ('general', 'current-affairs', 'Sports & Awards', 'sports-awards', 4),
  ('general', 'current-affairs', 'Science & Technology', 'sci-tech', 5),
  ('general', 'current-affairs', 'Government Schemes & Policies', 'schemes', 6),
  ('general', 'gk', 'Indian History (Ancient to Modern)', 'history', 1),
  ('general', 'gk', 'Geography (India + World)', 'geography', 2),
  ('general', 'gk', 'Indian Polity & Constitution', 'polity', 3),
  ('general', 'gk', 'Indian Economy Basics', 'economy', 4),
  ('general', 'gk', 'Static GK (Books, Authors, Capitals)', 'static', 5),
  ('general', 'gk', 'Art, Culture & Heritage', 'art-culture', 6),
  ('general', 'logical-reasoning', 'Syllogisms', 'syllogisms', 1),
  ('general', 'logical-reasoning', 'Statement & Assumption', 'assumption', 2),
  ('general', 'logical-reasoning', 'Cause & Effect', 'cause-effect', 3),
  ('general', 'logical-reasoning', 'Logical Sequences', 'sequences', 4),
  ('general', 'logical-reasoning', 'Coding-Decoding', 'coding', 5),
  ('general', 'logical-reasoning', 'Blood Relations', 'blood-relations', 6),
  ('general', 'mental-ability', 'Series Completion', 'series', 1),
  ('general', 'mental-ability', 'Analogies', 'analogies', 2),
  ('general', 'mental-ability', 'Odd One Out', 'odd-one-out', 3),
  ('general', 'mental-ability', 'Classification', 'classification', 4),
  ('general', 'mental-ability', 'Pattern Recognition', 'patterns', 5),
  ('general', 'mental-ability', 'Mirror & Water Images', 'mirror-water', 6),
  ('general', 'numerical-ability', 'Percentages & Ratios', 'percentages', 1),
  ('general', 'numerical-ability', 'Profit & Loss', 'profit-loss', 2),
  ('general', 'numerical-ability', 'Simple & Compound Interest', 'interest', 3),
  ('general', 'numerical-ability', 'Time, Speed & Distance', 'time-distance', 4),
  ('general', 'numerical-ability', 'Time & Work', 'time-work', 5),
  ('general', 'numerical-ability', 'Averages & Mixtures', 'averages', 6),
  ('general', 'quant-reasoning', 'Number Series', 'number-series', 1),
  ('general', 'quant-reasoning', 'Data Interpretation (Tables)', 'di-tables', 2),
  ('general', 'quant-reasoning', 'Data Interpretation (Graphs)', 'di-graphs', 3),
  ('general', 'quant-reasoning', 'Direction Sense', 'direction', 4),
  ('general', 'quant-reasoning', 'Seating Arrangement', 'seating', 5),
  ('general', 'quant-reasoning', 'Calendar & Clock', 'calendar-clock', 6)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name),
       r.ord
from raw r
join public.chapters c on c.slug = r.chapter_slug
join public.subjects s on s.id = c.subject_id and s.id = r.subject_id
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

-- ---- VERIFICATION ----------------------------------------------------------
-- This SELECT is the LAST statement so its result is what Supabase shows.
select
  (select count(*) from information_schema.columns
    where table_schema='public' and table_name='users' and column_name='streak_shields')
    as has_streak_shields,
  (select to_regclass('public.shield_events') is not null)
    as has_shield_events_table,
  (select count(*) from topics t
    join chapters c on c.id=t.chapter_id
    join subjects s on s.id=c.subject_id
    where s.id='english' and c.slug='rc-factual')
    as english_rc_factual_topic_count,
  (select count(*) from topics t
    join chapters c on c.id=t.chapter_id
    join subjects s on s.id=c.subject_id
    where s.id='general' and c.slug='current-affairs')
    as general_current_affairs_topic_count;
-- expected: 1, true, 6, 6
