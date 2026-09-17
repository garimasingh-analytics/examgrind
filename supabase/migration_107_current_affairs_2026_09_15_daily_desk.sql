-- 15 September 2026 daily current-affairs desk.
-- Eight original briefs, verified against competent official releases published on 15 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-15-falta-sez-odisha-sic-semiconductor-unit', '2026-09-15',
  'Falta SEZ approves Odisha’s second semiconductor unit',
  'The Unit Approval Committee under Falta Special Economic Zone approved SiCSem Private Limited’s proposal for a semiconductor-manufacturing unit at IDCO Infovalley-II in Khordha district, Odisha. The proposed unit will make silicon-carbide diodes and MOSFETs, with stated investment of Rs 3,406.25 crore and expected employment of about 1,270 people.',
  'This is a concrete investment approval in the semiconductor ecosystem. Separate approval from commissioning: the release describes a proposed unit, not a factory already producing chips.',
  'Silicon carbide is a wide-bandgap semiconductor material used where high voltage, temperature or power efficiency matters. The release projects annual capacity of 4.8 million SiC diodes and 91.2 million SiC MOSFETs, and links the project to export-oriented manufacturing under the SEZ framework.',
  'Falta SEZ Facilitates Approval of Odisha’s Second Semiconductor Unit at IDCO Infovalley-II',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310397&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-15',
  '["The Unit Approval Committee approved the SiCSem proposal under Falta SEZ.","The proposed site is IDCO Infovalley-II in Khordha district, Odisha.","The unit is proposed to manufacture silicon-carbide diodes and MOSFETs.","Approval and future production are distinct stages."]'::jsonb,
  '[{"question":"What semiconductor material is central to this proposed Odisha unit?","answer":"Silicon carbide (SiC)."},{"question":"Does the approval mean the unit is already operational?","answer":"No. The source describes a proposed unit that has received approval."}]'::jsonb,
  '{"title":"SEZ manufacturing approval","steps":["An investor submits a unit proposal.","The competent committee grants or refuses approval.","The approved project develops plant and production capability.","Output can contribute to domestic capability and export-oriented manufacturing."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-august-2026-trade-data-exports', '2026-09-15',
  'August trade data shows faster growth in combined exports',
  'The Commerce Ministry estimated India’s combined merchandise-and-services exports for August 2026 at US$82.68 billion, 25.41% higher than in August 2025. Combined imports were estimated at US$92.09 billion, leaving a combined trade balance of minus US$9.41 billion.',
  'This is official trade data, but the services component for the latest month is an estimate because the latest RBI services data then available were for July. A trade deficit means imports exceed exports; it is not the same thing as a fiscal deficit.',
  'For April–August 2026–27, combined exports were estimated at US$399.27 billion and combined imports at US$459.65 billion. The release identifies electronic goods, petroleum products and engineering goods among the major drivers of merchandise-export growth in August.',
  'The cumulative exports (merchandise & services) during April-August 2026-27 is estimated at US$ 399.27 Billion',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310636&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-15',
  '["Combined exports for August 2026 were estimated at US$82.68 billion.","Combined imports were estimated at US$92.09 billion.","The combined trade balance was minus US$9.41 billion.","The release says the latest services data available from RBI were for July, so August services are estimated."]'::jsonb,
  '[{"question":"What does a negative trade balance mean?","answer":"Imports exceeded exports for the period."},{"question":"Why are the latest services figures described as estimates?","answer":"The latest underlying RBI services data then available were for July."}]'::jsonb,
  '{"title":"Trade-data reading","steps":["Merchandise and services exports are combined.","Imports are similarly combined.","Exports minus imports gives the trade balance.","Latest services values may be estimated pending complete source data."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-special-campaign-6-portal-ewaste', '2026-09-15',
  'Special Campaign 6 prepares a whole-of-government e-waste drive',
  'DARPG announced the Special Campaign 6 portal for monitoring progress across 84 Union Ministries and Departments. The preparatory phase was scheduled for 16–30 September and implementation for 2–31 October, with effective collection, segregation and disposal of e-waste as a stated focus.',
  'This is an administrative-reforms and public-grievance-management item. The campaign is coordinated by DARPG; it is not a replacement for the statutory e-waste rules or for the responsibilities of environment regulators.',
  'The Department of Administrative Reforms and Public Grievances has been the nodal department for these annual campaigns since 2021. The release situates the campaign in institutionalising cleanliness and reducing pendency in government offices.',
  'Union Minister Dr. Jitendra Singh to launch dedicated web-portal for Special Campaign 6 on 16th September, 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310383&lang=1&reg=3',
  'Ministry of Personnel, Public Grievances and Pensions / Press Information Bureau', '2026-09-15',
  '["DARPG coordinates Special Campaigns as nodal department.","Special Campaign 6 has a preparatory phase and a separate implementation phase.","The announced portal monitors progress across 84 Ministries and Departments.","E-waste collection, segregation and disposal are a stated focus."]'::jsonb,
  '[{"question":"Which department coordinates Special Campaign 6?","answer":"The Department of Administrative Reforms and Public Grievances (DARPG)."},{"question":"Does the campaign itself replace statutory e-waste regulation?","answer":"No. It is an administrative campaign and does not replace the regulatory framework."}]'::jsonb,
  '{"title":"Special Campaign model","steps":["DARPG coordinates participating departments.","A preparatory phase identifies records, pending matters and waste streams.","The portal monitors reported progress.","Implementation targets cleanliness, e-waste handling and reduction of pendency."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-shreyas-higher-education-sc-obc', '2026-09-15',
  'SHREYAS supports higher-education pathways for SC and OBC students',
  'The Social Justice Ministry highlighted the Scholarships for Higher Education for Young Achievers Scheme, or SHREYAS, as a four-component support framework for Scheduled Caste and Other Backward Class students. It covers free coaching, education in premier institutions, overseas studies and research fellowships.',
  'SHREYAS is a scheme umbrella, not a single scholarship with identical eligibility for every learner. In questions, match the scheme to its higher-education and social-justice objective and avoid confusing it with the separate PM-YASASVI framework.',
  'The release records cumulative expenditure of about Rs 3,509.39 crore under the four components from 2014–15 to 2025–26 and a cumulative beneficiary count of 1,18,248 for the reported components.',
  'SHREYAS Strengthens Higher Education Opportunities for SC and OBC Students',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310474&lang=1&reg=3',
  'Ministry of Social Justice and Empowerment / Press Information Bureau', '2026-09-15',
  '["SHREYAS stands for Scholarships for Higher Education for Young Achievers Scheme.","It is associated with higher-education support for SC and OBC students.","The reported components include coaching, premier-institution education, overseas studies and fellowships.","A scheme umbrella can have components with different operational conditions."]'::jsonb,
  '[{"question":"What does SHREYAS stand for?","answer":"Scholarships for Higher Education for Young Achievers Scheme."},{"question":"Is SHREYAS limited to one identical scholarship benefit?","answer":"No. The release describes four support components."}]'::jsonb,
  '{"title":"SHREYAS support routes","steps":["Eligible social groups face higher-education barriers.","Scheme components address preparation, entry and advanced study.","Support can include coaching, institution study, overseas study or fellowship.","Programme monitoring records expenditure and beneficiaries."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-tapas-nisd-social-defence-learning', '2026-09-15',
  'NISD’s TAPAS platform expands self-paced social-defence learning',
  'The National Institute of Social Defence reported that TAPAS—Training for Augmenting Productivity and Services—had recorded 6,866 enrolments between 2021 and 2026. The online learning-management platform offers self-paced certificate courses through video lectures, reading material, discussion forums and self-assessment.',
  'This is an institutional capacity-building item. TAPAS is an online learning platform under NISD, not a scholarship, statutory regulator or clinical service-delivery scheme.',
  'The release lists 48 modules across five courses: geriatric care, social-defence issues, substance-abuse prevention, transgender issues, and care and management of dementia.',
  'TAPAS Strengthens Capacity Building through Self-Paced Online Certificate Courses',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310543&lang=1&reg=3',
  'Ministry of Social Justice and Empowerment / Press Information Bureau', '2026-09-15',
  '["TAPAS expands to Training for Augmenting Productivity and Services.","It is run through the National Institute of Social Defence.","The release reports 48 modules in five self-paced certificate courses.","Its four-quadrant approach includes lectures, reading material, forums and self-assessment."]'::jsonb,
  '[{"question":"Which institution runs the TAPAS learning platform?","answer":"The National Institute of Social Defence (NISD)."},{"question":"Is TAPAS a clinical treatment scheme?","answer":"No. It is a self-paced learning and capacity-building platform."}]'::jsonb,
  '{"title":"TAPAS learning framework","steps":["NISD identifies social-defence learning themes.","Online courses combine lectures and supplementary material.","Discussion and self-assessment support learner engagement.","Certificates build capacity among interested learners and practitioners."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-ccpa-rapido-dark-patterns-order', '2026-09-15',
  'CCPA penalises Rapido over tipping prompts and dark patterns',
  'The Central Consumer Protection Authority imposed a Rs 10 lakh penalty on Rapido’s operator after finding that its ride-booking interface used misleading tipping prompts and dark patterns. The order identifies confirm shaming and interface interference, and directs discontinuance of prompts that steer users toward paying more.',
  'The item is valuable for consumer-protection and digital-governance questions. A dark pattern is a design choice that can manipulate or distort consumer choice; it is different from an ordinary transparent price disclosure.',
  'The CCPA acts under the Consumer Protection Act, 2019. This order followed a sector-wide examination of advance-tipping and dynamic-pricing practices by ride-hailing platforms, so it offers broader regulatory vocabulary beyond one company.',
  'CCPA Imposed ₹10 Lakh Penalty on Rapido for Misleading Tipping Prompts and Dark Patterns',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310526&lang=1&reg=3',
  'Ministry of Consumer Affairs, Food and Public Distribution / Press Information Bureau', '2026-09-15',
  '["The Central Consumer Protection Authority imposed the stated penalty.","The release identifies confirm shaming and interface interference as dark-pattern concerns.","The order concerns prompts that steer consumers toward paying more before confirmation.","CCPA is a consumer-protection authority under the Consumer Protection Act, 2019."]'::jsonb,
  '[{"question":"What is a dark pattern?","answer":"A user-interface design that manipulates or distorts informed consumer choice."},{"question":"Which authority issued the order?","answer":"The Central Consumer Protection Authority (CCPA)."}]'::jsonb,
  '{"title":"Digital-consumer protection","steps":["A platform presents an interface to a consumer.","Regulators examine whether prompts are misleading or manipulative.","A dark-pattern finding can lead to directions and penalty.","Transparent choice supports consumer protection."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-caqm-ncr-enforcement-review', '2026-09-15',
  'CAQM reviews NCR air-pollution compliance across priority sectors',
  'The Enforcement Task Force of the Commission for Air Quality Management in NCR and Adjoining Areas reviewed 150 inspections conducted over a 15-day reporting period. These included construction-and-demolition sites, industrial units and diesel-generator sets; CAQM also reviewed cumulative inspection and closure-direction data.',
  'For exams, know CAQM as an inter-jurisdictional statutory body for the NCR and adjoining areas. An inspection or closure direction is an enforcement step; a resumption order follows verification of compliance and should not be confused with approval of a new activity.',
  'The release reports 28,547 cumulative inspections, 1,829 closure directions and 1,479 resumption orders as on 14 September. It describes continued coordination with State Pollution Control Boards and the Delhi Pollution Control Committee.',
  'CAQM reviews Enforcement and Compliance Status across NCR; 150 Inspections conducted during 15-day reporting period',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310540&lang=1&reg=3',
  'Ministry of Environment, Forest and Climate Change / Press Information Bureau', '2026-09-15',
  '["CAQM stands for the Commission for Air Quality Management in NCR and Adjoining Areas.","The review covered C&D sites, industrial units and diesel-generator sets.","A closure direction and a later resumption order are different compliance stages.","SPCBs and the DPCC remain important implementing partners in the region."]'::jsonb,
  '[{"question":"What does CAQM’s geographic mandate cover?","answer":"The National Capital Region and adjoining areas."},{"question":"What must occur before a resumption order after a closure direction?","answer":"Verification that compliance has been achieved."}]'::jsonb,
  '{"title":"Air-quality enforcement cycle","steps":["Priority sectors are inspected.","Non-compliance can trigger closure or corrective directions.","Authorities verify remedial compliance.","Compliant entities may receive resumption orders while monitoring continues."]}'::jsonb,
  'published', now()
),
(
  '2026-09-15-varuna-elevated-corridor-varanasi', '2026-09-15',
  'Varuna Elevated Corridor links Varanasi mobility with logistics planning',
  'The Road Transport Ministry described the Cabinet-approved Varuna Elevated Corridor: a predominantly elevated 43.218-km, 6/4-lane corridor linking NH-31 with the Varanasi Ring Road along the Varuna River. The stated project cost is Rs 10,998 crore and NHAI will develop it.',
  'This is a useful urban-infrastructure and PM Gati Shakti example. Cabinet approval and an announced corridor do not mean the road is complete; construction, land acquisition and commissioning remain separate project stages.',
  'The release places the project in the Varanasi Decongestion Plan and says it will improve access to major transport gateways and logistics nodes. It includes an iconic cable-stayed bridge and an extradosed foot-over-bridge-cum-major bridge.',
  'Varuna Elevated Corridor: Balancing Heritage, Mobility and Growth in Varanasi',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310354&lang=1&reg=3',
  'Ministry of Road Transport and Highways / Press Information Bureau', '2026-09-15',
  '["The Varuna Elevated Corridor is planned in Varanasi along the Varuna River.","It links NH-31 with the Varanasi Ring Road.","The stated length is 43.218 km and the stated cost is Rs 10,998 crore.","NHAI is the implementing agency named in the release, and approval is not commissioning."]'::jsonb,
  '[{"question":"Which agency will develop the Varuna Elevated Corridor?","answer":"The National Highways Authority of India (NHAI)."},{"question":"Which highway network points does it link?","answer":"NH-31 and the Varanasi Ring Road."}]'::jsonb,
  '{"title":"Urban-corridor sequence","steps":["Planning identifies a congestion and logistics need.","Cabinet approval establishes the sanctioned project.","NHAI develops elevated sections and supporting structures.","Commissioning later adds capacity and connections to the regional network."]}'::jsonb,
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
where briefs.slug like '2026-09-15-%' and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
