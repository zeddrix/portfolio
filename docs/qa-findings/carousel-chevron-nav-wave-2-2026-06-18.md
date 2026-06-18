# Capability band carousel chevron nav — Wave 2 QA

**Date:** 2026-06-18  
**Scope:** `CapabilityBandVisual.svelte` manual carousel controls

## Summary

Replaced overlaid "Prev"/"Next" text buttons with side chevron icons inside the device frame. Dot indicators moved below the slide area.

## Verified

| Check                                                           | Result                  |
| --------------------------------------------------------------- | ----------------------- |
| No visible "Prev"/"Next" text on carousels                      | Pass (E2E)              |
| `capability-carousel-prev` / `capability-carousel-next` testids | Pass                    |
| Chevrons sit outside screenshot bounding box (chatbot)          | Pass (E2E bounding-box) |
| Chatbot carousel still advances slides                          | Pass                    |
| Deployment carousel still advances slides                       | Pass                    |
| Billing carousel nav works with new layout                      | Pass                    |
| svelte-autofixer                                                | Pass (no issues)        |

## Registry delta

- `capability-carousel-prev`
- `capability-carousel-next`

## Findings

None (high/medium).
