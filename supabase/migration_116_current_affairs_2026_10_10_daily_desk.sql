-- 10 October 2026 current-affairs desk.
-- Fresh 9 October releases plus recoverable official releases from 5-7 October,
-- each checked against its linked primary official publication.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-10-gsdp-expenditure-guideline-draft$$, $$2026-10-10$$,
  $$NSO issues draft framework for State GDP estimates from the expenditure side$$,
  $$The National Statistics Office released a draft guideline for compiling Gross State Domestic Product estimates by expenditure approach with base year 2022-23, inviting stakeholder feedback until 28 October.$$,
  $$This is a fiscal-federalism and official-statistics item. It tests the difference between output-side and expenditure-side measurement, the role of a base year, and why comparable State data matter for policy and public finance.$$,
  $$The draft seeks a uniform method for States and Union Territories to compile GSDP from expenditure components under the revised base-year framework. It is a consultation document, not a final binding methodology. GSDP is the State-level counterpart of GDP; expenditure-side compilation aggregates final consumption, investment, government spending and net external trade in the State-accounting framework.$$,
  $$Release of Draft Guideline for Compilation Gross State Domestic Product (GSDP) Estimates by Expenditure Approach with Base Year 2022-23$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2321373&lang=1&reg=3$$,
  $$National Statistics Office, Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-09$$,
  $$["The draft concerns GSDP estimates by the expenditure approach with base year 2022-23.","NSO is part of the Ministry of Statistics and Programme Implementation.","The stated aim is consistency, comparability and methodological standardisation across States and Union Territories.","It is a draft released for feedback, not a final guideline."]$$::jsonb,
  $$[{"question":"What does GSDP measure?","answer":"The value of economic activity within a State or Union Territory; it is the subnational counterpart of GDP."},{"question":"Which base year does the draft use?","answer":"2022-23."}]$$::jsonb,
  $${"title":"From State data to comparable GSDP","steps":["NSO proposes a common expenditure-side method.","States and UTs compile estimates using the revised base year.","Stakeholders submit feedback on the draft.","A final standard can improve inter-State comparability."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-environmental-economic-accounts-strategy$$, $$2026-10-10$$,
  $$MoSPI releases environmental-economic accounts strategy for 2026-30$$,
  $$MoSPI released a 2026-30 roadmap for environmental-economic accounts, setting out priorities to expand accounting of natural resources and environmental activity alongside economic statistics.$$,
  $$This links ecology with economic measurement. It is useful for questions on the UN System of Environmental-Economic Accounting, natural-resource accounts and the distinction between environmental data and the national accounts framework.$$,
  $$The strategy builds on the 2022-26 roadmap and refers to work on forests, biodiversity, wetlands, oceans, soil, water quality, croplands, energy, residuals, urban ecosystems and pollination services. It draws on the SEEA framework endorsed by the UN Statistical Commission and is intended as a guiding, evolving framework rather than a new tax or carbon-credit programme.$$,
  $$Strategy for Environmental Economic Accounts in India 2026-2030$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320063&lang=1&reg=3$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-07$$,
  $$["The strategy covers 2026-2030.","It builds on India's earlier environmental-accounting strategy for 2022-2026.","MoSPI follows the UN-endorsed System of Environmental-Economic Accounting (SEEA).","Priority areas include forests, minerals, land, water, carbon stock and biodiversity."]$$::jsonb,
  $$[{"question":"Which international statistical framework is cited for environmental-economic accounting?","answer":"The System of Environmental-Economic Accounting (SEEA)."},{"question":"Is this strategy itself a carbon-credit trading scheme?","answer":"No. It is a roadmap for measuring and developing environmental-economic accounts."}]$$::jsonb,
  $${"title":"Environmental-economic accounts","steps":["Identify natural-resource and ecosystem information.","Develop consistent environmental accounts and data sources.","Link environmental information with economic statistics.","Use the evidence for monitoring and policy analysis."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-integrated-transport-logistics-authority$$, $$2026-10-10$$,
  $$Cabinet approves SPV for Integrated Transport and Logistics Authority$$,
  $$The Union Cabinet approved creation of the Integrated Transport and Logistics Authority as a special-purpose vehicle to strengthen integrated planning, research, project appraisal, monitoring and impact assessment in transport and logistics.$$,
  $$This is a transport-governance item. It tests multimodal logistics, the use of a special-purpose vehicle and the policy problem of fragmented planning across transport agencies.$$,
  $$The proposed ITLA is intended to act as an apex institution for integrated transport and logistics planning, policy support, data analytics, project appraisal and monitoring. The approval aims to improve coordination across modes, infrastructure efficiency and logistics competitiveness; it does not itself announce a specific new rail, road or port project.$$,
  $$Cabinet approves setting up of Integrated Transport & Logistics Authority$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2319529&lang=1&reg=3$$,
  $$Union Cabinet / Press Information Bureau$$, $$2026-10-06$$,
  $$["ITLA is to be established as a Special Purpose Vehicle.","Its remit includes transport and logistics research, planning, appraisal, monitoring and impact assessment.","It is envisaged as an apex body for integrated transport and logistics planning.","The stated policy rationale is reducing fragmented planning across ministries and agencies."]$$::jsonb,
  $$[{"question":"What organisational form was approved for ITLA?","answer":"A Special Purpose Vehicle (SPV)."},{"question":"Which idea is central to ITLA's mandate?","answer":"Multimodal, integrated transport and logistics planning."}]$$::jsonb,
  $${"title":"Integrated logistics-governance pathway","steps":["Transport agencies generate project and network needs.","ITLA supports coordinated research, appraisal and planning.","Projects are monitored with shared evidence and analysis.","Better modal integration can lower logistics friction and cost."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-sme-growth-fund-cabinet-commitment$$, $$2026-10-10$$,
  $$Cabinet approves ₹10,000-crore commitment for SME Growth Fund$$,
  $$The Union Cabinet approved the Government's ₹10,000-crore commitment towards the SME Growth Fund, intended to provide growth-oriented direct equity investment for eligible small and medium enterprises.$$,
  $$This is an MSME-finance item. It distinguishes equity support from loans, guarantees and invoice discounting, and links a Budget proposal to a later Cabinet decision that advances implementation.$$,
  $$The release describes the fund as part of the Union Budget 2026-27's wider MSME support package. Its stated focus is manufacturing, services, technology, innovation-led sectors and strategic value chains. The fund is designed for direct equity investments, so it is not the same as a credit-guarantee scheme or a TReDS transaction platform.$$,
  $$Cabinet approves Commitment of Rs.10,000 Crore towards establishment of the SME Growth Fund for direct equity investments in Small and Medium Enterprises to create future champions$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2319534&lang=1&reg=3$$,
  $$Union Cabinet, Ministry of Finance / Press Information Bureau$$, $$2026-10-06$$,
  $$["The Cabinet approved a Government commitment of ₹10,000 crore for the SME Growth Fund.","The fund is for direct equity investments in SMEs.","The release connects it to paragraph 28 of Union Budget 2026-27.","Its stated objective is to support growth-oriented capital and future champion enterprises."]$$::jsonb,
  $$[{"question":"Does the SME Growth Fund primarily provide debt or equity support?","answer":"Equity support through direct equity investments."},{"question":"What is the approved Government commitment?","answer":"₹10,000 crore."}]$$::jsonb,
  $${"title":"How the SME Growth Fund fits MSME finance","steps":["Government commits capital to establish the fund.","The fund selects eligible growth-oriented SMEs.","Direct equity investment supports expansion rather than a conventional loan.","Target sectors include manufacturing, services, technology and strategic value chains."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-nta-standing-committee-report$$, $$2026-10-10$$,
  $$Rajya Sabha committee presents report on reforms and strengthening of NTA$$,
  $$The Department-related Parliamentary Standing Committee on Education, Women, Children, Youth and Sports presented its 382nd report on reforms and strengthening of the National Testing Agency.$$,
  $$This is a parliamentary-accountability item with direct relevance for CUET aspirants. It shows that a standing-committee report makes observations and recommendations; it does not by itself amend examination rules or create an immediate change in a test schedule.$$,
  $$The report notes NTA's responsibility for examinations including JEE-Main, NEET-UG, UGC-NET and CUET. It discusses safeguards such as State- and district-level coordination committees, biometric authentication, mobile jammers and AI-based CCTV analysis, while recommending deeper capacity building and timely staffing. The committee was chaired by Rajya Sabha MP Mukul Wasnik.$$,
  $$382nd Report of the Department-related Parliamentary Standing Committee on Education, Women, Children, Youth and Sports: Reforms and Strengthening of the National Testing Agency$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2321420&lang=1&reg=3$$,
  $$Rajya Sabha Secretariat / Press Information Bureau$$, $$2026-10-09$$,
  $$["The report is the 382nd report of the Education, Women, Children, Youth and Sports standing committee.","It concerns reforms and strengthening of the National Testing Agency.","The release names CUET among examinations conducted by NTA.","A parliamentary committee report makes recommendations; implementation requires action by the competent authorities."]$$::jsonb,
  $$[{"question":"Which House's secretariat issued the release on the 382nd NTA report?","answer":"The Rajya Sabha Secretariat."},{"question":"Does a standing-committee recommendation automatically change CUET rules?","answer":"No. It is a recommendation, not an automatic amendment or examination notice."}]$$::jsonb,
  $${"title":"Parliamentary scrutiny of an examination agency","steps":["A standing committee examines an institutional issue.","It hears departments, agencies and experts.","It presents observations and recommendations to Parliament.","The executive and agency decide subsequent implementation steps."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-great-indian-bustard-rewilding-release$$, $$2026-10-10$$,
  $$Two captive-bred Great Indian Bustards released at Desert National Park$$,
  $$Two male Great Indian Bustards were released into the wild at Sam in Rajasthan's Desert National Park, marking a move from conservation breeding towards rewilding and population augmentation.$$,
  $$This is a high-yield biodiversity item. It connects a critically endangered grassland bird with conservation breeding, habitat management, reintroduction protocols, CAMPA support and the role of State and Union institutions.$$,
  $$The Bustard Recovery Programme is a collaboration of the Environment Ministry, Rajasthan Forest Department and Wildlife Institute of India, with technical collaboration from the International Fund for Houbara Conservation and support from National CAMPA. The release says the Sam and Ramdevra facilities held 97 birds and that telemetry-informed fenced grassland enclosures have been developed in Desert National Park.$$,
  $$Union Environment Minister releases two male Great Indian Bustards into the wild at Desert National Park, Jaisalmer$$,
  $$https://www.pib.gov.in/newsite/erelcontent.aspx?relid=295776&lang=1$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-10-04$$,
  $$["The Great Indian Bustard is critically endangered.","Two male birds were released at Sam in Desert National Park, Jaisalmer, Rajasthan.","The Bustard Recovery Programme involves MoEFCC, Rajasthan Forest Department and Wildlife Institute of India.","National CAMPA provides funding support mentioned in the release."]$$::jsonb,
  $$[{"question":"In which State is Desert National Park, where the birds were released?","answer":"Rajasthan."},{"question":"What is rewilding in this context?","answer":"Releasing conservation-bred animals into natural habitat under planned protocols to augment wild populations."}]$$::jsonb,
  $${"title":"From conservation breeding to rewilding","steps":["Eggs and birds are maintained in conservation-breeding facilities.","Scientists prepare birds and habitat for release.","Selected birds are released under monitored protocols.","Telemetry and field learning refine later releases and habitat action."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-ncahp-regulations-radiology-registration$$, $$2026-10-10$$,
  $$NCAHP notifies boards, registration rules and radiology diploma curriculum$$,
  $$The National Commission for Allied and Healthcare Professions notified regulations for autonomous boards and a central assessment committee, alongside a competency-based D.MRIT curriculum and a digital professional-registration framework.$$,
  $$This is a health-sector regulatory item. It links the NCAHP Act, 2021 to quality assurance, professional registration and competency-based allied-health education rather than regulating medical doctors through the National Medical Commission.$$,
  $$The regulations provide for autonomous boards under State Allied and Healthcare Councils and a Central Assessment Committee where a functional State Council is absent. The D.MRIT curriculum has a two-year course and six-month clinical internship, with mandatory adoption by institutions from academic year 2027-28. The registration framework uses central and State registers, UID numbers and QR-coded digital certificates; registration remains valid for five years subject to continuing-professional-development requirements.$$,
  $$National Commission for Allied and Healthcare Professions notifies regulations for autonomous boards and central assessment committee$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2320314&lang=1&reg=3$$,
  $$National Commission for Allied and Healthcare Professions, Ministry of Health and Family Welfare / Press Information Bureau$$, $$2026-10-07$$,
  $$["The measures are under the National Commission for Allied and Healthcare Professions Act, 2021.","D.MRIT means Diploma in Medical Radiology and Imaging Technology.","The D.MRIT curriculum is a two-year programme with a six-month clinical internship.","Registration is valid for five years and uses central and State registers with digital UID-based certificates."]$$::jsonb,
  $$[{"question":"Which law underpins the NCAHP measures?","answer":"The National Commission for Allied and Healthcare Professions Act, 2021."},{"question":"When must institutions adopt the D.MRIT curriculum?","answer":"From academic year 2027-28, though they may adopt it earlier in 2026-27."}]$$::jsonb,
  $${"title":"Allied-health quality and registration framework","steps":["NCAHP sets national regulations and curricula.","State councils and autonomous boards oversee standards where functional.","A Central Assessment Committee operates where a State council is absent.","Digital State and Central registers enable registration and public verification."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-prescription-drug-advertising-draft-rules$$, $$2026-10-10$$,
  $$Health Ministry proposes advertising curbs for drug sellers and distributors$$,
  $$The Health Ministry proposed a draft amendment to extend restrictions on advertising Schedule H, H1 and X medicines to licensed retailers, wholesalers and distributors, subject to prior Central Government sanction.$$,
  $$This is a medicines-regulation item. It tests drug schedules, delegated legislation and the difference between a notified draft rule and a final amendment after the public-objection process.$$,
  $$The proposal would insert sub-rule (22) in Rule 65 of the Drugs Rules, 1945. Existing restrictions applied to manufacturers; the draft seeks to close the stated gap for sale and distribution licence holders. The Ministry invited objections and suggestions within 30 days of the Gazette's public availability, so students should not describe the proposed rule as already final law.$$,
  $$Union Health Ministry Proposes Tighter Curbs on Advertising of Prescription Drugs by Retailers and Wholesalers$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2321172&lang=1&reg=3$$,
  $$Ministry of Health and Family Welfare / Press Information Bureau$$, $$2026-10-09$$,
  $$["The proposal concerns Schedule H, H1 and X medicines.","It proposes insertion of sub-rule (22) under Rule 65 of the Drugs Rules, 1945.","It would extend advertising restrictions to sale and distribution licence holders.","The draft was notified through Gazette notification G.S.R. 861(E) dated 28 September 2026."]$$::jsonb,
  $$[{"question":"Are the advertising curbs described in the release final rules?","answer":"No. They are a draft amendment open to objections and suggestions before finalisation."},{"question":"Which drug schedules are named in the proposed restriction?","answer":"Schedules H, H1 and X."}]$$::jsonb,
  $${"title":"How a draft drug-rule amendment proceeds","steps":["Government publishes a draft amendment in the Gazette.","Stakeholders submit objections and suggestions within the stated period.","Government considers the submissions.","A final rule may then be notified if adopted."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-trai-drm-audit-manual-draft$$, $$2026-10-10$$,
  $$TRAI seeks comments on DRM-based TV addressable-system audit manual$$,
  $$TRAI issued a draft audit manual for Digital Rights Management-based Digital Addressable Systems in broadcasting and cable services, and invited stakeholder comments by 30 October.$$,
  $$This is a communications-regulation item. It distinguishes TRAI's consultation-stage guidance from the underlying Interconnection Regulations, and connects IPTV distribution with addressability, encryption and subscriber-audit controls.$$,
  $$The 2017 Interconnection Regulations require annual audit of distributors' Digital Addressable Systems, including conditional-access systems, subscriber-management systems, DRM and related systems. The draft is aimed at Schedule X DRM-based systems, primarily IPTV, and sets out proposed audit procedures, documentation, pre-signal/compliance and annual subscription audits, roles and standard formats.$$,
  $$Draft Telecommunication (Broadcasting and Cable) Services DRM Based Digital Addressable Systems Audit Manual for stakeholder comments$$,
  $$https://trai.gov.in/draft-telecommunication-broadcasting-cable-services-drm-based-digital-addressable-systems-audit$$,
  $$Telecom Regulatory Authority of India$$, $$2026-10-09$$,
  $$["TRAI released the document as a draft consultation, not a final regulation.","It concerns DRM-based Digital Addressable Systems under Schedule X of the 2017 Interconnection Regulations.","The systems are primarily relevant to IPTV-based distribution services.","Comments are due by 30 October 2026."]$$::jsonb,
  $$[{"question":"Which regulator issued the draft DRM audit manual?","answer":"The Telecom Regulatory Authority of India (TRAI)."},{"question":"What does DRM stand for in this manual?","answer":"Digital Rights Management."}]$$::jsonb,
  $${"title":"DRM-system audit consultation","steps":["Interconnection regulations require annual DAS audits.","TRAI identifies a need for DRM-specific audit procedures.","It publishes a draft manual for stakeholder comments.","After consultation, a final guidance document may be issued."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-10-india-japan-jcm-operational-manual$$, $$2026-10-10$$,
  $$India and Japan launch Joint Crediting Mechanism operational manual$$,
  $$India and Japan launched an operational manual for their Joint Crediting Mechanism, creating procedures for low-carbon projects from the project-idea stage to issuance and authorisation of JCM credits.$$,
  $$This is a climate-governance and international-relations item. It connects bilateral carbon-market cooperation with Article 6.2 of the Paris Agreement while keeping clear that a procedural manual is not itself an emissions target or a domestic carbon-tax measure.$$,
  $$The launch follows an India-Japan memorandum of cooperation of August 2025 and the June 2026 Rule of Implementation. The mechanism is intended to support deployment of advanced low-carbon technologies, climate finance, technology cooperation and high-integrity emission reductions and removals. The manual sets a project-cycle framework, including submission of a Project Idea Note and the later issuance and authorisation of credits.$$,
  $$India and Japan Launch Operational Manual for the Joint Crediting Mechanism$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2319373&lang=1&reg=48$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-10-05$$,
  $$["The India-Japan Joint Crediting Mechanism is linked to Article 6.2 of the Paris Agreement.","The operational manual was launched on 30 September 2026.","The bilateral MoC was signed on 7 August 2025 and the Rule of Implementation was adopted on 8 June 2026.","The manual covers the project cycle from a Project Idea Note to credit issuance and authorisation."]$$::jsonb,
  $$[{"question":"Which Paris Agreement provision is cited for the India-Japan JCM?","answer":"Article 6.2."},{"question":"What comes at the start of the manual's stated project cycle?","answer":"Submission of a Project Idea Note."}]$$::jsonb,
  $${"title":"India-Japan JCM project pathway","steps":["A project proponent submits a Project Idea Note.","The project follows agreed procedures and methodologies.","Emission reductions or removals are assessed under the mechanism.","Credits can be issued and authorised under the bilateral framework."]}$$::jsonb,
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
  $$2026-10-10-gsdp-expenditure-guideline-draft$$,
  $$2026-10-10-environmental-economic-accounts-strategy$$,
  $$2026-10-10-integrated-transport-logistics-authority$$,
  $$2026-10-10-sme-growth-fund-cabinet-commitment$$,
  $$2026-10-10-nta-standing-committee-report$$,
  $$2026-10-10-great-indian-bustard-rewilding-release$$,
  $$2026-10-10-ncahp-regulations-radiology-registration$$,
  $$2026-10-10-prescription-drug-advertising-draft-rules$$,
  $$2026-10-10-trai-drm-audit-manual-draft$$,
  $$2026-10-10-india-japan-jcm-operational-manual$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
