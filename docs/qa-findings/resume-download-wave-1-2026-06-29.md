# Resume Download — Wave 1 QA

**Date:** 2026-06-29  
**Scope:** Homepage resume download entry points (header, contact, footer)

## Summary

Wave 1 complete. Resume download links are now present in the homepage header, contact section, and footer, all pointing to the complete PDF static path.

## Verified

| Check                                                                          | Result     |
| ------------------------------------------------------------------------------ | ---------- |
| Header includes visible resume download link                                   | Pass       |
| Contact section includes resume download link                                  | Pass       |
| Footer includes resume download link                                           | Pass       |
| All links resolve to `/resume/complete/Zeddrix-Fabian-Resume.pdf` path pattern | Pass (E2E) |
| Existing GitHub, mailto, and certifications links remain intact                | Pass (E2E) |
| Desktop + mobile terminal/contact layout remains fully visible                 | Pass (E2E) |

## Commands

- `pnpm exec playwright test tests/e2e/home/home-shell.e2e.test.ts tests/e2e/home/home-navigation.e2e.test.ts tests/e2e/contact/contact-footer.e2e.test.ts`
- `pnpm screenshots:polish`

## Findings

- Fixed one medium test stability issue in visual capture by scoping `carousel-device-frame-phone` to the intended card to avoid strict-mode selector ambiguity.
- No open high/medium visual defects for touched homepage surfaces.
