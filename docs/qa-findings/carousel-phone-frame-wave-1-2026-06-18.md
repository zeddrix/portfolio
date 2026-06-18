# Carousel phone frame wave 1 — 2026-06-18

## Scope

Manatal Coop carousel card: phone bezel is the preview (no outer 16:10 browser stage), `w-fit` column width, preview height aligned with landscape browser cards, screenshot fill tuning, no hover zoom on Manatal only. Queue and other portrait slides keep nested phone-in-stage layout.

## Capture

- `reference/screenshots/polish/carousel-manatal-phone-1440.png`
- `reference/screenshots/polish/carousel-fold-1440.png`
- `reference/screenshots/polish/work-about-transition-1440.png`

## Findings

| Severity | Finding                                                                                         | Resolution                                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Mobile carousel track inflated by fixed 619px Manatal phone height, causing ~440px gap to About | Fixed: `CAROUSEL_PREVIEW_HEIGHT_CSS` uses responsive `calc(2.75rem + min(88vw, 920px) * 10 / 16)` so phone card height tracks browser cards per viewport |
| Medium   | Manatal screenshots had baked-in white side margins inside phone screen                         | Fixed: per-image `carouselScreenFill` (`scale` ~1.1–1.12, `objectPosition: 50% 0%`) on `manatal-coop` in portfolio data                                  |
| —        | Manatal column narrower than UseDelight; heights match within 4px at 1440×900                   | Pass (E2E + visual)                                                                                                                                      |
| —        | No purple/dark stage outside Manatal phone bezel                                                | Pass                                                                                                                                                     |
| —        | UseDelight browser card unchanged at carousel fold                                              | Pass                                                                                                                                                     |
| —        | Work → About spacing tight on desktop and mobile                                                | Pass                                                                                                                                                     |

## Status

Green — no open high/medium layout issues for Manatal phone-only carousel card.
