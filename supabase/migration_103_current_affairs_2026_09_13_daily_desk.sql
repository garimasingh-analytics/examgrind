-- 13 September 2026 daily current-affairs desk.
-- Eight original, primary-source-verified briefs from the 11-12 September release window.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-13-brics-new-delhi-declaration', '2026-09-13',
  '18th BRICS Summit adopts the New Delhi Declaration',
  'The leaders at the 18th BRICS Summit in New Delhi adopted the BRICS New Delhi Declaration under India''s 2026 chairship. It frames cooperation in the expanded grouping around political and security, economic and financial, and cultural and people-to-people pillars.',
  'A summit declaration is a useful international-relations document, but it is not a treaty. For prelims, retain the summit location, India''s chairship and the three cooperation pillars; for mains, connect the text to reform of multilateralism and the Global South.',
  'BRICS began as a four-country forum, with South Africa joining in 2010. The grouping has since expanded. The declaration records the collective summit position; individual commitments still require implementation through the relevant members and institutions.',
  'BRICS New Delhi Declaration: Building for Resilience, Innovation, Cooperation and Sustainability',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309505&lang=1&reg=3',
  'Prime Minister''s Office / Press Information Bureau', '2026-09-12',
  '["The 18th BRICS Summit was held in New Delhi under India''s 2026 chairship.","The New Delhi Declaration is a summit declaration, not a treaty.","BRICS cooperation is organised around political and security, economic and financial, and cultural and people-to-people pillars.","The 2026 summit theme was Building for Resilience, Innovation, Cooperation and Sustainability."]'::jsonb,
  '[{"question":"Is the BRICS New Delhi Declaration itself a treaty?","answer":"No. It is a collective summit declaration."},{"question":"Name the three broad BRICS cooperation pillars.","answer":"Political and security; economic and financial; and cultural and people-to-people cooperation."}]'::jsonb,
  '{"title":"BRICS summit output","steps":["India chairs and hosts the 18th summit.","Leaders meet in the expanded BRICS format.","They adopt the New Delhi Declaration.","Implementation then depends on members and their institutions."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-india-china-brics-bilateral', '2026-09-13',
  'India and China restate the centrality of border peace at BRICS meeting',
  'Prime Minister Narendra Modi and President Xi Jinping met in New Delhi on the BRICS Summit sidelines. The official record says they linked the continued development of bilateral relations to peace and tranquillity in border areas and reiterated a commitment to a fair, reasonable and mutually acceptable boundary settlement.',
  'The relevance is the exam distinction between a boundary settlement, which remains unresolved, and the management of the Line of Actual Control through existing agreements and understandings. The meeting is a diplomatic development, not a concluded boundary agreement.',
  'India and China had last met in Tianjin in August 2025, according to the release. The leaders also discussed trade imbalance, supply-chain issues, market access, mobility and people-to-people ties, and used the formulation of mutual respect, mutual sensitivity and mutual interest.',
  'Prime Minister''s bilateral meeting with Chinese President Xi Jinping',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309538&lang=1&reg=3',
  'Prime Minister''s Office / Press Information Bureau', '2026-09-12',
  '["The meeting took place in New Delhi on 12 September 2026 on the BRICS Summit sidelines.","The official release identifies peace and tranquillity in border areas as essential for bilateral relations.","Both sides referred to observing existing border agreements and understandings.","The boundary question was not settled; the stated aim remains a fair, reasonable and mutually acceptable resolution."]'::jsonb,
  '[{"question":"Did the 12 September meeting announce a final India-China boundary settlement?","answer":"No. It restated commitment to pursuing a mutually acceptable resolution."},{"question":"What condition did the release call essential for continued development of bilateral relations?","answer":"Peace and tranquillity in the border areas."}]'::jsonb,
  '{"title":"India-China boundary context","steps":["Existing agreements guide border management.","Peace and tranquillity support wider ties.","Leaders discuss trade, mobility and regional issues.","Boundary settlement remains a continuing objective."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-india-malaysia-kota-kinabalu-consulate', '2026-09-13',
  'Malaysia concurs with an Indian consulate in Kota Kinabalu',
  'During the India-Malaysia bilateral meeting at the BRICS Summit, Malaysia conveyed concurrence to establishing a Consulate General of India in Kota Kinabalu, Sabah. The two sides also reviewed their Comprehensive Strategic Partnership.',
  'This is a concrete diplomatic-infrastructure development. Kota Kinabalu is in Sabah, on Borneo; do not confuse it with Kuala Lumpur or with an embassy. A consulate general supports consular and economic links but does not replace an embassy.',
  'India and Malaysia elevated their relationship to a Comprehensive Strategic Partnership in 2024. The 12 September discussion covered trade, investment, defence and security, semiconductors, infrastructure, digital economy, energy, fintech, education and tourism.',
  'Prime Minister meets with the Prime Minister of Malaysia on the sidelines of the BRICS Summit in New Delhi',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309382&lang=1&reg=3',
  'Prime Minister''s Office / Press Information Bureau', '2026-09-12',
  '["Malaysia conveyed concurrence to an Indian Consulate General in Kota Kinabalu.","Kota Kinabalu is the capital of Sabah in Malaysia.","India-Malaysia ties are described as a Comprehensive Strategic Partnership.","A consulate general is distinct from an embassy."]'::jsonb,
  '[{"question":"In which Malaysian state is Kota Kinabalu?","answer":"Sabah."},{"question":"Does a new consulate general replace an embassy?","answer":"No; it is a separate consular post."}]'::jsonb,
  '{"title":"Consular expansion","steps":["Bilateral leaders meet at BRICS.","Malaysia concurs with a new Indian consular post.","The post is planned for Kota Kinabalu in Sabah.","It supports wider Comprehensive Strategic Partnership links."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-cochin-shipyard-drydocks-world-jv', '2026-09-13',
  'Cochin Shipyard and Drydocks World form a 50:50 ship-repair joint venture',
  'Cochin Shipyard Ltd and Dubai-based Drydocks World have signed a 50:50 joint venture agreement to operate and expand the International Ship Repair Facility at Kochi. The official release calls it a first-of-its-kind public-private partnership in India''s ship-repair sector.',
  'This joins maritime infrastructure, public-sector enterprises and India-UAE economic cooperation. Keep the fact precise: it is a corporate joint venture around the Kochi facility, not a new central-sector scheme or a completed nationwide ship-repair network.',
  'Drydocks World is a DP World company. The agreement formalises collaboration explored through an MoU at India Maritime Week 2025. Both partners will fund initial capital through equity and each hold half the venture.',
  'Cochin Shipyard Ltd and Drydocks World Form Joint Venture To Strengthen India''s Ship Repair Industry',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309337&lang=1&reg=3',
  'Ministry of Ports, Shipping and Waterways / Press Information Bureau', '2026-09-11',
  '["The joint venture is between Cochin Shipyard Ltd and Drydocks World, a DP World company.","Each partner holds a 50% stake and funds initial capital through equity.","It will operate and expand the International Ship Repair Facility at Kochi.","The 2026 agreement follows an MoU at India Maritime Week 2025."]'::jsonb,
  '[{"question":"Where is the International Ship Repair Facility covered by the JV?","answer":"Kochi, Kerala."},{"question":"What is the equity split in the CSL-Drydocks World venture?","answer":"50:50."}]'::jsonb,
  '{"title":"Ship-repair JV","steps":["CSL and Drydocks World previously signed an MoU.","They formalise a 50:50 equity joint venture.","The venture operates and expands the Kochi facility.","The stated aim is stronger domestic and regional ship-repair capacity."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-pmay-u-csmc-approvals', '2026-09-13',
  'PMAY-U 2.0 gets over 29,000 more housing approvals',
  'The ninth Central Sanctioning and Monitoring Committee meeting approved more than 29,000 additional PMAY-U 2.0 houses under Beneficiary Led Construction and Affordable Housing in Partnership. The approvals cover Assam, Bihar, Gujarat, Telangana, Tripura and Uttar Pradesh, taking total PMAY-U 2.0 sanctions to 18.77 lakh.',
  'This is a scheme-implementation update, useful for identifying PMAY-U 2.0 verticals and its target groups. Sanction, completion and delivery are different stages; the reported number is an approval figure, not the number of homes already handed over.',
  'PMAY-U 2.0 provides housing assistance to eligible urban EWS, LIG and MIG families. The release says eligible annual household income can be up to Rs 9 lakh and describes options including self-construction, project housing, affordable rental housing and interest subsidy.',
  'Secretary, Department of Urban Development, MoHUA chairs 9th meeting of CSMC',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309343&lang=1&reg=3',
  'Ministry of Housing and Urban Affairs / Press Information Bureau', '2026-09-11',
  '["Over 29,000 PMAY-U 2.0 homes were approved at the ninth CSMC meeting.","The approved homes use the BLC and AHP verticals.","The six covered States are Assam, Bihar, Gujarat, Telangana, Tripura and Uttar Pradesh.","Total PMAY-U 2.0 sanctions reported were 18.77 lakh, which is not the same as completed homes."]'::jsonb,
  '[{"question":"What do BLC and AHP stand for in PMAY-U 2.0?","answer":"Beneficiary Led Construction and Affordable Housing in Partnership."},{"question":"Are 18.77 lakh PMAY-U 2.0 sanctions the same as 18.77 lakh completed homes?","answer":"No. They are approvals/sanctions."}]'::jsonb,
  '{"title":"PMAY-U 2.0 approval chain","steps":["States submit projects.","CSMC considers and sanctions eligible projects.","BLC and AHP are two scheme routes.","Construction and delivery follow separate implementation stages."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-badri-cattle-opu-ivf', '2026-09-13',
  'OPU-IVF produces a Badri calf for indigenous-breed conservation',
  'A Badri female calf was born through Ovum Pick-Up and In Vitro Fertilization after transfer of a Badri embryo to a Sahiwal recipient cow. ICAR-NDRI and G. B. Pant University collaborated on the work, supported by the Uttarakhand Biotechnology Council.',
  'The development links animal biotechnology with conservation of indigenous livestock genetic resources. It does not alter breed classification or create a new national cattle scheme. The exam hook is the OPU-IVF-to-embryo-transfer sequence and Badri cattle''s Uttarakhand association.',
  'Badri cattle are an indigenous cattle genetic resource of Uttarakhand and are recognised as the State animal. Under the programme, oocytes from selected Badri donor cows were collected through ultrasound-guided ovum pick-up, fertilised in vitro using Badri-bull semen, cultured as embryos and transferred to synchronised recipient cows.',
  'OPU-IVF Calf Born in Badri Cattle: A Major Milestone for Conservation and Genetic Improvement of Uttarakhand''s Indigenous Breed',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309386&lang=1&reg=3',
  'Ministry of Agriculture and Farmers Welfare / Press Information Bureau', '2026-09-12',
  '["Badri cattle are an indigenous cattle genetic resource of Uttarakhand and its State animal.","OPU means Ovum Pick-Up; IVF means In Vitro Fertilization.","The Badri embryo was transferred to a Sahiwal recipient cow.","The collaboration involved ICAR-NDRI, Karnal and G. B. Pant University, Pantnagar."]'::jsonb,
  '[{"question":"What do OPU and IVF mean in this cattle-conservation work?","answer":"Ovum Pick-Up and In Vitro Fertilization."},{"question":"Which State is associated with Badri cattle?","answer":"Uttarakhand."}]'::jsonb,
  '{"title":"OPU-IVF conservation sequence","steps":["Collect oocytes from selected donor cows.","Fertilise them in vitro using selected semen.","Culture the resulting embryos.","Transfer an embryo to a synchronised recipient cow."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-colombo-security-conclave-ttx', '2026-09-13',
  'Colombo Security Conclave tabletop exercise focuses on illicit maritime activity',
  'A three-day Colombo Security Conclave tabletop exercise concluded at the Eastern Naval Command in Visakhapatnam. Delegations considered a coordinated response to illicit maritime activities in the Indian Ocean Region, including terrorism, narcotics smuggling, trafficking and IUU fishing.',
  'The value lies in connecting a regional security grouping with non-traditional maritime threats and Maritime Domain Awareness. A tabletop exercise uses simulated scenarios; it is not a sea-going combat exercise or a new treaty.',
  'The exercise reviewed standard operating procedures and information-sharing arrangements. The release connects it to MAHASAGAR, expanded as Mutual and Holistic Advancement for Security and Growth Across Regions.',
  'Colombo Security Conclave Table Top Exercise concludes at Eastern Naval Command, Visakhapatnam',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309385&lang=1&reg=3',
  'Ministry of Defence / Press Information Bureau', '2026-09-12',
  '["The exercise was held under the Colombo Security Conclave at Eastern Naval Command, Visakhapatnam.","It focused on coordinated responses to illicit maritime activities in the Indian Ocean Region.","IUU fishing means illegal, unreported and unregulated fishing.","The exercise reviewed SOPs and information sharing for Maritime Domain Awareness."]'::jsonb,
  '[{"question":"What does IUU stand for in maritime governance?","answer":"Illegal, unreported and unregulated."},{"question":"Was the Colombo Security Conclave event a tabletop or sea-going exercise?","answer":"A tabletop exercise using simulated scenarios."}]'::jsonb,
  '{"title":"Maritime-security response","steps":["Regional participants identify illicit-maritime threats.","They test responses through simulated scenarios.","They review SOPs and information sharing.","The aim is better Maritime Domain Awareness and coordination."]}'::jsonb,
  'published', now()
),
(
  '2026-09-13-pm-abhim-andhra-health-infrastructure', '2026-09-13',
  'Andhra Pradesh inaugurates PM-ABHIM critical-care and public-health laboratories',
  'The Union Health Minister inaugurated 10 Critical Care Blocks and 12 Integrated Public Health Laboratories in Andhra Pradesh. The release places both within PM-ABHIM''s health-security architecture, pairing treatment capacity for critically ill patients with diagnostic and surveillance capacity.',
  'This is a good health-governance item because it separates Critical Care Blocks from Integrated Public Health Laboratories. They are complementary: one handles advanced clinical care while the other supports detection and response to disease threats.',
  'The official release says PM-ABHIM has sanctioned 631 Critical Care Blocks across States and Union Territories. In Andhra Pradesh, 24 blocks have been sanctioned and 26 IPHLs approved; 14 laboratories were already functional, with the remaining 12 ready for inauguration.',
  'Union Health Minister Shri J P Nadda Inaugurates Critical Care Blocks and Integrated Public Health Laboratories in Andhra Pradesh',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309440&lang=1&reg=3',
  'Ministry of Health and Family Welfare / Press Information Bureau', '2026-09-12',
  '["Ten Critical Care Blocks and 12 Integrated Public Health Laboratories were inaugurated in Andhra Pradesh.","PM-ABHIM links public-health emergency preparedness with continuity of routine health services.","Critical Care Blocks provide advanced clinical-care capacity, while IPHLs strengthen diagnostics and surveillance.","PM-ABHIM has sanctioned 631 Critical Care Blocks across States and Union Territories, according to the release."]'::jsonb,
  '[{"question":"Which PM-ABHIM component strengthens diagnostics and disease surveillance?","answer":"Integrated Public Health Laboratories."},{"question":"How do Critical Care Blocks differ from IPHLs?","answer":"CCBs provide advanced treatment capacity; IPHLs provide diagnostic and surveillance capacity."}]'::jsonb,
  '{"title":"Health-security architecture","steps":["Primary and referral care identify patient needs.","IPHLs strengthen diagnosis and surveillance.","Critical Care Blocks provide advanced emergency care.","Together they support resilient response without abandoning routine services."]}'::jsonb,
  'published', now()
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
where briefs.slug like '2026-09-13-%' and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
