-- Migration 031 — CUET Humanities cluster topic seed
-- 11 subjects, 60 chapters x 6 topics = 360 rows.
-- Authored against ACTUAL DB chapter names (queried live).
-- Applied successfully 2026-06-24 — all 11 subjects at exactly 6.0 topics per chapter.

-- Clean generic placeholders
delete from public.topics t
 using public.chapters c, public.subjects s
 where t.chapter_id = c.id
   and c.subject_id = s.id
   and s.id in ('political-science','psychology','history','sociology','geography','legal-studies','home-science','anthropology','agriculture','fine-arts','environmental-studies')
   and t.name in (
     'Concepts & Definitions','Worked Examples','Formulae & Shortcuts',
     'Common Mistakes','Mixed Practice','Practice Set'
   );

with raw(subject_id, chapter_name, topic_name, topic_slug, ord) as (values

  -- HISTORY (6)
  ('history','Themes in Ancient Indian History','Harappan Civilisation','harappan',1),
  ('history','Themes in Ancient Indian History','Vedic Age & Sixteen Mahajanapadas','vedic',2),
  ('history','Themes in Ancient Indian History','Mauryan Empire & Ashoka','mauryan',3),
  ('history','Themes in Ancient Indian History','Gupta Period & Classical Age','gupta',4),
  ('history','Themes in Ancient Indian History','Sangam Age & South India','sangam',5),
  ('history','Themes in Ancient Indian History','Ancient Indian Economy & Society','anc-economy',6),

  ('history','Themes in Medieval Indian History','Delhi Sultanate','sultanate',1),
  ('history','Themes in Medieval Indian History','Mughal Empire & Administration','mughal',2),
  ('history','Themes in Medieval Indian History','Vijayanagara & Bahmani Kingdoms','vijaya',3),
  ('history','Themes in Medieval Indian History','Religious & Cultural Movements','religious',4),
  ('history','Themes in Medieval Indian History','Trade & Urbanisation','trade',5),
  ('history','Themes in Medieval Indian History','Architecture & Art','architecture',6),

  ('history','Themes in Modern Indian History','Advent of Europeans & British Conquest','british',1),
  ('history','Themes in Modern Indian History','Revolt of 1857','revolt-1857',2),
  ('history','Themes in Modern Indian History','Socio-Religious Reform Movements','reform',3),
  ('history','Themes in Modern Indian History','Indian National Movement (1885-1919)','inm-early',4),
  ('history','Themes in Modern Indian History','Gandhian Era (1919-1947)','gandhi-era',5),
  ('history','Themes in Modern Indian History','Revolutionary Movements','revolutionary',6),

  ('history','Bhakti–Sufi Tradition','Origins of Bhakti Movement','bhakti-origin',1),
  ('history','Bhakti–Sufi Tradition','Saguna vs Nirguna Bhakti','saguna-nirguna',2),
  ('history','Bhakti–Sufi Tradition','Key Bhakti Saints (Kabir, Mirabai, Tulsi)','bhakti-saints',3),
  ('history','Bhakti–Sufi Tradition','Sufi Orders & Silsilas','sufi-orders',4),
  ('history','Bhakti–Sufi Tradition','Bhakti-Sufi Syncretism','syncretism',5),
  ('history','Bhakti–Sufi Tradition','Social Impact & Vernacular Literature','bhakti-impact',6),

  ('history','Colonialism and Rural Society','Permanent Settlement','permanent',1),
  ('history','Colonialism and Rural Society','Ryotwari & Mahalwari Systems','ryotwari',2),
  ('history','Colonialism and Rural Society','Indigo Rebellion','indigo',3),
  ('history','Colonialism and Rural Society','Deccan Riots & Peasant Movements','deccan',4),
  ('history','Colonialism and Rural Society','Famines under British Rule','famines',5),
  ('history','Colonialism and Rural Society','Commercialisation of Agriculture','commercialisation',6),

  ('history','Partition and Independence','Two-Nation Theory','two-nation',1),
  ('history','Partition and Independence','Cabinet Mission & Direct Action Day','cabinet-mission',2),
  ('history','Partition and Independence','Mountbatten Plan','mountbatten',3),
  ('history','Partition and Independence','Communal Violence & Refugee Crisis','violence',4),
  ('history','Partition and Independence','Integration of Princely States','integration',5),
  ('history','Partition and Independence','Constitution-Making & Republic','constitution',6),

  -- POLITICAL SCIENCE (6)
  ('political-science','Constitution and Government','Preamble & Salient Features','preamble',1),
  ('political-science','Constitution and Government','Fundamental Rights & Duties','rights',2),
  ('political-science','Constitution and Government','Directive Principles of State Policy','dpsp',3),
  ('political-science','Constitution and Government','Parliamentary System & Executive','parliament',4),
  ('political-science','Constitution and Government','Federalism & Centre-State Relations','federalism',5),
  ('political-science','Constitution and Government','Judiciary & Judicial Review','judiciary',6),

  ('political-science','Indian Politics Since Independence','Era of One-Party Dominance','one-party',1),
  ('political-science','Indian Politics Since Independence','Challenge of Political Stability (1960s-70s)','stability',2),
  ('political-science','Indian Politics Since Independence','Emergency & Janata Phase','emergency',3),
  ('political-science','Indian Politics Since Independence','Coalition Era & Regional Parties','coalition',4),
  ('political-science','Indian Politics Since Independence','Economic Reforms & Liberalisation','reforms',5),
  ('political-science','Indian Politics Since Independence','Recent Political Developments','recent',6),

  ('political-science','Cold War and Non-Aligned Movement','Origins of Cold War','origins',1),
  ('political-science','Cold War and Non-Aligned Movement','Berlin Crisis & Cuban Missile Crisis','crises',2),
  ('political-science','Cold War and Non-Aligned Movement','Arenas of Cold War','arenas',3),
  ('political-science','Cold War and Non-Aligned Movement','Non-Aligned Movement Origins','nam-origin',4),
  ('political-science','Cold War and Non-Aligned Movement','India''s Role in NAM','india-nam',5),
  ('political-science','Cold War and Non-Aligned Movement','Decline of Cold War','decline',6),

  ('political-science','End of Bipolarity','Disintegration of USSR','ussr',1),
  ('political-science','End of Bipolarity','Shock Therapy & Transition','shock-therapy',2),
  ('political-science','End of Bipolarity','Unipolar World & US Dominance','unipolar',3),
  ('political-science','End of Bipolarity','Russia''s Post-Soviet Role','russia',4),
  ('political-science','End of Bipolarity','Eastern Europe Transformation','eastern-europe',5),
  ('political-science','End of Bipolarity','India-Russia Relations','india-russia',6),

  ('political-science','Foreign Policy','Principles of Indian Foreign Policy','principles',1),
  ('political-science','Foreign Policy','India-Pakistan Relations','india-pak',2),
  ('political-science','Foreign Policy','India-China Relations','india-china',3),
  ('political-science','Foreign Policy','India-US Relations','india-us',4),
  ('political-science','Foreign Policy','Nuclear Policy & Tests','nuclear',5),
  ('political-science','Foreign Policy','India & International Organisations (UN, BRICS)','intl-orgs',6),

  ('political-science','Contemporary Issues','Globalisation & Its Impact','globalisation',1),
  ('political-science','Contemporary Issues','Environmental Politics','environment',2),
  ('political-science','Contemporary Issues','Human Rights & Justice','human-rights',3),
  ('political-science','Contemporary Issues','Security in Contemporary World','security',4),
  ('political-science','Contemporary Issues','International Terrorism','terrorism',5),
  ('political-science','Contemporary Issues','Identity Politics & Social Movements','identity',6),

  -- PSYCHOLOGY (6)
  ('psychology','Variations in Psychological Attributes','Individual Differences','differences',1),
  ('psychology','Variations in Psychological Attributes','Intelligence & IQ Tests','intelligence',2),
  ('psychology','Variations in Psychological Attributes','Theories of Intelligence (Spearman, Gardner)','theories',3),
  ('psychology','Variations in Psychological Attributes','Emotional & Multiple Intelligences','emotional',4),
  ('psychology','Variations in Psychological Attributes','Aptitude & Creativity','aptitude',5),
  ('psychology','Variations in Psychological Attributes','Culture & Intelligence','culture-iq',6),

  ('psychology','Self and Personality','Concept of Self & Self-Esteem','self',1),
  ('psychology','Self and Personality','Personality Approaches (Trait, Type)','approaches',2),
  ('psychology','Self and Personality','Psychodynamic Theory (Freud)','psychodynamic',3),
  ('psychology','Self and Personality','Behavioural & Cultural Approaches','behavioural',4),
  ('psychology','Self and Personality','Humanistic Approach (Maslow, Rogers)','humanistic',5),
  ('psychology','Self and Personality','Personality Assessment Methods','assessment',6),

  ('psychology','Meeting Lifes Challenges','Nature & Sources of Stress','stress',1),
  ('psychology','Meeting Lifes Challenges','Effects of Stress on Health','stress-health',2),
  ('psychology','Meeting Lifes Challenges','Coping Strategies','coping',3),
  ('psychology','Meeting Lifes Challenges','Life Skills & Resilience','life-skills',4),
  ('psychology','Meeting Lifes Challenges','Stress Management Techniques','management',5),
  ('psychology','Meeting Lifes Challenges','Positive Health & Well-Being','well-being',6),

  ('psychology','Psychological Disorders','Concept of Abnormality','abnormality',1),
  ('psychology','Psychological Disorders','Anxiety & Obsessive-Compulsive Disorders','anxiety',2),
  ('psychology','Psychological Disorders','Mood Disorders (Depression, Bipolar)','mood',3),
  ('psychology','Psychological Disorders','Schizophrenic Disorders','schizophrenia',4),
  ('psychology','Psychological Disorders','Developmental & Behavioural Disorders','developmental',5),
  ('psychology','Psychological Disorders','Substance Use Disorders','substance',6),

  ('psychology','Therapeutic Approaches','Nature & Process of Psychotherapy','psychotherapy',1),
  ('psychology','Therapeutic Approaches','Behaviour Therapy','behaviour',2),
  ('psychology','Therapeutic Approaches','Cognitive Therapy (CBT)','cognitive',3),
  ('psychology','Therapeutic Approaches','Humanistic & Existential Therapy','humanistic-therapy',4),
  ('psychology','Therapeutic Approaches','Biomedical Therapy','biomedical',5),
  ('psychology','Therapeutic Approaches','Alternative Therapies (Yoga, Meditation)','alternative',6),

  ('psychology','Social Psychology and Attitudes','Nature & Components of Attitudes','attitudes',1),
  ('psychology','Social Psychology and Attitudes','Attitude Formation & Change','att-change',2),
  ('psychology','Social Psychology and Attitudes','Prejudice & Discrimination','prejudice',3),
  ('psychology','Social Psychology and Attitudes','Social Cognition & Schemas','cognition',4),
  ('psychology','Social Psychology and Attitudes','Conformity, Compliance & Obedience','conformity',5),
  ('psychology','Social Psychology and Attitudes','Pro-Social Behaviour & Aggression','prosocial',6),

  -- SOCIOLOGY (6)
  ('sociology','Introducing Sociology','Emergence of Sociology','emergence',1),
  ('sociology','Introducing Sociology','Sociology and Other Social Sciences','other-sciences',2),
  ('sociology','Introducing Sociology','Sociological Imagination','imagination',3),
  ('sociology','Introducing Sociology','Basic Concepts (Society, Community, Culture)','basic-concepts',4),
  ('sociology','Introducing Sociology','Social Groups & Stratification (Intro)','groups',5),
  ('sociology','Introducing Sociology','Methods of Sociological Inquiry','methods',6),

  ('sociology','Indian Society — Demographic Structure','Population Composition','composition',1),
  ('sociology','Indian Society — Demographic Structure','Age Structure & Sex Ratio','age-sex',2),
  ('sociology','Indian Society — Demographic Structure','Rural-Urban Divide','rural-urban',3),
  ('sociology','Indian Society — Demographic Structure','Literacy & Education Patterns','literacy',4),
  ('sociology','Indian Society — Demographic Structure','Demographic Dividend','dividend',5),
  ('sociology','Indian Society — Demographic Structure','Population Policies','policies',6),

  ('sociology','Social Institutions','Family — Forms & Functions','family',1),
  ('sociology','Social Institutions','Marriage — Forms & Rules','marriage',2),
  ('sociology','Social Institutions','Caste System','caste',3),
  ('sociology','Social Institutions','Religion as Institution','religion',4),
  ('sociology','Social Institutions','Education as Institution','education',5),
  ('sociology','Social Institutions','State & Polity as Institutions','polity',6),

  ('sociology','Social Inequality and Exclusion','Caste-Based Inequality','caste-ineq',1),
  ('sociology','Social Inequality and Exclusion','Gender Inequality','gender',2),
  ('sociology','Social Inequality and Exclusion','Class & Economic Inequality','class',3),
  ('sociology','Social Inequality and Exclusion','Tribal Marginalisation','tribal',4),
  ('sociology','Social Inequality and Exclusion','Disability & Social Exclusion','disability',5),
  ('sociology','Social Inequality and Exclusion','Affirmative Action & Reservation','reservation',6),

  ('sociology','Globalisation and Social Change','Concept of Globalisation','concept',1),
  ('sociology','Globalisation and Social Change','Economic Globalisation','economic',2),
  ('sociology','Globalisation and Social Change','Cultural Globalisation','cultural',3),
  ('sociology','Globalisation and Social Change','Globalisation & Indian Society','india',4),
  ('sociology','Globalisation and Social Change','Social Movements (Old & New)','movements',5),
  ('sociology','Globalisation and Social Change','Resistance to Globalisation','resistance',6),

  ('sociology','Mass Media and Communications','Print Media — History & Role','print',1),
  ('sociology','Mass Media and Communications','Electronic Media (TV, Radio)','electronic',2),
  ('sociology','Mass Media and Communications','New Media & Social Networks','new-media',3),
  ('sociology','Mass Media and Communications','Media & Public Opinion','public-opinion',4),
  ('sociology','Mass Media and Communications','Media Ownership & Regulation','ownership',5),
  ('sociology','Mass Media and Communications','Globalisation of Media','media-glob',6),

  -- GEOGRAPHY (6)
  ('geography','Fundamentals of Human Geography','Nature & Scope of Human Geography','scope',1),
  ('geography','Fundamentals of Human Geography','Human Development Index','hdi',2),
  ('geography','Fundamentals of Human Geography','Population — Distribution & Density','population',3),
  ('geography','Fundamentals of Human Geography','Migration Types & Causes','migration',4),
  ('geography','Fundamentals of Human Geography','Primary Activities','primary',5),
  ('geography','Fundamentals of Human Geography','Secondary & Tertiary Activities','secondary-tertiary',6),

  ('geography','Population and Settlements','Population Composition (Age, Sex, Literacy)','composition',1),
  ('geography','Population and Settlements','Population Growth Theories','growth',2),
  ('geography','Population and Settlements','Rural Settlement Patterns','rural',3),
  ('geography','Population and Settlements','Urban Settlements & Hierarchy','urban',4),
  ('geography','Population and Settlements','Megacities & Urbanisation','megacities',5),
  ('geography','Population and Settlements','Slums & Housing','slums',6),

  ('geography','Resources and Development','Classification of Resources','classification',1),
  ('geography','Resources and Development','Land & Soil Resources','land-soil',2),
  ('geography','Resources and Development','Water Resources','water',3),
  ('geography','Resources and Development','Mineral & Energy Resources','minerals',4),
  ('geography','Resources and Development','Sustainable Resource Management','sustainable',5),
  ('geography','Resources and Development','Resource Planning in India','planning',6),

  ('geography','Indian Economy and Geography','Agriculture in India','agriculture',1),
  ('geography','Indian Economy and Geography','Major Crop Belts','crop-belts',2),
  ('geography','Indian Economy and Geography','Mineral & Industrial Belts','industrial',3),
  ('geography','Indian Economy and Geography','Iron, Steel & Cotton Industries','industries',4),
  ('geography','Indian Economy and Geography','International Trade Patterns','trade-patterns',5),
  ('geography','Indian Economy and Geography','Special Economic Zones','sez',6),

  ('geography','Transport, Communication and Trade','Modes of Transport (Land)','land-transport',1),
  ('geography','Transport, Communication and Trade','Water & Air Transport','water-air',2),
  ('geography','Transport, Communication and Trade','Pipeline & Communication Networks','pipeline',3),
  ('geography','Transport, Communication and Trade','International Trade Concepts','intl-trade',4),
  ('geography','Transport, Communication and Trade','India''s Foreign Trade','india-trade',5),
  ('geography','Transport, Communication and Trade','Globalisation of Trade','glob-trade',6),

  ('geography','Map Work and Practical Geography','Topographical Maps & Symbols','topo',1),
  ('geography','Map Work and Practical Geography','Map Projections','projections',2),
  ('geography','Map Work and Practical Geography','Scale & Distance Calculation','scale',3),
  ('geography','Map Work and Practical Geography','Contour & Relief Mapping','contour',4),
  ('geography','Map Work and Practical Geography','Remote Sensing & GIS','gis',5),
  ('geography','Map Work and Practical Geography','Data Sources & Field Survey','field-survey',6),

  -- LEGAL STUDIES (5)
  ('legal-studies','Indian Constitution and Legal System','Constitutional Framework','framework',1),
  ('legal-studies','Indian Constitution and Legal System','Hierarchy of Courts','hierarchy',2),
  ('legal-studies','Indian Constitution and Legal System','Fundamental Rights as Legal Rights','rights',3),
  ('legal-studies','Indian Constitution and Legal System','Public Interest Litigation','pil',4),
  ('legal-studies','Indian Constitution and Legal System','Constitutional Amendments','amendments',5),
  ('legal-studies','Indian Constitution and Legal System','Doctrine of Basic Structure','basic-structure',6),

  ('legal-studies','Indian Penal Code','Crime — Concept & Classification','crime',1),
  ('legal-studies','Indian Penal Code','Mens Rea & Actus Reus','mens-rea',2),
  ('legal-studies','Indian Penal Code','Offences Against Body','body',3),
  ('legal-studies','Indian Penal Code','Offences Against Property','property',4),
  ('legal-studies','Indian Penal Code','Defences in Criminal Law','defences',5),
  ('legal-studies','Indian Penal Code','Punishment Theories','punishment',6),

  ('legal-studies','Law of Torts','Concept of Tort','concept',1),
  ('legal-studies','Law of Torts','Negligence & Standard of Care','negligence',2),
  ('legal-studies','Law of Torts','Strict & Absolute Liability','liability',3),
  ('legal-studies','Law of Torts','Defamation','defamation',4),
  ('legal-studies','Law of Torts','Nuisance & Trespass','nuisance',5),
  ('legal-studies','Law of Torts','Remedies in Tort Law','remedies',6),

  ('legal-studies','Family Law','Hindu Marriage Act','hindu-marriage',1),
  ('legal-studies','Family Law','Muslim Personal Law','muslim',2),
  ('legal-studies','Family Law','Christian & Parsi Family Law','christian',3),
  ('legal-studies','Family Law','Special Marriage Act','special-marriage',4),
  ('legal-studies','Family Law','Divorce & Maintenance','divorce',5),
  ('legal-studies','Family Law','Adoption & Guardianship','adoption',6),

  ('legal-studies','Legal Profession and Judiciary','Advocates Act & Bar Council','advocates',1),
  ('legal-studies','Legal Profession and Judiciary','Legal Ethics & Professional Conduct','ethics',2),
  ('legal-studies','Legal Profession and Judiciary','Appointment of Judges','judges',3),
  ('legal-studies','Legal Profession and Judiciary','Judicial Independence','independence',4),
  ('legal-studies','Legal Profession and Judiciary','Alternative Dispute Resolution (ADR)','adr',5),
  ('legal-studies','Legal Profession and Judiciary','Legal Aid & Access to Justice','legal-aid',6),

  -- AGRICULTURE (5)
  ('agriculture','Agricultural Economics','Demand & Supply of Agri Products','demand-supply',1),
  ('agriculture','Agricultural Economics','Agricultural Marketing','marketing',2),
  ('agriculture','Agricultural Economics','Minimum Support Price','msp',3),
  ('agriculture','Agricultural Economics','Agri Credit & Insurance','credit',4),
  ('agriculture','Agricultural Economics','Subsidies & Government Policies','subsidies',5),
  ('agriculture','Agricultural Economics','Agri Cooperatives','cooperatives',6),

  ('agriculture','Crop Production and Management','Kharif & Rabi Crops','kharif-rabi',1),
  ('agriculture','Crop Production and Management','Cropping Patterns & Rotation','patterns',2),
  ('agriculture','Crop Production and Management','Irrigation Methods','irrigation',3),
  ('agriculture','Crop Production and Management','Fertilisers & Manures','fertilisers',4),
  ('agriculture','Crop Production and Management','Pest & Disease Management','pests',5),
  ('agriculture','Crop Production and Management','Post-Harvest Technology','harvest',6),

  ('agriculture','Soil Science and Plant Nutrition','Soil Formation & Profile','formation',1),
  ('agriculture','Soil Science and Plant Nutrition','Soil Types of India','types',2),
  ('agriculture','Soil Science and Plant Nutrition','Soil pH & Salinity','ph',3),
  ('agriculture','Soil Science and Plant Nutrition','Macro & Micronutrients','nutrients',4),
  ('agriculture','Soil Science and Plant Nutrition','Soil Conservation Methods','conservation',5),
  ('agriculture','Soil Science and Plant Nutrition','Organic Farming','organic',6),

  ('agriculture','Horticulture','Fruits — Cultivation & Varieties','fruits',1),
  ('agriculture','Horticulture','Vegetables — Cultivation & Varieties','vegetables',2),
  ('agriculture','Horticulture','Floriculture','flori',3),
  ('agriculture','Horticulture','Plantation Crops (Tea, Coffee, Rubber)','plantation',4),
  ('agriculture','Horticulture','Greenhouse & Protected Cultivation','greenhouse',5),
  ('agriculture','Horticulture','Nursery Management & Grafting','nursery',6),

  ('agriculture','Animal Husbandry and Dairy','Cattle & Buffalo Breeds','breeds',1),
  ('agriculture','Animal Husbandry and Dairy','Poultry Farming','poultry',2),
  ('agriculture','Animal Husbandry and Dairy','Sheep & Goat Rearing','sheep-goat',3),
  ('agriculture','Animal Husbandry and Dairy','Dairy Processing & Products','dairy-proc',4),
  ('agriculture','Animal Husbandry and Dairy','Animal Health & Veterinary Care','health',5),
  ('agriculture','Animal Husbandry and Dairy','Fisheries & Aquaculture','fisheries',6),

  -- ANTHROPOLOGY (5)
  ('anthropology','Anthropological Theory','Evolutionism','evolutionism',1),
  ('anthropology','Anthropological Theory','Functionalism (Malinowski, Radcliffe-Brown)','functionalism',2),
  ('anthropology','Anthropological Theory','Structuralism (Levi-Strauss)','structuralism',3),
  ('anthropology','Anthropological Theory','Cultural Materialism','materialism',4),
  ('anthropology','Anthropological Theory','Post-Modern Anthropology','postmodern',5),
  ('anthropology','Anthropological Theory','Indian Anthropologists & Schools','indian',6),

  ('anthropology','Physical Anthropology','Human Evolution & Hominids','evolution',1),
  ('anthropology','Physical Anthropology','Primates & Comparative Anatomy','primates',2),
  ('anthropology','Physical Anthropology','Race & Racial Classification','race',3),
  ('anthropology','Physical Anthropology','Human Genetics & Heredity','genetics',4),
  ('anthropology','Physical Anthropology','Forensic Anthropology','forensic',5),
  ('anthropology','Physical Anthropology','Growth & Variation','growth',6),

  ('anthropology','Cultural Anthropology','Concept & Components of Culture','concept',1),
  ('anthropology','Cultural Anthropology','Cultural Universals & Variation','variation',2),
  ('anthropology','Cultural Anthropology','Ethnography & Fieldwork','ethnography',3),
  ('anthropology','Cultural Anthropology','Kinship Systems','kinship',4),
  ('anthropology','Cultural Anthropology','Religion & Ritual in Culture','religion',5),
  ('anthropology','Cultural Anthropology','Cultural Change & Diffusion','change',6),

  ('anthropology','Linguistic Anthropology','Language & Society','lang-society',1),
  ('anthropology','Linguistic Anthropology','Phonetics & Phonology Basics','phonetics',2),
  ('anthropology','Linguistic Anthropology','Sociolinguistics','sociolinguistics',3),
  ('anthropology','Linguistic Anthropology','Language Families of India','families',4),
  ('anthropology','Linguistic Anthropology','Language Endangerment','endangerment',5),
  ('anthropology','Linguistic Anthropology','Bilingualism & Code-Switching','bilingual',6),

  ('anthropology','Indian Tribes and Societies','Tribal Demography in India','demography',1),
  ('anthropology','Indian Tribes and Societies','Major Tribal Groups','groups',2),
  ('anthropology','Indian Tribes and Societies','Tribal Economy & Livelihoods','economy',3),
  ('anthropology','Indian Tribes and Societies','Tribal Religion & Belief Systems','religion',4),
  ('anthropology','Indian Tribes and Societies','Tribal Movements & Identity','movements',5),
  ('anthropology','Indian Tribes and Societies','Tribal Policy & Development','policy',6),

  -- HOME SCIENCE (5)
  ('home-science','Human Development','Stages of Human Development','stages',1),
  ('home-science','Human Development','Infancy & Childhood','childhood',2),
  ('home-science','Human Development','Adolescence — Physical & Cognitive Changes','adolescence',3),
  ('home-science','Human Development','Adulthood & Aging','adulthood',4),
  ('home-science','Human Development','Special Needs & Inclusive Development','special-needs',5),
  ('home-science','Human Development','Parenting Styles','parenting',6),

  ('home-science','Nutrition and Food Science','Macronutrients (Carbs, Proteins, Fats)','macro',1),
  ('home-science','Nutrition and Food Science','Micronutrients (Vitamins, Minerals)','micro',2),
  ('home-science','Nutrition and Food Science','Balanced Diet & Food Groups','balanced',3),
  ('home-science','Nutrition and Food Science','Nutritional Deficiencies','deficiencies',4),
  ('home-science','Nutrition and Food Science','Food Safety & Hygiene','safety',5),
  ('home-science','Nutrition and Food Science','Therapeutic Diets','therapeutic',6),

  ('home-science','Human Ecology and Family Sciences','Family as Social Unit','family',1),
  ('home-science','Human Ecology and Family Sciences','Marriage & Family Forms','marriage',2),
  ('home-science','Human Ecology and Family Sciences','Family Life Cycle','lifecycle',3),
  ('home-science','Human Ecology and Family Sciences','Family Resource Management','resources',4),
  ('home-science','Human Ecology and Family Sciences','Community Resources','community',5),
  ('home-science','Human Ecology and Family Sciences','Environment & Family Well-Being','wellbeing',6),

  ('home-science','Resource Management','Time Management','time',1),
  ('home-science','Resource Management','Money Management & Budgeting','money',2),
  ('home-science','Resource Management','Energy & Fuel Management','energy',3),
  ('home-science','Resource Management','Consumer Rights & Awareness','consumer',4),
  ('home-science','Resource Management','Household Decision-Making','decision',5),
  ('home-science','Resource Management','Sustainable Consumption','sustainable',6),

  ('home-science','Textile and Apparel','Natural & Synthetic Fibres','fibres',1),
  ('home-science','Textile and Apparel','Yarn & Fabric Construction','yarn',2),
  ('home-science','Textile and Apparel','Dyes & Finishes','dyes',3),
  ('home-science','Textile and Apparel','Care & Maintenance of Textiles','care',4),
  ('home-science','Textile and Apparel','Apparel Design & Construction','apparel',5),
  ('home-science','Textile and Apparel','Indian Textile Heritage','heritage',6),

  -- FINE ARTS (5)
  ('fine-arts','Indian Art Through the Ages','Indus Valley Art','indus',1),
  ('fine-arts','Indian Art Through the Ages','Mauryan & Sunga Art','mauryan',2),
  ('fine-arts','Indian Art Through the Ages','Gupta Period Art','gupta',3),
  ('fine-arts','Indian Art Through the Ages','Temple Architecture (Nagara, Dravida)','temples',4),
  ('fine-arts','Indian Art Through the Ages','Cave Art (Ajanta, Ellora)','caves',5),
  ('fine-arts','Indian Art Through the Ages','Sculptural Traditions','sculpture',6),

  ('fine-arts','Mughal and Rajput Painting','Origin of Mughal Painting','mughal-origin',1),
  ('fine-arts','Mughal and Rajput Painting','Akbar Period Painting','akbar',2),
  ('fine-arts','Mughal and Rajput Painting','Jahangir & Shah Jahan Periods','jahangir',3),
  ('fine-arts','Mughal and Rajput Painting','Rajasthani Schools (Mewar, Bundi)','rajasthani',4),
  ('fine-arts','Mughal and Rajput Painting','Pahari Schools (Basohli, Kangra)','pahari',5),
  ('fine-arts','Mughal and Rajput Painting','Themes & Techniques','techniques',6),

  ('fine-arts','Modern Indian Art','Bengal School','bengal',1),
  ('fine-arts','Modern Indian Art','Raja Ravi Varma','ravi-varma',2),
  ('fine-arts','Modern Indian Art','Progressive Artists Group','progressive',3),
  ('fine-arts','Modern Indian Art','Amrita Sher-Gil & Contemporaries','amrita',4),
  ('fine-arts','Modern Indian Art','Post-Independence Movements','post-indep',5),
  ('fine-arts','Modern Indian Art','Contemporary Indian Artists','contemporary',6),

  ('fine-arts','Western Art Movements','Renaissance Art','renaissance',1),
  ('fine-arts','Western Art Movements','Baroque & Rococo','baroque',2),
  ('fine-arts','Western Art Movements','Impressionism','impressionism',3),
  ('fine-arts','Western Art Movements','Cubism & Picasso','cubism',4),
  ('fine-arts','Western Art Movements','Surrealism & Dada','surrealism',5),
  ('fine-arts','Western Art Movements','Abstract Expressionism','abstract',6),

  ('fine-arts','Art Appreciation and Criticism','Elements of Art (Line, Colour, Form)','elements',1),
  ('fine-arts','Art Appreciation and Criticism','Principles of Design','principles',2),
  ('fine-arts','Art Appreciation and Criticism','Art Criticism Frameworks','criticism',3),
  ('fine-arts','Art Appreciation and Criticism','Aesthetic Theories','aesthetics',4),
  ('fine-arts','Art Appreciation and Criticism','Visual Literacy','literacy',5),
  ('fine-arts','Art Appreciation and Criticism','Museums & Galleries','museums',6),

  -- ENVIRONMENTAL STUDIES (5)
  ('environmental-studies','Ecosystems and Biodiversity','Types of Ecosystems','types',1),
  ('environmental-studies','Ecosystems and Biodiversity','Biodiversity Levels & Hotspots','hotspots',2),
  ('environmental-studies','Ecosystems and Biodiversity','Ecological Pyramids','pyramids',3),
  ('environmental-studies','Ecosystems and Biodiversity','Threats to Biodiversity','threats',4),
  ('environmental-studies','Ecosystems and Biodiversity','In-situ & Ex-situ Conservation','conservation',5),
  ('environmental-studies','Ecosystems and Biodiversity','Endangered Species in India','endangered',6),

  ('environmental-studies','Natural Resources and Conservation','Forest Resources','forest',1),
  ('environmental-studies','Natural Resources and Conservation','Water Resources & Conflicts','water',2),
  ('environmental-studies','Natural Resources and Conservation','Mineral & Energy Resources','minerals',3),
  ('environmental-studies','Natural Resources and Conservation','Land Resources & Desertification','land',4),
  ('environmental-studies','Natural Resources and Conservation','Renewable vs Non-Renewable','renewable',5),
  ('environmental-studies','Natural Resources and Conservation','Sustainable Development Goals','sdg',6),

  ('environmental-studies','Environmental Pollution','Air Pollution — Sources & Effects','air',1),
  ('environmental-studies','Environmental Pollution','Water Pollution & BOD','water',2),
  ('environmental-studies','Environmental Pollution','Soil Pollution','soil',3),
  ('environmental-studies','Environmental Pollution','Noise & Thermal Pollution','noise',4),
  ('environmental-studies','Environmental Pollution','Solid Waste Management','waste',5),
  ('environmental-studies','Environmental Pollution','E-Waste & Hazardous Waste','e-waste',6),

  ('environmental-studies','Climate Change and Sustainability','Greenhouse Effect & Gases','greenhouse',1),
  ('environmental-studies','Climate Change and Sustainability','Global Warming Evidence','warming',2),
  ('environmental-studies','Climate Change and Sustainability','Ozone Depletion','ozone',3),
  ('environmental-studies','Climate Change and Sustainability','Climate Mitigation Strategies','mitigation',4),
  ('environmental-studies','Climate Change and Sustainability','International Climate Agreements','agreements',5),
  ('environmental-studies','Climate Change and Sustainability','Carbon Footprint & Net-Zero','carbon',6),

  ('environmental-studies','Environmental Laws and Policies','Environment Protection Act 1986','epa',1),
  ('environmental-studies','Environmental Laws and Policies','Forest Conservation Act','fca',2),
  ('environmental-studies','Environmental Laws and Policies','Wildlife Protection Act','wpa',3),
  ('environmental-studies','Environmental Laws and Policies','Water & Air Pollution Acts','pollution-acts',4),
  ('environmental-studies','Environmental Laws and Policies','National Green Tribunal','ngt',5),
  ('environmental-studies','Environmental Laws and Policies','EIA & Environmental Clearance','eia',6)

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
