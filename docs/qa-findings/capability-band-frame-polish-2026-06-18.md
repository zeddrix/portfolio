# Capability band device frame polish — QA

**Date:** 2026-06-18  
**Scope:** DRY device-frame constants, reusable subcomponents, 3-zone capability band layout

## Summary

Refactored capability band device frames to match featured-carousel polish: shared gradient tokens, inner stage vignette, fixed badge footer (no overlay scrim), chevrons centered on the stage row, and smart pagination (no dots for ≤2 slides; `n / total` counter for ≥3).

## Verified

| Check                                                                                       | Result      |
| ------------------------------------------------------------------------------------------- | ----------- |
| No absolute badge scrim overlay on screenshots                                              | Pass        |
| Hybrid bands show badges in fixed footer (Stripe/LS/PayPal, Groq/Claude, Playwright/Vitest) | Pass (E2E)  |
| Chevrons vertically centered on `capability-band-stage`                                     | Pass (E2E)  |
| 2-slide carousels: no dot row, chevrons only                                                | Pass (E2E)  |
| 4-slide deployment: footer counter `1 / 4` → `2 / 4` on advance                             | Pass (E2E)  |
| ATDD single image: footer badges below screenshot                                           | Pass (E2E)  |
| Shared `DEVICE_CARD_GRADIENT` in featured carousel + capability bands                       | Pass (code) |
| `device-frame.test.ts` unit guard                                                           | Pass        |
| `capability-band-images.e2e.test.ts` (15 tests)                                             | Pass        |
| `content-integrity.e2e.test.ts` billing PayPal via footer badges                            | Pass        |
| `pnpm quality` (format, lint, svelte-check)                                                 | Pass        |

## New testids / registry delta

- `capability-band-stage`
- `capability-band-footer`
- `capability-band-badges`
- `capability-band-slide-counter`

## Files touched

- `src/lib/constants/device-frame.ts` (+ unit test)
- `src/lib/components/CarouselChevronButton.svelte`
- `src/lib/components/DeviceStageSurface.svelte`
- `src/lib/components/DeviceBadgeFooter.svelte`
- `src/lib/components/CapabilityBandVisual.svelte`
- `src/lib/components/FeaturedProjectCarousel.svelte`
- `src/lib/components/CarouselDevicePreview.svelte`
- `tests/e2e/content/capability-band-images.e2e.test.ts`
- `tests/e2e/content/content-integrity.e2e.test.ts`

## Findings

None (high/medium).

## Notes

- Chevron E2E asserts stage-edge anchoring (not image gutter overlap) because wide `object-contain` slides can fill most of the stage width.
- Image fill ratio tests now compare against `capability-band-stage` height (footer no longer included in denominator).
- svelte-autofixer MCP unavailable in this session; `pnpm check` used instead.
