-- Migration 027 — CUET Mathematics topic rebuild (29 chapters × 6 topics)
--
-- Continues the CUET rebuild started in migration 026 (English + General
-- Test). Mathematics is the single highest-uptake CUET subject — PCM
-- students + Applied Math takers from commerce + many humanities applicants.
-- Fixing this alone moves ~70% of CUET aspirants off the generic 5-topic
-- placeholder template.
--
-- Authoring approach:
--   - 6 sub-topics per chapter, matching how NCERT divides the chapter
--     AND how CUET PYQs frame their question buckets (since CUET is a
--     PYQ-heavy exam, prep mirrors question patterns).
--   - Topic names use the standardized JEE/NCERT vocabulary so they match
--     how students search YouTube + Khan Academy + Physics Wallah etc.
--   - Order_index follows learning sequence (concept → application).
--
-- Run with: paste into Supabase SQL Editor. Click 'Run query' on the
-- destructive-op confirmation modal.

-- 1) Delete generic placeholders for Mathematics ----------------------------
-- We delete by NAME (more robust than guessing slugs, which varied across
-- earlier migrations). Catches the 5 generic + any leftover 'Practice Set'.
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id = 'mathematics'
   and t.name in (
     'Concepts & Definitions',
     'Worked Examples',
     'Formulae & Shortcuts',
     'Common Mistakes',
     'Mixed Practice',
     'Practice Set'
   );

