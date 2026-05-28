-- Migration 007: Add NEET PG to exams
--
-- NEET PG is the postgraduate medical entrance exam for MBBS graduates
-- seeking MD/MS seats. Different audience from NEET UG (12th-pass students)
-- so we list them as separate cards. Same 50/50 partner revenue share applies.
--
-- Run with: supabase db push  OR  paste into Supabase SQL Editor
-- Reversibility: delete from exams where slug = 'neet-pg';

insert into exams (slug, name, status, description, display_order, hero_color) values
  ('neet-pg', 'NEET PG', 'waitlist', '19 medical PG subjects · For MBBS graduates', 45, 'ember')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  hero_color = excluded.hero_color;

-- Verify with:
--   select slug, name, status, display_order from exams order by display_order;
