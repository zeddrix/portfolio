# Application resume sidebar ribbon fold — 2026-06-19

## Scope

Fix detached ribbon fold on multi-line sidebar labels (especially **Professional Development**) by replacing the fixed border triangle with a full-height `clip-path` chevron on `::after`.

## Screenshots

- `reference/screenshots/resumes/application-page-1-rail.png`
- `reference/screenshots/resumes/application-sidebar-ribbon-professional-development.png`

## Changes

- [`scripts/application-resume/shared.ts`](../scripts/application-resume/shared.ts): `clip-path` chevron (`top: 0; bottom: 0`) on ribbon `::after`; `overflow: visible`; extra right padding for fold clearance.
- `buildSidebarRibbon()` emits `data-testid="resume-sidebar-ribbon-{slug}"` for visual capture.
- [`scripts/resume-sidebar-ribbon.test.ts`](../scripts/resume-sidebar-ribbon.test.ts): CSS contract + sidebar ribbon testids.

## Verification

- `pnpm exec vitest run scripts/resume-sidebar-ribbon.test.ts scripts/resume-application-html.test.ts scripts/resume-page-count.test.ts` — 5 passed
- `pnpm generate:resume` + `pnpm screenshots:resume` — rail + ribbon checkpoints refreshed
- PDF remains 2 pages

## Findings

| Severity | Finding                                                                    | Status |
| -------- | -------------------------------------------------------------------------- | ------ |
| High     | Professional Development fold looked like detached triangle on tall ribbon | Done   |
| None     | Fold tip vertically centered on multi-line ribbon                          | Done   |
| None     | Single-line ribbons (Contact, Languages) proportion unchanged              | Done   |
| None     | Four sidebar ribbons have stable `data-testid`s                            | Done   |

## Before / after

- **Before:** Fixed 10px border triangle pinned to `top: 0` — stub on two-line ribbons.
- **After:** Full-height charcoal chevron aligned with ribbon bar height.
