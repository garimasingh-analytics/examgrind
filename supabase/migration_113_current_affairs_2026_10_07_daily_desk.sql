-- 7 October 2026 current-affairs desk.
-- Recovery desk for substantive releases issued on 5-6 October and verified
-- against the linked primary official releases.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-07-integrated-transport-logistics-authority$$, $$2026-10-07$$,
  $$Cabinet approves an Integrated Transport & Logistics Authority$$,
  $$The Union Cabinet approved an Integrated Transport & Logistics Authority (ITLA) as a Special Purpose Vehicle for integrated transport and logistics planning, research, project appraisal and monitoring.$$,
  $$This is an institutional-reform item: it connects roads, railways, ports, aviation, waterways and urban mobility through one planning architecture rather than treating each mode in isolation.$$,
  $$ITLA is to prepare a National Transport Master Plan with a horizon of at least ten years. It will technically appraise and monitor Union Government transport and infrastructure projects costing ₹500 crore or more; existing financial-appraisal arrangements continue separately.$$,
  $$Cabinet approves setting up of Integrated Transport & Logistics Authority$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319529&lang=1&reg=3$$,
  $$Cabinet Secretariat / Press Information Bureau$$, $$2026-10-06$$,
  $$["ITLA is approved as a Special Purpose Vehicle, not as a new ministry.","It will serve as an apex body for integrated transport and logistics planning.","Its National Transport Master Plan is to have a horizon of ten years or more.","ITLA will technically appraise and monitor relevant projects costing ₹500 crore or more."]$$::jsonb,
  $$[{"question":"Will ITLA replace the existing financial appraisal system for major projects?","answer":"No. The release assigns technical appraisal to ITLA while existing financial appraisal mechanisms continue."},{"question":"Name two modes that fall within ITLA's planned transport framework.","answer":"Any two of roads, railways, ports and shipping, civil aviation, inland waterways, coastal shipping, urban mobility and logistics."}]$$::jsonb,
  $${"title":"How integrated transport planning is intended to work","steps":["Transport ministries prepare sectoral and annual plans.","ITLA checks alignment with a long-term multimodal master plan.","Major projects receive technical appraisal and coordinated monitoring.","Post-implementation assessment feeds back into future planning."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-sme-growth-fund$$, $$2026-10-07$$,
  $$Cabinet commits ₹10,000 crore to the SME Growth Fund$$,
  $$The Union Cabinet approved a Government commitment of ₹10,000 crore for the SME Growth Fund, an Alternative Investment Fund framework intended to provide growth-oriented equity capital to small and medium enterprises.$$,
  $$It distinguishes equity support from routine bank credit. For exam purposes, note the instrument, the target firms and its connection with the 2026-27 Budget's MSME support measures.$$,
  $$The Government commitment will go to the AIF established under the SGF framework. The release says the fund is designed to help SMEs expand capacity, adopt advanced technology and compete in manufacturing, services, technology, innovation-led sectors and strategic value chains.$$,
  $$Cabinet approves Commitment of Rs.10,000 Crore towards establishment of the SME Growth Fund for direct equity investments in Small and Medium Enterprises to create future champions$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319532&lang=1&reg=3$$,
  $$Cabinet Secretariat / Press Information Bureau$$, $$2026-10-06$$,
  $$["The approved Government commitment is ₹10,000 crore.","The SME Growth Fund operates through an Alternative Investment Fund framework.","Its focus is direct equity for growth-oriented SMEs, rather than only early-stage micro enterprises.","The decision is linked to the MSME-support announcements in Union Budget 2026-27."]$$::jsonb,
  $$[{"question":"Is the SME Growth Fund described as a conventional interest-bearing loan scheme?","answer":"No. It is an AIF framework for direct equity investments."},{"question":"What type of firms are the intended beneficiaries?","answer":"Growth-oriented small and medium enterprises across sectors such as manufacturing, services and technology."}]$$::jsonb,
  $${"title":"From public commitment to growth capital","steps":["Government makes a commitment to the SGF AIF.","The fund invests equity in eligible growth-oriented SMEs.","Firms use capital for scale, technology and capacity.","Stronger firms can improve productivity, exports and employment."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-vb-g-ram-g-permissible-works$$, $$2026-10-07$$,
  $$Rural Development Ministry notifies 375 permissible works under VB-G RAM G$$,
  $$The Ministry of Rural Development notified 375 permissible works under the Viksit Bharat–Guarantee for Rozgar and Ajeevika Mission (Gramin) Act, 2025. The schedule is organised around water security, rural infrastructure, livelihoods, and disaster preparedness.$$,
  $$The notification is useful for mapping employment-linked rural works to local self-government, climate resilience and decentralised planning. It is a framework of permitted works, not a list of automatically sanctioned projects.$$,
  $$The schedule expands the earlier 266-work framework by 41%. It lists 128 water-security works, 111 core-rural-infrastructure works, 98 livelihood-related works and 38 works for extreme weather events and disaster preparedness. Works are to be planned through Viksit Gram Panchayat Plans approved by the Gram Sabha.$$,
  $$Ministry of Rural Development Notifies 375 Permissible Works under VB–G RAM G$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319426&lang=1&reg=3$$,
  $$Ministry of Rural Development / Press Information Bureau$$, $$2026-10-06$$,
  $$["VB-G RAM G provides for 375 notified permissible works.","The four pillars are water security, core rural infrastructure, livelihoods, and disaster preparedness.","There are 38 works specifically for extreme weather events and disaster preparedness.","The Gram Sabha approves local plans through Viksit Gram Panchayat Plans."]$$::jsonb,
  $$[{"question":"Which local body approves plans for works under this framework?","answer":"The Gram Sabha approves Viksit Gram Panchayat Plans."},{"question":"Does the notified list include a distinct disaster-preparedness category?","answer":"Yes. It includes 38 works for extreme weather events and disaster preparedness."}]$$::jsonb,
  $${"title":"Planning a permissible rural work","steps":["A village identifies a local infrastructure or livelihood need.","The need is placed in the Viksit Gram Panchayat Plan.","The Gram Sabha approves the decentralised plan.","The permitted work is tracked through the rural infrastructure stack."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-index-of-services-production-approach-paper$$, $$2026-10-07$$,
  $$MoSPI proposes wider coverage for the Index of Services Production$$,
  $$MoSPI published an approach paper to expand its trial monthly Index of Services Production (ISP). The proposal would add education, human health and residential care, and public administration and defence to the index framework.$$,
  $$An ISP helps track short-term movement in the services economy, much as other high-frequency indicators track parts of the economy. Students should distinguish the trial index from a final, comprehensive official series.$$,
  $$The July 2026 trial tracks 19 broad formal-service sub-sectors using administrative and GST outward-supply data, covering about 60% of services-sector GVA. The proposed additions represent nearly 21% more of 2024-25 services GVA and would lift coverage to about 80%. Comments are invited until 16 October 2026.$$,
  $$An Approach Paper on Expanding the scope and coverage for the Index of Services Production$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319661&lang=1&reg=1$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-06$$,
  $$["MoSPI began a trial monthly ISP with base year 2024-25 in July 2026.","The present trial covers 19 broad formal-service sub-sectors.","The proposal adds education; human health and residential care; and public administration and defence.","The proposed expansion would increase services-GVA coverage from about 60% to about 80%."]$$::jsonb,
  $$[{"question":"What does ISP stand for in this release?","answer":"Index of Services Production."},{"question":"Is the July 2026 ISP already a fully comprehensive services index?","answer":"No. It is a trial framework that MoSPI proposes to expand."}]$$::jsonb,
  $${"title":"Expanding a high-frequency services indicator","steps":["The trial ISP uses administrative and GST-based signals for selected formal services.","Some government, non-market and GST-exempt activity remains outside its scope.","MoSPI proposes methodologies for three large excluded service areas.","Broader coverage would make the monthly measure more representative."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-caqm-ptz-camera-order$$, $$2026-10-07$$,
  $$CAQM orders expanded PTZ-camera monitoring of industrial fuel use in NCR$$,
  $$The Commission for Air Quality Management directed industrial units in the National Capital Region to expand Pan-Tilt-Zoom camera coverage of fuel storage and charging areas, with real-time feeds for pollution-control authorities.$$,
  $$This is a concrete regulatory tool in Delhi-NCR air-pollution governance. It links CAQM, CPCB, State Pollution Control Boards and the Delhi Pollution Control Committee to compliance monitoring rather than creating a new emissions standard.$$,
  $$Industries must add the prescribed cameras by 31 October 2026. For gas-based fuel, the gauge or meter must be captured. Live feeds are to reach CPCB and the relevant SPCB or DPCC, and implementation status is due to CAQM by 1 November.$$,
  $$CAQM mandates Installation of PTZ Cameras at Industries to ensure Comprehensive Real-time Monitoring of Fuel Use and Compliance in NCR$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319694&lang=1&reg=3$$,
  $$Commission for Air Quality Management / Press Information Bureau$$, $$2026-10-06$$,
  $$["CAQM is the Commission for Air Quality Management in NCR and Adjoining Areas.","The order covers fuel storage and fuel-charging locations at industries in NCR.","Real-time video feeds are to be available to CPCB and the concerned SPCB or DPCC.","The stated deadline for additional camera installation is 31 October 2026."]$$::jsonb,
  $$[{"question":"What does PTZ mean in this compliance order?","answer":"Pan-Tilt-Zoom, describing a controllable camera type."},{"question":"Which institutions are to receive real-time feeds?","answer":"CPCB and the concerned State Pollution Control Board or Delhi Pollution Control Committee."}]$$::jsonb,
  $${"title":"From fuel use to compliance evidence","steps":["An industry installs cameras at prescribed fuel-use locations.","Camera feeds are streamed to the designated pollution-control systems.","Authorities can remotely check approved-fuel compliance.","CAQM receives implementation status for regulatory follow-up."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-esanjeevani-50-crore-teleconsultations$$, $$2026-10-07$$,
  $$eSanjeevani crosses 50 crore teleconsultations$$,
  $$The Union Health Ministry reported that eSanjeevani, India’s National Telemedicine Service, has crossed 50 crore teleconsultations. The service connects patients with public-health providers through telemedicine platforms.$$,
  $$The milestone provides a useful example of digital public health delivery. It should not be confused with private telemedicine apps or with a new insurance benefit.$$,
  $$The release reports that women account for 57.14% of usage and people aged 46 years or above account for 40.15% of consultations. It also notes integration of an AI-enabled clinical decision-support system and ERSS-112, and the availability of specialist OPD consultations through government institutions.$$,
  $$E-Sanjeevani Crosses 50 Crore Teleconsultations, Strengthening Access to Healthcare Across the Country$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319427&lang=1&reg=3$$,
  $$Ministry of Health and Family Welfare / Press Information Bureau$$, $$2026-10-06$$,
  $$["eSanjeevani is described as India’s National Telemedicine Service.","It crossed 50 crore teleconsultations.","Women account for 57.14% of reported eSanjeevani utilisation.","The release reports integration with an AI-powered clinical decision-support system and ERSS-112."]$$::jsonb,
  $$[{"question":"Is eSanjeevani a private-only health platform?","answer":"No. The release identifies it as India’s National Telemedicine Service."},{"question":"What milestone did the service cross?","answer":"50 crore teleconsultations."}]$$::jsonb,
  $${"title":"A telemedicine service pathway","steps":["A patient accesses a digital public-health consultation.","A provider delivers primary or specialist teleconsultation support.","Digital systems can support clinical decisions and emergency linkage.","The service extends access without requiring every consultation to start in a hospital."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-india-japan-jcm-operational-manual$$, $$2026-10-07$$,
  $$India and Japan launch the Joint Crediting Mechanism operational manual$$,
  $$India and Japan launched an operational manual for their Joint Crediting Mechanism (JCM), setting procedures for projects that use advanced low-carbon technologies and generate authorised JCM credits.$$,
  $$This turns a bilateral climate-cooperation framework into an implementable project process. The key exam link is Article 6.2 of the Paris Agreement, which concerns cooperative approaches between Parties.$$,
  $$The manual follows an India-Japan Memorandum of Cooperation signed on 7 August 2025 and Rules of Implementation adopted on 8 June 2026. It covers the project cycle from a Project Idea Note to issuance and authorisation of JCM credits.$$,
  $$India and Japan Launch Operational Manual for the Joint Crediting Mechanism$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319373&lang=2&reg=48$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-10-05$$,
  $$["JCM stands for Joint Crediting Mechanism.","The India-Japan mechanism is linked to Article 6.2 of the Paris Agreement.","The operational manual covers the process from Project Idea Note to credit issuance and authorisation.","The underlying India-Japan MoC was signed on 7 August 2025."]$$::jsonb,
  $$[{"question":"Which Paris Agreement provision is cited for this bilateral mechanism?","answer":"Article 6.2."},{"question":"Does the manual only discuss technology cooperation in general terms?","answer":"No. It lays out project-cycle procedures through credit issuance and authorisation."}]$$::jsonb,
  $${"title":"A bilateral carbon-cooperation project cycle","steps":["A developer prepares a Project Idea Note.","The activity follows the JCM's approved procedures.","Low-carbon action is monitored and processed for crediting.","Credits are issued and authorised under the bilateral framework."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-brahmos-navy-fire-control-contract$$, $$2026-10-07$$,
  $$Defence Ministry signs ₹661.50 crore BrahMos fire-control and launcher contract$$,
  $$The Ministry of Defence signed a ₹661.50 crore contract with BrahMos Aerospace Private Limited for BrahMos fire-control systems and launchers for Indian Navy ships under the Buy (Indian-IDDM) category.$$,
  $$The contract is relevant to defence procurement and indigenisation. It concerns the fire-control and launcher components fitted on naval platforms, not a new missile test or a separate service branch.$$,
  $$The release states that the project has at least 68% indigenous content and is expected to generate employment over three years. It describes BrahMos on frontline warships as the Navy's primary surface-to-surface missile system for maritime-strike operations.$$,
  $$MoD signs Rs 661 crore contract to procure BrahMos Fire Control System and Launchers for Indian Navy ships$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319502&lang=1&reg=3$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-06$$,
  $$["The contract value is ₹661.50 crore.","It is under the Buy (Indian-IDDM) procurement category.","The stated minimum indigenous content is 68%.","The procurement is for BrahMos fire-control systems and launchers for Indian Navy ships."]$$::jsonb,
  $$[{"question":"Which armed service's ships are covered by this procurement?","answer":"The Indian Navy's ships."},{"question":"What does the release identify as the procurement category?","answer":"Buy (Indian-IDDM)."}]$$::jsonb,
  $${"title":"From defence procurement to maritime capability","steps":["MoD contracts an Indian defence manufacturer.","Fire-control systems and launchers are produced with prescribed indigenous content.","The equipment is fitted on Indian Navy ships.","The systems support naval maritime-strike capability."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-veeraai-indigenous-ai-vision-soc$$, $$2026-10-07$$,
  $$TDB backs Project VeerAI for an indigenous AI Vision System-on-Chip$$,
  $$The Technology Development Board signed an agreement with BigEndian Semiconductors for ₹130 crore in Research, Development and Innovation Fund support for Project VeerAI, an indigenous AI Vision System-on-Chip programme.$$,
  $$This is a useful semiconductor-policy brief because it connects a funding institution, technology readiness levels and an application-specific chip, instead of treating every AI announcement as a general-purpose computing project.$$,
  $$The project has a total cost of ₹260 crore and aims to move from Technology Readiness Level 5 to 9. Support is to be provided through optional convertible debt. The initial use case is secure AI-enabled CCTV and surveillance, with potential applications in defence, automotive, industry and medicine.$$,
  $$TDB-DST signs agreement with BigEndian Semiconductors for ₹130 crore RDI support to develop indigenous AI Vision SoC$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2319038&lang=1&reg=3$$,
  $$Technology Development Board, Department of Science and Technology / Press Information Bureau$$, $$2026-10-05$$,
  $$["Project VeerAI is aimed at an AI Vision System-on-Chip (SoC).","TDB support is ₹130 crore under the RDI Fund.","The total stated project cost is ₹260 crore.","The project seeks to move from TRL-5 to TRL-9."]$$::jsonb,
  $$[{"question":"What does SoC mean in this semiconductor brief?","answer":"System-on-Chip."},{"question":"Which funding form is specified for the TDB support?","answer":"Optional convertible debt."}]$$::jsonb,
  $${"title":"Taking an application-specific chip toward deployment","steps":["An Indian firm develops an AI Vision SoC prototype.","RDI support funds validation, integration, testing and scale-up.","The programme advances from TRL-5 toward TRL-9.","A deployable chip can support secure application-specific systems."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-07-india-switzerland-state-visit-outcomes$$, $$2026-10-07$$,
  $$India and Switzerland conclude mobility, young-professionals and infrastructure arrangements$$,
  $$India and Switzerland announced outcomes of the Swiss President's State Visit, including a Migration and Mobility Partnership, an agreement on exchange of young professionals and cooperation on transport and infrastructure.$$,
  $$This is a bilateral-relations item with clear exam hooks: migration management, mobility, technology cooperation and infrastructure. Treat each instrument as an agreement or MoU, not as a unilateral change to Indian visa rules.$$,
  $$The young-professionals arrangement provides for exchange of 300 people annually per country, with a possible increase to 500. Other outcomes include a transport-and-mobility MoU, a DST–Swiss National Science Foundation letter of intent, and an implementation arrangement with Zurich University of Applied Sciences for innovation and entrepreneurship cooperation.$$,
  $$List of Outcomes: State Visit of President of the Swiss Confederation to India$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PMO=3&PRID=2319109&lang=1&reg=3$$,
  $$Prime Minister's Office / Press Information Bureau$$, $$2026-10-05$$,
  $$["The outcome list includes a Migration and Mobility Partnership.","It also includes an agreement on exchange of young professionals.","The young-professionals arrangement starts at 300 exchanges annually per country and may rise to 500.","The transport MoU covers areas such as EVs, ropeways, circular economy and tunnels."]$$::jsonb,
  $$[{"question":"Which European country is the partner in the Young Professionals arrangement?","answer":"Switzerland."},{"question":"What is the initial annual exchange figure in the agreement?","answer":"300 persons per country, with a possible increase to 500."}]$$::jsonb,
  $${"title":"How the India-Switzerland outcome package connects","steps":["Governments establish mobility and young-professional cooperation.","Technical agencies add transport, research and innovation arrangements.","Institutions implement exchange and collaboration activities.","The package broadens bilateral links beyond trade alone."]}$$::jsonb,
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
  $$2026-10-07-integrated-transport-logistics-authority$$,
  $$2026-10-07-sme-growth-fund$$,
  $$2026-10-07-vb-g-ram-g-permissible-works$$,
  $$2026-10-07-index-of-services-production-approach-paper$$,
  $$2026-10-07-caqm-ptz-camera-order$$,
  $$2026-10-07-esanjeevani-50-crore-teleconsultations$$,
  $$2026-10-07-india-japan-jcm-operational-manual$$,
  $$2026-10-07-brahmos-navy-fire-control-contract$$,
  $$2026-10-07-veeraai-indigenous-ai-vision-soc$$,
  $$2026-10-07-india-switzerland-state-visit-outcomes$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
