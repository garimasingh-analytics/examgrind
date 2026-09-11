-- Government-scheme factsheets, batch two.
-- Every detail below was checked against the relevant official programme,
-- ministry, PIB or National Portal source on 8 September 2026. Variable state
-- assistance is described as variable rather than guessed.

update public.government_schemes
set
  eligibility_summary = case slug
    when 'pm-fasal-bima-yojana' then 'Farmers cultivating a notified crop in a notified area and season can enrol, including eligible tenant or sharecropper farmers where state rules allow. The crop, area, land or tenancy proof, and enrolment details must match the current scheme rules.'
    when 'soil-health-card-scheme' then 'Farmers whose soil is sampled and tested through the government soil-testing system can receive a Soil Health Card. It is a farm advisory service, not a cash-benefit scheme.'
    when 'pradhan-mantri-krishi-sinchayee-yojana' then 'Benefits are delivered through state-approved irrigation, watershed and farm-water-management components. A farmer-level subsidy or application route depends on the active state component and local guidelines.'
    when 'national-food-security-act-pds' then 'States and Union Territories identify Priority Households and Antyodaya Anna Yojana households within their allotted coverage. Eligibility, ration cards and grievance handling are administered by the state or UT.'
    when 'deendayal-antyodaya-yojana-nrlm' then 'The mission works with rural poor households, especially women organised into self-help groups and their federations through State Rural Livelihood Missions.'
    when 'ddu-gky' then 'Rural youth from poor households aged 15–35 years are the core group. The upper age limit is relaxed to 45 years for women and specified vulnerable groups under current programme rules.'
    when 'national-social-assistance-programme' then 'The programme covers vulnerable people in Below Poverty Line households identified by states and UTs. Age, disability, widowhood, household and state conditions differ across its five components.'
    when 'mission-indradhanush' then 'It focuses on children below two years and pregnant women who are unvaccinated or partly vaccinated, especially in low-coverage and hard-to-reach areas.'
    when 'poshan-abhiyan' then 'It reaches children below six years, adolescent girls, pregnant women and lactating mothers through nutrition, health and Anganwadi service systems. It is not an individual cash-transfer application.'
    when 'pradhan-mantri-ujjwala-yojana' then 'An adult woman from an eligible poor household may apply if no household member has an LPG connection. The applicant must be at least 18 and meet the current category or deprivation-declaration conditions.'
  end,
  benefit_details = case slug
    when 'pm-fasal-bima-yojana' then 'Farmers pay at most 2% of the sum insured for Kharif crops, 1.5% for Rabi crops and 5% for commercial or horticultural crops. The remaining actuarial premium is subsidised under the current Centre–State sharing rules; claims depend on the notified crop and assessed loss.'
    when 'soil-health-card-scheme' then 'The card reports 12 soil parameters: N, P, K, S; Zn, Fe, Cu, Mn and B; plus pH, electrical conductivity and organic carbon. It gives crop-specific nutrient, fertiliser, bio-fertiliser and soil-amendment advice.'
    when 'pradhan-mantri-krishi-sinchayee-yojana' then 'PMKSY supports irrigation potential, command-area and farm-water-management work through components such as AIBP, Har Khet Ko Pani and watershed development. The exact assistance varies by component, state and approved project.'
    when 'national-food-security-act-pds' then 'Priority Households are entitled to 5 kg of foodgrains per person per month. Antyodaya Anna Yojana households are entitled to 35 kg per family per month. Pregnant women, lactating mothers and children have separate nutrition entitlements under the Act.'
    when 'deendayal-antyodaya-yojana-nrlm' then 'Support includes mobilisation into self-help groups, Revolving Fund and Community Investment Fund support for community institutions, bank linkage, livelihoods and financial-inclusion pathways. The amount is not one fixed individual entitlement.'
    when 'ddu-gky' then 'Eligible candidates receive placement-linked skill training. Official programme material also lists training and assessment support, post-placement support, retention support and career-progression support under applicable rules.'
    when 'national-social-assistance-programme' then 'NSAP has five components: old-age pension, widow pension, disability pension, National Family Benefit Scheme and Annapurna. Central assistance includes ₹200 a month for eligible old-age beneficiaries aged 60–79 and ₹500 at age 80+, while states may add their own top-up; other component amounts follow their current rules.'
    when 'mission-indradhanush' then 'Vaccines under the Universal Immunisation Programme are provided free at government health facilities, sub-centres and outreach sessions. Mission Indradhanush is a catch-up drive to reach people who missed routine immunisation.'
    when 'poshan-abhiyan' then 'The programme strengthens nutrition services, growth monitoring, counselling, convergence and community action to reduce stunting, undernutrition, anaemia and low birth weight. Benefits are delivered through public nutrition and health services, not as one fixed cash amount.'
    when 'pradhan-mantri-ujjwala-yojana' then 'The Government provides ₹1,600 assistance for a 14.2 kg connection or ₹1,150 for a 5 kg connection. The connection package includes the cylinder, regulator, hose, booklet, first refill and two-burner stove under the current official FAQ.'
  end,
  application_process = case slug
    when 'pm-fasal-bima-yojana' then 'Enrol through the PMFBY portal, a participating bank, Common Service Centre or the designated agriculture or insurance channel during the notified crop-season window. Use the portal to check the current state, crop, cut-off date and premium.'
    when 'soil-health-card-scheme' then 'Contact the local agriculture department, soil-testing laboratory or authorised village-level channel for sample collection and testing. The Soil Health Card portal is used for card generation and status in participating systems.'
    when 'pradhan-mantri-krishi-sinchayee-yojana' then 'Use the state agriculture, irrigation or watershed department’s current process. For farmer-level micro-irrigation support, follow the active state portal or local agriculture office; major infrastructure components are project-based.'
    when 'national-food-security-act-pds' then 'Apply for or update a ration card through the relevant state or UT food and civil-supplies system. The state identifies eligible households and distributes foodgrains through Fair Price Shops.'
    when 'deendayal-antyodaya-yojana-nrlm' then 'Approach the local self-help group, Village Organisation, Cluster Level Federation or State Rural Livelihood Mission. The mission is implemented through state and community institutions rather than one central individual application form.'
    when 'ddu-gky' then 'Register through the current DDU-GKY or state skill-mission candidate route, including the official Kaushal platform where available. Select an approved training programme and complete the prescribed verification and enrolment process.'
    when 'national-social-assistance-programme' then 'Apply through the state or UT social-welfare, panchayat, municipal or designated pension portal or office. The state verifies BPL and component eligibility, then processes payment through its implementation system.'
    when 'mission-indradhanush' then 'No separate benefit form is required. Check the routine immunisation schedule with an ASHA, Anganwadi worker, ANM, PHC, CHC or government hospital and attend the listed session with the available vaccination record.'
    when 'poshan-abhiyan' then 'Use the local Anganwadi centre, ASHA, ANM or government health facility for nutrition-service and counselling access. Programme support is delivered through public service systems, not a standalone individual portal application.'
    when 'pradhan-mantri-ujjwala-yojana' then 'Apply through an authorised LPG distributor or the official PMUY route. Submit KYC, family-composition proof or the permitted migrant self-declaration, identity and address documents, then complete distributor verification.'
  end,
  documents_and_conditions = case slug
    when 'pm-fasal-bima-yojana' then 'Keep Aadhaar-linked identity, bank details, crop and land details, and ownership or tenancy/sharecropping proof where required. Enrolment must match the notified crop, area and season; incorrect or incomplete records can be rejected.'
    when 'soil-health-card-scheme' then 'The key condition is a properly collected and registered soil sample. Local agriculture or soil-testing staff follow the sample, testing and card-generation workflow.'
    when 'pradhan-mantri-krishi-sinchayee-yojana' then 'There is no one national benefit amount or universal form. Component, state plan, land or project feasibility, subsidy ceiling and local selection rules must be checked before claiming support.'
    when 'national-food-security-act-pds' then 'Keep the state-issued ration card and any identity or family documents required by the state. Household identification and Priority/AAY classification are state responsibilities under the Act.'
    when 'deendayal-antyodaya-yojana-nrlm' then 'Participation is routed through local community institutions and state mission processes. Benefits depend on the SHG, livelihood activity, bank linkage and current state implementation norms.'
    when 'ddu-gky' then 'Age, rural-household and poor-household eligibility must be verified. Category documents, identity, education or course prerequisites may be required by the approved training provider.'
    when 'national-social-assistance-programme' then 'Keep BPL or state-identified household records, age, widowhood or disability documents, bank details and other state-required proof. State top-ups and actual disbursement can be higher than the Central share.'
    when 'mission-indradhanush' then 'Carry the child’s or beneficiary’s available immunisation record when possible. Eligibility comes from the vaccination schedule and missed-dose status; vaccines are given through government service points.'
    when 'poshan-abhiyan' then 'Service access depends on local Anganwadi, health and nutrition systems. It should not be described as a direct cash scheme or treated as a separate central benefit form.'
    when 'pradhan-mantri-ujjwala-yojana' then 'KYC, ration card or permitted family-composition proof, identity and address documents are required. An existing LPG connection in the same household disqualifies the applicant under the current official conditions.'
  end,
  exam_answer = case slug
    when 'pm-fasal-bima-yojana' then 'Remember: crop insurance; Kharif 2%, Rabi 1.5%, commercial/horticulture 5% farmer-premium caps; notified crop, area and season; Centre–State premium support.'
    when 'soil-health-card-scheme' then 'Remember: launched in 2015; 12 soil parameters; crop-specific nutrient advice; balanced fertiliser use and sustainable soil health.'
    when 'pradhan-mantri-krishi-sinchayee-yojana' then 'Remember: Har Khet Ko Pani and More Crop Per Drop; irrigation coverage, water-use efficiency and watershed or water-conservation work; an umbrella programme with multiple components.'
    when 'national-food-security-act-pds' then 'Remember: NFSA 2013; rights-based food security; up to 75% rural and 50% urban coverage; 5 kg per Priority Household person and 35 kg per AAY household per month.'
    when 'deendayal-antyodaya-yojana-nrlm' then 'Remember: Ministry of Rural Development; rural poor women, SHGs and federations; livelihoods, financial inclusion and community institutions.'
    when 'ddu-gky' then 'Remember: placement-linked skilling under NRLM; rural poor youth aged 15–35; training, placement and post-placement support; priority for disadvantaged groups.'
    when 'national-social-assistance-programme' then 'Remember: launched 15 August 1995; five components; BPL social assistance; Central pension share plus possible state top-up; Ministry of Rural Development.'
    when 'mission-indradhanush' then 'Remember: catch-up immunisation under UIP; children below two and pregnant women; launched in December 2014; free vaccines through public health delivery.'
    when 'poshan-abhiyan' then 'Remember: nutrition outcomes for children, adolescent girls, pregnant women and lactating mothers; convergence, technology and behaviour change; not a direct cash transfer.'
    when 'pradhan-mantri-ujjwala-yojana' then 'Remember: clean cooking LPG for eligible poor adult women; launched 2016; ₹1,600 for a 14.2 kg connection or ₹1,150 for a 5 kg connection under the current official FAQ.'
  end,
  factsheet_verified = true,
  last_official_check = date '2026-09-08',
  updated_at = now()
where slug in (
  'pm-fasal-bima-yojana',
  'soil-health-card-scheme',
  'pradhan-mantri-krishi-sinchayee-yojana',
  'national-food-security-act-pds',
  'deendayal-antyodaya-yojana-nrlm',
  'ddu-gky',
  'national-social-assistance-programme',
  'mission-indradhanush',
  'poshan-abhiyan',
  'pradhan-mantri-ujjwala-yojana'
);
