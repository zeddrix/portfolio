# Resume page density — portfolio-led wave — 2026-06-18

## Scope

1-page compact layout: short summary, inline skills, 6 compact roles, 4 flagship projects (Adverio, UseDelight, MERN's Shop, Queue), no page 2.

## Visual checkpoints

- `reference/screenshots/resumes/variants/portfolio-led-page-1.png`

## Findings

| Severity | Finding                                                                                | Status |
| -------- | -------------------------------------------------------------------------------------- | ------ |
| None     | PDF prints exactly 1 page                                                              | Done   |
| None     | 6 compact timeline roles + 4 featured projects + inline skills all visible on one page | Done   |
| None     | Content fills ~90% of page height; ribbon headers legible at 8pt body                  | Done   |
| None     | No `resume-page-2` in HTML or PDF                                                      | Done   |

## Fixes applied

- `density-compact-one-page` CSS at 8pt body with tuned row gaps
- `onePageProjectSlugs` resolves Adverio, UseDelight, MERN's Shop, Queue

## Verification

- `pnpm exec vitest run scripts/resume-page-count.test.ts -t portfolio-led` — 1 passed
- `pnpm exec playwright test tests/visual/resume-application-variants-capture.spec.ts --config playwright.visual.config.ts -g portfolio-led` — 1 passed
