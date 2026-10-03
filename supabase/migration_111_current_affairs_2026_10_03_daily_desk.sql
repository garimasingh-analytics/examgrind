-- 3 October 2026 daily current-affairs desk.
-- Every brief was checked against the linked primary official source.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  $$2026-10-03-capex-2026-forward-looking-survey$$, $$2026-10-03$$,
  $$NSO begins CAPEX 2026 survey of private-corporate investment intentions$$,
  $$The National Statistical Office has started CAPEX 2026, a forward-looking survey running from October to December. It collects information from selected large private enterprises on past, current and planned capital expenditure, investment purpose and sources of finance.$$,
  $$This is a useful official-statistics update for questions on how the government reads investment trends. The survey measures reported and intended private-corporate capital expenditure; it is not a GDP estimate or a census of every business.$$,
  $$NSO functions under the Ministry of Statistics and Programme Implementation. The survey frame uses active enterprises registered with the Ministry of Corporate Affairs and the exercise is conducted under the Collection of Statistics Act, 2008. Individual enterprise data are kept confidential; published outputs are aggregate indicators.$$,
  $$Forward-Looking Survey on Private Corporate Sector CAPEX Investment Intentions (CAPEX 2026)$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317606&reg=3&lang=1$$,
  $$National Statistical Office, Ministry of Statistics and Programme Implementation / Press Information Bureau$$, $$2026-10-01$$,
  $$["CAPEX 2026 is being conducted from October to December 2026.","NSO collects past, current and planned capital-expenditure information from selected large private enterprises.","The survey frame uses active MCA-registered enterprises subject to eligibility and turnover criteria.","The survey is conducted under the Collection of Statistics Act, 2008."]$$::jsonb,
  $$[{"question":"Does CAPEX 2026 directly measure GDP?","answer":"No. It is a survey of capital expenditure and investment intentions of selected private-corporate enterprises."},{"question":"Which ministry houses NSO?","answer":"The Ministry of Statistics and Programme Implementation (MoSPI)."}]$$::jsonb,
  $${"title":"From company plans to an investment indicator","steps":["Selected enterprises report investment information through the survey portal.","NSO validates and protects unit-level responses.","Data are combined into aggregate investment indicators.","The results help assess emerging private-investment trends."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-icar-fci-sustainable-foodgrain-storage$$, $$2026-10-03$$,
  $$ICAR and FCI partner on safe and sustainable foodgrain storage$$,
  $$The Indian Council of Agricultural Research and the Food Corporation of India signed an MoU to work on safe and sustainable foodgrain storage. The partnership links agricultural research with the operational challenge of preserving public foodgrain stocks.$$,
  $$The update connects food security, post-harvest management and scientific storage. An MoU starts an institutional collaboration; it should not be mistaken for a new procurement price, a change in the public-distribution entitlement or a completed nationwide storage rollout.$$,
  $$ICAR is the national agricultural-research system under the Department of Agricultural Research and Education. FCI is the central public-sector agency that undertakes foodgrain procurement, storage and movement for the food-security system. Sound storage aims to limit quantity and quality losses between procurement and distribution.$$,
  $$ICAR and FCI signs MoU for Safe and Sustainable Foodgrain Storage$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317785&reg=3&lang=1$$,
  $$Indian Council of Agricultural Research and Food Corporation of India / Press Information Bureau$$, $$2026-10-01$$,
  $$["The MoU is between ICAR and the Food Corporation of India.","Its subject is safe and sustainable foodgrain storage.","ICAR is India's agricultural-research system under DARE.","FCI is central to procurement, storage and movement of foodgrains for food security."]$$::jsonb,
  $$[{"question":"Which organisation is the storage partner in the ICAR-FCI MoU?","answer":"The Food Corporation of India (FCI)."},{"question":"Why is scientific storage important after procurement?","answer":"It helps protect the quantity and quality of foodgrains before movement and distribution."}]$$::jsonb,
  $${"title":"Foodgrain from procurement to distribution","steps":["Foodgrains enter the public system through procurement.","Stored stocks need protection from avoidable loss and deterioration.","ICAR research can test and refine safer storage approaches.","FCI can apply relevant learning across its storage operations."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-rodtep-extension-december-2026$$, $$2026-10-03$$,
  $$Government extends RoDTEP scheme through 31 December 2026$$,
  $$The Department of Commerce extended the Remission of Duties and Taxes on Exported Products (RoDTEP) scheme until 31 December 2026. The extension continues the existing remission framework for eligible exports rather than creating a new export subsidy programme.$$,
  $$RoDTEP is a core trade-policy term: it addresses embedded duties, taxes and levies on exported products that are not otherwise refunded. For prelims, distinguish it from a direct cash incentive and from GST input-tax credit.$$,
  $$RoDTEP is implemented through the foreign-trade policy framework. It supports eligible exports from Domestic Tariff Area units, Advance Authorisation holders, Special Economic Zones and Export Oriented Units, subject to the notified terms, rates and value caps.$$,
  $$Government Extends Remission of Duties and Taxes on Exported Products (RoDTEP) Scheme upto 31st December 2026$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2318052&reg=3&lang=1$$,
  $$Department of Commerce, Ministry of Commerce and Industry / Press Information Bureau$$, $$2026-10-02$$,
  $$["RoDTEP stands for Remission of Duties and Taxes on Exported Products.","The scheme was extended through 31 December 2026.","It addresses eligible embedded duties, taxes and levies that are not refunded elsewhere.","The release covers eligible DTA, AA, SEZ and EOU exports under the notified framework."]$$::jsonb,
  $$[{"question":"What is the central purpose of RoDTEP?","answer":"To remit eligible embedded duties, taxes and levies on exported products that are not otherwise refunded."},{"question":"Until when was RoDTEP extended in this release?","answer":"31 December 2026."}]$$::jsonb,
  $${"title":"Why export-duty remission matters","steps":["An exporter incurs eligible embedded taxes or levies.","The export is assessed under the notified RoDTEP framework.","The remission reduces unreimbursed domestic tax costs.","Lower embedded costs can support export price competitiveness."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-maharashtra-amended-bharatnet-agreement$$, $$2026-10-03$$,
  $$Maharashtra signs agreement to implement the amended BharatNet programme$$,
  $$Digital Bharat Nidhi and the Department of Telecommunications signed an agreement with the Government of Maharashtra, MahaNet Digital Infrastructure Limited, BSNL and MahaIT to implement the amended BharatNet programme in the State.$$,
  $$This is a cooperative-federalism and digital-infrastructure update. BharatNet is public broadband infrastructure for rural connectivity; it is not a retail internet plan operated solely by BSNL.$$,
  $$Digital Bharat Nidhi is the statutory fund that succeeded the Universal Service Obligation Fund under the Telecommunications Act, 2023. BharatNet seeks to make high-speed broadband available to Gram Panchayats and villages on demand, with different public agencies participating in funding, execution and programme management.$$,
  $$Agreement Signed between DBN, Department of Telecommunications, Government of Maharashtra, MDIL, BSNL and MahaIT for Implementation of Amended BharatNet Program in Maharashtra$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317906&reg=3&lang=1$$,
  $$Department of Telecommunications, Ministry of Communications / Press Information Bureau$$, $$2026-10-01$$,
  $$["The agreement concerns implementation of the amended BharatNet programme in Maharashtra.","Its signatories include DBN, DoT, the Maharashtra government, MDIL, BSNL and MahaIT.","Digital Bharat Nidhi succeeded the Universal Service Obligation Fund under the Telecommunications Act, 2023.","BharatNet is public broadband infrastructure for rural connectivity."]$$::jsonb,
  $$[{"question":"Which statutory fund is involved in the Maharashtra BharatNet agreement?","answer":"Digital Bharat Nidhi (DBN)."},{"question":"Is BharatNet simply a BSNL retail internet plan?","answer":"No. It is public broadband infrastructure implemented through a multi-agency programme."}]$$::jsonb,
  $${"title":"Multi-agency rural broadband delivery","steps":["DBN and DoT provide the central programme framework.","The State and its agencies coordinate local implementation.","BSNL and programme partners support execution and management.","Rural public infrastructure can enable broadband-based services."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-defence-accounts-digital-finance-initiatives$$, $$2026-10-03$$,
  $$Defence Accounts Department launches integrated finance and accounting tools$$,
  $$At its 279th Annual Day, the Defence Accounts Department launched the integration of SAKSHAM with the Indian Army Financial Information System, a Treasury Single Account system in the Ministry of Defence, and a revamped National Compilation System for defence expenditure.$$,
  $$The exam value is institutional: these are public-finance and digital-governance tools within defence administration. They do not alter the armed forces' command structure or replace the role of the Ministry of Finance in Union public finance.$$,
  $$The Defence Accounts Department supports internal audit, accounting, payments and financial advice for the Ministry of Defence. A Treasury Single Account improves visibility and cash management; the new system is operationalised through PRISM and integrated with RBI e-Kuber for just-in-time releases to autonomous bodies.$$,
  $$Raksha Mantri Launches Key Digital and Financial Management Initiatives at Defence Accounts Department’s 279th Annual Day Celebration$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317586&reg=3&lang=1$$,
  $$Ministry of Defence / Press Information Bureau$$, $$2026-10-01$$,
  $$["SAKSHAM was integrated with the Indian Army Financial Information System.","The Ministry of Defence inaugurated a Treasury Single Account system through the PRISM platform.","The TSA system is integrated with RBI e-Kuber for just-in-time release to autonomous bodies.","The revamped National Compilation System is the single source for accounting and compilation of defence expenditure."]$$::jsonb,
  $$[{"question":"What is the role of the revamped National Compilation System for Defence?","answer":"It is the single source for accounting and compilation of defence expenditure."},{"question":"Which RBI platform is named in the Ministry of Defence TSA arrangement?","answer":"RBI e-Kuber."}]$$::jsonb,
  $${"title":"Digitising defence-finance controls","steps":["Service and accounts systems exchange approved budget and bill data.","SAKSHAM supports digital audit and payment workflows.","The Treasury Single Account improves fund-release visibility.","The National Compilation System consolidates expenditure reporting."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-buxa-tiger-reintroduction$$, $$2026-10-03$$,
  $$Tiger reintroduction programme begins at Buxa Tiger Reserve$$,
  $$A tigress was released at West Bengal's Buxa Tiger Reserve, beginning a phased tiger-reintroduction programme intended to restore a viable, self-sustaining population in the landscape. The released animal, T138, was brought from Valmiki Tiger Reserve in Bihar.$$,
  $$This is a conservation-management update, not merely a wildlife sighting. It tests the difference between a Tiger Reserve, a landscape-level reintroduction programme and routine transfer of animals.$$,
  $$Buxa was declared a Tiger Reserve in 1983 and forms part of the North Bengal landscape, with ecological connections to forests and protected areas in Bhutan and Assam. Reintroduction requires suitable habitat, prey, protection and community participation; releasing one animal alone does not establish a population.$$,
  $$Union Environment Minister and CM (West Bengal) release 1st Tigress in Buxa Tiger Reserve under Tiger Reintroduction Programme$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2318110&reg=3&lang=1$$,
  $$Ministry of Environment, Forest and Climate Change / Press Information Bureau$$, $$2026-10-02$$,
  $$["The reintroduction programme began at Buxa Tiger Reserve in West Bengal.","The first released animal was a tigress, T138, from Valmiki Tiger Reserve in Bihar.","Buxa was declared a Tiger Reserve in 1983.","Buxa lies in a wider North Bengal landscape with connections toward Bhutan and Assam."]$$::jsonb,
  $$[{"question":"From which Tiger Reserve was T138 brought to Buxa?","answer":"Valmiki Tiger Reserve in Bihar."},{"question":"What makes this a reintroduction programme rather than a single wildlife transfer?","answer":"It is a phased effort to restore a viable, self-sustaining tiger population in the landscape."}]$$::jsonb,
  $${"title":"From habitat recovery to tiger reintroduction","steps":["Managers assess habitat, prey base and protection conditions.","A suitable tiger is translocated under a phased plan.","Monitoring tracks survival, movement and ecological response.","Long-term management aims for a viable resident population."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-ladakh-standard-place-feature-names$$, $$2026-10-03$$,
  $$Survey of India map adds standard names for 28 Ladakh places and features$$,
  $$The Government, in consultation with the Union Territory of Ladakh, identified 28 places and physical features by standard names on the official Survey of India map. The list includes peaks, passes, glaciers, valleys, a river, a lake and land areas.$$,
  $$This is a map-governance and geography update. Standardisation improves unambiguous official reference; it does not by itself create a new district, alter a boundary or change the constitutional status of Ladakh.$$,
  $$Survey of India is India's national mapping agency. Official geographic naming helps maps, public records, emergency response, planning and communication refer to the same feature consistently. Examples in the release include Atisha Giri (peak), Chapchingal Pass, Parpik (glacier), Yangpa River and Guru Rinpoche (lake).$$,
  $$Government of India, in consultation with UT of Ladakh, identifies 28 places/features by standard names on the official Survey of India map$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2318027&reg=3&lang=1$$,
  $$Ministry of Home Affairs and Union Territory of Ladakh / Press Information Bureau$$, $$2026-10-02$$,
  $$["Twenty-eight places and physical features were identified by standard names on the official Survey of India map of Ladakh.","The exercise was undertaken in consultation with the Union Territory of Ladakh.","The list includes peaks, passes, glaciers, a valley, a river, a lake and land areas.","Chapchingal Pass, Parpik Glacier, Yangpa River and Guru Rinpoche Lake are examples named in the release."]$$::jsonb,
  $$[{"question":"Which national mapping agency's official map is cited in this update?","answer":"Survey of India."},{"question":"Does standard naming of a feature itself change a State or UT boundary?","answer":"No. It standardises official reference to the listed place or feature."}]$$::jsonb,
  $${"title":"Why standard geographic names matter","steps":["Authorities identify a place or physical feature.","The UT and mapping system agree on a standard name.","The official map records the name and feature type.","Users of maps and records can refer to the feature consistently."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-gobardhan-central-sector-cbg-scheme$$, $$2026-10-03$$,
  $$GOBARdhan Central Sector Scheme launched for compressed biogas$$,
  $$The Ministry of Petroleum and Natural Gas launched GOBARdhan, a Central Sector Scheme for developing the compressed-biogas sector. The Cabinet-approved ten-year framework combines assured offtake, stable pricing, capital assistance, pipeline connectivity, credit support and ecosystem development.$$,
  $$GOBARdhan is a major clean-energy and circular-economy update. Remember that it is a national scheme for compressed biogas, not a generic sanitation campaign or a synonym for every household biogas plant.$$,
  $$The scheme has an outlay of ₹23,731 crore for FY 2026-27 to FY 2035-36 and aims to raise domestic CBG production nearly ten-fold to around 5 MMSCMD. It builds on earlier CBG-sector measures such as SATAT, organic-manure support, biomass-aggregation support and pipeline development.$$,
  $$Union Minister of Petroleum and Natural Gas launches GOBARdhan Scheme to accelerate development of India’s Compressed Biogas sector$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317937&reg=3&lang=1$$,
  $$Ministry of Petroleum and Natural Gas / Press Information Bureau$$, $$2026-10-01$$,
  $$["GOBARdhan is a Central Sector Scheme for developing the compressed-biogas sector.","The approved outlay is ₹23,731 crore for FY 2026-27 to FY 2035-36.","The scheme aims to increase domestic CBG production nearly ten-fold to around 5 MMSCMD.","Its framework includes offtake, pricing, capital assistance, pipelines, credit support and ecosystem development."]$$::jsonb,
  $$[{"question":"Which ministry administers the launched GOBARdhan CBG scheme?","answer":"The Ministry of Petroleum and Natural Gas."},{"question":"What does CBG stand for?","answer":"Compressed biogas."}]$$::jsonb,
  $${"title":"Organic waste to clean gas","steps":["Organic feedstock such as residues and dung is aggregated.","A CBG plant processes it into renewable gas and organic-manure outputs.","Offtake, pricing and infrastructure reduce project uncertainty.","Domestic renewable gas supports circularity and energy security."]}$$::jsonb,
  $$published$$, now()
),
(
  $$2026-10-03-exempted-fastag-divyangjan-guidelines$$, $$2026-10-03$$,
  $$Revised exempted-FASTag guidelines improve toll access for eligible PwD vehicles$$,
  $$The government revised the rules for issuing and renewing exempted FASTags for eligible Divyangjan and persons-with-disabilities vehicles. The framework began on 2 October and replaces annual renewal with validity linked to the disability percentage recorded in eligible documentation.$$,
  $$This is a precise accessibility-and-transport policy change. An exempted FASTag is not a blanket toll exemption for every disabled person or every vehicle; eligibility remains tied to the vehicle category, disability records and National Highways Fee Rules.$$,
  $$For eligible vehicles, the updated guideline gives a five-year validity for a recorded disability of 70% to 100%, and three years for 40% to below 70%, after which renewal remains subject to continued eligibility. Recognised records include a valid Disability Certificate or UDID card.$$,
  $$Government of India Revises Guidelines for Issuance of Exempted FASTags for Divyangjan and PwD Vehicles$$,
  $$https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317700&reg=3&lang=1$$,
  $$Ministry of Road Transport and Highways / Press Information Bureau$$, $$2026-10-01$$,
  $$["The revised exempted-FASTag guidelines took effect on 2 October 2026.","Eligible vehicles include specially designed PwD vehicles and vehicles registered under the ownership type Divyangjan.","A 70% to 100% recorded disability gives a five-year FASTag validity under the guideline.","A 40% to below 70% recorded disability gives a three-year validity; UDID is among recognised records."]$$::jsonb,
  $$[{"question":"What validity is specified for an eligible exempted FASTag with a recorded disability of 70% to 100%?","answer":"Five years."},{"question":"Name one record recognised under the revised guideline.","answer":"A valid Disability Certificate or a Unique Disability Identity (UDID) card."}]$$::jsonb,
  $${"title":"Eligibility-led toll exemption workflow","steps":["An eligible vehicle and disability record are assessed.","The recorded disability percentage determines the tag validity period.","An exempted FASTag is issued under the National Highways Fee Rules framework.","Renewal remains subject to continued eligibility and compliance."]}$$::jsonb,
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
  $$2026-10-03-capex-2026-forward-looking-survey$$,
  $$2026-10-03-icar-fci-sustainable-foodgrain-storage$$,
  $$2026-10-03-rodtep-extension-december-2026$$,
  $$2026-10-03-maharashtra-amended-bharatnet-agreement$$,
  $$2026-10-03-defence-accounts-digital-finance-initiatives$$,
  $$2026-10-03-buxa-tiger-reintroduction$$,
  $$2026-10-03-ladakh-standard-place-feature-names$$,
  $$2026-10-03-gobardhan-central-sector-cbg-scheme$$,
  $$2026-10-03-exempted-fastag-divyangjan-guidelines$$
) and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict do nothing;
