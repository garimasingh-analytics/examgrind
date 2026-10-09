-- 9 October 2026 current-affairs desk.
-- Fresh 8 October releases plus the recoverable 7 October ICAR-Ghana MoU,
-- each checked against the linked primary official release.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-09-gst-council-57-process-reforms$$, $$2026-10-09$$,
  $$GST Council recommends registration, refund and dispute-resolution reforms$$,
  $$The 57th GST Council recommended process reforms across registration, returns, refunds and adjudication, including a proposal to remove GST arrest provisions and to raise the prosecution threshold from ₹1 crore to ₹5 crore.$$,
  $$This is a tax-governance item. It tests the constitutional GST Council's role and the distinction between a Council recommendation and a change that becomes operative only through the relevant law, rules, notifications or circulars.$$,
  $$The Council recommended a simplified registration route for eligible small e-commerce suppliers, system-based processing of specified refund claims, and a proposed Annual Return Quarterly Payment option for certain B2C businesses with turnover up to ₹5 crore. Its release explicitly says that the later legal instruments, not the recommendations alone, carry force of law.$$,
  $$Recommendations of the 57th Meeting of the GST Council$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2320934&lang=1&reg=3$$,
  $$GST Council Secretariat / Press Information Bureau$$, $$2026-10-08$$,
  $$["The 57th GST Council meeting was chaired by the Union Finance Minister.","The Council recommended raising the GST prosecution threshold from ₹1 crore to ₹5 crore.","It recommended a simplified registration mechanism for eligible small suppliers using e-commerce operators.","GST Council recommendations require the relevant legal instruments before they take effect."]$$::jsonb,
  $$[{"question":"Do all GST Council recommendations apply immediately on publication?","answer":"No. The release says that relevant notifications, circulars, rules or law amendments are what give effect and legal force."},{"question":"Which constitutional body makes these GST recommendations?","answer":"The GST Council, constituted under Article 279A."}]$$::jsonb,
  $${"title":"From recommendation to enforceable GST change","steps":["The GST Council considers a tax-administration issue.","It recommends a process or statutory change.","The Government issues the required notification, circular, rule or amendment.","Taxpayers and officers follow the enacted or notified rule."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-cancer-medicine-trade-margin-cap$$, $$2026-10-09$$,
  $$Government approves 30% trade-margin cap for non-scheduled cancer medicines$$,
  $$The Government approved a cap of 30% of maximum retail price on margins in the supply and sale of non-scheduled anti-cancer medicines, with an expert committee to finalise the covered list.$$,
  $$This is a public-health pricing intervention. It distinguishes ceiling prices for scheduled formulations from a trade-margin cap for medicines outside that list, and links drug-price regulation to affordability and access.$$,
  $$The release says the cap covers branded and generic, domestic and imported, patented and non-patented non-scheduled anti-cancer medicines. It projects patient savings of ₹2,500 crore annually and requires manufacturers to maintain current production levels; it builds on the 2019 National Pharmaceutical Pricing Authority action on 42 selected non-scheduled anti-cancer drugs under the Drugs (Prices Control) Order, 2013.$$,
  $$Government Expands Cancer Medicine Price Controls; Cancer Patients Expected to Save ₹2,500 Crore Annually$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2321092&lang=1&reg=3$$,
  $$Department of Pharmaceuticals, Ministry of Chemicals and Fertilizers / Press Information Bureau$$, $$2026-10-08$$,
  $$["The approved cap limits trade margins on covered non-scheduled anti-cancer medicines to 30% of MRP.","An expert committee under DGHS will finalise the medicine list.","Scheduled essential cancer medicines already have government-set ceiling prices.","The release cites the Drugs (Prices Control) Order, 2013 in relation to the earlier 2019 action."]$$::jsonb,
  $$[{"question":"Is the new measure a ceiling-price order for every cancer medicine?","answer":"No. It caps supply-and-sale margins for covered non-scheduled anti-cancer medicines; scheduled medicines already use ceiling prices."},{"question":"Which body acted on selected anti-cancer drug margins in 2019?","answer":"The National Pharmaceutical Pricing Authority (NPPA)."}]$$::jsonb,
  $${"title":"How a trade-margin cap aims to lower a medicine price","steps":["An expert list identifies eligible non-scheduled anti-cancer medicines.","The cap limits margins added through supply and sale.","Lower permitted margins can reduce the patient-facing price.","Production safeguards aim to preserve medicine availability."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-josh-teams-tb-elimination$$, $$2026-10-09$$,
  $$JOSH Teams begin youth-led community outreach under TB Mukt Bharat$$,
  $$The Health Ministry launched JOSH (Joint Squad for Health) Teams under the TB Mukt Bharat Abhiyaan to support awareness, early testing, treatment adherence and stigma reduction through structured youth participation.$$,
  $$The initiative connects tuberculosis control with community health, the National TB Elimination Programme and convergence among health, youth and defence institutions. It is an outreach mechanism, not a substitute for diagnosis or clinical treatment.$$,
  $$Each JOSH Team has five MY Bharat volunteers and five NCC cadets and is led by a designated Class-I officer at block or ward level. The first phase covers 55 districts in 11 States and Union Territories; the launch also introduced a JOSH feature in the TB Mukt Bharat App and digital information materials.$$,
  $$Union Health Minister Shri J.P. Nadda Launches JOSH Teams to Accelerate Youth-Led TB Elimination Efforts$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320653&lang=1&reg=3$$,
  $$Ministry of Health and Family Welfare / Press Information Bureau$$, $$2026-10-08$$,
  $$["JOSH stands for Joint Squad for Health.","A team combines five MY Bharat volunteers with five NCC cadets.","The first phase is in 55 districts across 11 States and Union Territories.","The initiative supports TB prevention awareness, early diagnosis, treatment adherence and stigma reduction."]$$::jsonb,
  $$[{"question":"Which youth organisation is paired with NCC cadets in a JOSH Team?","answer":"MY Bharat volunteers."},{"question":"Does a JOSH Team replace TB diagnosis or treatment services?","answer":"No. It supports community outreach and connection to timely testing and treatment."}]$$::jsonb,
  $${"title":"Community pathway for TB outreach","steps":["A JOSH Team engages households and community groups.","It explains symptoms, prevention and the importance of early testing.","People with concerns are encouraged to access formal testing and treatment.","Follow-up messaging supports adherence and reduces stigma."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-sarex-national-maritime-search-rescue$$, $$2026-10-09$$,
  $$Coast Guard conducts SAREX-2026 maritime search-and-rescue exercise$$,
  $$The Indian Coast Guard conducted the 12th National Maritime Search and Rescue Exercise, SAREX-2026, off Paradip under the National Maritime Search and Rescue Board, with a simulated mass-rescue operation involving maritime and aeronautical distress.$$,
  $$This is a maritime-safety and disaster-response item. It links the Coast Guard, Navy, Air Force, civil authorities and international observers to the institutional need for interoperable search and rescue at sea.$$,
  $$The exercise involved Coast Guard ships and aircraft, Navy assets, Shipping Corporation of India, Directorate General of Shipping, Fisheries, Customs, Marine Police, Paradip Port Authority and Odisha authorities. It included an Incident Command Post, helicopter evacuation, life rafts, firefighting, recovery techniques and a remotely operated vehicle demonstration.$$,
  $$Indian Coast Guard conducts 12th National Maritime Search & Rescue Exercise (SAREX-2026) off Paradip coast in Odisha$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320759&lang=1&reg=3$$,
  $$Indian Coast Guard, Ministry of Defence / Press Information Bureau$$, $$2026-10-08$$,
  $$["SAREX-2026 was the 12th National Maritime Search and Rescue Exercise.","It was held off Paradip in Odisha under the National Maritime Search and Rescue Board.","The scenario simulated a mass rescue following linked aeronautical and maritime distress.","Observers from 30 countries participated, according to the release."]$$::jsonb,
  $$[{"question":"Which organisation conducted SAREX-2026?","answer":"The Indian Coast Guard."},{"question":"What does SAR mean in this exercise context?","answer":"Search and Rescue."}]$$::jsonb,
  $${"title":"A coordinated maritime mass-rescue response","steps":["A distress event triggers search-and-rescue coordination.","The Incident Command Post aligns maritime, air, civil and port resources.","Ships, aircraft and recovery equipment conduct rescue operations.","Agencies review interoperability for future real emergencies."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-nhai-wildlife-mitigation-framework$$, $$2026-10-09$$,
  $$NHAI releases wildlife-mitigation framework for national highways$$,
  $$The National Highways Authority of India released a reference document on wildlife-mitigation measures and structures, describing how highway planning can address habitat fragmentation, barrier effects and wildlife-vehicle collisions.$$,
  $$The document is useful for connecting transport infrastructure with biodiversity conservation. It distinguishes structural crossings from non-structural management measures and shows how ecological connectivity can be built into project design.$$,
  $$NHAI reports that more than 2,150 mitigation structures have been constructed or proposed along national highways. The document covers animal underpasses, overpasses, culverts adapted for fauna, canopy crossings, fencing, signage and speed regulation, supported by monitoring such as camera trapping.$$,
  $$NHAI Releases Document on ‘Wildlife Mitigation Measures & Structures’ Highlighting Strengthened Wildlife Conservation Measures Along National Highways$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320896&lang=1&reg=3$$,
  $$National Highways Authority of India, Ministry of Road Transport and Highways / Press Information Bureau$$, $$2026-10-08$$,
  $$["The NHAI document addresses habitat fragmentation, barrier effects and wildlife-vehicle collisions.","It reports more than 2,150 wildlife-mitigation structures constructed or proposed along national highways.","Structural measures include underpasses, overpasses, culverts and canopy crossings.","Non-structural measures include fencing, signage and speed regulation."]$$::jsonb,
  $$[{"question":"Name one structural wildlife-mitigation measure used on highways.","answer":"An animal underpass, overpass, adapted culvert or canopy crossing."},{"question":"Why is guide fencing used near a wildlife crossing?","answer":"It channels animal movement toward designated crossing structures and helps reduce collision risk."}]$$::jsonb,
  $${"title":"Integrating wildlife movement into road design","steps":["A project identifies ecological sensitivity and animal movement routes.","Designers select crossings and supporting safety measures.","Fencing and signs guide movement and alert road users.","Monitoring informs review and improvement of mitigation measures."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-india-ghana-agricultural-research-mou$$, $$2026-10-09$$,
  $$ICAR and Ghana’s CSIR-CRI sign five-year agricultural research MoU$$,
  $$The Indian Council of Agricultural Research and Ghana’s Crops Research Institute signed a five-year framework for joint agricultural research, technology transfer, capacity building and commercialisation support.$$,
  $$This is a South-South cooperation item with agriculture and international-relations relevance. It links agricultural research institutions to germplasm exchange, post-harvest systems and value-chain development rather than creating an Indian domestic farm scheme.$$,
  $$The first phase focuses on vegetable research, especially tomato lines suited to Ghana. The framework also covers processing and value addition for cassava, yam and other tubers, cold-chain and post-harvest support, and a Joint Working Group that will review implementation in New Delhi and Accra.$$,
  $$India and Ghana Sign Historic MoU to Advance Agricultural Research, Education, and Technology Transfer$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2320285&lang=1&reg=3$$,
  $$Indian Council of Agricultural Research, Ministry of Agriculture and Farmers Welfare / Press Information Bureau$$, $$2026-10-07$$,
  $$["The five-year MoU is between ICAR and Ghana's CSIR-Crops Research Institute.","The first phase gives particular attention to tomato research and suitable high-yielding lines.","The cooperation includes cassava and yam value addition and post-harvest management.","A Joint Working Group will oversee progress in New Delhi and Accra."]$$::jsonb,
  $$[{"question":"Which Indian institution signed the agricultural-research MoU with Ghana's CSIR-CRI?","answer":"The Indian Council of Agricultural Research (ICAR)."},{"question":"Which crop receives particular attention in the first phase?","answer":"Tomato."}]$$::jsonb,
  $${"title":"Research partnership to farm-level adoption","steps":["Research institutions set common priorities and exchange knowledge.","Scientists and breeding materials support crop research.","Post-harvest and value-addition work addresses losses and market linkage.","A joint group reviews collaboration and guides the next phase."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-jorhat-silkworm-seed-infrastructure$$, $$2026-10-09$$,
  $$Jorhat gains upgraded silkworm-seed production and cold-storage facility$$,
  $$A new grainage building and cold-storage facility at the Central Silk Board's Silkworm Seed Production Centre in Rowriah, Jorhat, was inaugurated to strengthen silkworm-seed availability and the sericulture value chain in the North East.$$,
  $$Sericulture is both an agriculture and textile-sector topic. The facility illustrates how disease-free silkworm layings, storage and extension infrastructure underpin raw-silk production and rural livelihoods.$$,
  $$The facility was established under the North East Region Textile Promotion Scheme. It has stated annual capacity for 30 lakh disease-free layings of mulberry hybrid seed and preservation capacity for up to one crore disease-free layings.$$,
  $$Union Minister of State Pabitra Margherita Inaugurates State-of-the-Art Silkworm Seed Infrastructure at Jorhat, Assam$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2320835&lang=1&reg=3$$,
  $$Central Silk Board, Ministry of Textiles / Press Information Bureau$$, $$2026-10-08$$,
  $$["The facility is at the CSB-Silkworm Seed Production Centre in Rowriah, Jorhat.","It was established under the North East Region Textile Promotion Scheme.","Its stated annual production capacity is 30 lakh disease-free layings of mulberry hybrid seed.","It can preserve up to one crore disease-free layings."]$$::jsonb,
  $$[{"question":"What does DFL mean in sericulture?","answer":"Disease-Free Laying, referring to silkworm eggs certified as disease-free."},{"question":"Which statutory textile-sector body operates the Jorhat seed-production centre?","answer":"The Central Silk Board."}]$$::jsonb,
  $${"title":"Why seed infrastructure matters in sericulture","steps":["A seed-production centre supplies disease-free silkworm layings.","Cold storage helps preserve viable seed stock.","Farmers receive more timely and reliable seed availability.","Better seed supply supports cocoon production and the wider silk value chain."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-09-satellite-communications-licensing-security$$, $$2026-10-09$$,
  $$Government clarifies common security stage for satellite-communications licensees$$,
  $$The Communications Ministry said that three licensed non-geostationary-orbit Global Mobile Personal Communication by Satellite providers are at the same regulatory stage: security compliance assessment before they can seek spectrum assignment.$$,
  $$This is a satellite-communications regulation item. It helps distinguish a telecom licence, compliance with licence security conditions and later spectrum assignment; a licensed entity is not automatically authorised to begin every operational step.$$,
  $$The Ministry described the telecom authorisation framework as technology-neutral and non-discriminatory. It said each licensee must demonstrate compliance with security conditions intended to protect users and data, after which the entity can proceed to seek assignment of spectrum.$$,
  $$India’s regulatory framework for satellite communication services is fair and non-discriminatory$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2320510&lang=1&reg=3$$,
  $$Department of Telecommunications, Ministry of Communications / Press Information Bureau$$, $$2026-10-08$$,
  $$["The clarification concerns Global Mobile Personal Communication by Satellite (GMPCS) services using non-geostationary orbit systems.","The release identifies three licensed providers at the same regulatory stage.","Licensees must demonstrate compliance with security conditions.","Spectrum assignment is a subsequent step after the security-assessment process is completed."]$$::jsonb,
  $$[{"question":"Does a satellite-communications licence by itself complete the spectrum-assignment process?","answer":"No. The release says security compliance is assessed before an entity proceeds to seek spectrum assignment."},{"question":"What does GMPCS expand to?","answer":"Global Mobile Personal Communication by Satellite."}]$$::jsonb,
  $${"title":"From satellite-service licence to spectrum request","steps":["An entity receives the relevant telecom licence.","It demonstrates compliance with licence security conditions.","The security assessment is completed by the competent process.","The entity can then proceed to seek spectrum assignment."]}$$::jsonb,
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
  $$2026-10-09-gst-council-57-process-reforms$$,
  $$2026-10-09-cancer-medicine-trade-margin-cap$$,
  $$2026-10-09-josh-teams-tb-elimination$$,
  $$2026-10-09-sarex-national-maritime-search-rescue$$,
  $$2026-10-09-nhai-wildlife-mitigation-framework$$,
  $$2026-10-09-india-ghana-agricultural-research-mou$$,
  $$2026-10-09-jorhat-silkworm-seed-infrastructure$$,
  $$2026-10-09-satellite-communications-licensing-security$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
