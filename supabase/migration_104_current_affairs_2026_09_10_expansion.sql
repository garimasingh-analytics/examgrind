-- Expansion of the 10 September 2026 desk to eight briefs.

insert into public.current_affairs_briefs (slug, published_on, title, summary, why_it_matters, background, source_title, source_url, source_publisher, source_published_on, prelims_takeaways, quick_check, visual_data, status, reviewed_at) values
(
  '2026-09-10-rashtriya-poshan-maah-2026', '2026-09-10',
  'Ninth Rashtriya Poshan Maah begins with Anganwadi-centred nutrition focus',
  'The Ministry of Women and Child Development launched the ninth Rashtriya Poshan Maah from 9 September to 8 October 2026. Its campaign priorities are dietary diversity, adequate protein, fresh hot cooked meals, community ownership of Anganwadi services, early childhood development and ten years of PMMVY.',
  'This is an important nutrition-governance item. Poshan Maah is a time-bound Jan Andolan and awareness-delivery campaign; it should not be confused with Poshan Abhiyaan, Mission Saksham Anganwadi and Poshan 2.0, or PMMVY, which are continuing programme frameworks.',
  'The Ministry links the campaign to Mission Saksham Anganwadi and Poshan 2.0. It reports that more than 14 lakh Anganwadi Centres deliver nutrition, health and early-childhood-care services to over 7.5 crore children, 1.10 crore pregnant and lactating women and nearly 16 lakh adolescent girls. It also reports that PMMVY has completed ten years, with more than Rs 21,000 crore transferred through DBT to over 4.65 crore mothers.',
  'Ministry of Women and Child Development launches Rashtriya Poshan Maah 2026', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308322&lang=2&reg=48', 'Ministry of Women and Child Development / Press Information Bureau', '2026-09-09',
  '["The ninth Rashtriya Poshan Maah runs from 9 September to 8 October 2026.", "Its themes include dietary diversity, adequate protein, fresh hot cooked meals and early childhood development.", "The campaign is linked with Mission Saksham Anganwadi and Poshan 2.0.", "PMMVY is the Pradhan Mantri Matru Vandana Yojana and the release notes ten years of its implementation."]'::jsonb,
  '[{"question":"What is the duration of Rashtriya Poshan Maah 2026?","answer":"9 September to 8 October 2026."},{"question":"Is Poshan Maah itself the same thing as PMMVY?","answer":"No. Poshan Maah is a nutrition campaign; PMMVY is the Pradhan Mantri Matru Vandana Yojana."}]'::jsonb,
  '{"title":"Nutrition campaign and delivery system","steps":["Poshan Maah mobilises communities around nutrition priorities.","Anganwadi Centres provide grassroots nutrition and early-childhood services.","Mission Saksham Anganwadi and Poshan 2.0 strengthen the delivery framework.","PMMVY supports maternal benefits through DBT."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-nasha-mukt-bharat-spiritual-organisations-mous', '2026-09-10',
  'Four organisations join Nasha Mukt Bharat Abhiyaan through MoUs',
  'The Department of Social Justice and Empowerment signed MoUs with four organisations—Adhyatm Vigyan Satsang Kendra, Chinmaya Mission, Divya Jyoti Jagrati Sansthan and Hare Krishna Movement—to support awareness, prevention, recovery and social mobilisation under Nasha Mukt Bharat Abhiyaan.',
  'This is a social-justice and public-health delivery item. The agreements extend community participation in an existing anti-drug-abuse campaign; they neither create a new criminal offence nor replace medical de-addiction and rehabilitation services.',
  'Nasha Mukt Bharat Abhiyaan is a national campaign against substance abuse. The Ministry describes the MoUs as a way to strengthen grassroots awareness, prevention and recovery support through the organisations’ community networks. Student recall should distinguish preventive mobilisation from treatment and rehabilitation, although a comprehensive response needs both.',
  'Spiritual Strength for a Drug-Free India', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308382&lang=2&reg=48', 'Department of Social Justice and Empowerment / Press Information Bureau', '2026-09-09',
  '["Nasha Mukt Bharat Abhiyaan is a national campaign against substance abuse.", "Four organisations signed MoUs with the Department of Social Justice and Empowerment.", "The four are Adhyatm Vigyan Satsang Kendra, Chinmaya Mission, Divya Jyoti Jagrati Sansthan and Hare Krishna Movement.", "The stated areas are awareness, prevention, recovery and social mobilisation."]'::jsonb,
  '[{"question":"Which ministry department signed the MoUs under Nasha Mukt Bharat Abhiyaan?","answer":"The Department of Social Justice and Empowerment."},{"question":"Do these MoUs replace clinical treatment and rehabilitation services?","answer":"No. They support community awareness, prevention and recovery mobilisation within the wider response."}]'::jsonb,
  '{"title":"Community role in substance-abuse response","steps":["The national campaign identifies prevention and recovery as public priorities.","Community organisations contribute awareness and mobilisation networks.","MoUs formalise cooperation with the Social Justice Department.","Prevention, treatment, counselling and rehabilitation remain complementary parts of the response."]}'::jsonb,
  'published', now()
),
(
  '2026-09-10-metal-free-organic-photocatalyst-green-hydrogen', '2026-09-10',
  'CeNS research demonstrates metal-free organic route for solar hydrogen',
  'Researchers at the Centre for Nano and Soft Matter Sciences developed a self-assembling organic photocatalyst that improved solar-driven hydrogen generation without using metals. The approach joins aspartic acid to perylene diimide, producing ordered nanosheets in water and a reported nearly 18% higher photocurrent than the bulk material.',
  'This is a science-and-technology item on green hydrogen and photocatalysis. It is laboratory research with possible future applications, not a commercial green-hydrogen plant, a new national mission, or proof of immediate large-scale deployment.',
  'CeNS, Bengaluru, is an autonomous institute under the Department of Science and Technology. The official release explains that sunlight-driven water splitting uses a photocatalyst to separate charges and drive hydrogen evolution. Aspartic-acid functionalisation promotes hydrogen bonding, while the perylene-diimide chromophore supports light absorption and pi-pi stacking; the resulting self-assembly improves charge separation and accessible catalytic surface area.',
  'Self-assembly of organic molecules opens a new path to green hydrogen production', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308334&lang=1&reg=6', 'Centre for Nano and Soft Matter Sciences, Department of Science and Technology / Press Information Bureau', '2026-09-09',
  '["CeNS is an autonomous institute under the Department of Science and Technology.", "The research uses aspartic acid and perylene diimide (PDI) in a metal-free organic photocatalyst.", "The material self-assembles into two-dimensional nanosheets in water.", "The release reports nearly 18% higher photocurrent than the bulk counterpart during solar-driven water splitting."]'::jsonb,
  '[{"question":"Does the release announce a commercial green-hydrogen plant?","answer":"No. It reports laboratory research on a possible future photocatalyst route."},{"question":"Which department is CeNS associated with?","answer":"The Department of Science and Technology."}]'::jsonb,
  '{"title":"Organic photocatalysis for hydrogen","steps":["A light-absorbing organic molecule is functionalised with an amino acid.","The molecules self-assemble into ordered nanosheets.","Improved light absorption and charge separation aid water-splitting reactions.","The research could inform future metal-free solar-hydrogen technologies."]}'::jsonb,
  'published', now()
)
on conflict (slug) do update set title = excluded.title, summary = excluded.summary, why_it_matters = excluded.why_it_matters, background = excluded.background, source_title = excluded.source_title, source_url = excluded.source_url, source_publisher = excluded.source_publisher, source_published_on = excluded.source_published_on, prelims_takeaways = excluded.prelims_takeaways, quick_check = excluded.quick_check, visual_data = excluded.visual_data, status = excluded.status, reviewed_at = excluded.reviewed_at, updated_at = now();

insert into public.current_affairs_exam_tags (brief_id, exam_id)
select briefs.id, exams.id from public.current_affairs_briefs briefs cross join public.exams exams
where briefs.slug in ('2026-09-10-rashtriya-poshan-maah-2026','2026-09-10-nasha-mukt-bharat-spiritual-organisations-mous','2026-09-10-metal-free-organic-photocatalyst-green-hydrogen')
and exams.slug in ('cuet', 'ssc-cgl', 'uppsc-ro-aro', 'up-secretariat-ro-aro') on conflict do nothing;
