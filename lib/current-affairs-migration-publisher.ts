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

const editorialMigrationFiles = [
  "migration_082_current_affairs_2026_09_04_non_pib_briefs.sql",
  "migration_083_current_affairs_2026_09_04_breadth_desk.sql",
  "migration_085_current_affairs_2026_09_05_morning_desk.sql",
  "migration_088_current_affairs_2026_09_06_daily_desk.sql",
  "migration_089_current_affairs_2026_09_07_recovered_desk.sql",
  "migration_093_current_affairs_2026_09_08_daily_desk.sql",
  "migration_098_current_affairs_2026_09_09_daily_desk.sql",
  "migration_099_current_affairs_2026_09_10_daily_desk.sql",
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
      candidateCount: 22,
      publishedCount: 5,
      notes: "Checked all 19 active source-registry desks: PIB and ministry releases; RBI; SEBI; CCI; IFSCA; NITI Aayog; NDMA; MoSPI; Supreme Court; Lok Sabha; Rajya Sabha; ECI; MyGov; myScheme; the State/UT directory; and the monthly Yojana/Kurukshetra context desks. Broadened candidate discovery through trustworthy current-affairs materials and verified each published development against its original official release. Published the CCEA's two distinct railway multi-tracking approval packages, India's 6G Leadership and Security Call to Action endorsement, UIDAI's Aadhaar Face Authentication SDK and Sandbox, and the launch of ORV Sagar Manthan under the Deep Ocean Mission. Excluded ceremonial visits and speeches, routine meetings, workshops, awards, enforcement and seizure notices, duplicate or already-covered releases, and prospective announcements such as DILRMP 3.0 guidelines that were scheduled after this desk's verification window.",
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
