-- 8 October 2026 current-affairs desk.
-- Fresh 7 October releases and a small set of recoverable, substantive releases
-- from 5-6 October, each checked against the linked official primary release.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-08-ncahp-autonomous-boards-regulations$$, $$2026-10-08$$,
  $$NCAHP notifies boards, assessment mechanism and digital registration rules$$,
  $$The National Commission for Allied and Healthcare Professions (NCAHP) notified 2026 regulations for Autonomous Boards, a Central Assessment Committee and professional registration, alongside a competency-based D.MRIT curriculum.$$,
  $$This is a health-governance and regulatory-body item. It shows how the NCAHP Act, 2021 is being operationalised through State-level quality, ethics, registration and assessment arrangements.$$,
  $$Autonomous Boards under State Allied and Healthcare Councils will cover education, assessment, ethics and registration. Where a functional State Council is absent, a Central Assessment Committee under NCAHP can perform those functions. The D.MRIT course is a two-year diploma for Class 12 science students and its notified curriculum is mandatory from academic year 2027-28.$$,
  $$National Commission for Allied and Healthcare Professions notifies regulations for autonomous boards and central assessment committee$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320314&lang=1&reg=3$$,
  $$Ministry of Health and Family Welfare / Press Information Bureau$$, $$2026-10-07$$,
  $$["NCAHP operates under the National Commission for Allied and Healthcare Professions Act, 2021.","State Autonomous Boards cover education, assessment, ethics and registration functions.","The Central Assessment Committee works where a functional State Council does not exist.","The D.MRIT curriculum becomes mandatory for institutions from academic year 2027-28."]$$::jsonb,
  $$[{"question":"When does the Central Assessment Committee step in under these regulations?","answer":"It performs the relevant functions in States or Union Territories without a functional State Council."},{"question":"What does D.MRIT stand for?","answer":"Diploma in Medical Radiology and Imaging Technology."}]$$::jsonb,
  $${"title":"Allied-health quality architecture","steps":["NCAHP sets a national regulatory framework.","State Councils and their Autonomous Boards oversee institutions and professionals.","Assessment, rating, ethics and registration information are maintained through the framework.","CAC provides a central route where the State-level institution is not functional."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-environmental-economic-accounts-strategy$$, $$2026-10-08$$,
  $$MoSPI releases environmental-economic accounts strategy for 2026-30$$,
  $$MoSPI released a 2026-30 roadmap for environmental-economic accounts, extending its earlier strategy and setting out work on resources, ecosystems, environmental activity and data gaps.$$,
  $$Environmental accounts connect physical natural-resource information with economic accounting. The release is useful for questions on green national accounts, sustainable development indicators and the UN System of Environmental-Economic Accounting.$$,
  $$MoSPI follows the UN Statistical Commission-endorsed System of Environmental-Economic Accounting (SEEA). The new strategy builds on work on material flows, oceans, energy, biodiversity and urban accounts, and identifies expanded coverage for forests, minerals, soil, land, water, carbon stock and environment-related activities.$$,
  $$Document on Strategy for Environmental Economic Accounts in India 2026-2030$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320063&lang=1&reg=3$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-07$$,
  $$["The 2026-30 document extends MoSPI's 2022-26 environmental-accounts strategy.","MoSPI follows the UN-endorsed System of Environmental-Economic Accounting (SEEA).","The roadmap covers subjects including forests, minerals, soil, land, water and carbon stock.","It is a strategic guidance document, not a separate measure of GDP."]$$::jsonb,
  $$[{"question":"Which international framework is named in the release?","answer":"The System of Environmental-Economic Accounting, endorsed by the UN Statistical Commission."},{"question":"Does the strategy itself create a new environmental tax?","answer":"No. It is a statistical and accounting roadmap for environmental-economic accounts."}]$$::jsonb,
  $${"title":"Linking nature and national accounts","steps":["Physical data are assembled for resources and ecosystems.","Statistical accounts describe stocks, flows and related activity.","Data gaps and priority areas are identified.","The evidence can support policy, monitoring and State or UT environmental-accounting work."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-mod-proof-ranges-revised-sop$$, $$2026-10-08$$,
  $$Defence Ministry revises industry access to proof ranges and test facilities$$,
  $$The Ministry of Defence approved a revised procedure for Indian defence-industry use of proof ranges, field-firing ranges and laboratory test facilities held by DRDO, quality-assurance agencies and the Services.$$,
  $$The decision links defence indigenisation to testing infrastructure. It matters because a prototype or developmental system requires safe, regulated testing before it can move towards procurement or deployment.$$,
  $$The revised SOP waives proof and testing charges for iDEX, Technology Development Fund, Make and other MoD developmental projects. It reserves a three-day slot each quarter at proof ranges for specified developmental firing and replaces an arbitration provision with a conciliation-agreement clause.$$,
  $$Raksha Mantri approves Revised Standard Operating Procedure for Utilisation of MoD Proof Ranges, Field Firing Ranges and Test Facilities by Indian Defence Industry$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320195&lang=1&reg=3$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-07$$,
  $$["The SOP concerns proof ranges, field-firing ranges and laboratory test facilities.","It lists facilities of DRDO, Government Quality Assurance agencies and the three Services.","Testing charges are waived for specified MoD developmental projects, including iDEX, TDF and Make.","A three-day proof-firing slot per quarter is reserved for developmental projects."]$$::jsonb,
  $$[{"question":"Which dispute-resolution term replaces arbitration in the revised SOP?","answer":"A conciliation-agreement clause."},{"question":"Is the procedure limited to DRDO facilities?","answer":"No. It covers listed facilities of DRDO, Government Quality Assurance agencies and the three Services."}]$$::jsonb,
  $${"title":"A defence prototype's testing path","steps":["An Indian developer applies for an appropriate listed facility.","The SOP governs allotment, formats and any applicable charges.","The system undergoes proof firing or laboratory testing.","Results support further development, certification and eventual induction processes."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-fleet-support-ships-launch-keel-laying$$, $$2026-10-08$$,
  $$First Fleet Support Ship launched as fifth ship's keel is laid at HSL$$,
  $$Hindustan Shipyard Limited launched FSS-1, the first Fleet Support Ship for the Indian Navy, while the keel of FSS-5 was laid and an upgraded slipway was inaugurated at Visakhapatnam.$$,
  $$Fleet support ships are force multipliers: they allow naval vessels to replenish at sea, extending the range and endurance associated with blue-water operations. The project is also a clear indigenisation example.$$,
  $$The ships are indigenously designed and built by HSL with over 82% indigenous content, according to the release. Besides replenishment at sea, their secondary roles include humanitarian assistance and disaster relief and non-combatant evacuation operations.$$,
  $$Launch and keel laying of Fleet Support Ships$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320049&lang=1&reg=3$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-07$$,
  $$["FSS-1 is the first Fleet Support Ship under construction at Hindustan Shipyard Limited, Visakhapatnam.","The event also marked keel laying for FSS-5.","The release states indigenous content is over 82%.","Fleet Support Ships replenish fleet vessels at sea and can undertake HADR and non-combatant evacuation roles."]$$::jsonb,
  $$[{"question":"What core naval function do Fleet Support Ships perform?","answer":"They replenish other fleet ships at sea, supporting longer operations away from harbour."},{"question":"Which shipyard is building the ships mentioned in the release?","answer":"Hindustan Shipyard Limited at Visakhapatnam."}]$$::jsonb,
  $${"title":"Why fleet support changes naval reach","steps":["A support ship carries replenishment supplies.","It meets fleet vessels during operations at sea.","Warships can stay deployed longer without returning to harbour.","The same platform can assist relief or evacuation missions when required."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-india-uk-financial-markets-dialogue$$, $$2026-10-08$$,
  $$India and UK advance financial-markets cooperation at fourth dialogue$$,
  $$India and the United Kingdom adopted a joint statement after their fourth Financial Markets Dialogue in London, covering capital markets, insurance and pensions, asset management, sustainable finance and fintech.$$,
  $$The dialogue is a bilateral regulatory-cooperation mechanism, not a domestic Indian regulator. It provides a way to map the roles of RBI, SEBI, IFSCA, PFRDA and IRDAI in cross-border financial-sector engagement.$$,
  $$The 29 September dialogue included India's Finance Ministry and five Indian financial authorities, and UK authorities including HM Treasury, the Bank of England and the Financial Conduct Authority. It noted GIFT IFSC's role in mobilising international capital and agreed to continue cooperation, including on capital-market connectivity, asset management, fintech and cross-border payments.$$,
  $$Adopted Joint Statement after the India-UK Financial Markets Dialogue 2026, held in London$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320225&lang=2&reg=48$$,
  $$Ministry of Finance / Press Information Bureau$$, $$2026-10-07$$,
  $$["The fourth UK-India Financial Markets Dialogue took place in London on 29 September 2026.","Indian participants included RBI, SEBI, IFSCA, PFRDA and IRDAI.","The discussion included capital markets, insurance and pensions, asset management, sustainable finance and fintech.","The statement refers to GIFT IFSC's role in mobilising international capital."]$$::jsonb,
  $$[{"question":"Which Indian authority regulates the International Financial Services Centre?","answer":"The International Financial Services Centres Authority, or IFSCA."},{"question":"Was the dialogue only about trade in goods?","answer":"No. It focused on financial-market and regulatory cooperation."}]$$::jsonb,
  $${"title":"Bilateral financial-market cooperation","steps":["Finance ministries and regulators compare reforms and market developments.","They identify areas such as capital markets, insurance, pensions and fintech.","Regulators continue technical cooperation and knowledge-sharing.","This can support cross-border investment and market connectivity."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-trai-telecom-yearly-indicators-2025-26$$, $$2026-10-08$$,
  $$TRAI releases telecom-services yearly performance indicators for 2025-26$$,
  $$TRAI released its annual performance report for telecom services, cable TV, DTH and radio for 2025-26, reporting 1,092.79 million internet subscribers and a rise in overall teledensity to 93.26% at end-March 2026.$$,
  $$The report is a high-value official data source for questions on telecom regulation, digital connectivity and the difference between internet, broadband and teledensity indicators.$$,
  $$Internet subscribers rose from 969.10 million at end-March 2025 to 1,092.79 million at end-March 2026. Of the 2026 total, 1,065.88 million were broadband subscribers. The report covers the period from 1 April 2025 to 31 March 2026 and is mainly compiled from service-provider information.$$,
  $$The Indian Telecom Services Yearly Performance Indicators for the year 2025-26$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2319321&lang=1&reg=48$$,
  $$Telecom Regulatory Authority of India / Press Information Bureau$$, $$2026-10-05$$,
  $$["TRAI released the annual report for the period 1 April 2025 to 31 March 2026.","Internet subscribers were 1,092.79 million at end-March 2026.","Broadband subscribers were 1,065.88 million at end-March 2026.","Overall teledensity rose from 85.04% to 93.26% over the reported year."]$$::jsonb,
  $$[{"question":"Does every internet subscriber count as a broadband subscriber in this report?","answer":"No. The report separately lists broadband and narrowband subscribers."},{"question":"What does teledensity express in this context?","answer":"Telephone connections relative to population, conventionally stated per 100 persons."}]$$::jsonb,
  $${"title":"Reading telecom performance indicators","steps":["Service providers supply operating data.","TRAI compiles subscriber and financial measures.","Internet data are split into broadband and narrowband categories.","The annual report tracks trends in connectivity and other telecom services."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-bogibeel-dhaka-international-cargo$$, $$2026-10-08$$,
  $$Bogibeel sends first post-Independence international cargo from Dibrugarh$$,
  $$A 540-tonne methanol consignment was sent from Bogibeel terminal at Dibrugarh to Dhaka, marking the first cargo shipment from upper Assam to a foreign port since Independence, according to the Ports Ministry.$$,
  $$The operational voyage is a useful example of inland-waterway trade, regional connectivity and the role of National Waterway-2 and the India-Bangladesh Protocol Route in linking the North East with external markets.$$,
  $$The methanol was produced by Assam Petro-Chemicals Limited at Namrup and is bound for Pangaon Port in Dhaka. Its route uses the Brahmaputra as National Waterway-2 to the India-Bangladesh border, followed by the Indo-Bangladesh Protocol Route. The release says regular methanol shipments are planned.$$,
  $$Dibrugarh Sends First International Cargo from Bogibeel to Bangladesh Since Independence$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319146&lang=1&reg=3$$,
  $$Ministry of Ports, Shipping and Waterways / Press Information Bureau$$, $$2026-10-05$$,
  $$["The consignment carried 540 metric tonnes of methanol from Bogibeel to Dhaka.","The release calls it the first upper-Assam cargo shipment to a foreign port since Independence.","The Indian river leg uses National Waterway-2 on the Brahmaputra.","The cross-border movement continues through the Indo-Bangladesh Protocol Route."]$$::jsonb,
  $$[{"question":"Which river forms National Waterway-2?","answer":"The Brahmaputra."},{"question":"What is the destination port named in the release?","answer":"Pangaon Port in Dhaka, Bangladesh."}]$$::jsonb,
  $${"title":"From Assam production to a foreign river port","steps":["Methanol is produced at Namrup in Assam.","Cargo is loaded at Bogibeel terminal near Dibrugarh.","The barge moves on NW-2 along the Brahmaputra.","It continues via the Indo-Bangladesh Protocol Route to Dhaka."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-additive-manufacturing-india-nsam-2$$, $$2026-10-08$$,
  $$PIB backgrounder tracks additive manufacturing and the NSAM 2.0 phase$$,
  $$A PIB Research backgrounder describes progress under the National Strategy for Additive Manufacturing and its planned NSAM 2.0 phase, placing 3D printing within India's manufacturing, skilling and innovation ecosystem.$$,
  $$This gives a compact technology-policy link between a manufacturing method, a national strategy and applications such as design prototyping, healthcare, aerospace and decentralised production.$$,
  $$Additive manufacturing builds an object layer by layer from a digital design, unlike subtractive methods that remove material. The backgrounder states that the 2022 national strategy has trained over 1.54 lakh individuals and supported 56 additive-manufacturing start-ups, while NSAM 2.0 is the next planned phase.$$,
  $$Additive Manufacturing in India: Building India's Future with Next Generation Digital Manufacturing$$,
  $$https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160346&lang=1&reg=3$$,
  $$PIB Research / Press Information Bureau$$, $$2026-10-07$$,
  $$["Additive manufacturing is commonly called 3D printing.","It creates an object layer by layer using a digital design.","The National Strategy for Additive Manufacturing was introduced in 2022.","The backgrounder reports more than 1.54 lakh people trained and 56 supported AM start-ups under the strategy."]$$::jsonb,
  $$[{"question":"How does additive manufacturing differ from a subtractive process?","answer":"It builds material layer by layer instead of cutting material away from a larger piece."},{"question":"What is NSAM?","answer":"National Strategy for Additive Manufacturing."}]$$::jsonb,
  $${"title":"Digital design to manufactured object","steps":["A digital model is prepared.","A machine deposits or fuses material in successive layers.","The part is finished and tested for its intended application.","Strategy, skilling and start-up support help grow the domestic ecosystem."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-sc-beneficiary-financial-schemes-reporting$$, $$2026-10-08$$,
  $$Financial-inclusion reviews will report Scheduled Caste beneficiaries scheme by scheme$$,
  $$Following an intervention by the National Commission for Scheduled Castes, the Department of Financial Services directed State and Union Territory Level Bankers' Committees to report assistance to Scheduled Caste beneficiaries scheme by scheme and bank by bank.$$,
  $$This is a social-justice accountability measure rather than a new credit scheme. It helps connect Article 338, financial inclusion and data-based monitoring of scheme delivery.$$,
  $$The direction covers periodic review reporting for schemes including PMMY, Stand-Up India, PMEGP, PM SVANidhi, CGTMSE and MSME Business Loans. The release says existing bank and implementing-agency data should be used, avoiding a parallel reporting system. It links the intervention to the NCSC's constitutional function under Article 338(5)(c).$$,
  $$NCSC Intervention Results in Mandatory Reporting of SC Beneficiaries under Key Financial Schemes$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320345&lang=1&reg=3$$,
  $$Ministry of Social Justice and Empowerment / Press Information Bureau$$, $$2026-10-07$$,
  $$["NCSC is the National Commission for Scheduled Castes.","SLBCs and UTLBCs must include scheme-wise and bank-wise SC-beneficiary details in periodic reviews.","The covered examples include PMMY, Stand-Up India, PMEGP, PM SVANidhi and CGTMSE.","The release cites Article 338(5)(c) concerning evaluation of SC socio-economic development progress."]$$::jsonb,
  $$[{"question":"Does the direction create a new loan scheme for Scheduled Castes?","answer":"No. It requires standardised reporting on assistance already provided under identified schemes."},{"question":"Which constitutional body raised the reporting concern?","answer":"The National Commission for Scheduled Castes."}]$$::jsonb,
  $${"title":"Data-based monitoring of financial inclusion","steps":["Banks and implementing agencies hold scheme-delivery data.","SLBCs and UTLBCs compile scheme-wise and bank-wise SC-beneficiary information.","The information is reviewed and shared with NCSC.","The data supports evaluation of delivery and socio-economic progress."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-08-national-household-travel-survey-2025-26$$, $$2026-10-08$$,
  $$NSO releases findings of India's first National Household Travel Survey$$,
  $$The National Statistical Office released key findings from the first all-India National Household Travel Survey, conducted from July 2025 to June 2026, to inform transport planning and infrastructure decisions.$$,
  $$This is an official-survey methodology and transport-planning item. It supplies nationally comparable evidence on travel purpose, modes, costs and duration rather than a transport scheme or a passenger-count estimate.$$,
  $$The survey covered rural and urban areas across all States and Union Territories, collecting data from 492,023 households and 2,034,371 persons. For the survey, a trip is travel of more than one kilometre; a travel day runs from 3:00 AM to 2:59 AM the next day. The release reports that two-wheelers account for 42.6% of fixed-workplace commuting and buses for 55.8% of household overnight journeys.$$,
  $$National Household Travel Survey July 2025-June 2026$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2319180&lang=2&reg=48$$,
  $$National Statistical Office, Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-05$$,
  $$["NHTS is India's first all-India National Household Travel Survey.","It covered 492,023 households and 2,034,371 persons.","For NHTS, a trip covers more than one kilometre.","Two-wheelers account for 42.6% of workers' fixed-workplace commuting in the reported findings."]$$::jsonb,
  $$[{"question":"Does NHTS count a trip of exactly one kilometre as travel?","answer":"No. Its stated definition covers travel of more than one kilometre."},{"question":"What is one purpose of NHTS data?","answer":"To support transport planning, infrastructure development and evidence-based policy formulation."}]$$::jsonb,
  $${"title":"How a household travel survey supports planning","steps":["NSO collects household-level information on trips, modes, time and cost.","Definitions make results comparable across rural and urban India.","Indicators show mobility patterns and public-transport use.","Planners can use the evidence to identify accessibility and service gaps."]}$$::jsonb,
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
  $$2026-10-08-ncahp-autonomous-boards-regulations$$,
  $$2026-10-08-environmental-economic-accounts-strategy$$,
  $$2026-10-08-mod-proof-ranges-revised-sop$$,
  $$2026-10-08-fleet-support-ships-launch-keel-laying$$,
  $$2026-10-08-india-uk-financial-markets-dialogue$$,
  $$2026-10-08-trai-telecom-yearly-indicators-2025-26$$,
  $$2026-10-08-bogibeel-dhaka-international-cargo$$,
  $$2026-10-08-additive-manufacturing-india-nsam-2$$,
  $$2026-10-08-sc-beneficiary-financial-schemes-reporting$$,
  $$2026-10-08-national-household-travel-survey-2025-26$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
