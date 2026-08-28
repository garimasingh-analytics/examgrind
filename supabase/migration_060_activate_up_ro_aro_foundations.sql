-- The UPPSC RO/ARO and UP Secretariat RO/ARO routes passed founder review and
-- are now available as ExamGrind foundation practice. These remain original
-- practice sets rather than claims about a fixed future official paper scheme.

update public.mock_tests
set is_active = true
where slug in (
  'uppsc-ro-aro-foundation-practice',
  'up-secretariat-ro-aro-foundation-practice'
);
