-- 11 September 2026 daily current-affairs desk.
-- Original revision briefs based on primary official releases published on 10 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-11-ecommerce-amendment-rules-2026',
  '2026-09-11',
  'E-commerce Rules amended: clearer search, price and disclosure duties from 2027',
  'The Department of Consumer Affairs has amended the Consumer Protection (E-Commerce) Rules, 2020 through the Consumer Protection (E-Commerce) (Amendment) Rules, 2026. The new provisions take effect on 1 January 2027 and add duties on complaint records, search-result integrity, sponsored listings, price-reduction displays, dark-pattern compliance and marketplace disclosures.',
  'This is a high-yield consumer-protection and digital-governance item. It tests the legal chain—Consumer Protection Act, 2019 to the 2020 Rules to the 2026 amendments—and distinguishes a notified rule with a future commencement date from a requirement already in force today.',
  'The 2020 Rules are the e-commerce framework made under the Consumer Protection Act, 2019. The 2026 amendments require e-commerce entities to participate in the National Consumer Helpline convergence process and require, among other measures, non-misleading search results and clear sponsored-listing labels. For an advertised price reduction, the displayed prior price must be the lowest price offered in the preceding 30 days. Marketplace entities must also disclose specified product, seller and imported-goods information. The release says the amended Rules begin on 1 January 2027.',
  'Government amends E-Commerce Rules to strengthen consumer protection and promote transparency',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308759&reg=3&lang=1',
  'Department of Consumer Affairs / Press Information Bureau',
  '2026-09-10',
  '["The Consumer Protection (E-Commerce) (Amendment) Rules, 2026 amend the Consumer Protection (E-Commerce) Rules, 2020, which were made under the Consumer Protection Act, 2019.", "The amendments are stated to come into force on 1 January 2027, so notification is not the same as present-day commencement.", "A promoted result must be clearly disclosed as a sponsored listing, and search results must not be manipulated to mislead users or reduce relevance.", "For a claimed price reduction, the prior price is the lowest price at which the item was offered in the preceding 30 days."]'::jsonb,
  '[{"question":"When do the 2026 e-commerce-rule amendments come into force?","answer":"On 1 January 2027, according to the official release."},{"question":"For a displayed price reduction, what is the relevant prior price?","answer":"The lowest price at which the goods or services were offered during the preceding 30 days."}]'::jsonb,
  '{"title":"From consumer law to online-marketplace safeguards","steps":["The Consumer Protection Act, 2019 provides the parent legal framework.","The 2020 E-Commerce Rules set duties for online commerce.","The 2026 amendments add transparency, grievance and disclosure safeguards.","From 1 January 2027, platforms must apply the amended framework in their operations."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-dilrmp-3-land-stack-guidelines',
  '2026-09-11',
  'DILRMP 3.0 guidelines set out a federated GIS-based Land Stack',
  'The Department of Land Resources launched the operational guidelines for the Digital India Land Records Modernisation Programme (DILRMP) 3.0. The central-sector scheme has an outlay of ₹565.50 crore for 2026–31 and envisages interoperable State Land Stacks, which together can form a federated National Land Stack.',
  'This joins land governance, Digital Public Infrastructure, cooperative federalism and rural development. The crucial distinction is that a federated Land Stack connects interoperable State systems while ownership and control of the data remain with the relevant authorities; it is not a single central title registry that by itself settles ownership disputes.',
  'DILRMP 3.0 moves from digitising separate land-record components towards connecting georeferenced cadastral maps, Records of Rights, property registrations and relevant court matters through GIS-based interfaces. The programme proposes a 14-digit Bhu-Aadhaar, or Unique Land Parcel Identification Number (ULPIN), for every land parcel, along with georeferencing of cadastral maps. It will be implemented across States and Union Territories through phased, performance-linked 100% central funding, using PFMS and an upgraded DILRMP-MIS for monitoring. The guidelines also propose modernising Sub-Registrar Offices as Registration Seva Kendras.',
  'Union Minister Shri Shivraj Singh Chouhan Launches Operational Guidelines for DILRMP 3.0',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308966&reg=3&lang=1',
  'Department of Land Resources, Ministry of Rural Development / Press Information Bureau',
  '2026-09-10',
  '["DILRMP 3.0 is a central-sector scheme with an official outlay of ₹565.50 crore for 2026–31.", "Its proposed Land Stack connects georeferenced cadastral maps, Records of Rights, registrations and relevant court matters through GIS-based interfaces.", "ULPIN, described as Bhu-Aadhaar in the release, is a 14-digit Unique Land Parcel Identification Number.", "The National Land Stack is envisaged as federated: State systems remain the building blocks and retain their respective data ownership and control."]'::jsonb,
  '[{"question":"Does the proposed National Land Stack transfer all State land-record ownership to the Union government?","answer":"No. The guidelines describe a federated model in which the concerned authorities retain ownership and control of their data."},{"question":"What does ULPIN stand for?","answer":"Unique Land Parcel Identification Number; the release describes it as a 14-digit Bhu-Aadhaar."}]'::jsonb,
  '{"title":"DILRMP 3.0: from records to interoperable land administration","steps":["States digitise and georeference key land-record layers.","State Land Stacks connect cadastral maps, records, registrations and related information through APIs.","Interoperable State systems form the federated National Land Stack.","PFMS and the upgraded DILRMP-MIS support phased performance-linked implementation and monitoring."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-nso-district-estimates-asuse-2025',
  '2026-09-11',
  'NSO releases its first district-level estimates for unincorporated enterprises',
  'The National Statistics Office has released district-level estimates for India’s unincorporated non-agricultural sector from the Annual Survey of Unincorporated Sector Enterprises (ASUSE) 2025. It is the first time NSO has disseminated district-level estimates from a large-scale nationwide enterprise survey.',
  'This is important for Indian economy, official statistics, women’s work and evidence-based local policy. Students should treat the figures as sample-survey estimates, not as a complete administrative count of every business, and should remember the release’s reliability caution.',
  'The report covers the scale, structure and economic performance of the unincorporated non-agricultural sector, including establishments, workers, ownership, women’s participation, registration, emoluments and Gross Value Added (GVA). It gives estimates for 757 of the 770 districts in the ASUSE 2025 sampling frame. The survey covers manufacturing, trade and other services; it is not an agricultural-sector survey. The release notes that boundary changes can affect comparability and publishes Relative Standard Errors so users can assess statistical reliability.',
  'First-ever district-level estimates released by NSO for unincorporated non-agricultural sector',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308690&reg=3&lang=1',
  'National Statistics Office, Ministry of Statistics and Programme Implementation / Press Information Bureau',
  '2026-09-10',
  '["NSO’s district-level release is based on ASUSE 2025, the Annual Survey of Unincorporated Sector Enterprises.", "It covers unincorporated non-agricultural establishments in manufacturing, trade and other services.", "The report presents estimates for 757 of the 770 districts in the ASUSE 2025 sampling frame.", "The estimates are survey-based; users should consider Relative Standard Errors and changes in district boundaries when interpreting them."]'::jsonb,
  '[{"question":"Does this NSO report measure the agricultural sector?","answer":"No. It concerns the unincorporated non-agricultural sector, covering manufacturing, trade and other services."},{"question":"Why are Relative Standard Errors supplied with the estimates?","answer":"They indicate statistical reliability and help users judge how cautiously an estimate should be interpreted."}]'::jsonb,
  '{"title":"How ASUSE becomes district-level economic evidence","steps":["NSO conducts the large-scale ASUSE 2025 sample survey.","Survey responses are used to estimate establishments, workers and economic indicators.","NSO publishes district-level estimates with coverage and reliability notes.","Governments and researchers can compare local patterns while accounting for sampling uncertainty."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-sebi-demat-2-tokenised-corporate-bonds',
  '2026-09-11',
  'SEBI–RBI launch Demat 2.0 pilot for tokenised corporate bonds',
  'SEBI has announced Demat 2.0, a pilot for issuing, holding, trading and settling corporate bonds as digital tokens on a distributed ledger. It connects the bonds to RBI’s wholesale CBDC, e₹, through the Unified Market Interface to enable atomic settlement.',
  'This is a financial-market-infrastructure and CBDC item. The exam-safe wording is “pilot”: it tests technology under existing regulated infrastructure. It does not create a new legal class of bond, replace investor safeguards or make a separate demat account necessary for participation.',
  'In the pilot, statutory depositories own the distributed ledger’s ownership record. Atomic settlement means the security and funds legs move together, reducing the risk that one side settles without the other. Smart contracts can automate coupon and redemption servicing into participating bondholders’ CBDC wallets. SEBI says three issuers had raised an aggregate ₹1,025 crore in the first phase. Later phases are intended to extend to buying and selling through existing RFQ platforms and eventually retail access; the experience will guide any broader rollout.',
  'Successful launch of “Demat 2.0” Pilot project for Tokenised Corporate Bonds',
  'https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2026/successful-launch-of-demat-2-0-pilot-project-for-tokenised-corporate-bonds_104418.html',
  'Securities and Exchange Board of India',
  '2026-09-10',
  '["Demat 2.0 is a SEBI pilot for tokenisation of corporate bonds on a distributed ledger owned by statutory depositories.", "It uses RBI’s wholesale CBDC, e₹, through the Unified Market Interface (UMI) for atomic settlement.", "Atomic settlement moves the bond and funds legs together; it is intended to reduce settlement risk.", "The legal bond, investor rights, credit-rating, debenture-trustee, listing and disclosure requirements remain unchanged in the pilot."]'::jsonb,
  '[{"question":"Does Demat 2.0 turn a corporate bond into a new legal instrument with weaker investor safeguards?","answer":"No. SEBI says the bond remains the same instrument in law and the existing investor safeguards and regulatory requirements continue."},{"question":"What is atomic settlement in the Demat 2.0 context?","answer":"The simultaneous movement of the bond and the funds leg, so one side does not remain pending after the other settles."}]'::jsonb,
  '{"title":"Demat 2.0: tokenised bond settlement pathway","steps":["A corporate bond is recorded as a digital token on the depository-owned distributed ledger.","The investor’s existing demat account holds the tokenised bond in the pilot.","RBI wholesale CBDC connects the funds leg through UMI.","Atomic settlement and smart contracts support simultaneous settlement and automated servicing within the pilot."]}'::jsonb,
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
  '2026-09-11-ecommerce-amendment-rules-2026',
  '2026-09-11-dilrmp-3-land-stack-guidelines',
  '2026-09-11-nso-district-estimates-asuse-2025',
  '2026-09-11-sebi-demat-2-tokenised-corporate-bonds'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
