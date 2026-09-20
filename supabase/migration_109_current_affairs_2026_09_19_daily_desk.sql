-- 19 September 2026 daily current-affairs desk: ten original, non-duplicate official briefs.
insert into public.current_affairs_briefs (slug, published_on, title, summary, why_it_matters, background, source_title, source_url, source_publisher, source_published_on, prelims_takeaways, quick_check, visual_data, status, reviewed_at) values
(
  '2026-09-19-sco-trade-ministers-2026-2030-action-plan','2026-09-19',
  'SCO trade ministers adopt a 2026–30 economic-cooperation action plan',
  'At the 25th meeting of SCO Ministers responsible for economic and trade activity in Dushanbe, ministers adopted a statement and agreed an Action Plan for 2026–30 to implement the SCO multilateral trade and economic-cooperation programme, subject to further approval by the Council of Heads of Government.',
  'This is an international-economic-cooperation item. An agreed action plan is not the same as a treaty already in force; remember the SCO forum, Dushanbe and the 2026–30 time frame.',
  'India highlighted security, connectivity and opportunity, including lower trade costs, resilient supply chains, digital payments, trade finance for MSMEs and a rules-based multilateral trading system with the WTO at its core.',
  '25th Meeting of SCO Ministers Responsible for Economic and Foreign Trade Activities Held in Tajikistan','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2311874&lang=1&reg=3','Ministry of Commerce and Industry / Press Information Bureau','2026-09-18',
  '["The meeting was held in Dushanbe, Tajikistan.","Ministers agreed a 2026–30 action plan for the SCO trade-and-economic programme.","Further approval by the SCO Council of Heads of Government is stated in the release.","India highlighted security, connectivity and opportunity for trade."]'::jsonb,
  '[{"question":"Which city hosted the 25th SCO trade-ministers meeting?","answer":"Dushanbe, Tajikistan."},{"question":"Does an agreed action plan automatically mean final operational approval?","answer":"No; the release records further approval by the Council of Heads of Government."}]'::jsonb,
  '{"title":"SCO economic-cooperation path","steps":["Ministers review trade cooperation.","They agree an action plan.","The Heads-of-Government mechanism considers further approval.","Members pursue implementation through SCO institutions."]}'::jsonb,'published',now()
),
(
  '2026-09-19-india-nepal-igsc-trade-transit','2026-09-19',
  'India–Nepal IGSC reviews trade, transit and anti-unauthorised-trade cooperation',
  'India and Nepal convened their Inter-Governmental Sub-Committee on Trade, Transit and Cooperation to Control Unauthorised Trade in New Delhi. The mechanism reviewed market access, customs, standards, food safety, phytosanitary measures, border infrastructure and rail-road connectivity.',
  'The IGSC is an institutional bilateral mechanism, not a new free-trade agreement. It is useful for questions on India–Nepal trade facilitation and the difference between legitimate-trade facilitation and controls against misuse.',
  'The two sides discussed pre-arrival information exchange, electronic verification of Certificates of Origin, customs automation, integrated check posts and land-port infrastructure, and agreed to maintain follow-up through established mechanisms.',
  'India–Nepal Inter-Governmental Sub-Committee on Trade, Transit and Cooperation to Control Unauthorised Trade Meets in New Delhi','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2311792&lang=1&reg=3','Ministry of Commerce and Industry / Press Information Bureau','2026-09-18',
  '["IGSC is an India–Nepal mechanism for trade, transit and cooperation against unauthorised trade.","The meeting reviewed customs, standards, food safety, phytosanitary issues and connectivity.","Electronic Certificate-of-Origin verification and customs automation were discussed.","Integrated Check Posts and land-port infrastructure support transit and border trade."]'::jsonb,
  '[{"question":"What does IGSC cover in this India–Nepal context?","answer":"Trade, transit and cooperation to control unauthorised trade."},{"question":"Is an institutional review meeting itself a new FTA?","answer":"No."}]'::jsonb,
  '{"title":"India–Nepal trade facilitation","steps":["Bilateral mechanism identifies trade and transit bottlenecks.","Customs and standards agencies coordinate.","Digital verification and border infrastructure support legitimate trade.","Follow-up continues through established institutions."]}'::jsonb,'published',now()
),
(
  '2026-09-19-trai-third-amendment-ucc','2026-09-19',
  'TRAI strengthens rules against unsolicited commercial communications',
  'TRAI issued the Telecom Commercial Communications Customer Preference (Third Amendment) Regulations, 2026, amending the 2018 framework against unsolicited commercial communications. The changes use AI/ML-assisted detection, lower the complaint trigger when corroborated by an AI flag, regulate application-to-person calls and create a consumer appeal route.',
  'This is a final regulation, not the consultation draft that preceded it. It connects consumer protection, telecom regulation and platform accountability.',
  'New Regulation 21A requires telecom service providers to identify high-probability UCC sender numbers and share information. Complaint action can begin with three unique complaints in ten days where the sender is also AI/ML-flagged; previously the stated threshold was five complaints.',
  'TRAI Strengthens Framework for Curbing Unsolicited Commercial Communications through Technology-Driven Enforcement and Enhanced Consumer Protection','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2311989&lang=1&reg=3','Telecom Regulatory Authority of India / Press Information Bureau','2026-09-18',
  '["TRAI amended the TCCCPR, 2018 through its Third Amendment Regulations, 2026.","AI/ML-assisted detection is incorporated into enforcement.","Three unique complaints in ten days can trigger action when corroborated by an AI/ML flag.","A2P calls and a consumer appeal mechanism are expressly addressed."]'::jsonb,
  '[{"question":"Which regulator issued the UCC amendment?","answer":"TRAI."},{"question":"Is the 2026 publication a consultation draft?","answer":"No; it is the final amendment regulation."}]'::jsonb,
  '{"title":"UCC enforcement loop","steps":["Providers detect suspected UCC.","AI/ML signals and consumer complaints are corroborated.","TRAI rules trigger graded action against senders.","Consumers can use complaint and appeal mechanisms."]}'::jsonb,'published',now()
),
(
  '2026-09-19-sugar-bulk-consumer-stockholding','2026-09-19',
  'Government conditionally relaxes sugar stockholding for bulk consumers',
  'The Government relaxed the sugar stockholding limit for bulk consumers from 15 to 30 days, but only where the stock beyond 15 days is sourced exclusively from sugar imported through the Advance Authorisation Scheme or Tariff Rate Quota. Open-market purchases remain limited to 15 days’ consumption.',
  'The conditionality is the exam point: this is not an unrestricted doubling of all bulk-consumer stock. It links stock management to specified import channels and weekly disclosure requirements.',
  'Bulk consumers must declare sugar stocks weekly through the Department of Food and Public Distribution portal. The release also notes the increased Fair and Remunerative Price of Rs 365 per quintal from 1 October 2026.',
  'Government Relaxes Sugar Stockholding Limit for Bulk Consumers from 15 to 30 Days','https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311960&lang=1&reg=3','Ministry of Consumer Affairs, Food and Public Distribution / Press Information Bureau','2026-09-18',
  '["Bulk-consumer stockholding is relaxed from 15 to 30 days only conditionally.","Stock beyond 15 days must be sourced through AAS or TRQ imports.","Open-market purchase remains limited to 15 days’ consumption.","Bulk consumers must disclose stocks weekly through the Department portal."]'::jsonb,
  '[{"question":"Can bulk consumers source their additional 15 days of sugar stock freely from the open market?","answer":"No; it must be sourced through specified AAS or TRQ imports."},{"question":"What is the unchanged open-market stockholding limit?","answer":"15 days’ consumption."}]'::jsonb,
  '{"title":"Conditional sugar-stock rule","steps":["Open-market stock stays capped at 15 days.","Additional stock is allowed only through specified import channels.","Bulk consumers disclose holdings weekly.","Government monitors availability and prices."]}'::jsonb,'published',now()
),
(
  '2026-09-19-hal-aerospace-platform-handover','2026-09-19',
  'HAL hands over indigenous trainer aircraft and Dhruv NG helicopters',
  'HAL handed over two LCA Tejas Final Operational Clearance twin-seater trainers and three HTT-40 basic trainers to the Indian Air Force, and four Dhruv Next Generation helicopters to Pawan Hans Limited. The LCA trainers are the final two aircraft under the FOC contract.',
  'This is a concrete indigenous-aerospace delivery milestone. Keep platform roles distinct: Tejas twin-seaters and HTT-40s are training platforms, while Dhruv NG helicopters were delivered for civil operations to Pawan Hans.',
  'The release says the LCA trainers support an indigenous training continuum into frontline fighter operations, while HTT-40 addresses basic IAF training requirements that had earlier relied on imported aircraft.',
  'HAL hands over 2 LCA FOC Twin Seater Trainers & 3 HTT 40 Basic Trainers to IAF and 4 Dhruv NG helicopters to PHL','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2312215&lang=1&reg=3','Ministry of Defence / Press Information Bureau','2026-09-18',
  '["HAL delivered two Tejas FOC twin-seater trainers and three HTT-40 trainers to the IAF.","Four Dhruv NG helicopters were handed to Pawan Hans Limited.","The two Tejas trainers were the final aircraft under the FOC contract.","HTT-40 is an indigenous basic trainer aircraft."]'::jsonb,
  '[{"question":"Which organisation received the Dhruv NG helicopters?","answer":"Pawan Hans Limited."},{"question":"What is HTT-40’s primary role in this release?","answer":"Basic flight training."}]'::jsonb,
  '{"title":"Indigenous aerospace delivery","steps":["HAL develops and produces platforms.","Trainer aircraft support IAF pilot training.","Civil helicopters support Pawan Hans operations.","Delivery demonstrates separate defence and civil aerospace uses."]}'::jsonb,'published',now()
),
(
  '2026-09-19-second-ngmv-steel-cutting','2026-09-19',
  'Steel cutting starts construction of the second Next Generation Missile Vessel',
  'Steel cutting for the second ship of the Indian Navy’s Next Generation Missile Vessel project was held at Cochin Shipyard in Kochi. The NGMV construction contract with Cochin Shipyard was concluded in March 2023.',
  'Steel cutting is an early shipbuilding milestone, not commissioning or induction. It signals that physical construction of a hull has begun.',
  'The release says NGMVs are planned with state-of-the-art weapons and sensors and that major role-defining equipment is being indigenously developed and manufactured, linking the project to Make in India and Atmanirbhar Bharat.',
  'STEEL CUTTING OF SECOND NEXT GENERATION MISSILE VESSEL FOR INDIAN NAVY AT COCHIN SHIPYARD','https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311806&lang=1&reg=3','Ministry of Defence / Press Information Bureau','2026-09-18',
  '["Steel cutting was held for the second NGMV at Cochin Shipyard, Kochi.","The NGMV construction contract was concluded in March 2023.","Steel cutting begins physical construction and is not ship commissioning.","The release links role-defining equipment to indigenous development and manufacture."]'::jsonb,
  '[{"question":"What does steel cutting signify in shipbuilding?","answer":"The start of physical construction, not commissioning."},{"question":"Which shipyard is building the second NGMV?","answer":"Cochin Shipyard Limited."}]'::jsonb,
  '{"title":"Shipbuilding milestones","steps":["A construction contract is concluded.","Steel cutting begins hull construction.","Outfitting and trials follow.","A ship is commissioned only after completion and acceptance."]}'::jsonb,'published',now()
),
(
  '2026-09-19-nso-district-labour-market-snapshot','2026-09-19',
  'NSO releases first district-level labour-market snapshot',
  'The National Statistical Office released district-level key labour-market indicators for the first time, using the usual-status approach. It reports that around 57.8% of districts had female labour-force participation of 40% or above and that over 75% of districts had youth NEET rates below 30%.',
  'This extends labour-market analysis below the State level. Recall the indicators separately: LFPR measures the labour force, WPR those working, UR unemployment within the labour force, and NEET young people not in employment, education or training.',
  'Among the 100 most populous districts, Surat recorded the highest LFPR and WPR in the release. The figures are explicitly usual-status estimates, so they should not be mixed with the Current Weekly Status monthly PLFS figures.',
  'Labour Market Snapshot of Selected Districts','https://www.pib.gov.in/PressReleasePage.aspx?PRID=2312001&lang=1&reg=3','Ministry of Statistics and Programme Implementation / Press Information Bureau','2026-09-18',
  '["NSO released district-level key labour-market indicators for the first time.","The release uses the usual-status approach.","LFPR, WPR, UR and NEET are different measures.","Around 57.8% of districts recorded female LFPR of 40% or above."]'::jsonb,
  '[{"question":"Which statistical body issued the district labour-market snapshot?","answer":"The National Statistical Office (NSO)."},{"question":"Can usual-status figures be treated as the same series as Current Weekly Status figures?","answer":"No; they use different reference approaches."}]'::jsonb,
  '{"title":"District labour-market indicators","steps":["NSO estimates district labour indicators.","LFPR identifies the labour force.","WPR identifies those working and UR unemployment within the labour force.","NEET gives a youth education-and-employment indicator."]}'::jsonb,'published',now()
),
(
  '2026-09-19-chouk-karjat-rail-doubling','2026-09-19',
  'Railways approves Chouk–Karjat doubling to add Maharashtra capacity',
  'Indian Railways approved doubling of the 10.86-km Chouk–Karjat section of Central Railway at a cost of Rs 497 crore. The section is on the Panvel–Chouk–Karjat route and the approval is under umbrella works for capacity augmentation.',
  'Doubling expands capacity on an existing single-line stretch; it is distinct from sanctioning a brand-new line. The project is an approval, not a completed rail service upgrade.',
  'The release expects five additional passenger trains in each direction per day after completion and additional freight traffic of 18.35 MTPA, alongside lower freight-train detention.',
  'Indian Railways Approves Doubling of Chouk-Karjat Railway Section in Maharashtra at a Cost of ₹497 Crore','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2311826&lang=1&reg=3','Ministry of Railways / Press Information Bureau','2026-09-18',
  '["The Chouk–Karjat doubling project is 10.86 km long.","It is on the Panvel–Chouk–Karjat route in Maharashtra.","The stated cost is Rs 497 crore.","It is expected to support 18.35 MTPA additional freight after completion."]'::jsonb,
  '[{"question":"What is the main infrastructure intervention at Chouk–Karjat?","answer":"Doubling of an existing rail section."},{"question":"Is the project already complete?","answer":"No; the release records approval."}]'::jsonb,
  '{"title":"Rail-doubling capacity effect","steps":["A single-line bottleneck constrains movements.","Doubling adds parallel track capacity.","Passenger and freight paths can increase after completion.","Network congestion and detention can reduce."]}'::jsonb,'published',now()
),
(
  '2026-09-19-semicon-2-six-pillar-programme','2026-09-19',
  'Semicon 2.0 broadens India’s chip programme across six pillars',
  'The official semiconductor backgrounder states that the Union Cabinet approved Semicon 2.0 in July 2026 with an outlay of Rs 1,27,500 crore. It expands the focus beyond fabs and ATMP/OSAT into research and development, chip design, machines and materials, more fabs, talent and advanced packaging.',
  'This is policy architecture, not merely a SEMICON India event. The distinction between Semicon 1.0’s initial manufacturing focus and Semicon 2.0’s broader ecosystem approach is exam-relevant.',
  'The six pillars are research and development; design; machines and materials; fabs; ATMP/OSAT; and talent development. The programme seeks sustained support across the semiconductor value chain.',
  'India Building Semiconductor Future','https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160020&lang=1&reg=48','Press Information Bureau / India Semiconductor Mission context','2026-09-17',
  '["Semicon 2.0 was approved with an outlay of Rs 1,27,500 crore.","It broadens support from fabs and ATMP/OSAT to six ecosystem pillars.","The pillars include R&D, design, machines and materials, fabs, ATMP/OSAT and talent.","It is a programme framework, not a single semiconductor plant approval."]'::jsonb,
  '[{"question":"Name two Semicon 2.0 pillars beyond fabrication.","answer":"Any two of R&D, chip design, machines and materials, ATMP/OSAT, or talent development."},{"question":"Does Semicon 2.0 refer to one fab?","answer":"No; it is a broader ecosystem programme."}]'::jsonb,
  '{"title":"Semicon 2.0 ecosystem","steps":["R&D and design build knowledge capability.","Machines and materials support production.","Fabs and ATMP/OSAT create manufacturing capacity.","Talent connects the full semiconductor value chain."]}'::jsonb,'published',now()
),
(
  '2026-09-19-nasha-mukt-yuva-100-week-campaign','2026-09-19',
  'Nasha Mukt Yuva campaign begins a 100-week youth-prevention cycle',
  'The Rashtriya Sankalp Samaroh marked the start of the Nasha Mukt Yuva for Viksit Bharat 100 Weeks Nasha Mukt Yuva Abhiyan. Day one involved 259 institutions across all 28 States and eight Union Territories, with MY Bharat and the National Service Scheme supporting participation.',
  'This is a youth-led prevention campaign and should be distinguished from clinical de-addiction services under health or social-justice programmes. Its stated focus is sustained awareness, health, fitness and life-skills engagement.',
  'The campaign is structured as a 100-week/100-Sunday movement. Its first activity cycle is My Health, My Pride, followed by Fit Youth, Addiction-Free Youth and Life Skills Month.',
  'Rashtriya Sankalp Samaroh Marks the Beginning of 100 Weeks Nasha Mukt Yuva Abhiyan','https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2312210&lang=1&reg=3','Ministry of Youth Affairs and Sports / Press Information Bureau','2026-09-18',
  '["The campaign is named Nasha Mukt Yuva for Viksit Bharat.","It is structured as a 100-week/100-Sunday movement.","MY Bharat and NSS supported the nationwide opening activities.","Its focus is youth prevention, awareness, fitness and life skills."]'::jsonb,
  '[{"question":"Which two youth institutions are named as collaborators?","answer":"MY Bharat and the National Service Scheme (NSS)."},{"question":"Is this campaign itself a clinical de-addiction facility programme?","answer":"No; it is a youth prevention and engagement campaign."}]'::jsonb,
  '{"title":"Youth prevention campaign","steps":["Institutions mobilise young participants.","Pledges and activities promote awareness.","Fitness and life skills reinforce prevention.","A 100-week cycle sustains engagement beyond a single event."]}'::jsonb,'published',now()
)
on conflict (slug) do update set title=excluded.title,summary=excluded.summary,why_it_matters=excluded.why_it_matters,background=excluded.background,source_title=excluded.source_title,source_url=excluded.source_url,source_publisher=excluded.source_publisher,source_published_on=excluded.source_published_on,prelims_takeaways=excluded.prelims_takeaways,quick_check=excluded.quick_check,visual_data=excluded.visual_data,status=excluded.status,reviewed_at=excluded.reviewed_at,updated_at=now();

insert into public.current_affairs_exam_tags (brief_id,exam_id)
select briefs.id,exams.id from public.current_affairs_briefs briefs cross join public.exams exams
where briefs.slug like '2026-09-19-%' and exams.slug in ('cuet','ssc-cgl','uppsc-ro-aro','up-secretariat-ro-aro')
on conflict do nothing;
