-- 12 September 2026 daily current-affairs desk.
-- Original briefs on late primary official releases identified after the previous desk cutoff.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-12-trai-tv-advertisement-qos-repeal',
  '2026-09-12',
  'TRAI repeals its television-advertisement duration QoS regulations',
  'TRAI has issued the Standards of Quality of Service (Duration of Advertisements in Television Channels) (Repealing) Regulations, 2026. They repeal the 2012 TRAI regulations and their related orders because the Union government had already removed the connected 12-minute advertisement cap from the Cable Television Networks Rules, 1994.',
  'This is a compact regulator-and-delegated-legislation question. It tests the sequence between a parent-rule change by the Ministry of Information and Broadcasting and TRAI withdrawing the overlapping quality-of-service framework; it does not mean that every broadcasting or consumer-protection rule has disappeared.',
  'The 2012 TRAI regulations had set a quality-of-service framework around the advertisement-duration ceiling: no more than 12 minutes of advertisements in one clock hour of a television programme. That ceiling came from Rule 7(11) of the Cable Television Networks Rules, 1994. MIB omitted Rule 7(11) through an Official Gazette notification on 21 August 2026. TRAI therefore repealed its corresponding 2012 regulations and associated orders, effective from notification of the 2026 repealing regulations in the Official Gazette.',
  'TRAI releases The Standards of Quality of Service (Duration of Advertisements in Television Channels) (Repealing) Regulations, 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308872&reg=3&lang=1',
  'Telecom Regulatory Authority of India / Press Information Bureau',
  '2026-09-10',
  '["The 2026 TRAI repealing regulations withdraw the 2012 Standards of Quality of Service (Duration of Advertisements in Television Channels) Regulations and related orders.", "The earlier framework was linked to the 12-minute advertisement ceiling in a clock hour under Rule 7(11) of the Cable Television Networks Rules, 1994.", "MIB omitted Rule 7(11) through an Official Gazette notification dated 21 August 2026.", "The TRAI repeal takes effect from notification of the 2026 repealing regulations in the Official Gazette."]'::jsonb,
  '[{"question":"Which provision had contained the earlier 12-minute television advertisement ceiling?","answer":"Rule 7(11) of the Cable Television Networks Rules, 1994."},{"question":"Did TRAI repeal the 2012 framework before or after MIB omitted the underlying Rule 7(11) cap?","answer":"After: MIB omitted the cap on 21 August 2026, and TRAI then repealed the corresponding 2012 regulations."}]'::jsonb,
  '{"title":"Why the 2012 TRAI framework was repealed","steps":["Rule 7(11) of the Cable Television Networks Rules set a 12-minute hourly advertisement ceiling.","TRAI''s 2012 QoS regulations monitored and enforced the connected broadcasting standard.","MIB omitted Rule 7(11) through an Official Gazette notification.","TRAI repealed its now-inconsistent 2012 regulations and related orders in 2026."]}'::jsonb,
  'published', now()
),
(
  '2026-09-12-proposed-stronger-seed-act-consultation',
  '2026-09-12',
  'Farmers consulted on proposed Seed Act with traceability and compensation safeguards',
  'The Ministry of Agriculture and Farmers Welfare has resumed nationwide consultation on a proposed stronger Seed Act. The proposal aims to modernise the Seeds Act, 1966 framework through measures such as commercial-seed registration, QR-based traceability, stronger penalties, State-level variety-release roles and Seed Security Funds.',
  'This is an agriculture-governance and legislative-process item. The exam-safe fact is that the measures are proposals under consultation—not enacted law, and not rules currently binding on all seed sellers. The static link is the existing Seeds Act, 1966 and the Seeds (Control) Order, 1983.',
  'The Ministry says the 2025 draft consultation received about 18,000 suggestions and that a further consultation involved roughly 20 farmer organisations. Its proposed approach includes a national register for commercial seeds and planting material, QR codes to trace origin, manufacturer, laboratory clearance and movement, and State Seed Security Funds funded from penalties and recoveries. It also states that traditional and farmers'' seed varieties would not face compulsory registration, while the final draft remains subject to continuing stakeholder consultation and has no fixed deadline.',
  'Shri Shivraj Singh Chouhan Engages Farmer Leaders Nationwide on Proposed Stronger Seed Act',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308922&reg=3&lang=1',
  'Ministry of Agriculture and Farmers Welfare / Press Information Bureau',
  '2026-09-10',
  '["The consultation concerns a proposed stronger Seed Act; it has not yet become an enacted law.", "The existing framework cited by the Ministry includes the Seeds Act, 1966 and the Seeds (Control) Order, 1983.", "The proposal envisages registration and QR-based traceability for commercial seeds and planting material, while traditional and farmers'' varieties would not require compulsory registration.", "The proposed Seed Security Fund in each State would receive penalties and recoveries; the official release says consultations continue and no finalisation deadline has been fixed."]'::jsonb,
  '[{"question":"Has the proposed stronger Seed Act already replaced the Seeds Act, 1966?","answer":"No. The Ministry describes it as a proposal under continuing consultation, with no fixed deadline for finalising the law."},{"question":"What is the proposed purpose of QR codes on commercial seed packets?","answer":"To enable end-to-end traceability, including the seed''s origin, manufacturer, laboratory clearance and movement through the supply chain."}]'::jsonb,
  '{"title":"From consultation to a possible new seed law","steps":["The Seeds Act, 1966 and Seeds (Control) Order, 1983 form the existing cited framework.","The Ministry gathers suggestions from farmers and other stakeholders on a proposed stronger law.","The proposal includes commercial-seed registration, QR traceability, State roles and Seed Security Funds.","Only after the draft is finalised and enacted could a new statutory framework replace or amend the existing one."]}'::jsonb,
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
  '2026-09-12-trai-tv-advertisement-qos-repeal',
  '2026-09-12-proposed-stronger-seed-act-consultation'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
