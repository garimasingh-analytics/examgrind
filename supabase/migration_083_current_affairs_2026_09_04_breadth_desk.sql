-- 4 September 2026 expanded current-affairs desk.
-- Each entry has a checked primary release and an original teaching layer.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-04-bio-nivesh-biotech-investment-platform',
  '2026-09-04',
  'BIO-NIVESH: connecting biotechnology innovations with investment for scale-up',
  $$The Department of Biotechnology launched BIO-NIVESH as a platform intended to connect biotechnology innovators and startups with investors, with the stated aim of helping promising technologies move towards translation, scale-up and commercialisation. The inaugural roundtable brought together selected startups and investors; the release describes the platform as recurring rather than a one-off grant scheme.$$,
  $$This is useful for Science and Technology as well as Economy. It lets students distinguish scientific discovery from technology translation: a laboratory result may still need validation, regulatory readiness, manufacturing capability and suitable finance before it reaches wider use.$$,
  $$Biotechnology uses living systems, cells or biological processes to develop products and technologies. Technology translation is the process of moving a research outcome towards application; commercialisation is the stage at which an innovation is developed for market use. A platform that links innovators and investors can reduce the gap between research, capital and manufacturing, but a launch does not by itself guarantee funding or a successful product.$$,
  'PIB: BIO-NIVESH launched to catalyse investment and scale-up of biotechnology innovations',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306405&lang=2&reg=48',
  'Department of Biotechnology / Press Information Bureau',
  '2026-09-03',
  '["BIO-NIVESH is designed as an innovation-investor engagement platform for biotechnology.", "Technology translation connects research with real-world development and scale-up.", "Commercialisation requires more than an idea: finance, development, manufacturing and regulatory readiness can all matter.", "The source describes BIO-NIVESH as a recurring platform."]'::jsonb,
  '[{"question":"What is technology translation?","answer":"It is the process of moving a research outcome towards a usable product, process or service."}]'::jsonb,
  '{"title":"From laboratory idea to wider use","steps":["Researchers and startups develop a biotechnology innovation.","Evidence, regulatory readiness and a development plan are strengthened.","Investors and partners can provide capital and commercial support.","The technology is scaled towards manufacturing or wider application."]}'::jsonb,
  'published', now()
),
(
  '2026-09-04-gem-recycled-upcycled-textiles',
  '2026-09-04',
  'GeM and Textiles Committee link recycled textiles with public procurement',
  $$Government e Marketplace and the Textiles Committee signed an MoU to promote recycled and upcycled textile products made from textile waste, scrap and second-hand clothes through government procurement. The arrangement assigns the Textiles Committee roles in producer recognition and product standards, while GeM will create categories, support onboarding and link eligible sellers with public buyers.$$,
  $$This connects Environment, Economy and governance. Public procurement is not only an administrative purchase process: when quality standards and demand are built into it, it can influence market formation, circular-economy enterprises and livelihood opportunities.$$,
  $$A circular economy aims to retain materials in use for as long as possible through approaches such as reuse, repair, recycling and upcycling. Recycling processes material into usable inputs or products; upcycling aims to create a product of higher perceived value or utility. GeM is the Government e Marketplace, a digital procurement platform. Product standards and verification matter because public buyers need quality, safety and comparability alongside environmental claims.$$,
  'PIB: GeM and Textiles Committee Sign MoU to Boost Procurement of Recycled and Upcycled Textiles',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306567&lang=1&reg=3',
  'Government e Marketplace / Press Information Bureau',
  '2026-09-03',
  '["GeM stands for Government e Marketplace.", "The MoU covers recycled and upcycled products made from pre- and post-consumer textile material.", "The Textiles Committee is to identify, verify, certify and recognise eligible producers under the arrangement.", "Public procurement can help create demand for products that meet defined specifications."]'::jsonb,
  '[{"question":"Why are standards and verification important when governments procure recycled products?","answer":"They help buyers compare products and ensure that environmental claims do not replace quality and safety requirements."}]'::jsonb,
  '{"title":"Waste-to-value through procurement","steps":["Textile waste is collected and processed by eligible enterprises.","Products are assessed against relevant specifications.","Sellers are listed in dedicated GeM categories.","Government buyers can procure verified products, creating market demand."]}'::jsonb,
  'published', now()
),
(
  '2026-09-04-shg-bank-linkages-women-entrepreneurs',
  '2026-09-04',
  'SHG-bank linkages: a credit roadmap for women entrepreneurs under DAY-NRLM',
  $$A high-level review of Self-Help Group-bank linkages and individual enterprise financing under DAY-NRLM focused on delays, paperwork, low credit limits and branch-level barriers. The Ministry of Rural Development announced a roadmap that includes a helpline for loan-access difficulties and regular reviews; the targets described in the release are policy goals, not a newly enacted statutory entitlement.$$,
  $$For social-sector and economy preparation, the important idea is that financial inclusion is not exhausted by opening an account. Access to timely, suitable credit, fair processes and local support affects whether women-led groups can build viable enterprises.$$,
  $$A Self-Help Group is generally a small, member-based savings and mutual-support group, often used as a channel for financial inclusion and livelihoods work. The SHG-bank linkage approach connects such groups with formal banking. DAY-NRLM is the Deendayal Antyodaya Yojana-National Rural Livelihoods Mission. A policy announcement or review direction should be distinguished from a legal right or a disbursed loan.$$,
  'PIB: Shri Shivraj Singh Chouhan Reviews SHG-Bank Linkages, Lays Out Credit Roadmap for Women Entrepreneurs',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306481&lang=2&reg=48',
  'Ministry of Rural Development / Press Information Bureau',
  '2026-09-03',
  '["DAY-NRLM stands for Deendayal Antyodaya Yojana-National Rural Livelihoods Mission.", "SHG-bank linkage seeks to connect member groups with formal credit and banking services.", "The review identified loan delays, paperwork, low credit limits and branch-level difficulties as practical barriers.", "The announced helpline is intended to address difficulties faced by SHG members in accessing loans."]'::jsonb,
  '[{"question":"Why is an SHG-bank linkage programme more than a savings programme?","answer":"It aims to connect member groups with formal credit and banking support that can finance livelihood and enterprise activity."}]'::jsonb,
  '{"title":"From group saving to enterprise credit","steps":["Members organise through a Self-Help Group.","The group builds savings, records and collective capacity.","A bank evaluates and provides suitable financial services or credit.","Members use finance for livelihoods, enterprises or other approved purposes, with follow-up support."]}'::jsonb,
  'published', now()
),
(
  '2026-09-04-glof-avalanche-preparedness',
  '2026-09-04',
  'GLOF and avalanche readiness: why Himalayan disaster planning begins before an emergency',
  $$The Union Home Secretary reviewed preparedness of Himalayan States and Union Territories for Glacial Lake Outburst Floods and snow avalanches, including the progress of mitigation projects sanctioned in 2024. A separate Sikkim government workshop on the same day highlighted lake monitoring, scientific studies and state-specific mitigation proposals. Together, the updates underline prevention, monitoring and last-mile warning rather than response alone.$$,
  $$This is a strong Geography, Environment and Disaster Management theme. It rewards a precise answer: a GLOF is a particular hazard involving the sudden release of water from a glacial lake; it should not be used as a loose label for every Himalayan flood.$$,
  $$A Glacial Lake Outburst Flood, or GLOF, occurs when water impounded by a moraine, ice dam or another natural barrier is released suddenly after the barrier fails or is overtopped. Snow avalanches are rapid downslope movements of snow, often with ice and debris. Risk reduction can include hazard mapping, monitoring, warning systems, evacuation planning, resilient infrastructure and community preparedness. These measures complement emergency response; they do not eliminate all risk.$$,
  'PIB: Central Home Secretary reviews preparedness for GLOF and snow avalanches in Himalayan States/UTs',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306292&lang=2&reg=3',
  'Ministry of Home Affairs / Press Information Bureau',
  '2026-09-03',
  '["GLOF stands for Glacial Lake Outburst Flood.", "A GLOF is distinct from a cloudburst flood or an ordinary river flood, although impacts can overlap.", "Avalanche risk and GLOF risk require location-specific monitoring and preparedness.", "Risk reduction includes warning, evacuation planning, mitigation and community preparedness."]'::jsonb,
  '[{"question":"What is the defining feature of a GLOF?","answer":"A sudden release of water stored in a glacial lake after a natural barrier fails or is overtopped."}]'::jsonb,
  '{"title":"Turning mountain-hazard knowledge into preparedness","steps":["Scientific agencies identify vulnerable glacial lakes and avalanche-prone areas.","Authorities assess hazard, exposure and possible downstream impacts.","Warning, evacuation and mitigation plans are prepared with local communities.","Response agencies act when a warning or event occurs, then lessons inform future planning."]}'::jsonb,
  'published', now()
),
(
  '2026-09-04-cci-debenture-trustee-fee-fixing',
  '2026-09-04',
  'CCI’s debenture-trustee order: sectoral regulation does not remove competition scrutiny',
  $$The Competition Commission of India directed the Trustees’ Association of India and three debenture-trustee companies to cease anti-competitive conduct after finding contravention of the Competition Act in relation to benchmark pricing for trusteeship services. The Commission did not impose a monetary penalty, citing mitigating factors, but warned that any recurrence would have aggravated consequences.$$,
  $$This is a useful Economy, Polity and legal-governance case. It shows how competition law can examine conduct in a sector that is also regulated by another authority. The exam point is institutional complementarity: sectoral regulation and competition oversight can address different problems.$$,
  $$A debenture is a debt instrument through which an issuer borrows money; a non-convertible debenture does not convert into shares. A debenture trustee is appointed to protect the interests of debenture holders under the relevant framework. The Competition Act prohibits certain anti-competitive agreements, including collective price-fixing. A cease-and-desist direction orders parties to stop the prohibited conduct. A finding of contravention does not automatically require a monetary penalty in every case.$$,
  'Competition Commission of India: trusteeship entities directed to cease anti-competitive conduct',
  'https://www.cci.gov.in/antitrust/press-release/details/693',
  'Competition Commission of India',
  '2026-09-02',
  '["CCI is the Competition Commission of India.", "A non-convertible debenture is a debt instrument that does not convert into equity shares.", "Collective price-fixing can fall within competition-law scrutiny.", "A cease-and-desist direction requires the identified conduct to stop; it is distinct from a monetary penalty."]'::jsonb,
  '[{"question":"Why can competition law apply even where a sector has a specialised regulator?","answer":"Sectoral regulation and competition law can address different concerns; the existence of one regulator does not automatically exclude competition scrutiny."}]'::jsonb,
  '{"title":"Two oversight lenses in a financial market","steps":["Issuers use debt instruments and appoint required service providers.","A sectoral regulator sets the relevant securities-market framework.","Competition law examines whether market participants coordinate in ways that restrict competition.","A regulator or commission can order corrective action when it finds a contravention."]}'::jsonb,
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
  '2026-09-04-bio-nivesh-biotech-investment-platform',
  '2026-09-04-gem-recycled-upcycled-textiles',
  '2026-09-04-shg-bank-linkages-women-entrepreneurs',
  '2026-09-04-glof-avalanche-preparedness',
  '2026-09-04-cci-debenture-trustee-fee-fixing'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
