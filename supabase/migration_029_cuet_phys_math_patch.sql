-- Migration 029 — CUET Physics + Math chapter-name corrections
--
-- Context: migration 028 seeded Physics topics under NCERT-style chapter names
-- ("Atoms and Nuclei", "Motion in a Straight Line", "Physical World") but the
-- live DB uses the CUET 20-chapter consolidated syllabus with "&" not "and"
-- ("Atoms & Nuclei", "Kinematics", "Physical World & Measurement"). Result:
-- only 4 of 20 Physics chapters got topics. This migration re-seeds Physics
-- topics under the ACTUAL chapter names, and patches the 3 Math chapter
-- outliers + 1 Chemistry stale-leftover.
--
-- Idempotent: deletes generic placeholders + my prior failed-match inserts
-- by name list, then inserts 6 topics per chapter via ON CONFLICT DO UPDATE.

-- 1) Clean stale topics that survived migration 028 ----------------------------
-- "Structure of Atom" has 13 topics (6 from me + 7 stale leftovers under
-- different names). Drop everything that isn't in my known canonical 6-name set
-- for THIS chapter.
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id = 'chemistry'
   and c.name = 'Structure of Atom'
   and t.name not in (
     'Subatomic Particles & Atomic Models',
     'Bohr''s Model & Hydrogen Spectrum',
     'Quantum Numbers & Orbital Shapes',
     'Aufbau, Hund''s Rule & Pauli',
     'Electronic Configuration',
     'Heisenberg Uncertainty Principle'
   );

-- Clean partial Math chapter that has 11 topics from name-conflation
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id = 'mathematics'
   and c.name = 'Continuity & Differentiability'
   and t.name in (
     -- prior generic placeholders that survived
     'Concepts & Definitions','Worked Examples','Formulae & Shortcuts',
     'Common Mistakes','Mixed Practice','Practice Set'
   );

-- 2) Physics: seed against ACTUAL 20-chapter CUET syllabus ---------------------
-- DB chapters (20):
--   Atoms & Nuclei
--   Behaviour of Perfect Gas & Kinetic Theory
--   Communication Systems
--   Current Electricity
--   Dual Nature of Matter & Radiation
--   Electromagnetic Induction & AC
--   Electromagnetic Waves
--   Electronic Devices
--   Electrostatics
--   Gravitation
--   Kinematics
--   Laws of Motion
--   Magnetic Effects of Current & Magnetism
--   Motion of System of Particles
--   Optics
--   Oscillations & Waves
--   Physical World & Measurement
--   Properties of Bulk Matter
--   Thermodynamics
--   Work, Energy & Power

with raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values

  ('physics', 'Physical World & Measurement', 'Scope & Nature of Physics',           'scope',         1),
  ('physics', 'Physical World & Measurement', 'Fundamental Forces',                  'forces',        2),
  ('physics', 'Physical World & Measurement', 'SI Units & Base Quantities',          'si-units',      3),
  ('physics', 'Physical World & Measurement', 'Dimensional Analysis',                'dimensions',    4),
  ('physics', 'Physical World & Measurement', 'Significant Figures & Errors',        'sig-errors',    5),
  ('physics', 'Physical World & Measurement', 'Order of Magnitude Estimation',       'estimation',    6),

  ('physics', 'Kinematics', 'Position, Distance & Displacement',     'position',       1),
  ('physics', 'Kinematics', 'Velocity & Equations of Motion (1D)',   'equations-1d',   2),
  ('physics', 'Kinematics', 'Graphical Representation (x-t, v-t)',   'graphs',         3),
  ('physics', 'Kinematics', 'Free Fall & Vertical Motion',           'free-fall',      4),
  ('physics', 'Kinematics', 'Vectors & Projectile Motion',           'projectile',     5),
  ('physics', 'Kinematics', 'Uniform Circular Motion & Relative Velocity', 'circular-relative', 6),

  ('physics', 'Laws of Motion', 'Newton''s First Law & Inertia',              'first-law',    1),
  ('physics', 'Laws of Motion', 'Newton''s Second Law & Momentum',            'second-law',   2),
  ('physics', 'Laws of Motion', 'Newton''s Third Law & Action-Reaction',     'third-law',    3),
  ('physics', 'Laws of Motion', 'Friction (Static & Kinetic)',                'friction',     4),
  ('physics', 'Laws of Motion', 'Circular Motion Dynamics',                   'circular-dyn', 5),
  ('physics', 'Laws of Motion', 'Pseudo Forces in Non-Inertial Frames',       'pseudo',       6),

  ('physics', 'Work, Energy & Power', 'Work Done by Constant & Variable Force',  'work',           1),
  ('physics', 'Work, Energy & Power', 'Kinetic Energy & Work-Energy Theorem',    'ke-theorem',     2),
  ('physics', 'Work, Energy & Power', 'Potential Energy (Gravity & Spring)',     'pe',             3),
  ('physics', 'Work, Energy & Power', 'Conservation of Mechanical Energy',       'conservation',   4),
  ('physics', 'Work, Energy & Power', 'Collisions (Elastic & Inelastic)',        'collisions',     5),
  ('physics', 'Work, Energy & Power', 'Power & Efficiency',                      'power',          6),

  ('physics', 'Motion of System of Particles', 'Centre of Mass',                          'com',         1),
  ('physics', 'Motion of System of Particles', 'Moment of Inertia & Theorems',            'moi',         2),
  ('physics', 'Motion of System of Particles', 'Angular Velocity & Acceleration',         'angular',     3),
  ('physics', 'Motion of System of Particles', 'Torque & Angular Momentum',               'torque',      4),
  ('physics', 'Motion of System of Particles', 'Rolling Motion',                          'rolling',     5),
  ('physics', 'Motion of System of Particles', 'Conservation of Angular Momentum',        'cons-am',     6),

  ('physics', 'Gravitation', 'Universal Law of Gravitation',                 'law',         1),
  ('physics', 'Gravitation', 'Gravitational Field & Potential',              'field-pot',   2),
  ('physics', 'Gravitation', 'Acceleration Due to Gravity (Earth)',          'g-earth',     3),
  ('physics', 'Gravitation', 'Orbital & Escape Velocity',                    'orbital',     4),
  ('physics', 'Gravitation', 'Kepler''s Laws of Planetary Motion',           'kepler',      5),
  ('physics', 'Gravitation', 'Geostationary & Polar Satellites',             'satellites',  6),

  ('physics', 'Properties of Bulk Matter', 'Stress, Strain & Hooke''s Law',       'stress-strain',     1),
  ('physics', 'Properties of Bulk Matter', 'Young''s, Bulk & Shear Modulus',      'moduli',            2),
  ('physics', 'Properties of Bulk Matter', 'Pressure & Pascal''s Law',            'pressure',          3),
  ('physics', 'Properties of Bulk Matter', 'Bernoulli''s Principle',              'bernoulli',         4),
  ('physics', 'Properties of Bulk Matter', 'Viscosity & Stokes'' Law',            'viscosity',         5),
  ('physics', 'Properties of Bulk Matter', 'Surface Tension & Capillarity',       'surface-tension',   6),

  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Gas Laws (Boyle, Charles, Avogadro)', 'gas-laws',    1),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Ideal Gas Equation',                  'ideal-gas',   2),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Kinetic Molecular Theory',            'kmt',         3),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Mean Free Path & Brownian Motion',    'mean-path',   4),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Degrees of Freedom & Equipartition',  'dof',         5),
  ('physics', 'Behaviour of Perfect Gas & Kinetic Theory', 'Speed Distribution (Maxwell)',        'maxwell',     6),

  ('physics', 'Thermodynamics', 'Heat, Temperature & Thermal Expansion',     'heat-temp',     1),
  ('physics', 'Thermodynamics', 'Specific Heat & Calorimetry',               'specific',      2),
  ('physics', 'Thermodynamics', 'Modes of Heat Transfer',                    'transfer',      3),
  ('physics', 'Thermodynamics', 'First Law of Thermodynamics',               'first-law',     4),
  ('physics', 'Thermodynamics', 'Thermodynamic Processes & PV Diagrams',     'processes',     5),
  ('physics', 'Thermodynamics', 'Second Law & Carnot Engine',                'second-law',    6),

  ('physics', 'Oscillations & Waves', 'Simple Harmonic Motion (Basics)',       'shm',           1),
  ('physics', 'Oscillations & Waves', 'Energy in SHM',                         'energy-shm',    2),
  ('physics', 'Oscillations & Waves', 'Simple Pendulum & Spring-Mass',         'pendulum',      3),
  ('physics', 'Oscillations & Waves', 'Wave Motion & Wave Equation',           'wave-motion',   4),
  ('physics', 'Oscillations & Waves', 'Superposition, Beats & Stationary Waves', 'superposition', 5),
  ('physics', 'Oscillations & Waves', 'Doppler Effect',                        'doppler',       6),

  ('physics', 'Electrostatics', 'Coulomb''s Law & Force Vector',              'coulomb',       1),
  ('physics', 'Electrostatics', 'Electric Field & Field Lines',                'field-lines',  2),
  ('physics', 'Electrostatics', 'Gauss''s Law & Applications',                 'gauss',        3),
  ('physics', 'Electrostatics', 'Electric Potential & Equipotential Surfaces', 'potential',    4),
  ('physics', 'Electrostatics', 'Capacitance & Parallel-Plate Capacitor',      'capacitance',  5),
  ('physics', 'Electrostatics', 'Series/Parallel Combinations & Dielectrics',  'combinations', 6),

  ('physics', 'Current Electricity', 'Ohm''s Law & Resistance',                       'ohm',           1),
  ('physics', 'Current Electricity', 'Resistivity & Temperature Dependence',          'resistivity',   2),
  ('physics', 'Current Electricity', 'Kirchhoff''s Laws',                              'kirchhoff',    3),
  ('physics', 'Current Electricity', 'Wheatstone Bridge & Potentiometer',             'wheatstone',    4),
  ('physics', 'Current Electricity', 'EMF, Internal Resistance & Cells',              'emf',           5),
  ('physics', 'Current Electricity', 'Drift Velocity & Mobility',                     'drift',         6),

  ('physics', 'Magnetic Effects of Current & Magnetism', 'Biot-Savart Law',                  'biot-savart',    1),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'Ampere''s Circuital Law',          'ampere',         2),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'Force on Charge & Wire',           'force',          3),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'Solenoid & Toroid',                'solenoid',       4),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'Magnetic Properties of Materials', 'materials',      5),
  ('physics', 'Magnetic Effects of Current & Magnetism', 'Moving Coil Galvanometer',         'galvanometer',   6),

  ('physics', 'Electromagnetic Induction & AC', 'Faraday''s Law & Lenz''s Law',     'faraday',       1),
  ('physics', 'Electromagnetic Induction & AC', 'Self & Mutual Inductance',         'inductance',    2),
  ('physics', 'Electromagnetic Induction & AC', 'AC Generator & Transformer',       'ac-generator',  3),
  ('physics', 'Electromagnetic Induction & AC', 'RMS, Peak & Average Values',       'rms',           4),
  ('physics', 'Electromagnetic Induction & AC', 'LCR Series Circuit & Resonance',   'lcr',           5),
  ('physics', 'Electromagnetic Induction & AC', 'Power in AC Circuits',             'power',         6),

  ('physics', 'Electromagnetic Waves', 'Maxwell''s Equations (qualitative)',  'maxwell',       1),
  ('physics', 'Electromagnetic Waves', 'EM Spectrum & Wavelength Ranges',      'spectrum',     2),
  ('physics', 'Electromagnetic Waves', 'Radio, Micro & Infrared Waves',        'radio-micro',  3),
  ('physics', 'Electromagnetic Waves', 'Visible, UV & X-Rays',                 'visible-uv',   4),
  ('physics', 'Electromagnetic Waves', 'Gamma Rays & Applications',            'gamma',        5),
  ('physics', 'Electromagnetic Waves', 'Properties & Speed of Light',          'properties',   6),

  ('physics', 'Optics', 'Reflection & Mirrors',                              'reflection',  1),
  ('physics', 'Optics', 'Refraction & Lens Formula',                          'refraction', 2),
  ('physics', 'Optics', 'Total Internal Reflection',                          'tir',        3),
  ('physics', 'Optics', 'Optical Instruments (Microscope, Telescope)',         'instruments', 4),
  ('physics', 'Optics', 'Wave Optics — Interference (YDSE)',                  'interference', 5),
  ('physics', 'Optics', 'Diffraction & Polarization',                          'diffraction', 6),

  ('physics', 'Dual Nature of Matter & Radiation', 'Photoelectric Effect',             'photoelectric',  1),
  ('physics', 'Dual Nature of Matter & Radiation', 'Einstein''s Equation',             'einstein',       2),
  ('physics', 'Dual Nature of Matter & Radiation', 'de Broglie Hypothesis',            'de-broglie',     3),
  ('physics', 'Dual Nature of Matter & Radiation', 'Davisson-Germer Experiment',       'davisson',       4),
  ('physics', 'Dual Nature of Matter & Radiation', 'Wave-Particle Duality',            'duality',        5),
  ('physics', 'Dual Nature of Matter & Radiation', 'Work Function & Threshold',        'work-function',  6),

  ('physics', 'Atoms & Nuclei', 'Bohr Model of Hydrogen Atom',          'bohr',           1),
  ('physics', 'Atoms & Nuclei', 'Hydrogen Spectrum & Series',           'spectrum',       2),
  ('physics', 'Atoms & Nuclei', 'Nuclear Composition & Size',           'composition',    3),
  ('physics', 'Atoms & Nuclei', 'Mass Defect & Binding Energy',         'binding',        4),
  ('physics', 'Atoms & Nuclei', 'Radioactivity & Decay Law',            'radioactivity',  5),
  ('physics', 'Atoms & Nuclei', 'Fission, Fusion & Chain Reaction',     'fission-fusion', 6),

  ('physics', 'Electronic Devices', 'Intrinsic & Extrinsic Semiconductors',         'intrinsic',    1),
  ('physics', 'Electronic Devices', 'PN Junction Diode',                            'pn-junction',  2),
  ('physics', 'Electronic Devices', 'Diode as Rectifier (Half & Full Wave)',        'rectifier',    3),
  ('physics', 'Electronic Devices', 'Zener Diode & Voltage Regulator',              'zener',        4),
  ('physics', 'Electronic Devices', 'Transistor as Amplifier & Switch',             'transistor',   5),
  ('physics', 'Electronic Devices', 'Logic Gates (AND, OR, NOT, NAND, NOR)',        'logic-gates',  6),

  ('physics', 'Communication Systems', 'Elements of a Communication System',         'elements',       1),
  ('physics', 'Communication Systems', 'Bandwidth of Signals & Transmission Media',  'bandwidth',      2),
  ('physics', 'Communication Systems', 'Propagation of EM Waves (Ground, Sky, Space)', 'propagation',  3),
  ('physics', 'Communication Systems', 'Modulation Need & Types (AM, FM, PM)',       'modulation',     4),
  ('physics', 'Communication Systems', 'Amplitude Modulation in Detail',             'am-detail',      5),
  ('physics', 'Communication Systems', 'Production & Detection of AM Wave',          'am-prod-det',    6),

  -- 3) Math: patch 3 outlier chapters --------------------------------------------
  ('mathematics', 'Mathematical Induction', 'Principle of Mathematical Induction',     'pmi-principle',  1),
  ('mathematics', 'Mathematical Induction', 'Sum-Based PMI Problems',                  'sum',            2),
  ('mathematics', 'Mathematical Induction', 'Divisibility PMI Problems',               'divisibility',   3),
  ('mathematics', 'Mathematical Induction', 'Inequality PMI Problems',                 'inequality',     4),
  ('mathematics', 'Mathematical Induction', 'PMI with Sequences & Series',             'sequences',      5),
  ('mathematics', 'Mathematical Induction', 'Common Mistakes & PYQ Patterns',          'pyq-pmi',        6),

  ('mathematics', 'Probability (Adv)', 'Conditional Probability',                       'conditional',    1),
  ('mathematics', 'Probability (Adv)', 'Bayes'' Theorem',                                'bayes',          2),
  ('mathematics', 'Probability (Adv)', 'Independence of Events',                        'independence',   3),
  ('mathematics', 'Probability (Adv)', 'Random Variables & Distributions',              'random-var',     4),
  ('mathematics', 'Probability (Adv)', 'Bernoulli Trials & Binomial Distribution',      'binomial',       5),
  ('mathematics', 'Probability (Adv)', 'Mean & Variance of Distributions',              'mean-variance',  6),

  ('mathematics', 'Continuity & Differentiability', 'Continuity at a Point & in an Interval',  'continuity-point', 1),
  ('mathematics', 'Continuity & Differentiability', 'Algebra of Continuous Functions',         'algebra-cont',     2),
  ('mathematics', 'Continuity & Differentiability', 'Differentiability & First Principles',    'differentiability', 3),
  ('mathematics', 'Continuity & Differentiability', 'Chain Rule, Implicit & Logarithmic Diff', 'chain-implicit',   4),
  ('mathematics', 'Continuity & Differentiability', 'Higher-Order Derivatives & Leibnitz',     'higher-order',     5),
  ('mathematics', 'Continuity & Differentiability', 'Mean Value Theorems (Rolle, Lagrange)',   'mvt',              6)
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

-- VERIFY with:
--   select s.name as subject, count(distinct c.id) as chapters, count(t.id) as topics,
--          round(count(t.id)::numeric / nullif(count(distinct c.id),0), 1) as avg
--     from public.chapters c
--     join public.subjects s on s.id = c.subject_id
--     left join public.topics t on t.chapter_id = c.id
--    where s.id in ('mathematics','physics','chemistry')
--    group by s.name order by s.name;
--   -- expect: Chemistry 29ch/174t/6.0; Mathematics 29ch/174t/6.0; Physics 20ch/120t/6.0
