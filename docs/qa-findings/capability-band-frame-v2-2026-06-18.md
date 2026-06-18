# Capability band frame v2 — QA

**Date:** 2026-06-18  
**Scope:** Per-slide frames, blurred backdrops, outside chevrons, text-column badges, asset crops

## Summary

Overhauled capability band visuals to fix letterbox/dead-zone UX: each slide uses phone or browser frame metadata, blurred backdrop fill, content-hugging layout, chevrons outside the frame, badges/counter in the text column, and 16:10 crops for browser slides.

## Verified

| Check                                                   | Result                 |
| ------------------------------------------------------- | ---------------------- |
| Chatbot slide 1 = phone frame; slide 2 = browser frame  | Pass (E2E)             |
| Billing both slides = matched browser frames            | Pass (E2E)             |
| Badges in text column; no in-frame footer               | Pass (E2E)             |
| Deployment counter `1 / 4` → `2 / 4` in text column     | Pass (E2E)             |
| Chevrons outside frame (`capability-band-carousel-row`) | Pass (E2E)             |
| Grouped monetization auto-rotate still switches slides  | Pass (E2E)             |
| Capability band image crops retrimmed                   | Pass (optimize-images) |
| Unit tests (slides, device-frame, optimize-images)      | Pass                   |
| `pnpm quality`                                          | Pass                   |

## New / moved testids

- `capability-band-text-column`
- `capability-band-carousel-row`
- `browser-device-frame` / `browser-device-screen`
- `capability-band-badges` (text column)
- `capability-band-slide-counter` (text column)

## Removed

- In-frame `capability-band-footer`
- `DeviceBadgeFooter.svelte`, `DeviceStageSurface.svelte`

## Findings

None (high/medium).

## Notes

- Backdrop blur duplicates each slide’s image behind the frame; E2E scopes to `.opacity-100` foreground slides.
- Billing kept as dual-slide carousel with matched browser 16:10 framing (user choice).
