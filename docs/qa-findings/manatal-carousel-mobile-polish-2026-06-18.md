# Manatal carousel mobile/tablet polish — QA

**Date:** 2026-06-18  
**Scope:** Manatal Coop featured-carousel — cover fill, invisible preview slot, mobile phone scale, snap scroll, domain/notch; How I deliver defaults to Detailed

## Summary

Polished `highlight-card-3` (Manatal Coop) for mobile and tablet. On `max-lg`, the phone uses width-first container sizing (`min(100%, 300px)`) inside a full-width transparent article with `h-auto` (no tall empty slot). Desktop keeps fixed preview height and height-capped phone vs browser cards. How I deliver now defaults to **Detailed** (`sevenBands`) for fresh visits.

## Verified

| Check                                             | Viewport                  | Result        |
| ------------------------------------------------- | ------------------------- | ------------- |
| Image covers phone screen (no side gutters)       | 390, 768, 1440 × 3 slides | Pass (E2E)    |
| Phone ≥42% article width and ≥150px wide          | 390, 768                  | Pass (E2E)    |
| Column / phone centered in carousel               | 390, 768                  | Pass (E2E)    |
| Tagline centered under phone                      | 390                       | Pass (E2E)    |
| Manatal article width matches UseDelight          | 390, 1440                 | Pass (E2E)    |
| Manatal article height matches UseDelight         | 1440 only                 | Pass (E2E)    |
| Phone centered inside invisible preview article   | 390, 1440                 | Pass (E2E)    |
| Desktop column left of carousel center            | 1440                      | Pass (E2E)    |
| Domain hidden / visible                           | 390 hidden, 768 visible   | Pass (E2E)    |
| How I deliver defaults to Detailed                | fresh visit               | Pass (E2E)    |
| Invisible preview slot (no gradient shell)        | 390, 768, 1440 capture    | Pass (visual) |
| `MANATAL_CAROUSEL_SLIDE_META` + width helpers     | —                         | Pass (unit)   |
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
- `expectManatalPhoneFillsMobilePreviewSlot` — E2E guard for phone-to-article width ratio

## Findings

None (high/medium).

## Notes

- Mobile article is `h-auto`; desktop (`lg+`) uses fixed `CAROUSEL_PREVIEW_HEIGHT_CSS`.
- `carouselMobileLayout` on `PhoneDeviceFrame` enables width-first `min(100%, 300px)` below `lg`.
- Taller Manatal column on mobile increases carousel track height; work→about CTA gap tolerance raised to 520px.
- Returning visitors with `localStorage` `groupedBands` keep Grouped until they toggle or clear site data.
- Per-slide crop tuning: `MANATAL_CAROUSEL_SLIDE_META` in `src/lib/constants/carousel.ts`.
