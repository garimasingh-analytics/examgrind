-- 4 September 2026 morning desk.
-- Both briefs use primary releases from non-PIB official authorities.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-04-sebi-derivative-settlement-price-cas',
  '2026-09-04',
  'SEBI to review derivative settlement-price methodology after CAS rollout',
  'SEBI announced a review of the methodology used to determine settlement prices for derivative contracts in the context of the Closing Auction Session (CAS) rollout. It is a regulatory review, not an announcement of a final replacement formula.',
  'This is a useful Economy and financial-regulation update. It connects the work of a market regulator with the difference between the equity cash market and derivatives, and with the importance of transparent rules for price discovery and settlement.',
  'A derivative is a contract whose value is linked to an underlying asset, index or rate. Its settlement price is the reference price used to settle the contract or calculate related obligations. CAS stands for Closing Auction Session: an auction-based process used to establish a closing price in the equity cash segment. A review of a methodology should be distinguished from a final circular or a change that is already in force.',
  'SEBI: Settlement Price methodology for Derivative Contracts in the light of CAS rollout',
  'https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2026/sebi-to-review-settlement-price-methodology-for-derivative-contracts-in-the-light-of-cas-rollout_104260.html',
  'Securities and Exchange Board of India',
  '2026-09-03',
  '["CAS stands for Closing Auction Session.", "The equity cash market and the derivatives market are related but distinct market segments.", "A settlement price is a reference price used for settling derivative obligations.", "A regulator announcing a review is not the same as a regulator issuing a final rule."]'::jsonb,
  '[{"question":"What does CAS stand for in this market-regulation update?","answer":"Closing Auction Session."},{"question":"Why does a settlement-price methodology matter in derivatives?","answer":"It provides the reference price used to determine settlement-related obligations under derivative contracts."}]'::jsonb,
  '{"title":"From cash-market close to derivative settlement","steps":["Trading in the equity cash market produces prices for underlying securities.","A closing-auction mechanism can help establish a closing price.","Derivative contracts need a defined settlement-price methodology.","SEBI reviews the methodology when market-structure changes may affect that reference point."]}'::jsonb,
  'published', now()
),
(
  '2026-09-04-mobile-esewa-vans-ecourts-access',
  '2026-09-04',
  'Mobile eSewa Vans: taking eCourts services and legal aid closer to citizens',
  'The Supreme Court''s eCommittee, NALSA and the Department of Justice announced the 4 September flag-off of 26 Mobile eSewa Vans, the first tranche of a planned fleet of 73. The initiative is designed to take selected digital-courts services, legal aid and legal-literacy support to remote and underserved areas.',
  'For Polity and governance questions, this is a concrete access-to-justice example. It links the judiciary, legal-services institutions and digital public-service delivery, while showing that technology policy also needs assisted access for people who may face connectivity, distance or literacy barriers.',
  'The eCourts Project uses information and communication technology to improve court-related services and processes. NALSA is the National Legal Services Authority, which works within the legal-services framework. According to the Supreme Court release, the vans are intended to support services such as digital e-filing, legal literacy, Mobile Lok Adalats, secure e-payments and remote hearings or witness depositions where appropriate. The announcement described the launch; it should not be read as proof that the full 73-vehicle fleet is already deployed.',
  'Supreme Court of India: Mobile eSewa Vans initiative',
  'https://www.sci.gov.in/ecommittee-supreme-court-of-india-nalsa-and-the-department-of-justice-to-flag-off-mobile-esewa-vans-on-september-4-2026/',
  'Supreme Court of India',
  '2026-09-03',
  '["The eCommittee of the Supreme Court, NALSA and the Department of Justice are collaborating on the initiative.", "The first announced tranche consists of 26 Mobile eSewa Vans.", "The larger planned fleet is 73 vans, to be deployed progressively.", "The initiative is linked to the eCourts Project and access to justice."]'::jsonb,
  '[{"question":"What is the key governance objective of the Mobile eSewa Vans?","answer":"To improve access to justice by taking selected eCourts services, legal aid and legal-literacy support closer to citizens, especially in remote and underserved areas."},{"question":"Which body is abbreviated as NALSA?","answer":"National Legal Services Authority."}]'::jsonb,
  '{"title":"Assisted digital access to justice","steps":["Court and legal-services institutions design a public-facing access initiative.","Mobile units carry connectivity and assisted digital-service capacity to communities.","Citizens can receive support for relevant eCourts and legal-services processes.","The policy aim is more accessible and inclusive justice delivery."]}'::jsonb,
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
  '2026-09-04-sebi-derivative-settlement-price-cas',
  '2026-09-04-mobile-esewa-vans-ecourts-access'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
