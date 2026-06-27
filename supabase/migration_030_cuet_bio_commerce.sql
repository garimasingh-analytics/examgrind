-- Migration 030 — CUET Bio + Commerce cluster topic seed
-- Subjects: Biology (10ch), Accountancy (6ch), Business Studies (6ch), Economics (6ch) = 28 chapters x 6 topics = 168 rows.
-- Authored against ACTUAL DB chapter names (queried live before authoring this time).
-- Applied successfully 2026-06-24 — all 4 subjects at exactly 6.0 topics per chapter.

-- Clean generic placeholders
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id in ('biology','accountancy','business-studies','economics')
   and t.name in (
     'Concepts & Definitions','Worked Examples','Formulae & Shortcuts',
     'Common Mistakes','Mixed Practice','Practice Set'
   );

with raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values

  -- ACCOUNTANCY
  ('accountancy', 'Partnership Fundamentals', 'Partnership Deed Essentials',         'deed',         1),
  ('accountancy', 'Partnership Fundamentals', 'Profit Sharing Ratios',                'psr',          2),
  ('accountancy', 'Partnership Fundamentals', 'Interest on Capital & Drawings',       'interest',     3),
  ('accountancy', 'Partnership Fundamentals', 'Salary & Commission to Partners',      'salary',       4),
  ('accountancy', 'Partnership Fundamentals', 'Past Adjustments',                     'past-adj',     5),
  ('accountancy', 'Partnership Fundamentals', 'Final Accounts of Firm',               'final-acc',    6),

  ('accountancy', 'Reconstitution of Partnership', 'Change in Profit Sharing Ratio',  'change-psr',   1),
  ('accountancy', 'Reconstitution of Partnership', 'Admission of a Partner',          'admission',    2),
  ('accountancy', 'Reconstitution of Partnership', 'Retirement of a Partner',         'retirement',   3),
  ('accountancy', 'Reconstitution of Partnership', 'Death of a Partner',              'death',        4),
  ('accountancy', 'Reconstitution of Partnership', 'Goodwill Treatment Methods',      'goodwill',     5),
  ('accountancy', 'Reconstitution of Partnership', 'Revaluation of Assets & Liabilities','revaluation',6),

  ('accountancy', 'Issue and Forfeiture of Shares', 'Issue at Par',                   'par',          1),
  ('accountancy', 'Issue and Forfeiture of Shares', 'Issue at Premium',               'premium',      2),
  ('accountancy', 'Issue and Forfeiture of Shares', 'Issue at Discount',              'discount',     3),
  ('accountancy', 'Issue and Forfeiture of Shares', 'Calls in Arrears & Advance',     'calls',        4),
  ('accountancy', 'Issue and Forfeiture of Shares', 'Forfeiture of Shares',           'forfeiture',   5),
  ('accountancy', 'Issue and Forfeiture of Shares', 'Reissue of Forfeited Shares',    'reissue',      6),

  ('accountancy', 'Issue and Redemption of Debentures', 'Issue at Par/Premium/Discount','issue',      1),
  ('accountancy', 'Issue and Redemption of Debentures', 'Terms of Issue',             'terms',        2),
  ('accountancy', 'Issue and Redemption of Debentures', 'Debenture Interest & Tax',   'interest',     3),
  ('accountancy', 'Issue and Redemption of Debentures', 'Methods of Redemption',      'methods',      4),
  ('accountancy', 'Issue and Redemption of Debentures', 'Sinking Fund Method',        'sinking-fund', 5),
  ('accountancy', 'Issue and Redemption of Debentures', 'Conversion of Debentures',   'conversion',   6),

  ('accountancy', 'Financial Statement Analysis', 'Comparative Statements',           'comparative',  1),
  ('accountancy', 'Financial Statement Analysis', 'Common-Size Statements',           'common-size',  2),
  ('accountancy', 'Financial Statement Analysis', 'Liquidity Ratios',                 'liquidity',    3),
  ('accountancy', 'Financial Statement Analysis', 'Solvency Ratios',                  'solvency',     4),
  ('accountancy', 'Financial Statement Analysis', 'Activity / Turnover Ratios',       'activity',     5),
  ('accountancy', 'Financial Statement Analysis', 'Profitability Ratios',             'profitability',6),

  ('accountancy', 'Cash Flow Statement', 'Operating Activities',                      'operating',    1),
  ('accountancy', 'Cash Flow Statement', 'Investing Activities',                      'investing',    2),
  ('accountancy', 'Cash Flow Statement', 'Financing Activities',                      'financing',    3),
  ('accountancy', 'Cash Flow Statement', 'Direct vs Indirect Method',                 'direct-indirect',4),
  ('accountancy', 'Cash Flow Statement', 'Adjustments & Non-Cash Items',              'adjustments',  5),
  ('accountancy', 'Cash Flow Statement', 'Interpretation & Cash Flow Ratios',         'interpretation',6),

  -- BIOLOGY
  ('biology', 'Diversity in the Living World', 'Taxonomy & Systematics',              'taxonomy',     1),
  ('biology', 'Diversity in the Living World', 'Five-Kingdom Classification',         'five-kingdom', 2),
  ('biology', 'Diversity in the Living World', 'Plant Kingdom (Algae to Angiosperms)','plant-kingdom',3),
  ('biology', 'Diversity in the Living World', 'Animal Kingdom (Porifera to Chordata)','animal-kingdom',4),
  ('biology', 'Diversity in the Living World', 'Viruses, Viroids & Lichens',          'viruses',      5),
  ('biology', 'Diversity in the Living World', 'Binomial Nomenclature',               'nomenclature', 6),

  ('biology', 'Structural Organisation in Plants and Animals', 'Plant Anatomy (Root, Stem, Leaf)','plant-anatomy',1),
  ('biology', 'Structural Organisation in Plants and Animals', 'Meristematic & Permanent Tissues','plant-tissues',2),
  ('biology', 'Structural Organisation in Plants and Animals', 'Animal Tissues (Epithelial, Connective, Muscle, Nervous)','animal-tissues',3),
  ('biology', 'Structural Organisation in Plants and Animals', 'Earthworm Morphology & Anatomy','earthworm',4),
  ('biology', 'Structural Organisation in Plants and Animals', 'Cockroach Morphology & Anatomy','cockroach',5),
  ('biology', 'Structural Organisation in Plants and Animals', 'Frog Morphology & Anatomy',    'frog',         6),

  ('biology', 'Cell — Structure and Function', 'Cell Theory & Discovery',              'cell-theory',  1),
  ('biology', 'Cell — Structure and Function', 'Prokaryotic vs Eukaryotic Cells',      'pro-eu',       2),
  ('biology', 'Cell — Structure and Function', 'Cell Organelles (ER, Golgi, Mito, Chloro)','organelles',3),
  ('biology', 'Cell — Structure and Function', 'Cell Membrane & Transport',            'membrane',     4),
  ('biology', 'Cell — Structure and Function', 'Cell Division — Mitosis',              'mitosis',      5),
  ('biology', 'Cell — Structure and Function', 'Cell Division — Meiosis',              'meiosis',      6),

  ('biology', 'Plant Physiology', 'Transport in Plants',                              'transport',    1),
  ('biology', 'Plant Physiology', 'Mineral Nutrition',                                'minerals',     2),
  ('biology', 'Plant Physiology', 'Photosynthesis (Light & Dark Reactions)',          'photosynthesis',3),
  ('biology', 'Plant Physiology', 'Respiration in Plants',                            'respiration',  4),
  ('biology', 'Plant Physiology', 'Plant Growth & Development',                       'growth',       5),
  ('biology', 'Plant Physiology', 'Phytohormones',                                    'hormones',     6),

  ('biology', 'Human Physiology', 'Digestion & Absorption',                           'digestion',    1),
  ('biology', 'Human Physiology', 'Breathing & Exchange of Gases',                    'breathing',    2),
  ('biology', 'Human Physiology', 'Body Fluids & Circulation',                        'circulation',  3),
  ('biology', 'Human Physiology', 'Excretory Products & Elimination',                 'excretion',    4),
  ('biology', 'Human Physiology', 'Neural Control & Coordination',                    'neural',       5),
  ('biology', 'Human Physiology', 'Chemical Coordination & Endocrine',                'endocrine',    6),

  ('biology', 'Reproduction', 'Sexual Reproduction in Flowering Plants',              'plant-repro',  1),
  ('biology', 'Reproduction', 'Human Reproduction (Male & Female Systems)',           'human-repro',  2),
  ('biology', 'Reproduction', 'Reproductive Health & Contraception',                  'health',       3),
  ('biology', 'Reproduction', 'Embryonic Development',                                'embryonic',    4),
  ('biology', 'Reproduction', 'Gametogenesis',                                        'gametogenesis',5),
  ('biology', 'Reproduction', 'Menstrual Cycle',                                      'menstrual',    6),

  ('biology', 'Genetics and Evolution', 'Mendel''s Laws of Inheritance',              'mendel',       1),
  ('biology', 'Genetics and Evolution', 'Chromosomal Theory & Linkage',               'chromosomal',  2),
  ('biology', 'Genetics and Evolution', 'Molecular Basis of Inheritance (DNA/RNA)',   'molecular',    3),
  ('biology', 'Genetics and Evolution', 'Replication, Transcription & Translation',   'central-dogma',4),
  ('biology', 'Genetics and Evolution', 'Origin of Life & Theories of Evolution',     'evolution',    5),
  ('biology', 'Genetics and Evolution', 'Hardy-Weinberg & Speciation',                'hardy-weinberg',6),

  ('biology', 'Biology in Human Welfare', 'Health & Common Pathogens',                'health-disease',1),
  ('biology', 'Biology in Human Welfare', 'Immunity (Innate & Adaptive)',             'immunity',     2),
  ('biology', 'Biology in Human Welfare', 'Microbes in Human Welfare',                'microbes',     3),
  ('biology', 'Biology in Human Welfare', 'Strategies for Food Production',           'food-prod',    4),
  ('biology', 'Biology in Human Welfare', 'Biotech in Agriculture & Medicine',        'biotech-app',  5),
  ('biology', 'Biology in Human Welfare', 'Drugs & Alcohol Abuse',                    'drugs',        6),

  ('biology', 'Biotechnology', 'Principles & Tools (Restriction Enzymes, PCR)',       'tools',        1),
  ('biology', 'Biotechnology', 'Genetic Engineering & Cloning',                       'genetic-eng',  2),
  ('biology', 'Biotechnology', 'rDNA Technology',                                     'rdna',         3),
  ('biology', 'Biotechnology', 'Bioreactors & Downstream Processing',                 'bioreactors',  4),
  ('biology', 'Biotechnology', 'Applications in Medicine (Insulin, Gene Therapy)',    'medicine',     5),
  ('biology', 'Biotechnology', 'Applications in Agriculture (Bt Crops)',              'agriculture',  6),

  ('biology', 'Ecology and Environment', 'Organism & Population',                     'organism-pop', 1),
  ('biology', 'Ecology and Environment', 'Ecosystem Structure & Function',            'ecosystem',    2),
  ('biology', 'Ecology and Environment', 'Energy Flow & Food Chains',                 'energy-flow',  3),
  ('biology', 'Ecology and Environment', 'Biodiversity & Conservation',               'biodiversity', 4),
  ('biology', 'Ecology and Environment', 'Environmental Pollution',                   'pollution',    5),
  ('biology', 'Ecology and Environment', 'Climate Change & Greenhouse Effect',        'climate',      6),

  -- BUSINESS STUDIES
  ('business-studies', 'Nature and Principles of Management', 'Concept & Objectives of Management','concept',1),
  ('business-studies', 'Nature and Principles of Management', 'Coordination — Essence of Management','coordination',2),
  ('business-studies', 'Nature and Principles of Management', 'Management Levels & Functions',  'levels',       3),
  ('business-studies', 'Nature and Principles of Management', 'Fayol''s 14 Principles',         'fayol',        4),
  ('business-studies', 'Nature and Principles of Management', 'Taylor''s Scientific Management','taylor',       5),
  ('business-studies', 'Nature and Principles of Management', 'Management as Science vs Art vs Profession','science-art',6),

  ('business-studies', 'Business Environment and Planning', 'Business Environment Dimensions',  'env-dim',      1),
  ('business-studies', 'Business Environment and Planning', 'Economic Environment Impact',      'eco-env',      2),
  ('business-studies', 'Business Environment and Planning', 'Planning Process & Importance',    'planning',     3),
  ('business-studies', 'Business Environment and Planning', 'Types of Plans',                   'plan-types',   4),
  ('business-studies', 'Business Environment and Planning', 'Limitations of Planning',          'plan-limits',  5),
  ('business-studies', 'Business Environment and Planning', 'Decision-Making Process',          'decisions',    6),

  ('business-studies', 'Organising and Staffing', 'Organising Process & Importance',            'org-process',  1),
  ('business-studies', 'Organising and Staffing', 'Organisation Structures (Functional, Divisional)','structures',2),
  ('business-studies', 'Organising and Staffing', 'Delegation & Decentralisation',              'delegation',   3),
  ('business-studies', 'Organising and Staffing', 'Staffing Process',                           'staffing',     4),
  ('business-studies', 'Organising and Staffing', 'Recruitment & Selection',                    'recruitment',  5),
  ('business-studies', 'Organising and Staffing', 'Training & Development',                     'training',     6),

  ('business-studies', 'Directing and Controlling', 'Elements of Directing',                    'elements',     1),
  ('business-studies', 'Directing and Controlling', 'Motivation Theories (Maslow)',             'motivation',   2),
  ('business-studies', 'Directing and Controlling', 'Leadership Styles',                        'leadership',   3),
  ('business-studies', 'Directing and Controlling', 'Communication Process & Barriers',         'communication',4),
  ('business-studies', 'Directing and Controlling', 'Controlling Process',                      'control-process',5),
  ('business-studies', 'Directing and Controlling', 'Techniques of Control',                    'control-tech', 6),

  ('business-studies', 'Financial Management', 'Objectives of Financial Management',            'fm-objectives',1),
  ('business-studies', 'Financial Management', 'Financial Decisions (Investment, Financing, Dividend)','decisions',2),
  ('business-studies', 'Financial Management', 'Capital Structure',                             'capital-structure',3),
  ('business-studies', 'Financial Management', 'Financial Planning',                            'fin-planning', 4),
  ('business-studies', 'Financial Management', 'Working Capital Management',                    'working-cap',  5),
  ('business-studies', 'Financial Management', 'Financial Markets — Money & Capital',           'fin-markets',  6),

  ('business-studies', 'Marketing Management', 'Marketing Concept & Functions',                 'marketing-concept',1),
  ('business-studies', 'Marketing Management', 'Marketing Mix (4 Ps)',                          'marketing-mix',2),
  ('business-studies', 'Marketing Management', 'Product Decisions & Branding',                  'product',      3),
  ('business-studies', 'Marketing Management', 'Pricing Strategies',                            'pricing',      4),
  ('business-studies', 'Marketing Management', 'Distribution Channels & Logistics',             'distribution', 5),
  ('business-studies', 'Marketing Management', 'Promotion Mix & Advertising',                   'promotion',    6),

  -- ECONOMICS
  ('economics', 'Microeconomics — Introduction', 'Central Problems of an Economy',              'central-problems',1),
  ('economics', 'Microeconomics — Introduction', 'PPF & Opportunity Cost',                      'ppf',          2),
  ('economics', 'Microeconomics — Introduction', 'Positive vs Normative Economics',             'positive-normative',3),
  ('economics', 'Microeconomics — Introduction', 'Production Possibility Frontier',             'ppf-detail',   4),
  ('economics', 'Microeconomics — Introduction', 'Economic Systems (Market, Planned, Mixed)',   'systems',      5),
  ('economics', 'Microeconomics — Introduction', 'Scope of Microeconomics',                     'scope',        6),

  ('economics', 'Consumer Behaviour and Demand', 'Utility Analysis (Cardinal & Ordinal)',       'utility',      1),
  ('economics', 'Consumer Behaviour and Demand', 'Indifference Curve Analysis',                 'ic-analysis',  2),
  ('economics', 'Consumer Behaviour and Demand', 'Budget Line & Consumer Equilibrium',          'budget-eq',    3),
  ('economics', 'Consumer Behaviour and Demand', 'Demand & Law of Demand',                      'law-demand',   4),
  ('economics', 'Consumer Behaviour and Demand', 'Elasticity of Demand (Price, Income, Cross)', 'elasticity',   5),
  ('economics', 'Consumer Behaviour and Demand', 'Demand Curve Shifts',                         'demand-shifts',6),

  ('economics', 'Producer Behaviour and Supply', 'Production Function (Short & Long Run)',      'production',   1),
  ('economics', 'Producer Behaviour and Supply', 'Returns to Factor (TP, MP, AP)',              'returns',      2),
  ('economics', 'Producer Behaviour and Supply', 'Cost Concepts (TC, AC, MC)',                  'cost',         3),
  ('economics', 'Producer Behaviour and Supply', 'Revenue Concepts (TR, AR, MR)',               'revenue',      4),
  ('economics', 'Producer Behaviour and Supply', 'Producer Equilibrium',                        'prod-eq',      5),
  ('economics', 'Producer Behaviour and Supply', 'Supply & Elasticity of Supply',               'supply',       6),

  ('economics', 'Market Equilibrium and Forms', 'Perfect Competition',                          'perfect',      1),
  ('economics', 'Market Equilibrium and Forms', 'Monopoly',                                     'monopoly',     2),
  ('economics', 'Market Equilibrium and Forms', 'Monopolistic Competition',                     'monopolistic', 3),
  ('economics', 'Market Equilibrium and Forms', 'Oligopoly',                                    'oligopoly',    4),
  ('economics', 'Market Equilibrium and Forms', 'Price Determination Equilibrium',              'price-det',    5),
  ('economics', 'Market Equilibrium and Forms', 'Government Intervention (Price Ceiling/Floor)','intervention', 6),

  ('economics', 'Macroeconomics — National Income', 'National Income Aggregates (GDP, GNP, NDP, NNP)','aggregates',1),
  ('economics', 'Macroeconomics — National Income', 'Methods of Measurement (Income, Expenditure, Value-Added)','methods',2),
  ('economics', 'Macroeconomics — National Income', 'Real vs Nominal GDP',                      'real-nominal', 3),
  ('economics', 'Macroeconomics — National Income', 'Circular Flow of Income',                  'circular-flow',4),
  ('economics', 'Macroeconomics — National Income', 'GDP Deflator',                             'deflator',     5),
  ('economics', 'Macroeconomics — National Income', 'Limitations of GDP',                       'gdp-limits',   6),

  ('economics', 'Money, Banking and Government Budget', 'Functions of Money & Money Supply',    'money',        1),
  ('economics', 'Money, Banking and Government Budget', 'Commercial Banks & Credit Creation',   'banks',        2),
  ('economics', 'Money, Banking and Government Budget', 'RBI & Monetary Policy',                'rbi',          3),
  ('economics', 'Money, Banking and Government Budget', 'Government Budget Components',         'budget-comp',  4),
  ('economics', 'Money, Banking and Government Budget', 'Types of Budget (Balanced, Surplus, Deficit)','budget-types',5),
  ('economics', 'Money, Banking and Government Budget', 'Fiscal Policy & Public Debt',          'fiscal',       6)
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
