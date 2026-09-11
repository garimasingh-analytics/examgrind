-- Government-scheme factsheets: publish only entries with usable, source-checked student details.
-- Additive schema change. Existing scheme records remain intact and can be completed in later batches.

alter table public.government_schemes
  add column if not exists eligibility_summary text,
  add column if not exists benefit_details text,
  add column if not exists application_process text,
  add column if not exists documents_and_conditions text,
  add column if not exists exam_answer text,
  add column if not exists factsheet_verified boolean not null default false;

create index if not exists government_schemes_factsheet_idx
  on public.government_schemes (status, government_level, factsheet_verified, category, name);

-- These eight cards have enough stable, official information to be useful as preparation material.
-- Amounts and application conditions are explicitly dated so students know to use the source link for changes.
update public.government_schemes
set
  eligibility_summary = case slug
    when 'pm-kisan' then 'Landholding farmer families recorded under the scheme, subject to the official exclusion categories. Institutional landholders and several higher-economic-status categories are excluded. The registered family is husband, wife and minor children.'
    when 'ayushman-bharat-pmjay' then 'Families covered under the scheme’s official beneficiary database and current state implementation. Eligibility is checked through the official beneficiary-identification route; it is not a universal health-insurance enrolment.'
    when 'mgnregs' then 'Any rural household whose adult members volunteer to do unskilled manual work can seek a job card and demand work through the local Gram Panchayat.'
    when 'jal-jeevan-mission' then 'Rural households are the intended beneficiaries. Service delivery is planned and implemented through state and local water-supply institutions, rather than by an individual cash-benefit application.'
    when 'pmay-g' then 'Rural households identified through the programme’s deprivation, verification and priority process, subject to the current state and programme rules.'
    when 'pm-svanidhi' then 'Eligible street vendors covered by the programme’s survey, certificate-of-vending or letter-of-recommendation route, subject to the current Urban Local Body and lending rules.'
    when 'pm-vishwakarma' then 'Adult traditional artisans and craftspeople in the notified trades who meet the current scheme conditions; eligibility is verified through the prescribed local and portal process.'
    when 'pm-poshan' then 'Children enrolled in covered government and government-aided schools, including Bal Vatika and Classes I–VIII under the programme framework. It is delivered through schools, not by an individual application.'
  end,
  benefit_details = case slug
    when 'pm-kisan' then '₹6,000 a year in three equal instalments, transferred directly to the eligible landholding farmer family’s bank account. Amount and exclusions checked from the official PM-KISAN portal on 8 September 2026.'
    when 'ayushman-bharat-pmjay' then 'Health cover of up to ₹5 lakh per family per year for eligible hospitalisation under the scheme framework, usable at empanelled hospitals. The official beneficiary portal determines coverage and current state implementation.'
    when 'mgnregs' then 'A legal guarantee of at least 100 days of wage employment in a financial year for each rural household whose adult members volunteer for unskilled manual work. Wages are notified by the relevant government.'
    when 'jal-jeevan-mission' then 'Functional household tap-water service in rural areas is the core service objective. It is infrastructure and service delivery, not a fixed direct-cash transfer to every household.'
    when 'pmay-g' then 'Financial assistance for a pucca rural house under prevailing programme norms; the sanctioned amount and convergence benefits can differ by terrain, state and current guideline.'
    when 'pm-svanidhi' then 'Collateral-free working-capital loan ladder: up to ₹10,000 in the first cycle, then up to ₹20,000 and ₹50,000 after timely repayment, with a 7% interest subsidy for eligible timely repayment and digital-transaction cashback under prevailing rules.'
    when 'pm-vishwakarma' then 'Recognition and ID, skill training with ₹500 daily stipend, toolkit incentive of up to ₹15,000, and collateral-free enterprise-development credit: up to ₹1 lakh in the first tranche and up to ₹2 lakh in the second, at the notified concessional rate.'
    when 'pm-poshan' then 'A cooked midday meal with programme nutrition norms for children in covered schools. The benefit is in-kind nutrition and attendance support, not a direct household cash payment.'
  end,
  application_process = case slug
    when 'pm-kisan' then 'Register or update details through the PM-KISAN portal/assisted channel, complete mandatory eKYC, and use the official “Know Your Status” tool to check eligibility or payment status.'
    when 'ayushman-bharat-pmjay' then 'Check eligibility through the official PM-JAY beneficiary route or authorised facilitation channel. Eligible beneficiaries use their verified scheme identity at an empanelled hospital; do not rely on unofficial enrolment agents.'
    when 'mgnregs' then 'Apply for a job card through the Gram Panchayat, then submit a written or recorded demand for work. The local programme system records the demand, work allocation and wage payment.'
    when 'jal-jeevan-mission' then 'There is no standard individual online application. Use the village/Gram Panchayat, state water-supply department or local implementing authority for a service or grievance request.'
    when 'pmay-g' then 'Household selection follows the programme’s official rural-housing prioritisation and verification process through local and state implementation. Check the PMAY-G portal or local rural-development office for current status.'
    when 'pm-svanidhi' then 'Apply through the official PM SVANidhi process with the Urban Local Body, lending institution, digital portal or authorised facilitation route, as applicable in the city.'
    when 'pm-vishwakarma' then 'Apply through the official PM Vishwakarma portal and the prescribed verification pathway. Follow the portal’s current instructions for trade selection, local verification and benefit access.'
    when 'pm-poshan' then 'No individual application is required. The meal is delivered through the child’s covered school according to the programme’s school-level implementation.'
  end,
  documents_and_conditions = case slug
    when 'pm-kisan' then 'Land-record-based eligibility, Aadhaar-linked identity/eKYC and bank details are central to the official process. Exclusion categories must be checked before claiming benefit.'
    when 'ayushman-bharat-pmjay' then 'Beneficiary identity and eligibility are verified through the official system; accepted documents and state processes can differ. Check the official portal before visiting a hospital.'
    when 'mgnregs' then 'Job-card registration, household details and a work demand through the Gram Panchayat are key. Keep the job-card and work-demand record for follow-up.'
    when 'jal-jeevan-mission' then 'Conditions are determined by the relevant state, village water committee and implementing authority; it is a public-service mission rather than a personal grant form.'
    when 'pmay-g' then 'Selection is not a self-declared open cash application. Household verification and current rural-housing priority conditions govern inclusion.'
    when 'pm-svanidhi' then 'Vendor identity or survey/vending documentation and current Urban Local Body or lending conditions are important. Repayment behaviour affects movement to the next loan cycle.'
    when 'pm-vishwakarma' then 'The applicant must be in a notified traditional trade and meet the portal’s current identity, age, family and verification conditions. Check the official list before applying.'
    when 'pm-poshan' then 'The child must be enrolled in a covered school. School and state implementation determines meal delivery and menus.'
  end,
  exam_answer = case slug
    when 'pm-kisan' then 'Remember: Central Sector income support; ₹6,000 annually in three instalments; landholding farmer family; DBT; eKYC; explicit exclusion categories.'
    when 'ayushman-bharat-pmjay' then 'Remember: National Health Authority; eligible-family hospitalisation cover; ₹5 lakh per family per year; empanelled hospitals; beneficiary identification—not universal enrolment.'
    when 'mgnregs' then 'Remember: rights-based law, not a discretionary subsidy; 100 days; rural household; adult volunteers for unskilled manual work; Gram Panchayat and job card.'
    when 'jal-jeevan-mission' then 'Remember: rural functional household tap connection and drinking-water service; infrastructure plus local service delivery; not a direct cash transfer.'
    when 'pmay-g' then 'Remember: rural pucca housing; Ministry of Rural Development; beneficiary identification/verification; distinguish it from urban PMAY components.'
    when 'pm-svanidhi' then 'Remember: street vendors; working-capital loan ladder ₹10,000 → ₹20,000 → ₹50,000; 7% interest subsidy for eligible timely repayment; urban-livelihoods and financial inclusion.'
    when 'pm-vishwakarma' then 'Remember: 18 notified traditional trades; artisan recognition, training, toolkit incentive and concessional collateral-free credit; Ministry of MSME.'
    when 'pm-poshan' then 'Remember: school nutrition; cooked meals; Bal Vatika and Classes I–VIII in covered schools; education, nutrition and attendance outcomes.'
  end,
  factsheet_verified = true,
  last_official_check = date '2026-09-08',
  updated_at = now()
where slug in ('pm-kisan', 'ayushman-bharat-pmjay', 'mgnregs', 'jal-jeevan-mission', 'pmay-g', 'pm-svanidhi', 'pm-vishwakarma', 'pm-poshan');
