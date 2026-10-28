-- 18 October 2026 current-affairs desk.
-- Every item below was checked against the linked primary official publication.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-18-plfs-september-monthly-bulletin$$, $$2026-10-18$$,
  $$PLFS September bulletin reports labour-market indicators on a monthly basis$$,
  $$MoSPI's September 2026 PLFS bulletin placed the all-India labour-force participation rate for people aged 15 and above at 55.5%, the worker-population ratio at 52.7%, and the unemployment rate at 5.0%, using Current Weekly Status estimates.$$,
  $$This is a high-value economy and statistics update. It tests the National Statistical Office, PLFS terminology, labour-force participation, employment and unemployment rather than treating those measures as interchangeable.$$,
  $$PLFS is conducted by the National Statistical Office under MoSPI. LFPR is the share of the relevant population that is working or seeking/available for work; WPR is the share that is working; unemployment rate is the share of the labour force that is unemployed. The bulletin says that PLFS methodology has provided monthly and quarterly estimates since January 2025 and reports the figures using the Current Weekly Status approach.$$,
  $$Press Note on Periodic Labour Force Survey (PLFS) Monthly Bulletin September 2026$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323828&lang=1&reg=3$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-15$$,
  $$["PLFS is conducted by the National Statistical Office under MoSPI.","For September 2026, the overall LFPR for persons aged 15+ was 55.5% on a Current Weekly Status basis.","The overall WPR was 52.7% and the overall unemployment rate was 5.0%.","LFPR, WPR and unemployment rate use different denominators and should not be used as synonyms."]$$::jsonb,
  $$[{"question":"Which indicator uses the labour force, rather than the whole relevant population, as its denominator?","answer":"The unemployment rate: it measures unemployed persons as a share of the labour force."}]$$::jsonb,
  $${"title":"Reading the PLFS trio","steps":["Start with the relevant population aged 15+.","LFPR identifies people working or seeking/available for work.","WPR identifies people who are working.","Unemployment rate identifies the unemployed share within the labour force."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-paimana-q2-infrastructure-dashboard$$, $$2026-10-18$$,
  $$MoSPI updates the PAIMANA infrastructure-monitoring dashboard$$,
  $$MoSPI's quarterly PAIMANA update expanded the dashboard to 184 indicators across six infrastructure sub-sectors and refreshed data for 41 indicators, bringing selected roads, telecom, power, ports, aviation and rail measures together in one official interface.$$,
  $$This is useful for infrastructure, governance and official-statistics questions. It connects dashboard-based monitoring with the five lenses of access, quality, fiscal cost and revenue, utilisation and affordability.$$,
  $$PAIMANA stands for Project Assessment, Infrastructure Monitoring and Analytics for Nation-building. It is a MoSPI performance dashboard, not a construction scheme or a regulator. In this update, the six sub-sectors are civil aviation, road transport and highways, power, ports/shipping/waterways, telecommunications and railways. An infrastructure indicator measures a specified outcome or activity; it should not be mistaken for a budget allocation or a project approval.$$,
  $$Quarterly release of Performance Monitoring Dashboard of Infrastructure Sector in India$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2324355&lang=2&reg=48$$,
  $$Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-16$$,
  $$["PAIMANA expands to Project Assessment, Infrastructure Monitoring and Analytics for Nation-building.","The October 2026 quarterly update reports 184 dashboard indicators.","It covers six sub-sectors, including roads, power, telecom, railways, aviation and ports/shipping/waterways.","The framework uses access, quality, fiscal cost and revenue, utilisation and affordability as monitoring dimensions."]$$::jsonb,
  $$[{"question":"Is PAIMANA itself a project-financing scheme?","answer":"No. It is MoSPI's digital performance-monitoring dashboard for infrastructure indicators."}]$$::jsonb,
  $${"title":"From sector data to monitoring","steps":["Ministries and official reports supply sector data.","MoSPI standardises selected indicators.","PAIMANA presents trends through a public dashboard.","Users assess access, quality, cost, use and affordability."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-fssai-infant-nutrition-draft$$, $$2026-10-18$$,
  $$FSSAI proposes tighter added-sugar rules for infant-nutrition products$$,
  $$FSSAI published a draft amendment to the Foods for Infant Nutrition Regulations, 2020 that would prohibit adding sucrose and fructose to products intended for infants up to six months of age. The draft was placed in the Gazette for public consultation.$$,
  $$This is a health, nutrition and regulatory-governance item. It tests the statutory role of FSSAI and the important distinction between a draft notification under consultation and a final enforceable rule.$$,
  $$FSSAI sets food-safety and standards requirements under the Food Safety and Standards Act. The underlying 2020 regulations cover infant-nutrition products from birth to 24 months. The official release says that the proposed amendment targets products for infants up to six months and invites objections and suggestions for 60 days before finalisation. A consultation-stage draft signals a proposed norm, not a completed regulatory change.$$,
  $$FSSAI Moves to Strengthen Infant Nutrition Standards by Restricting Addition of Sucrose and Fructose in Products for Infants Up to Six Months$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2324637&lang=2&reg=48$$,
  $$Food Safety and Standards Authority of India / Press Information Bureau$$, $$2026-10-17$$,
  $$["FSSAI proposed the change through a draft amendment to the Foods for Infant Nutrition Regulations, 2020.","The proposal covers products intended for infants up to six months of age.","It would prohibit added sucrose and fructose in those products.","The Gazette draft provides a 60-day consultation period before finalisation."]$$::jsonb,
  $$[{"question":"Does the draft notification mean the amendment is already final law?","answer":"No. It is a proposal open to objections and suggestions before FSSAI finalises it."}]$$::jsonb,
  $${"title":"How a draft food-standard change proceeds","steps":["FSSAI identifies a standards issue.","A draft amendment is published in the Gazette.","Stakeholders submit objections or suggestions.","FSSAI considers them before issuing a final amendment."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-gsat7c-varunastra-contracts$$, $$2026-10-18$$,
  $$MoD contracts for GSAT-7C and Varunastra strengthen indigenous defence capability$$,
  $$The Ministry of Defence signed contracts worth about Rs 4,106 crore for GSAT-7C satellite capability for the Indian Air Force and Varunastra heavy-weight torpedoes for the Indian Navy. The GSAT-7C contract is with NewSpace India Limited and the Varunastra contract with Bharat Dynamics Limited.$$,
  $$This is a defence-technology and public-sector-enterprise item. It brings together military communications, anti-submarine warfare, indigenous production and the distinct roles of NSIL, BDL and the Naval Science and Technological Laboratory.$$,
  $$GSAT-7C is described in the official release as an indigenous secure communication-satellite capability for the Indian Air Force. Varunastra is an indigenous ship-launched heavy-weight anti-submarine torpedo developed by the Naval Science and Technological Laboratory. NewSpace India Limited is the commercial arm of the Department of Space, whereas Bharat Dynamics Limited is a defence public-sector undertaking; neither should be confused with the armed service that will use the capability.$$,
  $$MoD inks Rs 4,106 crore contracts for GSAT-7C communication satellite and Varunastra Heavy Weight Torpedoes$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323814&lang=2&reg=48$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-15$$,
  $$["The two contracts together are worth about Rs 4,106 crore.","GSAT-7C is intended to provide secure and resilient communications for Indian Air Force assets.","Varunastra is a ship-launched heavy-weight torpedo for anti-submarine warfare.","NSIL and BDL are the respective contract partners named in the release."]$$::jsonb,
  $$[{"question":"Which capability is primarily associated with Varunastra?","answer":"Anti-submarine warfare; it is an indigenous ship-launched heavy-weight torpedo."}]$$::jsonb,
  $${"title":"Two contracts, two defence roles","steps":["GSAT-7C supports secure communications for air-force assets.","Varunastra targets the anti-submarine warfare role at sea.","NSIL and BDL supply the respective indigenous capabilities.","The armed services deploy them for operational requirements."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-ins-samarthak-commissioning$$, $$2026-10-18$$,
  $$Indian Navy commissions INS Samarthak, an indigenous multi-purpose vessel$$,
  $$INS Samarthak, the first-of-class multi-purpose vessel, was commissioned into the Indian Navy at Karwar. The official release says it was designed and constructed by L&T Shipyard, has more than 75% indigenous content and will support trials, surveillance, patrol and humanitarian-assistance roles.$$,
  $$This is relevant to defence indigenisation, maritime security and naval-platform questions. It also distinguishes commissioning into naval service from a ship's launch, delivery or sea trial.$$,
  $$A multi-purpose vessel can perform more than one support and operational function rather than being tailored to a single combat role. The release describes INS Samarthak as a platform for trials and evaluation of indigenous sensors and weapons, as well as maritime surveillance, reconnaissance, offshore patrolling and humanitarian assistance and disaster relief. Commissioning is the formal induction of a vessel into naval service.$$,
  $$Indian Navy commissions INS Samarthak, the first indigenous multi-purpose vessel$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2324581&lang=2&reg=48$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-16$$,
  $$["INS Samarthak was commissioned on 16 October 2026 at Karwar.","It is the first-of-class multi-purpose vessel and is designed and built by L&T Shipyard.","The official release reports more than 75% indigenous content.","Its roles include trials, surveillance, offshore patrol and humanitarian assistance and disaster relief."]$$::jsonb,
  $$[{"question":"What does commissioning signify for a naval vessel?","answer":"Its formal induction into naval service; it is different from construction, launching or trial stages."}]$$::jsonb,
  $${"title":"Why a multi-purpose vessel matters","steps":["A domestic shipyard builds an indigenous platform.","The Navy commissions it into service.","The vessel tests and supports new sensors and weapons.","It can also undertake surveillance, patrol and HADR tasks."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-exercise-konkan-26$$, $$2026-10-18$$,
  $$India-UK maritime Exercise KONKAN-26 concludes off Plymouth$$,
  $$KONKAN-26, the annual India-United Kingdom bilateral maritime exercise, concluded off Plymouth after running from 8 to 15 October. The Indian Navy fielded INS Trishul and the Royal Navy deployed HMS Sutherland for drills including anti-submarine warfare and complex sea manoeuvres.$$,
  $$This is a defence and international-relations brief. It tests the India-UK maritime partnership, the participating ships and why bilateral exercises build interoperability without creating a military alliance.$$,
  $$KONKAN is a bilateral Indian Navy-Royal Navy exercise. The official release identifies INS Trishul as a stealth frigate and HMS Sutherland as a Duke-class anti-submarine-warfare frigate. Its sea phase covered communication procedures, anti-surface asymmetric warfare, anti-submarine warfare and firing serials. An exercise helps forces practise together and exchange procedures; it is not a treaty or a declaration of war.$$,
  $$Exercise KONKAN-26 concludes off Plymouth, UK$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2324800&lang=2&reg=48$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-17$$,
  $$["KONKAN-26 is an India-UK bilateral maritime exercise.","It was conducted from 8 to 15 October 2026 off Plymouth, United Kingdom.","INS Trishul represented the Indian Navy and HMS Sutherland the Royal Navy.","The sea phase included anti-surface and anti-submarine warfare drills."]$$::jsonb,
  $$[{"question":"Does participation in KONKAN-26 create a permanent military alliance?","answer":"No. It is a bilateral exercise for professional interaction and interoperability, not an alliance treaty."}]$$::jsonb,
  $${"title":"What a bilateral naval exercise achieves","steps":["Partner navies deploy designated ships.","They align communication and operating procedures.","They practise shared maritime scenarios.","Lessons improve interoperability for future operations."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-mscaro-multistate-cooperative-audits$$, $$2026-10-18$$,
  $$MSCARO 2026 creates a risk-based audit-reporting framework for multi-state cooperatives$$,
  $$The Ministry of Cooperation mandated the Multi-State Co-operative Societies (Auditor's Report) Order, 2026, known as MSCARO. The framework standardises statutory audit reporting and introduces phased, risk-based regulatory supervision through the Central Registrar of Cooperative Societies portal.$$,
  $$This is a governance, cooperative-sector and financial-regulation item. It links the Multi-State Co-operative Societies (Amendment) Act, 2023 with audit standards, the Central Registrar and early identification of financial stress.$$,
  $$The Ministry says Section 73(6) of the 2023 amendment empowers the Central Government to prescribe audit and accounting standards for multi-state cooperative societies. MSCARO is modelled on CARO, the Companies (Auditor's Report) Order, but applies to a different institutional category. The initial phase covers larger societies crossing the stated Rs 1,000 crore threshold, with a longer-term extension to societies crossing Rs 50 crore in relevant financial parameters.$$,
  $$Ministry of Cooperation mandates new Audit Reporting Framework for Multi-State Cooperative Societies$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2323313&lang=1&reg=3$$,
  $$Ministry of Cooperation / Press Information Bureau$$, $$2026-10-14$$,
  $$["MSCARO means Multi-State Co-operative Societies (Auditor's Report) Order, 2026.","It provides a standardised and risk-based statutory audit-reporting framework for MSCS.","The 2023 amendment's Section 73(6) is cited as the enabling provision for prescribed audit and accounting standards.","The framework uses phased implementation and integrates standardised data with the CRCS portal."]$$::jsonb,
  $$[{"question":"Is MSCARO the same instrument as CARO?","answer":"No. It is modelled on CARO but is a separate 2026 order for multi-state cooperative societies."}]$$::jsonb,
  $${"title":"Audit report to regulatory action","steps":["Auditors report specified financial and governance observations.","Standard formats make reports comparable.","CRCS portal data supports risk scoring and scrutiny.","Higher-risk societies can receive focused regulatory attention."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-sugarcane-sugar-sector-committee$$, $$2026-10-18$$,
  $$Government forms a committee on sugarcane-farmer and sugar-sector issues$$,
  $$The Union government constituted a committee chaired by former NITI Aayog member Ramesh Chand to examine concerns raised by sugarcane farmers, including remunerative returns, the ex-mill minimum selling price of sugar and the financial impact of existing practices.$$,
  $$This is relevant to agriculture, food policy and price-policy questions. It helps distinguish the price paid for sugarcane from the ex-mill minimum selling price of sugar and demonstrates the role of an expert committee in policy examination.$$,
  $$The committee includes the Agriculture Commissioner, the Joint Secretary (Sugar) in the Department of Food and Public Distribution, and the Joint Secretary (Legal Metrology) in the Department of Consumer Affairs. Its remit is to examine and recommend; the announcement itself does not alter cane prices or the sugar MSP. Sugarcane price policy and sugar-market policy concern connected but distinct points in the value chain.$$,
  $$Government Constitutes Committee to Examine Issues Relating to Sugarcane Farmers and the Sugar Sector$$,
  $$https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2323450&lang=2&reg=48$$,
  $$Ministry of Consumer Affairs, Food and Public Distribution / Press Information Bureau$$, $$2026-10-14$$,
  $$["The committee is chaired by former NITI Aayog member Ramesh Chand.","It will examine returns to sugarcane farmers and the ex-mill minimum selling price of sugar.","It also considers production costs, market realisations and sugar-mill viability.","Constitution of the committee is an examination-and-recommendation step, not a notified price change."]$$::jsonb,
  $$[{"question":"What is the difference between a cane price and sugar's ex-mill minimum selling price?","answer":"The first concerns the price/remuneration for the farm input; the second concerns the minimum selling price for processed sugar at the mill stage."}]$$::jsonb,
  $${"title":"From farmer concern to policy recommendation","steps":["Stakeholder issues are placed before the government.","An expert committee examines costs, prices and viability.","It prepares recommendations.","The competent government then decides any policy response."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-rdi-advanced-chemicals-materials$$, $$2026-10-18$$,
  $$Advanced chemicals and materials become eligible technology areas under the RDI Scheme$$,
  $$The government included Advanced Chemicals, Petrochemicals and Material Technologies as an additional technology area eligible for Research, Development and Innovation Scheme funding, effective 8 October 2026. The scheme has a Rs 1 lakh crore corpus to catalyse private-sector R&D investment.$$,
  $$This is a science-and-technology, industrial-policy and innovation-finance item. It tests the difference between an eligible technology area, a funding scheme and a product-specific subsidy.$$,
  $$The RDI Scheme was launched in November 2025 and seeks to provide long-term financing and refinancing on favourable terms for transformative projects. The Department of Chemicals and Petrochemicals proposed the sector's inclusion, while the decision is attributed to the Department of Science and Technology. Inclusion makes the area eligible within the scheme; it does not automatically award money to every firm in that sector.$$,
  $$Advanced Chemicals, Petrochemicals and Material Technologies Included under Research, Development and Innovation (RDI) Scheme$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2323590&lang=1&reg=1$$,
  $$Department of Chemicals and Petrochemicals / Press Information Bureau$$, $$2026-10-14$$,
  $$["Advanced Chemicals, Petrochemicals and Material Technologies were added as an RDI Scheme-eligible technology area from 8 October 2026.","The RDI Scheme has a Rs 1 lakh crore corpus, according to the official release.","The scheme aims to catalyse private-sector investment in research, development and innovation.","Eligibility of an area does not equal automatic financial sanction to individual projects."]$$::jsonb,
  $$[{"question":"Which department's proposal led to this inclusion, according to the release?","answer":"The Department of Chemicals and Petrochemicals proposed inclusion; DST made the decision."}]$$::jsonb,
  $${"title":"How a technology area enters RDI support","steps":["A sector is identified as a priority technology area.","The government makes it eligible within the scheme.","Projects seek financing or refinancing under scheme rules.","Support is intended to translate R&D into competitive industrial capability."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-18-tdb-qnu-quantum-secure-networks$$, $$2026-10-18$$,
  $$TDB backs indigenous quantum-secure and sensing-network development$$,
  $$The Technology Development Board signed an agreement with QNu Labs for Rs 150 crore of RDI Fund support toward an indigenous Quantum Secure and Sensing Networks technology stack. The project aims to advance technologies from Technology Readiness Levels 4-5 towards TRL-9.$$,
  $$This is a science-and-technology and cyber-security item. It tests TDB's role, technology-readiness levels, quantum security and the difference between an R&D-support agreement and an already deployed national network.$$,
  $$TDB is a statutory body under the Department of Science and Technology that supports commercial application of indigenous technology. The official release says the Rs 300 crore project will receive Rs 150 crore through Optionally Convertible Debt and focuses on device identity, location integrity, network security and time integrity. TRL expresses technology maturity: early laboratory concepts sit at lower levels while TRL-9 indicates an actual system proven in an operational environment.$$,
  $$TDB-DST signs agreement with QNu Labs for Rs 150 crore RDI support to strengthen India's indigenous quantum-secure technology ecosystem$$,
  $$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2324307&lang=1&reg=3$$,
  $$Technology Development Board, Department of Science and Technology / Press Information Bureau$$, $$2026-10-16$$,
  $$["TDB signed the RDI-support agreement with QNu Labs.","The support is Rs 150 crore for a project with a stated total cost of Rs 300 crore.","The programme targets Quantum Secure and Sensing Networks and progression from TRL 4-5 toward TRL-9.","Its four cited pillars are identity security, location integrity, network security and time integrity."]$$::jsonb,
  $$[{"question":"Does moving a technology toward TRL-9 mean it is merely an early laboratory concept?","answer":"No. TRL-9 denotes the highest maturity level, with an actual system proven in an operational environment."}]$$::jsonb,
  $${"title":"Maturing a quantum-security technology","steps":["Research produces component-level technologies.","Engineering and integration raise technology readiness.","Identity, location, network and time functions are brought together.","Operational validation moves the stack toward deployable use."]}$$::jsonb,
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
  $$2026-10-18-plfs-september-monthly-bulletin$$,
  $$2026-10-18-paimana-q2-infrastructure-dashboard$$,
  $$2026-10-18-fssai-infant-nutrition-draft$$,
  $$2026-10-18-gsat7c-varunastra-contracts$$,
  $$2026-10-18-ins-samarthak-commissioning$$,
  $$2026-10-18-exercise-konkan-26$$,
  $$2026-10-18-mscaro-multistate-cooperative-audits$$,
  $$2026-10-18-sugarcane-sugar-sector-committee$$,
  $$2026-10-18-rdi-advanced-chemicals-materials$$,
  $$2026-10-18-tdb-qnu-quantum-secure-networks$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;

