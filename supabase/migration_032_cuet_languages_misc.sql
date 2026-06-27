-- Migration 032 — CUET Languages + remaining specialised subjects
-- 12 Indian languages (8ch each, same template) + Sanskrit (5ch) + 3 specialised (5ch each) = 696 rows.
-- Optimization: 12 Indian languages share identical chapter schema, so we define
-- the topic template ONCE and cross-join against the 12 subjects (48 template rows -> 576 inserts).
-- Applied successfully 2026-06-24 — all 16 subjects at exactly 6.0 topics per chapter.

-- Clean generic placeholders for ALL these subjects
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id in ('assamese','bengali','gujarati','hindi','kannada','malayalam','marathi','odia','punjabi','tamil','telugu','urdu','sanskrit','knowledge-tradition','mass-media','physical-education')
   and t.name in (
     'Concepts & Definitions','Worked Examples','Formulae & Shortcuts',
     'Common Mistakes','Mixed Practice','Practice Set'
   );

-- ============ 12 Indian languages (cross-join) ============
with lang_subjects(subject_id) as (values
  ('assamese'),('bengali'),('gujarati'),('hindi'),('kannada'),('malayalam'),
  ('marathi'),('odia'),('punjabi'),('tamil'),('telugu'),('urdu')
),
lang_template(chapter_name, topic_name, topic_slug, ord) as (values
  ('Reading Comprehension (Prose)','Main Idea & Theme','main-idea',1),
  ('Reading Comprehension (Prose)','Inference & Implied Meaning','inference',2),
  ('Reading Comprehension (Prose)','Detail-Based Questions','detail',3),
  ('Reading Comprehension (Prose)','Author''s Tone & Purpose','tone',4),
  ('Reading Comprehension (Prose)','Vocabulary in Context','vocab',5),
  ('Reading Comprehension (Prose)','Summary & Title','summary',6),

  ('Reading Comprehension (Poetry)','Central Idea of Poem','central-idea',1),
  ('Reading Comprehension (Poetry)','Figures of Speech (Alankar)','alankar',2),
  ('Reading Comprehension (Poetry)','Imagery & Symbolism','imagery',3),
  ('Reading Comprehension (Poetry)','Rhyme & Rhythm (Chhand)','rhyme',4),
  ('Reading Comprehension (Poetry)','Mood & Tone in Poetry','mood',5),
  ('Reading Comprehension (Poetry)','Inference from Verse','poetry-inference',6),

  ('Reading Comprehension (Literary)','Character Analysis','character',1),
  ('Reading Comprehension (Literary)','Plot & Setting','plot-setting',2),
  ('Reading Comprehension (Literary)','Theme & Message','theme',3),
  ('Reading Comprehension (Literary)','Literary Devices','devices',4),
  ('Reading Comprehension (Literary)','Author Context & Era','author-era',5),
  ('Reading Comprehension (Literary)','Genre Conventions','genre',6),

  ('Grammar & Sentence Structure','Parts of Speech (Shabd Bhed)','parts-of-speech',1),
  ('Grammar & Sentence Structure','Tenses & Verb Forms','tenses',2),
  ('Grammar & Sentence Structure','Sentence Types (Vakya Bhed)','sentence-types',3),
  ('Grammar & Sentence Structure','Active & Passive Voice','voice',4),
  ('Grammar & Sentence Structure','Direct & Indirect Speech','speech',5),
  ('Grammar & Sentence Structure','Punctuation & Capitalization','punctuation',6),

  ('Synonyms & Antonyms','Common Synonym Pairs','common-syn',1),
  ('Synonyms & Antonyms','Common Antonym Pairs','common-ant',2),
  ('Synonyms & Antonyms','Word Roots & Derivations','roots',3),
  ('Synonyms & Antonyms','Shades of Meaning','shades',4),
  ('Synonyms & Antonyms','Register — Formal vs Informal','register',5),
  ('Synonyms & Antonyms','High-Frequency PYQ Words','pyq',6),

  ('Vocabulary in Context','Inferring Meaning from Sentence','infer-meaning',1),
  ('Vocabulary in Context','Confusing Word Pairs','confusing',2),
  ('Vocabulary in Context','Idiomatic vs Literal Usage','idiomatic',3),
  ('Vocabulary in Context','Phrasal Verbs / Muhavare','phrasal',4),
  ('Vocabulary in Context','Connotation & Denotation','connotation',5),
  ('Vocabulary in Context','One-Word Substitutions','one-word',6),

  ('Verbal Ability','Sentence Correction','correction',1),
  ('Verbal Ability','Sentence Improvement','improvement',2),
  ('Verbal Ability','Para Jumbles','jumbles',3),
  ('Verbal Ability','Cloze Tests','cloze',4),
  ('Verbal Ability','Fill in the Blanks','blanks',5),
  ('Verbal Ability','Spotting Errors','errors',6),

  ('Composition & Translation','Letter & Application Writing','letter',1),
  ('Composition & Translation','Essay Writing','essay',2),
  ('Composition & Translation','Precis Writing','precis',3),
  ('Composition & Translation','Translation — English to L1','eng-to-l1',4),
  ('Composition & Translation','Translation — L1 to English','l1-to-eng',5),
  ('Composition & Translation','Dialogue & Report Writing','dialogue',6)
),
lang_raw as (
  select ls.subject_id, lt.chapter_name, lt.topic_name, lt.topic_slug, lt.ord
  from lang_subjects ls
  cross join lang_template lt
),

