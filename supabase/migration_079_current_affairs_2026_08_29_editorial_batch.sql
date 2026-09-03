-- Source-backed current-affairs backfill: 29 August 2026.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-08-29-pmfby-crop-insurance',
  '2026-08-29',
  'PMFBY: crop insurance as a climate-resilience tool',
  'PIB outlined the Pradhan Mantri Fasal Bima Yojana (PMFBY), including coverage for specified crop losses and the use of technology-enabled systems to support yield estimation and weather information. The 2026–27 Budget allocation mentioned in the release was ₹12,200 crore.',
  'Agriculture questions often test the difference between income support, price support, irrigation support and crop insurance. PMFBY belongs primarily in the risk-management and climate-resilience bucket: it addresses specified crop-loss risks, not a guaranteed market price for every crop.',
  'PMFBY is a crop-insurance scheme launched in 2016. Crop insurance pools risk: eligible farmers pay a premium under scheme rules, while insurers and governments share the wider risk according to the operational framework. Technology can improve assessment, but claims remain governed by notified procedures and coverage conditions.',
  'PIB Backgrounder: Pradhan Mantri Fasal Bima Yojana',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304549&lang=1&reg=48',
  'Press Information Bureau',
  '2026-08-29',
  '["PMFBY stands for Pradhan Mantri Fasal Bima Yojana.", "It is a crop-insurance scheme, distinct from an MSP or direct-income-support programme.", "The PIB brief lists risks such as drought, flood, cyclone, pests, diseases and specified post-harvest losses under applicable coverage.", "YES-TECH and WINDS are technology-linked initiatives cited in the PIB brief."]'::jsonb,
  '[{"question":"Is PMFBY primarily a crop-insurance scheme or a minimum-price scheme?","answer":"It is primarily a crop-insurance scheme."},{"question":"Why is crop insurance relevant to climate resilience?","answer":"It can help manage specified financial losses from weather and other covered crop risks."}]'::jsonb,
  '{"title":"From weather shock to risk support","steps":["A farmer faces a specified production or weather risk.","The crop is insured under applicable scheme conditions.","Loss assessment uses notified procedures and supporting information.","Eligible claims aim to reduce the financial shock to farm livelihoods."]}'::jsonb,
  'published', now()
),
(
  '2026-08-29-per-drop-more-crop-micro-irrigation',
  '2026-08-29',
  'Per Drop More Crop: micro-irrigation and water-use efficiency',
  'A PIB note described the Per Drop More Crop component as support for micro-irrigation systems such as drip and sprinkler irrigation. The note links the programme to farm-level water efficiency, digital implementation and direct-benefit transfer.',
  'This is a high-yield agriculture–environment topic. Do not reduce it to a slogan: the exam logic is water-use efficiency, the difference between drip and sprinkler systems, Centre–State scheme design, and the link between irrigation, productivity and climate adaptation.',
  'Micro-irrigation supplies water close to the crop root zone or in a controlled pattern, reducing losses compared with less targeted methods in suitable contexts. Per Drop More Crop evolved through multiple agricultural-programme frameworks and is implemented under the current applicable programme architecture.',
  'PIB: Water-Smart Farming with Per Drop More Crop',
  'https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159757&lang=1&reg=48',
  'Press Information Bureau',
  '2026-08-29',
  '["Micro-irrigation includes drip and sprinkler systems.", "Drip irrigation delivers water in a controlled manner near the root zone.", "Per Drop More Crop focuses on improving water-use efficiency at farm level.", "The scheme is relevant to sustainable agriculture, not only to irrigation engineering."]'::jsonb,
  '[{"question":"Name two micro-irrigation systems mentioned in the PIB brief.","answer":"Drip irrigation and sprinkler irrigation."},{"question":"What is the central purpose of micro-irrigation?","answer":"To improve farm-level water-use efficiency by applying water in a more controlled way."}]'::jsonb,
  '{"title":"Efficient irrigation at farm level","steps":["Assess crop, soil and local water conditions.","Install a suitable micro-irrigation system.","Apply water in a controlled pattern near crops.","Reduce avoidable losses while supporting crop productivity."]}'::jsonb,
  'published', now()
),
(
  '2026-08-29-textile-research-associations',
  '2026-08-29',
  'Textile Research Associations: connecting research, industry and technical textiles',
  'The Ministry of Textiles held a coordination meeting with Textile Research Associations to strengthen outcome-oriented research, industry links, technology development, standardisation, centres of excellence and the technical-textiles ecosystem.',
  'Textiles are useful for economy, manufacturing, employment and science-policy questions. The key lesson is how a sectoral research ecosystem works: public institutions, industry, testing, standards, skills, startups and commercialisation must connect for research to become usable technology.',
  'Textile Research Associations are sector-focused research bodies. Technical textiles are materials designed chiefly for functional performance rather than only appearance, with applications in areas such as health, transport, construction, agriculture and protective equipment.',
  'PIB: Ministry of Textiles convenes 2nd Coordination Committee Meeting of Textile Research Associations',
  'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2304568&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-29',
  '["Textile Research Associations are linked to sector-specific research and technology development.", "Technical textiles are designed for functional performance.", "Standardisation and testing help a technology move from research to adoption.", "Commercialisation connects prototypes and patents with practical market use."]'::jsonb,
  '[{"question":"What distinguishes a technical textile from a purely fashion textile?","answer":"Its primary purpose is functional performance in a specific application."},{"question":"Why are standards and testing important in research commercialisation?","answer":"They help demonstrate quality, safety and suitability for practical use."}]'::jsonb,
  '{"title":"From textile research to adoption","steps":["Researchers identify a sectoral problem or opportunity.","Institutions develop and test a material or technology.","Standards, trials and industry feedback improve readiness.","Firms can adopt, scale and commercialise suitable innovations."]}'::jsonb,
  'published', now()
),
(
  '2026-08-29-india-uzbekistan-kyrgyzstan-visit',
  '2026-08-29',
  'India’s Central Asia outreach: Uzbekistan, Kyrgyz Republic and the SCO context',
  'Ahead of the Prime Minister’s visit to Uzbekistan and the Kyrgyz Republic, the departure statement highlighted cooperation with Uzbekistan in trade, investment, digital connectivity, defence and energy, followed by engagement with the Kyrgyz Republic and SCO leaders.',
  'Central Asia is a recurring international-relations theme because of connectivity, energy, security, regional organisations and India’s historical people-to-people links. Treat a visit as a way to map the relationship, not merely as a diary event.',
  'Uzbekistan and the Kyrgyz Republic are Central Asian states. India and Uzbekistan have a Strategic Partnership. The Shanghai Cooperation Organisation is a Eurasian political, economic and security grouping; India became a full member in 2017.',
  'PIB: Text of PM’s Departure Statement ahead of visit to Uzbekistan and Kyrgyz Republic',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304461&lang=1&reg=3',
  'Press Information Bureau',
  '2026-08-29',
  '["Uzbekistan and the Kyrgyz Republic are in Central Asia.", "India and Uzbekistan have a Strategic Partnership.", "India became a full member of the Shanghai Cooperation Organisation in 2017.", "Central Asia matters to India for connectivity, energy, security and wider Eurasian engagement."]'::jsonb,
  '[{"question":"Which regional organisation is frequently associated with India’s engagement with Central Asia?","answer":"The Shanghai Cooperation Organisation (SCO)."},{"question":"Name two areas of India–Uzbekistan cooperation highlighted in the PIB statement.","answer":"Any two: trade and investment, digital connectivity, defence or energy."}]'::jsonb,
  '{"title":"A Central Asia engagement map","steps":["Bilateral visits build direct political and economic ties.","Trade, energy, defence and connectivity create practical cooperation areas.","Regional organisations add a multilateral forum.","Cultural links and people-to-people exchanges support long-term relationships."]}'::jsonb,
  'published', now()
),
(
  '2026-08-29-national-sports-day-major-dhyan-chand',
  '2026-08-29',
  'National Sports Day: remembering Major Dhyan Chand',
  'India observes National Sports Day on 29 August in honour of hockey legend Major Dhyan Chand. A PIB release from the National Institute of Sports, Patiala marked the occasion and recalled his contribution to Indian sport.',
  'This is a clean static-GK plus current-affairs recall item. Remembering the date together with the person is more useful than memorising the event alone; questions may also connect sports observances with institutions that promote coaching and sports science.',
  'Major Dhyan Chand was an Indian hockey player widely remembered for his achievements in the sport. The National Institute of Sports at Patiala is a prominent sports-training institution and is now associated with the Netaji Subhas National Institute of Sports name.',
  'PIB: National Sports Day Celebration at Netaji Subhas National Institute of Sports, Patiala',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304768&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-29',
  '["National Sports Day in India is observed on 29 August.", "It honours Major Dhyan Chand.", "Major Dhyan Chand is associated with hockey.", "Netaji Subhas National Institute of Sports is located at Patiala, Punjab."]'::jsonb,
  '[{"question":"On which date is National Sports Day observed in India?","answer":"29 August."},{"question":"National Sports Day honours which hockey legend?","answer":"Major Dhyan Chand."}]'::jsonb,
  '{"title":"A date–person–institution recall chain","steps":["29 August is the observance date.","The day honours Major Dhyan Chand.","He is associated with hockey.","NIS Patiala connects the observance with sports training and coaching."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, why_it_matters = excluded.why_it_matters,
  background = excluded.background, source_title = excluded.source_title, source_url = excluded.source_url,
  source_publisher = excluded.source_publisher, source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways, quick_check = excluded.quick_check,
  visual_data = excluded.visual_data, status = excluded.status, reviewed_at = excluded.reviewed_at, updated_at = now();
