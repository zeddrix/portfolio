# Resume layout variants — 2026-06-18

## Scope

Three application resume layout variants with shared tiered polish (typography, timeline v2, project grids). Default shipping PDF copies from `refined-lorna`.

## Variant outputs

| Layout        | HTML                                                    | PDF                                                       |
| ------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Refined Lorna | `resume/variants/refined-lorna/resume-application.html` | `resume/variants/refined-lorna/Zeddrix-Fabian-Resume.pdf` |
| Executive     | `resume/variants/executive/resume-application.html`     | `resume/variants/executive/Zeddrix-Fabian-Resume.pdf`     |
| Portfolio-led | `resume/variants/portfolio-led/resume-application.html` | `resume/variants/portfolio-led/Zeddrix-Fabian-Resume.pdf` |

Default: `resume/Zeddrix-Fabian-Resume.pdf` (refined-lorna copy). Change `DEFAULT_APPLICATION_RESUME_LAYOUT` in `scripts/application-resume-config.ts` after choosing.

## Visual checkpoints

- `reference/screenshots/resumes/variants/refined-lorna-page-{1,2}.png`
- `reference/screenshots/resumes/variants/refined-lorna-rail.png`
- `reference/screenshots/resumes/variants/refined-lorna-main.png`
- `reference/screenshots/resumes/variants/executive-page-{1,2}.png`
- `reference/screenshots/resumes/variants/portfolio-led-page-{1,2}.png`
- `reference/screenshots/resumes/application-page-{1,2}.png` (default copy)

## Findings

| Severity | Finding                                                                                    | Status                     |
| -------- | ------------------------------------------------------------------------------------------ | -------------------------- |
| None     | All three layouts print exactly 2 pages                                                    | Done                       |
| None     | Refined Lorna: 6+6 split, ribbon headers, 2-col More Projects, timeline role/company split | Done                       |
| None     | Executive: skills band, no sidebar, 7+5 experience                                         | Done                       |
| None     | Portfolio-led: 2 featured projects on page 1, project index grid on page 2                 | Done                       |
| Low      | Portfolio-led page 2 still has moderate whitespace at bottom                               | Accepted                   |
| Low      | Executive page 1 is dense with skills band + 7 roles                                       | Accepted for 2-page target |

## Verification

- `pnpm exec vitest run scripts/resume-application-html.test.ts scripts/application-resume-layouts.test.ts scripts/resume-page-count.test.ts` — 8 passed
- `pnpm generate:resume` — 3 variant HTML/PDF pairs + default copy
- `pnpm screenshots:resume:variants` — variant captures refreshed
- `pnpm screenshots:resume` — default application captures refreshed
- `pnpm quality` — green
- `pnpm test:unit` — 112 passed
