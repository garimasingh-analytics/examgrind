import { readFile } from "fs/promises";
import path from "path";

type CurrentAffairsBrief = {
  slug: string;
  published_on: string;
  title: string;
  summary: string;
  why_it_matters: string;
  background: string;
  source_title: string;
  source_url: string;
  source_publisher: string;
  source_published_on: string;
  prelims_takeaways: string[];
  quick_check: Array<{ question: string; answer: string }>;
  visual_data: { title: string; steps: string[] };
  status: "published";
  reviewed_at: string;
};

type CurrentAffairsSourceSeed = {
  slug: string;
  name: string;
  publisher: string;
  source_url: string;
  source_type: "portal" | "magazine";
  cadence: "monthly" | "as_published";
  editorial_focus: string;
  is_active: true;
};

const sourceRegistryExpansion: CurrentAffairsSourceSeed[] = [
  { slug: "yojana", name: "Yojana", publisher: "Publications Division, Ministry of Information and Broadcasting", source_url: "https://www.publicationsdivision.nic.in/journals/index.php?route=page%2Fyojana", source_type: "magazine", cadence: "monthly", editorial_focus: "Monthly policy and development context. Use a newly available issue as reference material; do not present it as a daily news feed.", is_active: true },
  { slug: "kurukshetra", name: "Kurukshetra", publisher: "Publications Division, Ministry of Information and Broadcasting", source_url: "https://www.publicationsdivision.nic.in/journals/index.php?cid=4&lang=English&route=page%2Fajkalarchives&year=2023", source_type: "magazine", cadence: "monthly", editorial_focus: "Monthly rural-development and agriculture context. Use a newly available issue as reference material; do not present it as a daily news feed.", is_active: true },
  { slug: "supreme-court-updates", name: "All updates and press releases", publisher: "Supreme Court of India", source_url: "https://www.sci.gov.in/all-updates/", source_type: "portal", cadence: "as_published", editorial_focus: "Constitutional law, judicial administration, legal aid, e-Courts and major institutional developments. Exclude routine listing notices.", is_active: true },
  { slug: "lok-sabha-digital-sansad", name: "Lok Sabha updates", publisher: "Parliament of India", source_url: "https://sansad.in/ls", source_type: "portal", cadence: "as_published", editorial_focus: "Legislation, parliamentary procedure, committees, questions and institutional updates. Verify enactments against the authoritative bill or gazette record.", is_active: true },
  { slug: "rajya-sabha-digital-sansad", name: "Rajya Sabha updates", publisher: "Parliament of India", source_url: "https://sansad.in/rs", source_type: "portal", cadence: "as_published", editorial_focus: "Legislation, parliamentary procedure, committees, questions and institutional updates. Verify enactments against the authoritative bill or gazette record.", is_active: true },
  { slug: "eci", name: "Election Commission updates", publisher: "Election Commission of India", source_url: "https://www.eci.gov.in/", source_type: "portal", cadence: "as_published", editorial_focus: "Election law, voter services, electoral technology and official directions. Exclude routine election-event notices unless they establish a wider exam-relevant development.", is_active: true },
  { slug: "sebi-press-releases", name: "Press releases", publisher: "Securities and Exchange Board of India", source_url: "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=6&ssid=23", source_type: "portal", cadence: "as_published", editorial_focus: "Capital markets, investor protection, market infrastructure and securities regulation.", is_active: true },
  { slug: "cci-press-releases", name: "Antitrust press releases", publisher: "Competition Commission of India", source_url: "https://www.cci.gov.in/antitrust/press-release", source_type: "portal", cadence: "as_published", editorial_focus: "Competition law, combinations, market conduct and institutional enforcement. Link the published decision when an order is central to the brief.", is_active: true },
  { slug: "ifsca-news", name: "News and updates", publisher: "International Financial Services Centres Authority", source_url: "https://ifsca.gov.in/Home/NewSection", source_type: "portal", cadence: "as_published", editorial_focus: "International Financial Services Centre regulation, financial-market development and related innovation.", is_active: true },
  { slug: "niti-aayog", name: "News and publications", publisher: "NITI Aayog", source_url: "https://www.niti.gov.in/", source_type: "portal", cadence: "as_published", editorial_focus: "Policy reports, cooperative federalism, SDGs, innovation and evaluation. Prefer the underlying report or release over a headline.", is_active: true },
  { slug: "ndma", name: "National Disaster Management Authority updates", publisher: "National Disaster Management Authority", source_url: "https://ndma.gov.in/", source_type: "portal", cadence: "as_published", editorial_focus: "Disaster-risk reduction, preparedness, early warning, guidelines and response institutions.", is_active: true },
  { slug: "mospi", name: "Ministry updates and statistical releases", publisher: "Ministry of Statistics and Programme Implementation", source_url: "https://www.mospi.gov.in/", source_type: "portal", cadence: "as_published", editorial_focus: "Official statistics, surveys, indices, programme implementation and data-methodology changes.", is_active: true },
  { slug: "state-government-portals", name: "States and Union Territories directory", publisher: "National Portal of India", source_url: "https://www.india.gov.in/my-government/states-uts", source_type: "portal", cadence: "as_published", editorial_focus: "Route to relevant State and Union Territory authorities. Publish only where the original state government release or order is accessible and has national or syllabus value.", is_active: true },
];

