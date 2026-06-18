# Resume page density — executive wave — 2026-06-18

## Scope

2-page maximized layout: compact skills band, 8+4 experience, 2 bullets on page-1 roles, expanded projects + certs/languages footer on page 2.

## Visual checkpoints

- `reference/screenshots/resumes/variants/executive-page-1.png`
- `reference/screenshots/resumes/variants/executive-page-2.png`

## Findings

| Severity | Finding                                                                                           | Status   |
| -------- | ------------------------------------------------------------------------------------------------- | -------- |
| None     | PDF prints exactly 2 pages                                                                        | Done     |
| None     | Page 1: compact skills band in 2-column grid; 8 non-compact timeline rows with 2 bullets          | Done     |
| None     | Page 2: 4 compact continued roles; expanded projects; more grid; professional development footer  | Done     |
| Low      | Page 1 bottom whitespace ~1.5in (skills band + summary consume top half; 2-page budget trade-off) | Accepted |

## Fixes applied

- `pageOneBulletCount: 2` for executive in config
- Page-2 compact timeline rows per plan
- Expanded projects use 2 `projectBullets` lines
- `layout-executive` page-one timeline spacing tuned to 12px

## Verification

- `pnpm exec vitest run scripts/resume-page-count.test.ts -t executive` — 1 passed
- `pnpm exec playwright test tests/visual/resume-application-variants-capture.spec.ts --config playwright.visual.config.ts -g executive` — 1 passed
