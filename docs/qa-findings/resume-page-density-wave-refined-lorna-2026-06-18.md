# Resume page density — refined-lorna wave — 2026-06-18

## Scope

2-page maximized layout: 8+4 experience split, expanded selected projects, richer more-projects grid, `density-maximized` CSS.

## Visual checkpoints

- `reference/screenshots/resumes/variants/refined-lorna-page-1.png`
- `reference/screenshots/resumes/variants/refined-lorna-page-2.png`
- `reference/screenshots/resumes/variants/refined-lorna-rail.png`
- `reference/screenshots/resumes/variants/refined-lorna-main.png`

## Findings

| Severity | Finding                                                                                            | Status |
| -------- | -------------------------------------------------------------------------------------------------- | ------ |
| None     | PDF prints exactly 2 pages                                                                         | Done   |
| None     | Page 1: sidebar ribbons legible; 8 experience rows with 1 bullet each; summary not orphaned        | Done   |
| None     | Page 2: 4 compact continued roles; 3 expanded selected projects (2 detail lines each); 7-card grid | Done   |
| None     | Page 2 languages footer anchors bottom; fill ~95% with ≤0.5in bottom gap                           | Done   |

## Fixes applied

- Restored page-2 compact timeline rows per plan
- `buildProjectExpandedHtml` uses up to 2 `projectBullets` lines per project
- Added `buildFooterLanguagesHtml` on page 2
- `layout-refined-lorna` page-two spacing tuned

## Verification

- `pnpm exec vitest run scripts/resume-page-count.test.ts -t refined-lorna` — 1 passed
- `pnpm exec playwright test tests/visual/resume-application-variants-capture.spec.ts --config playwright.visual.config.ts -g refined-lorna` — 1 passed
