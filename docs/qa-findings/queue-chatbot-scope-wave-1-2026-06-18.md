# Queue chatbot image scope — wave 1 — 2026-06-18

## Scope

Remove shared chatbot WebP assets from Queue `galleryImages` so they no longer appear on the homepage carousel card or `/projects/queue` detail gallery.

**Note:** This wave scoped Queue carousel/detail only. Chatbot band visuals were updated in later waves (see Superseded by below).

## Change

- [`src/lib/data/portfolio.ts`](../src/lib/data/portfolio.ts): Queue `galleryImages` reduced to three Queue product screenshots (`queue-2-analytics`, `queue-3-events`, `queue-4-listings`).

## Superseded by

| Later wave                 | Doc                                                                                                  | What changed                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Chatbot band asset swap    | [`chatbot-manatal-phone-wave-1-2026-06-18.md`](chatbot-manatal-phone-wave-1-2026-06-18.md)           | Slide 1 → Manatal phone screenshot; removed `chatbot-start` assets |
| Chatbot band layout polish | [`chatbot-phone-frame-polish-wave-2-2026-06-18.md`](chatbot-phone-frame-polish-wave-2-2026-06-18.md) | Phone frame centering, band sizing, image fill                     |

Current chatbot band behavior: slide 1 = Manatal phone (`manatalcoop.app`); slide 2 = Queue browser dashboard placement.

## Verification (wave 1 — still valid for Queue surfaces)

| Surface                             | Check                                                                       | Result     |
| ----------------------------------- | --------------------------------------------------------------------------- | ---------- |
| Queue carousel (`highlight-card-2`) | Browser frame only; no `/chatbot-*` src across 4 auto-rotate cycles         | Pass — E2E |
| Queue carousel                      | No phone device frame on Queue card                                         | Pass — E2E |
| Queue detail (`/projects/queue`)    | Gallery shows 3 Queue screenshots only; no `project-detail-gallery-image-4` | Pass — E2E |
| Chatbot band (`highlight-band-4`)   | See wave 1 + wave 2 docs above (no longer `chatbot-start` carousel)         | Superseded |
| Unit                                | `portfolio.test.ts` queue gallery exact match                               | Pass       |
| Quality                             | `pnpm quality`                                                              | Pass       |

## Findings

| Severity | Finding                                                                                        | Resolution                                 |
| -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| —        | Chatbot Support Chat UI appeared in Queue carousel phone frame (portrait `chatbot-start.webp`) | Fixed — removed from Queue `galleryImages` |
| —        | Duplicate chatbot screenshots on Queue detail gallery                                          | Fixed — same data change                   |

## Open items

None. Copy/tone unchanged.
