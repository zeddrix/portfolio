# Manatal screenshots + resume polish — 2026-06-17

## Scope

Manatal Coop mobile screenshots on portfolio and profile README; application resume 2-page layout with page-1-only taupe sidebar.

## Visual checkpoints

- `reference/screenshots/manatal-coop/carousel-mobile-390.png`
- `reference/screenshots/manatal-coop/detail-desktop-top-1280.png`
- `reference/screenshots/manatal-coop/detail-desktop-full-1280.png`
- `reference/screenshots/resumes/application-page-1.png`
- `reference/screenshots/resumes/application-page-1-rail.png`
- `reference/screenshots/resumes/application-page-2.png`

## Findings

| Severity | Finding                                                                              | Status   |
| -------- | ------------------------------------------------------------------------------------ | -------- |
| None     | Manatal detail shows homepage hero + sign-in/chatbot gallery in 3-column desktop row | Done     |
| None     | Carousel card 9 uses `manatal-coop-homepage` webp                                    | Done     |
| None     | Application resume PDF page count = 2 (`resume-page-count.test.ts`)                  | Done     |
| None     | Taupe rail flush left on page 1 only; page 2 full-width                              | Done     |
| Low      | Portrait gallery is tall on desktop — acceptable with `contain` fit                  | Accepted |

## Verification

- `pnpm test:unit` — includes resume page count + split tests
- `pnpm exec playwright test tests/e2e/projects/manatal-coop.e2e.test.ts tests/e2e/projects/project-images.e2e.test.ts`
- `pnpm screenshots:manatal` — green
- `pnpm generate:resume` + `pnpm screenshots:resume` — green
