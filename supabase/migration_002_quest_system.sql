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
