-- Government-scheme factsheets, batch three.
-- Source-checked against the relevant official ministry, programme or bank/portal
-- material on 8 September 2026. A fixed amount is stated only where the scheme's
-- current official material gives one; otherwise the card tells the learner what
-- determines the support.

update public.government_schemes
set
  eligibility_summary = case slug
    when 'pradhan-mantri-awas-yojana-urban' then 'Urban families in the EWS, LIG or MIG income groups that do not own a pucca house anywhere in India may be eligible under PMAY-U 2.0, subject to the relevant vertical, city and verification rules. EWS is up to ₹3 lakh annual household income, LIG is above ₹3 lakh to ₹6 lakh, and MIG is above ₹6 lakh to ₹9 lakh under the current central guideline.'
    when 'pradhan-mantri-mudra-yojana' then 'Eligible non-corporate, non-farm micro or small business borrowers can approach participating banks, NBFCs, MFIs and other lenders. The lender assesses the business proposal, repayment capacity and current product conditions.'
    when 'stand-up-india' then 'A woman entrepreneur, or an SC/ST entrepreneur aged 18 years or above, can seek support for a greenfield enterprise in manufacturing, services, trading or agriculture-allied activities. For a non-individual enterprise, at least 51% ownership and controlling stake must be held by eligible women or SC/ST entrepreneurs.'
    when 'pradhan-mantri-employment-generation-programme' then 'Any individual aged 18 years or above can apply for a new eligible micro-enterprise. There is no income ceiling; for projects above ₹10 lakh in manufacturing or ₹5 lakh in business or service, the applicant must have passed at least Class VIII. One person from one family is eligible for assistance for a new unit.'
    when 'pradhan-mantri-kaushal-vikas-yojana' then 'Candidates must meet the age, education, job-role and training-provider conditions listed for the current PMKVY or Skill India course. The programme serves people seeking recognised skill training, assessment or recognition of prior learning.'
    when 'beti-bachao-beti-padhao' then 'The initiative works through communities, schools, local administrations and public institutions. It is not an individual cash-benefit or scholarship application scheme.'
    when 'sukanya-samriddhi-account' then 'A parent or legal guardian may open an account for a resident Indian girl before she turns 10. Normally one account is allowed per girl and up to two girls per family, with the prescribed exception for twins or triplets.'
    when 'pm-ajay' then 'The scheme serves Scheduled Caste communities through its notified development, livelihood, residential-school and grant components. Eligibility and selection are determined by the applicable component, state or district implementing authority and current guidelines.'
    when 'smile-scheme' then 'SMILE has separate components for the comprehensive rehabilitation and welfare of transgender persons and for support for persons engaged in begging. Access depends on the relevant component, identification and implementation channel.'
    when 'swachh-bharat-mission-gramin' then 'SBM-G works through rural households, Gram Panchayats, districts and states. Phase II support is planned at community and local-body level to sustain ODF behaviour and build solid and liquid waste-management systems.'
  end,
  benefit_details = case slug
    when 'pradhan-mantri-awas-yojana-urban' then 'PMAY-U 2.0 offers four verticals: Beneficiary-Led Construction, Affordable Housing in Partnership, Affordable Rental Housing and an Interest Subsidy Scheme. The exact assistance depends on the chosen vertical, household category, approved project and local implementation; it should never be reduced to one universal cash figure.'
    when 'pradhan-mantri-mudra-yojana' then 'MUDRA loans are categorised as Shishu (up to ₹50,000), Kishor (above ₹50,000 to ₹5 lakh), Tarun (above ₹5 lakh to ₹10 lakh) and Tarun Plus (above ₹10 lakh to ₹20 lakh for borrowers who successfully repaid an earlier Tarun loan). These are loans, not grants, and the lender sets the sanctioned amount and terms.'
    when 'stand-up-india' then 'The scheme facilitates composite bank loans from ₹10 lakh to ₹1 crore for a greenfield enterprise. The loan may cover term loan and working capital, normally up to 75% of the project cost subject to the scheme’s conditions and the borrower’s contribution or other support.'
    when 'pradhan-mantri-employment-generation-programme' then 'PMEGP provides margin-money subsidy for new micro-enterprises. The current guideline lists 15% subsidy for general-category applicants in urban areas and 25% in rural areas; special-category applicants receive 25% in urban areas and 35% in rural areas. The applicant contribution is 10% for general category and 5% for special category. The subsidy is adjusted through the financing bank and is not a cash prize.'
    when 'pradhan-mantri-kaushal-vikas-yojana' then 'Eligible candidates can receive approved short-term training, assessment and certification or recognition of prior learning through the current skill-development ecosystem. Course availability, costs covered and incentives vary by the active version, job role and implementing partner.'
    when 'beti-bachao-beti-padhao' then 'The programme focuses on preventing gender-biased sex selection, ensuring survival and protection of the girl child, and promoting her education and participation. It does not provide a standard direct deposit into an individual girl’s bank account.'
    when 'sukanya-samriddhi-account' then 'The account accepts a minimum deposit of ₹250 and a maximum of ₹1.5 lakh in a financial year. Deposits can be made for 15 years from opening; the account matures after 21 years from opening, subject to current rules. Interest is notified by the government and can change each quarter.'
    when 'pm-ajay' then 'PM-AJAY brings together development of SC-dominated villages, grants to state or UT governments and institutions, and support for livelihoods, skill development and residential education under its components. The type and amount of support depend on the approved component and implementing authority.'
    when 'smile-scheme' then 'For transgender persons, the official component includes skill development and livelihood support, medical-health support, Garima Greh shelters, the National Portal for Transgender Persons and protection-cell measures. The scheme also has a component for rehabilitation of persons engaged in begging; benefits vary by component and local delivery.'
    when 'swachh-bharat-mission-gramin' then 'Phase II focuses on sustaining Open Defecation Free status and making villages ODF Plus through solid-waste management, liquid-waste management and visual cleanliness. Programme funds support community and local-system work; this is not one fixed individual cash benefit.'
  end,
  application_process = case slug
    when 'pradhan-mantri-awas-yojana-urban' then 'Use the official PMAY-U 2.0 application or city and Urban Local Body route for the relevant vertical. The ULB verifies household details, Aadhaar and housing eligibility before a proposal moves through the prescribed approval process.'
    when 'pradhan-mantri-mudra-yojana' then 'Prepare a business proposal and approach a participating bank, NBFC, MFI or other eligible lending institution. The lender decides eligibility, documentation, credit appraisal and sanction; use the official MUDRA or Department of Financial Services information to identify the right lender route.'
    when 'stand-up-india' then 'Use the Stand-Up Mitra portal or approach a scheduled commercial bank branch. Select the sector and location, prepare a project report and complete the bank’s credit appraisal and documentation process.'
    when 'pradhan-mantri-employment-generation-programme' then 'Apply through the official PMEGP e-portal. Choose the implementing agency, submit the project and identity details, complete the prescribed entrepreneur-development training where required, and proceed through the bank appraisal and sanction process.'
    when 'pradhan-mantri-kaushal-vikas-yojana' then 'Search and register through the current Skill India or approved training-provider route. Pick a listed course, complete verification and enrolment, then attend the prescribed training and assessment.'
    when 'beti-bachao-beti-padhao' then 'There is no central individual application form. Access related local awareness, school, protection and convergence services through district administration and the relevant women-and-child, education and health systems.'
    when 'sukanya-samriddhi-account' then 'Open the account at an authorised post office or bank with the guardian and girl-child documents. Deposit within the annual limits and use the bank or post-office record for future deposits, withdrawals and maturity claims.'
    when 'pm-ajay' then 'The relevant state, district, institution or implementing agency identifies and processes beneficiaries under the active component. Check the Ministry or state social-welfare department’s current notices rather than relying on a generic single application claim.'
    when 'smile-scheme' then 'Use the official transgender-person portal or the relevant state social-welfare, shelter, health or rehabilitation channel for the applicable component. Local implementation agencies guide enrolment and services.'
    when 'swachh-bharat-mission-gramin' then 'Raise a local service, sanitation or waste-management issue through the Gram Panchayat, village water and sanitation structures or the state SBM-G implementation channel. Village planning and local-body implementation are central to the mission.'
  end,
  documents_and_conditions = case slug
    when 'pradhan-mantri-awas-yojana-urban' then 'Aadhaar or Aadhaar Virtual ID for eligible family members, income information, household details and declarations about existing pucca housing are central. Only one benefit under one PMAY-U 2.0 vertical is allowed for an eligible beneficiary family.'
    when 'pradhan-mantri-mudra-yojana' then 'Keep KYC, business or project details, bank records, estimates and any lender-requested registrations ready. MUDRA is a lending framework, so sanction is subject to the participating lender’s due diligence and repayment assessment.'
    when 'stand-up-india' then 'Keep identity, SC/ST proof where applicable, enterprise ownership details, project report, cost estimates, permits and bank-required records ready. The enterprise must be greenfield, meaning first-time venture in the relevant sector for the borrower.'
    when 'pradhan-mantri-employment-generation-programme' then 'Keep Aadhaar, age and education proof, project report, category or rural-area proof where relevant, and bank documentation ready. Existing units and projects already supported by specified government subsidies are not eligible for a fresh PMEGP new-unit subsidy.'
    when 'pradhan-mantri-kaushal-vikas-yojana' then 'Bring identity, age, education and any job-role-specific documents requested by the approved centre. Always confirm that the centre and course are currently approved before enrolment.'
    when 'beti-bachao-beti-padhao' then 'Do not confuse BBBP with Sukanya Samriddhi Account, Ladli-type state schemes or a scholarship. Questions often test its three objectives and its awareness-and-convergence nature.'
    when 'sukanya-samriddhi-account' then 'Keep the girl child’s birth certificate, guardian identity and address proof, and the required account-opening form. Annual deposits above the notified ceiling do not earn the scheme interest benefit under the rules.'
    when 'pm-ajay' then 'The correct conditions depend on the component: community-development projects, livelihood support and residential education have different implementing and selection routes. Verify the current state or ministry notice for the specific benefit.'
    when 'smile-scheme' then 'The two components must be kept separate in answers: transgender-person welfare and rehabilitation, and support for persons engaged in begging. Eligibility, documentation and service points depend on the component and state implementation.'
    when 'swachh-bharat-mission-gramin' then 'Remember that village-level implementation and convergence matter. ODF Plus is based on sustaining toilet use, solid and liquid waste management and visual cleanliness, not merely building toilets.'
  end,
  exam_answer = case slug
    when 'pradhan-mantri-awas-yojana-urban' then 'Remember: PMAY-U 2.0 is urban housing; EWS up to ₹3 lakh, LIG ₹3–6 lakh and MIG ₹6–9 lakh annual household income; no pucca house; four verticals; Urban Local Bodies verify beneficiaries.'
    when 'pradhan-mantri-mudra-yojana' then 'Remember: non-corporate, non-farm micro enterprises; Shishu up to ₹50,000, Kishor ₹50,000–₹5 lakh, Tarun ₹5–10 lakh, Tarun Plus ₹10–20 lakh for eligible repeat Tarun borrowers; loan, not subsidy.'
    when 'stand-up-india' then 'Remember: SC/ST or women entrepreneurs; greenfield enterprise; ₹10 lakh–₹1 crore composite bank loan; manufacturing, services, trading and agriculture-allied activities; distinguish it from MUDRA.'
    when 'pradhan-mantri-employment-generation-programme' then 'Remember: Ministry of MSME and KVIC nodal role; credit-linked margin-money subsidy for new micro-enterprises; general versus special-category subsidy rates differ by rural and urban location.'
    when 'pradhan-mantri-kaushal-vikas-yojana' then 'Remember: Skill India ecosystem; short-term training, assessment and certification or recognition of prior learning; current courses and eligibility change by job role and programme phase.'
    when 'beti-bachao-beti-padhao' then 'Remember: launched 2015; prevent gender-biased sex selection, ensure survival and protection, and promote education and participation of the girl child; no standard direct cash transfer.'
    when 'sukanya-samriddhi-account' then 'Remember: small-savings account for a girl under 10; ₹250 minimum and ₹1.5 lakh maximum annual deposit; deposits for 15 years; maturity after 21 years; interest is government-notified.'
    when 'pm-ajay' then 'Remember: Pradhan Mantri Anusuchit Jaati Abhyuday Yojana; Scheduled Caste socio-economic development; village development, grants, livelihoods, skills and residential education components.'
    when 'smile-scheme' then 'Remember: Support for Marginalized Individuals for Livelihood and Enterprise; welfare and rehabilitation of transgender persons, plus a separate component for persons engaged in begging; Ministry of Social Justice and Empowerment.'
    when 'swachh-bharat-mission-gramin' then 'Remember: launched 2 October 2014; Phase II focuses on ODF sustainability, solid and liquid waste management and ODF Plus villages; Department of Drinking Water and Sanitation.'
  end,
  factsheet_verified = true,
  last_official_check = date '2026-09-08',
  updated_at = now()
where slug in (
  'pradhan-mantri-awas-yojana-urban',
  'pradhan-mantri-mudra-yojana',
  'stand-up-india',
  'pradhan-mantri-employment-generation-programme',
  'pradhan-mantri-kaushal-vikas-yojana',
  'beti-bachao-beti-padhao',
  'sukanya-samriddhi-account',
  'pm-ajay',
  'smile-scheme',
  'swachh-bharat-mission-gramin'
);
