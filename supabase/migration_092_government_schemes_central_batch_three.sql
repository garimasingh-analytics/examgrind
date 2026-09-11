-- Central scheme catalogue: science, technology, energy, urban development and environment.

insert into public.government_schemes (
  slug, name, ministry, category, government_level, what_it_is, who_it_is_for,
  benefit_summary, why_it_matters, exam_links, official_source_title,
  official_source_url, application_url, source_kind, verification_status,
  last_official_check
) values
  ('vigyan-dhara', 'Vigyan Dhara', 'Department of Science & Technology', 'Science, IT & Communications', 'central',
   'A unified central-sector scheme for science and technology capacity building, research and development, and innovation or technology deployment.', 'Research institutions, higher-education institutions, researchers and innovation stakeholders reached through its components.',
   'Support is delivered through component-specific calls, institutions and programme mechanisms.', 'Important for science policy, research ecosystems, innovation, institutional capacity and the merger of earlier DST umbrella schemes.', '["Science and technology", "Innovation", "Education"]'::jsonb, 'Prime Minister of India – Vigyan Dhara approval', 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-the-department-of-science-and-technology-scheme-namely-vigyan-dhara/', 'https://dst.gov.in/', 'official_catalogue', 'official_source_checked', date '2026-09-07'),
  ('research-development-innovation-scheme', 'Research, Development and Innovation Scheme', 'Department of Science & Technology', 'Science, IT & Communications', 'central',
   'A research and innovation financing scheme intended to catalyse private-sector participation in high-impact and strategic technology development.', 'Eligible project proponents and financing participants under the RDI scheme framework.',
   'Support can use long-term financing, equity support and the notified fund-management structure; it is not a general student grant.', 'Useful for deep tech, innovation finance, strategic technology, self-reliance and research-policy questions.', '["Science and technology", "Economy", "Innovation"]'::jsonb, 'Department of Science & Technology – RDI Scheme', 'https://dst.gov.in/rdi-scheme/research-development-and-innovation-rdi-cell', 'https://dst.gov.in/rdi-scheme/research-development-and-innovation-rdi-cell', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('atal-innovation-mission', 'Atal Innovation Mission', 'NITI Aayog', 'Science, IT & Communications', 'central',
   'A national innovation initiative that supports an innovation culture, problem solving and entrepreneurship through its notified programmes.', 'Students, schools, innovators, startups and institutions reached through AIM programmes.',
   'AIM support varies by programme, such as innovation spaces, challenges and incubation pathways.', 'A common question area for NITI Aayog, startup ecosystems, school innovation and entrepreneurship policy.', '["Innovation", "Governance", "Education"]'::jsonb, 'Atal Innovation Mission official portal', 'https://aim.gov.in/', 'https://aim.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('pm-kusum', 'PM-KUSUM', 'Ministry of New and Renewable Energy', 'Agriculture, Rural & Environment', 'central',
   'A renewable-energy programme that includes components for decentralised solar generation, solar pumps and solarisation of eligible agricultural pumps.', 'Farmers and implementing entities under the relevant component and state implementation rules.',
   'Benefits and subsidy patterns differ by component, state and current programme guidelines.', 'Useful for solar energy, agriculture, energy transition, irrigation and decentralised renewable generation.', '["Environment", "Agriculture", "Energy"]'::jsonb, 'Ministry of New and Renewable Energy', 'https://mnre.gov.in/', 'https://mnre.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('pm-surya-ghar-muft-bijli-yojana', 'PM Surya Ghar: Muft Bijli Yojana', 'Ministry of New and Renewable Energy', 'Utility & Sanitation', 'central',
   'A rooftop-solar programme that provides a national framework for household rooftop solar adoption.', 'Eligible residential consumers, subject to the current portal, subsidy and installation conditions.',
   'The official portal provides the current application path, subsidy process and participating-discom information.', 'High-value for renewable energy, household solar, climate policy, subsidies and energy transition.', '["Environment", "Energy", "Economy"]'::jsonb, 'PM Surya Ghar official portal', 'https://www.pmsuryaghar.gov.in/', 'https://www.pmsuryaghar.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07'),
  ('atal-mission-rejuvenation-urban-transformation', 'Atal Mission for Rejuvenation and Urban Transformation', 'Ministry of Housing & Urban Affairs', 'Transport & Infrastructure', 'central',
   'An urban-development mission focused on water supply, sewerage and septage management, green spaces and urban transport planning.', 'Cities and urban local bodies selected or covered through the mission framework.',
   'The mission funds approved urban infrastructure and reform-related activities under its guidelines.', 'Important for urbanisation, municipal governance, infrastructure, water services and sustainable cities.', '["Urban development", "Governance", "Infrastructure"]'::jsonb, 'Ministry of Housing & Urban Affairs', 'https://mohua.gov.in/', 'https://mohua.gov.in/', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('national-mission-green-india', 'National Mission for a Green India', 'Ministry of Environment, Forest & Climate Change', 'Agriculture, Rural & Environment', 'central',
   'A climate-action mission focused on enhancing forest and tree cover, ecosystem services and climate resilience.', 'Implementing states, local communities and landscapes covered through approved mission activities.',
   'It is one of the national missions connected with India’s climate-action framework.', 'Useful for climate change, forests, ecosystem services, carbon sinks and the National Action Plan on Climate Change.', '["Environment", "Climate change", "Forests"]'::jsonb, 'Ministry of Environment, Forest & Climate Change', 'https://moef.gov.in/national-action-plan-on-climate-change', 'https://moef.gov.in/national-action-plan-on-climate-change', 'ministry_portal', 'official_source_checked', date '2026-09-07'),
  ('digital-india', 'Digital India', 'Ministry of Electronics & Information Technology', 'Science, IT & Communications', 'central',
   'A flagship programme for digital infrastructure, digital delivery of services and digital empowerment.', 'Citizens, public institutions, businesses and service-delivery systems reached through its multiple initiatives.',
   'It is an umbrella digital-governance programme rather than one single beneficiary cash scheme.', 'Frequently tested for e-governance, digital public infrastructure, connectivity and digital inclusion.', '["Digital governance", "Science and technology", "Governance"]'::jsonb, 'Digital India official portal', 'https://www.digitalindia.gov.in/', 'https://www.digitalindia.gov.in/', 'programme_portal', 'official_source_checked', date '2026-09-07')
on conflict (slug) do update set
  name = excluded.name, ministry = excluded.ministry, category = excluded.category,
  government_level = excluded.government_level, what_it_is = excluded.what_it_is,
  who_it_is_for = excluded.who_it_is_for, benefit_summary = excluded.benefit_summary,
  why_it_matters = excluded.why_it_matters, exam_links = excluded.exam_links,
  official_source_title = excluded.official_source_title, official_source_url = excluded.official_source_url,
  application_url = excluded.application_url, source_kind = excluded.source_kind,
  verification_status = excluded.verification_status, last_official_check = excluded.last_official_check,
  updated_at = now();
