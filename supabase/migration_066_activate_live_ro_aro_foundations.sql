-- These foundation-practice routes were activated in migration 060. Keep the
-- exam catalogue record aligned with their student-facing availability. This
-- does not claim a notification-specific paper structure or recruitment date.

update public.exams
set status = 'live'
where slug in ('uppsc-ro-aro', 'up-secretariat-ro-aro');
