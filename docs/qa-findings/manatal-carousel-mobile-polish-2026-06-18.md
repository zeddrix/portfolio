# Manatal carousel mobile/tablet polish — QA

**Date:** 2026-06-18  
**Scope:** Manatal Coop featured-carousel phone card — cover fill, centered column, snap scroll, domain/notch, invisible full-size preview slot

## Summary

Polished `highlight-card-3` (Manatal Coop) for mobile and tablet while preserving desktop left-aligned carousel behavior. Images use `object-cover` with per-slide `objectPosition`; the column matches browser card width, the preview article is transparent and height-matched to browser cards with the phone centered inside, domain hides below `sm`, and copy centers under the phone on `max-lg`.

## Verified

| Check                                             | Viewport                  | Result        |
| ------------------------------------------------- | ------------------------- | ------------- |
| Image covers phone screen (no side gutters)       | 390, 768, 1440 × 3 slides | Pass (E2E)    |
| Column / phone centered in carousel               | 390, 768                  | Pass (E2E)    |
| Tagline centered under phone                      | 390                       | Pass (E2E)    |
| Manatal article width/height matches UseDelight   | 390                       | Pass (E2E)    |
| Phone centered inside invisible preview article   | 390                       | Pass (E2E)    |
| Desktop column left of carousel center            | 1440                      | Pass (E2E)    |
| Domain hidden / visible                           | 390 hidden, 768 visible   | Pass (E2E)    |
| Invisible preview slot (no gradient shell)        | 390, 768, 1440 capture    | Pass (visual) |
| `MANATAL_CAROUSEL_SLIDE_META` unit tests          | —                         | Pass          |
| `pnpm screenshots:polish` + `screenshots:manatal` | 390, 768, 1440            | Pass          |
| `pnpm quality`                                    | —                         | Pass          |

## Visual capture outputs

- `reference/screenshots/polish/carousel-manatal-column-*-{390,768,1440}.png`
- `reference/screenshots/polish/carousel-manatal-phone-*-{390,768,1440}.png`
- `reference/screenshots/manatal-coop/carousel-tablet-768.png`
- `reference/screenshots/manatal-coop/carousel-manatal-*-768.png`

## New / updated testids

- `highlight-card-column-manatal-coop` — Manatal carousel column wrapper
- `scrollCarouselCardIntoViewCenter` — E2E helper for centered scroll

## Findings

None (high/medium).

## Notes

- Manatal preview uses a transparent full-width/full-height article (`CAROUSEL_PREVIEW_HEIGHT_CSS`) matching browser carousel cards; the phone is flex-centered inside for natural side margin (replaces the earlier visible gradient shell + in-card padding).
- `max-lg:snap-center` preserved on the Manatal column; `lg:snap-start` on desktop.
- Per-slide crop tuning available via `MANATAL_CAROUSEL_SLIDE_META` in `src/lib/constants/carousel.ts` without layout changes.