-- ============ Sanskrit (5 chapters, specialised) ============
sanskrit_raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values
  ('sanskrit','Vyakaran (Grammar)','Lakar Vyavastha (Tenses)','lakar',1),
  ('sanskrit','Vyakaran (Grammar)','Karak & Vibhakti','karak-vibhakti',2),
  ('sanskrit','Vyakaran (Grammar)','Lingam, Vachan & Purush','ling-vachan',3),
  ('sanskrit','Vyakaran (Grammar)','Pratyaya (Suffixes)','pratyaya',4),
  ('sanskrit','Vyakaran (Grammar)','Subanta & Tinganta','subanta',5),
  ('sanskrit','Vyakaran (Grammar)','Common Vyakaran PYQs','vyakaran-pyq',6),

  ('sanskrit','Sandhi and Samasa','Swara Sandhi','swara',1),
  ('sanskrit','Sandhi and Samasa','Vyanjan Sandhi','vyanjan',2),
  ('sanskrit','Sandhi and Samasa','Visarga Sandhi','visarga',3),
  ('sanskrit','Sandhi and Samasa','Tatpurush Samasa','tatpurush',4),
  ('sanskrit','Sandhi and Samasa','Dwandva & Bahuvrihi Samasa','dwandva',5),
  ('sanskrit','Sandhi and Samasa','Avyayibhav Samasa','avyayibhav',6),

  ('sanskrit','Karak and Kriyapad','Karta & Karma Karak','karta-karma',1),
  ('sanskrit','Karak and Kriyapad','Karan & Sampradan','karan-samp',2),
  ('sanskrit','Karak and Kriyapad','Apadan & Sambandh','apadan',3),
  ('sanskrit','Karak and Kriyapad','Adhikaran Karak','adhikaran',4),
  ('sanskrit','Karak and Kriyapad','Kriyapad — Dhatu Rup','dhatu',5),
  ('sanskrit','Karak and Kriyapad','Sentence-Construction Drills','drills',6),

  ('sanskrit','Gadyamsa (Prose)','Comprehension of Prose Passage','comp',1),
  ('sanskrit','Gadyamsa (Prose)','Translation to Hindi/English','translation',2),
  ('sanskrit','Gadyamsa (Prose)','Vocabulary from Passage','vocab',3),
  ('sanskrit','Gadyamsa (Prose)','Synonyms & Antonyms in Sanskrit','syn-ant',4),
  ('sanskrit','Gadyamsa (Prose)','Author & Source Identification','author',5),
  ('sanskrit','Gadyamsa (Prose)','Theme & Moral','theme',6),

  ('sanskrit','Padyamsa (Verse)','Comprehension of Verse','verse-comp',1),
  ('sanskrit','Padyamsa (Verse)','Shloka Translation','shloka-trans',2),
  ('sanskrit','Padyamsa (Verse)','Chhand (Metre) Identification','chhand',3),
  ('sanskrit','Padyamsa (Verse)','Alankar (Figures of Speech)','alankar',4),
  ('sanskrit','Padyamsa (Verse)','Devotional & Niti Shlokas','niti',5),
  ('sanskrit','Padyamsa (Verse)','Common Verse PYQs','verse-pyq',6)
),

