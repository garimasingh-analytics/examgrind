-- Delhi Police Constable: first complete government-exam content map.
--
-- Original taxonomy only. It is designed around the objective areas used in
-- the Constable (Executive) route, but intentionally does not encode a fixed
-- marks split, duration or vacancy promise: those can change by notification.
-- See migration_054 for the official-source register that must be reviewed
-- before changing this exam from coming_soon to live.

insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  ('dp-gk', 'General Knowledge & Current Affairs', (select id from exams where slug = 'delhi-police-constable'), '🗺️', 1, 'Indian polity, history, geography, science awareness and current-affairs method.'),
  ('dp-reasoning', 'Reasoning', (select id from exams where slug = 'delhi-police-constable'), '🧩', 2, 'Verbal, numerical and figure reasoning with condition-first methods.'),
  ('dp-quant', 'Numerical Ability', (select id from exams where slug = 'delhi-police-constable'), '∑', 3, 'School-level arithmetic, calculation and data handling.'),
  ('dp-computer', 'Computer Awareness', (select id from exams where slug = 'delhi-police-constable'), '⌨️', 4, 'Computer fundamentals, operating systems, internet and office tools.')
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  icon = excluded.icon,
  order_index = excluded.order_index,
  description = excluded.description;

with raw(subject_id, name, slug, ord) as (values
  ('dp-gk', 'Indian Polity', 'indian-polity', 1),
  ('dp-gk', 'Modern Indian History', 'modern-indian-history', 2),
  ('dp-gk', 'Indian Geography', 'indian-geography', 3),
  ('dp-gk', 'General Science', 'general-science', 4),
  ('dp-gk', 'Current Affairs Method', 'current-affairs-method', 5),
  ('dp-reasoning', 'Analogy & Classification', 'analogy-classification', 1),
  ('dp-reasoning', 'Series & Coding-Decoding', 'series-coding', 2),
  ('dp-reasoning', 'Directions, Relations & Ranking', 'directions-relations-ranking', 3),
  ('dp-reasoning', 'Syllogism & Venn Diagrams', 'syllogism-venn', 4),
  ('dp-reasoning', 'Non-Verbal Reasoning', 'non-verbal-reasoning', 5),
  ('dp-quant', 'Number System & Simplification', 'number-system-simplification', 1),
  ('dp-quant', 'Percentages, Ratio & Average', 'percentages-ratio-average', 2),
  ('dp-quant', 'Profit, Loss & Interest', 'profit-loss-interest', 3),
  ('dp-quant', 'Time, Work, Speed & Distance', 'time-work-speed-distance', 4),
  ('dp-quant', 'Mensuration & Data Interpretation', 'mensuration-data-interpretation', 5),
  ('dp-computer', 'Computer Fundamentals', 'computer-fundamentals', 1),
  ('dp-computer', 'Hardware, Memory & Storage', 'hardware-memory-storage', 2),
  ('dp-computer', 'Operating Systems & Files', 'operating-systems-files', 3),
  ('dp-computer', 'Internet, Networks & Cyber Safety', 'internet-networks-cyber-safety', 4),
  ('dp-computer', 'Office Tools & Shortcuts', 'office-tools-shortcuts', 5)
)
insert into public.chapters (subject_id, name, slug, order_index)
select subject_id, name, slug, ord from raw
on conflict (subject_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index;

with raw(subject_id, chapter_slug, name, slug, ord) as (values
  ('dp-gk', 'indian-polity', 'Constitutional Framework', 'constitutional-framework', 1),
  ('dp-gk', 'indian-polity', 'Fundamental Rights & Duties', 'rights-duties', 2),
  ('dp-gk', 'indian-polity', 'President, Parliament & Judiciary', 'constitutional-institutions', 3),
  ('dp-gk', 'indian-polity', 'Centre-State Basics', 'federal-basics', 4),
  ('dp-gk', 'modern-indian-history', 'Company Rule to Crown Rule', 'company-to-crown', 1),
  ('dp-gk', 'modern-indian-history', 'Reform and Resistance Movements', 'reform-resistance', 2),
  ('dp-gk', 'modern-indian-history', 'National Movement Milestones', 'national-movement', 3),
  ('dp-gk', 'modern-indian-history', 'Acts, Sessions & Leaders', 'acts-sessions-leaders', 4),
  ('dp-gk', 'indian-geography', 'Physical Geography of India', 'physical-india', 1),
  ('dp-gk', 'indian-geography', 'Rivers, Soils & Climate', 'rivers-soils-climate', 2),
  ('dp-gk', 'indian-geography', 'States, Capitals & Neighbours', 'states-capitals-neighbours', 3),
  ('dp-gk', 'indian-geography', 'Agriculture & Resources', 'agriculture-resources', 4),
  ('dp-gk', 'general-science', 'Everyday Physics', 'everyday-physics', 1),
  ('dp-gk', 'general-science', 'Everyday Chemistry', 'everyday-chemistry', 2),
  ('dp-gk', 'general-science', 'Biology & Human Systems', 'biology-human-systems', 3),
  ('dp-gk', 'general-science', 'Environment & Health', 'environment-health', 4),
  ('dp-gk', 'current-affairs-method', 'Monthly Revision System', 'monthly-revision', 1),
  ('dp-gk', 'current-affairs-method', 'Government Schemes & Reports', 'schemes-reports', 2),
  ('dp-gk', 'current-affairs-method', 'Awards, Sports & Appointments', 'awards-sports-appointments', 3),
  ('dp-gk', 'current-affairs-method', 'Static Link Building', 'static-link-building', 4),
  ('dp-reasoning', 'analogy-classification', 'Word Analogy', 'word-analogy', 1),
  ('dp-reasoning', 'analogy-classification', 'Number Analogy', 'number-analogy', 2),
  ('dp-reasoning', 'analogy-classification', 'Odd One Out', 'odd-one-out', 3),
  ('dp-reasoning', 'analogy-classification', 'Rule Checking', 'rule-checking', 4),
  ('dp-reasoning', 'series-coding', 'Number Series', 'number-series', 1),
  ('dp-reasoning', 'series-coding', 'Alphabet Series', 'alphabet-series', 2),
  ('dp-reasoning', 'series-coding', 'Coding-Decoding', 'coding-decoding', 3),
  ('dp-reasoning', 'series-coding', 'Pattern Verification', 'pattern-verification', 4),
  ('dp-reasoning', 'directions-relations-ranking', 'Direction Sense', 'direction-sense', 1),
  ('dp-reasoning', 'directions-relations-ranking', 'Blood Relations', 'blood-relations', 2),
  ('dp-reasoning', 'directions-relations-ranking', 'Ranking & Order', 'ranking-order', 3),
  ('dp-reasoning', 'directions-relations-ranking', 'Statement Mapping', 'statement-mapping', 4),
  ('dp-reasoning', 'syllogism-venn', 'Syllogism Statements', 'syllogism-statements', 1),
  ('dp-reasoning', 'syllogism-venn', 'Possibility Cases', 'possibility-cases', 2),
  ('dp-reasoning', 'syllogism-venn', 'Venn Set Relations', 'venn-set-relations', 3),
  ('dp-reasoning', 'syllogism-venn', 'Conclusion Check', 'conclusion-check', 4),
  ('dp-reasoning', 'non-verbal-reasoning', 'Mirror & Water Images', 'mirror-water-images', 1),
  ('dp-reasoning', 'non-verbal-reasoning', 'Paper Folding', 'paper-folding', 2),
  ('dp-reasoning', 'non-verbal-reasoning', 'Figure Completion', 'figure-completion', 3),
  ('dp-reasoning', 'non-verbal-reasoning', 'Cube & Dice', 'cube-dice', 4),
  ('dp-quant', 'number-system-simplification', 'BODMAS & Fractions', 'bodmas-fractions', 1),
  ('dp-quant', 'number-system-simplification', 'HCF & LCM', 'hcf-lcm', 2),
  ('dp-quant', 'number-system-simplification', 'Surds & Indices', 'surds-indices', 3),
  ('dp-quant', 'number-system-simplification', 'Approximation', 'approximation', 4),
  ('dp-quant', 'percentages-ratio-average', 'Percentage Base Values', 'percentage-base-values', 1),
  ('dp-quant', 'percentages-ratio-average', 'Ratio & Proportion', 'ratio-proportion', 2),
  ('dp-quant', 'percentages-ratio-average', 'Average', 'average', 3),
  ('dp-quant', 'percentages-ratio-average', 'Mixture Basics', 'mixture-basics', 4),
  ('dp-quant', 'profit-loss-interest', 'Profit & Loss', 'profit-loss', 1),
  ('dp-quant', 'profit-loss-interest', 'Discount & Marked Price', 'discount-marked-price', 2),
  ('dp-quant', 'profit-loss-interest', 'Simple Interest', 'simple-interest', 3),
  ('dp-quant', 'profit-loss-interest', 'Compound Interest', 'compound-interest', 4),
  ('dp-quant', 'time-work-speed-distance', 'Work Rates', 'work-rates', 1),
  ('dp-quant', 'time-work-speed-distance', 'Pipes & Cisterns', 'pipes-cisterns', 2),
  ('dp-quant', 'time-work-speed-distance', 'Speed & Relative Speed', 'speed-relative-speed', 3),
  ('dp-quant', 'time-work-speed-distance', 'Trains & Boats', 'trains-boats', 4),
  ('dp-quant', 'mensuration-data-interpretation', '2D Mensuration', 'two-dimensional-mensuration', 1),
  ('dp-quant', 'mensuration-data-interpretation', '3D Mensuration', 'three-dimensional-mensuration', 2),
  ('dp-quant', 'mensuration-data-interpretation', 'Tables & Bar Graphs', 'tables-bar-graphs', 3),
  ('dp-quant', 'mensuration-data-interpretation', 'Percent DI', 'percent-data-interpretation', 4),
  ('dp-computer', 'computer-fundamentals', 'Input, Output & Processing', 'input-output-processing', 1),
  ('dp-computer', 'computer-fundamentals', 'Software Types', 'software-types', 2),
  ('dp-computer', 'computer-fundamentals', 'Number Systems Basics', 'number-system-basics', 3),
  ('dp-computer', 'computer-fundamentals', 'Computer Generations', 'computer-generations', 4),
  ('dp-computer', 'hardware-memory-storage', 'CPU Components', 'cpu-components', 1),
  ('dp-computer', 'hardware-memory-storage', 'Primary Memory', 'primary-memory', 2),
  ('dp-computer', 'hardware-memory-storage', 'Secondary Storage', 'secondary-storage', 3),
  ('dp-computer', 'hardware-memory-storage', 'Ports & Peripherals', 'ports-peripherals', 4),
  ('dp-computer', 'operating-systems-files', 'Operating System Roles', 'operating-system-roles', 1),
  ('dp-computer', 'operating-systems-files', 'Files, Folders & Extensions', 'files-folders-extensions', 2),
  ('dp-computer', 'operating-systems-files', 'Keyboard Shortcuts', 'keyboard-shortcuts', 3),
  ('dp-computer', 'operating-systems-files', 'Utility Software', 'utility-software', 4),
  ('dp-computer', 'internet-networks-cyber-safety', 'Internet & Web Basics', 'internet-web-basics', 1),
  ('dp-computer', 'internet-networks-cyber-safety', 'Networks & Topologies', 'networks-topologies', 2),
  ('dp-computer', 'internet-networks-cyber-safety', 'Email & Cloud Basics', 'email-cloud-basics', 3),
  ('dp-computer', 'internet-networks-cyber-safety', 'Safe Digital Practice', 'safe-digital-practice', 4),
  ('dp-computer', 'office-tools-shortcuts', 'Word Processing', 'word-processing', 1),
  ('dp-computer', 'office-tools-shortcuts', 'Spreadsheets', 'spreadsheets', 2),
  ('dp-computer', 'office-tools-shortcuts', 'Presentations', 'presentations', 3),
  ('dp-computer', 'office-tools-shortcuts', 'Common Shortcuts', 'common-shortcuts', 4)
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.name, r.slug,
       format('Build %s for Delhi Police Constable objective practice.', r.name), r.ord
from raw r
join public.chapters c on c.subject_id = r.subject_id and c.slug = r.chapter_slug
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
