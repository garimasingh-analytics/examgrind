-- 12 October 2026 current-affairs desk.
-- Every item below was checked against the linked primary official publication.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-12-cpi-base-2024-september$$, $$2026-10-12$$,
  $$September retail inflation is released on the CPI 2024=100 series$$,
  $$MoSPI released September 2026 Consumer Price Index data on the revised 2024=100 base. The provisional all-India combined CPI inflation rate was 5.54% year on year; Consumer Food Price Index inflation was 7.74%.$$,
  $$This is a core economy-and-statistics update. It helps with CPI, base-year revision, headline versus food inflation, rural-urban comparison and the difference between an index level and its year-on-year inflation rate.$$,
  $$A CPI tracks the change in prices of a defined consumer basket over time. The base year is assigned an index value of 100, so moving to 2024=100 changes the reference structure; it does not mean prices reset. The release reports September combined CPI at 109.49, while the headline inflation figure compares September 2026 with September 2025. MoSPI labels the month’s estimates provisional and publishes rural, urban and combined series.$$,
  $$Press Release of Consumer Price Index on Base 2024=100 for September 2026$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322244&lang=1&reg=3$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-12$$,
  $$["The CPI base year used in this release is 2024=100.","September 2026 combined headline CPI inflation was 5.54% year on year, provisional.","Combined food inflation measured by CFPI was 7.74% year on year.","CPI inflation compares price change across time; an index value and an inflation rate are not the same thing."]$$::jsonb,
  $$[{"question":"What does 2024=100 indicate in a CPI series?","answer":"It identifies the base year and index reference; it does not say that prices in later years equal 100."},{"question":"Which inflation measure was higher in this release: headline CPI or CFPI?","answer":"CFPI food inflation, at 7.74%, was higher than combined headline CPI inflation of 5.54%."}]$$::jsonb,
  $${"title":"Reading a CPI release","steps":["A representative consumer basket is priced regularly.","Index values are compiled relative to the base year.","The current index is compared with the same month a year earlier.","That percentage change is reported as year-on-year inflation."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-trai-q1-telecom-performance$$, $$2026-10-12$$,
  $$TRAI releases April-June telecom performance indicators$$,
  $$TRAI released its quarterly Indian Telecom Services Performance Indicator Report for April-June 2026. It recorded 1,348.08 million total telecom subscribers and 1,114.17 million internet subscribers at the end of June.$$,
  $$This is useful for science and technology, regulation and digital-infrastructure questions. It tests TRAI's role, tele-density, the distinction between wireline, wireless and internet subscribers, and how sector indicators are reported.$$,
  $$The Telecom Regulatory Authority of India is the statutory telecom regulator. Its performance report uses provider-supplied data to track subscriptions, usage, revenue and quality-of-service indicators across telecom, cable TV, DTH and radio broadcasting. Tele-density is the number of telephone connections per 100 people; it is not the same as internet penetration. The report recorded total tele-density of 94.31% and rural tele-density of 60.89%, illustrating the continuing urban-rural gap.$$,
  $$Indian Telecom Services Performance Indicator Report for the Quarter April-June 2026$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322388&lang=1&reg=3$$,
  $$Telecom Regulatory Authority of India / Press Information Bureau$$, $$2026-10-12$$,
  $$["TRAI released the performance report for the quarter ending 30 June 2026.","Total telecom subscribers were 1,348.08 million at the end of June 2026.","Internet subscribers were 1,114.17 million; 47.73 million were wired and 1,066.43 million wireless.","Total tele-density was 94.31%, while rural tele-density was 60.89%."]$$::jsonb,
  $$[{"question":"What does tele-density measure?","answer":"Telephone connections per 100 people; it is not the same as the share of people using the internet."},{"question":"Which body issued this performance report?","answer":"The Telecom Regulatory Authority of India (TRAI)."}]$$::jsonb,
  $${"title":"From network data to a telecom indicator","steps":["Service providers report operational and subscriber data.","TRAI compiles sector-wide indicators.","The report separates wireline, wireless and internet measures.","Policy makers and students can compare access, usage, revenue and service quality."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-imd-cyclone-marine-dss$$, $$2026-10-12$$,
  $$IMD opens a WebGIS decision-support system for cyclone and marine warnings$$,
  $$The India Meteorological Department dedicated its Cyclone Warning and Marine Weather Services Decision Support System, an interactive WebGIS platform, during its post-monsoon pre-cyclone exercise meeting.$$,
  $$This is a disaster-management and geography item. It links IMD, early warning, marine meteorology, GIS-enabled decision support and the October-December post-monsoon cyclone season.$$,
  $$A decision-support system turns forecast and warning information into a format that users can interpret for action. IMD's new platform is web-based and designed for the public, while the Regional Specialised Meteorological Centre in New Delhi provides cyclone-related regional services. A weather warning is most effective when forecasts, risk communication and local response arrangements work together; a digital platform does not itself replace evacuation or disaster response agencies.$$,
  $$IMD Dedicates Cyclone Warning and Marine Weather Services Decision Support System to the Nation$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322562&lang=1&reg=3$$,
  $$India Meteorological Department, Ministry of Earth Sciences / Press Information Bureau$$, $$2026-10-12$$,
  $$["IMD launched an interactive WebGIS-based Cyclone Warning and Marine Weather Services DSS.","The launch occurred during the post-monsoon pre-cyclone exercise meeting for October-December 2026.","The public platform is available through IMD and RSMC New Delhi websites.","RSMC stands for Regional Specialised Meteorological Centre."]$$::jsonb,
  $$[{"question":"What kind of platform did IMD dedicate?","answer":"An interactive WebGIS decision-support system for cyclone warning and marine weather services."},{"question":"Does a warning platform by itself carry out evacuation?","answer":"No. It supports information and decisions; local disaster-management authorities organise response measures."}]$$::jsonb,
  $${"title":"Early warning to protective action","steps":["Observation and models generate a forecast.","IMD issues location- and hazard-relevant warning information.","The WebGIS system helps users view and interpret it.","Authorities and communities take preparedness or response action."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-exercise-tarang-shakti-2026$$, $$2026-10-12$$,
  $$Exercise Tarang Shakti 2026 concludes as a multinational air exercise$$,
  $$The Indian Air Force hosted the second Exercise Tarang Shakti at Air Force Station Jodhpur from 26 September to 12 October, bringing together seven friendly foreign countries and 32 observer nations under the theme 'Power in Partnership'.$$,
  $$This is a defence and international-relations item. It tests the role of multinational exercises in interoperability and the distinction between an exercise, a defence treaty and a military operation.$$,
  $$Tarang Shakti is an Indian Air Force-hosted multinational air exercise. According to the official release, participating friendly foreign countries were Australia, Bangladesh, France, Germany, Sri Lanka, the United Arab Emirates and the United States. Exercises allow forces to practise complex missions, exchange operational experience and build interoperability. They do not by themselves create a permanent alliance or command structure.$$,
  $$Exercise Tarang Shakti 2026: Power in Partnership, Strength in Self-Reliance$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322365&lang=1&reg=3$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-12$$,
  $$["Exercise Tarang Shakti 2026 was hosted by the Indian Air Force at Air Force Station Jodhpur.","It ran from 26 September to 12 October 2026.","Seven friendly foreign countries participated and 32 nations attended as observers.","The release names the theme as 'Power in Partnership'."]$$::jsonb,
  $$[{"question":"Which service hosted Exercise Tarang Shakti 2026?","answer":"The Indian Air Force."},{"question":"Does participation in a multinational exercise automatically create a defence alliance?","answer":"No. It builds familiarity and interoperability without itself creating a treaty alliance."}]$$::jsonb,
  $${"title":"What a multinational air exercise develops","steps":["Countries send aircraft, personnel or observers.","Forces plan and practise agreed mission scenarios.","Participants compare procedures and communication methods.","The exercise improves interoperability for future cooperation."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-rdif-first-fund-manager-cohort$$, $$2026-10-12$$,
  $$RDI Fund names its first 19 second-level fund managers$$,
  $$The Research, Development and Innovation Fund announced its first cohort of 19 Second Level Fund Managers: 14 Alternative Investment Funds and five Focused Research Organisations, with an approved RDIF commitment of ₹7,131 crore.$$,
  $$This is an innovation-finance item. It is relevant for the RDI Scheme, fund-of-funds design, alternative investment funds, technology readiness levels and the use of public capital to crowd in private R&D investment.$$,
  $$The ₹1 lakh crore RDI Scheme was launched in November 2025. The selected institutions are intended to channel RDIF capital to Eligible Technology Enterprises undertaking work at Technology Readiness Level 4 and above. A second-level fund manager is an intermediary that deploys capital to eligible ventures or research organisations; it is not necessarily the final technology developer. The release says the first cohort is expected to mobilise private capital equivalent to the RDIF contribution.$$,
  $$Research, Development and Innovation Fund Announces First Cohort of 19 Second Level Fund Managers$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322295&lang=1&reg=3$$,
  $$Department of Science and Technology / Press Information Bureau$$, $$2026-10-12$$,
  $$["The first RDIF cohort contains 19 Second Level Fund Managers.","It includes 14 Alternative Investment Funds and five Focused Research Organisations.","The Empowered Group of Secretaries approved an RDIF commitment of ₹7,131 crore for the cohort.","The RDI Scheme has a stated ₹1 lakh crore scale and supports eligible technology work at TRL 4 and above."]$$::jsonb,
  $$[{"question":"Who was approved in the first RDIF cohort: final inventors or second-level fund managers?","answer":"Second-level fund managers, which will channel funding to eligible technology enterprises and research activity."},{"question":"What does TRL refer to?","answer":"Technology Readiness Level, a way of describing the maturity of a technology."}]$$::jsonb,
  $${"title":"How the RDIF funding channel works","steps":["Government establishes an innovation-finance scheme.","An empowered body approves fund-management intermediaries.","Managers deploy capital to eligible technology enterprises or research organisations.","Public and private capital support maturation and commercialisation of technology."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-tdb-peptris-ai-drug-discovery$$, $$2026-10-12$$,
  $$Technology Development Board backs AI drug-discovery programme$$,
  $$The Technology Development Board signed an agreement with Peptris Technologies for ₹86 crore of Research Development and Innovation Fund support for VIGOR, a programme intended to take four AI-discovered drug candidates from Technology Readiness Level 4 to 6.$$,
  $$This is useful for science and technology, biotechnology and public innovation finance. It connects AI-assisted discovery with the preclinical stage of drug development and distinguishes public R&D support from regulatory approval of a medicine.$$,
  $$The VIGOR project has a stated total cost of ₹172 crore. Its stated goal is to advance candidates through preclinical development, validation and preparation for clinical trials. AI can help identify and prioritise molecules, but a candidate still needs laboratory validation, preclinical evidence and the applicable regulatory pathway before it can become an approved treatment. The Technology Development Board operates under the Department of Science and Technology.$$,
  $$TDB-DST signs agreement with Peptris for ₹86 crore RDI support to accelerate AI-driven drug discovery and development$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322077&lang=1&reg=3$$,
  $$Technology Development Board, Department of Science and Technology / Press Information Bureau$$, $$2026-10-12$$,
  $$["TDB agreed to provide ₹86 crore in RDI Fund support to Peptris Technologies.","The project is called VIGOR: Advancing AI-Discovered Molecules from Bench to Clinic.","It aims to advance four candidates from TRL 4 to TRL 6.","The official release states a total project cost of ₹172 crore."]$$::jsonb,
  $$[{"question":"Does RDI support mean that the four drug candidates are already approved medicines?","answer":"No. The support is for preclinical development and preparation for clinical trials; approval requires the applicable later-stage evidence and regulation."},{"question":"Which body signed the support agreement?","answer":"The Technology Development Board under the Department of Science and Technology."}]$$::jsonb,
  $${"title":"From AI molecule to a possible medicine","steps":["AI helps identify or prioritise molecular candidates.","Laboratory and preclinical work tests promising candidates.","Development support can move candidates toward clinical-trial readiness.","Separate clinical evidence and regulatory review are needed before approval."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-pm-setu-surat-visakhapatnam-spvs$$, $$2026-10-12$$,
  $$PM-SETU shareholders' agreements activate two ITI-cluster projects$$,
  $$The Directorate General of Training, Gujarat, Andhra Pradesh and AM/NS India signed shareholders' agreements under PM-SETU for Surat and Visakhapatnam ITI clusters. The two clusters cover nine government ITIs and approved investment of about ₹440 crore.$$,
  $$This is a skills, federalism and public-private-partnership item. It helps students distinguish an ITI upgradation project from a university programme and understand how special-purpose vehicles can structure implementation.$$,
  $$The Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs scheme (PM-SETU) seeks industry-linked improvement of government ITIs. The release says each cluster will be managed through an SPV: AM/NS India will hold 51% and the Union and respective State governments 24.5% each. Surat has five ITIs and Visakhapatnam four. A shareholders' agreement sets the governance and ownership framework; it does not by itself complete physical upgradation.$$,
  $$PM-SETU Achieves Another Milestone with Signing of Shareholders' Agreements for Surat and Visakhapatnam Clusters$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322170&lang=1&reg=3$$,
  $$Ministry of Skill Development and Entrepreneurship / Press Information Bureau$$, $$2026-10-12$$,
  $$["PM-SETU stands for Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs.","The Surat and Visakhapatnam clusters cover five and four government ITIs respectively.","Their approved investment is about ₹440 crore: ₹240 crore for Surat and ₹200 crore for Visakhapatnam.","The implementation SPVs are to have 51% AM/NS India equity and 24.5% each for the Union and respective State governments."]$$::jsonb,
  $$[{"question":"What is the implementation vehicle proposed for the two PM-SETU clusters?","answer":"Dedicated Special Purpose Vehicles (SPVs)."},{"question":"Are the two clusters in the same State?","answer":"No. Surat is in Gujarat and Visakhapatnam is in Andhra Pradesh."}]$$::jsonb,
  $${"title":"Industry-linked ITI upgradation","steps":["Union and State governments approve a cluster investment plan.","An industry partner signs the governance agreement.","An SPV is formed to manage upgradation and operations.","Training infrastructure and industry exposure can be improved over implementation stages."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-12-india-uk-jetco-ceta-implementation$$, $$2026-10-12$$,
  $$India-UK JETCO sets up work for CETA implementation$$,
  $$At the 16th India-UK Joint Economic and Trade Committee meeting, India and the United Kingdom agreed a plan to support smooth operation of their Comprehensive Economic and Trade Agreement, including committees, working groups and government contact points.$$,
  $$This is an international-trade and diplomacy item. It tests JETCO, CETA implementation machinery and the difference between signing or bringing an agreement into force and the ongoing institutional work required to operate it.$$,
  $$JETCO is a bilateral mechanism for India-UK trade and economic engagement. The joint statement describes this as the first JETCO since CETA negotiations began in January 2022 and says CETA had entered into force. The two sides also agreed to deepen cooperation across services, innovation, procurement, science and technology, and gender, while the 17th JETCO is scheduled for the United Kingdom in 2027. A committee meeting can guide implementation but does not itself rewrite the trade agreement.$$,
  $$Joint Statement of the 16th Meeting of the India-UK Joint Economic and Trade Committee (JETCO)$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2322384&lang=1&reg=3$$,
  $$Department of Commerce, Ministry of Commerce and Industry / Press Information Bureau$$, $$2026-10-12$$,
  $$["JETCO is the India-UK Joint Economic and Trade Committee.","The 16th JETCO meeting was held in New Delhi on 12 October 2026.","The sides agreed to establish CETA committees and working groups and confirm government contact points.","The joint statement says the 17th JETCO is to take place in the United Kingdom in 2027."]$$::jsonb,
  $$[{"question":"What is the function of JETCO in this update?","answer":"It is the bilateral forum used to review trade and economic cooperation and support implementation of agreed priorities."},{"question":"Does a JETCO meeting itself amend CETA?","answer":"No. It can organise implementation and follow-up; amendment of an agreement requires the relevant formal process."}]$$::jsonb,
  $${"title":"Operating a bilateral trade agreement","steps":["Countries conclude and bring a trade agreement into force.","Implementation bodies and official contacts are established.","Businesses and governments identify practical issues.","Committees and working groups address follow-up under the agreement."]}$$::jsonb,
  $$published$$, now()
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
where briefs.slug in (
  $$2026-10-12-cpi-base-2024-september$$,
  $$2026-10-12-trai-q1-telecom-performance$$,
  $$2026-10-12-imd-cyclone-marine-dss$$,
  $$2026-10-12-exercise-tarang-shakti-2026$$,
  $$2026-10-12-rdif-first-fund-manager-cohort$$,
  $$2026-10-12-tdb-peptris-ai-drug-discovery$$,
  $$2026-10-12-pm-setu-surat-visakhapatnam-spvs$$,
  $$2026-10-12-india-uk-jetco-ceta-implementation$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
