-- Migration 011: Drop NEET PG entirely (focus on CUET UG + SSC CGL + NEET UG)
--
-- Decision: "1000% polished or nothing" rule applies hardest to NEET PG
-- because Claude isn't a board-certified physician — LLM-generated MCQs
-- about drug doses, contraindications, and clinical staging carry real
-- factual-error risk for the MBBS-grad audience.
--
-- Better to ship 3 exams great than 4 mediocre. NEET PG can come back
-- later once we have a doctor reviewer or coaching-centre partner who
-- can vet questions.
--
-- This removes:
--   - exams row for 'neet-pg'        (1 row)
--   - subjects rows with np-* prefix (19 rows, via ON DELETE CASCADE)
--   - chapters under those subjects  (179 rows, via cascade)
--
-- Run with: paste into Supabase SQL Editor
-- Irreversible: re-running migrations 007 + 010 would restore it.

delete from exams where slug = 'neet-pg';

-- Verify:
--   select slug, name, status from exams order by display_order;
--   -- expect: cuet, ssc-cgl, neet-ug (no neet-pg row)
--   select count(*) from subjects where id like 'np-%';
--   -- expect: 0
