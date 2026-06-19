# Application resume page 2 — unified projects — 2026-06-18

## Scope

Replace Selected/More split with **Client Work** (7) + **Personal Projects** (3). All projects use expanded card style in 2-column grids.

## Screenshots

- `reference/screenshots/resumes/application-page-2.png`
- `reference/screenshots/resumes/application-page-2-client.png`
- `reference/screenshots/resumes/application-page-2-personal.png`

## Expected UI

- Ribbons: "Client Work", "Personal Projects"
- `data-testid="resume-client-projects"` — 7 expanded cards in 2 columns
- `data-testid="resume-personal-projects"` — 3 expanded cards in 2 columns
- No `more-project-card` or `more-projects-grid`
- Page 2 fills vertically without overflow to page 3

## Client / personal slug order

**Client Work:** adverio-tools, usedelight, answeriq, manatal-coop, trulyhappy, articulearn, bolt-to-github

**Personal Projects:** merns-shop, queue, jw-tabs

## Verification

- `pnpm exec vitest run scripts/resume-partition.test.ts scripts/resume-application-html.test.ts scripts/resume-page-count.test.ts` — 7 passed
- `pnpm screenshots:resume` — page 2 capture refreshed

## Findings

| Severity | Finding                                            | Status |
| -------- | -------------------------------------------------- | ------ |
| None     | Uniform expanded cards; no selected/more hierarchy | Done   |
| None     | Category split matches portfolio `category` field  | Done   |
| None     | PDF remains 2 pages                                | Done   |
