-- Expansion of the 11 September 2026 daily current-affairs desk to eight briefs.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-09-11-hpv-vaccination-campaign-milestone',
  '2026-09-11',
  'National HPV campaign crosses 80 lakh vaccine doses',
  'The Ministry of Health and Family Welfare reported that India’s National HPV Vaccination Campaign has administered more than 80 lakh doses. The campaign, launched in February 2026, offers a voluntary, free single-dose HPV vaccination to 14-year-old girls at government health facilities with parental consent.',
  'This is a preventive-health and immunisation-programme item. The key distinctions are HPV prevention versus treatment of cervical cancer, and a national campaign milestone versus a change in the immunisation schedule. Students should also remember the digital platform and AEFI safeguards mentioned in the official release.',
  'Human papillomavirus infection is a major preventable risk factor for cervical cancer. PIB states that the annual cohort of 14-year-old girls is about 1.2 crore, based on Registrar General of India 2021 estimates. The campaign uses the U-WIN platform to monitor coverage and identify missed beneficiaries. Every session is supervised by trained medical officers and linked to 24x7 facilities for management of rare Adverse Events Following Immunization (AEFI).',
  'India Administers 80 Lakh HPV Vaccine Doses, Marking Major Milestone in Cervical Cancer Prevention',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309109&lang=1&reg=22',
  'Ministry of Health and Family Welfare / Press Information Bureau',
  '2026-09-11',
  '["The National HPV Vaccination Campaign was launched in February 2026.", "It provides voluntary, free single-dose HPV vaccination to 14-year-old girls at government health facilities, with parental consent.", "The Ministry reported more than 80 lakh doses administered and about 1.2 crore girls in the annual 14-year-old cohort.", "U-WIN supports district-level coverage monitoring, while AEFI means Adverse Events Following Immunization."]'::jsonb,
  '[{"question":"Which age group is targeted by the national HPV campaign described in the release?","answer":"Fourteen-year-old girls."},{"question":"What is the U-WIN platform used for in this campaign?","answer":"Monitoring vaccination coverage, identifying gaps and missed beneficiaries, and supporting programme planning."}]'::jsonb,
  '{"title":"HPV prevention through the public-health system","steps":["Eligible adolescent girls are offered voluntary, free single-dose HPV vaccination.","Government facilities deliver sessions under medical supervision.","U-WIN records and monitors coverage at district level.","AEFI arrangements and community mobilisation support safe, equitable coverage."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-bankers-books-evidence-act-commencement',
  '2026-09-11',
  'Bankers’ Books Evidence Act, 2026 notified to commence on 1 October',
  'The Central Government has appointed 1 October 2026 as the commencement date for the Bankers’ Books Evidence Act, 2026. The Act replaces the Bankers’ Books Evidence Act, 1891 and modernises the evidentiary framework for banking records, including records in electronic, digital, virtual and cloud-based forms.',
  'This is a clean legal-current-affairs question on commencement. An Act receiving assent is not necessarily in force immediately; here, the official notification fixes a later date. It also connects evidence law with digital banking and record certification.',
  'The 2026 Act received Presidential assent on 13 August 2026. PIB says it recognises bankers’ records across physical and contemporary data-storage forms, standardises certification through manual, digital or electronic signatures, and requires a court to record special cause before summoning a bank official where the bank is not a party to proceedings. The Central Government may extend the framework to specified financial-sector entities or classes of entities.',
  'Bankers’ Books Evidence Act, 2026 to come into force from 1st October 2026',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309122&lang=2&reg=48',
  'Department of Financial Services, Ministry of Finance / Press Information Bureau',
  '2026-09-11',
  '["The Bankers’ Books Evidence Act, 2026 replaces the Bankers’ Books Evidence Act, 1891.", "It received Presidential assent on 13 August 2026 but is notified to commence on 1 October 2026.", "The Act recognises bankers’ records in physical, electronic, digital, virtual and cloud-based forms.", "Where a bank is not a party to a proceeding, a court must record special cause before summoning a bank official under the framework described by PIB."]'::jsonb,
  '[{"question":"When do the provisions of the Bankers’ Books Evidence Act, 2026 come into force?","answer":"1 October 2026, as appointed by the Central Government notification."},{"question":"Does the Act apply only to paper ledgers?","answer":"No. It recognises physical records as well as electronic, digital, virtual and cloud-based forms."}]'::jsonb,
  '{"title":"From assent to commencement","steps":["The 2026 Act received Presidential assent in August.","A separate Gazette notification appointed its commencement date.","From 1 October, it replaces the 1891 banking-record evidence law.","Technology-neutral records and standardised certification support legal use of banking information."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-bocw-digital-welfare-tools',
  '2026-09-11',
  'States launch digital welfare and cess tools for construction workers',
  'At the National Conference on Building and Other Construction Workers in Mumbai, participating States launched or advanced three worker-facing digital mechanisms: State BOCW Digital Labour Chowk, Labour Chowk-cum-Facilitation Centres and Online BOCW Cess Collection Portals.',
  'The update joins labour welfare, State implementation and social-security financing. Treat the tools as State-level implementation initiatives discussed at a national conference, not as a single new central Act or a national cash-transfer scheme.',
  'The Ministry of Labour and Employment reported more than seven crore construction workers and a BOCW cess corpus of about Rs 77,000 crore. The conference released a compendium of initiatives and noted that Digital Labour Chowk, facilitation centres and online cess portals had been adopted by several participating States. Madhya Pradesh, West Bengal and Manipur launched online cess collection portals; Bihar and West Bengal unveiled facilitation centres. The stated goals include easier access to employment and welfare services and more transparent cess management.',
  'Shram Shakti is Fundamental to National Development: Dr. Mansukh Mandaviya',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309283&lang=1&reg=48',
  'Ministry of Labour and Employment / Press Information Bureau',
  '2026-09-11',
  '["BOCW refers to Building and Other Construction Workers.", "The three highlighted mechanisms are State BOCW Digital Labour Chowk, Labour Chowk-cum-Facilitation Centres and Online BOCW Cess Collection Portals.", "The official release reported more than seven crore construction workers and a BOCW cess corpus of about Rs 77,000 crore.", "Madhya Pradesh, West Bengal and Manipur launched online cess portals; Bihar and West Bengal unveiled facilitation centres."]'::jsonb,
  '[{"question":"What does BOCW stand for?","answer":"Building and Other Construction Workers."},{"question":"What is the intended purpose of an Online BOCW Cess Collection Portal?","answer":"To support more transparent collection and management of construction-worker welfare cess."}]'::jsonb,
  '{"title":"Construction-worker welfare delivery","steps":["Construction establishments contribute welfare cess under the BOCW framework.","State welfare systems need worker registration, access and transparent fund management.","Digital Labour Chowk and facilitation centres connect workers to employment and services.","Online cess portals improve collection and monitoring for welfare delivery."]}'::jsonb,
  'published', now()
),
(
  '2026-09-11-iprs-enoxaparin-reference-substance',
  '2026-09-11',
  'Indian Pharmacopoeia Commission releases reference standard for Enoxaparin',
  'The Indian Pharmacopoeia Commission released an Indian Pharmacopoeia Reference Substance (IPRS) for Enoxaparin Sodium for bioassays. The authenticated reference material is intended to support consistent evaluation of the biological activity of the anticoagulant and strengthen India’s pharmaceutical-quality infrastructure.',
  'This is a science-and-regulation item. A pharmacopoeial reference substance is a testing benchmark, not a medicine launch, treatment guideline or a finding that a biosimilar is automatically interchangeable. It is useful for recalling IPC’s quality-standard role in the health system.',
  'IPC is an autonomous institution under the Ministry of Health and Family Welfare. The official release describes Enoxaparin Sodium as a low-molecular-weight heparin anticoagulant used in prevention and treatment of thromboembolic disorders. It says the IPRS can serve as authenticated material for bioassay testing, helping accurate, consistent and comparable assessment of biological activity. The announcement was made during a conference that considered biosimilar quality, analytical characterisation, comparability, immunogenicity and pharmacovigilance.',
  'Indian Pharmacopoeia Commission (IPC) Organizes National Conference on Quality and Safety of Biosimilars',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309187&lang=1&reg=6',
  'Indian Pharmacopoeia Commission, Ministry of Health and Family Welfare / Press Information Bureau',
  '2026-09-11',
  '["IPC is an autonomous institution under the Ministry of Health and Family Welfare.", "IPRS means Indian Pharmacopoeia Reference Substance.", "The new IPRS is for Enoxaparin Sodium bioassays; Enoxaparin is a low-molecular-weight heparin anticoagulant.", "A reference substance supports accurate and comparable quality testing; it is not itself a new medicine approval."]'::jsonb,
  '[{"question":"What is the main use of the IPRS for Enoxaparin Sodium described in the release?","answer":"An authenticated reference material for bioassay testing of its biological activity."},{"question":"Which body released this reference substance?","answer":"The Indian Pharmacopoeia Commission, an autonomous institution under the Ministry of Health and Family Welfare."}]'::jsonb,
  '{"title":"Reference standard and drug-quality assurance","steps":["A medicine’s biological activity requires reliable testing.","IPC supplies an authenticated IPRS for Enoxaparin bioassays.","Laboratories compare bioassay performance against the reference material.","Comparable testing strengthens pharmacopoeial quality infrastructure."]}'::jsonb,
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
  '2026-09-11-hpv-vaccination-campaign-milestone',
  '2026-09-11-bankers-books-evidence-act-commencement',
  '2026-09-11-bocw-digital-welfare-tools',
  '2026-09-11-iprs-enoxaparin-reference-substance'
)
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro')
on conflict do nothing;
