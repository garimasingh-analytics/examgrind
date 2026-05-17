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
