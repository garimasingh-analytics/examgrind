-- ExamGrind verified daily current-affairs desk: 9 November 2026.
-- Coverage window: substantive official releases published on 7-8 November, including the late Diwali-weekend sweep.

insert into public.current_affairs_briefs (
  slug, published_on, title, summary, why_it_matters, background,
  source_title, source_url, source_publisher, source_published_on,
  prelims_takeaways, quick_check, visual_data, status, reviewed_at
) values
(
$$2026-11-09-india-eu-horizon-europe-negotiations$$, $$2026-11-09$$,
$$India and EU complete negotiations for Horizon Europe association$$,
$$India and the European Union completed negotiations for India's association with Horizon Europe, the EU's research and innovation programme. The arrangement is intended to let Indian researchers, institutions and industry join collaborative calls, European consortia and research infrastructure.$$,
$$This is an important science-diplomacy development linking India-EU relations, international research cooperation and technology policy. For exams, distinguish completed negotiations for association from membership of the European Union or a domestic research scheme.$$,
$$Horizon Europe is the European Union's framework programme for research and innovation. The official release highlights Pillar II clusters that include health; digital technologies, industry and space; climate, energy and mobility; and food and the bioeconomy. India already cooperates with the EU under the India-EU Agreement on Science and Technology Cooperation and the Trade and Technology Council; this association is a longer-term institutional route for collaborative projects.$$,
$$India-EU conclude negotiations to join Horizon Europe programme$$,
$$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333903&lang=1&reg=1$$,
$$Ministry of Science & Technology / Press Information Bureau$$, $$2026-11-07$$,
$$["India and the EU completed negotiations for India's association with Horizon Europe.","Horizon Europe is the EU's research and innovation programme.","The release identifies Horizon Europe Pillar II clusters including health, digital technologies, industry and space, climate, energy and mobility, and food and the bioeconomy.","Association supports collaborative calls and access to European research consortia; it does not make India an EU member."]$$::jsonb,
$$[{"question":"What is the key institutional distinction in the Horizon Europe update?","answer":"India completed negotiations for association with an EU research programme; it is not joining the European Union itself."}]$$::jsonb,
$${"title":"Science diplomacy through a programme association","steps":["India and the EU maintain science-and-technology cooperation.","Negotiations establish an association route to Horizon Europe.","Researchers and institutions can pursue collaborative calls with European partners.","Joint work can support research, technology standards and innovation networks."]}$$::jsonb, $$published$$, now()
),
(
$$2026-11-09-nppa-anti-cancer-trade-margin-rationalisation$$, $$2026-11-09$$,
$$NPPA's anti-cancer medicine trade-margin cap takes effect$$,
$$The National Pharmaceutical Pricing Authority capped the maximum trade margin at 30% of MRP for 137 anti-cancer drugs. Revised prices took effect on 9 November; the official release reports that 76 companies had filed revised MRPs for 1,225 formulations covering 121 of those drugs.$$,
$$This is a high-value public-health and regulation item. It connects the NPPA, medicine affordability and the Drugs (Prices Control) Order, while testing the difference between a ceiling on trade margins and a blanket price control on every medicine.$$,
$$The NPPA functions under the Department of Pharmaceuticals. Trade Margin Rationalisation limits the margin in the supply chain for identified non-scheduled medicines; it is not the same mechanism as a scheduled formulation's ceiling price. The release says the measure follows the 17 October 2026 notification and that manufacturers may still take an annual price increase under paragraph 20(1) of the Drugs (Prices Control) Order, 2013, subject to the margin ceiling.$$,
$$Revised Prices of Anti-Cancer Medicines to Come into Effect from 9th November$$,
$$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333949&lang=1&reg=3$$,
$$National Pharmaceutical Pricing Authority / Department of Pharmaceuticals / Press Information Bureau$$, $$2026-11-07$$,
$$["NPPA capped the maximum trade margin at 30% of MRP for 137 identified anti-cancer drugs.","The revised prices came into effect on 9 November 2026.","The release reports revised MRPs for 1,225 formulations covering 121 drugs, filed by 76 companies.","Trade Margin Rationalisation is distinct from the general ceiling-price mechanism for scheduled formulations."]$$::jsonb,
$$[{"question":"Does the announcement say that every medicine is now under the same NPPA trade-margin cap?","answer":"No. The stated measure applies to the identified 137 anti-cancer drugs; the release describes a targeted trade-margin rationalisation."}]$$::jsonb,
$${"title":"How trade-margin rationalisation reaches patients","steps":["NPPA identifies an affordability concern in specified medicines.","A trade-margin ceiling applies to the identified products.","Manufacturers report revised maximum retail prices.","State Drug Controllers monitor compliance and patients can check the revised price list."]}$$::jsonb, $$published$$, now()
),
(
$$2026-11-09-e20-petrol-is-17021-quality-monitoring$$, $$2026-11-09$$,
$$Official quality-monitoring results reaffirm E20 petrol specification compliance$$,
$$The petroleum ministry said 893 E20 petrol samples drawn across 27 States and Union Territories were within the prescribed 19-21% ethanol range under BIS specification IS 17021. It also reported that 56 Karnataka samples conformed to the standard.$$,
$$The clarification is useful for questions on the Ethanol Blended Petrol Programme, fuel-quality standards and the institutional roles of public-sector oil marketing companies. It is a technical compliance update, not a change in the E20 blending target or a new fuel category.$$,
$$E20 is motor gasoline blended with about 20% ethanol. IS 17021 is the Bureau of Indian Standards specification for ethanol-blended motor gasoline. The release describes testing through the OMC/Centre for High Technology Quality Coordination Cell and notes that the Motor Spirit and High Speed Diesel Control Order, 2005 and Marketing Discipline Guidelines, 2024 set sampling and testing procedures. Ethanol blending is part of the wider effort to reduce crude-oil imports and support domestic agricultural value chains.$$,
$$E20 Petrol Supplied by PSU Oil Marketing Companies Meets Prescribed Quality Standards; 893 Samples Across 27 States and UTs Found Compliant$$,
$$https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333919&lang=1&reg=3$$,
$$Ministry of Petroleum & Natural Gas / Press Information Bureau$$, $$2026-11-07$$,
$$["E20 is motor gasoline blended with roughly 20% ethanol.","IS 17021 is the BIS specification cited for ethanol-blended motor gasoline.","The official release reports 893 samples across 27 States and UTs within the 19-21% ethanol range.","The Centre for High Technology and public-sector OMCs are part of the cited quality-monitoring arrangement."]$$::jsonb,
$$[{"question":"What does the E20 compliance update establish?","answer":"It reports that the tested samples met the cited BIS ethanol-content specification; it does not announce a new national blending percentage."}]$$::jsonb,
$${"title":"From ethanol blending to fuel-quality assurance","steps":["Ethanol is blended with petrol under prescribed specifications.","OMCs supply the blend through their distribution system.","Sampling and laboratory testing check compliance with IS 17021.","Quality monitoring supports consumers while the EBP programme advances energy-security and farm-linkage goals."]}$$::jsonb, $$published$$, now()
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
$$2026-11-09-india-eu-horizon-europe-negotiations$$,
$$2026-11-09-nppa-anti-cancer-trade-margin-rationalisation$$,
$$2026-11-09-e20-petrol-is-17021-quality-monitoring$$
)
and exams.slug in ($$cuet$$, $$ssc-cgl$$, $$uppsc-ro-aro$$, $$up-secretariat-ro-aro$$)
on conflict (brief_id, exam_id) do nothing;
