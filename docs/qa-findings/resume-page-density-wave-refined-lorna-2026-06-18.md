# Resume page density — refined-lorna wave — 2026-06-18

## Scope

2-page layout: all 12 Professional Experience jobs on page 1; page 2 is Selected + More Projects only.

## Visual checkpoints

- `reference/screenshots/resumes/variants/refined-lorna-page-1.png`
- `reference/screenshots/resumes/variants/refined-lorna-page-2.png`
- `reference/screenshots/resumes/variants/refined-lorna-rail.png`
- `reference/screenshots/resumes/variants/refined-lorna-main.png`

## Findings

| Severity | Finding                                                                                         | Status   |
| -------- | ----------------------------------------------------------------------------------------------- | -------- |
| None     | PDF prints exactly 2 pages                                                                      | Done     |
| None     | Page 1: all 12 jobs with 1 bullet each; sidebar ribbons legible; no experience on page 2        | Done     |
| None     | Page 2: Selected Projects (3 expanded) + More Projects (7-card grid) only; no continued section | Done     |
| Low      | Page 2 has moderate bottom whitespace without languages footer                                  | Accepted |

## Fixes applied

- `firstPageExperienceCount: 12` for refined-lorna
- Removed page-2 experience section and languages footer
- Page-one CSS tuned to maximize vertical fill (tighter gaps, reduced padding)

## Verification

- `pnpm exec vitest run scripts/resume-page-count.test.ts -t refined-lorna` — 1 passed
- `pnpm exec playwright test tests/visual/resume-application-variants-capture.spec.ts --config playwright.visual.config.ts -g refined-lorna` — 1 passed
