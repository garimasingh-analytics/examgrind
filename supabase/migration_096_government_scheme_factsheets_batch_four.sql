-- Government-scheme factsheets, batch four. Officially checked 8 September 2026.

update public.government_schemes
set
  eligibility_summary = case slug
    when 'animal-husbandry-infrastructure-development-fund' then 'Individual entrepreneurs, private companies, MSMEs, FPOs, Section 8 companies and dairy cooperatives proposing eligible animal-husbandry infrastructure can seek support through the prescribed lender and scheme route.'
    when 'national-livestock-mission' then 'Eligible farmers, entrepreneurs, institutions, universities and organisations can participate under the relevant sub-mission or activity. Conditions differ for feed and fodder, livestock entrepreneurship, research, insurance and extension activities.'
    when 'national-programme-for-dairy-development' then 'State cooperative dairy federations, district milk unions, eligible producer institutions, FPOs, SHG-run private dairies and state implementing agencies are covered under the appropriate NPDD component. It is primarily an infrastructure and institution-strengthening programme.'
    when 'rashtriya-gokul-mission' then 'States, breeding institutions, farmers and animal-husbandry delivery systems benefit through the scheme’s breed-improvement components. Individual access depends on the state activity and implementing channel.'
    when 'atal-innovation-mission' then 'Schools, higher-education institutions, innovators, start-ups, mentors and incubation ecosystems can participate through the relevant AIM programme. Each initiative, such as Atal Tinkering Labs or Atal Incubation Centres, has its own call and selection rules.'
    when 'atal-mission-rejuvenation-urban-transformation' then 'Cities and Urban Local Bodies are the direct implementing units. Residents benefit through approved urban water, sewerage, green-space and service-delivery projects rather than a single personal application form.'
    when 'digital-india' then 'Digital India is a national umbrella programme delivered through central ministries, states, Common Service Centres and public digital platforms. Citizens, businesses and government institutions use its component services through their relevant portals.'
    when 'national-career-service' then 'Jobseekers, employers, career counsellors and training providers can register on the National Career Service portal. Services are free; jobseekers should never pay a person claiming to arrange an NCS job.'
    when 'national-means-cum-merit-scholarship' then 'Students studying in Class VIII in government, government-aided and local-body schools can sit the state or UT selection test, subject to parental-income and marks conditions. Students in certain residential and private-school categories are excluded under the scheme rules.'
    when 'national-mission-green-india' then 'The mission is implemented through states, landscape-level plans and forest or community institutions. It is a public ecological-restoration mission rather than an individual benefit application.'
  end,
  benefit_details = case slug
    when 'animal-husbandry-infrastructure-development-fund' then 'AHIDF supports investment in dairy and meat processing, animal feed plants, breed-improvement technology and multiplication farms, veterinary vaccines and drugs, animal-waste-to-wealth and primary wool-processing infrastructure. Support is credit-linked and subject to project appraisal; it is not a flat grant to every applicant.'
    when 'national-livestock-mission' then 'NLM operates through sub-missions on livestock development, feed and fodder development, and research, extension, livestock insurance and innovation. It can support entrepreneurship and capacity building in sheep, goat, pig, poultry, fodder and related value chains according to the active guideline.'
    when 'national-programme-for-dairy-development' then 'NPDD strengthens organised milk procurement, village-level milk testing and chilling, processing and value-addition infrastructure, clean-milk practices and dairy institutional capacity. Official guidelines specify the applicable Centre–State or project funding pattern by component.'
    when 'rashtriya-gokul-mission' then 'RGM supports development and conservation of indigenous bovine breeds, genetic improvement, artificial-insemination and breeding infrastructure, Gokul Grams and productivity improvement. Most components are delivered as programme support through states and institutions.'
    when 'atal-innovation-mission' then 'AIM builds innovation capacity through school tinkering labs, incubation, challenges, mentor networks and innovation programmes. Support takes the form of selected institutional grants, mentoring, ecosystem access and challenge-based opportunities rather than a universal individual payment.'
    when 'atal-mission-rejuvenation-urban-transformation' then 'AMRUT 2.0 focuses on universal water supply, sewerage and septage management, water-body rejuvenation, green spaces and urban reforms. Benefits reach residents through approved city projects and municipal service improvements.'
    when 'digital-india' then 'Digital India is built around nine pillars, including broadband highways, mobile connectivity, public internet access, e-governance, electronic service delivery, information access, electronics manufacturing, IT for jobs and early-harvest programmes. It is an umbrella digital-transformation programme, not one cash scheme.'
    when 'national-career-service' then 'NCS offers free job matching, career counselling, job fairs, information on skills and careers, and employer and jobseeker services through its portal and career centres. It does not guarantee a job or charge jobseekers for placement.'
    when 'national-means-cum-merit-scholarship' then 'The scholarship amount is ₹12,000 a year for selected students from Class IX through Class XII, subject to renewal conditions. Selection is through the state or UT Mental Ability Test and Scholastic Aptitude Test under the current rules.'
    when 'national-mission-green-india' then 'Green India Mission aims to increase and improve forest and tree cover, restore ecosystems, enhance biodiversity, improve ecosystem services and strengthen climate resilience through landscape-level action.'
  end,
  application_process = case slug
    when 'animal-husbandry-infrastructure-development-fund' then 'Use the official AHIDF route and participating financial-institution process. Prepare a viable project report, land or infrastructure details, cost estimates and the documents required for lender appraisal.'
    when 'national-livestock-mission' then 'Use the official NLM or state animal-husbandry department route for the relevant activity. Choose the correct sub-mission first, then follow the current portal, subsidy or loan instructions for that activity.'
    when 'national-programme-for-dairy-development' then 'Individual farmers generally access benefits through dairy cooperatives, producer organisations or state dairy systems. Implementing institutions submit approved infrastructure proposals under the applicable component.'
    when 'rashtriya-gokul-mission' then 'Contact the state animal-husbandry department, breeding service or local veterinary system for the live component in the area. Major facilities and breeding programmes are approved through state and national implementation channels.'
    when 'atal-innovation-mission' then 'Apply only through the specific official AIM call, challenge or institutional application window. Schools, colleges, incubators and innovators must follow the criteria published for that programme.'
    when 'atal-mission-rejuvenation-urban-transformation' then 'There is no universal household application. Use the city or Urban Local Body’s service and grievance channels for local water, sanitation or public-space issues.'
    when 'digital-india' then 'Use the relevant service portal or authorised Common Service Centre. Digital India itself is the umbrella; the correct application path depends on the particular service, such as certificates, payments, skilling or digital access.'
    when 'national-career-service' then 'Create a free jobseeker or employer profile on the official NCS portal, complete the profile and use verified vacancies, counsellors, job fairs and career-centre services. Report any request for payment as suspicious.'
    when 'national-means-cum-merit-scholarship' then 'Watch the state or UT education department’s Class VIII NMMS notice, register for the selection test, appear for MAT and SAT, and use the National Scholarship Portal for verified scholarship processing and renewal where applicable.'
    when 'national-mission-green-india' then 'Implementation is routed through state forest departments and approved landscape or ecosystem plans. Community participation is organised locally; there is no nationwide personal-benefit form.'
  end,
  documents_and_conditions = case slug
    when 'animal-husbandry-infrastructure-development-fund' then 'Project viability, promoter identity, entity registration, land or lease details, statutory approvals, cost estimates and lender requirements are central. The proposed activity must be on the current eligible list.'
    when 'national-livestock-mission' then 'Documents and financial conditions depend on the selected activity. Applicants should check the current state portal and guidelines before investing because subsidy ceilings and selection rules differ by component.'
    when 'national-programme-for-dairy-development' then 'Do not describe NPDD as a direct milk-price subsidy to every farmer. It works through approved dairy infrastructure and institutions, with component-specific conditions.'
    when 'rashtriya-gokul-mission' then 'Remember the focus on indigenous bovine breeds, genetic improvement and breeding services. Exact field benefits depend on the state’s approved implementation plan.'
    when 'atal-innovation-mission' then 'Selection is competitive and programme-specific. A school or institution must meet the published call requirements; an individual should not assume automatic funding simply by registering interest.'
    when 'atal-mission-rejuvenation-urban-transformation' then 'Remember the urban focus and municipal implementation. It is distinct from rural water and sanitation missions such as Jal Jeevan Mission and SBM-G.'
    when 'digital-india' then 'Do not call Digital India a scholarship, loan or direct-benefit scheme. Questions usually test its digital-governance architecture and nine pillars.'
    when 'national-career-service' then 'Use only the official portal and recognised career centres. NCS states that its services are free; payment demands or unofficial job guarantees are warning signs.'
    when 'national-means-cum-merit-scholarship' then 'Parental annual income must not exceed ₹3.5 lakh under the scheme rules. Renewal requires the prescribed academic progression and marks conditions; always check the current state notice.'
    when 'national-mission-green-india' then 'Remember that the mission links climate-change response with forests, ecosystem services and community or state implementation. It should not be confused with a single tree-planting giveaway.'
  end,
  exam_answer = case slug
    when 'animal-husbandry-infrastructure-development-fund' then 'Remember: AHIDF is credit-linked infrastructure support for dairy, meat, feed, breed improvement, veterinary and waste-to-wealth projects; entrepreneurs, MSMEs, FPOs and dairy cooperatives are key beneficiaries.'
    when 'national-livestock-mission' then 'Remember: three sub-missions; livestock development, feed and fodder, and research/extension/insurance/innovation; supports livestock entrepreneurship and value chains.'
    when 'national-programme-for-dairy-development' then 'Remember: organised milk procurement, testing, chilling, processing, value addition and clean-milk capacity; implemented through dairy institutions and state systems.'
    when 'rashtriya-gokul-mission' then 'Remember: indigenous bovine breeds, genetic improvement, breeding infrastructure, artificial insemination and Gokul Grams; Department of Animal Husbandry and Dairying.'
    when 'atal-innovation-mission' then 'Remember: NITI Aayog; innovation and entrepreneurship ecosystem; Atal Tinkering Labs, incubation and challenges; programme-specific selection.'
    when 'atal-mission-rejuvenation-urban-transformation' then 'Remember: AMRUT is urban; water supply, sewerage and septage, water bodies, green spaces and reforms; Urban Local Bodies implement projects.'
    when 'digital-india' then 'Remember: MeitY-led umbrella programme; nine pillars; broadband, mobile connectivity, CSCs, e-governance, electronic delivery and IT for jobs.'
    when 'national-career-service' then 'Remember: Ministry of Labour and Employment; free national employment and career platform; job matching, counselling and job fairs; no fee to jobseekers.'
    when 'national-means-cum-merit-scholarship' then 'Remember: Class VIII selection; MAT and SAT; ₹12,000 per year from Class IX–XII; government, aided and local-body school students; family-income limit.'
    when 'national-mission-green-india' then 'Remember: part of India’s climate-change action; forest and tree cover, ecosystem restoration, biodiversity, services and climate resilience.'
  end,
  factsheet_verified = true,
  last_official_check = date '2026-09-08',
  updated_at = now()
where slug in (
  'animal-husbandry-infrastructure-development-fund', 'national-livestock-mission',
  'national-programme-for-dairy-development', 'rashtriya-gokul-mission',
  'atal-innovation-mission', 'atal-mission-rejuvenation-urban-transformation',
  'digital-india', 'national-career-service', 'national-means-cum-merit-scholarship',
  'national-mission-green-india'
);
