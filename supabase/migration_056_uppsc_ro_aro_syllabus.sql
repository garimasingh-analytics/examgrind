-- UPPSC RO/ARO and UP Samiksha Adhikari / Sahayak Samiksha Adhikari
-- content foundation.
--
-- The post-specific requirements can differ across notifications. This map
-- provides the shared written-preparation core only; it must not be used to
-- imply that every post has the same typing, computer-certificate, or paper
-- structure requirement. The official-source register in migration_054 is
-- the release gate.

insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  ('uppsc-ro-gs', 'General Studies', (select id from exams where slug = 'uppsc-ro-aro'), '🗺️', 1, 'Indian and Uttar Pradesh context, polity, history, geography, science and current affairs.'),
  ('uppsc-ro-hindi', 'General Hindi & Drafting', (select id from exams where slug = 'uppsc-ro-aro'), '✍️', 2, 'Grammar, vocabulary, comprehension and precise official-language use.'),
  ('uppsc-ro-computer', 'Computer & Office Skills', (select id from exams where slug = 'uppsc-ro-aro'), '⌨️', 3, 'Computer basics, office tools and office-work concepts.'),
  ('uppsc-ro-reasoning', 'Reasoning & Aptitude', (select id from exams where slug = 'uppsc-ro-aro'), '🧩', 4, 'Logical conditions, data reading and objective aptitude.'),
  ('up-secretariat-gs', 'General Studies', (select id from exams where slug = 'up-secretariat-ro-aro'), '🗺️', 1, 'Shared UP-focused general studies preparation core.'),
  ('up-secretariat-hindi', 'General Hindi & Drafting', (select id from exams where slug = 'up-secretariat-ro-aro'), '✍️', 2, 'Hindi grammar, comprehension and administrative language.'),
  ('up-secretariat-computer', 'Computer & Office Skills', (select id from exams where slug = 'up-secretariat-ro-aro'), '⌨️', 3, 'Computer fundamentals and office-tool practice.'),
  ('up-secretariat-reasoning', 'Reasoning & Aptitude', (select id from exams where slug = 'up-secretariat-ro-aro'), '🧩', 4, 'Objective reasoning and decision-making foundations.')
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  icon = excluded.icon,
  order_index = excluded.order_index,
  description = excluded.description;

with raw(subject_id, name, slug, ord) as (values
  ('uppsc-ro-gs', 'Indian Polity & Governance', 'polity-governance', 1),
  ('uppsc-ro-gs', 'Indian History & Culture', 'history-culture', 2),
  ('uppsc-ro-gs', 'Geography, Economy & Science', 'geography-economy-science', 3),
  ('uppsc-ro-gs', 'Uttar Pradesh Special', 'uttar-pradesh-special', 4),
  ('uppsc-ro-gs', 'Current Affairs Method', 'current-affairs-method', 5),
  ('uppsc-ro-hindi', 'व्याकरण की बुनियाद', 'hindi-grammar-foundation', 1),
  ('uppsc-ro-hindi', 'शब्द-ज्ञान एवं प्रयोग', 'vocabulary-usage', 2),
  ('uppsc-ro-hindi', 'गद्यांश एवं सार', 'comprehension-summary', 3),
  ('uppsc-ro-hindi', 'वाक्य शुद्धि एवं संपादन', 'sentence-correction-editing', 4),
  ('uppsc-ro-hindi', 'प्रारूपण एवं सटीक लेखन', 'precise-writing', 5),
  ('uppsc-ro-computer', 'Computer Fundamentals', 'computer-fundamentals', 1),
  ('uppsc-ro-computer', 'Operating Systems & Files', 'operating-systems-files', 2),
  ('uppsc-ro-computer', 'Internet & Cyber Awareness', 'internet-cyber-awareness', 3),
  ('uppsc-ro-computer', 'Office Productivity Tools', 'office-productivity-tools', 4),
  ('uppsc-ro-computer', 'Keyboard & Data Entry Concepts', 'keyboard-data-entry-concepts', 5),
  ('uppsc-ro-reasoning', 'Analogy, Classification & Series', 'analogy-classification-series', 1),
  ('uppsc-ro-reasoning', 'Statements & Conclusions', 'statements-conclusions', 2),
  ('uppsc-ro-reasoning', 'Directions, Relations & Order', 'directions-relations-order', 3),
  ('uppsc-ro-reasoning', 'Data Interpretation Basics', 'data-interpretation-basics', 4),
  ('uppsc-ro-reasoning', 'Condition-first Problem Solving', 'condition-first-problem-solving', 5)
)
insert into public.chapters (subject_id, name, slug, order_index)
select subject_id, name, slug, ord from raw
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- Mirror the reviewed shared foundation into the Secretariat family. Using
-- separate subject IDs preserves independent learner evidence and lets later
-- notification-specific modules be added without contaminating RO/ARO data.
insert into public.chapters (subject_id, name, slug, order_index)
select replace(subject_id, 'uppsc-ro-', 'up-secretariat-'), name, slug, order_index
from public.chapters
where subject_id in ('uppsc-ro-gs', 'uppsc-ro-hindi', 'uppsc-ro-computer', 'uppsc-ro-reasoning')
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

