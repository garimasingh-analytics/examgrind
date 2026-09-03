-- Second editorial backfill batch: 1 September 2026.
-- Primary PIB source per item; teaching copy is original and exam-focused.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-01-sco-bishkek-summit',
  '2026-09-01',
  'SCO at Bishkek: security, connectivity and opportunity',
  'At the 26th SCO Council of Heads of State meeting in Bishkek, India highlighted security, trusted connectivity, innovation and people-to-people cooperation. The summit adopted the Bishkek Declaration along with other decisions and statements.',
  'SCO is a recurring international-relations topic. The useful preparation move is to know its broad regional role, the difference between a summit declaration and a treaty, and why connectivity is discussed alongside sovereignty and territorial integrity.',
  'The Shanghai Cooperation Organisation is a Eurasian regional grouping. A summit brings together heads of state to discuss common priorities. A declaration records shared positions or outcomes; it is different from a domestic law passed by Parliament.',
  'PIB: Prime Minister participates in the 26th SCO Summit in Bishkek',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305735&lang=1&reg=48',
  'Press Information Bureau',
  '2026-09-01',
  '["SCO is a regional Eurasian grouping.", "Bishkek is the capital of the Kyrgyz Republic.", "A declaration records agreed summit outcomes; it is not a domestic statute.", "Connectivity debates in international relations often involve sovereignty and territorial integrity."]'::jsonb,
  '[{"question":"Bishkek is the capital of which country?","answer":"The Kyrgyz Republic (Kyrgyzstan)."},{"question":"Why is a summit declaration different from a law?","answer":"A declaration records agreed positions or outcomes; a law is enacted through a domestic legislative process."}]'::jsonb,
  '{"title":"How to read an international summit update","steps":["Identify the organisation and its regional setting.","Separate the meeting venue from member-state facts.","Note the policy themes: security, connectivity, economy or climate.","Distinguish declarations, MoUs and legally enacted domestic laws."]}'::jsonb,
  'published', now()
),
(
  '2026-09-01-dgft-free-sale-commerce-certificates',
  '2026-09-01',
  'DGFT automates Free Sale and Commerce Certificates for eligible exporters',
  'The Directorate General of Foreign Trade enabled automated issuance of eligible Free Sale and Commerce Certificates through its portal, while applications needing verification can still be routed for review.',
  'This is a clean example of digital governance and trade facilitation. It connects Foreign Trade Policy, rule-based automation, regulatory oversight and ease of doing business.',
  'DGFT is the Directorate General of Foreign Trade under the Ministry of Commerce and Industry. Trade facilitation aims to make legitimate trade processes more efficient and predictable while retaining checks where risk or verification requires them.',
  'PIB: DGFT Enables Automated Issuance of Free Sale and Commerce Certificates',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2305357&lang=1&reg=3',
  'Press Information Bureau',
  '2026-09-01',
  '["DGFT stands for Directorate General of Foreign Trade.", "Trade facilitation can reduce time and compliance burden for eligible applicants.", "Automation does not eliminate every check; risk-based review can remain.", "A portal process can combine rule-based approval with manual scrutiny where needed."]'::jsonb,
  '[{"question":"What is the primary policy purpose of trade facilitation?","answer":"To make legitimate trade procedures more efficient, predictable and less burdensome while retaining necessary controls."},{"question":"What does DGFT stand for?","answer":"Directorate General of Foreign Trade."}]'::jsonb,
  '{"title":"Automation with safeguards","steps":["An applicant submits information through a digital portal.","Eligible, rule-matching cases can be processed automatically.","Risk or exception cases are routed for scrutiny.","The aim is faster processing without abandoning oversight."]}'::jsonb,
  'published', now()
),
(
  '2026-09-01-moES-earth-system-science',
  '2026-09-01',
  'Earth system science: weather, oceans, polar regions and earthquakes belong together',
  'The Ministry of Earth Sciences marked its 20th anniversary with a MyGov quiz that highlighted weather and climate studies, oceanography, polar studies and seismology.',
  'The announcement is a useful doorway into a common prelims habit: do not study weather, oceans, polar research and earthquakes as isolated trivia. They are connected parts of Earth system science.',
  'Earth system science studies interacting components of Earth: atmosphere, hydrosphere, geosphere, cryosphere and biosphere. Oceanography studies oceans; seismology studies earthquakes and seismic waves; polar science studies polar environments and their global links.',
  'PIB: Ministry of Earth Sciences Launches Online National Quiz',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2305702&lang=1&reg=3',
  'Press Information Bureau',
  '2026-09-01',
  '["Atmosphere, oceans, land and ice interact within the Earth system.", "Oceanography studies oceans; seismology studies earthquakes and seismic waves.", "Polar research matters for climate, oceans and global environmental change.", "MoES is the Ministry of Earth Sciences."]'::jsonb,
  '[{"question":"Which field studies earthquakes and seismic waves?","answer":"Seismology."},{"question":"Why is polar research relevant beyond polar regions?","answer":"Polar ice, oceans and atmosphere influence climate and sea-level systems globally."}]'::jsonb,
  '{"title":"One Earth system, connected questions","steps":["Atmosphere drives weather and climate processes.","Oceans store and move heat and moisture.","Ice-covered polar regions influence albedo and sea level.","The solid Earth produces tectonic and seismic processes."]}'::jsonb,
  'published', now()
),
(
  '2026-09-01-india-denmark-msme-innovation-ip',
  '2026-09-01',
  'India–Denmark MSME cooperation: innovation, IP and cluster development',
  'India and Denmark held the fourth meeting of their Joint Working Group on MSME development, innovation and intellectual property, covering technology adoption, commercialisation, entrepreneurship and cluster-based development.',
  'For the economy and international-relations syllabus, this shows that MSME policy is not only about credit. It also includes innovation, formalisation, technology adoption, intellectual-property awareness and market linkages.',
  'MSME stands for micro, small and medium enterprises. Intellectual property refers to legally recognised rights over creations such as inventions, designs and marks. Cluster development focuses support on a geographic or sectoral concentration of related enterprises.',
  'PIB: India–Denmark Strengthen Bilateral Cooperation in MSME Development, Innovation & Intellectual Property',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305351&lang=2&reg=48',
  'Press Information Bureau',
  '2026-09-01',
  '["MSME policy can cover innovation and technology adoption as well as finance.", "IP refers to legal rights over creations such as inventions, designs and marks.", "Cluster development supports linked enterprises within a place or sector.", "A Joint Working Group is an institutional mechanism for ongoing bilateral dialogue."]'::jsonb,
  '[{"question":"What is a major advantage of cluster-based MSME development?","answer":"Related enterprises can share specialised skills, suppliers, infrastructure, learning and market linkages."},{"question":"What does IP stand for in this policy context?","answer":"Intellectual property."}]'::jsonb,
  '{"title":"A broader view of MSME competitiveness","steps":["Entrepreneurs need capable firms and skilled workers.","Technology adoption can improve productivity.","IP and commercialisation can support innovation.","Clusters and institutional partnerships can improve market linkages."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  why_it_matters = excluded.why_it_matters,
  background = excluded.background,
  source_title = excluded.source_title,
  source_url = excluded.source_url,
  source_publisher = excluded.source_publisher,
  source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways,
  quick_check = excluded.quick_check,
  visual_data = excluded.visual_data,
  status = excluded.status,
  reviewed_at = excluded.reviewed_at,
  updated_at = now();