export function currentAffairsSourceRegistryExpansion() {
  return sourceRegistryExpansion;
}

const editorialMigrationFiles = [
  // Prioritise the two newly completed desks for the next protected publish.
  "migration_100_current_affairs_2026_09_11_daily_desk.sql",
  "migration_102_current_affairs_2026_09_11_expansion.sql",
  "migration_101_current_affairs_2026_09_12_daily_desk.sql",
  "migration_103_current_affairs_2026_09_13_daily_desk.sql",
  // Then make the previously reviewed archive available to the same production path.
  "migration_099_current_affairs_2026_09_10_daily_desk.sql",
  "migration_104_current_affairs_2026_09_10_expansion.sql",
  "migration_098_current_affairs_2026_09_09_daily_desk.sql",
  "migration_093_current_affairs_2026_09_08_daily_desk.sql",
  "migration_089_current_affairs_2026_09_07_recovered_desk.sql",
  "migration_088_current_affairs_2026_09_06_daily_desk.sql",
  "migration_085_current_affairs_2026_09_05_morning_desk.sql",
  "migration_082_current_affairs_2026_09_04_non_pib_briefs.sql",
  "migration_083_current_affairs_2026_09_04_breadth_desk.sql",
  "migration_078_current_affairs_2026_09_03_morning_digest.sql",
  "migration_073_current_affairs_2026_09_02_editorial_batch.sql",
  "migration_074_current_affairs_2026_09_01_editorial_batch.sql",
  "migration_075_current_affairs_2026_08_31_editorial_batch.sql",
  "migration_077_current_affairs_2026_08_30_editorial_expansion.sql",
  "migration_079_current_affairs_2026_08_29_editorial_batch.sql",
  "migration_080_current_affairs_2026_08_28_editorial_batch.sql",
  "migration_081_current_affairs_2026_08_27_editorial_batch.sql",
];

