# Manatal carousel text alignment — QA

**Date:** 2026-06-18  
**Scope:** Revert equal-height preview row; restore taller mobile phone; vertically center Manatal column in carousel track; section margin polish

## Summary

Reverted the MCPS equal-height preview row approach. Manatal Coop on mobile/tablet again uses `h-auto` with the committed taller phone frame (`min(55vh, 420px)` screen cap, width-first layout). The carousel track uses `items-center` so the taller Manatal column sits vertically centered relative to browser cards. Work → How I deliver spacing uses reduced section padding (not forced text-block alignment across unequal preview heights).

## Verified

| Check                                           | Viewport       | Result        |
| ----------------------------------------------- | -------------- | ------------- |
| Manatal preview taller than browser card        | 390, 768       | Pass (E2E)    |
| Manatal column vertically centered in track     | 390, 768       | Pass (E2E)    |
| Phone centered in carousel viewport             | 390, 768       | Pass (E2E)    |
| Phone ≥42% article width and ≥150px wide        | 390            | Pass (E2E)    |
| Desktop preview slot matches browser dimensions | 1440           | Pass (E2E)    |
| LQIP / slide rotation frame height stable       | 390, 1440      | Pass (E2E)    |
| Work → How I deliver spacing                    | 390, 1440      | Pass (E2E)    |
| Carousel vertical swipe to approach             | 390            | Pass (E2E)    |
| Visual polish captures                          | 390, 768, 1440 | Pass (visual) |

## Visual capture outputs

- `reference/screenshots/polish/carousel-text-alignment-mobile-390.png`
- `reference/screenshots/polish/carousel-manatal-phone-*-{390,768,1440}.png`
- `reference/screenshots/polish/carousel-manatal-column-*-{390,768,1440}.png`

## Design decision

Manatal phone frame **intentionally taller** than browser carousel previews on mobile/tablet. Text blocks across columns are **not** forced to the same Y baseline; vertical centering of the full column in the track is the alignment model.

## Findings

None (high/medium).
