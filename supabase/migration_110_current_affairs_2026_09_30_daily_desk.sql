-- 30 September 2026 daily current-affairs desk.
-- Every brief was checked against the linked primary official source.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-09-30-msme-mospi-statistical-business-register$$, $$2026-09-30$$,
  $$MSME Ministry and MoSPI link Udyam data to the Statistical Business Register$$,
  $$The Ministry of MSME and MoSPI signed an MoU to establish a structured mechanism for sharing relevant information from the Udyam Registration ecosystem to develop and strengthen the Statistical Business Register (SBR).$$,
  $$This is a useful example of administrative data supporting official statistics. It connects MSME formalisation, data governance and the statistical frame used to identify and maintain business units.$$,
  $$A Statistical Business Register is a regularly maintained database of economic units. It is statistical infrastructure, not a list of every business or a substitute for a population census. Udyam Registration is the government registration system for MSMEs.$$,
  $$Ministry of MSME and Ministry of Statistics and Programme Implementation Sign Memorandum of Understanding (MoU) for development and strengthening of the Statistical Business Register$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316429&reg=3&lang=1$$,
  $$Ministry of Micro, Small and Medium Enterprises / Press Information Bureau$$, $$2026-09-29$$,
  $$["The MoU is between the Ministry of MSME and MoSPI.","It creates a framework to share relevant Udyam Registration information.","The intended statistical asset is the Statistical Business Register (SBR).","An SBR is a maintained frame of economic units used for statistics."]$$::jsonb,
  $$[{"question":"Which registration ecosystem is cited for SBR data sharing?","answer":"Udyam Registration."},{"question":"What is the basic purpose of a Statistical Business Register?","answer":"To maintain a reliable frame of economic units for official statistics."}]$$::jsonb,
  $${"title":"Administrative data to statistical infrastructure","steps":["Businesses enter relevant data through Udyam Registration.","The ministries create a controlled sharing mechanism.","MoSPI strengthens the Statistical Business Register.","A better frame supports surveys and economic statistics."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-july-trial-index-services-production$$, $$2026-09-30$$,
  $$MoSPI releases July trial Index of Services Production$$,
  $$MoSPI released its sub-sectoral trial Index of Services Production (ISP) for July 2026 with base year 2024-25. The experimental series provides monthly signals for 19 service sub-sectors rather than a single, comprehensive measure of all services output.$$,
  $$The ISP is a high-frequency official statistic for the services economy. For exam purposes, distinguish it from IIP, GDP/GVA and a business survey: it is a trial production index with stated scope and revision limits.$$,
  $$India's initial ISP trial covers formal-service activity in 19 sub-sectors. It uses administrative and GST-based information where available. MoSPI is releasing the series experimentally to test data quality and obtain feedback before treating it as a complete aggregate services indicator.$$,
  $$Release of Sub-Sectoral Trial Index of Services Production (ISP) for July 2026 (Base Year 2024-25)$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316489&reg=3&lang=1$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-09-29$$,
  $$["The cited ISP trial uses base year 2024-25.","The release covers 19 service sub-sectors.","ISP is a production indicator for services, not the IIP.","The series remains a trial release while methodology and coverage are tested."]$$::jsonb,
  $$[{"question":"What is the base year of the cited trial ISP?","answer":"2024-25."},{"question":"Why should the trial ISP not be read as a complete measure of all services?","answer":"It is experimental and presently reports a limited set of formal-service sub-sectors."}]$$::jsonb,
  $${"title":"What the trial ISP measures","steps":["Administrative and GST-linked information supply sector data.","MoSPI compiles sub-sectoral production indices.","The monthly release offers a timely service-sector signal.","Coverage and quality are tested before a fuller aggregate is relied upon."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-pragati-50-model-city-framework$$, $$2026-09-30$$,
  $$MoHUA launches PRAGATI-50 model-city framework for Swachhata$$,
  $$The Ministry of Housing and Urban Affairs launched PRAGATI-50 to develop a model-city framework for 50 cities across 24 States. The initiative focuses on visible cleanliness, solid-waste and used-water management, sanitation, citizen participation, performance monitoring and review.$$,
  $$This is an urban-governance implementation update under the wider sanitation agenda. Learn it as a framework for demonstrator cities, not as a separate constitutional urban tier or a replacement for urban local bodies.$$,
  $$The initiative sits in the Swachh Bharat Mission-Urban 2.0 context, which promotes garbage-free cities and scientific waste management. At the launch, MoHUA and CSIR-CMERI also inaugurated the Swachh Bharat Test Bed and Innovation Centre at Durgapur.$$,
  $$Union Minister Shri Manohar Lal Launches PRAGATI-50 initiative to Develop 50 Model Cities for Swachhata in New Delhi today$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316495&reg=3&lang=1$$,
  $$Ministry of Housing and Urban Affairs / Press Information Bureau$$, $$2026-09-29$$,
  $$["PRAGATI-50 is a MoHUA initiative for 50 model cities.","The selected cities are across 24 States.","The framework addresses cleanliness, waste, used water, sanitation and citizen participation.","It is linked to the Swachh Bharat Mission-Urban 2.0 context."]$$::jsonb,
  $$[{"question":"How many model cities are covered by PRAGATI-50?","answer":"Fifty."},{"question":"Name one urban-service focus of the framework.","answer":"Solid-waste management, used-water management, sanitation, cleanliness or citizen participation."}]$$::jsonb,
  $${"title":"From urban benchmark to model city","steps":["Cities are selected as demonstrators.","The framework defines measurable cleanliness and service outcomes.","Cities implement waste, water and sanitation improvements.","Monitoring and review create lessons for wider urban adoption."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-caqm-revised-grap-schedule$$, $$2026-09-30$$,
  $$CAQM revises GRAP schedule for the National Capital Region$$,
  $$The Commission for Air Quality Management approved a revised Graded Response Action Plan (GRAP) schedule for the NCR. It consolidates several Stage-I measures and specifies measures for vehicles, dust control, waste management and construction-and-demolition monitoring across the four response stages.$$,
  $$GRAP is a live policy instrument for episodic air pollution, not a year-round air-quality standard. This brief tests the role of CAQM, the NCR focus of the plan and the escalation logic of staged response measures.$$,
  $$CAQM is a statutory commission for air-quality management in the National Capital Region and adjoining areas. GRAP groups actions into stages that are activated or intensified as air-quality conditions worsen; it complements longer-term emission-control policy.$$,
  $$CAQM Approves Revised GRAP Schedule; Tightens Measures for Vehicles, Dust and Pollution Control$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316597&reg=3&lang=1$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-09-29$$,
  $$["CAQM approved the revised GRAP schedule for the NCR.","The revised plan has four stages of response measures.","Stage-I includes consolidated measures on dust, municipal waste and transport.","Web-portal monitoring of eligible construction-and-demolition sites is to extend beyond municipal limits."]$$::jsonb,
  $$[{"question":"Which body approved the revised GRAP schedule?","answer":"The Commission for Air Quality Management (CAQM)."},{"question":"What is GRAP designed to do?","answer":"Escalate pollution-control actions in stages as air-quality conditions worsen."}]$$::jsonb,
  $${"title":"Staged response to severe air pollution","steps":["Air quality is monitored in the NCR region.","CAQM applies measures grouped by response stage.","Authorities act on dust, waste, transport and construction sources.","Stricter measures are activated as pollution risk intensifies."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-pramaan-forest-wood-certification$$, $$2026-09-30$$,
  $$India issues first PRAMAAN certificates under forest and wood certification scheme$$,
  $$The Environment Ministry handed over the first PRAMAAN certificates under the Indian Forest and Wood Certification Scheme to Andhra Pradesh Forest Development Corporation and an Odisha bamboo farmer. The certification framework covers sustainable management practices for forest, wood and eligible non-timber resources.$$,
  $$This brings a domestic sustainability-certification framework into current affairs. Students should connect certification with traceability and sustainable management, while avoiding the mistake of treating a certificate as ownership of forest land.$$,
  $$PRAMAAN expands to Programme for Recognition and Accreditation of Sustainable Management Practices for Agroforestry and Natural Forestry Resources. The Indian Forest and Wood Certification Scheme is supported by an operating agency at the Indian Institute of Forest Management, Bhopal.$$,
  $$Union Environment Minister hands over India's first PRAMAAN certificates under the Indian Forest and Wood Certification Scheme to Andhra Pradesh Forest Development Corporation and a Bamboo Farmer from Odisha$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316355&reg=3&lang=1$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-09-29$$,
  $$["These were the first PRAMAAN certificates under the Indian Forest and Wood Certification Scheme.","Recipients named in the release include Andhra Pradesh Forest Development Corporation and an Odisha bamboo farmer.","PRAMAAN concerns sustainable management practices in agroforestry and natural forestry resources.","The framework can cover forest, wood and non-timber forest products."]$$::jsonb,
  $$[{"question":"What does PRAMAAN recognise in this context?","answer":"Sustainable management practices for agroforestry and natural forestry resources."},{"question":"Name one recipient of the first PRAMAAN certificates.","answer":"Andhra Pradesh Forest Development Corporation or an Odisha bamboo farmer."}]$$::jsonb,
  $${"title":"Sustainability certification pathway","steps":["A producer or manager follows eligible sustainable practices.","The certification framework assesses those practices.","A PRAMAAN certificate records recognition under the scheme.","Certification can support traceability and responsible forest-product value chains."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-pmgsy-iv-pm-janman-impact-study$$, $$2026-09-30$$,
  $$NRIDA and IIM Kolkata begin four-year rural-roads impact study$$,
  $$The National Rural Infrastructure Development Agency and IIM Kolkata signed an MoU for a four-year longitudinal impact assessment of roads constructed under PMGSY-IV and PM-JANMAN. The study is intended to measure long-term socio-economic effects of rural connectivity interventions.$$,
  $$This is a governance-and-evaluation update. It links public infrastructure to evidence-based policy, and is a useful reminder that a longitudinal study tracks change over time rather than merely reporting a single project-output count.$$,
  $$NRIDA works under the Ministry of Rural Development on rural-road programmes. Pradhan Mantri Gram Sadak Yojana focuses on rural connectivity, while PM-JANMAN is the Pradhan Mantri Janjati Adivasi Nyaya Maha Abhiyan for Particularly Vulnerable Tribal Groups.$$,
  $$NRIDA and IIM Kolkata Sign MoU for Four-Year Impact Assessment Study of PMGSY-IV and PM-JANMAN$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316732&reg=3&lang=1$$,
  $$Ministry of Rural Development / Press Information Bureau$$, $$2026-09-29$$,
  $$["The MoU is between NRIDA and IIM Kolkata.","The study will run for four years.","It assesses roads constructed under PMGSY-IV and PM-JANMAN.","The design is longitudinal, so it considers effects over time."]$$::jsonb,
  $$[{"question":"Which institution partnered with NRIDA for the impact study?","answer":"IIM Kolkata."},{"question":"What is a longitudinal impact study?","answer":"A study that follows outcomes over time to assess longer-term effects."}]$$::jsonb,
  $${"title":"Evaluating rural-road outcomes","steps":["Rural roads are built under the relevant programmes.","Researchers establish a structured assessment design.","Social and economic outcomes are observed over several years.","Evidence can inform future rural-connectivity policy."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-tdb-multi-gas-sensing-platform$$, $$2026-09-30$$,
  $$Technology Development Board supports indigenous multi-gas sensing platform$$,
  $$The Technology Development Board signed an agreement with Multi Nano Sense Technologies for ₹37.51 crore support from the Research Development and Innovation Fund to develop an indigenous multi-gas sensing platform. The project aims to advance a MEMS-based sensor and analogue front-end system-on-chip from technology readiness level 4 to level 9.$$,
  $$The update connects public technology finance with semiconductor-linked sensing, industrial safety and the Technology Readiness Level scale. It is not a claim that the product is already in full commercial deployment.$$,
  $$The Technology Development Board is a statutory body under the Department of Science and Technology that supports commercialisation of indigenous technology. MEMS means micro-electro-mechanical systems; a technology readiness level indicates maturity from early validation toward operational deployment.$$,
  $$TDB signs agreement with Multi Nano Sense Technologies for ₹37.51 crore RDI support to build indigenous multi-gas sensing platform$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316545&reg=3&lang=1$$,
  $$Technology Development Board, Department of Science and Technology / Press Information Bureau$$, $$2026-09-29$$,
  $$["TDB approved ₹37.51 crore RDI support for the project.","The project concerns an indigenous multi-gas sensing platform.","It uses a MEMS-based sensor and an analogue front-end system-on-chip.","The stated maturity path is from TRL-4 to TRL-9."]$$::jsonb,
  $$[{"question":"What does MEMS stand for?","answer":"Micro-electro-mechanical systems."},{"question":"What does a Technology Readiness Level indicate?","answer":"The maturity of a technology from development toward operational use."}]$$::jsonb,
  $${"title":"From sensing research to deployment readiness","steps":["A deep-tech platform is developed and validated.","TDB provides RDI support for integration and scale-up.","MEMS sensing and electronics are tested in relevant applications.","The project aims to progress from TRL-4 toward TRL-9."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-09-30-tribal-affairs-ignca-heritage-mou$$, $$2026-09-30$$,
  $$Tribal Affairs Ministry and IGNCA create framework for tribal cultural heritage$$,
  $$The Ministry of Tribal Affairs and the Indira Gandhi National Centre for the Arts signed an MoU to preserve, document, digitise, research and promote tribal cultural heritage. The partnership brings the Ministry's tribal-research ecosystem together with IGNCA's archival and curatorial expertise.$$,
  $$This combines culture, tribal affairs and digital preservation. The current-affairs hook is the institutional collaboration; the static link is the distinction between tangible heritage, intangible heritage and community-held traditional knowledge.$$,
  $$IGNCA is an autonomous trust under the Ministry of Culture. The collaboration covers cultural expressions such as art, music, languages, oral traditions, folklore, crafts and customary knowledge, and envisages digital archives and museum-oriented outreach.$$,
  $$Ministry of Tribal Affairs and IGNCA Sign MoU for Preservation, Documentation and Promotion of Tribal Cultural Heritage$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316411&reg=3&lang=1$$,
  $$Ministry of Tribal Affairs / Press Information Bureau$$, $$2026-09-29$$,
  $$["The MoU is between the Ministry of Tribal Affairs and IGNCA.","It covers preservation, documentation, digitisation, research and promotion.","IGNCA is an autonomous trust under the Ministry of Culture.","The framework includes tribal tangible and intangible cultural heritage."]$$::jsonb,
  $$[{"question":"Which ministry is IGNCA associated with?","answer":"The Ministry of Culture."},{"question":"Give one example of intangible tribal cultural heritage in the MoU's scope.","answer":"A language, oral tradition, folklore, music or customary knowledge."}]$$::jsonb,
  $${"title":"Preserving living tribal heritage","steps":["Communities and institutions identify cultural material.","Documentation and digitisation build durable records.","Research and curation support protection and interpretation.","Archives, galleries and outreach promote informed public access."]}$$::jsonb,
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
  $$2026-09-30-msme-mospi-statistical-business-register$$,
  $$2026-09-30-july-trial-index-services-production$$,
  $$2026-09-30-pragati-50-model-city-framework$$,
  $$2026-09-30-caqm-revised-grap-schedule$$,
  $$2026-09-30-pramaan-forest-wood-certification$$,
  $$2026-09-30-pmgsy-iv-pm-janman-impact-study$$,
  $$2026-09-30-tdb-multi-gas-sensing-platform$$,
  $$2026-09-30-tribal-affairs-ignca-heritage-mou$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
