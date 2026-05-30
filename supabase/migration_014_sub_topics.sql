-- Migration 014: Real sub-topics for SSC CGL + NEET UG
--
-- Migration 012 seeded ONE generic "Practice Set" topic per chapter as a
-- placeholder so the quiz API had a topicId to land on. That worked for
-- foundation-testing but it's not a launchable depth — users want to drill
-- "Successive Percentage" or "Cannizzaro Reaction", not a vague "Practice Set".
--
-- This migration replaces the placeholders with pedagogically meaningful
-- sub-topics — 3 to 4 per chapter — chosen to match how SSC and NEET
-- candidates actually study (R.S. Aggarwal / S.P. Bakshi divisions for SSC,
-- NCERT section-level divisions for NEET).
--
-- Approach:
--   1. Drop the old "Practice Set" topics for SSC/NEET chapters.
--      Cascades to user_topic_mastery (acceptable — we're pre-launch).
--   2. Insert new sub-topics with stable slugs.
--
-- Run with: paste into Supabase SQL Editor (you'll see the destructive-op
-- confirmation — Run query).

-- 1) Wipe the placeholder Practice Set topics --------------------------
delete from public.topics t
 using public.chapters c, public.subjects s, public.exams e
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.exam_id    = e.id
   and e.slug      in ('ssc-cgl', 'neet-ug')
   and t.slug       = 'practice-set';

-- 2) Seed sub-topics per chapter ---------------------------------------
-- We use a helper CTE pattern that joins (subject_slug, chapter_slug,
-- topic_name, topic_slug, order) → chapter_id. This avoids hardcoding
-- chapter UUIDs and keeps the migration re-runnable.

