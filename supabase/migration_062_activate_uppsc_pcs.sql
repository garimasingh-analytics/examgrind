-- UPPSC PCS passed founder review. Make the original foundation practice
-- discoverable without representing it as a fixed official future-paper scheme.

update public.exams
set status = 'live'
where slug = 'uppsc-pcs';

update public.mock_tests
set is_active = true
where slug = 'uppsc-pcs-foundation-practice';
