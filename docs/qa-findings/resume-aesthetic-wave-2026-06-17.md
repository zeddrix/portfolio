# Resume aesthetic + timeline wave — 2026-06-17

## Scope

Application resume aesthetic (navy rail, cards), 12-row chrono Experience, LinkedIn PDF/DOCX refresh, portfolio `displayPeriod` on project pages, cert source script, SEO cert E2E.

## Visual checkpoints

- `reference/screenshots/resumes/application-page-1.png`
- `reference/screenshots/resumes/application-page-1-rail.png`
- `reference/screenshots/resumes/application-page-1-main.png`
- `reference/screenshots/resumes/application-page-2.png`
- `reference/screenshots/resumes/linkedin-top.png`
- `reference/screenshots/resumes/linkedin-mid.png`

## Findings

| Severity | Finding                                                                                                 | Status                  |
| -------- | ------------------------------------------------------------------------------------------------------- | ----------------------- |
| Low      | Page 1 is dense with 12 Experience rows + 3 selected projects; acceptable for 2-page target             | Accepted                |
| Low      | Certificate JPEG originals absent from `static/certificates/`; copy script warns and skips if no backup | Note for manual restore |
| None     | Navy rail, period labels, chrono order, Selected/Additional split verified in HTML tests                | Done                    |

## Verification

- `pnpm quality` — green
- `pnpm test:unit` — 85 passed
- `pnpm test:e2e:projects` — 37 passed
- `pnpm test:e2e:seo` — 8 passed
- `pnpm generate:resume` — PDF + DOCX + HTML emitted
