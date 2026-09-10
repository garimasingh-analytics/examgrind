-- 7 September 2026 recovered current-affairs desk.
-- These are original revision briefs based on missed primary PIB releases
-- from the late 5-6 September source window.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-07-nba-access-benefit-sharing-disbursement',
  '2026-09-07',
  'Biodiversity benefit-sharing: NBA disbursements cross ₹200 crore',
  'The National Biodiversity Authority reported that cumulative Access and Benefit-Sharing (ABS) disbursements have crossed ₹200 crore. It also sanctioned ₹8.23 crore for 27 State Biodiversity Boards and five Union Territory Biodiversity Councils from proceeds connected with the use of bitter gourd, okra, chilli and onion biological resources.',
  'This is a high-yield Environment, Polity and international-conventions update. It makes the benefit-sharing principle concrete: when biological resources are used commercially under the applicable framework, the resulting benefits can support conservation and community-oriented activity rather than treating biodiversity as a free input.',
  'India implements its biodiversity framework through the Biological Diversity Act, 2002 and institutions such as the National Biodiversity Authority (NBA), State Biodiversity Boards and local Biodiversity Management Committees. Access and Benefit Sharing is the principle that benefits arising from the use of biological resources and associated knowledge should be shared fairly and equitably. It is closely associated with the Convention on Biological Diversity and the Nagoya Protocol. A disbursement is not the same as a biodiversity tax on every crop or a payment automatically owed by every farmer; its application depends on the legal framework and the facts of access and use.',
  'National Biodiversity Authority Crosses ₹200-Crore Milestone in ABS Disbursement',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307004&lang=1&reg=3',
  'National Biodiversity Authority / Ministry of Environment, Forest and Climate Change',
  '2026-09-05',
  '["NBA reported cumulative ABS disbursements of more than ₹200 crore.", "The new ₹8.23 crore sanction covered 27 State Biodiversity Boards and 5 Union Territory Biodiversity Councils.", "The listed resources were bitter gourd, okra, chilli and onion.", "Access and Benefit Sharing is linked with the Convention on Biological Diversity and the Nagoya Protocol."]'::jsonb,
  '[{"question":"What is the central idea of Access and Benefit Sharing?","answer":"Benefits arising from the use of biological resources and associated knowledge should be shared fairly and equitably under the applicable legal framework."},{"question":"Which Indian body is central to the national ABS framework?","answer":"The National Biodiversity Authority, working with State Biodiversity Boards and local institutions."}]'::jsonb,
  '{"title":"From a biological resource to benefit sharing","steps":["A resource or associated knowledge is accessed under the applicable framework.","The user and competent authorities apply the relevant ABS conditions.","Benefits are realised from the covered use of the resource.","Disbursement supports conservation and community-oriented biodiversity action."]}'::jsonb,
  'published', now()
),
(
  '2026-09-07-vibrant-villages-two-phase-border-development',
  '2026-09-07',
  'Vibrant Villages Programme: two phases link border development and security',
  'A PIB explainer set out how the Vibrant Villages Programme now works in two phases: VVP-I covers selected northern-border villages, while VVP-II extends the approach to other international land-border areas. Together, the programme is designed to cover more than 2,616 villages with a combined outlay of ₹11,639 crore.',
  'This is relevant to Internal Security, Geography and government schemes. It tests a recurring exam distinction: border development is not only a roads project. The programme uses connectivity, services, livelihoods and local participation to reduce isolation and out-migration in strategically sensitive settlements.',
  'VVP-I is a Centrally Sponsored Scheme launched in 2023 for selected villages along the northern border; VVP-II is a Central Sector Scheme for other international land-border areas, excluding areas already covered under VVP-I. The programme is coordinated by the Ministry of Home Affairs with States, districts and border-guarding forces. Village Action Plans and convergence with existing schemes are central to implementation. According to the 6 September PIB explainer, VVP-I had identified 662 priority villages in five northern-border States or Union Territories, while VVP-II identified 1,954 villages in 15 States and two Union Territories. Scheme coverage should not be confused with a claim that all border infrastructure has already been completed.',
  'Vibrant Villages Programme: Strengthening India’s Frontiers Through Inclusive Development',
  'https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159861&lang=1&reg=3',
  'Ministry of Home Affairs / Press Information Bureau',
  '2026-09-06',
  '["VVP-I covers selected villages along the northern border; VVP-II covers other international land-border areas.", "VVP-I is a Centrally Sponsored Scheme, whereas VVP-II is a Central Sector Scheme.", "The two phases together aim to cover more than 2,616 villages with a combined outlay of ₹11,639 crore.", "The Ministry of Home Affairs is the nodal ministry for the programme."]'::jsonb,
  '[{"question":"What is the key difference between VVP-I and VVP-II?","answer":"VVP-I focuses on the northern border and is a Centrally Sponsored Scheme; VVP-II extends coverage to other land borders as a Central Sector Scheme."},{"question":"Why is out-migration relevant to the programme?","answer":"Loss of population can weaken local livelihoods and the human presence in frontier areas; the programme aims to make border villages more viable places to live and work."}]'::jsonb,
  '{"title":"How border-village development supports resilience","steps":["Village Action Plans identify border-specific needs.","Roads, telecom, health, education and livelihoods are strengthened through schemes and convergence.","Better services and local economic activity reduce isolation and out-migration pressures.","More resilient communities complement the work of border-guarding forces."]}'::jsonb,
  'published', now()
),
(
  '2026-09-07-state-biodiversity-governance-meet',
  '2026-09-07',
  'National biodiversity meet focuses on State and local implementation',
  'The 16th National Meet of State Biodiversity Boards and Union Territory Biodiversity Councils opened in Chandigarh on 6 September. The National Biodiversity Authority convened the two-day meeting to focus on implementation of the amended biodiversity-governance framework at State and local levels.',
  'For Environment and Polity preparation, this turns a meeting into a usable institution map. Biodiversity protection is implemented through several levels: the national authority, State boards, Union Territory councils, Biodiversity Management Committees and People’s Biodiversity Registers. A question can test the role of these institutions rather than the meeting venue alone.',
  'The Biological Diversity Act, 2002 provides India’s statutory biodiversity framework. The Biological Diversity (Amendment) Act, 2023 and Biological Diversity Rules, 2024 changed and clarified parts of that framework. State Biodiversity Boards operate at State level; Union Territory Biodiversity Councils perform a corresponding role in Union Territories. Biodiversity Management Committees are local bodies, and People’s Biodiversity Registers document local biological resources and related knowledge. The meeting did not itself enact a new law: it focused on aligning rules, institutions and implementation with the existing amended framework.',
  '16th National Meet of State Biodiversity Boards and Union Territory Biodiversity Councils held at Chandigarh',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307120&lang=1&reg=3',
  'National Biodiversity Authority / Ministry of Environment, Forest and Climate Change',
  '2026-09-06',
  '["The 16th National Meet was held at Chandigarh on 6-7 September 2026.", "It was organised by the National Biodiversity Authority.", "The Biological Diversity Act was enacted in 2002; the Amendment Act is from 2023 and the Rules are from 2024.", "People’s Biodiversity Registers are local-level records of biological resources and associated knowledge."]'::jsonb,
  '[{"question":"Which institution is the national-level body in India’s biodiversity governance architecture?","answer":"The National Biodiversity Authority."},{"question":"Does a national implementation meeting itself amend the Biological Diversity Act?","answer":"No. The meeting can guide coordination and implementation; statutory amendment requires the legislative process."}]'::jsonb,
  '{"title":"India’s biodiversity-governance ladder","steps":["The Biological Diversity Act and Rules set the national framework.","NBA provides national-level statutory oversight and coordination.","State Biodiversity Boards and UT Biodiversity Councils implement relevant functions regionally.","Biodiversity Management Committees and People’s Biodiversity Registers connect the framework to local knowledge and conservation."]}'::jsonb,
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
  '2026-09-07-nba-access-benefit-sharing-disbursement',
  '2026-09-07-vibrant-villages-two-phase-border-development',
  '2026-09-07-state-biodiversity-governance-meet'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
