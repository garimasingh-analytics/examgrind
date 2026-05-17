-- ======================================================================
-- Migration 005: Simplify schema for Duolingo-style v1.
-- Drops the Avatar TLA story system + houses + cosmetics.
-- Keeps subjects → chapters → topics, user_topic_mastery, and the
-- original 4 quiz tables.
-- ======================================================================

-- 1) Drop story / cosmetic / progress tables (cascade drops policies)
drop table if exists public.user_progress      cascade;
drop table if exists public.story_nodes        cascade;
drop table if exists public.story_arcs         cascade;
drop table if exists public.user_cosmetics     cascade;
drop table if exists public.cosmetics          cascade;

-- 2) Drop columns we no longer need from public.users
alter table public.users drop column if exists house;
alter table public.users drop column if exists avatar_config;

-- 3) Drop the story-node FK column we added to quizzes
alter table public.quizzes drop column if exists story_node_id;

-- 4) Verification
select
  (select count(*) from public.subjects)              as subjects,
  (select count(*) from public.chapters)              as chapters,
  (select count(*) from public.topics)                as topics,
  (select count(*) from public.user_topic_mastery)    as mastery_rows,
  (select count(*) from public.users)                 as users;