-- ============ Knowledge Tradition (5 chapters) ============
kt_raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values
  ('knowledge-tradition','Vedas and Upanishads','Four Vedas — Structure & Content','vedas',1),
  ('knowledge-tradition','Vedas and Upanishads','Samhitas, Brahmanas, Aranyakas','samhitas',2),
  ('knowledge-tradition','Vedas and Upanishads','Major Upanishads','upanishads',3),
  ('knowledge-tradition','Vedas and Upanishads','Concepts of Brahman & Atman','brahman',4),
  ('knowledge-tradition','Vedas and Upanishads','Vedanga & Auxiliary Texts','vedanga',5),
  ('knowledge-tradition','Vedas and Upanishads','Influence on Later Hindu Thought','influence',6),

  ('knowledge-tradition','Indian Philosophy Schools','Six Astika Darshanas Overview','astika',1),
  ('knowledge-tradition','Indian Philosophy Schools','Nyaya & Vaisheshika','nyaya',2),
  ('knowledge-tradition','Indian Philosophy Schools','Samkhya & Yoga','samkhya',3),
  ('knowledge-tradition','Indian Philosophy Schools','Purva Mimamsa & Vedanta','vedanta',4),
  ('knowledge-tradition','Indian Philosophy Schools','Nastika Schools (Buddhism, Jainism, Charvaka)','nastika',5),
  ('knowledge-tradition','Indian Philosophy Schools','Advaita vs Dvaita Vedanta','advaita-dvaita',6),

  ('knowledge-tradition','Indian Mathematics and Astronomy','Vedic Mathematics Concepts','vedic-math',1),
  ('knowledge-tradition','Indian Mathematics and Astronomy','Aryabhatta & Brahmagupta','aryabhatta',2),
  ('knowledge-tradition','Indian Mathematics and Astronomy','Concept of Zero & Decimal System','zero-decimal',3),
  ('knowledge-tradition','Indian Mathematics and Astronomy','Indian Astronomical Texts','astro-texts',4),
  ('knowledge-tradition','Indian Mathematics and Astronomy','Kerala School of Mathematics','kerala-school',5),
  ('knowledge-tradition','Indian Mathematics and Astronomy','Algorithms & Trigonometry','algorithms',6),

  ('knowledge-tradition','Indian Aesthetics and Arts','Rasa Theory (Bharata Muni)','rasa',1),
  ('knowledge-tradition','Indian Aesthetics and Arts','Dhvani & Alankara Theories','dhvani',2),
  ('knowledge-tradition','Indian Aesthetics and Arts','Natyashastra Principles','natyashastra',3),
  ('knowledge-tradition','Indian Aesthetics and Arts','Classical Music — Ragas & Talas','music',4),
  ('knowledge-tradition','Indian Aesthetics and Arts','Classical Dance Forms','dance',5),
  ('knowledge-tradition','Indian Aesthetics and Arts','Indian Architecture Schools','architecture',6),

  ('knowledge-tradition','Ayurveda and Yoga','Tridosha — Vata, Pitta, Kapha','tridosha',1),
  ('knowledge-tradition','Ayurveda and Yoga','Sapta Dhatus & Mala','dhatus',2),
  ('knowledge-tradition','Ayurveda and Yoga','Ayurvedic Texts (Charaka, Sushruta)','texts',3),
  ('knowledge-tradition','Ayurveda and Yoga','Ashtanga Yoga of Patanjali','ashtanga',4),
  ('knowledge-tradition','Ayurveda and Yoga','Pranayama & Asana Basics','pranayama',5),
  ('knowledge-tradition','Ayurveda and Yoga','Therapeutic Applications','therapeutic',6)
),

-- ============ Mass Media (5 chapters) ============
mm_raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values
  ('mass-media','Communication and Media','Models of Communication','models',1),
  ('mass-media','Communication and Media','Functions of Mass Media','functions',2),
  ('mass-media','Communication and Media','Verbal & Non-Verbal Communication','verbal',3),
  ('mass-media','Communication and Media','Barriers to Communication','barriers',4),
  ('mass-media','Communication and Media','Media Convergence','convergence',5),
  ('mass-media','Communication and Media','Audience Theories','audience',6),

  ('mass-media','Print Journalism','History of Indian Print Media','history',1),
  ('mass-media','Print Journalism','News Reporting Fundamentals','reporting',2),
  ('mass-media','Print Journalism','Editing & Headline Writing','editing',3),
  ('mass-media','Print Journalism','Newspaper Structure & Layout','layout',4),
  ('mass-media','Print Journalism','Feature Writing & Photojournalism','feature',5),
  ('mass-media','Print Journalism','Press Council & Self-Regulation','council',6),

  ('mass-media','Broadcast Media (TV / Radio)','History of Indian Broadcasting','broadcast-history',1),
  ('mass-media','Broadcast Media (TV / Radio)','Radio Programming Formats','radio',2),
  ('mass-media','Broadcast Media (TV / Radio)','TV News Production','tv-news',3),
  ('mass-media','Broadcast Media (TV / Radio)','TRP & Audience Measurement','trp',4),
  ('mass-media','Broadcast Media (TV / Radio)','Public vs Private Broadcasting','public-private',5),
  ('mass-media','Broadcast Media (TV / Radio)','Convergence with OTT','ott',6),

  ('mass-media','New Media and Digital','Internet & World Wide Web Basics','internet',1),
  ('mass-media','New Media and Digital','Social Media Platforms','social',2),
  ('mass-media','New Media and Digital','Citizen Journalism','citizen',3),
  ('mass-media','New Media and Digital','Digital Storytelling','storytelling',4),
  ('mass-media','New Media and Digital','Algorithms & Filter Bubbles','algorithms',5),
  ('mass-media','New Media and Digital','Misinformation & Fact-Checking','misinformation',6),

  ('mass-media','Media Ethics and Laws','Press Freedom under Article 19','press-freedom',1),
  ('mass-media','Media Ethics and Laws','Defamation Law','defamation',2),
  ('mass-media','Media Ethics and Laws','Right to Privacy & Surveillance','privacy',3),
  ('mass-media','Media Ethics and Laws','Copyright & Plagiarism','copyright',4),
  ('mass-media','Media Ethics and Laws','Press Council Code of Ethics','code-ethics',5),
  ('mass-media','Media Ethics and Laws','IT Act & Digital Regulations','it-act',6)
),

