-- A source-backed catalogue for Government of India schemes.
-- Important editorial rule: a coaching note may help discover a scheme, but it
-- must never be the published source. Every public card points to an official
-- programme, ministry, or Government of India catalogue URL.

alter table public.government_schemes
  add column if not exists category text,
  add column if not exists government_level text not null default 'central',
  add column if not exists benefit_summary text,
  add column if not exists application_url text,
  add column if not exists source_kind text not null default 'programme_portal',
  add column if not exists verification_status text not null default 'official_source_checked';

update public.government_schemes
set category = case slug
  when 'pm-kisan' then 'Agriculture, Rural & Environment'
  when 'mgnregs' then 'Skills & Employment'
  when 'jal-jeevan-mission' then 'Utility & Sanitation'
  when 'pmay-g' then 'Housing & Shelter'
  when 'pm-svanidhi' then 'Business & Entrepreneurship'
  when 'pm-vishwakarma' then 'Business & Entrepreneurship'
  when 'pm-poshan' then 'Education & Learning'
  when 'ayushman-bharat-pmjay' then 'Health & Wellness'
  else 'Social Welfare & Empowerment'
end,
benefit_summary = coalesce(benefit_summary, 'See the official scheme page for the current benefit, eligibility and application conditions.');

alter table public.government_schemes
  alter column category set not null;

create index if not exists government_schemes_catalogue_idx
  on public.government_schemes (government_level, category, status, name);

