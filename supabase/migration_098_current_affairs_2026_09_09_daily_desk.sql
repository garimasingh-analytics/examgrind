-- 9 September 2026 daily current-affairs desk.
-- Original revision briefs based on primary official releases published on 8 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-09-dot-financial-fraud-risk-indicator',
  '2026-09-09',
  'DoT’s Financial Fraud Risk Indicator: moving cyber-fraud control upstream',
  'The Department of Telecommunications said its Financial Fraud Risk Indicator (FRI) had helped prevent suspected cyber-fraud losses of more than ₹5,000 crore since its launch on 22 May 2025. The release puts the cumulative figure at ₹5,043.73 crore by August 2026.',
  'This connects Internal Security, cyber governance, digital payments and financial regulation. The exam point is that FRI is a risk-intelligence input, not a court order or a police investigation: institutions can use it to identify and stop potentially risky transactions before a loss occurs.',
  'FRI operates under the DoT’s Digital Intelligence Platform (DIP). It classifies mobile numbers as medium, high or very high risk using information from sources including the Sanchar Saathi ecosystem, the National Cyber Crime Reporting Portal, telecom operators and financial institutions. The resulting intelligence can be shared with banks, payment service providers, insurers, securities intermediaries and pension-sector institutions. Each institution remains responsible for applying the signal within its own onboarding, transaction-monitoring and fraud-management processes.',
  'Financial Fraud Risk Indicator prevents suspected cyber-fraud losses of over ₹5,000 crore',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307924&lang=1&reg=3',
  'Department of Telecommunications / Press Information Bureau',
  '2026-09-08',
  '["FRI was launched by the Department of Telecommunications on 22 May 2025 and functions through the Digital Intelligence Platform (DIP).", "It classifies mobile-number risk as medium, high or very high; it does not by itself decide criminal liability.", "The official release reports suspected-loss prevention of ₹5,043.73 crore by August 2026.", "The intelligence can support banks, payment providers, insurers, securities intermediaries and pension-sector institutions in preventive controls."]'::jsonb,
  '[{"question":"Is FRI a mechanism for recovering money after a completed fraud?","answer":"Its stated role is preventive: it supplies risk intelligence so institutions can identify a potentially risky transaction before the loss occurs."},{"question":"Which DoT platform houses the FRI framework?","answer":"The Digital Intelligence Platform (DIP)."}]'::jsonb,
  '{"title":"From telecom signal to fraud prevention","steps":["Risk information is received from citizen reports, cybercrime systems, telecom operators and financial institutions.","DIP assesses the mobile number and assigns a risk category.","Relevant institutions incorporate the signal into their permitted fraud-control workflows.","A high-risk transaction can be reviewed or prevented before funds leave the customer’s account."]}'::jsonb,
  'published', now()
),
(
  '2026-09-09-pm-setu-iti-cluster-sips',
  '2026-09-09',
  'PM-SETU: ₹735.70 crore approved for three industry-linked ITI clusters',
  'The fifth National Steering Committee under PM-SETU approved Strategic Investment Plans worth ₹735.70 crore for ITI clusters in Rajasthan, Uttar Pradesh and Telangana. The release says the programme’s approved investment has thereby reached ₹2,171 crore across nine clusters.',
  'This is a Governance, education and skilling update. It is a useful example of a hub-and-spoke public-training model that uses industry participation; approval of an investment plan should not be confused with the completion of construction, course delivery or placement outcomes.',
  'PM-SETU expands to Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs. It seeks to modernise government Industrial Training Institutes through cluster-based partnerships. In this round, the approved outlays were ₹241 crore for the Bhiwadi cluster in Rajasthan, ₹240.40 crore for the Meerut cluster in Uttar Pradesh and ₹254.30 crore for the Medchal cluster in Telangana. The plans provide for infrastructure modernisation, upgrading existing trades, new long- and short-term courses, and stronger operating capacity.',
  'PM-SETU strengthens industry-oriented ITI transformation; fifth National Steering Committee approves SIPs worth ₹735.70 crore',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307818&lang=1&reg=3',
  'Ministry of Skill Development and Entrepreneurship / Press Information Bureau',
  '2026-09-08',
  '["PM-SETU means Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs.", "The fifth National Steering Committee approved three SIPs totalling ₹735.70 crore in Rajasthan, Uttar Pradesh and Telangana.", "The approved PM-SETU investment total is ₹2,171 crore across nine ITI clusters, according to the release.", "The model links a hub ITI with associated spoke ITIs and industry partners."]'::jsonb,
  '[{"question":"What does a PM-SETU Strategic Investment Plan approve?","answer":"A proposed investment and implementation plan for an ITI cluster; it is not proof that all upgraded facilities or employment outcomes already exist."},{"question":"Which three States received approvals in this round?","answer":"Rajasthan, Uttar Pradesh and Telangana."}]'::jsonb,
  '{"title":"How a PM-SETU ITI cluster works","steps":["A hub ITI is connected with a network of spoke ITIs.","State-level and national committees examine a Strategic Investment Plan.","Government and industry partners support modern infrastructure, trades and courses.","The cluster aims to align training with changing industry and employment needs."]}'::jsonb,
  'published', now()
),
(
  '2026-09-09-crcs-sahara-refund-portal-restored',
  '2026-09-09',
  'CRCS–Sahara Refund Portal resumes verification and settlement of claims',
  'The Ministry of Cooperation reported that the CRCS–Sahara Refund Portal had been restored, allowing verification and processing of pending claims from genuine depositors to resume. It said ₹9,267 crore had been credited directly to the Aadhaar-linked bank accounts of 41.56 lakh depositors, while about 20 lakh applications remained to be processed.',
  'This is relevant to cooperative governance, consumer protection, digital public infrastructure and the judiciary’s role in supervising a restitution arrangement. It is important to distinguish a verified claim from an automatic refund: eligibility and the payable amount still depend on the prescribed verification process.',
  'The Central Registrar of Cooperative Societies (CRCS) operates the refund process in line with the Supreme Court’s 29 March 2023 order in W.P. No. 191/2022. The dedicated online portal began on 18 July 2023. It uses Aadhaar e-KYC, matching of depositor, membership and account information with records supplied by the societies, and document checks under the approved standard operating procedure. After successful verification, an eligible amount is sent to the Aadhaar-linked bank account.',
  'CRCS–Sahara Refund Portal restored for faster settlement of genuine depositors’ claims',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308016&lang=1&reg=3',
  'Ministry of Cooperation / Press Information Bureau',
  '2026-09-08',
  '["CRCS is the Central Registrar of Cooperative Societies.", "The dedicated CRCS–Sahara Refund Portal began on 18 July 2023 under a process linked to the Supreme Court’s 29 March 2023 order in W.P. No. 191/2022.", "The release reports ₹9,267 crore credited to 41.56 lakh Aadhaar-linked accounts.", "A claim is processed through Aadhaar e-KYC, record matching and document verification before an eligible amount is credited."]'::jsonb,
  '[{"question":"Does submitting a claim on the CRCS–Sahara portal itself guarantee a refund?","answer":"No. The claim must satisfy the prescribed Aadhaar e-KYC, record-matching and document-verification process."},{"question":"Which authority runs the refund process?","answer":"The Central Registrar of Cooperative Societies (CRCS)."}]'::jsonb,
  '{"title":"Verified digital refund workflow","steps":["A depositor submits or corrects a claim through the official portal.","Aadhaar e-KYC and society records are matched with membership and account details.","Documents are checked under the approved standard operating procedure.","The verified eligible amount is credited to the Aadhaar-linked bank account."]}'::jsonb,
  'published', now()
),
(
  '2026-09-09-coal-sector-csr-framework',
  '2026-09-09',
  'Coal Ministry launches a sector-wide CSR framework for Indian coal companies',
  'The Ministry of Coal launched a CSR framework for Indian coal companies, prepared by the Indian Institute of Corporate Affairs (IICA). The Ministry describes it as the first sector-specific CSR framework since the statutory corporate-social-responsibility regime was introduced under the Companies Act, 2013.',
  'This is useful for Economy, governance and environment questions because it separates a sectoral implementation framework from the statutory CSR obligation itself. The framework can guide more outcomes-focused projects in coal-mining areas; it does not replace the Companies Act or create a separate CSR law.',
  'Corporate Social Responsibility is governed principally by section 135 of the Companies Act, 2013 and the accompanying rules for companies that meet the statutory thresholds. A sectoral framework can help coal companies identify local needs and assess outcomes in areas such as health, education, livelihoods and community development. IICA is an autonomous institution under the Ministry of Corporate Affairs that supports research, capacity building and policy work relating to corporate affairs.',
  'First sector-wide CSR framework for Indian coal companies launched',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308068&lang=1&reg=3',
  'Ministry of Coal / Press Information Bureau',
  '2026-09-08',
  '["The Ministry of Coal says the framework is the first sector-specific CSR framework after statutory CSR was introduced under the Companies Act, 2013.", "The Indian Institute of Corporate Affairs (IICA) prepared the framework.", "Section 135 of the Companies Act, 2013 remains the principal statutory basis for CSR; a sector framework guides implementation rather than replacing the law.", "The stated focus is effective and outcome-oriented CSR for people in coal-mining areas."]'::jsonb,
  '[{"question":"Does a coal-sector CSR framework replace the Companies Act’s CSR provisions?","answer":"No. It is an implementation guide; the statutory CSR regime remains governed by the Companies Act, 2013 and its rules."},{"question":"Which institution prepared the framework?","answer":"The Indian Institute of Corporate Affairs (IICA)."}]'::jsonb,
  '{"title":"From statutory CSR to a sector-focused framework","steps":["The Companies Act establishes the statutory CSR obligations for eligible companies.","A coal-sector framework identifies mining-area contexts and desired outcomes.","Companies design and implement CSR projects within the statutory framework.","Outcomes can be assessed for communities around coal-mining operations."]}'::jsonb,
  'published', now()
),
(
  '2026-09-09-exercise-veer-guardian-japan',
  '2026-09-09',
  'Exercise Veer Guardian-2026: India and Japan begin a bilateral air exercise',
  'The Indian Air Force and the Japan Air Self-Defense Force are conducting the bilateral Exercise Veer Guardian-2026 at Air Force Station Jodhpur from 9 to 22 September. The official release says the IAF will field LCA Tejas, Su-30MKI and Rafale aircraft, while Japan will deploy F-2A fighters.',
  'This is a high-yield International Relations and Defence item. Bilateral exercises are commonly tested through the participating countries, service branch, location and platforms. The exercise signals operational cooperation, but it should not be described as a military alliance or a treaty commitment.',
  'The Japan Air Self-Defense Force (JASDF) is Japan’s air-service component. The fourteen-day exercise includes advanced operational missions, mission-planning conferences, subject-matter exchanges and engagement on engineering and space-security aspects. LCA Tejas is India’s indigenous light combat aircraft, while the Su-30MKI and Rafale are also frontline IAF combat platforms. The release identifies the F-2A as the JASDF aircraft participating in this edition.',
  'Exercise Veer Guardian-2026 with the Japan Air Self-Defense Force',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307976&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau',
  '2026-09-08',
  '["Exercise Veer Guardian-2026 runs from 9 to 22 September at Air Force Station Jodhpur.", "It is a bilateral air exercise between the Indian Air Force and the Japan Air Self-Defense Force.", "The IAF participation includes LCA Tejas, Su-30MKI and Rafale aircraft.", "Japan’s participating aircraft is the F-2A fighter, according to the official release."]'::jsonb,
  '[{"question":"Which Japanese service participates in Exercise Veer Guardian-2026?","answer":"The Japan Air Self-Defense Force (JASDF)."},{"question":"Does a bilateral exercise itself create a military alliance?","answer":"No. It is an exercise for professional and operational cooperation, not an alliance treaty."}]'::jsonb,
  '{"title":"Veer Guardian-2026 at a glance","steps":["The IAF and JASDF assemble at Air Force Station Jodhpur.","The services conduct mission planning and advanced operational missions.","Personnel exchange expertise, including on engineering and space-security aspects.","The exercise builds operational familiarity within the India–Japan strategic partnership."]}'::jsonb,
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
  '2026-09-09-dot-financial-fraud-risk-indicator',
  '2026-09-09-pm-setu-iti-cluster-sips',
  '2026-09-09-crcs-sahara-refund-portal-restored',
  '2026-09-09-coal-sector-csr-framework',
  '2026-09-09-exercise-veer-guardian-japan'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
