-- ExamGrind verified daily current-affairs desk: 10 November 2026.
-- Coverage window: substantive official releases indexed on 9 November, with late material checked.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
$$2026-11-10-trai-ip-port-charges-third-amendment$$, $$2026-11-10$$,
$$TRAI notifies an IP-port charging framework for telecom interconnection$$,
$$TRAI issued the Telecommunication Interconnection (Port Charges) (Third Amendment) Regulations, 2026. From 1 January 2027, the framework sets annual ceilings of Rs 5.6 lakh for a 1 Gbps IP port and Rs 42.3 lakh for a 10 Gbps IP port; parties may agree to lower charges and other capacities using the prescribed methodology.$$,
$$This is a direct telecom-regulation item linking network modernisation, competition and consumer connectivity. It tests TRAI's statutory role in interconnection and the shift from legacy E1/TDM arrangements to IP-based networks.$$,
$$Interconnection is the technical, operational and commercial arrangement that lets subscribers on different telecom networks communicate. Under section 11(1)(b) of the TRAI Act, 1997, TRAI can prescribe interconnection terms. The amendment keeps the earlier port-charge provisions for E1 ports, while adding IP-port provisions across fixed, mobile, national long-distance and international long-distance services. It also provides for graded financial disincentives, capped at Rs 15 lakh per service area for each specified contravention.$$,
$$TRAI releases The Telecommunication Interconnection (Port Charges) (Third Amendment) Regulations, 2026$$,
$$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334365&lang=1&reg=3$$,
$$Telecom Regulatory Authority of India / Press Information Bureau$$, $$2026-11-09$$,
$$["TRAI issued the Telecommunication Interconnection (Port Charges) (Third Amendment) Regulations, 2026.","The IP-port charging framework takes effect on 1 January 2027.","Annual ceiling charges are Rs 5.6 lakh for 1 Gbps and Rs 42.3 lakh for 10 Gbps IP ports.","The framework applies across fixed, mobile, national long-distance and international long-distance services, while earlier charges continue for E1 ports."]$$::jsonb,
$$[{"question":"Which technology is newly addressed by TRAI's 2026 port-charges amendment?","answer":"IP-based telecom interconnection; the earlier E1/TDM port-charge provisions continue separately."}]$$::jsonb,
$${"title":"Interconnection regulation for IP networks","steps":["Different telecom networks need interconnection to exchange traffic.","TRAI regulates the terms under the TRAI Act.","The amendment adds IP-port charge ceilings and flexibility for negotiated lower charges.","The rules support interoperable services while retaining the legacy E1-port framework."]}$$::jsonb, $$published$$, now()
),
(
$$2026-11-10-buddha-relics-bomdila-cultural-heritage$$, $$2026-11-10$$,
$$Buddha relics are enshrined at Bomdila in Arunachal Pradesh$$,
$$Sacred relics of Shakyamuni Buddha reached Thubchog Gatsel Ling Monastery at Bomdila and were enshrined there for a public exposition from 8 to 13 November. The Ministry of Culture, National Museum, Government of Arunachal Pradesh and International Buddhist Confederation are collaborating on the exposition.$$,
$$The development is useful for culture and heritage questions because it connects Buddhist heritage in the eastern Himalaya with the institutions responsible for conserving and presenting national collections. It is a completed cultural-historical development, not an announcement of a new scheme.$$,
$$Bomdila is in West Kameng district of Arunachal Pradesh. The official account places the event within a travelling public exposition: the relics moved from Tawang to Bomdila and are scheduled to proceed to the Golden Pagoda at Namsai before returning to the National Museum. The International Buddhist Confederation is a cultural body that works on Buddhist heritage and dialogue; it is not a constitutional authority.$$,
$$Sacred Relics of Shakyamuni Buddha Arrive at Thubchog Gatsel Ling Monastery, Bomdila$$,
$$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334253&lang=1&reg=3$$,
$$Ministry of Culture / Press Information Bureau$$, $$2026-11-09$$,
$$["The relics were enshrined at Thubchog Gatsel Ling Monastery, Bomdila, Arunachal Pradesh.","The Bomdila public exposition runs from 8 to 13 November 2026.","The Ministry of Culture, National Museum, Government of Arunachal Pradesh and International Buddhist Confederation are named as collaborators.","Bomdila is in West Kameng district; the itinerary also includes Tawang and Namsai in Arunachal Pradesh."]$$::jsonb,
$$[{"question":"Which national institution is named as a collaborator in the Bomdila relic exposition?","answer":"The National Museum, New Delhi, together with the Ministry of Culture and other partners."}]$$::jsonb,
$${"title":"A heritage-exposition route in Arunachal Pradesh","steps":["The National Museum safeguards and presents cultural collections.","The relics were exhibited at Tawang before reaching Bomdila.","Bomdila hosts a public exposition with State and Buddhist-heritage partners.","The itinerary then proceeds to Namsai before return to the National Museum."]}$$::jsonb, $$published$$, now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, why_it_matters = excluded.why_it_matters,
  background = excluded.background, source_title = excluded.source_title, source_url = excluded.source_url,
  source_publisher = excluded.source_publisher, source_published_on = excluded.source_published_on,
  prelims_takeaways = excluded.prelims_takeaways, quick_check = excluded.quick_check,
  visual_data = excluded.visual_data, status = excluded.status, reviewed_at = now(),
  updated_at = now();

insert into public.current_affairs_exam_tags (brief_id, exam_id)
select briefs.id, exams.id from public.current_affairs_briefs briefs cross join public.exams exams
where briefs.slug in (
$$2026-11-10-trai-ip-port-charges-third-amendment$$,
$$2026-11-10-buddha-relics-bomdila-cultural-heritage$$
)
and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict (brief_id, exam_id) do nothing;
