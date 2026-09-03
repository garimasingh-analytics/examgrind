-- Additional non-overlapping editorial briefs for 30 August 2026.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
  '2026-08-30-aishe-nep-higher-education',
  '2026-08-30',
  'India’s higher-education data: read AISHE with NEP 2020 and SDG 4',
  'A PIB backgrounder on higher education linked expansion in enrolment, institutions, faculty, women’s participation and inclusion with the broader goals of the National Education Policy 2020. It identified the All India Survey on Higher Education as the annual evidence base for the sector.',
  'Education questions are strongest when they connect an institution, a data source and a policy objective. This item lets you link AISHE with access, equity, multidisciplinary learning and SDG 4 rather than memorising isolated statistics.',
  'AISHE is an annual survey of higher-education institutions conducted by the Ministry of Education. NEP 2020 emphasises holistic and multidisciplinary learning. Sustainable Development Goal 4 focuses on inclusive and equitable quality education and lifelong learning opportunities.',
  'PIB Research: India’s Higher Education Sector',
  'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2304606&lang=1&reg=3',
  'Press Information Bureau',
  '2026-08-30',
  '["AISHE stands for All India Survey on Higher Education.", "AISHE is conducted annually by the Ministry of Education.", "NEP 2020 emphasises holistic and multidisciplinary learning.", "SDG 4 concerns inclusive and equitable quality education and lifelong learning."]'::jsonb,
  '[{"question":"What is AISHE used for?","answer":"It provides an annual evidence base on higher-education institutions and related sectoral trends."},{"question":"Which SDG focuses on quality education?","answer":"SDG 4."}]'::jsonb,
  '{"title":"A three-layer education answer","steps":["Name the evidence source: AISHE.","State the policy frame: NEP 2020.","Connect it to access, equity, quality and inclusion.","Use SDG 4 where the question asks for a global-development link."]}'::jsonb,
  'published', now()
),
(
  '2026-08-30-mann-ki-baat-137-history-learning',
  '2026-08-30',
  'Mann Ki Baat’s 137th episode: a prompt for history-learning and civic initiatives',
  'The 137th episode of Mann Ki Baat discussed citizen initiatives and referred to a project that lets users select a year to see which rulers governed different parts of India at that time.',
  'The examination takeaway is institutional and factual: Mann Ki Baat is the Prime Minister’s radio programme. When a current-affairs item references a civic initiative, separate the programme format from the historical or technological theme being discussed.',
  'Mann Ki Baat is a monthly radio broadcast by the Prime Minister of India. History learning often benefits from time-and-space visualisation: a year-based map helps distinguish chronology from geography instead of memorising rulers as an unconnected list.',
  'PIB: English rendering of PM’s address in the 137th episode of Mann Ki Baat',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304616&lang=2&reg=48',
  'Press Information Bureau',
  '2026-08-30',
  '["Mann Ki Baat is the Prime Minister’s radio programme.", "A history map can combine chronology with geography.", "A year is a time marker; the area ruled is a spatial marker.", "Citizen initiatives mentioned in a broadcast are not automatically government schemes."]'::jsonb,
  '[{"question":"What is Mann Ki Baat?","answer":"A monthly radio broadcast by the Prime Minister of India."},{"question":"Why can a year-based history map be useful?","answer":"It helps connect when a ruler or event occurred with where it was located."}]'::jsonb,
  '{"title":"Separate the programme from the example","steps":["Identify the programme format and office associated with it.","Identify the independent initiative or theme mentioned.","Extract the exam-useful concept rather than memorising every anecdote.","For history, connect chronology, geography and political authority."]}'::jsonb,
  'published', now()
),
(
  '2026-08-30-tashkent-shastri-memorial-hindi-scholarship',
  '2026-08-30',
  'Tashkent, Lal Bahadur Shastri and Hindi learning in Uzbekistan',
  'During the visit to Uzbekistan, the Prime Minister paid tribute at the Shastri Memorial in Tashkent and visited Tashkent State University of Oriental Studies. The update noted Hindi teaching at the university and announced a Lal Bahadur Shastri Scholarship for Hindi-language study by Uzbek students.',
  'This is a useful culture-plus-international-relations item. Tashkent is not only a map location: it is linked with Lal Bahadur Shastri’s final days in 1965 and with India–Uzbekistan cultural and educational connections.',
  'Tashkent is the capital of Uzbekistan. Former Prime Minister Lal Bahadur Shastri died in Tashkent in 1965 after the Tashkent Declaration. Cultural diplomacy includes language learning, scholarships, academic exchanges and heritage cooperation.',
  'PIB: PM visits Shastri Memorial and Tashkent State University of Oriental Studies',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304746&lang=1&reg=48',
  'Press Information Bureau',
  '2026-08-30',
  '["Tashkent is the capital of Uzbekistan.", "Lal Bahadur Shastri died in Tashkent in 1965.", "The Tashkent Declaration is associated with India and Pakistan after the 1965 war.", "Language scholarships and academic exchanges are tools of cultural diplomacy."]'::jsonb,
  '[{"question":"Which country has Tashkent as its capital?","answer":"Uzbekistan."},{"question":"How do language scholarships contribute to diplomacy?","answer":"They build long-term cultural, educational and people-to-people links between countries."}]'::jsonb,
  '{"title":"Connect place, person and diplomacy","steps":["Locate Tashkent in Uzbekistan, Central Asia.","Recall its connection with Lal Bahadur Shastri and 1965.","Add the Tashkent Declaration only when the question concerns India–Pakistan history.","Treat language teaching and scholarships as cultural-diplomacy tools."]}'::jsonb,
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
