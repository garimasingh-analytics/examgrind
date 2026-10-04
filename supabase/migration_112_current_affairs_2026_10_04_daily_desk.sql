-- 4 October 2026 daily current-affairs desk.
-- Every brief was checked against the linked primary official source.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-04-green-energy-corridor-phase-three$$, $$2026-10-04$$,
  $$Cabinet clears Green Energy Corridor Phase-III for State-level renewable-power transmission$$,
  $$The Union Cabinet approved Green Energy Corridor Phase-III to strengthen Intra-State Transmission Systems for carrying up to 135 GW of renewable electricity. The scheme also provides for 50 GWh of battery energy storage to make the grid more flexible.$$,
  $$This links renewable-energy targets to the less-visible grid infrastructure required to use wind and solar power. Generation capacity alone cannot deliver electricity reliably without transmission and balancing support.$$,
  $$The scheme is targeted for completion by FY 2032-33 with a total project outlay of ₹1,86,405 crore and central financial support of ₹54,082 crore. State Transmission Utilities are the overall implementing agencies. Greenfield transmission projects use tariff-based competitive bidding, while brownfield strengthening is on a cost-plus basis.$$,
  $$Cabinet approves Green Energy Corridor Phase-III scheme for Development of Intra-State Transmission System with Battery Energy Storage Systems$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2316950&lang=1&reg=3$$,
  $$Ministry of New and Renewable Energy / Press Information Bureau$$, $$2026-09-30$$,
  $$["GEC-III strengthens Intra-State Transmission Systems, not interstate transmission alone.","It is designed to enable evacuation of up to 135 GW of renewable energy.","The scheme includes 50 GWh of Battery Energy Storage Systems.","The target completion year is FY 2032-33."]$$::jsonb,
  $$[{"question":"Why is battery storage included in GEC-III?","answer":"It helps address renewable-power intermittency, congestion and demand outside solar hours."},{"question":"Who is the overall implementing agency for the transmission component?","answer":"The State Transmission Utilities."}]$$::jsonb,
  $${"title":"Renewable power from plant to grid","steps":["Wind and solar projects generate variable electricity.","State transmission infrastructure carries power from generation areas.","Battery storage can absorb or supply electricity when needed.","A stronger grid improves reliable renewable-energy integration."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-rabi-msp-2027-28$$, $$2026-10-04$$,
  $$CCEA approves MSPs for six Rabi crops for marketing season 2027-28$$,
  $$The Cabinet Committee on Economic Affairs approved higher minimum support prices for all six mandated Rabi crops for marketing season 2027-28. Safflower received the largest absolute increase, ₹675 per quintal, followed by rapeseed and mustard at ₹413.$$,
  $$MSP is a high-frequency exam concept in agricultural policy. It is an announced support price, not a guarantee that every farmer will sell every unit to a government agency.$$,
  $$The announced MSPs are wheat ₹2,610, barley ₹2,286, gram ₹5,958, lentil ₹7,390, rapeseed and mustard ₹6,613, and safflower ₹7,215 per quintal. The release says these are aligned with the policy of setting MSP at at least 1.5 times the all-India weighted average cost of production.$$,
  $$Cabinet approves Minimum Support Prices (MSP) for Rabi Crops for Marketing Season 2027-28$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316956&lang=1&reg=3$$,
  $$Ministry of Agriculture and Farmers Welfare / Press Information Bureau$$, $$2026-09-30$$,
  $$["The decision covers six mandated Rabi crops for the 2027-28 marketing season.","Wheat MSP was set at ₹2,610 per quintal.","Safflower received the largest absolute increase: ₹675 per quintal.","Rapeseed and mustard MSP was set at ₹6,613 per quintal."]$$::jsonb,
  $$[{"question":"Which Rabi crop received the largest absolute MSP increase in this decision?","answer":"Safflower, by ₹675 per quintal."},{"question":"Is MSP itself the same as universal government procurement?","answer":"No. MSP is a support-price announcement; procurement depends on the applicable arrangements."}]$$::jsonb,
  $${"title":"How an MSP decision is read","steps":["Government estimates relevant production costs.","CCEA approves crop-wise support prices for a marketing season.","The announced MSP signals the policy support level.","Procurement operations follow under applicable schemes and arrangements."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-cafe-norms-2027-32$$, $$2026-10-04$$,
  $$New CAFE norms set five-year fuel-economy framework for passenger vehicles$$,
  $$The Ministry of Power notified new Corporate Average Fuel Economy norms for passenger vehicles, effective from 1 April 2027 through 31 March 2032. The rules apply to new passenger vehicles made or imported for sale in India.$$,
  $$This is a regulatory response to transport energy use. CAFE is a manufacturer-level fleet-average efficiency framework; it is not a single mileage promise for each individual car.$$,
  $$The fuel-consumption benchmark tightens from 3.996 litres per 100 km in 2027-28 to 3.3273 litres per 100 km in 2031-32. The framework recognises technologies and provides compliance flexibilities, including specified credits and pathways for cleaner vehicle technologies.$$,
  $$New Corporate Average Fuel Economy (CAFE) Norms Notified$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316792&lang=1&reg=3$$,
  $$Ministry of Power / Press Information Bureau$$, $$2026-09-30$$,
  $$["The new CAFE norms run from 1 April 2027 to 31 March 2032.","They apply to new passenger vehicles manufactured or imported for sale in India.","The benchmark declines from 3.996 to 3.3273 litres per 100 km across the period.","CAFE means Corporate Average Fuel Economy."]$$::jsonb,
  $$[{"question":"Does CAFE prescribe the same fuel consumption for every car?","answer":"No. It sets fleet-average obligations for manufacturers."},{"question":"When do the new CAFE norms take effect?","answer":"1 April 2027."}]$$::jsonb,
  $${"title":"From vehicle fleets to energy efficiency","steps":["A manufacturer sells a mix of new passenger vehicles.","The fleet is assessed against prescribed average-efficiency targets.","Targets tighten over the five-year framework.","Technology choices and compliance mechanisms support lower fuel use."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-eci-sir-andhra-meghalaya-schedule$$, $$2026-10-04$$,
  $$Election Commission revises SIR schedule for Andhra Pradesh and Meghalaya$$,
  $$The Election Commission of India extended the Special Intensive Revision schedule in Andhra Pradesh and Meghalaya. The revised final-publication dates are 16 October for Andhra Pradesh and 26 October for Meghalaya.$$,
  $$Electoral-roll revision is important for prelims because it shows the Election Commission's administrative role. A revision schedule is not an election notification or a result declaration.$$,
  $$For Andhra Pradesh, the notice phase and disposal of claims and objections runs until 10 October 2026. The release gives Meghalaya's revised final-publication date as 26 October 2026.$$,
  $$Election Commission of India extends the SIR dates in Andhra Pradesh and Meghalaya$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317352&lang=1&reg=3$$,
  $$Election Commission of India / Press Information Bureau$$, $$2026-09-30$$,
  $$["SIR refers to Special Intensive Revision in this Election Commission update.","Andhra Pradesh's revised final-publication date is 16 October 2026.","Meghalaya's revised final-publication date is 26 October 2026.","Claims and objections in Andhra Pradesh run through 10 October 2026 under the revised schedule."]$$::jsonb,
  $$[{"question":"What is being revised in this ECI release?","answer":"The electoral-roll revision schedule, not an election result."},{"question":"Which State has a 26 October 2026 final-publication date?","answer":"Meghalaya."}]$$::jsonb,
  $${"title":"Electoral-roll revision timeline","steps":["The Election Commission sets a revision schedule.","Eligible persons may file claims or objections during the designated phase.","Authorities dispose of those claims and objections.","The revised roll is published on the notified date."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-free-space-qkd-demonstration$$, $$2026-10-04$$,
  $$India demonstrates a 5.56 km free-space quantum key-distribution link$$,
  $$QNu Labs, BISAG-N and IIT Gandhinagar demonstrated a 5.56 km free-space Quantum Key Distribution link between BISAG-N and IIT Gandhinagar. The trial produced secure keys that were used with a post-quantum cryptography platform to encrypt and decrypt test messages.$$,
  $$The development illustrates quantum communication and cybersecurity without overstating it as a nationwide deployment. QKD is a method for distributing cryptographic keys using quantum properties; it is distinct from ordinary data encryption alone.$$,
  $$The field trial took place on the night of 27-28 September. It used a free-space optical channel, reported a quantum-bit error rate below 5%, and generated keys at 230-260 bits per second. BISAG-N is an autonomous scientific society under MeitY.$$,
  $$India’s First 5.56 km Free-Space Quantum Key Distribution Link Demonstrated$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2318656&lang=1&reg=3$$,
  $$Ministry of Electronics and Information Technology / Press Information Bureau$$, $$2026-10-03$$,
  $$["QKD stands for Quantum Key Distribution.","The free-space link covered 5.56 km between BISAG-N and IIT Gandhinagar.","The trial combined QKD with a post-quantum cryptography-enabled platform.","BISAG-N is an autonomous scientific society under MeitY."]$$::jsonb,
  $$[{"question":"What is distributed through QKD?","answer":"Cryptographic keys, using quantum properties to help detect eavesdropping."},{"question":"Was this a nationwide quantum network rollout?","answer":"No. It was a 5.56 km field demonstration."}]$$::jsonb,
  $${"title":"A quantum-secure communication trial","steps":["A QKD device establishes a free-space optical key channel.","The parties generate and share a secure key.","A cryptographic platform uses that key for protected messages.","The field trial tests practical quantum-resilient communication."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-classical-language-centres-of-excellence$$, $$2026-10-04$$,
  $$Five Centres of Excellence approved for newly recognised Classical Languages$$,
  $$The Department of Higher Education approved five Centres of Excellence for Classical Assamese, Bengali, Marathi, Pali and Prakrit. The centres will support research, preservation, digitisation and wider dissemination of linguistic and literary heritage.$$,
  $$This is a culture-and-education institutional update. Students should learn the language-institution pair rather than treating all Centres as being in one central university.$$,
  $$The approved host institutions are Tezpur University for Assamese, Visva-Bharati for Bengali, Deccan College in Pune for Marathi, Central University of Odisha for Pali, and Central University of Gujarat for Prakrit.$$,
  $$Ministry of Education Approves Five Centres of Excellence for Studies in Classical Languages$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2318679&lang=1&reg=3$$,
  $$Department of Higher Education, Ministry of Education / Press Information Bureau$$, $$2026-10-03$$,
  $$["Five Centres of Excellence were approved for Assamese, Bengali, Marathi, Pali and Prakrit.","Tezpur University hosts the Classical Assamese centre.","Visva-Bharati hosts the Classical Bengali centre.","The centres focus on research, preservation, digitisation and dissemination."]$$::jsonb,
  $$[{"question":"Which institution will host the Centre of Excellence for Classical Pali?","answer":"The Central University of Odisha."},{"question":"What is one core purpose of these Centres?","answer":"Preservation and digitisation of linguistic and literary resources."}]$$::jsonb,
  $${"title":"Language heritage through academic institutions","steps":["A Classical Language is matched with a host institution.","The centre supports research and scholarly work.","Resources are documented, preserved and digitised.","Knowledge is disseminated to strengthen the regional academic ecosystem."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-nabkisan-wash-social-bond$$, $$2026-10-04$$,
  $$NABKISAN lists India’s first WASH-focused social bond$$,
  $$NABKISAN Finance Limited listed a five-year social bond dedicated to Water, Sanitation and Hygiene on the National Stock Exchange. The issue raised ₹180 crore for WASH access in rural and underserved communities.$$,
  $$The item connects capital markets with development finance. A social bond raises money for defined social purposes; it is not a government budget allocation or a consumer welfare scheme by itself.$$,
  $$NABKISAN is a subsidiary of NABARD. The bond was oversubscribed 1.8 times, carries an 8.10% coupon and matures in September 2031. The release describes it as India's first social bond dedicated exclusively to the WASH sector.$$,
  $$NABKISAN Lists India’s First WASH-Focused Social Bond, Raises ₹180 Crore$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2318568&lang=1&reg=3$$,
  $$Ministry of Finance / Press Information Bureau$$, $$2026-10-03$$,
  $$["WASH stands for Water, Sanitation and Hygiene.","NABKISAN is a subsidiary of NABARD.","The social bond raised ₹180 crore and is listed on NSE.","It has a five-year tenor and matures in September 2031."]$$::jsonb,
  $$[{"question":"What type of instrument did NABKISAN list?","answer":"A WASH-focused social bond."},{"question":"Which development-finance institution is NABKISAN linked to?","answer":"NABARD, of which NABKISAN is a subsidiary."}]$$::jsonb,
  $${"title":"From bond investors to WASH outcomes","steps":["Investors subscribe to a themed social bond.","The issuer raises capital through the market.","Proceeds are directed to eligible WASH activities.","Water and sanitation access can support health and livelihoods."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-04-aime-2026$$, $$2026-10-04$$,
  $$Indian Navy concludes participation in ASEAN-India Maritime Exercise 2026$$,
  $$INS Sahyadri and INS Kulish concluded their participation in ASEAN-India Maritime Exercise 2026 in the Philippines. The exercise included harbour and sea phases designed to build operational coordination among participating maritime forces.$$,
  $$AIME is useful for mapping India’s Act East engagement to maritime cooperation. It is a multinational exercise, not a treaty organisation or a military alliance.$$,
  $$The ships took part in humanitarian-assistance and disaster-relief, visit-board-search-seizure, replenishment, helicopter and medical-evacuation drills. The release links the exercise to the Act East Policy and the MAHASAGAR vision.$$,
  $$Indian Naval Ships Sahyadri and Kulish Conclude Participation in AIME 2026$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2318673&lang=1&reg=3$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-03$$,
  $$["AIME stands for ASEAN-India Maritime Exercise.","AIME 2026 was conducted in the Philippines.","India was represented by INS Sahyadri and INS Kulish.","The sea phase included HADR and visit-board-search-seizure drills."]$$::jsonb,
  $$[{"question":"Which policy framework is cited alongside AIME 2026?","answer":"India’s Act East Policy."},{"question":"What does HADR stand for in maritime exercises?","answer":"Humanitarian Assistance and Disaster Relief."}]$$::jsonb,
  $${"title":"What a maritime exercise builds","steps":["Partner navies meet for harbour-phase coordination.","They plan procedures and practise communication.","Sea-phase drills test cooperation in defined scenarios.","Shared practice improves interoperability for regional maritime tasks."]}$$::jsonb,
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
  $$2026-10-04-green-energy-corridor-phase-three$$,
  $$2026-10-04-rabi-msp-2027-28$$,
  $$2026-10-04-cafe-norms-2027-32$$,
  $$2026-10-04-eci-sir-andhra-meghalaya-schedule$$,
  $$2026-10-04-free-space-qkd-demonstration$$,
  $$2026-10-04-classical-language-centres-of-excellence$$,
  $$2026-10-04-nabkisan-wash-social-bond$$,
  $$2026-10-04-aime-2026$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
