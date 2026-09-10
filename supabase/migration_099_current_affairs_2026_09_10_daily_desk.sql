-- 10 September 2026 daily current-affairs desk.
-- Original revision briefs based on primary official releases published on 9 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-10-ccea-eastern-central-rail-multitracking',
  '2026-09-10',
  'CCEA clears three rail multi-tracking projects across five States',
  'The Cabinet Committee on Economic Affairs approved three Ministry of Railways multi-tracking projects across West Bengal, Jharkhand, Odisha, Madhya Pradesh and Chhattisgarh. The projects have an estimated cost of ₹10,783 crore and are planned for completion by 2029–30.',
  'This is relevant to infrastructure, logistics, PM Gati Shakti and environmental economics. The exam distinction is that CCEA approval authorises the projects; it is not the same as a completed rail line or an immediate expansion of passenger services.',
  'Multi-tracking adds rail capacity through works such as additional lines, doubling or other line-capacity improvements. According to the release, this package covers 14 districts, adds about 656 km to the rail network and is expected to support about 27 million tonnes per annum of additional freight. The proposals are planned under the PM Gati Shakti National Master Plan, which aims at integrated multimodal connectivity and logistics planning.',
  'Cabinet approves three multitracking projects covering 14 districts across five States',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308255&reg=3&lang=1',
  'Cabinet Committee on Economic Affairs / Press Information Bureau',
  '2026-09-09',
  '["The CCEA approved three Ministry of Railways multi-tracking projects worth ₹10,783 crore.", "The package covers West Bengal, Jharkhand, Odisha, Madhya Pradesh and Chhattisgarh, across 14 districts.", "It is planned to add about 656 km of rail-network capacity and be completed by 2029–30.", "The release places the projects within the PM Gati Shakti National Master Plan."]'::jsonb,
  '[{"question":"Does CCEA approval mean that every project in this package has already been completed?","answer":"No. It approves the projects; the official release says they are planned for completion by 2029–30."},{"question":"What is the main transport purpose of multi-tracking?","answer":"To increase line capacity, reduce congestion and improve the movement of passengers and freight."}]'::jsonb,
  '{"title":"From CCEA approval to rail capacity","steps":["CCEA approves the identified rail-capacity projects.","Projects are planned through integrated PM Gati Shakti logistics and connectivity processes.","Multi-tracking expands capacity on busy rail corridors.","Higher capacity can support more reliable passenger movement and freight logistics."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-ccea-southern-rail-multitracking',
  '2026-09-10',
  'CCEA approves five rail multi-tracking projects in four southern States',
  'The Cabinet Committee on Economic Affairs approved five Ministry of Railways multi-tracking projects in Tamil Nadu, Andhra Pradesh, Karnataka and Telangana. The official release puts the approximate cost at ₹10,021 crore and the planned completion horizon at 2029–30.',
  'This is a useful infrastructure-and-geography item because it links corridor capacity, freight logistics and regional connectivity. Do not merge it with the separate three-project CCEA package announced the same day: the State group, number of projects and cost are different.',
  'The five projects cover 17 districts and are expected to add about 540 km to the existing Indian Railways network. The release estimates that they will improve connectivity for roughly 2,121 villages and enable an additional 47 million tonnes per annum of freight traffic. It identifies PM Gati Shakti planning and improved multimodal logistics as the framework for the proposals.',
  'Cabinet approves five multitracking projects covering 17 districts across four States',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308264&reg=3&lang=1',
  'Cabinet Committee on Economic Affairs / Press Information Bureau',
  '2026-09-09',
  '["The CCEA approved five rail multi-tracking projects with an approximate cost of ₹10,021 crore.", "The States are Tamil Nadu, Andhra Pradesh, Karnataka and Telangana.", "The projects cover 17 districts and are planned to add about 540 km to the rail network.", "The release estimates additional freight capacity of 47 MTPA, where MTPA means million tonnes per annum."]'::jsonb,
  '[{"question":"Which four States are covered by this five-project CCEA rail package?","answer":"Tamil Nadu, Andhra Pradesh, Karnataka and Telangana."},{"question":"What does MTPA stand for in the freight estimate?","answer":"Million tonnes per annum."}]'::jsonb,
  '{"title":"Southern rail-capacity package","steps":["CCEA approves five capacity-enhancement projects.","The projects span 17 districts in four States.","Additional track capacity eases corridor congestion and supports freight movement.","The planned works contribute to multimodal connectivity and logistics efficiency."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-india-6g-leadership-security-call-to-action',
  '2026-09-10',
  'India endorses the Call to Action for 6G Leadership and Security',
  'India endorsed the international Call to Action for 6G Leadership and Security, which centres on open, interoperable, secure and resilient next-generation networks. The Department of Telecommunications will coordinate India’s follow-up with government agencies, industry, academia and other stakeholders.',
  'This connects international cooperation, telecom policy, cyber security and technology standards. It is an endorsement and coordination commitment, not a treaty that transfers India’s authority over telecom standards or spectrum policy.',
  '6G refers to the next generation of wireless communications beyond 5G. The Call to Action envisages early coordination on expert points of contact, stakeholder mapping and the policy conditions for secure, resilient and innovative 6G supply chains. The PIB release says India’s participation builds on the Bharat 6G Vision, Bharat 6G Alliance and its indigenous 4G/5G technology stack, while preserving independent national positions in standards forums.',
  'India endorses the Call to Action for 6G Leadership and Security',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308285&reg=3&lang=1',
  'Department of Telecommunications / Press Information Bureau',
  '2026-09-09',
  '["India endorsed the Call to Action for 6G Leadership and Security; DoT will coordinate its follow-up.", "The stated principles include openness, interoperability, security and resilience for next-generation networks.", "The release links India’s engagement with the Bharat 6G Vision and Bharat 6G Alliance.", "The Call to Action does not bind a participating government to surrender its independent position in industry-led standards bodies."]'::jsonb,
  '[{"question":"Does endorsing the 6G Call to Action itself create a binding telecom treaty for India?","answer":"No. The release expressly says participation does not limit a government’s independent positioning in industry-driven standards bodies."},{"question":"Which department will coordinate India’s follow-up?","answer":"The Department of Telecommunications (DoT)."}]'::jsonb,
  '{"title":"India’s 6G cooperation pathway","steps":["India endorses shared principles for secure and interoperable 6G.","DoT coordinates engagement with public, industry and academic stakeholders.","Participants map technical, supply-chain and security issues.","International cooperation supports standards work while national positions remain independent."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-uidai-face-authentication-sdk-sandbox',
  '2026-09-10',
  'UIDAI releases Aadhaar face-authentication SDK and testing sandbox',
  'UIDAI launched an Aadhaar Face Authentication software development kit (SDK) and a controlled sandbox at Global Fintech Fest 2026. The tools let authorised ecosystem partners integrate and test face-authentication journeys in their own digital applications before production onboarding.',
  'This is an important Digital Public Infrastructure, identity and fintech update. The SDK is a developer-integration tool, while the sandbox is a safe testing environment; neither changes the need for lawful onboarding, consent and authentication controls.',
  'The SDK brings UIDAI’s face-authentication capability into native Android and iOS apps and uses liveness and anti-spoofing features. The sandbox supports testing of stages such as consent, face capture, liveness checks, authentication, error handling and response validation, including test failure scenarios. UIDAI says its face-authentication solution, launched in 2021, has processed more than 500 crore transactions and has been adopted by nearly 200 entities.',
  'UIDAI launches Aadhaar Face Authentication SDK and Sandbox at Global Fintech Fest 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308398&reg=3&lang=1',
  'Unique Identification Authority of India / Press Information Bureau',
  '2026-09-09',
  '["UIDAI launched both an Aadhaar Face Authentication SDK and a Face Authentication Sandbox.", "The SDK supports integration into native Android and iOS applications.", "The sandbox is for controlled integration and validation before production onboarding.", "The release identifies AI/ML-based liveness and anti-spoofing as SDK capabilities."]'::jsonb,
  '[{"question":"What is the key difference between UIDAI’s new SDK and its sandbox?","answer":"The SDK helps an application integrate face authentication; the sandbox is the controlled setting for testing and validating that integration before production."},{"question":"Is a sandbox a public live-authentication service?","answer":"No. It is a controlled pre-production testing environment."}]'::jsonb,
  '{"title":"From app integration to verified face authentication","steps":["An authorised organisation integrates the SDK into its Android or iOS app.","Its teams use the sandbox to test consent, capture, liveness, responses and errors.","The organisation completes the required onboarding and production validation.","Users can authenticate within the organisation’s own app rather than switching apps for the face-authentication step."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-orv-sagar-manthan-deep-ocean-mission',
  '2026-09-10',
  'ORV Sagar Manthan launched for Deep Ocean Mission research',
  'India launched ORV Sagar Manthan, an advanced ocean research vessel being built by Garden Reach Shipbuilders & Engineers for the National Centre for Polar and Ocean Research under the Ministry of Earth Sciences. The vessel is being developed under the Deep Ocean Survey and Exploration vertical of the Deep Ocean Mission.',
  'This is relevant to oceanography, blue economy, disaster preparedness, strategic maritime capability and indigenous shipbuilding. A launch puts the vessel into the water for the next construction stage; it does not mean that it has been delivered or commissioned for research operations.',
  'The all-weather, multidisciplinary vessel is intended for work including seafloor mapping, geophysical profiling, atmospheric observations and water-column sampling. The official release says it is designed for extreme environments including the Southern Ocean and will support exploration along Indian Ocean mid-oceanic ridges. It is estimated to cost about ₹840 crore and is scheduled for final delivery to NCPOR/MoES in 2028 after integration and sea trials.',
  'India launches advanced ocean research vessel ORV Sagar Manthan',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308170&reg=3&lang=1',
  'Ministry of Earth Sciences / Press Information Bureau',
  '2026-09-09',
  '["ORV Sagar Manthan is being built by GRSE for NCPOR under the Ministry of Earth Sciences.", "It falls under Vertical-4, Deep Ocean Survey and Exploration, of the Deep Ocean Mission.", "The vessel is designed for all-weather multidisciplinary research, including in the Southern Ocean.", "Its final delivery for commissioning is scheduled for 2028; launch is not commissioning."]'::jsonb,
  '[{"question":"Which mission includes the ORV Sagar Manthan project?","answer":"The Deep Ocean Mission, under its Deep Ocean Survey and Exploration vertical."},{"question":"Did the 9 September launch mean that ORV Sagar Manthan had entered research service?","answer":"No. The release says integration and sea trials will follow before final delivery for commissioning in 2028."}]'::jsonb,
  '{"title":"ORV Sagar Manthan: build to scientific service","steps":["GRSE builds the vessel for NCPOR under the Ministry of Earth Sciences.","The ship is launched and moves into the next construction stage.","Systems are integrated and the vessel undergoes sea trials.","After delivery and commissioning, it supports Deep Ocean Mission research and surveys."]}'::jsonb,
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
  '2026-09-10-ccea-eastern-central-rail-multitracking',
  '2026-09-10-ccea-southern-rail-multitracking',
  '2026-09-10-india-6g-leadership-security-call-to-action',
  '2026-09-10-uidai-face-authentication-sdk-sandbox',
  '2026-09-10-orv-sagar-manthan-deep-ocean-mission'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
