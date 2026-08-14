# Tracking Plan Changelog

## [1.3.0] - 2026-08-14

### Added

- `study_hub_viewed` for public Study Hub and official-updates usage.
- `study_guide_viewed` for individual guide readership.

### Changed

- `diagnosis_handoff_action.action` now includes `read_guide`.
- Subscription and access-product enums now include the annual Coach plan.

## [1.1.0] - 2026-07-26

### Added

- `daily_mission_completed` for a non-empty quiz completed from the current daily mission.

### Preserved

- The existing anonymous, consent-gated GA4 delivery model and event naming convention.
