# Resume layout variants — page density retune — 2026-06-18

## Scope

Per-layout page budgets: refined-lorna and executive maximized at 2 pages (8+4 experience); portfolio-led compact at 1 page (6 roles + 4 projects). Default shipping PDF copies from refined-lorna.

## Variant outputs

| Layout        | Pages | HTML                                                    | PDF                                                       |
| ------------- | ----- | ------------------------------------------------------- | --------------------------------------------------------- |
| Refined Lorna | 2     | `resume/variants/refined-lorna/resume-application.html` | `resume/variants/refined-lorna/Zeddrix-Fabian-Resume.pdf` |
| Executive     | 2     | `resume/variants/executive/resume-application.html`     | `resume/variants/executive/Zeddrix-Fabian-Resume.pdf`     |
| Portfolio-led | 1     | `resume/variants/portfolio-led/resume-application.html` | `resume/variants/portfolio-led/Zeddrix-Fabian-Resume.pdf` |

Default: `resume/Zeddrix-Fabian-Resume.pdf` (refined-lorna copy).

## Visual checkpoints

- `reference/screenshots/resumes/variants/refined-lorna-page-{1,2}.png`
- `reference/screenshots/resumes/variants/refined-lorna-rail.png`
- `reference/screenshots/resumes/variants/refined-lorna-main.png`
- `reference/screenshots/resumes/variants/executive-page-{1,2}.png`
- `reference/screenshots/resumes/variants/portfolio-led-page-1.png`
- `reference/screenshots/resumes/application-page-{1,2}.png` (default copy)

## Per-wave findings

| Wave          | Doc                                                                                                            | Open high/medium |
| ------------- | -------------------------------------------------------------------------------------------------------------- | ---------------- |
| Refined Lorna | [resume-page-density-wave-refined-lorna-2026-06-18.md](./resume-page-density-wave-refined-lorna-2026-06-18.md) | 0                |
| Executive     | [resume-page-density-wave-executive-2026-06-18.md](./resume-page-density-wave-executive-2026-06-18.md)         | 0                |
| Portfolio-led | [resume-page-density-wave-portfolio-led-2026-06-18.md](./resume-page-density-wave-portfolio-led-2026-06-18.md) | 0                |

## Summary findings

| Severity | Finding                                                                                              | Status   |
| -------- | ---------------------------------------------------------------------------------------------------- | -------- |
| None     | Page counts: refined-lorna 2, executive 2, portfolio-led 1                                           | Done     |
| None     | Refined Lorna: 8+4 split (page-2 compact), expanded selected (2 lines), languages footer             | Done     |
| None     | Executive: compact skills band, 8 non-compact page-1 rows (2 bullets), page-2 compact + certs footer | Done     |
| None     | Portfolio-led: 6 compact roles + 4 flagship projects on single page                                  | Done     |
| Low      | Executive page 1 ~1in bottom whitespace (skills band trade-off on 2-page budget)                     | Accepted |

## Verification

- `pnpm exec vitest run scripts/resume-application-html.test.ts scripts/application-resume-layouts.test.ts scripts/resume-page-count.test.ts` — 8 passed
- `pnpm generate:resume` — 3 variant HTML/PDF pairs + default copy
- `pnpm screenshots:resume:variants` — variant captures refreshed
- `pnpm screenshots:resume` — default application captures refreshed
- `pnpm quality` — green
- `pnpm test:unit` — 123 passed
- `pnpm test:e2e` — all E2E files passed (one-by-one run)
