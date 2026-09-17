-- 14 September 2026 daily current-affairs desk.
-- Eight original briefs, verified against competent official releases published on 14 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-14-semicon-india-2026-india-semiconductor-mission', '2026-09-14',
  'SEMICON India 2026 sets the semiconductor ecosystem agenda',
  'MeitY announced the fifth SEMICON India conference, scheduled at Yashobhoomi, New Delhi from 17 to 19 September. It is organised jointly by the India Semiconductor Mission, MeitY and SEMI, with the theme “Silicon to Systems: Building the Ecosystem.”',
  'This is a useful gateway to India’s semiconductor strategy. Do not treat a conference announcement as approval of a chip plant; its exam value is the institutional architecture and the value-chain vocabulary it brings together.',
  'The semiconductor chain includes design, fabrication, packaging, testing, equipment and materials. India Semiconductor Mission is the Government’s vehicle for developing a sustainable semiconductor and display ecosystem, while SEMI is a global industry association.',
  'Prime Minister Narendra Modi to Inaugurate Fifth Edition of SEMICON India 2026 on September 17',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309984&lang=1&reg=3',
  'Ministry of Electronics and Information Technology / Press Information Bureau', '2026-09-14',
  '["SEMICON India 2026 was scheduled for 17–19 September at Yashobhoomi, New Delhi.","It is jointly organised by ISM, MeitY and SEMI.","Its theme is Silicon to Systems: Building the Ecosystem.","A conference is an ecosystem-building platform, not itself a plant-approval order."]'::jsonb,
  '[{"question":"Which Government mission co-organises SEMICON India 2026?","answer":"The India Semiconductor Mission (ISM)."},{"question":"Name one stage beyond chip fabrication in the semiconductor value chain.","answer":"Design, packaging, testing, equipment or materials."}]'::jsonb,
  '{"title":"Semiconductor ecosystem","steps":["Policy and investment support build the ecosystem.","Design, fabrication and packaging need specialised capabilities.","Research, start-ups and industry connect through platforms such as SEMICON India.","Output strengthens resilient electronics supply chains."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-indian-air-force-dronathon-uas-roadmap', '2026-09-14',
  'IAF releases its UAS Roadmap at Dronathon 2026',
  'The Indian Air Force inaugurated its first Dronathon at Pokhran Field Firing Range, Jaisalmer. The three-day assessment brought defence firms, start-ups, MSMEs, DPSUs and innovators together to demonstrate unmanned aircraft systems in realistic operational conditions; the IAF also released its UAS Roadmap.',
  'The release connects Atmanirbhar Bharat in defence with operational testing. A roadmap signals capability priorities for industry and researchers; it is not the same as a procurement contract or induction of every demonstrated system.',
  'The demonstrations covered surveillance and reconnaissance, autonomy, swarming, electronic warfare and counter-UAS systems. The IAF also demonstrated Vayu UTtaM, its indigenous multi-mode unmanned traffic-management system, for detecting and tracking civil and military UAS.',
  'INDIAN AIR FORCE DRONATHON - 2026',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310246&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau', '2026-09-14',
  '["Dronathon 2026 was held at Pokhran Field Firing Range in Jaisalmer.","The IAF released a UAS Roadmap for capability priorities.","The assessed areas include UAS, swarming, electronic warfare and counter-UAS systems.","Vayu UTtaM is an indigenous multi-mode unmanned traffic-management system."]'::jsonb,
  '[{"question":"What does UAS stand for?","answer":"Unmanned Aircraft System."},{"question":"Does a UAS roadmap itself award a procurement contract?","answer":"No. It communicates capability priorities and can guide innovation."}]'::jsonb,
  '{"title":"UAS capability pathway","steps":["The IAF identifies operational requirements.","Industry demonstrates systems under realistic conditions.","A roadmap clarifies priorities for indigenous innovation.","Testing and later procurement are separate decisions."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-samudra-laksamana-india-malaysia', '2026-09-14',
  'INS Mysore completes Exercise Samudra Laksamana with Malaysia',
  'Indian Naval Ship Mysore concluded participation in the fourth Exercise Samudra Laksamana with the Royal Malaysian Navy at Lumut, Malaysia. The exercise ran from 9 to 12 September and included harbour engagements followed by maritime operations at sea with RMN ships KD Lekir and KD Gagah Samudera.',
  'This is a bilateral naval-interoperability item. Keep the partner, location and exercise character straight: it is an India–Malaysia engagement, not a multilateral ASEAN naval exercise.',
  'In the harbour phase, the two navies exchanged professional experience. At sea, they practised coordinated maritime evolutions, helping build operational coordination. The release links the exercise to the wider India–Malaysia maritime partnership and MAHASAGAR vision.',
  'INS MYSORE CONCLUDES PARTICIPATION IN THE 4TH EDITION OF EXERCISE SAMUDRA LAKSAMANA AT LUMUT, MALAYSIA',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310000&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau', '2026-09-14',
  '["Samudra Laksamana is a bilateral India–Malaysia naval exercise.","The fourth edition was held at Lumut, Malaysia.","INS Mysore exercised with the Royal Malaysian Navy ships KD Lekir and KD Gagah Samudera.","Harbour interactions and sea operations serve different parts of interoperability-building."]'::jsonb,
  '[{"question":"Which country is India’s partner in Exercise Samudra Laksamana?","answer":"Malaysia."},{"question":"Which Indian ship participated in the fourth edition?","answer":"INS Mysore."}]'::jsonb,
  '{"title":"Bilateral naval exercise","steps":["Partner navies meet in harbour for professional exchanges.","Ships move to sea for coordinated evolutions.","Crews refine communication and operational coordination.","Repeated exercises strengthen maritime interoperability."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-india-mercosur-pta-expansion-negotiations', '2026-09-14',
  'India and MERCOSUR launch talks to expand their preferential trade agreement',
  'India and MERCOSUR announced the launch of negotiations to expand their Preferential Trade Agreement. The parties agreed to finalise terms of reference that will set the scope and structure of a future expanded agreement.',
  'The wording matters for exams: talks have begun, but the expanded agreement is not yet concluded or in force. A PTA gives preferential treatment to agreed products; it is generally narrower than a comprehensive free-trade agreement.',
  'MERCOSUR is the Southern Common Market. In this announcement, Uruguay acted through the bloc’s Pro Tempore Presidency; the future negotiating terms are still being finalised.',
  'LAUNCHING OF NEGOTIATIONS FOR THE EXPANSION OF THE INDIA-MERCOSUR PREFERENTIAL TRADE AGREEMENT',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310166&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-14',
  '["India and MERCOSUR launched negotiations to expand their PTA.","The terms of reference are still to be finalised.","A PTA grants preferences on agreed trade lines and need not cover all trade.","Uruguay acted in the exercise of MERCOSUR’s Pro Tempore Presidency in this announcement."]'::jsonb,
  '[{"question":"Has the expanded India–MERCOSUR agreement entered into force?","answer":"No. The parties launched negotiations and are finalising terms of reference."},{"question":"What is a PTA?","answer":"A Preferential Trade Agreement, which grants agreed preferential treatment in trade."}]'::jsonb,
  '{"title":"PTA expansion sequence","steps":["Existing preferential framework provides a base.","Parties launch negotiations.","Terms of reference define scope and structure.","A final agreement would require completion of the agreed process before implementation."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-india-mercosur-electronic-certificates-origin-protocol', '2026-09-14',
  'India–MERCOSUR protocol enables electronic Certificates of Origin',
  'India and MERCOSUR signed the First Additional Protocol to their Preferential Trade Agreement to facilitate acceptance of electronic Certificates of Origin. The protocol is intended to support paperless trade and modernise customs procedures.',
  'A Certificate of Origin is central to preferential trade because customs authorities use it to assess whether goods satisfy agreed origin rules. An electronic certificate modernises proof and processing; it does not by itself change the tariff preference or rules of origin.',
  'The announcement distinguishes the signed protocol from the separately launched negotiations for a wider PTA expansion. MERCOSUR’s founding members are Argentina, Brazil, Paraguay and Uruguay.',
  'India and MERCOSUR Sign First Additional Protocol to Facilitate Electronic Certificates of Origin',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310083&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-14',
  '["The First Additional Protocol concerns electronic Certificates of Origin.","It operates under the India–MERCOSUR Preferential Trade Agreement.","Certificates of Origin help establish eligibility for preferential treatment.","Electronic proof supports paperless trade and customs modernisation; it does not automatically alter tariff preference."]'::jsonb,
  '[{"question":"Why is a Certificate of Origin important in a preferential-trade arrangement?","answer":"It helps customs establish whether goods qualify under the agreed origin rules."},{"question":"Does electronic issuance automatically create a new tariff concession?","answer":"No. It changes the documentation process, not the underlying preference by itself."}]'::jsonb,
  '{"title":"Electronic Certificate of Origin","steps":["Origin rules determine eligibility for preference.","Exporter supplies proof of origin.","Electronic certification enables paperless submission.","Customs verifies the claim and applies the relevant preference."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-wpi-august-2026-base-2022-23', '2026-09-14',
  'Wholesale-price inflation rises to 9.92% in August',
  'The Office of the Economic Adviser released provisional August 2026 Wholesale Price Index data with the new 2022–23 base year. All-India WPI inflation was 9.92% year on year, compared with 9.78% in July; the all-commodities index moved from 110.0 to 110.8.',
  'WPI and CPI must not be used as interchangeable measures. WPI tracks wholesale-price movement, whereas CPI tracks retail consumer prices. The August WPI release is provisional and the relevant source release also carries revision information for earlier months.',
  'For August, the release gave year-on-year inflation of 7.76% for Primary Articles, 22.93% for Fuel and Power, and 8.37% for Manufactured Products. It also states that the final June estimate revised WPI inflation from 9.87% to 9.97%.',
  'Provisional Estimates of Wholesale Price Index (Base Year 2022-23) for the month of August 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309977&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-14',
  '["The WPI base year in this release is 2022–23.","All-India WPI inflation was 9.92% year on year in August 2026.","WPI measures wholesale-price movement and is distinct from consumer-price inflation.","The August estimate is provisional; earlier estimates can be revised in later releases."]'::jsonb,
  '[{"question":"Which index tracks wholesale rather than retail price movement?","answer":"Wholesale Price Index (WPI)."},{"question":"Were the August WPI estimates final?","answer":"No. They were provisional."}]'::jsonb,
  '{"title":"Reading a WPI release","steps":["The index uses a stated base year.","Month-on-month index levels are compiled.","Year-on-year change is reported as inflation.","Provisional data can be revised as responses are finalised."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-cpi-august-2026-base-2024-100', '2026-09-14',
  'Retail inflation is 4.82% in the August CPI release',
  'MoSPI’s August 2026 Consumer Price Index release, on base 2024=100, reported combined year-on-year CPI inflation of 4.82%. The corresponding rural and urban rates were 5.23% and 4.31%, while Consumer Food Price Index inflation was 5.95%.',
  'CPI is the retail-price index relevant to households and is distinct from WPI. The source labels the August figures provisional, so a sound answer should preserve both the index name and the provisional status.',
  'The statistics are compiled by the National Statistical Office under MoSPI. The release says field staff collect price data from selected urban markets, including online markets, and villages across States and Union Territories.',
  'PRESS RELEASE OF CONSUMER PRICE INDEX ON BASE 2024=100 FOR AUGUST, 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2310058&lang=1&reg=3',
  'Ministry of Statistics and Programme Implementation / Press Information Bureau', '2026-09-14',
  '["The CPI series in this release uses base 2024=100.","Combined CPI inflation for August 2026 was 4.82% year on year, provisionally.","Rural and urban CPI inflation were 5.23% and 4.31%, respectively.","CFPI is the Consumer Food Price Index and its reported inflation was 5.95%."]'::jsonb,
  '[{"question":"Which index measures food-price inflation in this release?","answer":"The Consumer Food Price Index (CFPI)."},{"question":"What is the CPI base year used here?","answer":"2024=100."}]'::jsonb,
  '{"title":"CPI reading map","steps":["NSO collects retail price quotations.","CPI measures consumer-price movement against its base year.","Headline and food indices produce year-on-year inflation rates.","Rural, urban and combined figures should be kept distinct."]}'::jsonb,
  'published', now()
),
(
  '2026-09-14-nmba-outreach-deaddiction-facilities', '2026-09-14',
  'NMBA reports expanded community outreach and de-addiction support',
  'The Ministry of Social Justice and Empowerment reported that Nasha Mukt Bharat Abhiyaan outreach had reached 34.54 crore citizens, including over 13.70 crore youth and 10.64 crore women. It also reported more than 1.67 lakh trained volunteers and personnel and over 755 new de-addiction facilities in the preceding two years.',
  'This is a social-sector delivery update, useful for distinguishing prevention, awareness, treatment and rehabilitation. Outreach statistics do not mean that every contacted person received clinical treatment.',
  'The release identifies District De-Addiction Centres, Addiction Treatment Facilities and de-addiction centres in jails among the additional facilities. It also locates financial assistance for preventive education, counselling, treatment and rehabilitation under NAPDDR.',
  'NMBA Reaches Out To 34.54 Crore Citizens Including Over 13.70 Crore Youth, 10.64 Crore Women',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310202&lang=1&reg=3',
  'Ministry of Social Justice and Empowerment / Press Information Bureau', '2026-09-14',
  '["NMBA is Nasha Mukt Bharat Abhiyaan.","The release reports outreach of 34.54 crore citizens.","More than 755 new de-addiction facilities were reported over the preceding two years.","NAPDDR provides assistance for prevention, awareness, counselling, treatment and rehabilitation."]'::jsonb,
  '[{"question":"What does NMBA stand for?","answer":"Nasha Mukt Bharat Abhiyaan."},{"question":"Does outreach equal clinical treatment for every person reached?","answer":"No. Outreach, counselling, treatment and rehabilitation are distinct service stages."}]'::jsonb,
  '{"title":"Substance-use support continuum","steps":["Awareness helps prevention and early identification.","Community workers guide people to services.","Treatment facilities provide clinical support.","Counselling and rehabilitation support recovery and reintegration."]}'::jsonb,
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
where briefs.slug like '2026-09-14-%' and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
