-- 5 September 2026 morning current-affairs desk.
-- These source-backed briefs cover two 4 September developments not already
-- represented in the prior desk files. They are written as revision aids,
-- rather than reproductions of the primary releases.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-05-gslv-f17-eos-05-geostationary-imaging',
  '2026-09-05',
  'GSLV-F17 places EOS-05 into orbit: India’s first imaging satellite from geosynchronous orbit',
  'ISRO reported that GSLV-F17 successfully placed EOS-05 into its intended orbit on 4 September. EOS-05 is an Earth-observation spacecraft and, according to ISRO, India’s first imaging satellite from geosynchronous orbit.',
  'This is a high-yield Science and Technology update because it connects a launch vehicle, an orbit type and a satellite application. In a prelims question, do not confuse a geosynchronous orbit with a low-Earth orbit: orbit choice affects how often and from where a satellite can observe an area.',
  'GSLV stands for Geosynchronous Satellite Launch Vehicle. Earth-observation satellites collect information about the Earth and can support uses such as weather, environment, mapping and disaster-related observation, depending on their instruments and mission design. A geosynchronous orbit has an orbital period matching Earth’s rotation; a satellite in geostationary orbit is a special geosynchronous case that appears fixed over one point on the equator. ISRO identifies EOS-05 as an imaging satellite from geosynchronous orbit; this should not be treated as proof that every Earth-observation satellite uses that orbit.',
  'ISRO: GSLV-F17/EOS-05 Mission',
  'https://www.isro.gov.in/ISRO_EN/Mission_GSLVF17.html',
  'Indian Space Research Organisation',
  '2026-09-04',
  '["GSLV stands for Geosynchronous Satellite Launch Vehicle.", "EOS-05 is an Earth-observation spacecraft launched by GSLV-F17.", "ISRO describes EOS-05 as India’s first imaging satellite from geosynchronous orbit.", "Geosynchronous means an orbit has the same period as Earth’s rotation; geostationary is a more specific orbit with an equatorial, circular path."]'::jsonb,
  '[{"question":"What is the difference between a geosynchronous and a geostationary orbit?","answer":"A geosynchronous orbit matches Earth’s rotational period. A geostationary orbit is the special circular, equatorial geosynchronous case in which the satellite appears fixed above one point on Earth."},{"question":"What does EOS denote in this mission context?","answer":"Earth Observation Satellite."}]'::jsonb,
  '{"title":"Mission vocabulary: launcher, payload and orbit","steps":["GSLV-F17 is the launch vehicle.","EOS-05 is the Earth-observation payload.","The mission placed the spacecraft into its intended orbit.","The chosen orbit supports the mission’s planned observation role."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-sebi-esma-central-counterparty-mou',
  '2026-09-05',
  'SEBI and ESMA agree to cooperate on central counterparties',
  'SEBI announced an MoU with the European Securities and Markets Authority (ESMA) for cooperation and exchange of information relating to central counterparties. The update is about regulatory cooperation; it does not itself create a new Indian exchange or change every clearing rule.',
  'For Economy and international-financial-regulation preparation, this is a useful way to learn the clearing layer of a securities market. It links an Indian regulator with an EU authority and introduces why regulators coordinate when market infrastructure and risk can cross borders.',
  'SEBI is India’s securities-market regulator. ESMA is a European Union authority concerned with financial markets. A central counterparty, or CCP, steps between the two parties to an eligible transaction and becomes buyer to every seller and seller to every buyer. This arrangement can reduce bilateral counterparty exposure, but it concentrates risk in clearing infrastructure, so CCPs require strong risk management and regulatory oversight. An MoU normally provides a framework for cooperation or information exchange; it is not the same as a commercial merger or an automatic licence for every market participant.',
  'SEBI: MoU with ESMA on cooperation and information exchange relating to Central Counterparties',
  'https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2026/sebi-signs-mou-with-european-securities-and-markets-authority-on-cooperation-and-exchange-of-information-relating-to-central-counterparties_104279.html',
  'Securities and Exchange Board of India',
  '2026-09-04',
  '["SEBI is the Securities and Exchange Board of India.", "ESMA is the European Securities and Markets Authority.", "A CCP stands between parties to a cleared transaction as buyer to every seller and seller to every buyer.", "Regulatory cooperation and information exchange can support oversight of cross-border financial-market infrastructure."]'::jsonb,
  '[{"question":"What role does a central counterparty play in a cleared trade?","answer":"It interposes itself between the original parties, becoming the buyer to each seller and the seller to each buyer."},{"question":"Why does a CCP need close regulatory oversight?","answer":"It can reduce bilateral counterparty risk but concentrates clearing and risk-management functions in a key piece of market infrastructure."}]'::jsonb,
  '{"title":"Where a CCP sits in a trade","steps":["A buyer and seller enter an eligible market transaction.","A CCP interposes itself between the two original parties.","The CCP manages clearing obligations and related risk controls.","Relevant regulators coordinate where oversight or information has a cross-border dimension."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-india-france-space-cooperation',
  '2026-09-05',
  'India and France deepen space cooperation ahead of the International Space Summit',
  'India and France discussed greater cooperation in human spaceflight, advanced space technologies and industry engagement at a 4 September virtual ministerial meeting. The discussion also covered the International Space Summit in Paris and France’s proposed participation in the Bengaluru Space Expo.',
  'This is a useful International Relations and Science and Technology brief. It links bilateral diplomacy with space governance, research partnerships and the growing role of industry in the space sector. It should be read as a cooperation discussion, not as a completed new satellite mission or treaty.',
  'India’s space programme is led by ISRO under the Department of Space. France’s civil space agency is CNES. Their longstanding cooperation includes the Megha-Tropiques and SARAL satellite missions. International meetings on space can deal with scientific research, data sharing, frequency coordination, sustainable use of outer space and commercial activity. An invitation, dialogue or planned summit is different from a final binding agreement.',
  'Department of Space / PIB: India-France space partnership discussion',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306722&lang=1&reg=3',
  'Department of Space / Press Information Bureau',
  '2026-09-04',
  '["ISRO is India’s national space agency under the Department of Space.", "CNES is France’s national space agency.", "Megha-Tropiques and SARAL are examples of India-France satellite cooperation.", "The International Telecommunication Union is relevant to international frequency management for radio-based services, including space communications."]'::jsonb,
  '[{"question":"Which French agency is India’s long-standing space partner?","answer":"CNES, the French space agency."},{"question":"Why does frequency management matter in space activity?","answer":"Satellite and other radio services need coordinated use of the radio spectrum to avoid harmful interference."}]'::jsonb,
  '{"title":"A bilateral space-cooperation pathway","steps":["Governments and agencies identify shared scientific or technological priorities.","Agencies and industry discuss missions, data, technology or capacity-building.","International rules and coordination support compatible use of shared space and spectrum resources.","Projects move forward only through their applicable approvals and implementation arrangements."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-geothermal-energy-india-policy-and-puga-wells',
  '2026-09-05',
  'Geothermal energy: India’s policy route and the Puga Valley demonstration wells',
  'A PIB backgrounder reviewed geothermal energy as a weather-independent, low-carbon energy source and noted India’s National Policy on Geothermal Energy. It also reported that two geothermal wells commissioned at Puga Valley, Ladakh, will support reservoir evaluation and a proposed 1 MW demonstration project.',
  'This is an important Environment and Energy topic because it tests the distinction between a renewable resource, a demonstration project and commercial-scale deployment. It also helps students compare dispatchable geothermal power with variable renewable sources such as solar and wind.',
  'Geothermal energy is heat from the Earth’s interior. In suitable geological settings, wells can access hot water or steam; the heat may be used directly or to generate electricity. After use, water can be reinjected into the reservoir. India’s geothermal policy is administered by the Ministry of New and Renewable Energy. A commissioned well supports exploration and reservoir assessment; it is not equivalent to a nationwide operating power fleet.',
  'PIB Backgrounder: Geothermal Energy — A New Chapter in India’s Clean Energy Journey',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306688&lang=1&reg=3',
  'Press Information Bureau',
  '2026-09-04',
  '["Geothermal energy uses heat from the Earth’s interior.", "It can be available around the clock where the geological resource is suitable.", "MNRE is the nodal ministry for implementation of the National Policy on Geothermal Energy.", "Puga Valley is in Ladakh and the wells described by PIB support reservoir evaluation."]'::jsonb,
  '[{"question":"Why is geothermal power often described as dispatchable relative to solar power?","answer":"Where a suitable resource exists, Earth’s heat is available independently of sunlight and weather, although a project still needs reliable wells and plant operation."},{"question":"What is the purpose of a geothermal exploration or evaluation well?","answer":"It helps assess the underground reservoir and its suitability for future use."}]'::jsonb,
  '{"title":"From underground heat to electricity","steps":["A suitable geothermal reservoir is identified and assessed.","Wells bring hot water or steam to the surface.","Heat is used directly or drives electricity-generation equipment.","Cooled water can be reinjected to help manage the reservoir."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-ncpcr-child-labour-rescue-rehabilitation',
  '2026-09-05',
  'NCPCR’s child-labour campaign: rescue must be followed by rehabilitation',
  'The National Commission for Protection of Child Rights reported that its Pan-India rescue and rehabilitation campaign, conducted from 12 June to 31 August, rescued more than 3,800 children from child labour. The release also reported more than 575 FIRs and described coordination with state and district authorities, labour departments and police.',
  'For Polity and Social Justice, the key learning is that child protection requires more than an enforcement drive. Identification, rescue, FIRs, rehabilitation, education and follow-up work through different institutions and must be coordinated. The reported figures are campaign outcomes, not a measure of every instance of child labour in India.',
  'NCPCR is the National Commission for Protection of Child Rights, a statutory body concerned with child rights. Child labour, child trafficking and child protection involve legal, social and administrative responses. Rescue removes a child from immediate exploitation; rehabilitation addresses safety, family support, education, health, compensation and longer-term reintegration as applicable. An FIR records initiation of a criminal process; it is not itself proof of conviction.',
  'Ministry of Women and Child Development / PIB: NCPCR child-labour campaign',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306641&lang=1&reg=3',
  'Ministry of Women and Child Development / Press Information Bureau',
  '2026-09-04',
  '["NCPCR stands for National Commission for Protection of Child Rights.", "The reported campaign ran from 12 June to 31 August 2026.", "The release reported more than 3,800 rescues and more than 575 FIRs.", "Rescue, rehabilitation and reintegration into education are related but distinct stages of child protection."]'::jsonb,
  '[{"question":"Why is rescue alone not the full child-protection response?","answer":"A rescued child may still need safety planning, rehabilitation, access to education, family support and follow-up against exploitation."},{"question":"What does registration of an FIR establish?","answer":"It records the initiation of a criminal complaint or investigation process; it does not by itself establish guilt."}]'::jsonb,
  '{"title":"A child-protection response chain","steps":["Authorities identify a child at risk or in exploitative work.","Relevant agencies coordinate rescue and immediate protection.","Law-enforcement and administrative processes address alleged offences.","Rehabilitation and education support aim to prevent renewed exploitation."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-india-eu-fta-belgium-dialogue',
  '2026-09-05',
  'India-EU FTA dialogue: reading a trade agreement beyond tariffs alone',
  'At an India-Belgium dialogue in Mumbai, the Commerce and Industry Minister described opportunities associated with the India-European Union free-trade agreement for sectors such as agriculture, MSMEs, manufacturing, services and investment. The remarks placed the agreement in the context of market access, supply chains and India-Belgium economic links.',
  'This is an Economy and International Relations theme. A free-trade agreement is not simply a list of lower customs duties: it can also involve rules of origin, services, investment, standards, mobility and implementation procedures. Students should distinguish political announcements and negotiations from the legal entry into force of an agreement.',
  'The European Union is a political and economic union of 27 member states. An FTA is an agreement under which participating economies reduce or remove trade barriers on agreed terms; sensitive products may receive different treatment. Rules of origin determine whether a product qualifies for preferential tariff treatment. Belgium’s Port of Antwerp-Bruges is a major European port and logistics hub, but a port’s commercial importance is distinct from the legal provisions of an FTA.',
  'Ministry of Commerce and Industry / PIB: India-EU FTA opportunities at India-Belgium dialogue',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306782&lang=1&reg=3',
  'Ministry of Commerce and Industry / Press Information Bureau',
  '2026-09-04',
  '["The European Union has 27 member states.", "An FTA can address tariffs as well as non-tariff rules, services and investment-related issues.", "Rules of origin help determine whether a product qualifies for a preferential tariff under an agreement.", "Announcement of opportunities is different from a treaty’s legal entry into force and implementation." ]'::jsonb,
  '[{"question":"What is the purpose of a rule of origin in an FTA?","answer":"It determines whether a product is sufficiently connected to a participating economy to receive the agreement’s preferential tariff treatment."},{"question":"Why are tariffs not the only issue in an FTA?","answer":"Trade is also shaped by standards, customs processes, services rules, investment conditions and other non-tariff measures."}]'::jsonb,
  '{"title":"How an FTA can affect a trading firm","steps":["The agreement sets eligible tariff and market-access commitments.","A product must meet relevant rules of origin and other conditions.","Customs, standards and logistics affect whether trade can use the preference in practice.","Firms decide whether the new market conditions make trade or investment viable."]}'::jsonb,
  'published', now()
),
(
  '2026-09-05-caqm-nuh-industrial-inspection-air-pollution',
  '2026-09-05',
  'CAQM inspection in Nuh: monitoring industrial sources of NCR air pollution',
  'The Commission for Air Quality Management in NCR and Adjoining Areas conducted a special industrial inspection in Nuh, Haryana, with the state pollution-control board and local administration. Of 35 units inspected, 17 were reported non-compliant, 11 compliant and 7 closed or non-operational at the time of inspection.',
  'This is a useful Environment and Governance case because it makes air-pollution control concrete: standards need on-ground inspection, emission-control equipment, monitoring and enforcement. The figures describe one inspection drive and should not be generalised to all industries in the NCR.',
  'CAQM is the Commission for Air Quality Management in the National Capital Region and Adjoining Areas. Industrial pollution can include stack emissions, fugitive dust and emissions from fuel use or diesel generator sets. A wet scrubber and an electrostatic precipitator are air-pollution-control devices. Consent to Operate is an approval under which a unit is expected to meet applicable conditions; an inspection finding is an enforcement input, not a final court judgment.',
  'Ministry of Environment, Forest and Climate Change / PIB: CAQM industrial inspection in Nuh',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306808&lang=1&reg=3',
  'Commission for Air Quality Management / Press Information Bureau',
  '2026-09-04',
  '["CAQM stands for Commission for Air Quality Management in NCR and Adjoining Areas.", "The Nuh inspection covered 35 industrial units or premises.", "The release reported 17 non-compliant units, 11 compliant units and 7 closed or non-operational units.", "Wet scrubbers and electrostatic precipitators are devices used to control air-pollution emissions in appropriate industrial settings."]'::jsonb,
  '[{"question":"What is fugitive dust?","answer":"It is particulate matter that escapes into the air from sources other than a controlled stack, such as roads, material handling or uncovered surfaces."},{"question":"Why is a field inspection important in pollution control?","answer":"It checks whether equipment, permits and operational practices are actually complying on the ground, rather than relying only on paperwork."}]'::jsonb,
  '{"title":"From pollution standard to enforcement","steps":["An industrial unit must meet applicable emission and operating conditions.","Authorities inspect equipment, fuel use, dust control and monitoring arrangements.","Non-compliance is documented for corrective or enforcement action by the competent agencies.","Follow-up inspection and monitoring test whether conditions improve."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  why_it_matters = excluded.why_it_matters,
  background = excluded.background,
  source_title = excluded.source_title,
  source_url = excluded.source_url,
  source_publisher = excluded.source_publisher,
  source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways,
  quick_check = excluded.quick_check,
  visual_data = excluded.visual_data,
  status = excluded.status,
  reviewed_at = excluded.reviewed_at,
  updated_at = now();

insert into public.current_affairs_exam_tags (brief_id, exam_id)
select briefs.id, exams.id
from public.current_affairs_briefs briefs
cross join public.exams exams
where briefs.slug in (
  '2026-09-05-gslv-f17-eos-05-geostationary-imaging',
  '2026-09-05-sebi-esma-central-counterparty-mou',
  '2026-09-05-india-france-space-cooperation',
  '2026-09-05-geothermal-energy-india-policy-and-puga-wells',
  '2026-09-05-ncpcr-child-labour-rescue-rehabilitation',
  '2026-09-05-india-eu-fta-belgium-dialogue',
  '2026-09-05-caqm-nuh-industrial-inspection-air-pollution'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
