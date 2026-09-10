-- Expand the editorial source registry beyond PIB and correct the two monthly-journal URLs.
-- A source appearing here is a desk to scan, not an instruction to publish every item it carries.

insert into public.current_affairs_sources (
  slug, name, publisher, source_url, source_type, cadence, editorial_focus
) values
  (
    'yojana',
    'Yojana',
    'Publications Division, Ministry of Information and Broadcasting',
    'https://www.publicationsdivision.nic.in/journals/index.php?route=page%2Fyojana',
    'magazine',
    'monthly',
    'Monthly policy and development context. Use a newly available issue as reference material; do not present it as a daily news feed.'
  ),
  (
    'kurukshetra',
    'Kurukshetra',
    'Publications Division, Ministry of Information and Broadcasting',
    'https://www.publicationsdivision.nic.in/journals/index.php?cid=4&lang=English&route=page%2Fajkalarchives&year=2023',
    'magazine',
    'monthly',
    'Monthly rural-development and agriculture context. Use a newly available issue as reference material; do not present it as a daily news feed.'
  ),
  (
    'supreme-court-updates',
    'All updates and press releases',
    'Supreme Court of India',
    'https://www.sci.gov.in/all-updates/',
    'portal',
    'as_published',
    'Constitutional law, judicial administration, legal aid, e-Courts and major institutional developments. Exclude routine listing notices.'
  ),
  (
    'lok-sabha-digital-sansad',
    'Lok Sabha updates',
    'Parliament of India',
    'https://sansad.in/ls',
    'portal',
    'as_published',
    'Legislation, parliamentary procedure, committees, questions and institutional updates. Verify enactments against the authoritative bill or gazette record.'
  ),
  (
    'rajya-sabha-digital-sansad',
    'Rajya Sabha updates',
    'Parliament of India',
    'https://sansad.in/rs',
    'portal',
    'as_published',
    'Legislation, parliamentary procedure, committees, questions and institutional updates. Verify enactments against the authoritative bill or gazette record.'
  ),
  (
    'eci',
    'Election Commission updates',
    'Election Commission of India',
    'https://www.eci.gov.in/',
    'portal',
    'as_published',
    'Election law, voter services, electoral technology and official directions. Exclude routine election-event notices unless they establish a wider exam-relevant development.'
  ),
  (
    'sebi-press-releases',
    'Press releases',
    'Securities and Exchange Board of India',
    'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=6&ssid=23',
    'portal',
    'as_published',
    'Capital markets, investor protection, market infrastructure and securities regulation.'
  ),
  (
    'cci-press-releases',
    'Antitrust press releases',
    'Competition Commission of India',
    'https://www.cci.gov.in/antitrust/press-release',
    'portal',
    'as_published',
    'Competition law, combinations, market conduct and institutional enforcement. Link the published decision when an order is central to the brief.'
  ),
  (
    'ifsca-news',
    'News and updates',
    'International Financial Services Centres Authority',
    'https://ifsca.gov.in/Home/NewSection',
    'portal',
    'as_published',
    'International Financial Services Centre regulation, financial-market development and related innovation.'
  ),
  (
    'niti-aayog',
    'News and publications',
    'NITI Aayog',
    'https://www.niti.gov.in/',
    'portal',
    'as_published',
    'Policy reports, cooperative federalism, SDGs, innovation and evaluation. Prefer the underlying report or release over a headline.'
  ),
  (
    'ndma',
    'National Disaster Management Authority updates',
    'National Disaster Management Authority',
    'https://ndma.gov.in/',
    'portal',
    'as_published',
    'Disaster-risk reduction, preparedness, early warning, guidelines and response institutions.'
  ),
  (
    'mospi',
    'Ministry updates and statistical releases',
    'Ministry of Statistics and Programme Implementation',
    'https://www.mospi.gov.in/',
    'portal',
    'as_published',
    'Official statistics, surveys, indices, programme implementation and data-methodology changes.'
  ),
  (
    'state-government-portals',
    'States and Union Territories directory',
    'National Portal of India',
    'https://www.india.gov.in/my-government/states-uts',
    'portal',
    'as_published',
    'Route to relevant State and Union Territory authorities. Publish only where the original state government release or order is accessible and has national or syllabus value.'
  )
on conflict (slug) do update set
  name = excluded.name,
  publisher = excluded.publisher,
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  cadence = excluded.cadence,
  editorial_focus = excluded.editorial_focus,
  is_active = true,
  updated_at = now();
