-- Government-scheme factsheets, batch five. Completes the 46 visible Central cards.
-- Official programme, ministry and portal material checked on 8 September 2026.

update public.government_schemes
set
  eligibility_summary = case slug
    when 'pm-kusum' then 'Farmers, farmer groups, cooperatives, Panchayats, FPOs and water-user associations may participate through the relevant PM-KUSUM component and state implementing agency. Eligibility depends on land, pump, feeder, grid and state-specific conditions.'
    when 'pm-scholarship-scheme-capf-assam-rifles' then 'Dependent wards and widows of serving or retired CAPF and Assam Rifles personnel, subject to the current service, education, merit and family conditions, can apply through the official scholarship process.'
    when 'pm-surya-ghar-muft-bijli-yojana' then 'Residential consumers with a suitable rooftop and a valid electricity connection can apply through the official portal, subject to DISCOM technical approval and the programme’s current state implementation conditions.'
    when 'pm-usp-central-sector-scholarship' then 'Students above the 80th percentile of successful Class XII candidates in their board and stream, pursuing a regular recognised course, with annual family income up to ₹4.5 lakh and no other scholarship or fee reimbursement, can apply subject to current rules.'
    when 'pradhan-mantri-matsya-sampada-yojana' then 'Fishers, fish farmers, entrepreneurs, cooperatives, FPOs, self-help groups, state agencies and other eligible fisheries stakeholders can participate through the relevant approved PMMSY activity and state or UT implementation route.'
    when 'research-development-innovation-scheme' then 'The RDI Scheme is aimed at private-sector R&D, deep-tech projects and strategic or sunrise-domain innovation through the fund’s notified financial-instrument and implementing-partner routes. It is not a general student scholarship.'
    when 'vigyan-dhara' then 'Academic and research institutions, scientists, researchers, students, innovators and eligible implementing organisations can participate through the specific DST programme or call within the unified Vigyan Dhara framework.'
    when 'free-coaching-and-allied-scheme' then 'Economically disadvantaged eligible SC and OBC candidates can seek coaching through empanelled or notified institutions under the current Ministry of Social Justice rules. Income, category, selection and examination conditions apply.'
  end,
  benefit_details = case slug
    when 'pm-kusum' then 'PM-KUSUM has Component A for decentralised grid-connected renewable plants, Component B for standalone solar agriculture pumps, and Component C for solarisation of grid-connected pumps and feeders. Central financial assistance is generally up to 30% of benchmark or tender cost for relevant pump and solarisation activities, and up to 50% in notified special areas; state support and farmer contribution follow the current component rules.'
    when 'pm-scholarship-scheme-capf-assam-rifles' then 'The scholarship supports eligible professional and technical higher education. The annual scholarship rate, approved course list, merit conditions and renewal requirements are published in the current Kendriya Sainik Board or scheme notice and must be checked for the application year.'
    when 'pm-surya-ghar-muft-bijli-yojana' then 'The programme supports household rooftop solar. The current central financial assistance is ₹30,000 for the first kW, ₹18,000 for the second kW and ₹78,000 for systems of 3 kW or more, subject to programme conditions; actual savings depend on generation, consumption, DISCOM rules and installation quality.'
    when 'pm-usp-central-sector-scholarship' then 'The scholarship provides ₹12,000 per year at graduation level and ₹20,000 per year at post-graduation level. For the first three years of a professional course the rate is ₹12,000 per year; in the fourth and fifth years it is ₹20,000 per year, subject to current renewal rules.'
    when 'pradhan-mantri-matsya-sampada-yojana' then 'PMMSY supports fisheries production, productivity, quality, technology, infrastructure, post-harvest management, marketing, welfare and institutional strengthening. Assistance varies by activity, beneficiary category and state or UT project approval; it should not be represented as one universal cash transfer.'
    when 'research-development-innovation-scheme' then 'The RDI Scheme has a ₹1 lakh crore outlay over six years to catalyse private-sector investment in high-impact R&D, deep-tech and strategic technologies. Support is channelled through notified financial instruments and fund managers; it is project-based, not automatic grant money.'
    when 'vigyan-dhara' then 'Vigyan Dhara merges three areas: S&T institutional and human-capacity building, research and development, and innovation, technology development and deployment. It supports science infrastructure, talent, research, innovation and technology translation through specific DST programmes.'
    when 'free-coaching-and-allied-scheme' then 'The scheme provides good-quality coaching support for eligible candidates preparing for UPSC, SSC, Railway Recruitment Board, State PSC, bank, insurance, PSU and selected premier entrance examinations. The exact institute, seat, allowance and support conditions follow the current official guidelines.'
  end,
  application_process = case slug
    when 'pm-kusum' then 'Use the official PM-KUSUM portal to find the state implementing agency, active component, approved vendors or application process. Apply only in response to the relevant state or DISCOM window; farmers should check the local component before paying anyone.'
    when 'pm-scholarship-scheme-capf-assam-rifles' then 'Apply through the current National Scholarship Portal or the route specified by the Kendriya Sainik Board notice. Upload the required service, dependency, admission and academic documents before the annual deadline.'
    when 'pm-surya-ghar-muft-bijli-yojana' then 'Register on the official PM Surya Ghar portal, select the DISCOM, submit the rooftop-solar application, obtain approval, install through an empanelled vendor, complete inspection or net-meter steps and submit bank details for subsidy processing.'
    when 'pm-usp-central-sector-scholarship' then 'Apply and renew through the National Scholarship Portal during the notified window. The institution verifies enrolment and the student must meet the academic, income and course conditions for continuation.'
    when 'pradhan-mantri-matsya-sampada-yojana' then 'Check the current state or UT fisheries department and PMMSY portal route for the specific activity. Submit the project, identity, technical and financial documents required for that activity and await prescribed approval.'
    when 'research-development-innovation-scheme' then 'Follow the official RDI Fund or designated fund-manager calls for the applicable financial instrument. Companies and eligible entities must submit project, technology, financial and due-diligence material under the notified process.'
    when 'vigyan-dhara' then 'Apply only to the relevant DST call, institution route or implementing programme. The umbrella scheme does not have one common personal application form; each component publishes its own eligibility and proposal process.'
    when 'free-coaching-and-allied-scheme' then 'Watch the Ministry or notified implementing institution for the current application notice. Submit category, income, identity, education and competitive-exam documents through the required portal or institution route.'
  end,
  documents_and_conditions = case slug
    when 'pm-kusum' then 'Keep land or pump details, identity, bank and electricity-connection records, and state-required documents ready. Component A, B and C have different requirements; the state implementing agency and DISCOM process control selection.'
    when 'pm-scholarship-scheme-capf-assam-rifles' then 'Keep service or retirement certificate, dependency proof, death certificate where applicable, admission proof, fee or course documents, marksheets and bank details. Only approved courses and timely renewal are covered.'
    when 'pm-surya-ghar-muft-bijli-yojana' then 'The system must be residential rooftop solar and must follow approved vendor, technical and DISCOM procedures. Do not treat the “free electricity” title as a guaranteed zero bill for every household.'
    when 'pm-usp-central-sector-scholarship' then 'Regular study is required; distance or correspondence students, diploma students, students who took a post-Class-XII drop, and students already receiving another scholarship or fee reimbursement are excluded under the published FAQ.'
    when 'pradhan-mantri-matsya-sampada-yojana' then 'The correct support depends on the chosen fisheries activity and approved project. Check the current state fisheries notice for category contribution, unit cost, technical approvals and beneficiary conditions.'
    when 'research-development-innovation-scheme' then 'The fund is designed to catalyse private R&D and does not finance every type of laboratory, government entity or short-term loan. Applicants must use the current official guidelines and financial-instrument criteria.'
    when 'vigyan-dhara' then 'Remember the umbrella structure. A learner should identify the correct DST component or programme rather than claiming one blanket benefit under the name Vigyan Dhara.'
    when 'free-coaching-and-allied-scheme' then 'The scheme is targeted assistance, not open coaching for every candidate. Category, economic and course or exam requirements must be verified from the live notice before applying.'
  end,
  exam_answer = case slug
    when 'pm-kusum' then 'Remember: renewable energy for agriculture; Component A decentralised plants, B standalone solar pumps, C pump or feeder solarisation; reduces diesel use and can create farm income from surplus power.'
    when 'pm-scholarship-scheme-capf-assam-rifles' then 'Remember: scholarship for dependent wards and widows of CAPF and Assam Rifles personnel; professional and technical education; Kendriya Sainik Board and National Scholarship Portal route.'
    when 'pm-surya-ghar-muft-bijli-yojana' then 'Remember: household rooftop solar; Ministry of New and Renewable Energy; ₹30,000 first kW, ₹18,000 second kW, ₹78,000 for 3 kW or more under current CFA; DISCOM and net-meter process.'
    when 'pm-usp-central-sector-scholarship' then 'Remember: merit-cum-means college scholarship; above 80th percentile in Class XII board stream, family income up to ₹4.5 lakh, regular course, NSP application.'
    when 'pradhan-mantri-matsya-sampada-yojana' then 'Remember: fisheries-sector development; production, infrastructure, value chain, marketing, welfare and sustainability; Ministry of Fisheries, Animal Husbandry and Dairying.'
    when 'research-development-innovation-scheme' then 'Remember: Cabinet approved 1 July 2025; ₹1 lakh crore over six years; private-sector R&D, deep tech and strategic or sunrise domains; DST and the RDI Fund architecture.'
    when 'vigyan-dhara' then 'Remember: unified DST Central Sector scheme; three components: S&T capacity building, R&D, and innovation/technology development/deployment; effective from 16 January 2025.'
    when 'free-coaching-and-allied-scheme' then 'Remember: Ministry of Social Justice support for eligible economically disadvantaged SC and OBC candidates; coaching for UPSC, SSC, RRB, State PSC, banks and selected entrance examinations.'
  end,
  factsheet_verified = true,
  last_official_check = date '2026-09-08',
  updated_at = now()
where slug in (
  'pm-kusum', 'pm-scholarship-scheme-capf-assam-rifles',
  'pm-surya-ghar-muft-bijli-yojana', 'pm-usp-central-sector-scholarship',
  'pradhan-mantri-matsya-sampada-yojana', 'research-development-innovation-scheme',
  'vigyan-dhara', 'free-coaching-and-allied-scheme'
);
