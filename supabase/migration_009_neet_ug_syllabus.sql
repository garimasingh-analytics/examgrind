-- Migration 009: NEET UG syllabus (NCERT class 11 + 12)
--
-- 3 subjects (Physics, Chemistry, Biology) mirroring the official NTA
-- NEET UG syllabus. Chapters are NCERT-aligned with the class number
-- (11 or 12) tagged so the UI can group by class.
--
-- Slug strategy: `neet-` prefix avoids collision with CUET's `physics`,
-- `chemistry`, `biology` subject IDs.
--
-- Run with: paste into Supabase SQL Editor
-- Reversibility: delete from subjects where exam_id = (select id from exams where slug='neet-ug');

-- 1) Subjects -------------------------------------------------------------
insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  ('neet-physics',   'Physics',   (select id from exams where slug='neet-ug'), '⚛',  1, 'NCERT class 11+12 · Mechanics, thermodynamics, optics, modern physics'),
  ('neet-chemistry', 'Chemistry', (select id from exams where slug='neet-ug'), '⚗',  2, 'NCERT class 11+12 · Physical, inorganic, organic chemistry'),
  ('neet-biology',   'Biology',   (select id from exams where slug='neet-ug'), '🌿', 3, 'NCERT class 11 (Botany) + class 12 (Zoology) · Diversity, physiology, genetics, ecology')
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  description = excluded.description,
  icon = excluded.icon,
  order_index = excluded.order_index;

-- 2) Chapters: Physics ----------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, order_index) values
  ('neet-physics', 'Physical World and Measurement',     'physical-world',          11,  1),
  ('neet-physics', 'Kinematics',                         'kinematics',              11,  2),
  ('neet-physics', 'Laws of Motion',                     'laws-of-motion',          11,  3),
  ('neet-physics', 'Work, Energy and Power',             'work-energy-power',       11,  4),
  ('neet-physics', 'Motion of System of Particles and Rigid Body', 'rotational-motion', 11, 5),
  ('neet-physics', 'Gravitation',                        'gravitation',             11,  6),
  ('neet-physics', 'Properties of Bulk Matter',          'bulk-matter',             11,  7),
  ('neet-physics', 'Thermodynamics',                     'thermodynamics',          11,  8),
  ('neet-physics', 'Behaviour of Perfect Gas and Kinetic Theory', 'kinetic-theory', 11,  9),
  ('neet-physics', 'Oscillations and Waves',             'oscillations-waves',      11, 10),
  ('neet-physics', 'Electrostatics',                     'electrostatics',          12, 11),
  ('neet-physics', 'Current Electricity',                'current-electricity',     12, 12),
  ('neet-physics', 'Magnetic Effects of Current and Magnetism', 'magnetism',        12, 13),
  ('neet-physics', 'Electromagnetic Induction and AC',   'emi-ac',                  12, 14),
  ('neet-physics', 'Electromagnetic Waves',              'em-waves',                12, 15),
  ('neet-physics', 'Optics (Ray + Wave)',                'optics',                  12, 16),
  ('neet-physics', 'Dual Nature of Matter and Radiation','dual-nature',             12, 17),
  ('neet-physics', 'Atoms and Nuclei',                   'atoms-nuclei',            12, 18),
  ('neet-physics', 'Electronic Devices (Semiconductors)','semiconductors',          12, 19)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  ncert_class = excluded.ncert_class,
  order_index = excluded.order_index;