with raw(subject_key, chapter_slug, name, slug, ord) as (values
  ('gs', 'polity-governance', 'Constitutional Framework', 'constitutional-framework', 1),
  ('gs', 'polity-governance', 'Fundamental Rights & Duties', 'rights-duties', 2),
  ('gs', 'polity-governance', 'Parliament and State Legislature', 'legislatures', 3),
  ('gs', 'polity-governance', 'Executive, Judiciary & Local Government', 'institutions-local-government', 4),
  ('gs', 'history-culture', 'Ancient and Medieval Milestones', 'ancient-medieval-milestones', 1),
  ('gs', 'history-culture', 'Modern National Movement', 'modern-national-movement', 2),
  ('gs', 'history-culture', 'Art, Culture & Heritage', 'art-culture-heritage', 3),
  ('gs', 'history-culture', 'UP History and Culture Links', 'up-history-culture-links', 4),
  ('gs', 'geography-economy-science', 'Indian Physical Geography', 'indian-physical-geography', 1),
  ('gs', 'geography-economy-science', 'Indian Economy Basics', 'indian-economy-basics', 2),
  ('gs', 'geography-economy-science', 'Everyday Science', 'everyday-science', 3),
  ('gs', 'geography-economy-science', 'Environment and Sustainability', 'environment-sustainability', 4),
  ('gs', 'uttar-pradesh-special', 'UP Geography and Rivers', 'up-geography-rivers', 1),
  ('gs', 'uttar-pradesh-special', 'UP Government and Schemes', 'up-government-schemes', 2),
  ('gs', 'uttar-pradesh-special', 'UP Economy and Infrastructure', 'up-economy-infrastructure', 3),
  ('gs', 'uttar-pradesh-special', 'UP Culture and Places', 'up-culture-places', 4),
  ('gs', 'current-affairs-method', 'Monthly Issue Log', 'monthly-issue-log', 1),
  ('gs', 'current-affairs-method', 'Government Reports and Indices', 'reports-indices', 2),
  ('gs', 'current-affairs-method', 'Schemes, Appointments and Awards', 'schemes-appointments-awards', 3),
  ('gs', 'current-affairs-method', 'Static Link Revision', 'static-link-revision', 4),
  ('hindi', 'hindi-grammar-foundation', 'संधि और समास', 'sandhi-samas', 1),
  ('hindi', 'hindi-grammar-foundation', 'उपसर्ग और प्रत्यय', 'upsarg-pratyay', 2),
  ('hindi', 'hindi-grammar-foundation', 'लिंग, वचन, कारक और काल', 'grammar-agreement', 3),
  ('hindi', 'hindi-grammar-foundation', 'वर्तनी और विराम-चिह्न', 'spelling-punctuation', 4),
  ('hindi', 'vocabulary-usage', 'पर्यायवाची और विलोम', 'synonyms-antonyms', 1),
  ('hindi', 'vocabulary-usage', 'मुहावरे और लोकोक्तियाँ', 'idioms-proverbs', 2),
  ('hindi', 'vocabulary-usage', 'अनेक शब्दों के लिए एक शब्द', 'one-word-substitution', 3),
  ('hindi', 'vocabulary-usage', 'शब्द-युग्म और सही प्रयोग', 'word-pairs-usage', 4),
  ('hindi', 'comprehension-summary', 'मुख्य विचार पहचानना', 'main-idea', 1),
  ('hindi', 'comprehension-summary', 'तथ्य और निष्कर्ष', 'facts-conclusions', 2),
  ('hindi', 'comprehension-summary', 'संक्षेपण की संरचना', 'summary-structure', 3),
  ('hindi', 'comprehension-summary', 'शीर्षक और भाव', 'title-tone', 4),
  ('hindi', 'sentence-correction-editing', 'वाक्य-रचना', 'sentence-structure', 1),
  ('hindi', 'sentence-correction-editing', 'त्रुटि पहचान', 'error-spotting', 2),
  ('hindi', 'sentence-correction-editing', 'अशुद्ध से शुद्ध', 'correction', 3),
  ('hindi', 'sentence-correction-editing', 'सटीक शब्द-चयन', 'precise-word-choice', 4),
  ('hindi', 'precise-writing', 'विषय और उद्देश्य', 'purpose-audience', 1),
  ('hindi', 'precise-writing', 'क्रम और स्पष्टता', 'order-clarity', 2),
  ('hindi', 'precise-writing', 'औपचारिक भाषा', 'formal-language', 3),
  ('hindi', 'precise-writing', 'संक्षिप्त संपादन', 'concise-editing', 4),
  ('computer', 'computer-fundamentals', 'Hardware and Software', 'hardware-software', 1),
  ('computer', 'computer-fundamentals', 'Input, Output and Processing', 'input-output-processing', 2),
  ('computer', 'computer-fundamentals', 'Memory and Storage', 'memory-storage', 3),
  ('computer', 'computer-fundamentals', 'Number-System Awareness', 'number-system-awareness', 4),
  ('computer', 'operating-systems-files', 'Operating System Roles', 'operating-system-roles', 1),
  ('computer', 'operating-systems-files', 'Files, Folders and Extensions', 'files-folders-extensions', 2),
  ('computer', 'operating-systems-files', 'Keyboard Shortcuts', 'keyboard-shortcuts', 3),
  ('computer', 'operating-systems-files', 'Utility Software', 'utility-software', 4),
  ('computer', 'internet-cyber-awareness', 'Web and Email Basics', 'web-email-basics', 1),
  ('computer', 'internet-cyber-awareness', 'Networks and Cloud Basics', 'networks-cloud-basics', 2),
  ('computer', 'internet-cyber-awareness', 'Digital Safety', 'digital-safety', 3),
  ('computer', 'internet-cyber-awareness', 'Data Privacy Basics', 'data-privacy-basics', 4),
  ('computer', 'office-productivity-tools', 'Word Processing', 'word-processing', 1),
  ('computer', 'office-productivity-tools', 'Spreadsheets', 'spreadsheets', 2),
  ('computer', 'office-productivity-tools', 'Presentations', 'presentations', 3),
  ('computer', 'office-productivity-tools', 'Document Formatting', 'document-formatting', 4),
  ('computer', 'keyboard-data-entry-concepts', 'Keyboard Layout Awareness', 'keyboard-layout-awareness', 1),
  ('computer', 'keyboard-data-entry-concepts', 'Accuracy Before Speed', 'accuracy-before-speed', 2),
  ('computer', 'keyboard-data-entry-concepts', 'Common Editing Commands', 'common-editing-commands', 3),
  ('computer', 'keyboard-data-entry-concepts', 'Official-Notice Verification', 'official-notice-verification', 4),
  ('reasoning', 'analogy-classification-series', 'Word and Number Analogy', 'word-number-analogy', 1),
  ('reasoning', 'analogy-classification-series', 'Classification Rule', 'classification-rule', 2),
  ('reasoning', 'analogy-classification-series', 'Number Series', 'number-series', 3),
  ('reasoning', 'analogy-classification-series', 'Alphabet Series', 'alphabet-series', 4),
  ('reasoning', 'statements-conclusions', 'Statement Scope', 'statement-scope', 1),
  ('reasoning', 'statements-conclusions', 'Necessary and Possible', 'necessary-possible', 2),
  ('reasoning', 'statements-conclusions', 'Assumptions', 'assumptions', 3),
  ('reasoning', 'statements-conclusions', 'Conclusion Check', 'conclusion-check', 4),
  ('reasoning', 'directions-relations-order', 'Direction Sense', 'direction-sense', 1),
  ('reasoning', 'directions-relations-order', 'Blood Relations', 'blood-relations', 2),
  ('reasoning', 'directions-relations-order', 'Ranking and Order', 'ranking-order', 3),
  ('reasoning', 'directions-relations-order', 'Condition Table', 'condition-table', 4),
  ('reasoning', 'data-interpretation-basics', 'Table Reading', 'table-reading', 1),
  ('reasoning', 'data-interpretation-basics', 'Percentage Change', 'percentage-change', 2),
  ('reasoning', 'data-interpretation-basics', 'Ratio Comparison', 'ratio-comparison', 3),
  ('reasoning', 'data-interpretation-basics', 'Reading Before Calculation', 'reading-before-calculation', 4),
  ('reasoning', 'condition-first-problem-solving', 'Extract Conditions', 'extract-conditions', 1),
  ('reasoning', 'condition-first-problem-solving', 'Draw a Minimal Map', 'minimal-map', 2),
  ('reasoning', 'condition-first-problem-solving', 'Eliminate Contradictions', 'eliminate-contradictions', 3),
  ('reasoning', 'condition-first-problem-solving', 'Final Option Check', 'final-option-check', 4)
), topic_targets as (
  select 'uppsc-ro-' || subject_key as subject_id, chapter_slug, name, slug, ord from raw
  union all
  select 'up-secretariat-' || subject_key as subject_id, chapter_slug, name, slug, ord from raw
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, t.name, t.slug,
       format('Build %s with short practice and a clear revision note.', t.name), t.ord
from topic_targets t
join public.chapters c on c.subject_id = t.subject_id and c.slug = t.chapter_slug
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
