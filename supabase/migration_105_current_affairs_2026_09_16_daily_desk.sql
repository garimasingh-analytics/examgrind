-- 16 September 2026 daily current-affairs desk.
-- Ten original briefs, verified against competent official releases published on 15 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-16-kishau-multipurpose-project-agreement', '2026-09-16',
  'Six States sign the Kishau Multipurpose Project agreement',
  'Uttar Pradesh, Uttarakhand, Himachal Pradesh, Rajasthan, Delhi and Haryana signed the Kishau Project agreement for a National Project on the Tons River along the Uttarakhand-Himachal Pradesh border. The official record gives the proposed concrete gravity dam a height of 232.6 metres and storage of 1,562 million cubic metres.',
  'This is a concrete inter-State water-governance development. For exams, keep separate the project agreement, the proposed dam and later construction or benefits; signing an agreement does not mean the dam is already complete.',
  'The project lies in the Yamuna basin. The release says the Union Government will bear about 90% of the financial burden and participating States the remaining 10%; it also reports proposed irrigation of 97,000 hectares and 1,476 million units of clean hydropower.',
  'CMs sign the Kishau Project agreement',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310528&lang=1&reg=3',
  'Ministry of Home Affairs / Press Information Bureau', '2026-09-15',
  '["The Kishau Project is on the Tons River along the Uttarakhand-Himachal Pradesh border.","The agreement was signed by six States: UP, Uttarakhand, Himachal Pradesh, Rajasthan, Delhi and Haryana.","It is declared a National Project; the stated funding split is about 90% Union and 10% participating States.","Agreement, construction and commissioning are distinct project stages."]'::jsonb,
  '[{"question":"Which river is associated with the Kishau Project?","answer":"The Tons River, in the Yamuna basin."},{"question":"Does signing the agreement mean the project is already commissioned?","answer":"No. It records agreement; construction and commissioning are separate stages."}]'::jsonb,
  '{"title":"Kishau project chain","steps":["Six States reach agreement.","The National Project framework fixes shared financing.","A dam is proposed on the Tons River.","Irrigation, hydropower and river-flow benefits depend on implementation."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-pension-sakhis-day-nrlm-pfrda', '2026-09-16',
  'DAY-NRLM and PFRDA create a Pension Sakhi outreach model',
  'The Department of Rural Development and the Pension Fund Regulatory and Development Authority signed an MoU to create Pension Sakhis: a community-based pension-awareness, enrolment and post-enrolment support mechanism in rural India. It will use the women-led DAY-NRLM institutional network, including BC Sakhis and trained community resource persons.',
  'The item connects financial inclusion with social security. Remember that PFRDA regulates the pension sector, while DAY-NRLM supplies a rural community network; Pension Sakhis are facilitators, not pension fund managers.',
  'DAY-NRLM is the Deendayal Antyodaya Yojana–National Rural Livelihoods Mission. The release identifies SHG members, rural women and Lakhpati Didis among the intended reach, especially where access to formal retirement advice is limited.',
  'Pension Sakhis to Take Retirement Security to the Doorstep of Rural India',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310300&lang=1&reg=3',
  'Ministry of Rural Development / Press Information Bureau', '2026-09-15',
  '["The MoU is between the Department of Rural Development and PFRDA.","Pension Sakhis will use the DAY-NRLM community network.","Their stated roles include awareness, financial literacy, enrolment facilitation and post-enrolment support.","PFRDA is the pension-sector regulator; a Sakhi is a community facilitator, not a regulator."]'::jsonb,
  '[{"question":"Which regulator partnered with Rural Development for Pension Sakhis?","answer":"The Pension Fund Regulatory and Development Authority (PFRDA)."},{"question":"Which mission''s community network will be used?","answer":"DAY-NRLM, the Deendayal Antyodaya Yojana–National Rural Livelihoods Mission."}]'::jsonb,
  '{"title":"Pension Sakhi model","steps":["PFRDA supplies pension-system expertise.","DAY-NRLM supplies women-led community institutions.","Pension Sakhis provide local awareness and enrolment assistance.","Households receive continuing retirement-security support."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-drdo-vimarsh-industry-frameworks', '2026-09-16',
  'DRDO launches industry-facing frameworks at VIMARSH',
  'At the VIMARSH DRDO-Industry Synergy Meet, the Defence Ministry announced a framework intended to lower technical and financial entry barriers for MSMEs and deep-tech start-ups, with funding, incubation and access to DRDO testing facilities. It also launched a standardised secure framework for sharing DRDO-developed software source code with licensee industries.',
  'This is a defence-industrial-policy development. The key distinction is between technology transfer or licensed access and open publication of source code: the stated framework is secure and for licensee industries.',
  'The release also records nine licensing agreements for transfer of technology handed to 13 manufacturing partners. DRDO is the defence R&D organisation; MSMEs and start-ups are being positioned as suppliers and innovators in the defence production chain.',
  'VIMARSH DRDO-Industry Synergy Meet policy initiatives',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310384&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau', '2026-09-15',
  '["The initiatives were announced at the VIMARSH DRDO-Industry Synergy Meet.","The MSME/start-up framework includes funding, incubation and testing-facility access.","The software-source-code framework is standardised, secure and for licensee industries.","Nine technology-transfer licensing agreements went to 13 manufacturing partners."]'::jsonb,
  '[{"question":"Does the source-code framework mean DRDO software is released openly to everyone?","answer":"No. It is a secure framework for licensee industries."},{"question":"Name one support route mentioned for eligible defence MSMEs and start-ups.","answer":"Direct funding, incubation support or access to DRDO testing facilities."}]'::jsonb,
  '{"title":"Defence innovation pathway","steps":["DRDO develops technologies.","Frameworks reduce entry barriers for industry.","Licensees receive governed technology or software access.","Industry manufacturing supports defence capability."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-sprout-climate-resilient-crop-facility', '2026-09-16',
  'BRIC-NIPGR inaugurates the SPROUT crop-phenotyping facility',
  'The indigenous SPROUT facility at BRIC-National Institute of Plant Genome Research was inaugurated to support high-throughput phenotyping, precision stress screening and evaluation of crop material in controlled environments. Its expansion is SpeedSeed Phenotyping and Resource Optimization for Unified Trait Analysis.',
  'This is a science-and-agriculture item: it links genomics and genome editing to phenotype testing and crop improvement under variable environmental conditions. It is a research facility, not a newly released crop variety.',
  'The release describes a major focus on chickpea and says SpeedSeed can reduce its generation cycle to around 40 days. It places climate-resilient agriculture among strategic sectors of the BioE3 policy.',
  'Indigenous SPROUT Facility at BRIC-NIPGR',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310460&lang=1&reg=3',
  'Ministry of Science and Technology / Press Information Bureau', '2026-09-15',
  '["SPROUT expands to SpeedSeed Phenotyping and Resource Optimization for Unified Trait Analysis.","The facility is at BRIC-NIPGR in New Delhi.","It supports controlled-environment phenotyping and stress screening.","The release identifies chickpea as a major focus and BioE3 as the policy context."]'::jsonb,
  '[{"question":"What does phenotyping examine in crop research?","answer":"Observable traits and performance, including under specified conditions."},{"question":"Is SPROUT itself a newly notified crop variety?","answer":"No. It is a research facility for evaluation and crop improvement."}]'::jsonb,
  '{"title":"From gene to crop trait","steps":["Genomics identifies candidate traits.","SPROUT tests plants under controlled stresses.","Researchers evaluate phenotype and performance.","Results inform breeding and climate-resilient crop improvement."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-legal-metrology-gatc-network', '2026-09-16',
  'Government Approved Test Centre network expands legal-metrology capacity',
  'The Department of Consumer Affairs reported expansion of the Government Approved Test Centre network after the scope of the Legal Metrology (Government Approved Test Centre) Rules, 2013 was broadened. The framework now covers 23 categories of weighing and measuring instruments, while 51 centres have already been recognised and further applications are under process.',
  'It is useful for consumer protection and standards questions. GATCs supplement State Legal Metrology Departments by verifying specified instruments; they do not replace statutory oversight or enforcement against serious violations.',
  'The listed instrument groups include water, gas and energy meters, breath analysers, vehicle speedometers, weighing instruments, and fuel dispensers. The release also notes State-level GATC rules aligned with the amended central framework and India''s OIML Certification Authority status.',
  'GATC Network Expands to Strengthen Legal Metrology Verification Infrastructure',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310523&lang=1&reg=3',
  'Ministry of Consumer Affairs, Food and Public Distribution / Press Information Bureau', '2026-09-15',
  '["GATC means Government Approved Test Centre.","The amended framework covers 23 categories of weighing and measuring instruments.","The release reports 51 recognised GATCs and a further application pipeline.","GATCs supplement State Legal Metrology capacity for verification and re-verification of specified instruments."]'::jsonb,
  '[{"question":"What is the primary function of a GATC?","answer":"Verification and re-verification of specified weights and measures."},{"question":"Do GATCs eliminate the role of State Legal Metrology Departments?","answer":"No. They supplement State capacity."}]'::jsonb,
  '{"title":"Legal-metrology verification","steps":["Rules define eligible test-centre functions.","Technical institutions seek GATC recognition.","Recognised centres verify specified instruments.","State departments retain oversight, surveillance and enforcement roles."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-plfs-august-2026-monthly-bulletin', '2026-09-16',
  'PLFS August bulletin reports higher labour-force participation',
  'MoSPI released the August 2026 PLFS Monthly Bulletin. For persons aged 15 years and above on the Current Weekly Status basis, overall labour-force participation rose from 55.4% in July to 55.6% in August; the worker-population ratio rose to 52.8%, while overall unemployment stayed at 5.0%.',
  'These are official labour-market indicators, not interchangeable labels. LFPR measures those working or seeking/available for work, WPR measures those working, and UR measures unemployment within the labour force.',
  'PLFS is conducted by the National Statistical Office under MoSPI. The monthly series uses Current Weekly Status and, since January 2025, provides monthly and quarterly estimates; the August 2026 bulletin is the seventeenth in the series.',
  'Press Note on PLFS Monthly Bulletin, August 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310427&lang=1&reg=3',
  'Ministry of Statistics and Programme Implementation / Press Information Bureau', '2026-09-15',
  '["PLFS is conducted by the National Statistical Office under MoSPI.","The monthly bulletin uses Current Weekly Status for persons aged 15 years and above.","Overall LFPR was 55.6%, WPR 52.8% and UR 5.0% in August 2026.","LFPR, WPR and UR measure different parts of the labour market and should not be treated as synonyms."]'::jsonb,
  '[{"question":"Which PLFS indicator measures the share of people actually working?","answer":"Worker Population Ratio (WPR)."},{"question":"What reference approach is used for the monthly PLFS bulletin?","answer":"Current Weekly Status (CWS)."}]'::jsonb,
  '{"title":"PLFS indicator map","steps":["Population aged 15+ is observed.","Labour force includes workers and people seeking/available for work.","LFPR measures the labour-force share.","WPR measures workers; UR measures unemployment within the labour force."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-upi-mdr-large-merchant-framework', '2026-09-16',
  'UPI framework keeps users and most merchant payments free',
  'The Finance Ministry said the new UPI framework keeps all person-to-person payments free and leaves merchant payments up to Rs 2,000 free of MDR. It states that about 96% of person-to-merchant transactions remain unaffected; MDR applies only to specified merchant transactions above the threshold, while customers cannot be charged it.',
  'The exam distinction is critical: Merchant Discount Rate is an ecosystem charge on merchants, not a tax or a fee payable by the customer. The release also protects small merchants receiving up to Rs 1 lakh a month through the specified P2PM QR category.',
  'The framework is described as being under the Payment and Settlement Systems Act, 2007. For transactions of Rs 75,000 or more, the stated standard MDR cap is Rs 300; essential-sector and capital-market categories have separately described treatment.',
  'UPI Continues to Remain Free for Peer to Peer Transactions and 96% of Merchant Transactions',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310586&lang=1&reg=3',
  'Ministry of Finance / Press Information Bureau', '2026-09-15',
  '["All UPI person-to-person transactions remain free.","Person-to-merchant payments up to Rs 2,000 remain free of MDR.","MDR is not a Government tax and cannot be passed on to customers.","The release places the framework under the Payment and Settlement Systems Act, 2007."]'::jsonb,
  '[{"question":"Who pays MDR under the stated UPI framework: the customer or the merchant ecosystem?","answer":"It is a merchant-ecosystem charge and cannot be passed on to customers."},{"question":"What is the stated free P2M threshold?","answer":"Rs 2,000."}]'::jsonb,
  '{"title":"UPI charge distinction","steps":["P2P payments remain free.","Small P2M payments remain MDR-free.","Specified higher-value merchant payments attract MDR.","Banks and payment providers share MDR; customers cannot be charged it."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-gujarat-gati-shakti-cargo-terminals', '2026-09-16',
  'Five Gujarat Gati Shakti Cargo Terminals receive project milestones',
  'The Railway Ministry inaugurated the Shivlakha Gati Shakti Cargo Terminal, dedicated the Bhimasar, Devaliya and Chandisar terminals, and laid the foundation stone for Linch. The five Gujarat sites are intended to strengthen freight links between regional economic centres, ports and the northern hinterland.',
  'This is freight-infrastructure implementation. Inauguration, dedication and foundation-laying signal different stages, so do not report all five as newly operational in the same sense.',
  'Shivlakha and Bhimasar are in Kachchh, Devaliya is in Morbi, Chandisar in Banaskantha and Linch in Mahesana. The release also records a salt-loaded freight train from Shivlakha to Mithapur, illustrating rail''s role in bulk-commodity logistics.',
  'Railway Minister Inaugurates Shivlakha GCT and related Gujarat terminals',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310608&lang=1&reg=3',
  'Ministry of Railways / Press Information Bureau', '2026-09-15',
  '["A GCT is a Gati Shakti Cargo Terminal.","Shivlakha was inaugurated; Bhimasar, Devaliya and Chandisar were dedicated; Linch had its foundation stone laid.","The sites are in Gujarat and strengthen freight links with ports and markets.","Project milestones such as foundation-laying and commissioning are not the same stage."]'::jsonb,
  '[{"question":"Which Gujarat GCT had its foundation stone laid?","answer":"Linch in Mahesana."},{"question":"What is the key caution when reading this announcement?","answer":"The five locations are at different project stages."}]'::jsonb,
  '{"title":"Cargo-terminal milestones","steps":["Freight corridors need terminal infrastructure.","A foundation stone starts a project stage.","Dedicated or inaugurated terminals add handling capacity.","Terminals connect local producers, ports and national markets."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-yudh-abhyas-2026', '2026-09-16',
  'India-US Exercise Yudh Abhyas begins at Auli and Mahajan',
  'The 22nd edition of India-US Joint Military Exercise Yudh Abhyas commenced with the opening ceremony at the Auli Foreign Training Node in Uttarakhand and is being conducted simultaneously at Auli and the Mahajan Field Firing Range in Rajasthan. The release says 600 personnel from each side are participating.',
  'For international-relations and defence questions, remember the partner countries, the locations and the exercise focus: integrated battle groups in mountainous and semi-mountainous terrain. It is a bilateral exercise, not a multilateral alliance operation.',
  'The training includes drones and autonomous systems for surveillance and reconnaissance, contemporary weapon-system demonstrations at Mahajan, and exchanges on multi-domain warfare. The declared purpose is interoperability, joint planning and coordinated operations across varied terrain.',
  'India-US Joint Military Exercise Yudh Abhyas 2026 commences',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310476&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau', '2026-09-15',
  '["Yudh Abhyas is an India-US joint military exercise.","The 2026 edition is the 22nd and uses Auli in Uttarakhand and Mahajan in Rajasthan.","The release reports 600 personnel from each side.","Its focus includes integrated battle groups in mountainous and semi-mountainous terrain, drones and interoperability."]'::jsonb,
  '[{"question":"Which two locations host Yudh Abhyas 2026?","answer":"Auli in Uttarakhand and Mahajan Field Firing Range in Rajasthan."},{"question":"Is Yudh Abhyas a bilateral or multilateral exercise?","answer":"A bilateral India-US exercise."}]'::jsonb,
  '{"title":"Yudh Abhyas training focus","steps":["India and the United States field contingents.","Training is held in mountain and field-firing environments.","Participants test tactics, drones and autonomous systems.","The goal is interoperability and coordinated operations."]}'::jsonb,
  'published', now()
),
(
  '2026-09-16-world-circular-economy-forum-gandhinagar', '2026-09-16',
  'World Circular Economy Forum 2026 opens in Gandhinagar',
  'The World Circular Economy Forum 2026 opened in Gandhinagar under the theme Circular Economy: Transition for People and Prosperity. India hosted the forum for the first time in South Asia, with CPCB, Sitra, the Governments of India, Finland and Gujarat, MoEFCC and GPCB among the organisers.',
  'The current-affairs value is the policy vocabulary around circularity: reducing material use, reuse, repair, recovery, Extended Producer Responsibility and sustainable consumption. A forum is a cooperation platform, not by itself a new binding law.',
  'The inaugural session released Best Practices for Reuse of Treated Sewage and Driving Sustainability: A Guide to India''s Circular Economy and EPR Initiatives. The release reports more than 3,600 cross-sectoral stakeholders from 62 countries and refers to India''s co-chair role on the 10 Year Framework of Programmes Board.',
  'World Circular Economy Forum 2026 at Gandhinagar',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310349&lang=1&reg=3',
  'Ministry of Environment, Forest and Climate Change / Press Information Bureau', '2026-09-15',
  '["WCEF 2026 opened at Gandhinagar, Gujarat, from 15 to 18 September.","It is the first hosting of the Forum in South Asia.","Circular economy policy emphasises reuse, repair, recovery and resource efficiency.","EPR means Extended Producer Responsibility; a forum outcome is not automatically a binding law."]'::jsonb,
  '[{"question":"Where was WCEF 2026 held?","answer":"Gandhinagar, Gujarat."},{"question":"What does EPR stand for in waste-management policy?","answer":"Extended Producer Responsibility."}]'::jsonb,
  '{"title":"Circular-economy loop","steps":["Design and consume with fewer materials.","Reuse and repair keep products in use.","Recover materials at end of use.","EPR assigns producers responsibility within regulated waste streams."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, why_it_matters = excluded.why_it_matters,
  background = excluded.background, source_title = excluded.source_title, source_url = excluded.source_url,
  source_publisher = excluded.source_publisher, source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways, quick_check = excluded.quick_check,
  visual_data = excluded.visual_data, status = excluded.status, reviewed_at = excluded.reviewed_at,
  updated_at = now();

insert into public.current_affairs_exam_tags (brief_id, exam_id)
select briefs.id, exams.id from public.current_affairs_briefs briefs cross join public.exams exams
where briefs.slug like '2026-09-16-%' and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
