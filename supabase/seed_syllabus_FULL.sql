-- =====================================================================
-- ExamGrind — One-shot syllabus seed for the cuet-arena Supabase project.
-- Idempotent. Paste this ENTIRE file into:
--   Supabase Dashboard → SQL Editor → New query → paste → Run.
-- It will:
--   1) Create syllabus tables (subjects, chapters, topics, user_topic_mastery)
--   2) Seed all 41 subjects + their chapters
--   3) Drop the unused Avatar/story/cosmetic tables (no-op if not present)
-- =====================================================================

-- ======================================================================
-- CUET Arena — Migration 002: Quest System + CUET Syllabus
-- Adds the gamified RPG layer + the CUET UG syllabus tree.
-- Idempotent: safe to re-run.
-- ======================================================================

-- 1) Extend public.users with progression fields ------------------------
alter table public.users add column if not exists house text
  check (house in ('air','water','earth','fire'));
alter table public.users add column if not exists xp integer not null default 0;
alter table public.users add column if not exists coins integer not null default 0;
alter table public.users add column if not exists level integer not null default 1;
alter table public.users add column if not exists avatar_config jsonb
  not null default '{"hair":"default","robe":"apprentice","aura":null,"companion":null,"accessory":null}'::jsonb;

-- 2) Syllabus tables (subjects → chapters → topics) ---------------------
create table if not exists public.subjects (
  id text primary key,                  -- slug, e.g. 'physics'
  name text not null,
  cuet_code text,
  description text,
  icon text,
  order_index int not null default 0
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  ncert_class int,                      -- 11 or 12, null for non-NCERT subjects
  cuet_unit text,
  order_index int not null default 0,
  unique (subject_id, slug)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  order_index int not null default 0,
  unique (chapter_id, slug)
);

create index if not exists chapters_subject_id_idx on public.chapters(subject_id);
create index if not exists topics_chapter_id_idx on public.topics(chapter_id);

-- 3) Per-topic mastery tracking (the weakness map source) ---------------
create table if not exists public.user_topic_mastery (
  user_id uuid not null references public.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  xp integer not null default 0,
  questions_attempted int not null default 0,
  questions_correct int not null default 0,
  mastery_level text not null default 'novice'
    check (mastery_level in ('novice','apprentice','adept','master')),
  last_quizzed_at timestamptz,
  primary key (user_id, topic_id)
);

-- 4) Cosmetics & wardrobe -----------------------------------------------
create table if not exists public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('hair','robe','aura','companion','accessory')),
  name text not null,
  description text,
  rarity text not null check (rarity in ('common','rare','epic','legendary')),
  cost_coins int not null default 0,    -- 0 = reward-only, can't buy
  preview_url text,
  config jsonb,
  unlocked_by_default boolean not null default false
);

create table if not exists public.user_cosmetics (
  user_id uuid not null references public.users(id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetics(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  primary key (user_id, cosmetic_id)
);

-- 5) Story arcs & nodes -------------------------------------------------
create table if not exists public.story_arcs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  order_index int not null default 0
);

create table if not exists public.story_nodes (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references public.story_arcs(id) on delete cascade,
  title text not null,
  narrative_open text not null,
  narrative_win text not null,
  guardian_name text,
  required_level int not null default 1,
  subject_id text references public.subjects(id),
  chapter_id uuid references public.chapters(id),
  question_count int not null default 10,
  reward_xp int not null default 50,
  reward_coins int not null default 10,
  reward_cosmetic_id uuid references public.cosmetics(id),
  order_index int not null default 0
);

create table if not exists public.user_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  story_node_id uuid not null references public.story_nodes(id) on delete cascade,
  status text not null default 'locked'
    check (status in ('locked','unlocked','in_progress','completed')),
  best_score int not null default 0,
  attempts int not null default 0,
  completed_at timestamptz,
  primary key (user_id, story_node_id)
);

-- 6) Extend quizzes with topic linkage ----------------------------------
alter table public.quizzes add column if not exists chapter_id uuid
  references public.chapters(id) on delete set null;
alter table public.quizzes add column if not exists topic_id uuid
  references public.topics(id) on delete set null;
alter table public.quizzes add column if not exists story_node_id uuid
  references public.story_nodes(id) on delete set null;
alter table public.quizzes add column if not exists score int;
alter table public.quizzes add column if not exists xp_awarded int default 0;
alter table public.quizzes add column if not exists coins_awarded int default 0;

-- ======================================================================
-- Row Level Security
-- ======================================================================

alter table public.subjects             enable row level security;
alter table public.chapters             enable row level security;
alter table public.topics               enable row level security;
alter table public.cosmetics            enable row level security;
alter table public.story_arcs           enable row level security;
alter table public.story_nodes          enable row level security;
alter table public.user_topic_mastery   enable row level security;
alter table public.user_cosmetics       enable row level security;
alter table public.user_progress        enable row level security;

-- world-readable reference content
drop policy if exists "subjects readable"     on public.subjects;
drop policy if exists "chapters readable"     on public.chapters;
drop policy if exists "topics readable"       on public.topics;
drop policy if exists "cosmetics readable"    on public.cosmetics;
drop policy if exists "story_arcs readable"   on public.story_arcs;
drop policy if exists "story_nodes readable"  on public.story_nodes;

create policy "subjects readable"    on public.subjects    for select using (true);
create policy "chapters readable"    on public.chapters    for select using (true);
create policy "topics readable"      on public.topics      for select using (true);
create policy "cosmetics readable"   on public.cosmetics   for select using (true);
create policy "story_arcs readable"  on public.story_arcs  for select using (true);
create policy "story_nodes readable" on public.story_nodes for select using (true);

-- per-user progress
drop policy if exists "user_topic_mastery own" on public.user_topic_mastery;
drop policy if exists "user_cosmetics own"     on public.user_cosmetics;
drop policy if exists "user_progress own"      on public.user_progress;

create policy "user_topic_mastery own" on public.user_topic_mastery
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_cosmetics own" on public.user_cosmetics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_progress own" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ======================================================================
-- SEED: CUET UG Subjects
-- ======================================================================

insert into public.subjects (id, name, cuet_code, icon, order_index) values
  ('physics',     'Physics',       'CUET-301', '⚛',  1),
  ('chemistry',   'Chemistry',     'CUET-302', '⚗',  2),
  ('mathematics', 'Mathematics',   'CUET-319', '∫',  3),
  ('biology',     'Biology',       'CUET-303', '✿',  4),
  ('english',     'English',       'CUET-101', 'A',  5),
  ('general',     'General Test',  'CUET-501', '★',  6)
on conflict (id) do nothing;


-- ======================================================================
-- SEED: Physics chapters (NCERT Class 11 + 12, CUET UG aligned)
-- ======================================================================

insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('physics', 'Physical World & Measurement',          'physical-world',         11, 'Unit I',     1),
  ('physics', 'Kinematics',                            'kinematics',             11, 'Unit II',    2),
  ('physics', 'Laws of Motion',                        'laws-of-motion',         11, 'Unit III',   3),
  ('physics', 'Work, Energy & Power',                  'work-energy-power',      11, 'Unit IV',    4),
  ('physics', 'Motion of System of Particles',         'rotational-motion',      11, 'Unit V',     5),
  ('physics', 'Gravitation',                           'gravitation',            11, 'Unit VI',    6),
  ('physics', 'Properties of Bulk Matter',             'properties-of-matter',   11, 'Unit VII',   7),
  ('physics', 'Thermodynamics',                        'thermodynamics',         11, 'Unit VIII',  8),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'kinetic-theory',     11, 'Unit IX',    9),
  ('physics', 'Oscillations & Waves',                  'oscillations-waves',     11, 'Unit X',    10),
  ('physics', 'Electrostatics',                        'electrostatics',         12, 'Unit I',    11),
  ('physics', 'Current Electricity',                   'current-electricity',    12, 'Unit II',   12),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'magnetism',            12, 'Unit III',  13),
  ('physics', 'Electromagnetic Induction & AC',        'em-induction-ac',        12, 'Unit IV',   14),
  ('physics', 'Electromagnetic Waves',                 'em-waves',               12, 'Unit V',    15),
  ('physics', 'Optics',                                'optics',                 12, 'Unit VI',   16),
  ('physics', 'Dual Nature of Matter & Radiation',     'dual-nature',            12, 'Unit VII',  17),
  ('physics', 'Atoms & Nuclei',                        'atoms-nuclei',           12, 'Unit VIII', 18),
  ('physics', 'Electronic Devices',                    'electronic-devices',     12, 'Unit IX',   19),
  ('physics', 'Communication Systems',                 'communication',          12, 'Unit X',    20)
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SEED: Chemistry chapters
-- ======================================================================

insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('chemistry', 'Some Basic Concepts of Chemistry',    'basic-concepts',         11, 'Unit I',    1),
  ('chemistry', 'Structure of Atom',                   'atomic-structure',       11, 'Unit II',   2),
  ('chemistry', 'Classification & Periodicity',        'periodic-table',         11, 'Unit III',  3),
  ('chemistry', 'Chemical Bonding & Molecular Structure', 'chemical-bonding',    11, 'Unit IV',   4),
  ('chemistry', 'States of Matter',                    'states-of-matter',       11, 'Unit V',    5),
  ('chemistry', 'Chemical Thermodynamics',             'chem-thermodynamics',    11, 'Unit VI',   6),
  ('chemistry', 'Equilibrium',                         'equilibrium',            11, 'Unit VII',  7),
  ('chemistry', 'Redox Reactions',                     'redox',                  11, 'Unit VIII', 8),
  ('chemistry', 'Hydrogen',                            'hydrogen',               11, 'Unit IX',   9),
  ('chemistry', 's-Block Elements',                    's-block',                11, 'Unit X',   10),
  ('chemistry', 'p-Block Elements (Class 11)',         'p-block-11',             11, 'Unit XI',  11),
  ('chemistry', 'Organic Chemistry: Basic Principles', 'organic-basics',         11, 'Unit XII', 12),
  ('chemistry', 'Hydrocarbons',                        'hydrocarbons',           11, 'Unit XIII',13),
  ('chemistry', 'Environmental Chemistry',             'env-chem',               11, 'Unit XIV', 14),
  ('chemistry', 'Solid State',                         'solid-state',            12, 'Unit I',   15),
  ('chemistry', 'Solutions',                           'solutions',              12, 'Unit II',  16),
  ('chemistry', 'Electrochemistry',                    'electrochemistry',       12, 'Unit III', 17),
  ('chemistry', 'Chemical Kinetics',                   'chem-kinetics',          12, 'Unit IV',  18),
  ('chemistry', 'Surface Chemistry',                   'surface-chem',           12, 'Unit V',   19),
  ('chemistry', 'p-Block Elements (Class 12)',         'p-block-12',             12, 'Unit VI',  20),
  ('chemistry', 'd & f Block Elements',                'd-f-block',              12, 'Unit VII', 21),
  ('chemistry', 'Coordination Compounds',              'coordination',           12, 'Unit VIII',22),
  ('chemistry', 'Haloalkanes & Haloarenes',            'haloalkanes',            12, 'Unit IX',  23),
  ('chemistry', 'Alcohols, Phenols & Ethers',          'alcohols-phenols',       12, 'Unit X',   24),
  ('chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'aldehydes-ketones',    12, 'Unit XI',  25),
  ('chemistry', 'Amines',                              'amines',                 12, 'Unit XII', 26),
  ('chemistry', 'Biomolecules',                        'biomolecules',           12, 'Unit XIII',27),
  ('chemistry', 'Polymers',                            'polymers',               12, 'Unit XIV', 28),
  ('chemistry', 'Chemistry in Everyday Life',          'everyday-chem',          12, 'Unit XV',  29)
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SEED: Mathematics chapters
-- ======================================================================

insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('mathematics', 'Sets',                              'sets',                   11, 'Unit I-A',  1),
  ('mathematics', 'Relations & Functions',             'relations-functions',    11, 'Unit I-B',  2),
  ('mathematics', 'Trigonometric Functions',           'trigonometry',           11, 'Unit I-C',  3),
  ('mathematics', 'Mathematical Induction',            'induction',              11, 'Unit II-A', 4),
  ('mathematics', 'Complex Numbers & Quadratic Equations', 'complex-numbers',    11, 'Unit II-B', 5),
  ('mathematics', 'Linear Inequalities',               'inequalities',           11, 'Unit II-C', 6),
  ('mathematics', 'Permutations & Combinations',       'permutations',           11, 'Unit II-D', 7),
  ('mathematics', 'Binomial Theorem',                  'binomial',               11, 'Unit II-E', 8),
  ('mathematics', 'Sequences & Series',                'sequences-series',       11, 'Unit II-F', 9),
  ('mathematics', 'Straight Lines',                    'straight-lines',         11, 'Unit III-A',10),
  ('mathematics', 'Conic Sections',                    'conic-sections',         11, 'Unit III-B',11),
  ('mathematics', 'Three Dimensional Geometry',        '3d-geometry-11',         11, 'Unit III-C',12),
  ('mathematics', 'Limits & Derivatives',              'limits-derivatives',     11, 'Unit IV',  13),
  ('mathematics', 'Mathematical Reasoning',            'reasoning',              11, 'Unit V',   14),
  ('mathematics', 'Statistics',                        'statistics-11',          11, 'Unit VI-A',15),
  ('mathematics', 'Probability',                       'probability-11',         11, 'Unit VI-B',16),
  ('mathematics', 'Relations & Functions (Adv)',       'relations-12',           12, 'Unit I',   17),
  ('mathematics', 'Inverse Trigonometric Functions',   'inverse-trig',           12, 'Unit II',  18),
  ('mathematics', 'Matrices',                          'matrices',               12, 'Unit III', 19),
  ('mathematics', 'Determinants',                      'determinants',           12, 'Unit IV',  20),
  ('mathematics', 'Continuity & Differentiability',    'continuity',             12, 'Unit V',   21),
  ('mathematics', 'Application of Derivatives',        'app-derivatives',        12, 'Unit VI',  22),
  ('mathematics', 'Integrals',                         'integrals',              12, 'Unit VII', 23),
  ('mathematics', 'Application of Integrals',          'app-integrals',          12, 'Unit VIII',24),
  ('mathematics', 'Differential Equations',            'differential-eqs',       12, 'Unit IX',  25),
  ('mathematics', 'Vector Algebra',                    'vectors',                12, 'Unit X',   26),
  ('mathematics', 'Three Dimensional Geometry (Adv)',  '3d-geometry-12',         12, 'Unit XI',  27),
  ('mathematics', 'Linear Programming',                'linear-programming',     12, 'Unit XII', 28),
  ('mathematics', 'Probability (Adv)',                 'probability-12',         12, 'Unit XIII',29)
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SEED: English chapters
-- ======================================================================

insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('english', 'Reading Comprehension (Factual)',       'rc-factual',         'Section A', 1),
  ('english', 'Reading Comprehension (Literary)',      'rc-literary',        'Section A', 2),
  ('english', 'Vocabulary in Context',                 'vocab-context',      'Section B', 3),
  ('english', 'Grammar & Sentence Structure',          'grammar',            'Section B', 4),
  ('english', 'Synonyms & Antonyms',                   'synonyms-antonyms',  'Section B', 5),
  ('english', 'Idioms & Phrases',                      'idioms-phrases',     'Section B', 6),
  ('english', 'One-Word Substitution',                 'one-word',           'Section B', 7),
  ('english', 'Verbal Ability',                        'verbal-ability',     'Section B', 8)
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SEED: General Test chapters
-- ======================================================================

insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('general', 'Quantitative Reasoning',                'quant-reasoning',    'GT-Q',  1),
  ('general', 'Logical & Analytical Reasoning',        'logical-reasoning',  'GT-LR', 2),
  ('general', 'General Knowledge',                     'gk',                 'GT-GK', 3),
  ('general', 'Current Affairs',                       'current-affairs',    'GT-CA', 4),
  ('general', 'General Mental Ability',                'mental-ability',     'GT-MA', 5),
  ('general', 'Numerical Ability',                     'numerical-ability',  'GT-N',  6)
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SEED: Sample topics under select chapters
-- (Pattern: every chapter eventually gets topics; we seed 3 here as
-- representative examples. The rest can be filled in via admin UI later.)
-- ======================================================================

-- Physics → Thermodynamics
insert into public.topics (chapter_id, name, slug, order_index)
select c.id, t.name, t.slug, t.idx from public.chapters c,
  (values
    ('Zeroth & First Law of Thermodynamics','first-law',1),
    ('Heat, Internal Energy & Work','heat-work',2),
    ('Specific Heat Capacity','specific-heat',3),
    ('Thermodynamic Processes (Isothermal, Adiabatic, etc.)','processes',4),
    ('Second Law of Thermodynamics','second-law',5),
    ('Heat Engines & Refrigerators','heat-engines',6),
    ('Carnot Engine & Efficiency','carnot',7)
  ) as t(name, slug, idx)
where c.subject_id = 'physics' and c.slug = 'thermodynamics'
on conflict (chapter_id, slug) do nothing;

-- Chemistry → Atomic Structure
insert into public.topics (chapter_id, name, slug, order_index)
select c.id, t.name, t.slug, t.idx from public.chapters c,
  (values
    ('Discovery of Subatomic Particles','subatomic',1),
    ('Bohr Model of Atom','bohr-model',2),
    ('Quantum Mechanical Model','quantum-model',3),
    ('Quantum Numbers','quantum-numbers',4),
    ('Aufbau Principle, Pauli Exclusion, Hund Rule','aufbau-pauli-hund',5),
    ('Electronic Configuration','electronic-config',6),
    ('Photoelectric Effect','photoelectric',7)
  ) as t(name, slug, idx)
where c.subject_id = 'chemistry' and c.slug = 'atomic-structure'
on conflict (chapter_id, slug) do nothing;

-- Mathematics → Continuity & Differentiability
insert into public.topics (chapter_id, name, slug, order_index)
select c.id, t.name, t.slug, t.idx from public.chapters c,
  (values
    ('Continuity at a Point','continuity-point',1),
    ('Algebra of Continuous Functions','continuity-algebra',2),
    ('Differentiability','differentiability',3),
    ('Chain Rule','chain-rule',4),
    ('Derivatives of Implicit Functions','implicit',5),
    ('Logarithmic Differentiation','log-diff',6),
    ('Mean Value Theorem','mvt',7)
  ) as t(name, slug, idx)
where c.subject_id = 'mathematics' and c.slug = 'continuity'
on conflict (chapter_id, slug) do nothing;


-- ======================================================================
-- SEED: Cosmetics for Arc 1
-- ======================================================================

insert into public.cosmetics (slot, name, description, rarity, cost_coins, unlocked_by_default, config) values
  ('hair',      'Default Hair',         'A simple, neat style.',                                'common', 0,   true,  '{"color":"#2c1810"}'),
  ('robe',      'Apprentice Robe',      'Plain cotton robe of a Nalanda apprentice.',           'common', 0,   true,  '{"color":"#a8a29e"}'),
  ('robe',      'Indigo Scholar Robe',  'Deep indigo — Chapter 1 reward.',                      'common', 0,   false, '{"color":"#4338ca"}'),
  ('hair',      'Indigo Hair Tie',      'A small indigo ribbon — Chapter 2 reward.',            'common', 0,   false, '{"color":"#4338ca","accent":true}'),
  ('aura',      'Ember Aura',           'A faint orange glow — Chapter 3 reward.',              'rare',   0,   false, '{"color":"#f97316","glow":0.6}'),
  ('companion', 'Otter Spirit',         'A playful river otter — Chapter 4 reward.',            'rare',   0,   false, '{"animal":"otter","element":"water"}'),
  ('robe',      'Scholar''s Mantle',    'Crimson mantle — completes Arc 1.',                    'epic',   0,   false, '{"color":"#991b1b","trim":"gold"}'),
  ('hair',      'Scholar Topknot',      'A neat topknot favored by Nalanda novices.',           'common', 30,  false, '{"color":"#1c1917"}'),
  ('hair',      'Long Braid',           'A long, woven braid.',                                 'common', 50,  false, '{"color":"#1c1917","style":"braid"}'),
  ('hair',      'Short Cut',            'A practical short cut.',                               'common', 30,  false, '{"color":"#1c1917","style":"short"}'),
  ('aura',      'Tide Aura',            'A blue rippling shimmer.',                             'rare',   150, false, '{"color":"#06b6d4","glow":0.5}'),
  ('aura',      'Wind Aura',            'A pale silver swirl.',                                 'rare',   150, false, '{"color":"#e5e7eb","glow":0.5}'),
  ('aura',      'Stone Aura',           'A muted earth-tone glow.',                             'rare',   150, false, '{"color":"#84cc16","glow":0.5}'),
  ('companion', 'Sparrow Spirit',       'A swift wind sparrow.',                                'rare',   200, false, '{"animal":"sparrow","element":"air"}'),
  ('companion', 'Tortoise Spirit',      'A patient earth tortoise.',                            'rare',   200, false, '{"animal":"tortoise","element":"earth"}'),
  ('companion', 'Phoenix Hatchling',    'A small flame-bird.',                                  'epic',   400, false, '{"animal":"phoenix","element":"fire"}'),
  ('robe',      'Sage''s White',        'White robe of an Adept.',                              'rare',   250, false, '{"color":"#f8fafc"}'),
  ('robe',      'Crimson Initiate',     'Bright red robe.',                                     'common', 80,  false, '{"color":"#dc2626"}'),
  ('robe',      'Forest Green Robe',    'Deep green robe of the Earth Academy.',                'common', 80,  false, '{"color":"#16a34a"}'),
  ('accessory', 'Library Spectacles',   'Round spectacles of a true scholar.',                  'rare',   100, false, '{"style":"round"}')
on conflict do nothing;


-- ======================================================================
-- SEED: Story Arc 1 — "The Outer Gates"
-- ======================================================================

insert into public.story_arcs (id, name, description, order_index)
values (
  '11111111-1111-1111-1111-111111111111',
  'The Outer Gates',
  'Five trials at the threshold of Nalanda. Prove your worth as a Scholar.',
  1
) on conflict (id) do nothing;

-- Chapter 1: The Threshold Garden — English RC
insert into public.story_nodes (arc_id, title, narrative_open, narrative_win, guardian_name, required_level, subject_id, chapter_id, question_count, reward_xp, reward_coins, order_index)
select
  '11111111-1111-1111-1111-111111111111',
  'The Threshold Garden',
  'You step past moss-covered stones into the Threshold Garden. A weathered Stone Sentinel stirs in its alcove. "Read what was written here long ago, Scholar," it rumbles. "Show me your eyes work as well as your tongue."',
  'The Sentinel''s eyes dim with quiet approval. "Pass, Scholar. The Hall of Numbers awaits beyond the next bridge." A fold of indigo cloth drifts to your feet.',
  'The Stone Sentinel',
  1, 'english', c.id, 8, 50, 10, 1
from public.chapters c where c.subject_id = 'english' and c.slug = 'rc-factual'
on conflict do nothing;

-- Chapter 2: The Hall of Numbers — Math: Sets
insert into public.story_nodes (arc_id, title, narrative_open, narrative_win, guardian_name, required_level, subject_id, chapter_id, question_count, reward_xp, reward_coins, order_index)
select
  '11111111-1111-1111-1111-111111111111',
  'The Hall of Numbers',
  'A long hall opens before you, lit by floating crystals that hum a low, mathematical tune. The Crystal Guardian uncoils from the ceiling. "Numbers are the bones of the world. Show me you can name them."',
  'The crystals shift to a softer key. The Guardian inclines its prismatic head. "You see the patterns, Scholar. Take this — you''ll need it where you''re going."',
  'The Crystal Guardian',
  2, 'mathematics', c.id, 10, 80, 15, 2
from public.chapters c where c.subject_id = 'mathematics' and c.slug = 'sets'
on conflict do nothing;

-- Chapter 3: The Burning Forge — Physics: Thermodynamics
insert into public.story_nodes (arc_id, title, narrative_open, narrative_win, guardian_name, required_level, subject_id, chapter_id, question_count, reward_xp, reward_coins, order_index)
select
  '11111111-1111-1111-1111-111111111111',
  'The Burning Forge',
  'Heat presses against your face as you enter. A Phoenix Tutor watches from a perch of glowing coals. "Heat. Work. Energy. They flow, they transform, they cannot be cheated. Prove you understand them, and you may pass."',
  'The Phoenix folds its wings. A single ember drifts toward you and settles, warm but not burning, into a quiet glow that follows you. "Carry it well, Scholar."',
  'The Phoenix Tutor',
  3, 'physics', c.id, 10, 120, 20, 3
from public.chapters c where c.subject_id = 'physics' and c.slug = 'thermodynamics'
on conflict do nothing;

-- Chapter 4: The Whispering Vaults — Chemistry: Atomic Structure
insert into public.story_nodes (arc_id, title, narrative_open, narrative_win, guardian_name, required_level, subject_id, chapter_id, question_count, reward_xp, reward_coins, order_index)
select
  '11111111-1111-1111-1111-111111111111',
  'The Whispering Vaults',
  'The vaults breathe. Vapors curl in the shapes of atoms, splitting and rejoining. The Vapor Sage''s voice comes from everywhere at once. "All matter, Scholar, is built of these. Tell me how."',
  'The vapors settle into a calm haze. A small river otter pads out of a mist-pool and looks at you with quiet curiosity. "She has chosen you," the Sage murmurs. "Take her. The next door is heavier than the last."',
  'The Vapor Sage',
  4, 'chemistry', c.id, 10, 150, 25, 4
from public.chapters c where c.subject_id = 'chemistry' and c.slug = 'atomic-structure'
on conflict do nothing;

-- Chapter 5: The Sage's Chamber — General Test (boss fight, mixed)
insert into public.story_nodes (arc_id, title, narrative_open, narrative_win, guardian_name, required_level, subject_id, chapter_id, question_count, reward_xp, reward_coins, order_index)
select
  '11111111-1111-1111-1111-111111111111',
  'The Sage''s Chamber',
  'The chamber is small, plain, and somehow holds the whole library inside it. The Old Master sits cross-legged with a single cup of tea. "Five trials, Scholar. Five things asked of you. Show me what you''ve carried this far."',
  'The Old Master pours a second cup and slides it across the floor. "Welcome to Nalanda, Scholar. The Inner Sanctum opens for you when you''re ready." A heavy crimson mantle, edged in gold, settles onto your shoulders.',
  'The Old Master',
  5, 'general', c.id, 15, 250, 50, 5
from public.chapters c where c.subject_id = 'general' and c.slug = 'mental-ability'
on conflict do nothing;

-- =====================================================================
-- migration 003 starts here
-- =====================================================================
-- ======================================================================
-- CUET Arena — Migration 003: Full CUET UG Syllabus (37 subjects)
-- Adds the remaining 31 CUET UG subjects (Section IA languages,
-- Section II domain subjects) on top of the 6 from migration 002.
-- Idempotent: safe to re-run. Apply AFTER migration 002.
-- ======================================================================

-- ======================================================================
-- SECTION IA — Languages (12 additional, English is already in 002)
-- ======================================================================

insert into public.subjects (id, name, cuet_code, icon, order_index) values
  ('hindi',     'Hindi',      'CUET-102', 'अ',  10),
  ('tamil',     'Tamil',      'CUET-111', 'த',  11),
  ('telugu',    'Telugu',     'CUET-112', 'తె', 12),
  ('kannada',   'Kannada',    'CUET-107', 'ಕ',  13),
  ('malayalam', 'Malayalam',  'CUET-109', 'മ',  14),
  ('marathi',   'Marathi',    'CUET-110', 'म',  15),
  ('gujarati',  'Gujarati',   'CUET-105', 'ગ',  16),
  ('punjabi',   'Punjabi',    'CUET-113', 'ਪ',  17),
  ('bengali',   'Bengali',    'CUET-104', 'ব',  18),
  ('odia',      'Odia',       'CUET-108', 'ଓ',  19),
  ('assamese',  'Assamese',   'CUET-103', 'অ',  20),
  ('urdu',      'Urdu',       'CUET-114', 'ا',  21)
on conflict (id) do nothing;

-- All Section IA language subjects share the same chapter pattern
-- (CUET tests language at the same skill bands across languages).
-- Insert in one go using a CTE.
insert into public.chapters (subject_id, name, slug, cuet_unit, order_index)
select s.id, ch.name, ch.slug, ch.cuet_unit, ch.idx
from public.subjects s
cross join (values
  ('Reading Comprehension (Prose)',     'rc-prose',         'Section A', 1),
  ('Reading Comprehension (Poetry)',    'rc-poetry',        'Section A', 2),
  ('Reading Comprehension (Literary)',  'rc-literary',      'Section A', 3),
  ('Grammar & Sentence Structure',      'grammar',          'Section B', 4),
  ('Vocabulary in Context',             'vocab-context',    'Section B', 5),
  ('Synonyms & Antonyms',               'synonyms-antonyms','Section B', 6),
  ('Verbal Ability',                    'verbal-ability',   'Section B', 7),
  ('Composition & Translation',         'composition',      'Section B', 8)
) as ch(name, slug, cuet_unit, idx)
where s.id in ('hindi','tamil','telugu','kannada','malayalam','marathi',
               'gujarati','punjabi','bengali','odia','assamese','urdu')
on conflict (subject_id, slug) do nothing;


-- ======================================================================
-- SECTION II — Domain subjects (23 additional; Physics/Chem/Math/Biology
-- are in migration 002)
-- ======================================================================

insert into public.subjects (id, name, cuet_code, icon, order_index) values
  ('accountancy',          'Accountancy',                       'CUET-301-Acc', '₹',  30),
  ('agriculture',          'Agriculture',                       'CUET-302-Agr', '🌾', 31),
  ('anthropology',         'Anthropology',                      'CUET-304',     '⚱', 32),
  ('business-studies',     'Business Studies',                  'CUET-305',     '💼', 33),
  ('computer-science',     'Computer Science / Informatics',    'CUET-306',     '⌨', 34),
  ('economics',            'Economics / Business Economics',    'CUET-308',     '📈', 35),
  ('engineering-graphics', 'Engineering Graphics',              'CUET-309',     '📐', 36),
  ('entrepreneurship',     'Entrepreneurship',                  'CUET-310',     '🚀', 37),
  ('environmental-studies','Environmental Studies',             'CUET-311',     '🌱', 38),
  ('fine-arts',            'Fine Arts / Visual Arts',           'CUET-312',     '🎨', 39),
  ('geography',            'Geography / Geology',               'CUET-313',     '🌍', 40),
  ('history',              'History',                           'CUET-314',     '🏛', 41),
  ('home-science',         'Home Science',                      'CUET-315',     '🏠', 42),
  ('knowledge-tradition',  'Knowledge Tradition & Practices of India', 'CUET-316', 'ॐ', 43),
  ('legal-studies',        'Legal Studies',                     'CUET-317',     '⚖', 44),
  ('mass-media',           'Mass Media / Mass Communication',   'CUET-318',     '📡', 45),
  ('performing-arts',      'Performing Arts',                   'CUET-321',     '🎭', 46),
  ('physical-education',   'Physical Education / NCC / Yoga',   'CUET-322',     '🏃', 47),
  ('political-science',    'Political Science',                 'CUET-324',     '🏛', 48),
  ('psychology',           'Psychology',                        'CUET-325',     '🧠', 49),
  ('sanskrit',             'Sanskrit',                          'CUET-326',     'ॐ', 50),
  ('sociology',            'Sociology',                         'CUET-327',     '👥', 51),
  ('teaching-aptitude',    'Teaching Aptitude',                 'CUET-328',     '✎',  52)
on conflict (id) do nothing;


-- ----------------------------------------------------------------------
-- Accountancy chapters (NCERT Class 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('accountancy', 'Introduction to Accounting',                 'intro-accounting',     11, 'Unit I',     1),
  ('accountancy', 'Theory Base of Accounting',                  'theory-base',          11, 'Unit II',    2),
  ('accountancy', 'Recording of Transactions (Journal)',        'journal',              11, 'Unit III',   3),
  ('accountancy', 'Subsidiary Books & Ledger',                  'ledger',               11, 'Unit IV',    4),
  ('accountancy', 'Bank Reconciliation Statement',              'brs',                  11, 'Unit V',     5),
  ('accountancy', 'Trial Balance & Rectification of Errors',    'trial-balance',        11, 'Unit VI',    6),
  ('accountancy', 'Depreciation, Provisions & Reserves',        'depreciation',         11, 'Unit VII',   7),
  ('accountancy', 'Bills of Exchange',                          'bills-of-exchange',    11, 'Unit VIII',  8),
  ('accountancy', 'Financial Statements (Sole Proprietor)',     'fs-sole',              11, 'Unit IX',    9),
  ('accountancy', 'Accounting for Partnership: Fundamentals',   'partnership-basics',   12, 'Unit I',    10),
  ('accountancy', 'Reconstitution of Partnership: Admission',   'partner-admission',    12, 'Unit II',   11),
  ('accountancy', 'Reconstitution: Retirement/Death',           'partner-retirement',   12, 'Unit III',  12),
  ('accountancy', 'Dissolution of Partnership',                 'partner-dissolution',  12, 'Unit IV',   13),
  ('accountancy', 'Accounting for Share Capital',               'share-capital',        12, 'Unit V',    14),
  ('accountancy', 'Accounting for Debentures',                  'debentures',           12, 'Unit VI',   15),
  ('accountancy', 'Financial Statements of a Company',          'company-fs',           12, 'Unit VII',  16),
  ('accountancy', 'Analysis of Financial Statements',           'fs-analysis',          12, 'Unit VIII', 17),
  ('accountancy', 'Cash Flow Statement',                        'cash-flow',            12, 'Unit IX',   18)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Agriculture chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('agriculture', 'Soil Science & Soil Fertility',              'soil-science',         11, 'Unit I',    1),
  ('agriculture', 'Climate, Weather & Agriculture',             'climate-agri',         11, 'Unit II',   2),
  ('agriculture', 'Agronomy & Crop Production',                 'agronomy',             11, 'Unit III',  3),
  ('agriculture', 'Horticulture & Plantation Crops',            'horticulture',         11, 'Unit IV',   4),
  ('agriculture', 'Plant Breeding & Genetics',                  'plant-breeding',       11, 'Unit V',    5),
  ('agriculture', 'Plant Pathology & Pest Control',             'plant-pathology',      12, 'Unit VI',   6),
  ('agriculture', 'Animal Husbandry',                           'animal-husbandry',     12, 'Unit VII',  7),
  ('agriculture', 'Dairy & Poultry Farming',                    'dairy-poultry',        12, 'Unit VIII', 8),
  ('agriculture', 'Agricultural Economics & Marketing',         'agri-economics',       12, 'Unit IX',   9),
  ('agriculture', 'Sustainable & Organic Farming',              'sustainable-farming',  12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Anthropology chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('anthropology', 'Foundations of Anthropology',                'foundations',          11, 'Unit I',    1),
  ('anthropology', 'Physical / Biological Anthropology',         'physical-anthro',      11, 'Unit II',   2),
  ('anthropology', 'Human Evolution',                            'evolution',            11, 'Unit III',  3),
  ('anthropology', 'Social-Cultural Anthropology',               'social-cultural',      11, 'Unit IV',   4),
  ('anthropology', 'Tribal Cultures of India',                   'tribal-india',         12, 'Unit V',    5),
  ('anthropology', 'Prehistoric Archaeology',                    'archaeology',          12, 'Unit VI',   6),
  ('anthropology', 'Human Genetics',                             'genetics',             12, 'Unit VII',  7),
  ('anthropology', 'Ecology & Environmental Anthropology',       'ecology',              12, 'Unit VIII', 8),
  ('anthropology', 'Linguistic Anthropology',                    'linguistics',          12, 'Unit IX',   9),
  ('anthropology', 'Applied Anthropology',                       'applied',              12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Business Studies chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('business-studies', 'Nature & Purpose of Business',           'nature-purpose',       11, 'Unit I',     1),
  ('business-studies', 'Forms of Business Organisation',         'forms-org',            11, 'Unit II',    2),
  ('business-studies', 'Public, Private & Global Enterprises',   'public-private',       11, 'Unit III',   3),
  ('business-studies', 'Business Services',                      'business-services',    11, 'Unit IV',    4),
  ('business-studies', 'Emerging Modes of Business',             'emerging-modes',       11, 'Unit V',     5),
  ('business-studies', 'Social Responsibility & Business Ethics','social-responsibility',11, 'Unit VI',    6),
  ('business-studies', 'Sources of Business Finance',            'business-finance',     11, 'Unit VII',   7),
  ('business-studies', 'Small Business',                         'small-business',       11, 'Unit VIII',  8),
  ('business-studies', 'Internal Trade',                         'internal-trade',       11, 'Unit IX',    9),
  ('business-studies', 'International Business',                 'international-biz',    11, 'Unit X',    10),
  ('business-studies', 'Nature & Significance of Management',    'management-nature',    12, 'Unit XI',   11),
  ('business-studies', 'Principles of Management',               'principles-mgmt',      12, 'Unit XII',  12),
  ('business-studies', 'Business Environment',                   'business-env',         12, 'Unit XIII', 13),
  ('business-studies', 'Planning',                               'planning',             12, 'Unit XIV',  14),
  ('business-studies', 'Organising',                             'organising',           12, 'Unit XV',   15),
  ('business-studies', 'Staffing',                               'staffing',             12, 'Unit XVI',  16),
  ('business-studies', 'Directing',                              'directing',            12, 'Unit XVII', 17),
  ('business-studies', 'Controlling',                            'controlling',          12, 'Unit XVIII',18),
  ('business-studies', 'Financial Management',                   'financial-mgmt',       12, 'Unit XIX',  19),
  ('business-studies', 'Financial Markets',                      'financial-markets',    12, 'Unit XX',   20),
  ('business-studies', 'Marketing Management',                   'marketing',            12, 'Unit XXI',  21),
  ('business-studies', 'Consumer Protection',                    'consumer-protection',  12, 'Unit XXII', 22)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Computer Science / Informatics Practices chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('computer-science', 'Computer Systems & Organisation',        'computer-systems',     11, 'Unit I',     1),
  ('computer-science', 'Computational Thinking & Programming',   'computational',        11, 'Unit II',    2),
  ('computer-science', 'Programming with Python: Basics',        'python-basics',        11, 'Unit III',   3),
  ('computer-science', 'Data Handling & String Manipulation',    'data-strings',         11, 'Unit IV',    4),
  ('computer-science', 'Lists, Tuples & Dictionaries',           'collections',          11, 'Unit V',     5),
  ('computer-science', 'Boolean Algebra',                        'boolean-algebra',      11, 'Unit VI',    6),
  ('computer-science', 'Society, Law & Ethics',                  'cyber-ethics',         11, 'Unit VII',   7),
  ('computer-science', 'Functions & Recursion',                  'functions',            12, 'Unit VIII',  8),
  ('computer-science', 'File Handling',                          'file-handling',        12, 'Unit IX',    9),
  ('computer-science', 'Data Structures: Stack & Queue',         'data-structures',      12, 'Unit X',    10),
  ('computer-science', 'Database Concepts & SQL',                'database-sql',         12, 'Unit XI',   11),
  ('computer-science', 'Computer Networks',                      'networks',             12, 'Unit XII',  12),
  ('computer-science', 'Web Services & Cloud Computing',         'web-cloud',            12, 'Unit XIII', 13),
  ('computer-science', 'Cyber Safety & Ethics',                  'cyber-safety',         12, 'Unit XIV',  14)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Economics chapters (NCERT 11: Statistics + Indian Economic Development;
-- NCERT 12: Microeconomics + Macroeconomics)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('economics', 'Introduction to Statistics',                    'stats-intro',          11, 'Stats-I',    1),
  ('economics', 'Collection & Organisation of Data',             'data-collection',      11, 'Stats-II',   2),
  ('economics', 'Presentation of Data',                          'data-presentation',    11, 'Stats-III',  3),
  ('economics', 'Measures of Central Tendency',                  'central-tendency',     11, 'Stats-IV',   4),
  ('economics', 'Measures of Dispersion',                        'dispersion',           11, 'Stats-V',    5),
  ('economics', 'Correlation',                                   'correlation',          11, 'Stats-VI',   6),
  ('economics', 'Index Numbers',                                 'index-numbers',        11, 'Stats-VII',  7),
  ('economics', 'Indian Economy on Eve of Independence',         'indian-eve-indep',     11, 'IED-I',      8),
  ('economics', 'Indian Economy 1950-90 (Five-Year Plans)',      'five-year-plans',      11, 'IED-II',     9),
  ('economics', 'Liberalisation, Privatisation & Globalisation', 'lpg',                  11, 'IED-III',   10),
  ('economics', 'Poverty & Human Capital Formation',             'poverty-human-cap',    11, 'IED-IV',    11),
  ('economics', 'Rural Development & Employment',                'rural-employment',     11, 'IED-V',     12),
  ('economics', 'Infrastructure & Sustainable Development',      'infra-sustain',        11, 'IED-VI',    13),
  ('economics', 'Microeconomics: Introduction',                  'micro-intro',          12, 'Micro-I',   14),
  ('economics', 'Theory of Consumer Behaviour',                  'consumer-behaviour',   12, 'Micro-II',  15),
  ('economics', 'Production & Costs',                            'production-costs',     12, 'Micro-III', 16),
  ('economics', 'Theory of Firm under Perfect Competition',      'perfect-competition',  12, 'Micro-IV',  17),
  ('economics', 'Market Equilibrium & Non-Competitive Markets',  'market-equilibrium',   12, 'Micro-V',   18),
  ('economics', 'National Income Accounting',                    'national-income',      12, 'Macro-I',   19),
  ('economics', 'Money & Banking',                               'money-banking',        12, 'Macro-II',  20),
  ('economics', 'Income Determination',                          'income-determ',        12, 'Macro-III', 21),
  ('economics', 'Government Budget & the Economy',               'govt-budget',          12, 'Macro-IV',  22),
  ('economics', 'Open Economy Macroeconomics',                   'open-economy',         12, 'Macro-V',   23)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Engineering Graphics chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('engineering-graphics', 'Plane Scales',                       'scales',               11, 'Unit I',    1),
  ('engineering-graphics', 'Engineering Curves',                 'curves',               11, 'Unit II',   2),
  ('engineering-graphics', 'Loci of Points',                     'loci',                 11, 'Unit III',  3),
  ('engineering-graphics', 'Orthographic Projections',           'orthographic',         11, 'Unit IV',   4),
  ('engineering-graphics', 'Projections of Solids',              'projections-solids',   12, 'Unit V',    5),
  ('engineering-graphics', 'Section of Solids',                  'section-solids',       12, 'Unit VI',   6),
  ('engineering-graphics', 'Development of Surfaces',            'dev-surfaces',         12, 'Unit VII',  7),
  ('engineering-graphics', 'Isometric Projections',              'isometric',            12, 'Unit VIII', 8),
  ('engineering-graphics', 'Machine Drawing',                    'machine-drawing',      12, 'Unit IX',   9)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Entrepreneurship chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('entrepreneurship', 'Entrepreneurial Opportunity',            'opportunity',          11, 'Unit I',   1),
  ('entrepreneurship', 'Entrepreneurial Planning',               'planning',             11, 'Unit II',  2),
  ('entrepreneurship', 'Enterprise Marketing',                   'marketing',            11, 'Unit III', 3),
  ('entrepreneurship', 'Enterprise Growth Strategies',           'growth',               11, 'Unit IV',  4),
  ('entrepreneurship', 'Business Arithmetic',                    'biz-arithmetic',       12, 'Unit V',   5),
  ('entrepreneurship', 'Resource Mobilization',                  'resources',            12, 'Unit VI',  6),
  ('entrepreneurship', 'Enterprise Operations',                  'operations',           12, 'Unit VII', 7),
  ('entrepreneurship', 'Challenges & Risk Management',           'challenges',           12, 'Unit VIII',8)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Environmental Studies chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('environmental-studies', 'Ecosystems & Biodiversity',         'ecosystems',           'Unit I',   1),
  ('environmental-studies', 'Natural Resources',                 'natural-resources',    'Unit II',  2),
  ('environmental-studies', 'Pollution & Control',               'pollution',            'Unit III', 3),
  ('environmental-studies', 'Climate Change & Global Warming',   'climate-change',       'Unit IV',  4),
  ('environmental-studies', 'Sustainability & SDGs',             'sustainability',       'Unit V',   5),
  ('environmental-studies', 'Conservation & Wildlife',           'conservation',         'Unit VI',  6),
  ('environmental-studies', 'Environmental Laws of India',       'env-laws',             'Unit VII', 7),
  ('environmental-studies', 'Disaster Management',               'disaster-mgmt',        'Unit VIII',8)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Fine Arts / Visual Arts chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('fine-arts', 'Pre-Historic Rock Paintings',                   'rock-paintings',       11, 'Unit I',   1),
  ('fine-arts', 'Arts of Indus Valley',                          'indus-arts',           11, 'Unit II',  2),
  ('fine-arts', 'Buddhist, Jain & Hindu Arts',                   'religious-arts',       11, 'Unit III', 3),
  ('fine-arts', 'Temple Architecture & Sculpture',               'temple-arch',          11, 'Unit IV',  4),
  ('fine-arts', 'Indian Bronzes',                                'bronzes',              11, 'Unit V',   5),
  ('fine-arts', 'Indo-Islamic Architecture',                     'indo-islamic',         11, 'Unit VI',  6),
  ('fine-arts', 'The Mughal School of Miniature Painting',       'mughal-painting',      12, 'Unit VII', 7),
  ('fine-arts', 'Rajasthani & Pahari Schools',                   'rajasthani-pahari',    12, 'Unit VIII',8),
  ('fine-arts', 'The Bengal School & Modern Indian Art',         'bengal-modern',        12, 'Unit IX',  9),
  ('fine-arts', 'Living Craft Traditions of India',              'craft-traditions',     12, 'Unit X',  10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Geography chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('geography', 'Geography as a Discipline',                     'geo-discipline',       11, 'Unit I',     1),
  ('geography', 'The Earth: Origin & Evolution',                 'earth-origin',         11, 'Unit II',    2),
  ('geography', 'Landforms & Their Evolution',                   'landforms',            11, 'Unit III',   3),
  ('geography', 'Climate',                                       'climate-11',           11, 'Unit IV',    4),
  ('geography', 'Water (Oceans)',                                'water-oceans',         11, 'Unit V',     5),
  ('geography', 'Life on the Earth',                             'life-earth',           11, 'Unit VI',    6),
  ('geography', 'India: Physical Environment',                   'india-physical',       11, 'Unit VII',   7),
  ('geography', 'Drainage System of India',                      'drainage-india',       11, 'Unit VIII',  8),
  ('geography', 'Climate, Vegetation & Soils of India',          'climate-india',        11, 'Unit IX',    9),
  ('geography', 'Natural Hazards & Disasters',                   'hazards',              11, 'Unit X',    10),
  ('geography', 'Human Geography: Nature & Scope',               'human-geo',            12, 'Unit XI',   11),
  ('geography', 'People (Population, Density, Composition)',     'people',               12, 'Unit XII',  12),
  ('geography', 'Human Activities (Primary, Secondary, etc.)',   'human-activities',     12, 'Unit XIII', 13),
  ('geography', 'Transport, Communication & Trade',              'transport-comm',       12, 'Unit XIV',  14),
  ('geography', 'India: People & Economy',                       'india-economy',        12, 'Unit XV',   15),
  ('geography', 'Resources & Development',                       'resources-dev',        12, 'Unit XVI',  16),
  ('geography', 'Geographical Perspective on Selected Issues',   'geo-issues',           12, 'Unit XVII', 17)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- History chapters (NCERT 11: Themes in World History; NCERT 12: Themes in
-- Indian History I, II, III)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('history', 'From the Beginning of Time',                      'beginning-time',       11, 'WH-I',     1),
  ('history', 'Writing & City Life',                             'city-life',            11, 'WH-II',    2),
  ('history', 'An Empire Across Three Continents',               'roman-empire',         11, 'WH-III',   3),
  ('history', 'The Central Islamic Lands',                       'islamic-lands',        11, 'WH-IV',    4),
  ('history', 'Nomadic Empires',                                 'nomadic-empires',      11, 'WH-V',     5),
  ('history', 'The Three Orders (Medieval Europe)',              'three-orders',         11, 'WH-VI',    6),
  ('history', 'Changing Cultural Traditions',                    'cultural-traditions',  11, 'WH-VII',   7),
  ('history', 'Confrontation of Cultures',                       'confrontation',        11, 'WH-VIII',  8),
  ('history', 'Industrial Revolution',                           'industrial-rev',       11, 'WH-IX',    9),
  ('history', 'Paths to Modernization',                          'modernization',        11, 'WH-X',    10),
  ('history', 'Bricks, Beads & Bones (Harappan)',                'harappan',             12, 'IH-I',    11),
  ('history', 'Kings, Farmers & Towns (Early States)',           'early-states',         12, 'IH-II',   12),
  ('history', 'Kinship, Caste & Class (Mahabharata)',            'kinship-caste',        12, 'IH-III',  13),
  ('history', 'Thinkers, Beliefs & Buildings (Buddhism)',        'buddhism',             12, 'IH-IV',   14),
  ('history', 'Through the Eyes of Travellers',                  'travellers',           12, 'IH-V',    15),
  ('history', 'Bhakti–Sufi Traditions',                          'bhakti-sufi',          12, 'IH-VI',   16),
  ('history', 'An Imperial Capital: Vijayanagara',               'vijayanagara',         12, 'IH-VII',  17),
  ('history', 'Peasants, Zamindars & the State (Mughal India)',  'mughal-rural',         12, 'IH-VIII', 18),
  ('history', 'Kings & Chronicles (Mughal Court)',               'mughal-court',         12, 'IH-IX',   19),
  ('history', 'Colonialism & the Countryside',                   'colonial-rural',       12, 'IH-X',    20),
  ('history', 'Rebels & the Raj (1857)',                         '1857-revolt',          12, 'IH-XI',   21),
  ('history', 'Mahatma Gandhi & the Nationalist Movement',       'gandhi-movement',      12, 'IH-XII',  22),
  ('history', 'Understanding Partition',                         'partition',            12, 'IH-XIII', 23),
  ('history', 'Framing the Constitution',                        'constitution',         12, 'IH-XIV',  24)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Home Science chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('home-science', 'Human Development',                          'human-dev',            11, 'Unit I',    1),
  ('home-science', 'Family & Community',                         'family-community',     11, 'Unit II',   2),
  ('home-science', 'Food & Nutrition',                           'food-nutrition',       11, 'Unit III',  3),
  ('home-science', 'Textile & Clothing',                         'textile-clothing',     11, 'Unit IV',   4),
  ('home-science', 'Resource Management',                        'resource-mgmt',        11, 'Unit V',    5),
  ('home-science', 'Communication, Extension & Media',           'communication',        12, 'Unit VI',   6),
  ('home-science', 'Consumer Education & Protection',            'consumer-edu',         12, 'Unit VII',  7),
  ('home-science', 'Public Nutrition & Health',                  'public-nutrition',     12, 'Unit VIII', 8),
  ('home-science', 'Childhood & Adolescent Care',                'child-care',           12, 'Unit IX',   9),
  ('home-science', 'Apparel & Textile Design',                   'apparel-design',       12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Knowledge Tradition & Practices of India chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('knowledge-tradition', 'Vedic Knowledge & Upanishadic Thought','vedas-upanishads',    'Unit I',     1),
  ('knowledge-tradition', 'Indian Philosophical Schools',         'philosophy',          'Unit II',    2),
  ('knowledge-tradition', 'Sanskrit Literature & Grammar',        'sanskrit-lit',        'Unit III',   3),
  ('knowledge-tradition', 'Indian Mathematics & Astronomy',       'maths-astronomy',     'Unit IV',    4),
  ('knowledge-tradition', 'Ayurveda & Indian Medicine',           'ayurveda',            'Unit V',     5),
  ('knowledge-tradition', 'Indian Music & Dance Traditions',      'music-dance',         'Unit VI',    6),
  ('knowledge-tradition', 'Architecture, Sculpture & Painting',   'arts',                'Unit VII',   7),
  ('knowledge-tradition', 'Logic, Linguistics & Aesthetics',      'logic-aesthetics',    'Unit VIII',  8),
  ('knowledge-tradition', 'Indian Knowledge of Agriculture & Metallurgy','knowledge-tech','Unit IX',   9),
  ('knowledge-tradition', 'Polity, Ethics & Society in Ancient India','polity-society', 'Unit X',    10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Legal Studies chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('legal-studies', 'Theory of State, Law & Justice',            'theory-state',         11, 'Unit I',    1),
  ('legal-studies', 'Sources of Law: Constitution & Statutes',   'sources-law',          11, 'Unit II',   2),
  ('legal-studies', 'The Indian Judicial System',                'judicial-system',      11, 'Unit III',  3),
  ('legal-studies', 'Topics of Law: Family Law',                 'family-law',           11, 'Unit IV',   4),
  ('legal-studies', 'Topics of Law: Property Law & Contracts',   'property-contracts',   11, 'Unit V',    5),
  ('legal-studies', 'Criminal Justice System',                   'criminal-justice',     12, 'Unit VI',   6),
  ('legal-studies', 'Constitutional Law (Detailed)',             'constitutional-law',   12, 'Unit VII',  7),
  ('legal-studies', 'Human Rights in India',                     'human-rights',         12, 'Unit VIII', 8),
  ('legal-studies', 'Legal Profession in India',                 'legal-profession',     12, 'Unit IX',   9),
  ('legal-studies', 'International Context',                     'international',        12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Mass Media / Mass Communication chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('mass-media', 'Introduction to Mass Communication',           'intro-mass-comm',      11, 'Unit I',    1),
  ('mass-media', 'Print Media: Newspapers & Magazines',          'print-media',          11, 'Unit II',   2),
  ('mass-media', 'Radio Broadcasting',                           'radio',                11, 'Unit III',  3),
  ('mass-media', 'Television',                                   'television',           11, 'Unit IV',   4),
  ('mass-media', 'Cinema & Film Studies',                        'cinema',               12, 'Unit V',    5),
  ('mass-media', 'Digital & Social Media',                       'digital-media',        12, 'Unit VI',   6),
  ('mass-media', 'Advertising',                                  'advertising',          12, 'Unit VII',  7),
  ('mass-media', 'Public Relations & Corporate Communication',   'pr-corporate',         12, 'Unit VIII', 8),
  ('mass-media', 'Journalism & Media Ethics',                    'journalism-ethics',    12, 'Unit IX',   9),
  ('mass-media', 'Media Laws & Regulation',                      'media-laws',           12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Performing Arts chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('performing-arts', 'Indian Music: Hindustani Tradition',      'music-hindustani',     'Unit I',    1),
  ('performing-arts', 'Indian Music: Carnatic Tradition',        'music-carnatic',       'Unit II',   2),
  ('performing-arts', 'Indian Classical Dance Forms',            'dance-classical',      'Unit III',  3),
  ('performing-arts', 'Folk & Tribal Performance Traditions',    'folk-tribal',          'Unit IV',   4),
  ('performing-arts', 'Theatre, Drama & Stagecraft',             'theatre-drama',        'Unit V',    5),
  ('performing-arts', 'Music Theory & Notation',                 'music-theory',         'Unit VI',   6),
  ('performing-arts', 'Aesthetics & Rasa Theory',                'aesthetics-rasa',      'Unit VII',  7),
  ('performing-arts', 'Percussion Instruments',                  'percussion',           'Unit VIII', 8),
  ('performing-arts', 'Non-Percussion Instruments',              'non-percussion',       'Unit IX',   9),
  ('performing-arts', 'Modern Indian Theatre & Performance',     'modern-theatre',       'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Physical Education chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('physical-education', 'Changing Trends & Career in PE',       'trends-career',        11, 'Unit I',     1),
  ('physical-education', 'Olympic Movement',                     'olympics',             11, 'Unit II',    2),
  ('physical-education', 'Physical Fitness, Wellness & Lifestyle','fitness-wellness',    11, 'Unit III',   3),
  ('physical-education', 'Physical Education for Disabled',      'pe-disabled',          11, 'Unit IV',    4),
  ('physical-education', 'Yoga',                                 'yoga',                 11, 'Unit V',     5),
  ('physical-education', 'Anatomy & Physiology',                 'anatomy-physiology',   11, 'Unit VI',    6),
  ('physical-education', 'Test, Measurement & Evaluation',       'test-measurement',     11, 'Unit VII',   7),
  ('physical-education', 'Planning in Sports',                   'planning-sports',      12, 'Unit VIII',  8),
  ('physical-education', 'Sports & Nutrition',                   'sports-nutrition',     12, 'Unit IX',    9),
  ('physical-education', 'Yoga & Lifestyle',                     'yoga-lifestyle',       12, 'Unit X',    10),
  ('physical-education', 'Children & Women in Sports',           'children-women',       12, 'Unit XI',   11),
  ('physical-education', 'Sports Medicine & Doping',             'sports-medicine',      12, 'Unit XII',  12),
  ('physical-education', 'Kinesiology, Biomechanics & Sports',   'biomechanics',         12, 'Unit XIII', 13),
  ('physical-education', 'Psychology & Sports',                  'sports-psychology',    12, 'Unit XIV',  14),
  ('physical-education', 'Training & Doping in Sports',          'training-doping',      12, 'Unit XV',   15)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Political Science chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('political-science', 'Constitution: Why & How',               'constitution-why',     11, 'Unit I',    1),
  ('political-science', 'Rights in the Indian Constitution',     'rights',               11, 'Unit II',   2),
  ('political-science', 'Election & Representation',             'election-rep',         11, 'Unit III',  3),
  ('political-science', 'Executive',                             'executive',            11, 'Unit IV',   4),
  ('political-science', 'Legislature',                           'legislature',          11, 'Unit V',    5),
  ('political-science', 'Judiciary',                             'judiciary',            11, 'Unit VI',   6),
  ('political-science', 'Federalism',                            'federalism',           11, 'Unit VII',  7),
  ('political-science', 'Local Government',                      'local-govt',           11, 'Unit VIII', 8),
  ('political-science', 'Constitution as a Living Document',     'living-doc',           11, 'Unit IX',   9),
  ('political-science', 'The Cold War Era',                      'cold-war',             12, 'Unit X',   10),
  ('political-science', 'End of Bipolarity',                     'end-bipolarity',       12, 'Unit XI',  11),
  ('political-science', 'US Hegemony in World Politics',         'us-hegemony',          12, 'Unit XII', 12),
  ('political-science', 'New Centres of Power',                  'new-centres',          12, 'Unit XIII',13),
  ('political-science', 'South Asia & Contemporary World',       'south-asia',           12, 'Unit XIV', 14),
  ('political-science', 'International Organisations',           'intl-orgs',            12, 'Unit XV',  15),
  ('political-science', 'Globalisation',                         'globalisation',        12, 'Unit XVI', 16),
  ('political-science', 'Era of One-Party Dominance',            'one-party',            12, 'Unit XVII',17),
  ('political-science', 'Era of Coalitions (1989 onwards)',      'coalitions',           12, 'Unit XVIII',18)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Psychology chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('psychology', 'What is Psychology?',                          'what-is-psy',          11, 'Unit I',    1),
  ('psychology', 'Methods of Enquiry in Psychology',             'methods',              11, 'Unit II',   2),
  ('psychology', 'Human Development',                            'human-dev',            11, 'Unit III',  3),
  ('psychology', 'Sensory, Attentional & Perceptual Processes',  'sensory-perception',   11, 'Unit IV',   4),
  ('psychology', 'Learning',                                     'learning',             11, 'Unit V',    5),
  ('psychology', 'Human Memory',                                 'memory',               11, 'Unit VI',   6),
  ('psychology', 'Thinking',                                     'thinking',             11, 'Unit VII',  7),
  ('psychology', 'Motivation & Emotion',                         'motivation-emotion',   11, 'Unit VIII', 8),
  ('psychology', 'Variations in Psychological Attributes',       'variations',           12, 'Unit IX',   9),
  ('psychology', 'Self & Personality',                           'self-personality',     12, 'Unit X',   10),
  ('psychology', 'Meeting Life Challenges',                      'life-challenges',      12, 'Unit XI',  11),
  ('psychology', 'Psychological Disorders',                      'disorders',            12, 'Unit XII', 12),
  ('psychology', 'Therapeutic Approaches',                       'therapy',              12, 'Unit XIII',13),
  ('psychology', 'Attitude & Social Cognition',                  'attitude',             12, 'Unit XIV', 14),
  ('psychology', 'Social Influence & Group Processes',           'social-influence',     12, 'Unit XV',  15),
  ('psychology', 'Psychology & Life',                            'psy-life',             12, 'Unit XVI', 16)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Sanskrit chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('sanskrit', 'Vyakaran (Grammar) — Sandhi & Karak',            'grammar-sandhi',       11, 'Unit I',    1),
  ('sanskrit', 'Vyakaran — Samas, Pratyaya, Upasarga',           'grammar-samas',        11, 'Unit II',   2),
  ('sanskrit', 'Padya (Classical Poetry)',                       'padya',                11, 'Unit III',  3),
  ('sanskrit', 'Gadya (Classical Prose)',                        'gadya',                11, 'Unit IV',   4),
  ('sanskrit', 'Drama & Mahakavya',                              'drama-kavya',          12, 'Unit V',    5),
  ('sanskrit', 'Vedic Sanskrit',                                 'vedic-sanskrit',       12, 'Unit VI',   6),
  ('sanskrit', 'Indian Knowledge through Sanskrit',              'indian-knowledge',     12, 'Unit VII',  7),
  ('sanskrit', 'Translation & Composition',                      'translation',          12, 'Unit VIII', 8),
  ('sanskrit', 'Sanskrit Literary History',                      'literary-history',     12, 'Unit IX',   9),
  ('sanskrit', 'Comprehension (Apathit Avataran)',               'comprehension',        12, 'Unit X',   10)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Sociology chapters (NCERT 11 + 12)
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, cuet_unit, order_index) values
  ('sociology', 'Sociology & Society',                           'soc-society',          11, 'Unit I',    1),
  ('sociology', 'Terms, Concepts & Their Use in Sociology',      'terms-concepts',       11, 'Unit II',   2),
  ('sociology', 'Understanding Social Institutions',             'institutions',         11, 'Unit III',  3),
  ('sociology', 'Culture & Socialisation',                       'culture',              11, 'Unit IV',   4),
  ('sociology', 'Doing Sociology: Research Methods',             'research-methods',     11, 'Unit V',    5),
  ('sociology', 'Demographic Structure of Indian Society',       'demographic',          12, 'Unit VI',   6),
  ('sociology', 'Social Institutions: Continuity & Change',      'institutions-change',  12, 'Unit VII',  7),
  ('sociology', 'The Market as a Social Institution',            'market',               12, 'Unit VIII', 8),
  ('sociology', 'Pattern of Social Inequality & Exclusion',      'inequality',           12, 'Unit IX',   9),
  ('sociology', 'The Challenges of Cultural Diversity',          'diversity',            12, 'Unit X',   10),
  ('sociology', 'Suggestions for Project Work / Sociologists',   'projects',             12, 'Unit XI',  11),
  ('sociology', 'Structural Change',                             'structural-change',    12, 'Unit XII', 12),
  ('sociology', 'Cultural Change',                               'cultural-change',      12, 'Unit XIII',13),
  ('sociology', 'The Story of Indian Democracy',                 'indian-democracy',     12, 'Unit XIV', 14),
  ('sociology', 'Change & Development in Rural Society',         'rural-society',        12, 'Unit XV',  15),
  ('sociology', 'Change & Development in Industrial Society',    'industrial-society',   12, 'Unit XVI', 16),
  ('sociology', 'Globalisation & Social Change',                 'globalisation',        12, 'Unit XVII',17),
  ('sociology', 'Mass Media & Communication',                    'mass-media',           12, 'Unit XVIII',18),
  ('sociology', 'Social Movements',                              'social-movements',     12, 'Unit XIX', 19)
on conflict (subject_id, slug) do nothing;

-- ----------------------------------------------------------------------
-- Teaching Aptitude chapters
-- ----------------------------------------------------------------------
insert into public.chapters (subject_id, name, slug, cuet_unit, order_index) values
  ('teaching-aptitude', 'Teaching as a Profession',              'teaching-profession',  'Unit I',    1),
  ('teaching-aptitude', 'Learner Characteristics & Learning',    'learner',              'Unit II',   2),
  ('teaching-aptitude', 'Instructional Methods & Strategies',    'instruction',          'Unit III',  3),
  ('teaching-aptitude', 'Communication in Teaching',             'communication',        'Unit IV',   4),
  ('teaching-aptitude', 'Educational Technology & ICT',          'edu-tech',             'Unit V',    5),
  ('teaching-aptitude', 'Evaluation & Assessment',               'evaluation',           'Unit VI',   6),
  ('teaching-aptitude', 'Classroom Management',                  'classroom-mgmt',       'Unit VII',  7),
  ('teaching-aptitude', 'Educational Philosophy & Sociology',    'edu-philosophy',       'Unit VIII', 8),
  ('teaching-aptitude', 'Inclusive Education',                   'inclusive',            'Unit IX',   9),
  ('teaching-aptitude', 'Right to Education & Policies',         'rte-policies',         'Unit X',   10)
on conflict (subject_id, slug) do nothing;


-- ----------------------------------------------------------------------
-- Verification: count all subjects + chapters at the end so the run
-- output tells us the totals.
-- ----------------------------------------------------------------------
select
  (select count(*) from public.subjects) as total_subjects,
  (select count(*) from public.chapters) as total_chapters,
  (select count(*) from public.topics)   as total_topics;

-- =====================================================================
-- migration 005 (cleanup) starts here
-- =====================================================================
-- ======================================================================
-- Migration 005: Simplify schema for Duolingo-style v1.
-- Drops the Avatar TLA story system + houses + cosmetics.
-- Keeps subjects → chapters → topics, user_topic_mastery, and the
-- original 4 quiz tables.
-- ======================================================================

-- 1) Drop story / cosmetic / progress tables (cascade drops policies)
drop table if exists public.user_progress      cascade;
drop table if exists public.story_nodes        cascade;
drop table if exists public.story_arcs         cascade;
drop table if exists public.user_cosmetics     cascade;
drop table if exists public.cosmetics          cascade;

-- 2) Drop columns we no longer need from public.users
alter table public.users drop column if exists house;
alter table public.users drop column if exists avatar_config;

-- 3) Drop the story-node FK column we added to quizzes
alter table public.quizzes drop column if exists story_node_id;

-- 4) Verification
select
  (select count(*) from public.subjects)              as subjects,
  (select count(*) from public.chapters)              as chapters,
  (select count(*) from public.topics)                as topics,
  (select count(*) from public.user_topic_mastery)    as mastery_rows,
  (select count(*) from public.users)                 as users;