-- 2) Seed real per-chapter sub-topics --------------------------------------
with raw(chapter_name, topic_name, topic_slug, ord) as (values

  -- ============ CLASS 11 FOUNDATION ============

  -- Sets
  ('Sets', 'Roster & Set-Builder Notation',         'roster-builder',   1),
  ('Sets', 'Subset, Power Set & Universal Set',     'subset-power',     2),
  ('Sets', 'Operations (Union, Intersection, Difference)', 'operations', 3),
  ('Sets', 'Venn Diagrams',                         'venn',             4),
  ('Sets', 'De Morgan''s Laws & Identities',         'demorgan',         5),
  ('Sets', 'Word Problems & Cardinality',           'word-problems',    6),

  -- Relations & Functions (Class 11)
  ('Relations & Functions', 'Cartesian Product & Ordered Pairs', 'cartesian', 1),
  ('Relations & Functions', 'Domain, Codomain & Range',          'domain-range', 2),
  ('Relations & Functions', 'Types of Relations',                'rel-types',  3),
  ('Relations & Functions', 'Function Notation & Evaluation',    'fn-notation', 4),
  ('Relations & Functions', 'Real-Valued Functions',             'real-valued', 5),
  ('Relations & Functions', 'Graph Sketching & Identification',  'graphs',     6),

  -- Trigonometric Functions
  ('Trigonometric Functions', 'Angle Measurement & Conversions',         'angles',        1),
  ('Trigonometric Functions', 'Trigonometric Ratios & Identities',       'ratios',        2),
  ('Trigonometric Functions', 'Compound, Multiple & Submultiple Angles', 'compound',      3),
  ('Trigonometric Functions', 'Transformation Formulas',                 'transformation', 4),
  ('Trigonometric Functions', 'Trigonometric Equations',                 'equations',     5),
  ('Trigonometric Functions', 'Sine & Cosine Rules (Triangles)',         'sine-cosine',   6),

  -- Mathematical Induction (if exists as chapter — order_index permits flexibility)
  -- Skipped if chapter doesn't exist; the JOIN simply won't match.

  -- Complex Numbers & Quadratic Equations
  ('Complex Numbers & Quadratic Equations', 'Algebra of Complex Numbers',           'algebra-complex', 1),
  ('Complex Numbers & Quadratic Equations', 'Modulus, Argument & Polar Form',       'polar-form',      2),
  ('Complex Numbers & Quadratic Equations', 'Square Root & Cube Root of Unity',     'roots-unity',     3),
  ('Complex Numbers & Quadratic Equations', 'Quadratic Equations & Nature of Roots', 'quadratic',       4),
  ('Complex Numbers & Quadratic Equations', 'Sum, Product & Symmetric Functions',   'symmetric',       5),
  ('Complex Numbers & Quadratic Equations', 'Higher Degree Equations',              'higher-degree',   6),

  -- Linear Inequalities
  ('Linear Inequalities', 'One-Variable Inequalities',          'one-var',     1),
  ('Linear Inequalities', 'Two-Variable Graphical Solutions',   'two-var',     2),
  ('Linear Inequalities', 'System of Linear Inequalities',      'system',      3),
  ('Linear Inequalities', 'Word Problems & Modeling',           'word',        4),
  ('Linear Inequalities', 'Absolute Value Inequalities',        'absolute',    5),
  ('Linear Inequalities', 'Inequalities with Quadratics',       'quadratic',   6),

  -- Permutations & Combinations
  ('Permutations & Combinations', 'Fundamental Principle of Counting', 'counting',    1),
  ('Permutations & Combinations', 'Permutations of Distinct Objects',  'perm-distinct', 2),
  ('Permutations & Combinations', 'Permutations with Restrictions',    'perm-restrict', 3),
  ('Permutations & Combinations', 'Combinations & Selections',         'combinations',  4),
  ('Permutations & Combinations', 'Circular & Repetition Cases',       'circular',      5),
  ('Permutations & Combinations', 'PYQ-Style Word Problems',           'pyq-word',      6),

  -- Binomial Theorem
  ('Binomial Theorem', 'Expansion & General Term',          'expansion',   1),
  ('Binomial Theorem', 'Middle Term & Coefficient of x^k',  'middle',      2),
  ('Binomial Theorem', 'Greatest Term & Greatest Coefficient', 'greatest', 3),
  ('Binomial Theorem', 'Properties of Binomial Coefficients', 'properties', 4),
  ('Binomial Theorem', 'Multinomial Expansion (Intro)',     'multinomial', 5),
  ('Binomial Theorem', 'Applications & Approximations',     'applications', 6),

  -- Sequences & Series
  ('Sequences & Series', 'Arithmetic Progression (AP)',        'ap',           1),
  ('Sequences & Series', 'Geometric Progression (GP)',         'gp',           2),
  ('Sequences & Series', 'Harmonic Progression (HP)',          'hp',           3),
  ('Sequences & Series', 'Arithmetic-Geometric Series',        'ag-series',    4),
  ('Sequences & Series', 'Sum of Special Series (Σn, Σn², Σn³)', 'special-sums', 5),
  ('Sequences & Series', 'Recursive Sequences & Patterns',     'recursive',    6),

  -- Straight Lines
  ('Straight Lines', 'Slope, Intercept & Distance Formula',  'slope-distance', 1),
  ('Straight Lines', 'Forms of Line Equation',               'forms',          2),
  ('Straight Lines', 'Angle Between Lines & Perpendicularity', 'angles-perp',  3),
  ('Straight Lines', 'Distance of Point from Line',          'pt-line',        4),
  ('Straight Lines', 'Family of Lines & Concurrency',        'family',         5),
  ('Straight Lines', 'Pair of Straight Lines',               'pair',           6),

  -- Conic Sections
  ('Conic Sections', 'Circle (Equation & Tangent)',         'circle',     1),
  ('Conic Sections', 'Parabola (Standard & Properties)',    'parabola',   2),
  ('Conic Sections', 'Ellipse (Standard & Properties)',     'ellipse',    3),
  ('Conic Sections', 'Hyperbola (Standard & Properties)',   'hyperbola',  4),
  ('Conic Sections', 'Tangents, Normals & Chords',          'tan-normal', 5),
  ('Conic Sections', 'Eccentricity & Identification',       'eccentricity', 6),

  -- Three Dimensional Geometry (Class 11)
  ('Three Dimensional Geometry', 'Coordinates of a Point in 3D',    'coords',     1),
  ('Three Dimensional Geometry', 'Distance Between Two Points',     'distance',   2),
  ('Three Dimensional Geometry', 'Section Formula in 3D',           'section',    3),
  ('Three Dimensional Geometry', 'Direction Cosines & Direction Ratios', 'dc-dr', 4),
  ('Three Dimensional Geometry', 'Equation of a Line in 3D',        'line-3d',    5),
  ('Three Dimensional Geometry', 'Angle Between Two Lines',         'angle-lines', 6),

  -- Statistics (Class 11)
  ('Statistics', 'Measures of Central Tendency (Mean, Median, Mode)', 'central-tendency', 1),
  ('Statistics', 'Mean Deviation (Discrete & Continuous)',           'mean-deviation',   2),
  ('Statistics', 'Variance & Standard Deviation',                    'variance',         3),
  ('Statistics', 'Coefficient of Variation',                         'cv',               4),
  ('Statistics', 'Analysis of Frequency Distribution',               'frequency',        5),
  ('Statistics', 'Applications & PYQ Problems',                      'applications',     6),

  -- Probability (Class 11)
  ('Probability', 'Sample Space & Events',                  'sample-space', 1),
  ('Probability', 'Axiomatic Probability',                  'axiomatic',    2),
  ('Probability', 'Equally Likely & Mutually Exclusive',    'eq-likely',    3),
  ('Probability', 'Addition Theorem',                       'addition',     4),
  ('Probability', 'Conditional Probability (Intro)',        'conditional',  5),
  ('Probability', 'Word Problems with Cards & Dice',        'word',         6),

  -- ============ CLASS 12 ADVANCED ============

  -- Relations & Functions (Adv)
  ('Relations & Functions (Adv)', 'Types: One-One, Onto, Bijection',   'one-one-onto', 1),
  ('Relations & Functions (Adv)', 'Composition of Functions',          'composition',  2),
  ('Relations & Functions (Adv)', 'Invertible Functions & Inverse',    'inverse',      3),
  ('Relations & Functions (Adv)', 'Binary Operations',                 'binary-ops',   4),
  ('Relations & Functions (Adv)', 'Equivalence Relations',             'equivalence',  5),
  ('Relations & Functions (Adv)', 'Graphs of Standard Functions',      'graphs',       6),

  -- Inverse Trigonometric Functions
  ('Inverse Trigonometric Functions', 'Principal Value Branches',        'principal',  1),
  ('Inverse Trigonometric Functions', 'Properties of Inverse Functions', 'properties', 2),
  ('Inverse Trigonometric Functions', 'Conversion Between Inverse Functions', 'conversion', 3),
  ('Inverse Trigonometric Functions', 'Sum & Difference Formulas',       'sum-diff',   4),
  ('Inverse Trigonometric Functions', 'Equations Involving Inverse Trig', 'equations', 5),
  ('Inverse Trigonometric Functions', 'Simplification PYQ Patterns',     'pyq',        6),

  -- Matrices
  ('Matrices', 'Types & Operations',                'types-ops',    1),
  ('Matrices', 'Transpose & Symmetric Matrices',    'transpose',    2),
  ('Matrices', 'Inverse by Adjoint Method',         'inverse-adj',  3),
  ('Matrices', 'Elementary Row Operations',         'row-ops',      4),
  ('Matrices', 'Inverse by Row Operations',         'inverse-row',  5),
  ('Matrices', 'Solving Linear Systems with Matrices', 'linear-systems', 6),

  -- Determinants
  ('Determinants', 'Expansion of 2×2 & 3×3 Determinants',  'expansion',     1),
  ('Determinants', 'Properties of Determinants',           'properties',    2),
  ('Determinants', 'Area of Triangle Using Determinants',  'area-triangle', 3),
  ('Determinants', 'Minors, Cofactors & Adjoint',          'minors',        4),
  ('Determinants', 'Cramer''s Rule',                        'cramer',        5),
  ('Determinants', 'Consistency of Linear Systems',        'consistency',   6),

  -- Continuity & Differentiability
  ('Continuity & Differentiability', 'Continuity at a Point & Interval',  'continuity-pt', 1),
  ('Continuity & Differentiability', 'Differentiability & Relation to Continuity', 'differentiability', 2),
  ('Continuity & Differentiability', 'Chain Rule & Implicit Differentiation', 'chain-implicit', 3),
  ('Continuity & Differentiability', 'Logarithmic & Exponential Differentiation', 'log-exp', 4),
  ('Continuity & Differentiability', 'Parametric & Higher-Order Derivatives', 'parametric',    5),
  ('Continuity & Differentiability', 'Rolle''s & Mean Value Theorems',     'mvt',           6),

  -- Limits & Derivatives
  ('Limits & Derivatives', 'Limit Concept & Algebra of Limits',     'algebra',     1),
  ('Limits & Derivatives', 'Standard Limits (Trig, Exp, Log)',      'standard',    2),
  ('Limits & Derivatives', 'L''Hôpital''s Rule & Indeterminate Forms', 'lhopital', 3),
  ('Limits & Derivatives', 'Derivative as Rate of Change',          'rate',        4),
  ('Limits & Derivatives', 'First Principle Differentiation',       'first-principle', 5),
  ('Limits & Derivatives', 'Derivatives of Standard Functions',     'standard-derivatives', 6),

  -- Application of Derivatives
  ('Application of Derivatives', 'Rate of Change & Related Rates',      'rate-related', 1),
  ('Application of Derivatives', 'Increasing & Decreasing Functions',   'inc-dec',      2),
  ('Application of Derivatives', 'Tangents & Normals',                  'tan-normal',   3),
  ('Application of Derivatives', 'Maxima & Minima (First Derivative)',  'max-min-1st',  4),
  ('Application of Derivatives', 'Maxima & Minima (Second Derivative)', 'max-min-2nd',  5),
  ('Application of Derivatives', 'Optimization Word Problems',          'optimization', 6),

  -- Integrals
  ('Integrals', 'Indefinite Integral & Standard Forms',  'indefinite',  1),
  ('Integrals', 'Substitution Method',                   'substitution', 2),
  ('Integrals', 'Integration by Parts',                  'by-parts',    3),
  ('Integrals', 'Partial Fractions',                     'partial-frac', 4),
  ('Integrals', 'Definite Integrals & Properties',       'definite',    5),
  ('Integrals', 'Integration of Special Forms',          'special-forms', 6),

  -- Application of Integrals
  ('Application of Integrals', 'Area Under a Curve',                 'area-curve',   1),
  ('Application of Integrals', 'Area Between Two Curves',            'area-between', 2),
  ('Application of Integrals', 'Area Bounded by Parabola',           'parabola',     3),
  ('Application of Integrals', 'Area Bounded by Ellipse & Circle',   'ellipse-circle', 4),
  ('Application of Integrals', 'Area Using Symmetry',                'symmetry',     5),
  ('Application of Integrals', 'PYQ Patterns & Mixed Curves',        'pyq',          6),

  -- Differential Equations
  ('Differential Equations', 'Order, Degree & General Solution',   'order-degree', 1),
  ('Differential Equations', 'Variable Separable Form',            'separable',    2),
  ('Differential Equations', 'Homogeneous Differential Equations', 'homogeneous',  3),
  ('Differential Equations', 'Linear Differential Equations',      'linear-de',    4),
  ('Differential Equations', 'Exact Differential Equations',       'exact',        5),
  ('Differential Equations', 'Word Problems & Applications',       'applications', 6),

  -- Vector Algebra
  ('Vector Algebra', 'Position Vector & Direction Cosines',    'position-dc',    1),
  ('Vector Algebra', 'Addition, Subtraction & Scalar Multiple', 'addition',      2),
  ('Vector Algebra', 'Dot Product (Scalar Product)',           'dot',            3),
  ('Vector Algebra', 'Cross Product (Vector Product)',         'cross',          4),
  ('Vector Algebra', 'Scalar Triple Product & Coplanarity',    'triple',         5),
  ('Vector Algebra', 'Applications in Geometry',               'applications',   6),

  -- Three Dimensional Geometry (Adv)
  ('Three Dimensional Geometry (Adv)', 'Equation of Line (Vector + Cartesian)', 'line-eq', 1),
  ('Three Dimensional Geometry (Adv)', 'Equation of Plane (Vector + Cartesian)', 'plane-eq', 2),
  ('Three Dimensional Geometry (Adv)', 'Angle Between Two Planes',            'angle-planes', 3),
  ('Three Dimensional Geometry (Adv)', 'Distance from Point to Plane',        'pt-plane',     4),
  ('Three Dimensional Geometry (Adv)', 'Shortest Distance Between Skew Lines', 'skew',        5),
  ('Three Dimensional Geometry (Adv)', 'Image of a Point in Plane / Line',    'image',        6),

  -- Linear Programming
  ('Linear Programming', 'Mathematical Formulation of LP Problems', 'formulation', 1),
  ('Linear Programming', 'Graphical Method for Two Variables',      'graphical',   2),
  ('Linear Programming', 'Feasible Region & Corner Points',         'feasible',    3),
  ('Linear Programming', 'Bounded vs Unbounded Solutions',          'bounded',     4),
  ('Linear Programming', 'Diet, Manufacturing & Transport Problems', 'classic',    5),
  ('Linear Programming', 'PYQ Word Problem Patterns',               'pyq',         6),

  -- Probability (Class 12 — Bayes, Random Variables)
  -- Many DBs label this differently; we attempt 'Probability' (Class 12 is
  -- separate from Class 11 in some seeds). If only one Probability chapter
  -- exists, the Class-11 mapping above already covers it; this Class-12
  -- mapping will simply not match additional chapters.
  ('Probability (Class 12)', 'Conditional Probability & Independence', 'conditional', 1),
  ('Probability (Class 12)', 'Multiplication Theorem',                 'multiplication', 2),
  ('Probability (Class 12)', 'Bayes'' Theorem',                         'bayes',         3),
  ('Probability (Class 12)', 'Random Variables & Distributions',       'random-var',   4),
  ('Probability (Class 12)', 'Mean, Variance of Random Variable',      'mean-variance', 5),
  ('Probability (Class 12)', 'Binomial Distribution & Bernoulli Trials', 'binomial',    6),

  -- Mathematical Reasoning
  ('Mathematical Reasoning', 'Statements & Truth Values',         'statements',  1),
  ('Mathematical Reasoning', 'Negation & Compound Statements',    'negation',    2),
  ('Mathematical Reasoning', 'Conjunctions, Disjunctions, Implications', 'conjunctions', 3),
  ('Mathematical Reasoning', 'Quantifiers & Tautology',           'quantifiers', 4),
  ('Mathematical Reasoning', 'Validating Statements (Proof Methods)', 'validating', 5),
  ('Mathematical Reasoning', 'PYQ Logic Problems',                'pyq',         6)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name),
       r.ord
from raw r
join public.chapters c on c.name = r.chapter_name
join public.subjects s on s.id = c.subject_id and s.id = 'mathematics'
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

-- Verify with:
--   select c.name, count(t.id) from chapters c
--     join subjects s on s.id = c.subject_id
--     left join topics t on t.chapter_id = c.id
--    where s.id = 'mathematics'
--    group by c.name order by count(t.id) desc, c.name;
--   -- expect: each chapter shows 6 topics