-- 3) Chapters: Chemistry --------------------------------------------------
insert into public.chapters (subject_id, name, slug, ncert_class, order_index) values
  ('neet-chemistry', 'Some Basic Concepts of Chemistry',   'basic-concepts',         11,  1),
  ('neet-chemistry', 'Structure of Atom',                  'atomic-structure',       11,  2),
  ('neet-chemistry', 'Classification of Elements & Periodicity', 'periodicity',      11,  3),
  ('neet-chemistry', 'Chemical Bonding & Molecular Structure', 'chemical-bonding',   11,  4),
  ('neet-chemistry', 'States of Matter (Gases & Liquids)', 'states-of-matter',       11,  5),
  ('neet-chemistry', 'Thermodynamics',                     'chem-thermodynamics',    11,  6),
  ('neet-chemistry', 'Equilibrium',                        'equilibrium',            11,  7),
  ('neet-chemistry', 'Redox Reactions',                    'redox',                  11,  8),
  ('neet-chemistry', 'Hydrogen',                           'hydrogen',               11,  9),
  ('neet-chemistry', 's-Block Elements',                   's-block',                11, 10),
  ('neet-chemistry', 'p-Block Elements (Group 13-14)',     'p-block-1314',           11, 11),
  ('neet-chemistry', 'Organic Chemistry: Basic Principles','organic-basics',         11, 12),
  ('neet-chemistry', 'Hydrocarbons',                       'hydrocarbons',           11, 13),
  ('neet-chemistry', 'Environmental Chemistry',            'environmental-chem',     11, 14),
  ('neet-chemistry', 'Solid State',                        'solid-state',            12, 15),
  ('neet-chemistry', 'Solutions',                          'solutions',              12, 16),
  ('neet-chemistry', 'Electrochemistry',                   'electrochemistry',       12, 17),
  ('neet-chemistry', 'Chemical Kinetics',                  'chemical-kinetics',      12, 18),
  ('neet-chemistry', 'Surface Chemistry',                  'surface-chemistry',      12, 19),
  ('neet-chemistry', 'General Principles of Isolation of Elements', 'metallurgy',    12, 20),
  ('neet-chemistry', 'p-Block Elements (Group 15-18)',     'p-block-1518',           12, 21),
  ('neet-chemistry', 'd- and f-Block Elements',            'd-f-block',              12, 22),
  ('neet-chemistry', 'Coordination Compounds',             'coordination',           12, 23),
  ('neet-chemistry', 'Haloalkanes & Haloarenes',           'haloalkanes',            12, 24),
  ('neet-chemistry', 'Alcohols, Phenols & Ethers',         'alcohols-phenols',       12, 25),
  ('neet-chemistry', 'Aldehydes, Ketones & Carboxylic Acids', 'aldehydes-ketones',   12, 26),
  ('neet-chemistry', 'Amines',                             'amines',                 12, 27),
  ('neet-chemistry', 'Biomolecules',                       'biomolecules',           12, 28),
  ('neet-chemistry', 'Polymers',                           'polymers',               12, 29),
  ('neet-chemistry', 'Chemistry in Everyday Life',         'everyday-chemistry',     12, 30)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  ncert_class = excluded.ncert_class,
  order_index = excluded.order_index;

-- 4) Chapters: Biology (Botany class 11 + Zoology class 12) ---------------
insert into public.chapters (subject_id, name, slug, ncert_class, order_index) values
  ('neet-biology', 'Diversity in Living World',                'diversity',          11,  1),
  ('neet-biology', 'Structural Organisation in Animals & Plants', 'structural-org',  11,  2),
  ('neet-biology', 'Cell Structure and Function',              'cell-structure',     11,  3),
  ('neet-biology', 'Plant Physiology',                         'plant-physiology',   11,  4),
  ('neet-biology', 'Human Physiology',                         'human-physiology',   11,  5),
  ('neet-biology', 'Reproduction',                             'reproduction',       12,  6),
  ('neet-biology', 'Genetics and Evolution',                   'genetics-evolution', 12,  7),
  ('neet-biology', 'Biology and Human Welfare',                'biology-welfare',    12,  8),
  ('neet-biology', 'Biotechnology and its Applications',       'biotechnology',      12,  9),
  ('neet-biology', 'Ecology and Environment',                  'ecology',            12, 10)
on conflict (subject_id, slug) do update set
  name = excluded.name,
  ncert_class = excluded.ncert_class,
  order_index = excluded.order_index;

-- Done. Verify with:
--   select s.name, count(c.id) as chapters from subjects s
--     left join chapters c on c.subject_id = s.id
--    where s.exam_id = (select id from exams where slug='neet-ug')
--    group by s.name order by s.name;
