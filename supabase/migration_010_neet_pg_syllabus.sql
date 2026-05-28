-- Migration 010: NEET PG syllabus (19 medical PG subjects)
--
-- The standard MBBS-to-PG curriculum used by NBE for NEET PG (and
-- INI-CET). 19 subjects organised by pre-clinical (year 1), para-clinical
-- (year 2), and clinical (years 3-4.5). Chapters are the canonical sections
-- you'd find in standard PG textbooks (Robbins, Harrison, Ganong, Katzung,
-- Bailey & Love, Williams, etc.) so question paper-cross-walks are easy.
--
-- Slug strategy: `np-` prefix (NEET PG) avoids collision with anything else.
-- All 19 subjects collapse into a single `exam_id` of 'neet-pg'.
--
-- Run with: paste into Supabase SQL Editor
-- Reversibility: delete from subjects where exam_id = (select id from exams where slug='neet-pg');

-- 1) Subjects — ordered by curriculum year then alphabetical -------------
insert into public.subjects (id, name, exam_id, icon, order_index, description) values
  -- Pre-clinical
  ('np-anatomy',       'Anatomy',               (select id from exams where slug='neet-pg'), '🦴',  1, 'Gross, microscopic, embryology, neuroanatomy'),
  ('np-physiology',    'Physiology',            (select id from exams where slug='neet-pg'), '❤️', 2, 'Cell, CVS, respiratory, renal, GI, endocrine, CNS, reproductive'),
  ('np-biochemistry',  'Biochemistry',          (select id from exams where slug='neet-pg'), '🧬',  3, 'Metabolism, molecular biology, enzymology, clinical biochemistry'),
  -- Para-clinical
  ('np-pathology',     'Pathology',             (select id from exams where slug='neet-pg'), '🔬',  4, 'General + systemic pathology, hematology, clinical pathology'),
  ('np-pharmacology',  'Pharmacology',          (select id from exams where slug='neet-pg'), '💊',  5, 'General principles, autonomic, CVS, CNS, antimicrobials, chemotherapy'),
  ('np-microbiology',  'Microbiology',          (select id from exams where slug='neet-pg'), '🦠',  6, 'Bacteriology, virology, mycology, parasitology, immunology'),
  ('np-forensic',      'Forensic Medicine',     (select id from exams where slug='neet-pg'), '⚖️', 7, 'Thanatology, traumatology, toxicology, medical jurisprudence'),
  ('np-psm',           'Community Medicine (PSM)', (select id from exams where slug='neet-pg'), '🏥',  8, 'Epidemiology, biostatistics, demography, national health programs'),
  -- Clinical
  ('np-medicine',      'General Medicine',      (select id from exams where slug='neet-pg'), '🩺',  9, 'Infectious diseases, CVS, respiratory, GI, endocrine, hematology, oncology'),
  ('np-surgery',       'General Surgery',       (select id from exams where slug='neet-pg'), '🔪', 10, 'GI surgery, breast, endocrine, vascular, trauma, oncology'),
  ('np-obg',           'Obstetrics & Gynecology', (select id from exams where slug='neet-pg'), '🤰', 11, 'Antenatal, intrapartum, postnatal care, gyne oncology, infertility'),
  ('np-pediatrics',    'Pediatrics',            (select id from exams where slug='neet-pg'), '👶', 12, 'Neonatology, growth, nutrition, infectious diseases, IAP guidelines'),
  ('np-ent',           'ENT (Otorhinolaryngology)', (select id from exams where slug='neet-pg'), '👂', 13, 'Ear, nose, throat, head & neck surgery'),
  ('np-ophthalmology', 'Ophthalmology',         (select id from exams where slug='neet-pg'), '👁️', 14, 'Refractive errors, lens, retina, glaucoma, cornea, orbit'),
  ('np-orthopedics',   'Orthopedics',           (select id from exams where slug='neet-pg'), '🦿', 15, 'Trauma, joint disorders, pediatric ortho, oncology, spine'),
  ('np-dermatology',   'Dermatology & Venereology', (select id from exams where slug='neet-pg'), '🩹', 16, 'Eczema, psoriasis, infections, STIs, leprosy, cosmetic derm'),
  ('np-psychiatry',    'Psychiatry',            (select id from exams where slug='neet-pg'), '🧠', 17, 'Mood, anxiety, psychotic, substance, child & forensic psychiatry'),
  ('np-radiology',     'Radiology',             (select id from exams where slug='neet-pg'), '🩻', 18, 'X-ray, CT, MRI, USG interpretation, interventional radiology'),
  ('np-anesthesia',    'Anesthesiology',        (select id from exams where slug='neet-pg'), '💉', 19, 'General + regional anesthesia, critical care, pain management')
