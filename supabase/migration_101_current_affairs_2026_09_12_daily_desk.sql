-- 12 September 2026 daily current-affairs desk.
-- Original briefs on late primary official releases identified after the previous desk cutoff.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-12-trai-tv-advertisement-qos-repeal',
  '2026-09-12',
  'TRAI repeals its television-advertisement duration QoS regulations',
  'TRAI has issued the Standards of Quality of Service (Duration of Advertisements in Television Channels) (Repealing) Regulations, 2026. They repeal the 2012 TRAI regulations and their related orders because the Union government had already removed the connected 12-minute advertisement cap from the Cable Television Networks Rules, 1994.',
  'This is a compact regulator-and-delegated-legislation question. It tests the sequence between a parent-rule change by the Ministry of Information and Broadcasting and TRAI withdrawing the overlapping quality-of-service framework; it does not mean that every broadcasting or consumer-protection rule has disappeared.',
  'The 2012 TRAI regulations had set a quality-of-service framework around the advertisement-duration ceiling: no more than 12 minutes of advertisements in one clock hour of a television programme. That ceiling came from Rule 7(11) of the Cable Television Networks Rules, 1994. MIB omitted Rule 7(11) through an Official Gazette notification on 21 August 2026. TRAI therefore repealed its corresponding 2012 regulations and associated orders, effective from notification of the 2026 repealing regulations in the Official Gazette.',
  'TRAI releases The Standards of Quality of Service (Duration of Advertisements in Television Channels) (Repealing) Regulations, 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308872&reg=3&lang=1',
  'Telecom Regulatory Authority of India / Press Information Bureau',
  '2026-09-10',
  '["The 2026 TRAI repealing regulations withdraw the 2012 Standards of Quality of Service (Duration of Advertisements in Television Channels) Regulations and related orders.", "The earlier framework was linked to the 12-minute advertisement ceiling in a clock hour under Rule 7(11) of the Cable Television Networks Rules, 1994.", "MIB omitted Rule 7(11) through an Official Gazette notification dated 21 August 2026.", "The TRAI repeal takes effect from notification of the 2026 repealing regulations in the Official Gazette."]'::jsonb,
  '[{"question":"Which provision had contained the earlier 12-minute television advertisement ceiling?","answer":"Rule 7(11) of the Cable Television Networks Rules, 1994."},{"question":"Did TRAI repeal the 2012 framework before or after MIB omitted the underlying Rule 7(11) cap?","answer":"After: MIB omitted the cap on 21 August 2026, and TRAI then repealed the corresponding 2012 regulations."}]'::jsonb,
  '{"title":"Why the 2012 TRAI framework was repealed","steps":["Rule 7(11) of the Cable Television Networks Rules set a 12-minute hourly advertisement ceiling.","TRAI''s 2012 QoS regulations monitored and enforced the connected broadcasting standard.","MIB omitted Rule 7(11) through an Official Gazette notification.","TRAI repealed its now-inconsistent 2012 regulations and related orders in 2026."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-proposed-stronger-seed-act-consultation',
  '2026-09-12',
  'Farmers consulted on proposed Seed Act with traceability and compensation safeguards',
  'The Ministry of Agriculture and Farmers Welfare has resumed nationwide consultation on a proposed stronger Seed Act. The proposal aims to modernise the Seeds Act, 1966 framework through measures such as commercial-seed registration, QR-based traceability, stronger penalties, State-level variety-release roles and Seed Security Funds.',
  'This is an agriculture-governance and legislative-process item. The exam-safe fact is that the measures are proposals under consultation—not enacted law, and not rules currently binding on all seed sellers. The static link is the existing Seeds Act, 1966 and the Seeds (Control) Order, 1983.',
  'The Ministry says the 2025 draft consultation received about 18,000 suggestions and that a further consultation involved roughly 20 farmer organisations. Its proposed approach includes a national register for commercial seeds and planting material, QR codes to trace origin, manufacturer, laboratory clearance and movement, and State Seed Security Funds funded from penalties and recoveries. It also states that traditional and farmers'' seed varieties would not face compulsory registration, while the final draft remains subject to continuing stakeholder consultation and has no fixed deadline.',
  'Shri Shivraj Singh Chouhan Engages Farmer Leaders Nationwide on Proposed Stronger Seed Act',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308922&reg=3&lang=1',
  'Ministry of Agriculture and Farmers Welfare / Press Information Bureau',
  '2026-09-10',
  '["The consultation concerns a proposed stronger Seed Act; it has not yet become an enacted law.", "The existing framework cited by the Ministry includes the Seeds Act, 1966 and the Seeds (Control) Order, 1983.", "The proposal envisages registration and QR-based traceability for commercial seeds and planting material, while traditional and farmers'' varieties would not require compulsory registration.", "The proposed Seed Security Fund in each State would receive penalties and recoveries; the official release says consultations continue and no finalisation deadline has been fixed."]'::jsonb,
  '[{"question":"Has the proposed stronger Seed Act already replaced the Seeds Act, 1966?","answer":"No. The Ministry describes it as a proposal under continuing consultation, with no fixed deadline for finalising the law."},{"question":"What is the proposed purpose of QR codes on commercial seed packets?","answer":"To enable end-to-end traceability, including the seed''s origin, manufacturer, laboratory clearance and movement through the supply chain."}]'::jsonb,
  '{"title":"From consultation to a possible new seed law","steps":["The Seeds Act, 1966 and Seeds (Control) Order, 1983 form the existing cited framework.","The Ministry gathers suggestions from farmers and other stakeholders on a proposed stronger law.","The proposal includes commercial-seed registration, QR traceability, State roles and Seed Security Funds.","Only after the draft is finalised and enacted could a new statutory framework replace or amend the existing one."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-fra-southern-states-regional-review',
  '2026-09-12',
  'MoTA begins regional review of Forest Rights Act implementation',
  'The Ministry of Tribal Affairs held its first regional review conference on the Forest Rights Act, 2006 in Bengaluru with Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telangana. The participating States were asked to work to State-specific timelines for pending claims, Community Forest Resource Rights, PVTG habitat rights and entry of recognised rights in official records.',
  'The item connects tribal rights, land records and federal implementation. In a prelims question, distinguish Individual Forest Rights (IFR), Community Forest Rights (CFR) and Community Forest Resource Rights; do not confuse a review conference and proposed digital improvements with a newly enacted amendment to the FRA.',
  'The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 recognises forest rights through a statutory claims process. MoTA reported that, by 30 June 2026, more than 54 lakh IFR claims had been received nationally, about 25.42 lakh titles had been distributed over nearly 238 lakh acres, more than 10 lakh claims remained pending and 19,845 CFRs had been recognised. The Ministry asked the five Southern States to reconcile pending and rejected claims, recognise Community Forest Resource and PVTG habitat rights, update revenue and forest records, and prepare time-bound roadmaps.',
  'First Regional Review Conference on Implementation of the Forest Rights Act Held in Bengaluru',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308882&lang=1&reg=3',
  'Ministry of Tribal Affairs / Press Information Bureau',
  '2026-09-10',
  '["The review concerned the Forest Rights Act, 2006, formally the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act.", "The first regional review covered Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telangana.", "MoTA called for time-bound work on pending claims, Community Forest Resource Rights, PVTG habitat rights and recording recognised rights in revenue and forest records.", "As of 30 June 2026, the Ministry reported more than 54 lakh IFR claims received and 19,845 Community Forest Rights recognised nationally."]'::jsonb,
  '[{"question":"Which five States participated in the first FRA regional review conference?","answer":"Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telangana."},{"question":"Was a new Forest Rights Act passed at the Bengaluru conference?","answer":"No. It was an implementation review that sought State-specific roadmaps under the existing 2006 Act."}]'::jsonb,
  '{"title":"FRA implementation review","steps":["Claims and titles arise under the Forest Rights Act, 2006.","MoTA reviewed implementation with five Southern States.","Focus areas were pending claims, community and PVTG rights, and land-record entry.","States were asked for time-bound implementation roadmaps."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-social-justice-scholarship-process-reforms',
  '2026-09-12',
  'Social Justice Ministry reports scholarship reach and process reforms',
  'The Department of Social Justice and Empowerment reported scholarship support for more than 1.44 crore Scheduled Caste students and more than 1.01 crore OBC and EBC students, alongside process changes in SHRESHTA, the National Overseas Scholarship and the National Fellowship for Scheduled Castes.',
  'This is a useful social-justice and education-governance revision item. The reported reach figures should be read as programme outcomes; the exam-ready institutional point is the Ministry''s effort to make admissions, verification and grievance handling more time-bound and transparent.',
  'According to the official release, SC Pre-Matric and Post-Matric scholarships have supported over 1.44 crore students with Rs 12,773 crore, while OBC/EBC Pre-Matric and Post-Matric support reached over 1.01 crore students with Rs 2,445.05 crore. The Ministry highlights moving SHRESHTA''s National Entrance Test for Scheme of Residential Education for Students in High Classes in Targeted Areas from May to December, on-the-spot certificate verification under the National Overseas Scholarship from AY 2024-25, and a mandatory seven-day grievance window for the National Fellowship for SC from AY 2025-26.',
  'Over 1.44 crore Scheduled Caste students supported with scholarships amounting to Rs 12,773 crore',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308831&lang=1&reg=3',
  'Ministry of Social Justice and Empowerment / Press Information Bureau',
  '2026-09-10',
  '["The Department of Social Justice and Empowerment reported over 1.44 crore SC scholarship beneficiaries and over 1.01 crore OBC/EBC scholarship beneficiaries.", "The reported assistance was Rs 12,773 crore for SC scholarships and Rs 2,445.05 crore for OBC/EBC scholarships.", "SHRESHTA is the Scheme of Residential Education for Students in High Classes in Targeted Areas; its entrance test was shifted from May to December.", "National Overseas Scholarship verification and National Fellowship for SC grievance handling are among the process reforms highlighted by the Ministry."]'::jsonb,
  '[{"question":"What does SHRESHTA expand to?","answer":"Scheme of Residential Education for Students in High Classes in Targeted Areas."},{"question":"Which two scholarship categories were separately reported in the release?","answer":"Scheduled Caste students, and Other Backward Class/Economically Backward Class students."}]'::jsonb,
  '{"title":"Inclusive-education support","steps":["Pre- and post-matric scholarships provide financial assistance.","SC, OBC and EBC students are covered through distinct programme streams.","SHRESHTA, overseas scholarship and fellowship processes add admissions, verification and grievance mechanisms.","The reforms aim at more timely and accountable delivery."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-brics-india-2026-chairship',
  '2026-09-12',
  'India hosts the 18th BRICS Summit under its 2026 chairship',
  'India is hosting the 18th BRICS Summit in New Delhi on 12–13 September 2026 under the chairship theme “Building for Resilience, Innovation, Cooperation and Sustainability”. The official backgrounder places the summit in the context of BRICS'' expanded 11-member format and its role as a Global South cooperation forum.',
  'BRICS is a recurring international-relations topic. The date, venue, chairship theme and current membership are more valuable for prelims than generic summit language. Keep the grouping distinct from a treaty-based organisation: it is a cooperation forum, not a UN organ.',
  'BRIC emerged from an economic label and became a formal cooperation grouping; South Africa joined in 2010. PIB states that BRICS now has 11 members: Brazil, China, Egypt, Ethiopia, India, Indonesia, Iran, Russia, Saudi Arabia, South Africa and the United Arab Emirates. India''s 2026 summit is its fourth BRICS chairship, with agenda areas spanning development, finance, technology, trade and people-to-people exchanges.',
  'BRICS: Evolution, Cooperation and India''s Leadership',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2308611&lang=1&reg=3',
  'Press Information Bureau',
  '2026-09-10',
  '["India hosts the 18th BRICS Summit in New Delhi on 12–13 September 2026.", "The 2026 chairship theme is Building for Resilience, Innovation, Cooperation and Sustainability.", "BRICS has 11 members, including Egypt, Ethiopia, Indonesia, Iran, Saudi Arabia and the UAE in addition to Brazil, China, India, Russia and South Africa.", "South Africa joined BRIC in 2010, giving the grouping its BRICS name."]'::jsonb,
  '[{"question":"Which country is chairing and hosting the 18th BRICS Summit in 2026?","answer":"India; the summit is in New Delhi on 12–13 September 2026."},{"question":"Name any two of the newer BRICS members listed in the official backgrounder.","answer":"Egypt, Ethiopia, Indonesia, Iran, Saudi Arabia or the United Arab Emirates (any two)."}]'::jsonb,
  '{"title":"BRICS at the 2026 India summit","steps":["BRIC began as a four-country dialogue.","South Africa joined in 2010.","The grouping later expanded to 11 members.","India''s 2026 chairship culminates in the 18th summit in New Delhi."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-pmmsy-six-year-fisheries-update',
  '2026-09-12',
  'PMMSY completes six years with fresh fisheries budget and outcome data',
  'As the Pradhan Mantri Matsya Sampada Yojana completed six years, the Department of Fisheries reported a Rs 2,500 crore Budget Estimate allocation for 2026–27 and updated figures on production, exports, employment and value-chain infrastructure.',
  'PMMSY links agriculture, the blue economy, coastal livelihoods and food processing. It is a central-sector scheme name that may be paired with its outlay, implementing sector and aims; outcome figures illustrate the policy context but should not be mistaken for a new scheme launch.',
  'PMMSY has been implemented since 2020–21 with a total outlay of Rs 20,750 crore. PIB reported fish production rising from 141.64 lakh tonnes in 2019–20 to 197.75 lakh tonnes in 2024–25 and fisheries exports reaching Rs 73,890 crore in 2025–26. It also reported 58 lakh employment opportunities, approvals worth Rs 2,797 crore for cold-chain and marketing infrastructure, and support for 2,195 fisheries farmer producer organisations (FFPOs).',
  'Fueling the Blue Economy: Six Years of Empowering India’s Fisheries Sector under PMMSY',
  'https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159943&id=159943&lang=2&reg=48',
  'Department of Fisheries / Press Information Bureau',
  '2026-09-10',
  '["PMMSY has been implemented since 2020–21 and has a stated total outlay of Rs 20,750 crore.", "The Budget Estimate allocation reported for PMMSY in 2026–27 is Rs 2,500 crore.", "The scheme addresses fisheries and aquaculture production, value-chain infrastructure, livelihoods, welfare and management.", "FFPO stands for fisheries farmer producer organisation in the official release."]'::jsonb,
  '[{"question":"Which sector is covered by Pradhan Mantri Matsya Sampada Yojana?","answer":"Fisheries and aquaculture, including related infrastructure and livelihoods."},{"question":"What was PMMSY''s reported total outlay?","answer":"Rs 20,750 crore."}]'::jsonb,
  '{"title":"PMMSY and the fisheries value chain","steps":["Fisheries and aquaculture need production and productivity support.","PMMSY funds infrastructure, cold chain and marketing.","The scheme also targets livelihoods, exports, welfare and management.","These elements contribute to the blue-economy policy framework."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-bee-commercial-electric-cooking-directory',
  '2026-09-12',
  'BEE opens vendor-directory process for commercial electric cooking',
  'The Bureau of Energy Efficiency is inviting registration for a Go Electric Commercial Electric Cooking Vendor Directory, intended to help institutional and commercial kitchens identify providers. BEE also says it is working with the Bureau of Indian Standards on a standards-and-labelling framework for commercial induction hobs.',
  'This is an energy-efficiency institution question. The release announces a directory-registration process and standards work—not a completed mandatory label or a nationwide ban on LPG. It is a good way to recall BEE''s statutory origin and its regulatory as well as promotional role.',
  'The Ministry of Power release frames commercial electric cooking as a way to combine efficient energy use, energy security and sustainability. BEE was established on 1 March 2002 under the Energy Conservation Act, 2001. Its proposed public directory would list credible manufacturers, distributors, system integrators and solution providers for hotels, restaurants, canteens, hospitals and other institutions; its work with BIS concerns a future standards-and-labelling framework for commercial induction hobs.',
  'BEE Showcases Commercial Electric Cooking Solutions to Accelerate India’s Transition from LPG to Electricity',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308878&lang=2&reg=48',
  'Bureau of Energy Efficiency, Ministry of Power / Press Information Bureau',
  '2026-09-10',
  '["BEE is inviting registrations for the Go Electric Commercial Electric Cooking Vendor Directory.", "The directory is intended for commercial and institutional-kitchen users to find credible providers.", "BEE is working with BIS on a standards-and-labelling framework for commercial induction hobs; the release does not say that framework is already final.", "BEE was established under the Energy Conservation Act, 2001, on 1 March 2002."]'::jsonb,
  '[{"question":"Which two institutions are involved in the proposed standards-and-labelling work for commercial induction hobs?","answer":"The Bureau of Energy Efficiency and the Bureau of Indian Standards."},{"question":"Is the Go Electric Commercial Electric Cooking Vendor Directory a consumer subsidy scheme?","answer":"No. It is a proposed public directory to help users identify credible commercial e-cooking providers."}]'::jsonb,
  '{"title":"Commercial e-cooking ecosystem","steps":["BEE promotes efficient energy use under the Energy Conservation Act framework.","Providers register for a public commercial e-cooking directory.","Institutional kitchens can use the directory to identify suppliers and integrators.","BEE and BIS are developing a future standards-and-labelling framework for induction hobs."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-asean-india-agriculture-ministerial-meeting',
  '2026-09-12',
  'ASEAN–India agriculture meeting sets resilient-food-system priorities',
  'The ninth ASEAN–India Ministerial Meeting on Agriculture and Forestry met in New Delhi on 9 September and reaffirmed cooperation on food security, sustainable and low-emission agriculture, digital innovation and resilient supply chains. The next ministerial meeting is to be convened in 2028.',
  'This is an international-relations item with direct links to food security, climate adaptation and agricultural technology. The meeting is part of the ASEAN–India Comprehensive Strategic Partnership; it is not a new free-trade agreement or a new Indian farm scheme.',
  'The meeting considered climate change, extreme weather, input-market volatility, trade and logistics disruptions, and transboundary pests and animal diseases. It drew direction from the ASEAN food, agriculture and forestry sectoral plan for 2026–2030 and referenced prior ASEAN–India initiatives such as the 2023 millet festivals and the 2024 ASEAN–India Fellowship for Higher Education in Agriculture and Allied Sciences, which provides 50 Master''s fellowships over five years.',
  '9th ASEAN–India Ministerial Meeting Reaffirms Commitment to Food Security, Sustainable Agriculture and Resilient Value Chains',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2308621&lang=1&reg=3',
  'Ministry of Agriculture and Farmers Welfare / Press Information Bureau',
  '2026-09-10',
  '["The ninth ASEAN–India Ministerial Meeting on Agriculture and Forestry was held in New Delhi on 9 September 2026.", "The cooperation is framed within the ASEAN–India Comprehensive Strategic Partnership.", "Priority themes include food security, climate-resilient and low-emission agriculture, digital innovation and resilient value chains.", "The tenth ASEAN–India agriculture and forestry ministerial meeting is to be convened in 2028."]'::jsonb,
  '[{"question":"Which Indian partnership framework contextualises the ninth ASEAN–India agriculture and forestry ministerial meeting?","answer":"The ASEAN–India Comprehensive Strategic Partnership."},{"question":"When is the tenth ASEAN–India Ministerial Meeting on Agriculture and Forestry to be convened?","answer":"In 2028."}]'::jsonb,
  '{"title":"ASEAN–India agriculture cooperation","steps":["Agriculture and forestry cooperation sits within the Comprehensive Strategic Partnership.","Shared risks include climate impacts, input volatility, logistics disruption and transboundary pests.","Cooperation focuses on sustainable production, innovation and food security.","The 2026–2030 ASEAN sectoral plan provides regional direction."]}'::jsonb,
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

insert into public.current_affairs_exam_tags (brief_id, exam_id)
select briefs.id, exams.id
from public.current_affairs_briefs briefs
cross join public.exams exams
where briefs.slug in (
  '2026-09-12-trai-tv-advertisement-qos-repeal',
  '2026-09-12-proposed-stronger-seed-act-consultation',
  '2026-09-12-fra-southern-states-regional-review',
  '2026-09-12-social-justice-scholarship-process-reforms',
  '2026-09-12-brics-india-2026-chairship',
  '2026-09-12-pmmsy-six-year-fisheries-update',
  '2026-09-12-bee-commercial-electric-cooking-directory',
  '2026-09-12-asean-india-agriculture-ministerial-meeting'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
