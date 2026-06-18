# Queue chatbot image scope — wave 1 — 2026-06-18

## Scope

Remove shared chatbot WebP assets from Queue `galleryImages` so they no longer appear on the homepage carousel card or `/projects/queue` detail gallery. Chatbot screenshots remain exclusively on the Chatbot capability band in "How I deliver."

## Change

- [`src/lib/data/portfolio.ts`](../src/lib/data/portfolio.ts): Queue `galleryImages` reduced to three Queue product screenshots (`queue-2-analytics`, `queue-3-events`, `queue-4-listings`).
- `capabilityBands` chatbot `visual.images` unchanged.

## Verification

| Surface                             | Check                                                                       | Result                     |
| ----------------------------------- | --------------------------------------------------------------------------- | -------------------------- |
| Queue carousel (`highlight-card-2`) | Browser frame only; no `/chatbot-*` src across 4 auto-rotate cycles         | Pass — E2E                 |
| Queue carousel                      | No phone device frame on Queue card                                         | Pass — E2E                 |
| Queue detail (`/projects/queue`)    | Gallery shows 3 Queue screenshots only; no `project-detail-gallery-image-4` | Pass — E2E                 |
| Chatbot band (`highlight-band-4`)   | `chatbot-start` → `chatbot-placement-in-full-dashboard` carousel            | Pass — E2E (no regression) |
| Unit                                | `portfolio.test.ts` queue gallery exact match + chatbot band unchanged      | Pass                       |
| Quality                             | `pnpm quality`                                                              | Pass                       |

## Findings

| Severity | Finding                                                                                        | Resolution                                 |
| -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| —        | Chatbot Support Chat UI appeared in Queue carousel phone frame (portrait `chatbot-start.webp`) | Fixed — removed from Queue `galleryImages` |
| —        | Duplicate chatbot screenshots on Queue detail gallery                                          | Fixed — same data change                   |
| —        | Chatbot band regression risk                                                                   | None observed                              |

## Open items

None. Copy/tone unchanged.