with raw(subject_id, chapter_slug, topic_name, topic_slug, ord) as (values

  -- ============================= SSC CGL — QUANT =============================
  ('ssc-quant', 'number-systems',        'Divisibility & Factors',         'divisibility',          1),
  ('ssc-quant', 'number-systems',        'HCF & LCM',                      'hcf-lcm',               2),
  ('ssc-quant', 'number-systems',        'Remainders & Cyclicity',         'remainders',            3),
  ('ssc-quant', 'number-systems',        'Number Properties',              'properties',            4),

  ('ssc-quant', 'simplification',        'BODMAS & Order of Ops',          'bodmas',                1),
  ('ssc-quant', 'simplification',        'Approximations',                 'approximations',        2),
  ('ssc-quant', 'simplification',        'Surds & Indices',                'surds-indices',         3),
  ('ssc-quant', 'simplification',        'Algebraic Identities',           'identities',            4),

  ('ssc-quant', 'percentages',           'Basics & Conversion',            'basics',                1),
  ('ssc-quant', 'percentages',           'Successive Percentage',          'successive',            2),
  ('ssc-quant', 'percentages',           'Income, Expenditure & Savings',  'income-expenditure',    3),
  ('ssc-quant', 'percentages',           'Population & Depreciation',      'population',            4),

  ('ssc-quant', 'profit-loss',           'Cost Price, SP & Marked Price',  'cp-sp-mp',              1),
  ('ssc-quant', 'profit-loss',           'Discount & Successive Discount', 'discount',              2),
  ('ssc-quant', 'profit-loss',           'Two-article Equation',           'two-article',           3),
  ('ssc-quant', 'profit-loss',           'Faulty Weights & Dishonest Dealer', 'faulty-weights',     4),

  ('ssc-quant', 'ratio-proportion',      'Basics & Compound Ratio',        'basics',                1),
  ('ssc-quant', 'ratio-proportion',      'Partnership',                    'partnership',           2),
  ('ssc-quant', 'ratio-proportion',      'Mixture Ratio',                  'mixture-ratio',         3),
  ('ssc-quant', 'ratio-proportion',      'Direct & Inverse Variation',     'variation',             4),

  ('ssc-quant', 'average',               'Simple Average',                 'simple',                1),
  ('ssc-quant', 'average',               'Weighted Average',               'weighted',              2),
  ('ssc-quant', 'average',               'Adding & Removing Elements',     'add-remove',            3),
  ('ssc-quant', 'average',               'Average of Speed / Distance',    'speed-distance',        4),

  ('ssc-quant', 'time-speed-distance',   'Linear Motion',                  'linear',                1),
  ('ssc-quant', 'time-speed-distance',   'Trains',                         'trains',                2),
  ('ssc-quant', 'time-speed-distance',   'Boats & Streams',                'boats-streams',         3),
  ('ssc-quant', 'time-speed-distance',   'Races & Circular Motion',        'races',                 4),

  ('ssc-quant', 'time-work',             'Combined Workers',               'combined',              1),
  ('ssc-quant', 'time-work',             'Pipes & Cisterns',               'pipes-cisterns',        2),
  ('ssc-quant', 'time-work',             'Efficiency & Alternate Day',     'efficiency',            3),
  ('ssc-quant', 'time-work',             'Wages Distribution',             'wages',                 4),

  ('ssc-quant', 'interest',              'Simple Interest',                'si',                    1),
  ('ssc-quant', 'interest',              'Compound Interest',              'ci',                    2),
  ('ssc-quant', 'interest',              'SI vs CI Comparison',            'si-vs-ci',              3),
  ('ssc-quant', 'interest',              'Installments & EMI',             'installments',          4),

  ('ssc-quant', 'mixtures-alligation',   'Two-element Alligation',         'two-element',           1),
  ('ssc-quant', 'mixtures-alligation',   'Three-element Alligation',       'three-element',         2),
  ('ssc-quant', 'mixtures-alligation',   'Successive Replacement',         'replacement',           3),
  ('ssc-quant', 'mixtures-alligation',   'Cost & Profit Mixing',           'cost-profit',           4),

  ('ssc-quant', 'algebra',               'Linear Equations',               'linear',                1),
  ('ssc-quant', 'algebra',               'Quadratic Equations',            'quadratic',             2),
  ('ssc-quant', 'algebra',               'Polynomial Identities',          'polynomial-identities', 3),
  ('ssc-quant', 'algebra',               'Inequalities',                   'inequalities',          4),

  ('ssc-quant', 'geometry',              'Lines, Angles & Parallel Lines', 'lines-angles',          1),
  ('ssc-quant', 'geometry',              'Triangles',                      'triangles',             2),
  ('ssc-quant', 'geometry',              'Quadrilaterals & Polygons',      'quadrilaterals',        3),
  ('ssc-quant', 'geometry',              'Circles, Chords & Tangents',     'circles',               4),

  ('ssc-quant', 'mensuration',           '2D Areas & Perimeters',          '2d-areas',              1),
  ('ssc-quant', 'mensuration',           '3D Volume & Surface Area',       '3d-volume',             2),
  ('ssc-quant', 'mensuration',           'Sectors, Arcs & Segments',       'sectors',               3),
  ('ssc-quant', 'mensuration',           'Combined / Painted Shapes',      'combined',              4),

  ('ssc-quant', 'trigonometry',          'Basic Ratios & Pythagorean Triples', 'basic-ratios',      1),
  ('ssc-quant', 'trigonometry',          'Identities & Simplification',    'identities',            2),
  ('ssc-quant', 'trigonometry',          'Complementary Angles',           'complementary',         3),
  ('ssc-quant', 'trigonometry',          'Max-Min Values',                 'max-min',               4),

  ('ssc-quant', 'heights-distances',     'Single Object',                  'single-object',         1),
  ('ssc-quant', 'heights-distances',     'Two Objects, Same Side',         'two-same-side',         2),
  ('ssc-quant', 'heights-distances',     'Two Objects, Different Sides',   'two-diff-sides',        3),
  ('ssc-quant', 'heights-distances',     'Moving Objects',                 'moving',                4),

  ('ssc-quant', 'data-interpretation',   'Bar Graphs',                     'bar',                   1),
  ('ssc-quant', 'data-interpretation',   'Pie Charts',                     'pie',                   2),
  ('ssc-quant', 'data-interpretation',   'Line Graphs',                    'line',                  3),
  ('ssc-quant', 'data-interpretation',   'Tables & Caselets',              'tables',                4),

  ('ssc-quant', 'statistics',            'Mean, Median, Mode',             'central-tendency',      1),
  ('ssc-quant', 'statistics',            'Range, Variance & SD',           'spread',                2),
  ('ssc-quant', 'statistics',            'Probability Basics',             'probability',           3),
  ('ssc-quant', 'statistics',            'Permutations & Combinations',    'perm-comb',             4),

  -- ============================= SSC CGL — REASONING ============================
  ('ssc-reasoning', 'analogies',                  'Word Analogies',                'word',          1),
  ('ssc-reasoning', 'analogies',                  'Number Analogies',              'number',        2),
  ('ssc-reasoning', 'analogies',                  'Alphabet Analogies',            'alphabet',      3),

  ('ssc-reasoning', 'classification',             'Word Odd-one-out',              'word',          1),
  ('ssc-reasoning', 'classification',             'Number Odd-one-out',            'number',        2),
  ('ssc-reasoning', 'classification',             'Alphabet & Mixed',              'mixed',         3),

  ('ssc-reasoning', 'series',                     'Number Series',                 'number',        1),
  ('ssc-reasoning', 'series',                     'Letter Series',                 'letter',        2),
  ('ssc-reasoning', 'series',                     'Mixed & Alphanumeric Series',   'mixed',         3),

  ('ssc-reasoning', 'coding-decoding',            'Letter Coding',                 'letter',        1),
  ('ssc-reasoning', 'coding-decoding',            'Number Coding',                 'number',        2),
  ('ssc-reasoning', 'coding-decoding',            'Symbol & Conditional Coding',   'symbol',        3),

  ('ssc-reasoning', 'blood-relations',            'Direct Family Tree',            'tree',          1),
  ('ssc-reasoning', 'blood-relations',            'Pointing Photographs',          'photo',         2),
  ('ssc-reasoning', 'blood-relations',            'Coded Relations',               'coded',         3),

  ('ssc-reasoning', 'direction-sense',            'Single-person Path',            'single',        1),
  ('ssc-reasoning', 'direction-sense',            'Two-person Path',               'two-person',    2),
  ('ssc-reasoning', 'direction-sense',            'Shadow / Sun Direction',        'shadow',        3),

  ('ssc-reasoning', 'ranking-order',              'Linear Ranking',                'linear',        1),
  ('ssc-reasoning', 'ranking-order',              'Two-direction Ranking',         'two-direction', 2),
  ('ssc-reasoning', 'ranking-order',              'Age-based Ranking',             'age',           3),

  ('ssc-reasoning', 'seating-arrangement',        'Linear Seating',                'linear',        1),
  ('ssc-reasoning', 'seating-arrangement',        'Circular Seating',              'circular',      2),
  ('ssc-reasoning', 'seating-arrangement',        'Square & Rectangular',          'square',        3),

  ('ssc-reasoning', 'syllogism',                  'Two Premise',                   'two-premise',   1),
  ('ssc-reasoning', 'syllogism',                  'Three Premise',                 'three-premise', 2),
  ('ssc-reasoning', 'syllogism',                  'Possibility & Either-or',       'possibility',   3),

  ('ssc-reasoning', 'statement-conclusion',       'Single Conclusion',             'single',        1),
  ('ssc-reasoning', 'statement-conclusion',       'Multiple Conclusions',          'multiple',      2),

  ('ssc-reasoning', 'statement-assumption',       'Implicit Assumption',           'implicit',      1),
  ('ssc-reasoning', 'statement-assumption',       'Course of Action',              'action',        2),

  ('ssc-reasoning', 'statement-argument',         'Strong vs Weak Argument',       'strong-weak',   1),
  ('ssc-reasoning', 'statement-argument',         'Logical Argument',              'logical',       2),

  ('ssc-reasoning', 'cause-effect',               'Single Cause',                  'single',        1),
  ('ssc-reasoning', 'cause-effect',               'Independent Events',            'independent',   2),

  ('ssc-reasoning', 'mirror-water-images',        'Mirror Images',                 'mirror',        1),
  ('ssc-reasoning', 'mirror-water-images',        'Water Images',                  'water',         2),

  ('ssc-reasoning', 'paper-folding',              'Folding',                       'folding',       1),
  ('ssc-reasoning', 'paper-folding',              'Cutting',                       'cutting',       2),

  ('ssc-reasoning', 'figure-counting',            'Triangles in Figure',           'triangles',     1),
  ('ssc-reasoning', 'figure-counting',            'Squares & Rectangles',          'squares',       2),

  ('ssc-reasoning', 'embedded-figures',           'Find the Embedded',             'find',          1),
  ('ssc-reasoning', 'embedded-figures',           'Pattern Completion',            'pattern',       2),

  ('ssc-reasoning', 'cube-dice',                  'Dice & Faces',                  'dice',          1),
  ('ssc-reasoning', 'cube-dice',                  'Cube Painting & Slicing',       'cube',          2),

  ('ssc-reasoning', 'venn-diagrams',              'Two-set Venn',                  'two-set',       1),
  ('ssc-reasoning', 'venn-diagrams',              'Three-set Venn',                'three-set',     2),
  ('ssc-reasoning', 'venn-diagrams',              'Logical Categorisation',        'logical',       3),

  -- ============================= SSC CGL — ENGLISH =============================
  ('ssc-english', 'reading-comprehension',        'Inference Questions',           'inference',     1),
  ('ssc-english', 'reading-comprehension',        'Vocabulary in Context',         'vocab',         2),
  ('ssc-english', 'reading-comprehension',        'Detail / Fact Questions',       'detail',        3),

  ('ssc-english', 'cloze-test',                   'Grammar-based Cloze',           'grammar',       1),
  ('ssc-english', 'cloze-test',                   'Vocabulary-based Cloze',        'vocab',         2),

  ('ssc-english', 'para-jumbles',                 '4-sentence Jumbles',            'four',          1),
  ('ssc-english', 'para-jumbles',                 '5-sentence Jumbles',            'five',          2),
  ('ssc-english', 'para-jumbles',                 'Odd Sentence Out',              'odd',           3),

  ('ssc-english', 'spotting-errors',              'Subject-Verb Agreement',        'sva',           1),
  ('ssc-english', 'spotting-errors',              'Tenses',                        'tense',         2),
  ('ssc-english', 'spotting-errors',              'Prepositions',                  'prepositions',  3),
  ('ssc-english', 'spotting-errors',              'Articles & Determiners',        'articles',      4),

  ('ssc-english', 'sentence-improvement',         'Phrase Replacement',            'phrase',        1),
  ('ssc-english', 'sentence-improvement',         'Idiomatic Errors',              'idiomatic',     2),

  ('ssc-english', 'sentence-completion',          'Single Blank',                  'single',        1),
  ('ssc-english', 'sentence-completion',          'Double Blank',                  'double',        2),

  ('ssc-english', 'active-passive',               'Simple Tense Conversion',       'simple',        1),
  ('ssc-english', 'active-passive',               'Modals & Imperatives',          'modals',        2),

  ('ssc-english', 'direct-indirect',              'Statements',                    'statement',     1),
  ('ssc-english', 'direct-indirect',              'Questions',                     'question',      2),
  ('ssc-english', 'direct-indirect',              'Commands & Requests',           'command',       3),

  ('ssc-english', 'synonyms-antonyms',            'Synonyms',                      'synonyms',      1),
  ('ssc-english', 'synonyms-antonyms',            'Antonyms',                      'antonyms',      2),

  ('ssc-english', 'one-word-substitution',        'People & Professions',          'people',        1),
  ('ssc-english', 'one-word-substitution',        'Behaviour & Attitudes',         'behaviour',     2),
  ('ssc-english', 'one-word-substitution',        'Conditions & Studies',          'conditions',    3),

  ('ssc-english', 'idioms-phrases',               'Common Idioms',                 'common',        1),
  ('ssc-english', 'idioms-phrases',               'Phrasal Verbs',                 'phrasal-verbs', 2),

  ('ssc-english', 'spellings',                    'Single-letter Variations',      'single-letter', 1),
  ('ssc-english', 'spellings',                    'Silent Letters & Borrowed Words', 'silent',      2),

  ('ssc-english', 'fill-in-blanks',               'Vocabulary Fill',               'vocab',         1),
  ('ssc-english', 'fill-in-blanks',               'Grammar Fill',                  'grammar',       2),

  -- ============================= SSC CGL — GA =============================
  ('ssc-ga', 'indian-history',                    'Ancient India',                 'ancient',       1),
  ('ssc-ga', 'indian-history',                    'Medieval India',                'medieval',      2),
  ('ssc-ga', 'indian-history',                    'Modern India & Freedom Struggle', 'modern',      3),

  ('ssc-ga', 'world-history',                     'Industrial Revolution',         'industrial',    1),
  ('ssc-ga', 'world-history',                     'World Wars',                    'world-wars',    2),
  ('ssc-ga', 'world-history',                     'Cold War & Decolonization',     'cold-war',      3),

  ('ssc-ga', 'indian-geography',                  'Physical Features',             'physical',      1),
  ('ssc-ga', 'indian-geography',                  'Rivers, Lakes & Climate',       'rivers',        2),
  ('ssc-ga', 'indian-geography',                  'Resources & Agriculture',       'resources',     3),

  ('ssc-ga', 'world-geography',                   'Continents & Oceans',           'continents',    1),
  ('ssc-ga', 'world-geography',                   'Climate Zones & Rivers',        'climate',       2),
  ('ssc-ga', 'world-geography',                   'Countries & Capitals',          'countries',     3),

  ('ssc-ga', 'indian-polity',                     'Constitution & Articles',       'constitution',  1),
  ('ssc-ga', 'indian-polity',                     'Parliament & State Legislatures', 'parliament',  2),
  ('ssc-ga', 'indian-polity',                     'Judiciary',                     'judiciary',     3),
  ('ssc-ga', 'indian-polity',                     'Local Self-Government',         'local',         4),

  ('ssc-ga', 'indian-economy',                    'Macroeconomic Indicators',      'macro',         1),
  ('ssc-ga', 'indian-economy',                    'Banking & RBI',                 'banking',       2),
  ('ssc-ga', 'indian-economy',                    'Five-Year Plans & NITI Aayog',  'plans',         3),
  ('ssc-ga', 'indian-economy',                    'Taxation & Budget',             'taxation',      4),

  ('ssc-ga', 'science-physics',                   'Mechanics Basics',              'mechanics',     1),
  ('ssc-ga', 'science-physics',                   'Heat, Light & Sound',           'heat-light',    2),
  ('ssc-ga', 'science-physics',                   'Electricity & Magnetism',       'electricity',   3),

  ('ssc-ga', 'science-chemistry',                 'Elements & Compounds',          'elements',      1),
  ('ssc-ga', 'science-chemistry',                 'Acids, Bases & Salts',          'acids-bases',   2),
  ('ssc-ga', 'science-chemistry',                 'Everyday Chemistry',            'everyday',      3),

  ('ssc-ga', 'science-biology',                   'Human Body Systems',            'human-body',    1),
  ('ssc-ga', 'science-biology',                   'Plants & Photosynthesis',       'plants',        2),
  ('ssc-ga', 'science-biology',                   'Diseases & Nutrition',          'diseases',      3),

  ('ssc-ga', 'computer-awareness',                'Hardware Basics',               'hardware',      1),
  ('ssc-ga', 'computer-awareness',                'Software & OS',                 'software',      2),
  ('ssc-ga', 'computer-awareness',                'Internet & Networking',         'internet',      3),

  ('ssc-ga', 'current-affairs',                   'National',                      'national',      1),
  ('ssc-ga', 'current-affairs',                   'International',                 'international', 2),
  ('ssc-ga', 'current-affairs',                   'Economy & Business',            'economy',       3),

  ('ssc-ga', 'static-gk',                         'Famous Personalities',          'personalities', 1),
  ('ssc-ga', 'static-gk',                         'Inventions & Discoveries',      'inventions',    2),
  ('ssc-ga', 'static-gk',                         'Dances, Festivals & Tribes',    'culture',       3),

  ('ssc-ga', 'books-authors',                     'Indian Authors',                'indian',        1),
  ('ssc-ga', 'books-authors',                     'International Authors',         'international', 2),

  ('ssc-ga', 'awards-honours',                    'National Awards',               'national',      1),
  ('ssc-ga', 'awards-honours',                    'International Awards',          'international', 2),
  ('ssc-ga', 'awards-honours',                    'Literary & Film Awards',        'literary',      3),

  ('ssc-ga', 'sports',                            'Cricket',                       'cricket',       1),
  ('ssc-ga', 'sports',                            'Olympics & Asian Games',        'olympics',      2),
  ('ssc-ga', 'sports',                            'Other Sports & Players',        'other',         3),

  ('ssc-ga', 'important-days',                    'National Days',                 'national',      1),
  ('ssc-ga', 'important-days',                    'International Days',            'international', 2),

  -- ============================= NEET UG — PHYSICS =============================
  ('neet-physics', 'physical-world',              'Units & Dimensions',            'units',         1),
  ('neet-physics', 'physical-world',              'Measurement & Significant Figures', 'sig-figs',  2),
  ('neet-physics', 'physical-world',              'Errors in Measurement',         'errors',        3),

  ('neet-physics', 'kinematics',                  'Motion in 1-D',                 '1d',            1),
  ('neet-physics', 'kinematics',                  'Motion in 2-D',                 '2d',            2),
  ('neet-physics', 'kinematics',                  'Projectile Motion',             'projectile',    3),
  ('neet-physics', 'kinematics',                  'Relative Velocity',             'relative',      4),

  ('neet-physics', 'laws-of-motion',              'Newton''s Laws',                'newton',        1),
  ('neet-physics', 'laws-of-motion',              'Friction',                      'friction',      2),
  ('neet-physics', 'laws-of-motion',              'Circular Motion',               'circular',      3),
  ('neet-physics', 'laws-of-motion',              'Pseudo Forces',                 'pseudo',        4),

  ('neet-physics', 'work-energy-power',           'Work-Energy Theorem',           'wet',           1),
  ('neet-physics', 'work-energy-power',           'Conservation of Energy',        'conservation',  2),
  ('neet-physics', 'work-energy-power',           'Power',                         'power',         3),
  ('neet-physics', 'work-energy-power',           'Collisions',                    'collisions',    4),

  ('neet-physics', 'rotational-motion',           'Centre of Mass',                'com',           1),
  ('neet-physics', 'rotational-motion',           'Moment of Inertia',             'moi',           2),
  ('neet-physics', 'rotational-motion',           'Angular Momentum & Torque',     'angular',       3),
  ('neet-physics', 'rotational-motion',           'Rolling Motion',                'rolling',       4),

  ('neet-physics', 'gravitation',                 'Newton''s Law of Gravitation',  'newton',        1),
  ('neet-physics', 'gravitation',                 'Gravitational Field & Potential', 'field',       2),
  ('neet-physics', 'gravitation',                 'Kepler''s Laws & Orbits',       'kepler',        3),
  ('neet-physics', 'gravitation',                 'Escape & Orbital Velocity',     'escape',        4),

  ('neet-physics', 'bulk-matter',                 'Elasticity & Young''s Modulus', 'elasticity',    1),
  ('neet-physics', 'bulk-matter',                 'Fluid Pressure & Buoyancy',     'fluids',        2),
  ('neet-physics', 'bulk-matter',                 'Bernoulli & Viscosity',         'bernoulli',     3),
  ('neet-physics', 'bulk-matter',                 'Surface Tension',               'surface',       4),

  ('neet-physics', 'thermodynamics',              'Zeroth & First Law',            'first-law',     1),
  ('neet-physics', 'thermodynamics',              'Heat Transfer',                 'heat-transfer', 2),
  ('neet-physics', 'thermodynamics',              'Second Law & Entropy',          'second-law',    3),
  ('neet-physics', 'thermodynamics',              'Carnot Cycle & Engines',        'carnot',        4),

  ('neet-physics', 'kinetic-theory',              'Ideal Gas Equation',            'ideal-gas',     1),
  ('neet-physics', 'kinetic-theory',              'Degrees of Freedom',            'dof',           2),
  ('neet-physics', 'kinetic-theory',              'Mean Free Path',                'mfp',           3),

  ('neet-physics', 'oscillations-waves',          'SHM Basics',                    'shm',           1),
  ('neet-physics', 'oscillations-waves',          'Pendulum & Springs',            'pendulum',      2),
  ('neet-physics', 'oscillations-waves',          'Wave Equation',                 'wave-eq',       3),
  ('neet-physics', 'oscillations-waves',          'Doppler Effect',                'doppler',       4),

  ('neet-physics', 'electrostatics',              'Coulomb''s Law',                'coulomb',       1),
  ('neet-physics', 'electrostatics',              'Electric Field & Gauss''s Law', 'field-gauss',   2),
  ('neet-physics', 'electrostatics',              'Potential & Capacitance',       'potential',     3),
  ('neet-physics', 'electrostatics',              'Dielectrics',                   'dielectrics',   4),

  ('neet-physics', 'current-electricity',         'Ohm''s Law & Resistivity',      'ohm',           1),
  ('neet-physics', 'current-electricity',         'Kirchhoff''s Laws',             'kirchhoff',     2),
  ('neet-physics', 'current-electricity',         'Wheatstone Bridge & Meter Bridge', 'wheatstone', 3),
  ('neet-physics', 'current-electricity',         'Cells, EMF & Internal Resistance', 'cells',      4),

  ('neet-physics', 'magnetism',                   'Biot-Savart & Ampere''s Law',   'biot-savart',   1),
  ('neet-physics', 'magnetism',                   'Force on Charge & Cyclotron',   'cyclotron',     2),
  ('neet-physics', 'magnetism',                   'Magnetic Materials',            'materials',     3),
  ('neet-physics', 'magnetism',                   'Earth''s Magnetism',            'earth',         4),

  ('neet-physics', 'emi-ac',                      'Faraday & Lenz Laws',           'faraday',       1),
  ('neet-physics', 'emi-ac',                      'Self & Mutual Inductance',      'inductance',    2),
  ('neet-physics', 'emi-ac',                      'AC Circuits & Resonance',       'resonance',     3),
  ('neet-physics', 'emi-ac',                      'Transformers',                  'transformers',  4),

  ('neet-physics', 'em-waves',                    'Maxwell''s Equations (qualitative)', 'maxwell',  1),
  ('neet-physics', 'em-waves',                    'EM Spectrum',                   'spectrum',      2),

  ('neet-physics', 'optics',                      'Reflection & Mirrors',          'reflection',    1),
  ('neet-physics', 'optics',                      'Refraction & Lenses',           'refraction',    2),
  ('neet-physics', 'optics',                      'Optical Instruments',           'instruments',   3),
  ('neet-physics', 'optics',                      'Interference & Diffraction',    'interference',  4),
  ('neet-physics', 'optics',                      'Polarisation',                  'polarisation',  5),

  ('neet-physics', 'dual-nature',                 'Photoelectric Effect',          'photoelectric', 1),
  ('neet-physics', 'dual-nature',                 'de Broglie Hypothesis',         'de-broglie',    2),

  ('neet-physics', 'atoms-nuclei',                'Bohr''s Model & Spectra',       'bohr',          1),
  ('neet-physics', 'atoms-nuclei',                'Nuclear Binding Energy',        'binding',       2),
  ('neet-physics', 'atoms-nuclei',                'Radioactivity',                 'radioactivity', 3),
  ('neet-physics', 'atoms-nuclei',                'Fission & Fusion',              'fission-fusion',4),

  ('neet-physics', 'semiconductors',              'Diodes & Rectifiers',           'diodes',        1),
  ('neet-physics', 'semiconductors',              'Transistors (BJT)',             'bjt',           2),
  ('neet-physics', 'semiconductors',              'Logic Gates',                   'logic',         3),

  -- ============================= NEET UG — CHEMISTRY =============================
  ('neet-chemistry', 'basic-concepts',            'Mole Concept',                  'mole',          1),
  ('neet-chemistry', 'basic-concepts',            'Stoichiometry',                 'stoichiometry', 2),
  ('neet-chemistry', 'basic-concepts',            'Limiting Reagent',              'limiting',      3),

  ('neet-chemistry', 'atomic-structure',          'Quantum Numbers',               'quantum',       1),
  ('neet-chemistry', 'atomic-structure',          'Electronic Configuration',      'configuration', 2),
  ('neet-chemistry', 'atomic-structure',          'Spectra & Bohr Model',          'spectra',       3),

  ('neet-chemistry', 'periodicity',               'Periodic Trends',               'trends',        1),
  ('neet-chemistry', 'periodicity',               'Ionisation Energy & EA',        'ionisation',    2),
  ('neet-chemistry', 'periodicity',               'Electronegativity',             'electronegativity', 3),

  ('neet-chemistry', 'chemical-bonding',          'Ionic & Covalent Bonds',        'ionic-covalent',1),
  ('neet-chemistry', 'chemical-bonding',          'VSEPR & Molecular Shapes',      'vsepr',         2),
  ('neet-chemistry', 'chemical-bonding',          'Hybridisation',                 'hybridisation', 3),
  ('neet-chemistry', 'chemical-bonding',          'Dipole Moment & Polarity',      'dipole',        4),

  ('neet-chemistry', 'states-of-matter',          'Gas Laws',                      'gas-laws',      1),
  ('neet-chemistry', 'states-of-matter',          'Real Gases & van der Waals',    'real-gases',    2),
  ('neet-chemistry', 'states-of-matter',          'Liquids & Vapour Pressure',     'liquids',       3),

  ('neet-chemistry', 'chem-thermodynamics',       'First Law',                     'first-law',     1),
  ('neet-chemistry', 'chem-thermodynamics',       'Enthalpy & Hess''s Law',        'enthalpy',      2),
  ('neet-chemistry', 'chem-thermodynamics',       'Entropy & Gibbs Energy',        'entropy',       3),

  ('neet-chemistry', 'equilibrium',               'Chemical Equilibrium',          'chemical',      1),
  ('neet-chemistry', 'equilibrium',               'Le Chatelier''s Principle',     'le-chatelier',  2),
  ('neet-chemistry', 'equilibrium',               'Ionic Equilibrium & pH',        'ph',            3),
  ('neet-chemistry', 'equilibrium',               'Buffers & Solubility Product',  'buffers',       4),

  ('neet-chemistry', 'redox',                     'Oxidation States',              'oxidation-states', 1),
  ('neet-chemistry', 'redox',                     'Balancing Redox Equations',     'balancing',     2),

  ('neet-chemistry', 'hydrogen',                  'Position & Isotopes',           'position',      1),
  ('neet-chemistry', 'hydrogen',                  'Water & Hydrogen Peroxide',     'water',         2),

  ('neet-chemistry', 's-block',                   'Alkali Metals',                 'alkali',        1),
  ('neet-chemistry', 's-block',                   'Alkaline Earth Metals',         'alkaline-earth',2),
  ('neet-chemistry', 's-block',                   'Important Compounds',           'compounds',     3),

  ('neet-chemistry', 'p-block-1314',              'Group 13 (Boron Family)',       'group-13',      1),
  ('neet-chemistry', 'p-block-1314',              'Group 14 (Carbon Family)',      'group-14',      2),

  ('neet-chemistry', 'organic-basics',            'IUPAC Nomenclature',            'iupac',         1),
  ('neet-chemistry', 'organic-basics',            'Isomerism',                     'isomerism',     2),
  ('neet-chemistry', 'organic-basics',            'Reaction Mechanisms',           'mechanisms',    3),
  ('neet-chemistry', 'organic-basics',            'Inductive, Resonance & Hyperconjugation', 'effects', 4),

  ('neet-chemistry', 'hydrocarbons',              'Alkanes',                       'alkanes',       1),
  ('neet-chemistry', 'hydrocarbons',              'Alkenes & Alkynes',             'alkenes',       2),
  ('neet-chemistry', 'hydrocarbons',              'Aromatic Hydrocarbons',         'aromatic',      3),

  ('neet-chemistry', 'environmental-chem',        'Air & Water Pollution',         'pollution',     1),
  ('neet-chemistry', 'environmental-chem',        'Green Chemistry',               'green',         2),

  ('neet-chemistry', 'solid-state',               'Crystal Lattices & Unit Cells', 'lattices',      1),
  ('neet-chemistry', 'solid-state',               'Packing Efficiency',            'packing',       2),
  ('neet-chemistry', 'solid-state',               'Defects & Properties',          'defects',       3),

  ('neet-chemistry', 'solutions',                 'Concentration Units',           'concentration', 1),
  ('neet-chemistry', 'solutions',                 'Raoult''s Law & VP',            'raoult',        2),
  ('neet-chemistry', 'solutions',                 'Colligative Properties',        'colligative',   3),

  ('neet-chemistry', 'electrochemistry',          'Galvanic & Electrolytic Cells', 'cells',         1),
  ('neet-chemistry', 'electrochemistry',          'Nernst Equation',               'nernst',        2),
  ('neet-chemistry', 'electrochemistry',          'Conductance & Kohlrausch Law',  'conductance',   3),

  ('neet-chemistry', 'chemical-kinetics',         'Rate Law & Order',              'rate-order',    1),
  ('neet-chemistry', 'chemical-kinetics',         'Integrated Rate Equations',     'integrated',    2),
  ('neet-chemistry', 'chemical-kinetics',         'Arrhenius Equation',            'arrhenius',     3),

  ('neet-chemistry', 'surface-chemistry',         'Adsorption',                    'adsorption',    1),
  ('neet-chemistry', 'surface-chemistry',         'Catalysis',                     'catalysis',     2),
  ('neet-chemistry', 'surface-chemistry',         'Colloids',                      'colloids',      3),

  ('neet-chemistry', 'metallurgy',                'Ore Concentration',             'concentration', 1),
  ('neet-chemistry', 'metallurgy',                'Reduction Methods',             'reduction',     2),
  ('neet-chemistry', 'metallurgy',                'Refining',                      'refining',      3),

  ('neet-chemistry', 'p-block-1518',              'Group 15 (Nitrogen Family)',    'group-15',      1),
  ('neet-chemistry', 'p-block-1518',              'Group 16 (Oxygen Family)',      'group-16',      2),
  ('neet-chemistry', 'p-block-1518',              'Group 17 (Halogens)',           'group-17',      3),
  ('neet-chemistry', 'p-block-1518',              'Group 18 (Noble Gases)',        'group-18',      4),

  ('neet-chemistry', 'd-f-block',                 'Transition Elements',           'transition',    1),
  ('neet-chemistry', 'd-f-block',                 'Lanthanides & Actinides',       'inner-transition', 2),

  ('neet-chemistry', 'coordination',              'Werner''s Theory & Nomenclature', 'werner',      1),
  ('neet-chemistry', 'coordination',              'Isomerism in Complexes',        'isomerism',     2),
  ('neet-chemistry', 'coordination',              'VBT & CFT',                     'bonding',       3),

  ('neet-chemistry', 'haloalkanes',               'Preparation & Properties',      'prep',          1),
  ('neet-chemistry', 'haloalkanes',               'SN1 & SN2 Reactions',           'sn',            2),
  ('neet-chemistry', 'haloalkanes',               'Elimination Reactions',         'elimination',   3),

  ('neet-chemistry', 'alcohols-phenols',          'Alcohols',                      'alcohols',      1),
  ('neet-chemistry', 'alcohols-phenols',          'Phenols',                       'phenols',       2),
  ('neet-chemistry', 'alcohols-phenols',          'Ethers',                        'ethers',        3),

  ('neet-chemistry', 'aldehydes-ketones',         'Preparation & Properties',      'prep',          1),
  ('neet-chemistry', 'aldehydes-ketones',         'Nucleophilic Addition',         'nucleophilic',  2),
  ('neet-chemistry', 'aldehydes-ketones',         'Named Reactions (Aldol, Cannizzaro)', 'named',   3),
  ('neet-chemistry', 'aldehydes-ketones',         'Carboxylic Acids',              'carboxylic',    4),

  ('neet-chemistry', 'amines',                    'Classification & Preparation',  'prep',          1),
  ('neet-chemistry', 'amines',                    'Properties & Hofmann',          'properties',    2),
  ('neet-chemistry', 'amines',                    'Diazonium Salts',               'diazonium',     3),

  ('neet-chemistry', 'biomolecules',              'Carbohydrates',                 'carbohydrates', 1),
  ('neet-chemistry', 'biomolecules',              'Proteins & Amino Acids',        'proteins',      2),
  ('neet-chemistry', 'biomolecules',              'Nucleic Acids',                 'nucleic',       3),
  ('neet-chemistry', 'biomolecules',              'Vitamins & Hormones',           'vitamins',      4),

  ('neet-chemistry', 'polymers',                  'Classification',                'classification',1),
  ('neet-chemistry', 'polymers',                  'Polymerisation',                'polymerisation',2),
  ('neet-chemistry', 'polymers',                  'Commercial Polymers',           'commercial',    3),

  ('neet-chemistry', 'everyday-chemistry',        'Drugs & Medicines',             'drugs',         1),
  ('neet-chemistry', 'everyday-chemistry',        'Food Chemistry',                'food',          2),
  ('neet-chemistry', 'everyday-chemistry',        'Cleansing Agents',              'cleansing',     3),

  -- ============================= NEET UG — BIOLOGY =============================
  ('neet-biology', 'diversity',                   'Living World & Taxonomy',       'taxonomy',      1),
  ('neet-biology', 'diversity',                   'Five Kingdom Classification',   'five-kingdom',  2),
  ('neet-biology', 'diversity',                   'Plant Kingdom',                 'plant-kingdom', 3),
  ('neet-biology', 'diversity',                   'Animal Kingdom',                'animal-kingdom',4),

  ('neet-biology', 'structural-org',              'Plant Morphology',              'plant-morph',   1),
  ('neet-biology', 'structural-org',              'Plant Anatomy',                 'plant-anat',    2),
  ('neet-biology', 'structural-org',              'Animal Tissues',                'animal-tissues',3),
  ('neet-biology', 'structural-org',              'Cockroach Anatomy',             'cockroach',     4),

  ('neet-biology', 'cell-structure',              'Cell — the Unit of Life',       'unit',          1),
  ('neet-biology', 'cell-structure',              'Biomolecules',                  'biomolecules',  2),
  ('neet-biology', 'cell-structure',              'Cell Cycle & Division',         'cell-cycle',    3),

  ('neet-biology', 'plant-physiology',            'Transport in Plants',           'transport',     1),
  ('neet-biology', 'plant-physiology',            'Mineral Nutrition',             'mineral',       2),
  ('neet-biology', 'plant-physiology',            'Photosynthesis',                'photosynthesis',3),
  ('neet-biology', 'plant-physiology',            'Respiration in Plants',         'respiration',   4),
  ('neet-biology', 'plant-physiology',            'Plant Growth & Hormones',       'growth',        5),

  ('neet-biology', 'human-physiology',            'Digestion & Absorption',        'digestion',     1),
  ('neet-biology', 'human-physiology',            'Breathing & Gas Exchange',      'breathing',     2),
  ('neet-biology', 'human-physiology',            'Body Fluids & Circulation',     'circulation',   3),
  ('neet-biology', 'human-physiology',            'Excretory Products',            'excretion',     4),
  ('neet-biology', 'human-physiology',            'Locomotion & Movement',         'locomotion',    5),
  ('neet-biology', 'human-physiology',            'Neural Control & Coordination', 'neural',        6),
  ('neet-biology', 'human-physiology',            'Chemical Coordination',         'chemical',      7),

  ('neet-biology', 'reproduction',                'Reproduction in Organisms',     'organisms',     1),
  ('neet-biology', 'reproduction',                'Sexual Reproduction in Plants', 'plants',        2),
  ('neet-biology', 'reproduction',                'Human Reproduction',            'human',         3),
  ('neet-biology', 'reproduction',                'Reproductive Health',           'health',        4),

  ('neet-biology', 'genetics-evolution',          'Inheritance & Mendel',          'mendel',        1),
  ('neet-biology', 'genetics-evolution',          'Molecular Basis of Inheritance','molecular',     2),
  ('neet-biology', 'genetics-evolution',          'Evolution',                     'evolution',     3),

  ('neet-biology', 'biology-welfare',             'Human Health & Disease',        'health',        1),
  ('neet-biology', 'biology-welfare',             'Microbes in Human Welfare',     'microbes',      2),
  ('neet-biology', 'biology-welfare',             'Strategies for Food Production','food',          3),

  ('neet-biology', 'biotechnology',               'Principles & Tools',            'principles',    1),
  ('neet-biology', 'biotechnology',               'Applications in Medicine & Agri', 'applications',2),

  ('neet-biology', 'ecology',                     'Organisms & Populations',       'populations',   1),
  ('neet-biology', 'ecology',                     'Ecosystems',                    'ecosystems',    2),
  ('neet-biology', 'ecology',                     'Biodiversity & Conservation',   'biodiversity',  3),
  ('neet-biology', 'ecology',                     'Environmental Issues',          'environmental', 4)
)
insert into public.topics (chapter_id, name, slug, order_index)
select c.id, r.topic_name, r.topic_slug, r.ord
  from raw r
  join public.chapters c on c.slug = r.chapter_slug
                        and c.subject_id = r.subject_id
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

-- Verify: count topics per subject for both new exams
-- select s.name, count(t.id) as topics
--   from subjects s
--   left join chapters c on c.subject_id = s.id
--   left join topics   t on t.chapter_id = c.id
--  where s.exam_id in (select id from exams where slug in ('ssc-cgl','neet-ug'))
--  group by s.name order by s.name;
