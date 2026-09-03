-- Source-backed current-affairs backfill: 28 August 2026.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-08-28-public-examinations-high-powered-task-force',
  '2026-08-28',
  'Public-exam reforms: the High-Powered Task Force invites suggestions',
  'The Government’s High-Powered Task Force on public-examination reforms invited stakeholder suggestions on the conduct, security, design and governance of public examinations, including those conducted by the National Testing Agency. The Task Force is chaired by Nandan Nilekani.',
  'This is directly relevant to aspirants and to governance preparation. It lets students connect examination integrity with institutional capacity, technology, accessibility, privacy, transparency, grievance systems and student well-being—not only with preventing paper leaks.',
  'A High-Powered Task Force is a time-bound expert or official body formed to examine a specified issue and recommend measures. It is not itself a permanent constitutional body. The National Testing Agency is an autonomous testing organisation set up by the Ministry of Education to conduct specified entrance examinations.',
  'PIB: High-Powered Task Force Invites Suggestions on Reforms in Public Examinations',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304227&lang=1&reg=48',
  'Press Information Bureau',
  '2026-08-28',
  '["The High-Powered Task Force is chaired by Nandan Nilekani.", "Its remit includes conduct, security, design and governance of public examinations.", "NTA is an autonomous testing organisation under the Ministry of Education.", "A task force recommends reforms; it is not automatically a permanent statutory regulator."]'::jsonb,
  '[{"question":"Who chairs the High-Powered Task Force on public-examination reforms mentioned in the PIB release?","answer":"Nandan Nilekani."},{"question":"What is one difference between a task force and a permanent statutory body?","answer":"A task force is typically constituted for a defined review or recommendation exercise, while a statutory body is established by law with continuing functions."}]'::jsonb,
  '{"title":"A secure-examination systems view","steps":["Design examinations and procedures with clear rules.","Protect question papers, platforms and candidate data.","Build accessible, transparent and accountable processes.","Use feedback and review to improve trust and student welfare."]}'::jsonb,
  'published', now()
),
(
  '2026-08-28-india-kuwait-joint-defence-committee',
  '2026-08-28',
  'India–Kuwait Joint Defence Committee: moving an MoU into implementation',
  'India and Kuwait held the inaugural meeting of their Joint Defence Committee in New Delhi. The two sides discussed cooperation in training, military exercises, military medicine, staff talks, defence industry and research and development.',
  'For international relations, a bilateral defence mechanism is more useful than a headline alone: it shows how an MoU is operationalised through recurring meetings, institutional contacts, exercises, training and industry cooperation.',
  'A Joint Defence Committee is a bilateral institutional mechanism for reviewing and advancing agreed defence cooperation. Kuwait is a Gulf state on the north-western coast of the Persian Gulf. India’s Gulf engagement covers energy, trade, diaspora links, maritime security and defence cooperation.',
  'PIB: Inaugural India-Kuwait Joint Defence Committee Meeting Held in New Delhi',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304285&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-28',
  '["The India–Kuwait Joint Defence Committee held its inaugural meeting in New Delhi.", "The related defence-cooperation MoU was signed during the Prime Minister’s Kuwait visit in December 2024.", "The discussion included training, exercises, military medicine, defence industry and R&D.", "Kuwait is a Gulf state; Gulf relations have strategic, economic and diaspora dimensions for India."]'::jsonb,
  '[{"question":"What is the practical role of a Joint Defence Committee?","answer":"It provides an institutional forum to review and advance bilateral defence cooperation."},{"question":"Name two cooperation areas discussed by India and Kuwait.","answer":"Any two: training, military exercises, military medicine, staff talks, defence industry or R&D."}]'::jsonb,
  '{"title":"From an MoU to operational cooperation","steps":["Countries sign a cooperation framework.","A joint mechanism meets to set priorities.","Training, exercises and technical links create working-level engagement.","Regular review helps convert commitments into ongoing cooperation."]}'::jsonb,
  'published', now()
),
(
  '2026-08-28-cifri-argcure-fisheries-patent',
  '2026-08-28',
  'CIFRI ARGCURE: fisheries research, patents and technology transfer',
  'ICAR–CIFRI reported a patent for a nanoemulsifiable formulation used in the management of Argulus and other fish ectoparasites. The technology, called CIFRI ARGCURE, was commercialised on a non-exclusive basis through Agrinnovate India Ltd.',
  'This is a good science-and-agriculture example: a research institute develops a solution, protects the innovation through intellectual property, and works toward field adoption through technology transfer. It connects aquaculture productivity with fish health and public research institutions.',
  'ICAR is the Indian Council of Agricultural Research. CIFRI is the Central Inland Fisheries Research Institute at Barrackpore. Argulus is a parasitic crustacean commonly called fish louse; ectoparasites live on the external surface of a host.',
  'PIB: ICAR-CIFRI achieves Major Patent Milestone for CIFRI ARGCURE Technology',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304097&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-28',
  '["ICAR stands for Indian Council of Agricultural Research.", "CIFRI stands for Central Inland Fisheries Research Institute.", "Argulus is a fish ectoparasite, often called fish louse.", "A non-exclusive commercialisation arrangement can allow more than one party to use a technology under agreed terms."]'::jsonb,
  '[{"question":"What does ectoparasite mean?","answer":"A parasite that lives on the external surface of its host."},{"question":"Which organisation is CIFRI part of?","answer":"The Indian Council of Agricultural Research (ICAR)."}]'::jsonb,
  '{"title":"From laboratory innovation to aquaculture use","steps":["Researchers identify a fish-health problem.","A formulation is developed and tested.","Intellectual property protects the innovation.","Technology transfer supports wider practical use in aquaculture."]}'::jsonb,
  'published', now()
),
(
  '2026-08-28-pradhan-mantri-jan-dhan-yojana',
  '2026-08-28',
  'PM Jan Dhan Yojana: financial inclusion as a public-policy platform',
  'A PIB release marked 12 years of Pradhan Mantri Jan Dhan Yojana and highlighted its role in expanding financial inclusion. The scheme is best understood as a platform for access to formal banking and for linking households with wider financial and welfare-delivery systems.',
  'For exams, do not confuse Jan Dhan with every direct-benefit scheme. Jan Dhan is principally about financial inclusion and access to a bank account and related services; it can support DBT delivery, but it is not itself a cash-transfer programme for one particular sector.',
  'Pradhan Mantri Jan Dhan Yojana was launched in 2014. It aims to provide access to financial services such as banking, remittance, credit, insurance and pension in an affordable manner. The JAM approach refers to Jan Dhan accounts, Aadhaar and mobile connectivity.',
  'PIB: Prime Minister highlights transformative impact of Jan Dhan Yojana',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304206&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-28',
  '["PMJDY stands for Pradhan Mantri Jan Dhan Yojana.", "It was launched in 2014.", "Its central aim is financial inclusion and access to formal financial services.", "JAM refers to Jan Dhan–Aadhaar–Mobile." ]'::jsonb,
  '[{"question":"What is the main policy objective of PMJDY?","answer":"Financial inclusion through access to formal financial services."},{"question":"What does JAM stand for in India’s digital-welfare context?","answer":"Jan Dhan, Aadhaar and Mobile."}]'::jsonb,
  '{"title":"A financial-inclusion pathway","steps":["A household gains access to a formal bank account.","Identity and mobile connectivity can support authenticated access.","Accounts can connect users with payments, savings, insurance or credit services.","The system can also support more direct and traceable welfare transfers."]}'::jsonb,
  'published', now()
),
(
  '2026-08-28-sco-25-years-central-asia',
  '2026-08-28',
  'SCO at 25: mapping India’s Central Asia engagement',
  'PIB announced the Prime Minister’s bilateral visit to Uzbekistan and participation in the 26th SCO Summit in Bishkek, Kyrgyz Republic. The release noted the SCO’s 25th anniversary and India’s priorities of security, connectivity and opportunity at the forum.',
  'This is a useful international-relations map for students: know the organisation, India’s membership, the Central Asian setting, and the fact that bilateral and multilateral diplomacy often run together during such visits.',
  'The Shanghai Cooperation Organisation was founded in 2001 and India became a full member in 2017. Its work has included regional security, counter-terrorism, connectivity and economic cooperation. Bishkek is the capital of the Kyrgyz Republic; Tashkent is the capital of Uzbekistan.',
  'PIB: Visit of Prime Minister Shri Narendra Modi to Uzbekistan and Kyrgyz Republic',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304395&lang=1&reg=3',
  'Press Information Bureau',
  '2026-08-28',
  '["The SCO was founded in 2001.", "India became a full member of the SCO in 2017.", "Bishkek is the capital of the Kyrgyz Republic.", "Tashkent is the capital of Uzbekistan."]'::jsonb,
  '[{"question":"In which year did India become a full member of the SCO?","answer":"2017."},{"question":"Which capital hosted the 26th SCO Summit referred to in the PIB release?","answer":"Bishkek, Kyrgyz Republic."}]'::jsonb,
  '{"title":"Bilateral plus multilateral diplomacy","steps":["A bilateral visit addresses country-specific cooperation.","A regional summit brings several states together.","Leaders discuss security, connectivity and economic priorities.","Side meetings can advance additional bilateral relationships."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, why_it_matters = excluded.why_it_matters,
  background = excluded.background, source_title = excluded.source_title, source_url = excluded.source_url,
  source_publisher = excluded.source_publisher, source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways, quick_check = excluded.quick_check,
  visual_data = excluded.visual_data, status = excluded.status, reviewed_at = excluded.reviewed_at, updated_at = now();
