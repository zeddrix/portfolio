# Resume page density — application-resume — 2026-06-18

## Scope

Single application resume layout after variant cleanup.

## Screenshots

- `reference/screenshots/resumes/application-page-1.png`
- `reference/screenshots/resumes/application-page-2.png`
- `reference/screenshots/resumes/application-page-2-client.png`
- `reference/screenshots/resumes/application-page-2-personal.png`
- `reference/screenshots/resumes/application-page-1-rail.png`
- `reference/screenshots/resumes/application-page-1-main.png`

## Changes

- `firstPageExperienceCount: 12` — all jobs on page 1
- `pageOneBulletCount: 1` — one bullet per role
- Page 2: projects only (no experience continued, no languages footer)
- Body class: `layout-application-resume`

## Verification

- `pnpm exec vitest run scripts/resume-page-count.test.ts` — 1 passed (2 pages)
- `pnpm screenshots:resume` — capture green

## Findings

| Severity | Finding                                                | Status |
| -------- | ------------------------------------------------------ | ------ |
| None     | Page 1: 12 timeline rows with sidebar ribbons          | Done   |
| None     | Page 2: Client Work + Personal Projects expanded grids | Done   |
