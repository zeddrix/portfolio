# Lorna light ribbon application resume — 2026-06-18

## Scope

Restyle application resume (`buildApplicationResumeHtml`) to Lorna light template: gray flush-left sidebar, charcoal ribbon section headers, timeline experience rows, contact in sidebar, simplified page-2 projects. LinkedIn HTML/PDF/DOCX unchanged.

## Visual checkpoints

- `reference/screenshots/resumes/application-page-1.png`
- `reference/screenshots/resumes/application-page-1-rail.png`
- `reference/screenshots/resumes/application-page-1-main.png`
- `reference/screenshots/resumes/application-page-2.png`

## Findings

| Severity | Finding                                                                                                     | Status   |
| -------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| None     | Light gray sidebar with charcoal ribbon headers (Contact, Core Skills, Professional Development, Languages) | Done     |
| None     | Ribbon fold (`::after` triangle) renders in capture; no clipping                                            | Done     |
| None     | Contact moved to sidebar; main header is name + title + summary only                                        | Done     |
| None     | Timeline experience: dates left, vertical rule, role·company + bullet on page 1; compact rows on page 2     | Done     |
| None     | Page 2 full width — no sidebar ghost column                                                                 | Done     |
| None     | Page 2: Client Work + Personal Projects expanded grids (no Selected/More split)                             | Done     |
| None     | Page 1: all 12 experience rows with one bullet each                                                         | Done     |
| None     | PDF remains exactly 2 pages (`resume-page-count.test.ts`)                                                   | Done     |
| Low      | Page 1 main column is dense with 12 timeline rows; acceptable for 2-page target                             | Accepted |

## Verification

- `pnpm exec vitest run scripts/resume-application-html.test.ts scripts/resume-page-count.test.ts` — green
- `pnpm generate:resume` — application + LinkedIn outputs emitted
- `pnpm screenshots:resume` — application + LinkedIn captures refreshed