export function currentAffairsRunAudit(runDate: string) {
  if (runDate === "2026-09-06") {
    return {
      candidateCount: 10,
      publishedCount: 3,
      notes: "Checked PIB, RBI, SEBI, CCI, IFSCA, Supreme Court, Lok Sabha, Rajya Sabha, ECI, NITI Aayog, NDMA, MoSPI, MyGov, myScheme, state-portal directory, and monthly Yojana/Kurukshetra desks. Published ECLGS 5.0 uptake, coal/lignite-gasification application status, and RBI Second-Schedule inclusion. Excluded ceremonial Teachers’ Day material; routine auctions, VRRR operations and individual enforcement actions; routine SAIL performance; already-covered announcements; and desks with no qualifying new release.",
    };
  }

  if (runDate === "2026-09-07") {
    return {
      candidateCount: 7,
      publishedCount: 3,
      notes: "Recovered the full PIB ministry release index after the initial RSS-style pass missed substantive 5-6 September releases. Checked all 19 active registry desks: PIB; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and monthly Yojana/Kurukshetra. Published National Biodiversity Authority Access and Benefit-Sharing disbursement, Vibrant Villages Programme two-phase coverage, and the 16th National Meet of State Biodiversity Boards and Union Territory Biodiversity Councils. Excluded ceremonial messages, meetings without a durable policy or institutional development, routine notices, and material already covered in prior briefs.",
    };
  }

  if (runDate === "2026-09-08") {
    return {
      candidateCount: 16,
      publishedCount: 6,
      notes: "Checked all active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and the monthly Yojana/Kurukshetra context desks. Published DAC Acceptance of Necessity approvals, NCAP/Swachh Vayu Sarvekshan progress, DGFT Certificate of Origin APIs, NITI Aayog PACT and the ZET Marketplace, the ECI October bye-election schedule, and IFSCA market-abuse regulations. Excluded ceremonial messages, speeches, routine workshops and recruitment notices, individual enforcement or public-issue entries, duplicate coverage, and releases without a durable policy, institutional, regulatory or exam-relevant development.",
    };
  }

  if (runDate === "2026-09-09") {
    return {
      candidateCount: 19,
      publishedCount: 5,
      notes: "Checked all 19 active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and the monthly Yojana/Kurukshetra context desks. Broadened candidate discovery through current-affairs materials and verified candidates against primary sources before publication. Published DoT's Financial Fraud Risk Indicator, PM-SETU ITI-cluster approvals, CRCS-Sahara refund-portal restoration, the coal-sector CSR framework, and Exercise Veer Guardian-2026. Excluded routine RBI liquidity operations, auctions, redemption prices and survey launches; ceremonies, speeches, workshops, recruitment and individual enforcement notices; stale items that predated the completed desk; duplicate coverage; and releases without a durable policy, institutional, regulatory or exam-relevant development.",
    };
  }

  if (runDate === "2026-09-10") {
    return {
      candidateCount: 27,
      publishedCount: 8,
      notes: "Checked all 19 active source-registry desks and coaching/current-affairs discovery sources, then verified every published item against its primary official release. Published the two distinct CCEA rail multi-tracking packages, the 6G Call to Action endorsement, UIDAI's face-authentication SDK and sandbox, ORV Sagar Manthan, Rashtriya Poshan Maah 2026, Nasha Mukt Bharat Abhiyaan MoUs, and CeNS metal-free organic photocatalyst research. Excluded speeches, ceremony-only notices, routine meetings, workshops, awards, recruitment, enforcement and seizure notices, duplicates, prospective announcements and releases without durable exam relevance. Yojana and Kurukshetra remained monthly context only.",
    };
  }

  if (runDate === "2026-09-11") {
    return {
      candidateCount: 29,
      publishedCount: 8,
      notes: "Checked all 19 active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and monthly Yojana/Kurukshetra context desks. Broadened candidate discovery through trustworthy coaching and current-affairs materials, then verified every published item against its original primary official release. Published the Consumer Protection (E-Commerce) (Amendment) Rules, 2026; DILRMP 3.0 guidelines; NSO's first district-level ASUSE estimates; SEBI-RBI's Demat 2.0 tokenised-corporate-bond pilot; the national HPV vaccination milestone; commencement of the Bankers’ Books Evidence Act, 2026; State BOCW welfare and cess digital tools; and IPC's Enoxaparin reference substance. Excluded ceremonial visits and speeches, workshops and training events, routine recruitment, individual enforcement and recovery notices, port calls, stale material, duplicate coverage, and releases without a durable policy, institutional, regulatory, statistical or exam-relevant development. Yojana and Kurukshetra were checked only for newly available monthly context; neither was used as a daily news feed.",
    };
  }

  if (runDate === "2026-09-13") {
    return {
      candidateCount: 22,
      publishedCount: 8,
      notes: "Checked all 19 active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and monthly Yojana/Kurukshetra context desks. Broadened discovery through public current-affairs material, then verified every published item against an original official release. Published the BRICS New Delhi Declaration, the India-China bilateral border-peace record, India''s planned Kota Kinabalu consulate, the CSL-Drydocks World ship-repair JV, PMAY-U 2.0 sanctions, Badri-cattle OPU-IVF, the Colombo Security Conclave tabletop exercise, and PM-ABHIM facilities in Andhra Pradesh. Excluded routine speeches, ceremony-only releases, workshops, recruitment and enforcement notices, announcements without a durable development, duplicates already covered in the 11-12 September desks, and consultations or proposals not yet final. Yojana and Kurukshetra were checked only as monthly context and were not used as daily news feeds.",
    };
  }

  if (runDate === "2026-09-12") {
    return {
      candidateCount: 24,
      publishedCount: 8,
      notes: "Checked all 19 active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and monthly Yojana/Kurukshetra context desks. Broadened candidate discovery through trustworthy coaching and current-affairs materials, but verified every published brief against its original official release or regulator record. Published TRAI's television-advertisement QoS repeal; consultation on a proposed stronger Seed Act; MoTA's FRA implementation review; Social Justice scholarship delivery reforms; India's 2026 BRICS chairship and summit; the PMMSY six-year fisheries update; BEE's commercial electric-cooking directory and standards work; and the ninth ASEAN-India agriculture and forestry ministerial meeting. Excluded a SEBI consultation paper because it is not a final regulatory action; speeches, workshops, training and ceremonial material with no durable policy or institutional development; routine recruitment and enforcement notices; individual court and election-event items without a durable development; unverified State-policy claims without an accessible original release; stale or duplicate material; and releases without exam relevance. Yojana and Kurukshetra were checked only as monthly context and were not used as daily news feeds.",
    };
  }
  return null;
}