-- ============ Physical Education (5 chapters) ============
pe_raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values
  ('physical-education','Physical Fitness and Wellness','Components of Physical Fitness','components',1),
  ('physical-education','Physical Fitness and Wellness','Health-Related Fitness Tests','tests',2),
  ('physical-education','Physical Fitness and Wellness','Cardio-Respiratory Endurance','cardio',3),
  ('physical-education','Physical Fitness and Wellness','Strength & Flexibility Training','strength',4),
  ('physical-education','Physical Fitness and Wellness','Lifestyle Diseases & Prevention','lifestyle',5),
  ('physical-education','Physical Fitness and Wellness','Nutrition for Athletes','nutrition',6),

  ('physical-education','Yoga and Lifestyle','Asanas — Standing, Sitting, Lying','asanas',1),
  ('physical-education','Yoga and Lifestyle','Pranayama Techniques','pranayama',2),
  ('physical-education','Yoga and Lifestyle','Meditation & Mindfulness','meditation',3),
  ('physical-education','Yoga and Lifestyle','Yoga for Stress Management','stress',4),
  ('physical-education','Yoga and Lifestyle','Surya Namaskar Detailed','surya',5),
  ('physical-education','Yoga and Lifestyle','Yoga Therapy for Common Ailments','therapy',6),

  ('physical-education','Sports Psychology','Motivation in Sports','motivation',1),
  ('physical-education','Sports Psychology','Anxiety & Stress in Performance','anxiety',2),
  ('physical-education','Sports Psychology','Personality Traits of Athletes','personality',3),
  ('physical-education','Sports Psychology','Mental Imagery & Visualization','imagery',4),
  ('physical-education','Sports Psychology','Team Dynamics & Leadership','team',5),
  ('physical-education','Sports Psychology','Psychological Skills Training','psk',6),

  ('physical-education','Anatomy and Sports Medicine','Skeletal System & Joints','skeletal',1),
  ('physical-education','Anatomy and Sports Medicine','Muscular System','muscular',2),
  ('physical-education','Anatomy and Sports Medicine','Cardiovascular & Respiratory Response','cardiovascular',3),
  ('physical-education','Anatomy and Sports Medicine','Common Sports Injuries (RICE)','injuries',4),
  ('physical-education','Anatomy and Sports Medicine','Doping & Performance Enhancement','doping',5),
  ('physical-education','Anatomy and Sports Medicine','Rehabilitation & Recovery','rehab',6),

  ('physical-education','Sports and Society','Olympic Movement','olympic',1),
  ('physical-education','Sports and Society','Indian Sports History & Awards','indian-sports',2),
  ('physical-education','Sports and Society','Gender & Sports','gender',3),
  ('physical-education','Sports and Society','Sports Governance Bodies (IOA, BCCI)','governance',4),
  ('physical-education','Sports and Society','Commercialisation of Sports','commercial',5),
  ('physical-education','Sports and Society','Adapted Physical Education (Paralympics)','adapted',6)
),

-- ============ Union & Insert ============
all_raw as (
  select * from lang_raw
  union all
  select * from sanskrit_raw
  union all
  select * from kt_raw
  union all
  select * from mm_raw
  union all
  select * from pe_raw
)
insert into public.topics (chapter_id, name, slug, description, order_index)
select c.id, r.topic_name, r.topic_slug,
       format('Practice questions on %s within %s.', r.topic_name, c.name),
       r.ord
from all_raw r
join public.chapters c on c.name = r.chapter_name
join public.subjects s on s.id = c.subject_id and s.id = r.subject_id
on conflict (chapter_id, slug) do update set
  name        = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;
