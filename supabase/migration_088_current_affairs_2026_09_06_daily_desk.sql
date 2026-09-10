-- 6 September 2026 daily current-affairs desk.
-- Each entry is an original revision aid based on a primary official release
-- from 5 September, plus one late RBI release from 4 September.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-06-eclgs-5-credit-guarantee-uptake',
  '2026-09-06',
  'ECLGS 5.0: credit guarantees reach ₹2.50 lakh crore',
  'A PIB explainer reported that, as of 20 August 2026, ECLGS 5.0 had issued 6,73,979 guarantees worth ₹2,50,024 crore. The scheme uses government-backed guarantees to help eligible lenders extend additional credit during external disruptions.',
  'This is an Economy and government-schemes update. It tests the difference between a government guarantee and a direct grant: the guarantee is a risk-sharing arrangement that can encourage lending, while the loan remains credit extended through an eligible lender.',
  'Emergency Credit Line Guarantee Scheme (ECLGS) began in 2020 and has had several phases. ECLGS 5.0 was approved in May 2026 and is implemented by the National Credit Guarantee Trustee Company (NCGTC). It is intended for eligible MSMEs, eligible non-MSME businesses and scheduled passenger airlines. The scheme aims for additional credit flow of up to ₹2.55 lakh crore. Its stated guarantee coverage is 100% for eligible MSME loans and 90% for eligible non-MSME and airline loans; eligibility, loan limits and lending decisions remain subject to the scheme and lender rules.',
  'PIB Research: Emergency Credit Line Guarantee Scheme (ECLGS) 5.0',
  'https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159855&id=159855&lang=1&reg=3',
  'Press Information Bureau / Department of Financial Services',
  '2026-09-05',
  '["ECLGS 5.0 is implemented by the National Credit Guarantee Trustee Company (NCGTC).", "The 5 September explainer reported 6,73,979 guarantees worth ₹2,50,024 crore as of 20 August 2026.", "The scheme targets additional credit flow of up to ₹2.55 lakh crore.", "For eligible loans, ECLGS 5.0 provides 100% guarantee coverage for MSMEs and 90% for eligible non-MSME borrowers and scheduled passenger airlines."]'::jsonb,
  '[{"question":"Does a credit guarantee mean the government gives the borrower a grant?","answer":"No. A guarantee supports the lending institution against specified default risk; the borrower receives credit through an eligible lender and remains responsible for the loan under its terms."},{"question":"What is the difference between a guarantee amount and a disbursed loan amount?","answer":"The guarantee amount is the risk cover committed under the scheme. It should not be assumed to be a cash grant paid directly to the borrower."}]'::jsonb,
  '{"title":"How a credit-guarantee scheme supports lending","steps":["An eligible borrower seeks additional credit from a participating lender.","The lender applies its credit and scheme eligibility checks.","NCGTC provides the applicable government-backed guarantee cover.","The lender can extend credit while the borrower repays under the loan terms."]}'::jsonb,
  'published', now()
),
(
  '2026-09-06-surface-coal-lignite-gasification-application-round',
  '2026-09-06',
  'Coal/lignite gasification scheme: first application round closes 7 September',
  'The Ministry of Coal said that the first application round for the ₹37,500 crore Scheme for Promotion of Surface Coal/Lignite Gasification Projects remains open until 7 September. It reported that Talcher Fertilisers Limited and NTPC Limited had submitted applications, and that later rounds will open on a rolling basis.',
  'This is relevant to Energy, Environment and Economy. It connects a public-support scheme with coal gasification, industrial feedstocks and the important distinction between a scheme being approved and a project being selected or commissioned.',
  'Coal gasification converts coal into synthesis gas (syngas), which can be used to make chemicals and fuels such as methanol, ammonia and urea. The Union Cabinet approved this scheme on 13 May 2026 with an outlay of ₹37,500 crore. A request for proposal (RFP) was issued in July, and applicants need to prepare feasibility work, technology choices, feedstock arrangements and detailed proposals. Gasification can reduce reliance on particular imported feedstocks, but it is not automatically a low-emissions technology: lifecycle emissions and pollution controls depend on process design, energy source and safeguards.',
  'Ministry of Coal: Scheme for Promotion of Surface Coal/Lignite Gasification Projects',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2306880&lang=1&reg=3',
  'Ministry of Coal / Press Information Bureau',
  '2026-09-05',
  '["The Scheme for Promotion of Surface Coal/Lignite Gasification Projects has an outlay of ₹37,500 crore.", "The first application round was open until 7 September 2026.", "The Ministry reported applications from Talcher Fertilisers Limited and NTPC Limited.", "Syngas is an intermediate gas mixture that can be used to produce products such as methanol, ammonia and urea."]'::jsonb,
  '[{"question":"Is coal gasification the same thing as coal combustion?","answer":"No. Combustion burns coal directly for heat, whereas gasification converts coal under controlled conditions into syngas that can be used as an industrial intermediate or fuel."},{"question":"What does an RFP stage tell you about a government-backed project?","answer":"It shows that proposals are being invited or evaluated; it does not by itself mean every proposed project has been approved, built or made operational."}]'::jsonb,
  '{"title":"From scheme approval to a gasification project","steps":["Government sets the scheme, outlay and application framework.","Developers prepare feasibility, technology, feedstock and finance proposals.","Applications are submitted and assessed under the scheme process.","Selected projects move through their own approvals, construction and operating stages."]}'::jsonb,
  'published', now()
),
(
  '2026-09-06-coastal-local-area-bank-second-schedule',
  '2026-09-06',
  'RBI includes Coastal Local Area Bank in the Second Schedule',
  'RBI announced that Coastal Local Area Bank Limited has been included in the Second Schedule to the Reserve Bank of India Act, 1934. RBI cited its 28 July notification and publication in the Gazette of India on 11 August.',
  'This is a concise banking-and-polity update. It gives a concrete current example of a scheduled bank and helps distinguish the legal classification of a bank from a general claim that every financial institution is a scheduled bank.',
  'The Second Schedule to the RBI Act lists scheduled banks. A scheduled bank is generally eligible for specified facilities from RBI and has obligations and eligibility conditions under the relevant legal and regulatory framework. A Local Area Bank is a distinct category of bank permitted to operate in a limited geographical area under its licensing framework. Inclusion in the Second Schedule is a statutory classification; it does not erase other applicable licensing, prudential or consumer-protection rules.',
  'RBI: Inclusion of Coastal Local Area Bank Limited in the Second Schedule to the RBI Act, 1934',
  'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63518',
  'Reserve Bank of India',
  '2026-09-04',
  '["Coastal Local Area Bank Limited was included in the Second Schedule to the RBI Act, 1934.", "RBI cited Notification DoR.LIC.No.S3539/22-03-070/2026-27 dated 28 July 2026.", "The notification was published in the Gazette of India on 11 August 2026.", "A Local Area Bank is a separate banking category from a universal commercial bank."]'::jsonb,
  '[{"question":"What does inclusion in the Second Schedule to the RBI Act signify?","answer":"It gives the bank scheduled-bank status under the RBI Act, with the legal and regulatory consequences that follow from that classification."},{"question":"Does scheduled-bank status mean a bank can operate without other RBI rules?","answer":"No. The bank remains subject to its applicable licence conditions and banking regulation."}]'::jsonb,
  '{"title":"Reading an RBI scheduled-bank notice","steps":["RBI issues a notification under the relevant banking law.","The notification is published through the Gazette process.","The named institution enters the Second Schedule to the RBI Act.","Its scheduled-bank status operates alongside its other licence and regulatory conditions."]}'::jsonb,
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
  '2026-09-06-eclgs-5-credit-guarantee-uptake',
  '2026-09-06-surface-coal-lignite-gasification-application-round',
  '2026-09-06-coastal-local-area-bank-second-schedule'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