on conflict (id) do update set
  name = excluded.name,
  exam_id = excluded.exam_id,
  description = excluded.description,
  icon = excluded.icon,
  order_index = excluded.order_index;

-- 2) Chapters: Anatomy ----------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-anatomy', 'General Anatomy',         'general',        1),
  ('np-anatomy', 'Upper Limb',              'upper-limb',     2),
  ('np-anatomy', 'Lower Limb',              'lower-limb',     3),
  ('np-anatomy', 'Thorax',                  'thorax',         4),
  ('np-anatomy', 'Abdomen & Pelvis',        'abdomen-pelvis', 5),
  ('np-anatomy', 'Head & Neck',             'head-neck',      6),
  ('np-anatomy', 'Neuroanatomy',            'neuroanatomy',   7),
  ('np-anatomy', 'Embryology',              'embryology',     8),
  ('np-anatomy', 'Histology',               'histology',      9),
  ('np-anatomy', 'Genetics',                'anat-genetics',  10)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 3) Chapters: Physiology -------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-physiology', 'General Physiology & Cell',      'general-cell',    1),
  ('np-physiology', 'Nerve & Muscle',                 'nerve-muscle',    2),
  ('np-physiology', 'Blood & Body Fluids',            'blood',           3),
  ('np-physiology', 'Cardiovascular System',          'cvs',             4),
  ('np-physiology', 'Respiratory System',             'respiratory',     5),
  ('np-physiology', 'Renal Physiology',               'renal',           6),
  ('np-physiology', 'Gastrointestinal System',        'git',             7),
  ('np-physiology', 'Endocrine Physiology',           'endocrine',       8),
  ('np-physiology', 'Reproductive Physiology',        'reproductive',    9),
  ('np-physiology', 'Central Nervous System',         'cns',            10),
  ('np-physiology', 'Special Senses',                 'special-senses', 11)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 4) Chapters: Biochemistry -----------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-biochemistry', 'Carbohydrate Metabolism',  'carb-metab',     1),
  ('np-biochemistry', 'Lipid Metabolism',         'lipid-metab',    2),
  ('np-biochemistry', 'Protein & Amino Acid Metabolism', 'protein-metab', 3),
  ('np-biochemistry', 'Nucleic Acid Metabolism',  'nucleic-metab',  4),
  ('np-biochemistry', 'Enzymes',                  'enzymes',        5),
  ('np-biochemistry', 'Vitamins & Minerals',      'vitamins',       6),
  ('np-biochemistry', 'Molecular Biology',        'mol-bio',        7),
  ('np-biochemistry', 'Clinical Biochemistry',    'clinical-biochem', 8)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 5) Chapters: Pathology --------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-pathology', 'General Pathology',            'general',          1),
  ('np-pathology', 'Hematology',                   'hematology',       2),
  ('np-pathology', 'CVS Pathology',                'cvs',              3),
  ('np-pathology', 'Respiratory Pathology',        'respiratory',      4),
  ('np-pathology', 'GI & Liver Pathology',         'gi-liver',         5),
  ('np-pathology', 'Renal & Urinary Pathology',    'renal',            6),
  ('np-pathology', 'Endocrine Pathology',          'endocrine',        7),
  ('np-pathology', 'Breast & Gynecological Pathology', 'breast-gynae', 8),
  ('np-pathology', 'CNS Pathology',                'cns',              9),
  ('np-pathology', 'Bone, Joint & Soft Tissue',    'bone-joint',      10),
  ('np-pathology', 'Skin Pathology',               'skin',            11)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 6) Chapters: Pharmacology -----------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-pharmacology', 'General Principles (PK/PD)', 'general',         1),
  ('np-pharmacology', 'Autonomic Nervous System',    'ans',             2),
  ('np-pharmacology', 'CVS Drugs',                   'cvs',             3),
  ('np-pharmacology', 'CNS Drugs',                   'cns',             4),
  ('np-pharmacology', 'Autacoids',                   'autacoids',       5),
  ('np-pharmacology', 'Endocrine Drugs',             'endocrine',       6),
  ('np-pharmacology', 'Antimicrobials',              'antimicrobials',  7),
  ('np-pharmacology', 'Antineoplastic & Immunomodulators', 'oncology',  8),
  ('np-pharmacology', 'GI & Respiratory Drugs',      'gi-resp',         9),
  ('np-pharmacology', 'Toxicology',                  'toxicology',     10)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 7) Chapters: Microbiology -----------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-microbiology', 'General Bacteriology',  'gen-bact',     1),
  ('np-microbiology', 'Systemic Bacteriology', 'sys-bact',     2),
  ('np-microbiology', 'Virology',              'virology',     3),
  ('np-microbiology', 'Mycology',              'mycology',     4),
  ('np-microbiology', 'Parasitology',          'parasitology', 5),
  ('np-microbiology', 'Immunology',            'immunology',   6),
  ('np-microbiology', 'Hospital Infection Control', 'infection-control', 7)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 8) Chapters: Forensic ---------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-forensic', 'Forensic Identification',  'identification', 1),
  ('np-forensic', 'Thanatology',              'thanatology',    2),
  ('np-forensic', 'Mechanical Injuries',      'injuries',       3),
  ('np-forensic', 'Thermal & Asphyxial Deaths', 'thermal-asphyxial', 4),
  ('np-forensic', 'Sexual Offences',          'sexual-offences', 5),
  ('np-forensic', 'Medical Jurisprudence',    'jurisprudence',  6),
  ('np-forensic', 'Toxicology (Forensic)',    'toxicology',     7)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 9) Chapters: PSM (Community Medicine) -----------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-psm', 'Concepts of Health & Disease',  'health-disease',  1),
  ('np-psm', 'Epidemiology',                  'epidemiology',    2),
  ('np-psm', 'Biostatistics',                 'biostatistics',   3),
  ('np-psm', 'Communicable Diseases',         'communicable',    4),
  ('np-psm', 'Non-Communicable Diseases',     'ncd',             5),
  ('np-psm', 'Demography & Family Planning',  'demography',      6),
  ('np-psm', 'Maternal & Child Health',       'mch',             7),
  ('np-psm', 'Nutrition',                     'nutrition',       8),
  ('np-psm', 'Environmental Health',          'environment',     9),
  ('np-psm', 'Occupational Health',           'occupational',   10),
  ('np-psm', 'National Health Programs',      'national-progs', 11),
  ('np-psm', 'Health Care Delivery',          'health-delivery', 12)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 10) Chapters: General Medicine ------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-medicine', 'Infectious Diseases',     'infectious',  1),
  ('np-medicine', 'Cardiology',              'cardiology',  2),
  ('np-medicine', 'Pulmonology',             'pulmonology', 3),
  ('np-medicine', 'Gastroenterology',        'gi',          4),
  ('np-medicine', 'Hepatology',              'hepatology',  5),
  ('np-medicine', 'Nephrology',              'nephrology',  6),
  ('np-medicine', 'Endocrinology',           'endocrine',   7),
  ('np-medicine', 'Hematology & Oncology',   'heme-onc',    8),
  ('np-medicine', 'Rheumatology',            'rheumatology',9),
  ('np-medicine', 'Neurology',               'neurology',  10),
  ('np-medicine', 'Critical Care & Emergency', 'critical-care', 11)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 11) Chapters: General Surgery -------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-surgery', 'General Surgery Principles', 'principles',     1),
  ('np-surgery', 'Trauma',                     'trauma',         2),
  ('np-surgery', 'GI Surgery',                 'gi-surgery',     3),
  ('np-surgery', 'Hepatobiliary & Pancreatic', 'hpb',            4),
  ('np-surgery', 'Endocrine Surgery',          'endocrine',      5),
  ('np-surgery', 'Breast Surgery',             'breast',         6),
  ('np-surgery', 'Vascular Surgery',           'vascular',       7),
  ('np-surgery', 'Urology',                    'urology',        8),
  ('np-surgery', 'Pediatric Surgery',          'pediatric',      9),
  ('np-surgery', 'Surgical Oncology',          'oncology',      10),
  ('np-surgery', 'Cardiothoracic & Neurosurgery overview', 'cts-neuro', 11)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 12) Chapters: OB-GYN ----------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-obg', 'Anatomy & Physiology',          'anat-phys',         1),
  ('np-obg', 'Antenatal Care',                'antenatal',         2),
  ('np-obg', 'High-Risk Pregnancy',           'high-risk',         3),
  ('np-obg', 'Intrapartum & Labour',          'labour',            4),
  ('np-obg', 'Postpartum Care',               'postpartum',        5),
  ('np-obg', 'Operative Obstetrics',          'operative-obs',     6),
  ('np-obg', 'Menstrual Disorders',           'menstrual',         7),
  ('np-obg', 'Infertility',                   'infertility',       8),
  ('np-obg', 'Contraception',                 'contraception',     9),
  ('np-obg', 'Gynae Oncology',                'gynae-onc',        10),
  ('np-obg', 'Urogynecology',                 'urogyn',           11)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 13) Chapters: Pediatrics ------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-pediatrics', 'Neonatology',               'neonatology',    1),
  ('np-pediatrics', 'Growth & Development',      'growth-dev',     2),
  ('np-pediatrics', 'Nutrition',                 'nutrition',      3),
  ('np-pediatrics', 'Immunization & IAP',        'immunization',   4),
  ('np-pediatrics', 'Pediatric Infectious Diseases', 'infectious', 5),
  ('np-pediatrics', 'Pediatric Cardiology',      'cardiology',     6),
  ('np-pediatrics', 'Pediatric Respiratory',     'respiratory',    7),
  ('np-pediatrics', 'Pediatric GI',              'gi',             8),
  ('np-pediatrics', 'Pediatric Hematology',      'hematology',     9),
  ('np-pediatrics', 'Pediatric Endocrine',       'endocrine',     10),
  ('np-pediatrics', 'Pediatric Neurology',       'neurology',     11),
  ('np-pediatrics', 'Pediatric Emergencies',     'emergencies',   12)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 14) Chapters: ENT -------------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-ent', 'Diseases of Ear',         'ear',           1),
  ('np-ent', 'Diseases of Nose & PNS',  'nose-pns',      2),
  ('np-ent', 'Diseases of Throat',      'throat',        3),
  ('np-ent', 'Head & Neck Tumors',      'head-neck',     4),
  ('np-ent', 'Audiology & Hearing',     'audiology',     5)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 15) Chapters: Ophthalmology ---------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-ophthalmology', 'Refractive Errors',     'refractive',  1),
  ('np-ophthalmology', 'Diseases of Cornea',    'cornea',      2),
  ('np-ophthalmology', 'Diseases of Lens (Cataract)', 'lens',  3),
  ('np-ophthalmology', 'Glaucoma',              'glaucoma',    4),
  ('np-ophthalmology', 'Retina & Vitreous',     'retina',      5),
  ('np-ophthalmology', 'Uveitis',               'uveitis',     6),
  ('np-ophthalmology', 'Diseases of Orbit & Lids', 'orbit',    7),
  ('np-ophthalmology', 'Strabismus',            'strabismus',  8),
  ('np-ophthalmology', 'Community Ophthalmology', 'community', 9)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 16) Chapters: Orthopedics -----------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-orthopedics', 'Trauma & Fractures',       'trauma',          1),
  ('np-orthopedics', 'Joint Disorders',          'joints',          2),
  ('np-orthopedics', 'Spine Disorders',          'spine',           3),
  ('np-orthopedics', 'Pediatric Orthopedics',    'pediatric',       4),
  ('np-orthopedics', 'Bone Tumors',              'tumors',          5),
  ('np-orthopedics', 'Bone Infections',          'infections',      6),
  ('np-orthopedics', 'Metabolic Bone Disease',   'metabolic',       7)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 17) Chapters: Dermatology -----------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-dermatology', 'Eczema & Dermatitis',       'eczema',        1),
  ('np-dermatology', 'Psoriasis & Lichen Planus', 'psoriasis',     2),
  ('np-dermatology', 'Bacterial Skin Infections', 'bacterial',     3),
  ('np-dermatology', 'Viral & Fungal Infections', 'viral-fungal',  4),
  ('np-dermatology', 'STIs & Venereology',        'stis',          5),
  ('np-dermatology', 'Leprosy',                   'leprosy',       6),
  ('np-dermatology', 'Bullous Disorders',         'bullous',       7),
  ('np-dermatology', 'Pigmentary Disorders',      'pigmentary',    8),
  ('np-dermatology', 'Hair, Nail & Sweat Disorders', 'hair-nail',  9)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 18) Chapters: Psychiatry ------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-psychiatry', 'Classification & Assessment',     'classification', 1),
  ('np-psychiatry', 'Psychotic Disorders',             'psychotic',      2),
  ('np-psychiatry', 'Mood Disorders',                  'mood',           3),
  ('np-psychiatry', 'Anxiety & OCD',                   'anxiety',        4),
  ('np-psychiatry', 'Substance Use Disorders',         'substance',      5),
  ('np-psychiatry', 'Personality & Eating Disorders',  'personality',    6),
  ('np-psychiatry', 'Child & Adolescent Psychiatry',   'child-psych',    7),
  ('np-psychiatry', 'Organic & Geriatric Psychiatry',  'organic',        8),
  ('np-psychiatry', 'Forensic Psychiatry',             'forensic',       9)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 19) Chapters: Radiology -------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-radiology', 'Imaging Physics & Basics',  'physics',         1),
  ('np-radiology', 'Chest Radiology',           'chest',           2),
  ('np-radiology', 'GI Radiology',              'gi',              3),
  ('np-radiology', 'Genitourinary Radiology',   'gu',              4),
  ('np-radiology', 'Neuroradiology',            'neuro',           5),
  ('np-radiology', 'Musculoskeletal Radiology', 'msk',             6),
  ('np-radiology', 'Obstetric & Gynae Imaging', 'obg',             7),
  ('np-radiology', 'Pediatric Radiology',       'pediatric',       8),
  ('np-radiology', 'Interventional Radiology',  'interventional',  9)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- 20) Chapters: Anesthesia ------------------------------------------------
insert into public.chapters (subject_id, name, slug, order_index) values
  ('np-anesthesia', 'Preoperative Evaluation',    'preop',           1),
  ('np-anesthesia', 'Anesthetic Drugs',           'drugs',           2),
  ('np-anesthesia', 'General Anesthesia',         'general',         3),
  ('np-anesthesia', 'Regional Anesthesia',        'regional',        4),
  ('np-anesthesia', 'Airway Management',          'airway',          5),
  ('np-anesthesia', 'Intraoperative Monitoring',  'monitoring',      6),
  ('np-anesthesia', 'Postoperative Care',         'postop',          7),
  ('np-anesthesia', 'Critical Care',              'critical-care',   8),
  ('np-anesthesia', 'Pain Management',            'pain',            9),
  ('np-anesthesia', 'Anesthesia in Special Situations', 'special',  10)
on conflict (subject_id, slug) do update set name = excluded.name, order_index = excluded.order_index;

-- Done. Verify with:
--   select s.name, count(c.id) as chapters from subjects s
--     left join chapters c on c.subject_id = s.id
--    where s.exam_id = (select id from exams where slug='neet-pg')
--    group by s.name, s.order_index order by s.order_index;
