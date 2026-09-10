-- 8 September 2026 daily current-affairs desk.
-- Original revision briefs based on primary official releases published on 7 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-08-dac-acceptance-of-necessity-capital-acquisition',
  '2026-09-08',
  'Defence Acquisition Council accords AoN for proposals worth about ₹1.10 lakh crore',
  'The Defence Acquisition Council (DAC) gave Acceptance of Necessity (AoN) to defence acquisition proposals estimated at about ₹1.10 lakh crore. The Ministry of Defence said that about 98% of the approved procurement value is intended to be sourced from Indian industry.',
  'This is useful for Internal Security, Defence, Science and Technology, and governance. The key exam distinction is procedural: an AoN is an in-principle administrative approval to begin the acquisition process; it is not the same as a final contract, delivery, or induction into service.',
  'The DAC is the principal Ministry of Defence body that considers capital-acquisition proposals. Its Acceptance of Necessity stage establishes the need for a proposed acquisition and permits the procurement process to move forward under the applicable Defence Acquisition Procedure. The 7 September proposals included Indian Army systems such as CBRN reconnaissance vehicles and bridge systems; naval Arudhra radars and marine gas turbines; and an RFID-based Defence Forces Secure Access Card system. Procurement can still require later tendering, contract, production, testing and delivery stages.',
  'DAC clears capital acquisition proposals worth about Rs 1.10 lakh crore for the defence forces',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307452&lang=1&reg=48',
  'Ministry of Defence / Press Information Bureau',
  '2026-09-07',
  '["DAC accorded Acceptance of Necessity, an in-principle administrative approval, for proposals worth about ₹1.10 lakh crore.", "The Ministry said approximately 98% of the approved procurements will be from Indian industry.", "The Navy proposals included Arudhra radars and design, development and later procurement of marine gas turbines.", "AoN is not a signed contract or proof that equipment has already entered service."]'::jsonb,
  '[{"question":"What does Acceptance of Necessity (AoN) mean in defence acquisition?","answer":"It is in-principle administrative approval of the need for a proposal; subsequent procurement and contracting steps are still required."},{"question":"Why should an AoN not be described as a completed induction?","answer":"Approval of a requirement precedes contracting, manufacture, testing and delivery."}]'::jsonb,
  '{"title":"From a defence requirement to equipment in service","steps":["A service identifies an operational requirement.","DAC accords AoN for the proposed acquisition.","Procurement, tendering and contracting proceed under the applicable rules.","Equipment is produced, tested, delivered and inducted after later stages."]}'::jsonb,
  'published', now()
),
(
  '2026-09-08-ncap-swachh-vayu-sarvekshan-2026',
  '2026-09-08',
  'Swachh Vayu Sarvekshan: NCAP progress and the city-ranking framework',
  'At Swachh Vayu Diwas 2026, the Environment Ministry released a compendium of National Clean Air Programme (NCAP) practices and recognised cities and wards through the fifth Swachh Vayu Sarvekshan. It reported that 108 of 130 NCAP cities improved their PM10 levels in 2025-26 compared with FY 2017-18.',
  'This is a high-yield Environment and urban-governance update. It connects air-pollution measurement, city-level implementation, the CPCB-linked monitoring ecosystem, and the difference between a performance ranking and the statutory ambient-air-quality standard.',
  'NCAP is a national framework for improving air quality through city action plans and coordinated measures. The PIB release describes coverage of 130 cities in 24 States and Union Territories and says the PRANA portal tracks air-quality-management parameters. The Swachh Vayu Sarvekshan framework considers action on sources such as road dust, municipal solid waste, vehicle emissions, industrial pollution and construction-and-demolition waste. The 2026 result should be read against its stated PM10 baseline, not as a claim that all participating cities now meet the National Ambient Air Quality Standards (NAAQS).',
  '5th Swachh Vayu Sarvekshan Awards conferred on Best Performing Cities and Wards on Swachh Vayu Diwas 2026; Compendium of Best Management Practices under NCAP released',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307388&lang=1&reg=2&v=sd',
  'Ministry of Environment, Forest and Climate Change / Press Information Bureau',
  '2026-09-07',
  '["NCAP covers 130 cities in 24 States and Union Territories, according to the release.", "108 of the 130 cities showed PM10 improvement in 2025-26 against the FY 2017-18 baseline.", "72 cities recorded PM10 reductions above 20%, while 26 recorded reductions above 40%.", "Fourteen cities met NAAQS; improvement in a ranking is therefore not identical to meeting the standard."]'::jsonb,
  '[{"question":"Does a fall in PM10 automatically mean a city meets NAAQS?","answer":"No. PM10 can improve from a baseline without reaching the prescribed ambient-air-quality standard."},{"question":"Which portal does the release identify for tracking NCAP air-quality-management parameters?","answer":"PRANA."}]'::jsonb,
  '{"title":"How NCAP turns an air-quality problem into city action","steps":["Cities identify major local pollution sources.","City action plans target dust, vehicles, industry, waste and other sources.","Implementation and indicators are tracked through the NCAP ecosystem and PRANA.","Results are assessed against the stated baseline and, separately, NAAQS."]}'::jsonb,
  'published', now()
),
(
  '2026-09-08-dgft-certificate-of-origin-open-api',
  '2026-09-08',
  'DGFT opens Certificate of Origin APIs on the Trade Connect platform',
  'The Directorate General of Foreign Trade introduced an Open API facility for applying for and verifying Certificates of Origin (CoO) through Trade Connect. Eligible exporters can connect their own ERP or accounting systems to the DGFT CoO system, and the facility covers both preferential and non-preferential certificates.',
  'This fits Economy, international trade and digital governance. It gives a practical way to revise why a Certificate of Origin matters in trade and why preferential origin documentation is linked to tariff concessions under an FTA, RTA or PTA.',
  'A Certificate of Origin certifies the originating country of goods for the relevant trade purpose. A preferential CoO can enable a qualifying exporter to seek tariff concessions under a trade agreement, subject to the agreement''s rules of origin; a non-preferential CoO is used for purposes such as customs clearance, compliance or trade remedies without itself creating a tariff preference. DGFT''s new facility is a digital process change, not a change to the underlying rules of origin or an automatic entitlement to a concession.',
  'DGFT Introduces Open API Facility for Certificate of Origin on the Trade Connect e-Platform',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307462&lang=1&reg=48',
  'Directorate General of Foreign Trade, Ministry of Commerce and Industry / Press Information Bureau',
  '2026-09-07',
  '["DGFT introduced the Open API facility through its Trade Connect e-Platform.", "The facility supports both preferential and non-preferential Certificates of Origin.", "Preferential CoOs relate to tariff concessions available under relevant FTAs, RTAs or PTAs and their rules of origin.", "Trade Notice No. 25/2026-27 dated 7 September 2026 gives the official implementation detail."]'::jsonb,
  '[{"question":"What is the core difference between a preferential and a non-preferential Certificate of Origin?","answer":"A preferential CoO can support a tariff concession under an applicable trade agreement; a non-preferential CoO serves trade and compliance purposes without conferring that preference."},{"question":"Does a digital CoO API change the legal rules of origin?","answer":"No. It changes the application and verification workflow; origin eligibility remains governed by the relevant scheme and trade agreement."}]'::jsonb,
  '{"title":"From exporter data to a Certificate of Origin","steps":["An exporter identifies the applicable certificate and origin criteria.","Business software sends permitted application data through the DGFT API.","The DGFT CoO system processes the application under the applicable scheme.","The issued certificate can support the relevant customs or trade purpose."]}'::jsonb,
  'published', now()
),
(
  '2026-09-08-pact-zero-emission-freight-platform',
  '2026-09-08',
  'NITI Aayog launches PACT to coordinate zero-emission freight projects',
  'NITI Aayog''s e-FAST India initiative launched the Platform for Aggregating Clean Transport (PACT) and introduced a Zero Emission Truck (ZET) Marketplace. The new platform is designed to bring freight demand, logistics firms, manufacturers, financiers and charging providers together around deployable electric-truck projects.',
  'For Environment, Economy and transport policy, this illustrates a market-enabling government role. It is not a new blanket subsidy for every truck: the stated purpose is to aggregate demand, improve charging planning and strengthen the commercial case for medium- and heavy-duty electric vehicles.',
  'e-FAST India is a NITI Aayog-led platform focused on the transition to zero-emission freight, especially in medium- and heavy-duty vehicles. Heavy freight is difficult to electrify because routes, vehicle utilisation, charging needs, financing and purchase commitments must align. PACT is intended to convert that coordination problem into corridor-based deployment opportunities. The ZET Marketplace is a business-engagement forum for the relevant ecosystem; neither platform removes the need for project finance, charging infrastructure or applicable transport and electricity approvals.',
  'e-FAST India, an initiative of NITI Aayog, launches PACT to support accelerated zero-emission freight deployment in India',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307592&lang=1&reg=3',
  'NITI Aayog / Press Information Bureau',
  '2026-09-07',
  '["PACT expands to Platform for Aggregating Clean Transport.", "PACT is an initiative under NITI Aayog''s e-FAST India platform.", "It aims to aggregate demand and coordinate shippers, logistics providers, manufacturers, financiers and charging partners.", "The ZET Marketplace is focused on commercial and partnership links for zero-emission trucks."]'::jsonb,
  '[{"question":"Is PACT itself a direct purchase subsidy for every electric truck?","answer":"No. The launch describes a coordination platform that aggregates demand and supports commercially viable zero-emission freight projects."},{"question":"What segment is central to e-FAST India in this release?","answer":"Medium- and heavy-duty freight vehicles, including electric trucks."}]'::jsonb,
  '{"title":"Why freight electrification needs coordination","steps":["Shippers and logistics providers signal freight demand.","PACT aggregates demand around suitable corridors.","Vehicle makers, financiers and charging providers align their offers.","Projects can move from isolated pilots toward deployable zero-emission freight operations."]}'::jsonb,
  'published', now()
),
(
  '2026-09-08-eci-bye-election-schedule-october',
  '2026-09-08',
  'Election Commission schedules six bye-elections for October',
  'The Election Commission announced bye-elections for five Assembly constituencies in Tamil Nadu, Puducherry and West Bengal, and for the Nagaon parliamentary constituency in Assam. Polling is scheduled for 6 October 2026 and counting for 9 October 2026.',
  'This is a Polity and election-administration update. It is a compact revision prompt for the election timetable and for the distinction between an Assembly constituency (AC) and a parliamentary constituency (PC).',
  'A bye-election fills a vacancy that arises during the life of a legislature; it is not a general election for every seat in the House. The Commission''s release names Madurantakam (SC) and Dharapuram (SC) in Tamil Nadu, Thattanchavady in Puducherry, Rejinagar and Nandigram in West Bengal, and Nagaon PC in Assam. The schedule places the Gazette notification on 9 September, nominations by 16 September, scrutiny on 17 September and withdrawal by 19 September. The Commission said EVMs and VVPATs will be used at all polling stations for these polls.',
  'Schedule for bye-elections to 05 (Five) Assembly Constituencies of Tamil Nadu, Puducherry and West Bengal and 01(One) Parliamentary Constituency of Assam',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307574&lang=2&reg=48',
  'Election Commission of India / Press Information Bureau',
  '2026-09-07',
  '["The schedule covers five Assembly constituencies and one parliamentary constituency.", "Polling is scheduled for 6 October 2026 and counting for 9 October 2026.", "The Gazette notification is scheduled for 9 September 2026; nominations close on 16 September.", "Nagaon is the parliamentary constituency in the schedule; EVMs and VVPATs will be used in all polling stations."]'::jsonb,
  '[{"question":"What is a bye-election?","answer":"An election held to fill a vacancy arising in a seat during the term of a legislature."},{"question":"Which is the only parliamentary constituency in this 7 September schedule?","answer":"Nagaon in Assam; the other listed vacancies are Assembly constituencies."}]'::jsonb,
  '{"title":"Bye-election timeline in this schedule","steps":["Gazette notification: 9 September 2026.","Last date for nominations: 16 September; scrutiny: 17 September.","Withdrawal deadline: 19 September.","Polling: 6 October; counting: 9 October; completion by 11 October."]}'::jsonb,
  'published', now()
),
(
  '2026-09-08-ifsca-market-abuse-regulations',
  '2026-09-08',
  'IFSCA notifies market-abuse regulations for securities markets in IFSC',
  'The International Financial Services Centres Authority listed the IFSCA (Prohibition of Market Abuse in Securities Markets) Regulations, 2026 among its 7 September regulatory updates. The notification adds a current example of a specialised regulator issuing securities-market rules for India''s international financial-services-centre framework.',
  'This is an Economy and Polity institution question in the making. It helps students distinguish IFSCA''s IFSC-specific regulatory jurisdiction from the wider domestic securities-market jurisdiction associated with SEBI, while remembering that market integrity covers conduct as well as capital formation.',
  'IFSCA was established under the International Financial Services Centres Authority Act, 2019 and began functioning in 2020. It is the unified authority for developing and regulating financial products, financial services and financial institutions in India''s International Financial Services Centres; GIFT IFSC is the present IFSC. A regulation titled ''prohibition of market abuse'' concerns securities-market integrity in that jurisdiction. The notification should not be read as a statement that IFSCA replaces every domestic financial regulator across India: its statutory remit is the IFSC framework.',
  'IFSCA (Prohibition of Market Abuse in Securities Markets) Regulations, 2026',
  'https://ifsca.gov.in/',
  'International Financial Services Centres Authority',
  '2026-09-07',
  '["IFSCA listed the Prohibition of Market Abuse in Securities Markets Regulations, 2026 on 7 September 2026.", "IFSCA is the unified authority for financial products, services and institutions in India''s IFSCs.", "IFSCA was established under the International Financial Services Centres Authority Act, 2019.", "GIFT IFSC is India''s present International Financial Services Centre."]'::jsonb,
  '[{"question":"Which authority is the unified regulator for financial services in India''s IFSC framework?","answer":"The International Financial Services Centres Authority (IFSCA)."},{"question":"Does IFSCA''s IFSC remit mean it is the general domestic securities regulator for all of India?","answer":"No. Its statutory role is the IFSC framework; students should keep that jurisdiction distinct from the broader domestic securities-market framework."}]'::jsonb,
  '{"title":"Where IFSCA fits in financial regulation","steps":["The IFSCA Act, 2019 creates the IFSC-specific unified authority.","IFSCA regulates and develops financial products, services and institutions in IFSCs.","GIFT IFSC is the present Indian IFSC.","The 2026 market-abuse regulations address securities-market integrity within that jurisdiction."]}'::jsonb,
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
  '2026-09-08-dac-acceptance-of-necessity-capital-acquisition',
  '2026-09-08-ncap-swachh-vayu-sarvekshan-2026',
  '2026-09-08-dgft-certificate-of-origin-open-api',
  '2026-09-08-pact-zero-emission-freight-platform',
  '2026-09-08-eci-bye-election-schedule-october',
  '2026-09-08-ifsca-market-abuse-regulations'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