function splitTopLevel(input: string) {
  const values: string[] = [];
  let start = 0;
  let depth = 0;
  let inSingleQuote = false;
  let inDollarQuote = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (!inSingleQuote && char === "$" && next === "$") {
      inDollarQuote = !inDollarQuote;
      index += 1;
      continue;
    }
    if (!inDollarQuote && char === "'") {
      if (inSingleQuote && next === "'") {
        index += 1;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (inSingleQuote || inDollarQuote) continue;
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      values.push(input.slice(start, index).trim());
      start = index + 1;
    }
  }
  values.push(input.slice(start).trim());
  return values;
}

function extractTuples(sql: string) {
  const valuesStart = sql.indexOf(") values");
  const conflictStart = sql.indexOf("\non conflict (slug)");
  if (valuesStart < 0 || conflictStart < 0) throw new Error("Current-affairs migration has an unsupported format.");
  const valuesSql = sql.slice(valuesStart + ") values".length, conflictStart).trim();
  const tuples: string[] = [];
  let start = -1;
  let depth = 0;
  let inSingleQuote = false;
  let inDollarQuote = false;

  for (let index = 0; index < valuesSql.length; index += 1) {
    const char = valuesSql[index];
    const next = valuesSql[index + 1];
    if (!inSingleQuote && char === "$" && next === "$") {
      inDollarQuote = !inDollarQuote;
      index += 1;
      continue;
    }
    if (!inDollarQuote && char === "'") {
      if (inSingleQuote && next === "'") {
        index += 1;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (inSingleQuote || inDollarQuote) continue;
    if (char === "(") {
      if (depth === 0) start = index + 1;
      depth += 1;
    }
    if (char === ")") {
      depth -= 1;
      if (depth === 0 && start >= 0) tuples.push(valuesSql.slice(start, index));
    }
  }
  return tuples;
}

function decodeSqlText(value: string) {
  const trimmed = value.trim().replace(/::jsonb$/, "").trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) return trimmed.slice(2, -2);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  throw new Error("Current-affairs migration contains an unsupported text value.");
}

function parseBrief(tuple: string): Omit<CurrentAffairsBrief, "reviewed_at"> {
  const fields = splitTopLevel(tuple);
  if (fields.length !== 15) throw new Error(`Expected 15 current-affairs fields, received ${fields.length}.`);
  return {
    slug: decodeSqlText(fields[0]),
    published_on: decodeSqlText(fields[1]),
    title: decodeSqlText(fields[2]),
    summary: decodeSqlText(fields[3]),
    why_it_matters: decodeSqlText(fields[4]),
    background: decodeSqlText(fields[5]),
    source_title: decodeSqlText(fields[6]),
    source_url: decodeSqlText(fields[7]),
    source_publisher: decodeSqlText(fields[8]),
    source_published_on: decodeSqlText(fields[9]),
    prelims_takeaways: JSON.parse(decodeSqlText(fields[10])),
    quick_check: JSON.parse(decodeSqlText(fields[11])),
    visual_data: JSON.parse(decodeSqlText(fields[12])),
    status: "published",
  };
}

export async function loadReviewedCurrentAffairs() {
  const migrationsRoot = path.join(process.cwd(), "supabase");
  const files = await Promise.all(editorialMigrationFiles.map((file) => readFile(path.join(migrationsRoot, file), "utf8")));
  const reviewedAt = new Date().toISOString();
  const bySlug = new Map<string, CurrentAffairsBrief>();
  for (const sql of files) {
    for (const tuple of extractTuples(sql)) {
      const brief = parseBrief(tuple);
      bySlug.set(brief.slug, { ...brief, reviewed_at: reviewedAt });
    }
  }
  return Array.from(bySlug.values());
}
