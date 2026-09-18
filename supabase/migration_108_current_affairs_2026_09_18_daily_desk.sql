-- 18 September 2026 daily current-affairs desk.
-- Nine original briefs verified against primary official releases posted on 17 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-18-india-new-zealand-fta-domestic-legislation', '2026-09-18',
  'New Zealand passes legislation to implement the India-New Zealand FTA',
  'New Zealand''s Parliament passed legislation on 16 September to give effect to the India-New Zealand Free Trade Agreement signed in New Delhi on 27 April 2026. India said both countries are completing their domestic processes before the agreement enters into force.',
  'The key legal distinction is between signing a treaty, passing domestic implementing law, and entry into force. Parliament''s action is a major implementation step, but the release does not say the FTA is already operational.',
  'The release says the agreement will provide duty-free access for 100% of Indian exports to New Zealand from entry into force, while creating preferential access for specified New Zealand exports to India. It also covers services, investment and mobility provisions.',
  'India Welcomes Passage of New Zealand Legislation to Give Effect to India-New Zealand FTA',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311537&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau', '2026-09-17',
  '["The India-New Zealand FTA was signed on 27 April 2026.","New Zealand''s Parliament passed implementing legislation on 16 September 2026.","The release says the parties are still completing domestic processes for entry into force.","A signed agreement, domestic legislation and entry into force are distinct stages."]'::jsonb,
  '[{"question":"Does passage of implementing legislation automatically mean an FTA is already in force?","answer":"No. The parties must complete the required process for entry into force."},{"question":"What access is stated for Indian exports once this FTA enters into force?","answer":"Duty-free access for 100% of Indian exports to New Zealand."}]'::jsonb,
  '{"title":"FTA implementation sequence","steps":["Countries sign the agreement.","Each side completes its domestic legal process.","The parties complete entry-into-force requirements.","Tariff and other commitments become operational."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-commercial-coal-auctions-sixteenth-round', '2026-09-18',
  'Sixteenth commercial coal-auction round opens with 25 blocks',
  'The Ministry of Coal launched the sixteenth round of commercial coal-mine auctions and executed Coal Mine Development and Production Agreements for six mines auctioned earlier. The new round offers 25 blocks: 21 fully explored and four partially explored.',
  'This is a structural mining-sector update. A block being offered, an agreement being executed and a mine becoming operational are separate stages that should not be collapsed into one claim.',
  'The 25 blocks span nine coal-bearing States. Six are offered under the Coal Mines (Special Provisions) Act and 19 under the Mines and Minerals (Development and Regulation) Act; the release places commercial coal mining in the reform process begun in 2020.',
  'Ministry of Coal Successfully Launches 16th Round of Commercial Coal Mine Auctions; Executes CMDPAs for Six Coal Mines',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311453&lang=1&reg=3',
  'Ministry of Coal / Press Information Bureau', '2026-09-17',
  '["The sixteenth round offers 25 coal blocks: 21 fully explored and four partially explored.","Six blocks are offered under CMSP and 19 under the MMDR Act.","CMDPA means Coal Mine Development and Production Agreement.","Auction, agreement execution and operational production are different project stages."]'::jsonb,
  '[{"question":"How many blocks are offered in the sixteenth commercial coal-auction round?","answer":"25 blocks."},{"question":"What does CMDPA stand for?","answer":"Coal Mine Development and Production Agreement."}]'::jsonb,
  '{"title":"Commercial coal-mine pathway","steps":["Government offers blocks through an auction round.","Successful bidders execute CMDPAs.","Mine development and statutory clearances follow.","Production begins only after the required stages are complete."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-sambalpur-doppler-weather-radar-mission-mausam', '2026-09-18',
  'Sambalpur gets India''s 51st Doppler Weather Radar',
  'India inaugurated its 51st Doppler Weather Radar at Sambalpur, Odisha. The Ministry of Earth Sciences says the installation will strengthen weather monitoring for western Odisha and adjoining areas.',
  'Doppler Weather Radars are part of the observing system that supports nowcasting and early warnings. They are not the same as satellite observation or a weather forecast by themselves.',
  'The official release says the national DWR network has risen from 14 in 2014 to 51, with around 40 more radars planned under Mission Mausam. It links denser observation data with agriculture, disaster management, and power and energy management.',
  'Union Minister Dr. Jitendra Singh Inaugurates India''s 51st Doppler Weather Radar at Sambalpur Odisha',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311270&lang=1&reg=3',
  'Ministry of Earth Sciences / Press Information Bureau', '2026-09-17',
  '["The Sambalpur installation is India''s 51st Doppler Weather Radar.","It is located in Odisha and strengthens monitoring for western Odisha and adjoining regions.","Mission Mausam is linked to the planned expansion of weather-observation capability.","A Doppler radar is an observation tool that supports forecasts and early warnings."]'::jsonb,
  '[{"question":"Which State hosts India''s 51st Doppler Weather Radar?","answer":"Odisha, at Sambalpur."},{"question":"Does a Doppler Weather Radar itself issue every weather forecast?","answer":"No. It supplies observation data that supports forecasting and warnings."}]'::jsonb,
  '{"title":"Weather-warning chain","steps":["Radar observes precipitation and wind-related signals.","IMD combines observations with other data and models.","Forecasters issue location-specific warnings.","Users apply warnings to disaster, farm and infrastructure decisions."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-primary-teacher-education-bridge-course', '2026-09-18',
  'NIOS launches a bridge course for eligible primary teachers',
  'The Education Ministry launched a six-month Certificate (Bridge) Course in Primary Teacher Education for in-service primary teachers with a B.Ed. degree. It is implemented through the National Institute of Open Schooling and is designed for teaching Classes I to V.',
  'The course is a targeted teacher-qualification and professional-development measure, not a new degree open to every applicant. Its eligibility is tied to the specified group of in-service primary teachers and the NCTE framework.',
  'The release says the course includes six theory papers, at least 10 days of online contact classes and at least 20 days of school-based experience. It follows the Supreme Court''s 2024 Devesh Sharma decision and is delivered through open and distance learning.',
  'Union Minister for Education launches the six-month Certificate (Bridge) Course in Primary Teacher Education',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311284&lang=1&reg=3',
  'Ministry of Education / Press Information Bureau', '2026-09-17',
  '["The course is implemented through the National Institute of Open Schooling (NIOS).","It is a six-month Certificate (Bridge) Course in Primary Teacher Education.","It concerns eligible in-service teachers for Classes I to V with a B.Ed. degree.","The course is designed under the National Council for Teacher Education framework."]'::jsonb,
  '[{"question":"Which institution implements the Primary Teacher Education bridge course?","answer":"The National Institute of Open Schooling (NIOS)."},{"question":"Which classes are covered by the stated primary-teaching focus?","answer":"Classes I to V."}]'::jsonb,
  '{"title":"Targeted teacher bridge course","steps":["Eligible in-service teachers apply through NIOS.","Theory learning is paired with contact classes.","School-based practicum tests classroom application.","Successful completion supports the specified primary-teaching pathway."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-stem-cell-therapy-regulation-advisory', '2026-09-18',
  'Health Ministry tightens the distinction between approved and unproven stem-cell therapy',
  'The Health Ministry issued an advisory to States and Union Territories that have adopted the Clinical Establishments (Registration and Regulation) Act, 2010. Standard clinical stem-cell therapy is to be limited to disease conditions or indications in the Ministry-approved list.',
  'The advisory is important for health regulation and research ethics. It does not ban all stem-cell research: clinical trials with necessary approvals remain a different, regulated pathway from routine commercial treatment.',
  'For Autism Spectrum Disorder, therapeutic use of stem cells is restricted to duly approved clinical trials under the National Guidelines for Stem Cell Research, 2017. The advisory asks regulatory authorities and clinical establishments to ensure compliance.',
  'Union Health Ministry Issues Advisory on Regulation of Stem Cell Therapy',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311179&lang=1&reg=3',
  'Ministry of Health and Family Welfare / Press Information Bureau', '2026-09-17',
  '["The advisory applies to States and UTs that have adopted the Clinical Establishments Act, 2010.","Standard care is limited to Ministry-approved indications.","Stem-cell therapy for Autism Spectrum Disorder is restricted to duly approved clinical trials.","The cited research guideline is the National Guidelines for Stem Cell Research, 2017."]'::jsonb,
  '[{"question":"Can unproven stem-cell interventions be offered as routine commercial clinical services under this advisory?","answer":"No."},{"question":"What is the stated route for stem-cell therapy for Autism Spectrum Disorder?","answer":"Duly approved clinical trials."}]'::jsonb,
  '{"title":"Stem-cell regulatory distinction","steps":["Research proposals require the applicable approvals.","Approved indications may be offered as standard care.","Unproven interventions remain outside routine clinical practice.","Regulatory authorities oversee compliance and action on violations."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-ulb-solid-waste-lca-ghg-calculator', '2026-09-18',
  'PSA releases a life-cycle tool for lower-emission city waste planning',
  'The Office of the Principal Scientific Adviser released a Life Cycle Assessment framework and greenhouse-gas calculator web application for solid-waste management technologies. The tool is intended to help Urban Local Bodies compare waste-management pathways and carbon footprints.',
  'This is an evidence-support tool for municipal decision-making, not a new waste-management law. Life Cycle Assessment examines environmental impacts across a system rather than judging a technology from only one stage.',
  'The project was supported by the PSA Office and undertaken by IISc Bengaluru, IIT Madras and IIT (BHU). The calculator covers pathways such as anaerobic digestion, composting, recycling, waste-to-energy and landfilling, and reports net, avoided and logistics emissions.',
  'Principal Scientific Adviser launches Digital Platform to Optimise Waste Management in Cities',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311186&lang=1&reg=3',
  'Office of the Principal Scientific Adviser to the Government of India / Press Information Bureau', '2026-09-17',
  '["LCA means Life Cycle Assessment.","The GHG calculator is designed for Urban Local Bodies.","It compares solid-waste pathways such as composting, recycling, anaerobic digestion, waste-to-energy and landfilling.","The project aligns with Waste to Wealth and Swachh Bharat Mission-Urban objectives."]'::jsonb,
  '[{"question":"Which local institution is the intended user of the GHG calculator?","answer":"Urban Local Bodies."},{"question":"What does LCA stand for?","answer":"Life Cycle Assessment."}]'::jsonb,
  '{"title":"Evidence-led waste planning","steps":["A ULB enters current waste-management data.","The tool estimates emissions for relevant pathways.","Planners compare alternatives and trade-offs.","A lower-emission option can inform project reports and tenders."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-onetag-fastag-portability', '2026-09-18',
  'OneTag adds FASTag issuer portability through Rajmargyatra',
  'NHAI made the OneTag FASTag portability service available on the Rajmargyatra application. It lets a user change the issuer of a FASTag while retaining the physical tag already fixed to the vehicle.',
  'Portability improves consumer choice and interoperability in electronic toll collection. It is not a replacement for FASTag or a waiver of toll charges; it concerns the issuer-switching process.',
  'The release says a tag must be active and in good standing for 90 days before porting, and a successfully ported tag has a six-month cooling period before another port. NHAI reports FASTag penetration above 98% and around 13 crore users.',
  'NHAI Rajmargyatra App Hosts OneTag FASTag Portability Service',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311392&lang=1&reg=3',
  'Ministry of Road Transport and Highways / Press Information Bureau', '2026-09-17',
  '["OneTag allows a FASTag user to change issuer while retaining the existing physical tag.","The service is available through NHAI''s Rajmargyatra app.","The release states a 90-day active-and-good-standing condition before portability.","A ported tag has a six-month cooling period before it can be ported again."]'::jsonb,
  '[{"question":"Does OneTag require a user to obtain a new physical FASTag?","answer":"No. It retains the existing physical tag while changing issuer."},{"question":"Where is OneTag availability stated?","answer":"The NHAI Rajmargyatra app."}]'::jsonb,
  '{"title":"FASTag portability","steps":["User maintains an eligible active tag.","User selects an alternative issuer through Rajmargyatra.","The issuer changes while the physical tag remains.","A cooling period limits immediate repeated porting."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-textile-exports-august-2026', '2026-09-18',
  'Textile exports rise 16.1% year on year in August',
  'The Ministry of Textiles reported total textile exports of Rs 29,776 crore in August 2026, a year-on-year rise of 16.1% from Rs 25,656 crore in August 2025. Cumulative exports for April to August were reported at Rs 1.43 lakh crore, up 10.3%.',
  'This is a sectoral trade indicator, not a measure of India''s total merchandise exports. A careful answer should state the period, the textile-sector scope and whether the comparison is monthly year on year or cumulative.',
  'The release describes growth across cotton yarn, fabrics, made-ups and handloom products; man-made yarn, fabrics and made-ups; carpets; and handicrafts. Sectoral export data are useful for linking manufacturing, employment and external-sector questions.',
  'India''s Textile exports rise 16.1% to Rs 29,776 crore in August 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311463&lang=1&reg=3',
  'Ministry of Textiles / Press Information Bureau', '2026-09-17',
  '["The reported August 2026 textile-export value is Rs 29,776 crore.","The year-on-year increase is 16.1% over August 2025.","April-August 2026 cumulative textile exports are reported at Rs 1.43 lakh crore.","Textile exports are a sectoral measure, not total merchandise exports."]'::jsonb,
  '[{"question":"What was the reported year-on-year growth in textile exports for August 2026?","answer":"16.1%."},{"question":"Does this release measure all of India''s merchandise exports?","answer":"No. It reports the textile sector."}]'::jsonb,
  '{"title":"Reading sectoral export data","steps":["A ministry compiles export values for a defined sector.","The current month is compared with the same month a year earlier.","Cumulative fiscal-period performance is separately reported.","Segment detail explains where the sectoral change occurred."]}'::jsonb,
  'published', now()
),
(
  '2026-09-18-soil-carbon-payments-regenerative-agriculture', '2026-09-18',
  'First soil-carbon payments connect verified farm outcomes with income',
  'A government-supported release reported India''s first soil-carbon payments: Direct Benefit Transfer was initiated for 2,550 farmers in Punjab and Haryana who adopted regenerative practices. More than Rs 2.9 crore is stated to be disbursed.',
  'This is a carbon-market and sustainable-agriculture development. It is not a universal government subsidy: payments in this programme follow measurement and independent verification of greenhouse-gas reductions and increased soil carbon before credits are issued.',
  'The Aadi farmer-carbon programme was launched by Grow Indigo in 2019 with technical guidance from ICAR. The release names Direct Seeded Rice, reduced tillage and crop-residue management as examples of practices, and says farmers may choose an assured upfront payment or a share of net credit-sale revenue.',
  'India''s First Soil Carbon Payments Put Farmers at the Centre of Regenerative Agriculture',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2311218&lang=1&reg=3',
  'Ministry of Agriculture and Farmers Welfare / Press Information Bureau', '2026-09-17',
  '["DBT was initiated for 2,550 farmers in Punjab and Haryana under the reported programme.","The release states more than Rs 2.9 crore is to be disbursed.","The farmer-carbon programme is Aadi, launched by Grow Indigo in 2019 with ICAR technical guidance.","Carbon credits followed measurement and independent verification of the stated outcomes."]'::jsonb,
  '[{"question":"Is the reported soil-carbon payment a universal farm subsidy?","answer":"No. It is tied to a verified farmer-carbon programme."},{"question":"Name one practice cited in the programme.","answer":"Direct Seeded Rice, reduced tillage, or crop-residue management."}]'::jsonb,
  '{"title":"Farm carbon-payment chain","steps":["Farmers adopt specified regenerative practices.","Outcomes are measured and independently verified.","Eligible carbon credits are issued.","Farmers receive payment under the programme''s chosen revenue route."]}'::jsonb,
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
where briefs.slug like '2026-09-18-%' and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