-- First verified Central-scheme expansion. These short notes are original
-- exam-revision summaries; official links remain the authority for benefits,
-- eligibility and live application rules.
insert into public.government_schemes (
  slug, name, ministry, category, government_level, what_it_is, who_it_is_for,
  benefit_summary, why_it_matters, exam_links, official_source_title,
  official_source_url, application_url, source_kind, verification_status,
  last_official_check
) values
  ('pm-fasal-bima-yojana', 'Pradhan Mantri Fasal Bima Yojana', 'Ministry of Agriculture & Farmers Welfare', 'Agriculture, Rural & Environment', 'central',
   'A crop-insurance framework intended to help farmers manage specified crop-loss risks.', 'Farmers growing notified crops in notified areas, subject to seasonal and state implementation conditions.',
   'Insurance support is governed by the notified crop, area, season and operational guidelines.', 'A recurring prelims topic for crop insurance, agricultural risk, Centre–State implementation and farmer welfare.', '["Agriculture", "Economy", "Rural development"]'::jsonb, 'PMFBY official portal', 'https://pmfby.gov.in/', 'https://pmfby.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('soil-health-card-scheme', 'Soil Health Card Scheme', 'Ministry of Agriculture & Farmers Welfare', 'Agriculture, Rural & Environment', 'central',
   'A soil-testing and advisory initiative that provides nutrient-status information to support balanced fertiliser use.', 'Farmers whose soil samples are tested through the scheme system.',
   'The card reports soil parameters and supports crop-specific nutrient advice.', 'Useful for sustainable agriculture, fertiliser efficiency, soil conservation and extension services.', '["Agriculture", "Environment", "Sustainable development"]'::jsonb, 'Soil Health Card official portal', 'https://soilhealth.dac.gov.in/', 'https://soilhealth.dac.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-krishi-sinchayee-yojana', 'Pradhan Mantri Krishi Sinchayee Yojana', 'Ministry of Jal Shakti / Ministry of Agriculture & Farmers Welfare', 'Agriculture, Rural & Environment', 'central',
   'A programme umbrella for improving water-use efficiency, irrigation coverage and water conservation in agriculture.', 'Farmers and implementing areas covered through the programme components and state plans.',
   'Implementation and benefits vary by component and notified local programme.', 'Frequently tested with micro-irrigation, watershed development, irrigation efficiency and the “more crop per drop” theme.', '["Agriculture", "Water resources", "Environment"]'::jsonb, 'PMKSY official portal', 'https://pmksy.gov.in/', 'https://pmksy.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('national-food-security-act-pds', 'National Food Security Act and Targeted Public Distribution System', 'Department of Food & Public Distribution', 'Social Welfare & Empowerment', 'central',
   'A rights-based food-security framework implemented through the Targeted Public Distribution System.', 'Eligible households identified under the Act and state-level implementation rules.',
   'Entitlements and delivery mechanisms operate through statutory and operational provisions.', 'Important for food security, welfare rights, ration delivery, nutrition and federal implementation questions.', '["Polity", "Social welfare", "Economy"]'::jsonb, 'Department of Food & Public Distribution', 'https://dfpd.gov.in/', 'https://dfpd.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('deendayal-antyodaya-yojana-nrlm', 'Deendayal Antyodaya Yojana – National Rural Livelihoods Mission', 'Ministry of Rural Development', 'Agriculture, Rural & Environment', 'central',
   'A rural-livelihoods mission that works through community institutions, especially self-help groups.', 'Rural households and community institutions reached through state rural-livelihood missions.',
   'Support includes institution building, livelihoods and financial inclusion pathways under the mission framework.', 'Useful for SHGs, women-led collectives, rural livelihoods, poverty reduction and financial inclusion.', '["Rural development", "Women and child", "Financial inclusion"]'::jsonb, 'DAY-NRLM official portal', 'https://nrlm.gov.in/', 'https://nrlm.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('ddu-gky', 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana', 'Ministry of Rural Development', 'Skills & Employment', 'central',
   'A placement-linked skill-development programme for rural youth under the rural development framework.', 'Eligible rural youth, subject to programme and state implementation conditions.',
   'Training and placement support are delivered through approved partners and programme rules.', 'Relevant to rural development, skills, employment and youth-policy questions.', '["Skills", "Employment", "Rural development"]'::jsonb, 'DDU-GKY official portal', 'https://ddugky.info/', 'https://ddugky.info/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('national-social-assistance-programme', 'National Social Assistance Programme', 'Ministry of Rural Development', 'Social Welfare & Empowerment', 'central',
   'A social-assistance framework supporting eligible vulnerable people through pension and related assistance components.', 'Eligible older persons, widows, persons with disabilities and bereaved households under component rules.',
   'Benefits are delivered through the relevant component and state implementation arrangements.', 'Important for social security, vulnerable groups, Centre–State welfare delivery and poverty questions.', '["Social welfare", "Rural development", "Governance"]'::jsonb, 'NSAP official portal', 'https://nsap.nic.in/', 'https://nsap.nic.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('mission-indradhanush', 'Mission Indradhanush', 'Ministry of Health & Family Welfare', 'Health & Wellness', 'central',
   'An immunisation initiative focused on reaching children and pregnant women who are missed or partially covered by routine immunisation.', 'Children and pregnant women in target areas, through the national immunisation programme.',
   'The mission strengthens routine immunisation outreach rather than replacing it.', 'Often tested with public health, vaccination coverage, maternal and child health and mission-mode delivery.', '["Health", "Children", "Public policy"]'::jsonb, 'National Health Mission', 'https://nhm.gov.in/', 'https://nhm.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('poshan-abhiyan', 'POSHAN Abhiyaan', 'Ministry of Women & Child Development', 'Women & Child', 'central',
   'A nutrition mission that brings together multiple sectors to address malnutrition and improve nutrition outcomes.', 'Women, children and adolescents reached through the nutrition-service framework.',
   'The mission emphasises convergence, monitoring and behaviour change alongside service delivery.', 'Useful for nutrition, women and child development, health indicators and convergence in governance.', '["Nutrition", "Women and child", "Health"]'::jsonb, 'Ministry of Women & Child Development', 'https://wcd.gov.in/', 'https://wcd.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-ujjwala-yojana', 'Pradhan Mantri Ujjwala Yojana', 'Ministry of Petroleum & Natural Gas', 'Women & Child', 'central',
   'A clean-cooking-fuel programme centred on LPG connections for eligible households.', 'Eligible adult women from households identified under the scheme criteria.',
   'Eligibility and current support must be checked on the official programme portal before applying.', 'High-value for women’s empowerment, health, clean energy, welfare targeting and subsidy questions.', '["Women and child", "Health", "Energy"]'::jsonb, 'PMUY official portal', 'https://www.pmuy.gov.in/', 'https://www.pmuy.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('swachh-bharat-mission-gramin', 'Swachh Bharat Mission – Gramin', 'Department of Drinking Water & Sanitation', 'Utility & Sanitation', 'central',
   'A rural sanitation mission focused on sanitation outcomes, solid and liquid waste management and sustained behaviour change.', 'Rural communities and local bodies through state and district implementation.',
   'Support and activities are governed through mission components and implementation guidelines.', 'Relevant to sanitation, public health, rural governance, behaviour change and Sustainable Development Goals.', '["Sanitation", "Rural development", "Health"]'::jsonb, 'Swachh Bharat Mission Grameen official portal', 'https://swachhbharatmission.ddws.gov.in/', 'https://swachhbharatmission.ddws.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-awas-yojana-urban', 'Pradhan Mantri Awas Yojana – Urban', 'Ministry of Housing & Urban Affairs', 'Housing & Shelter', 'central',
   'An urban-housing mission providing assistance under notified housing components and eligibility conditions.', 'Eligible urban households as defined by the programme and local implementation.',
   'Benefits differ by component, beneficiary category and applicable scheme guidelines.', 'Useful for urbanisation, housing policy, inclusive cities and Centre–State–ULB implementation.', '["Urban development", "Housing", "Social welfare"]'::jsonb, 'PMAY-U official portal', 'https://pmay-urban.gov.in/', 'https://pmay-urban.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-mudra-yojana', 'Pradhan Mantri MUDRA Yojana', 'Department of Financial Services, Ministry of Finance', 'Banking, Financial Services & Insurance', 'central',
   'A credit-support framework for eligible non-corporate, non-farm micro and small enterprises through lending institutions.', 'Eligible micro and small business borrowers, subject to lender and scheme conditions.',
   'MUDRA loans are delivered through participating financial institutions and the programme’s product categories.', 'A core exam topic for financial inclusion, MSMEs, credit delivery and entrepreneurship.', '["Economy", "Banking", "MSMEs"]'::jsonb, 'MUDRA official portal', 'https://www.mudra.org.in/', 'https://www.mudra.org.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('stand-up-india', 'Stand-Up India', 'Department of Financial Services, Ministry of Finance', 'Business & Entrepreneurship', 'central',
   'A bank-loan facilitation programme for eligible women and Scheduled Caste or Scheduled Tribe entrepreneurs setting up greenfield enterprises.', 'Eligible women and SC/ST entrepreneurs, subject to the scheme and lender conditions.',
   'The official platform provides eligibility and application-routing information.', 'Useful for inclusive entrepreneurship, credit access, social justice and financial inclusion.', '["Economy", "Entrepreneurship", "Social justice"]'::jsonb, 'Stand-Up India official portal', 'https://www.standupmitra.in/', 'https://www.standupmitra.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-employment-generation-programme', 'Prime Minister’s Employment Generation Programme', 'Ministry of Micro, Small & Medium Enterprises', 'Business & Entrepreneurship', 'central',
   'A credit-linked subsidy programme intended to support new micro-enterprises in the non-farm sector.', 'Eligible prospective entrepreneurs and institutions, subject to programme conditions.',
   'The scheme is implemented through designated agencies and participating banks.', 'Useful for MSMEs, employment generation, credit-linked subsidy and rural–urban enterprise policy.', '["MSMEs", "Employment", "Entrepreneurship"]'::jsonb, 'PMEGP official portal', 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp', 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pradhan-mantri-kaushal-vikas-yojana', 'Pradhan Mantri Kaushal Vikas Yojana', 'Ministry of Skill Development & Entrepreneurship', 'Skills & Employment', 'central',
   'A skills-training programme under the national skills-development ecosystem.', 'Eligible candidates seeking short-term skill training or recognition of prior learning, subject to current programme rules.',
   'Training options and eligibility must be checked through the official skills ecosystem.', 'Relevant to skills, employment, demographic dividend and labour-market policy.', '["Skills", "Employment", "Education"]'::jsonb, 'Skill India Digital official portal', 'https://www.skillindiadigital.gov.in/', 'https://www.skillindiadigital.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('beti-bachao-beti-padhao', 'Beti Bachao Beti Padhao', 'Ministry of Women & Child Development', 'Women & Child', 'central',
   'A national initiative addressing gender bias and supporting the value, protection and education of the girl child.', 'Communities and institutions reached through the programme’s awareness and convergence approach.',
   'It is primarily an advocacy and convergence initiative; students should distinguish it from a direct cash-transfer scheme.', 'Frequently used in exam questions on sex ratio, gender equality, women and child policy and behavioural change.', '["Women and child", "Social justice", "Governance"]'::jsonb, 'Ministry of Women & Child Development', 'https://wcd.gov.in/', 'https://wcd.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('sukanya-samriddhi-account', 'Sukanya Samriddhi Account', 'Department of Economic Affairs, Ministry of Finance', 'Banking, Financial Services & Insurance', 'central',
   'A small-savings account designed for the girl child under the Government Savings Promotion framework.', 'Eligible girl children and their guardians under the account rules.',
   'Account limits, interest rate and withdrawal rules are notified by the government and can change.', 'Important for small savings, financial inclusion, women and child welfare and public-finance questions.', '["Economy", "Women and child", "Banking"]'::jsonb, 'National Savings Institute', 'https://www.nsiindia.gov.in/', 'https://www.nsiindia.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('pm-ajay', 'Pradhan Mantri Anusuchit Jaati Abhyuday Yojana', 'Ministry of Social Justice & Empowerment', 'Social Welfare & Empowerment', 'central',
   'An umbrella programme for the socio-economic development of Scheduled Castes through its notified components.', 'Scheduled Caste communities and eligible beneficiaries under component guidelines.',
   'Benefits and delivery vary across programme components and implementing authorities.', 'High-value for social justice, affirmative action, targeted development and welfare-policy questions.', '["Social justice", "Governance", "Social welfare"]'::jsonb, 'Ministry of Social Justice & Empowerment', 'https://socialjustice.gov.in/', 'https://socialjustice.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('smile-scheme', 'SMILE – Support for Marginalized Individuals for Livelihood and Enterprise', 'Ministry of Social Justice & Empowerment', 'Social Welfare & Empowerment', 'central',
   'An umbrella scheme focused on rehabilitation, welfare and livelihood support for specified marginalised groups.', 'Eligible transgender persons and persons engaged in begging under the scheme’s components and guidelines.',
   'The scheme covers separate components and relies on implementation partnerships across levels of government.', 'Useful for social justice, inclusion, rehabilitation policy and welfare-programme architecture.', '["Social justice", "Social welfare", "Governance"]'::jsonb, 'National Portal of India – SMILE', 'https://www.india.gov.in/', 'https://www.india.gov.in/', 'official_catalogue', 'official_source_checked', date '2026-09-07')
on conflict (slug) do update set
  name = excluded.name, ministry = excluded.ministry, category = excluded.category,
  government_level = excluded.government_level, what_it_is = excluded.what_it_is,
  who_it_is_for = excluded.who_it_is_for, benefit_summary = excluded.benefit_summary,
  why_it_matters = excluded.why_it_matters, exam_links = excluded.exam_links,
  official_source_title = excluded.official_source_title, official_source_url = excluded.official_source_url,
  application_url = excluded.application_url, source_kind = excluded.source_kind,
  verification_status = excluded.verification_status, last_official_check = excluded.last_official_check,
  updated_at = now();
