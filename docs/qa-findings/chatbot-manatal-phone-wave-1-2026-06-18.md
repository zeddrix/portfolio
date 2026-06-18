# Chatbot band Manatal phone slide — wave 1 — 2026-06-18

## Scope

Replace Chatbot capability band slide 1 (`highlight-band-4`) from Queue `chatbot-start.webp` to Manatal `manatal-coop-chatbot.webp` with Manatal-proportioned phone frame. Keep slide 2 (`chatbot-placement-in-full-dashboard.webp` browser frame). Remove obsolete `chatbot-start` assets.

## Changes

- [`src/lib/data/portfolio.ts`](../src/lib/data/portfolio.ts): slide 1 → `/manatal-coop-chatbot.webp`, domain `manatalcoop.app`; added `manatal-coop` to `relatedProjectSlugs`
- [`src/lib/components/CapabilityBandSlideSurface.svelte`](../src/lib/components/CapabilityBandSlideSurface.svelte): Manatal phone branch (`fillMode="card"`, aspect ratio, `cover` + `objectPosition`)
- Removed `static/chatbot-start-566w.webp`, manifest entry, `CHATBOT_START_GUTTER_CROP` from optimize pipeline
- New visual capture: [`tests/visual/chatbot-band-capture.spec.ts`](../../tests/visual/chatbot-band-capture.spec.ts) + `pnpm screenshots:chatbot-band`

## Verification

| Surface               | Check                                                                        | Result                |
| --------------------- | ---------------------------------------------------------------------------- | --------------------- |
| Chatbot band slide 1  | `manatal-coop-chatbot` src, `manatalcoop.app` domain, Manatal fill tolerance | Pass — E2E            |
| Chatbot band slide 2  | `chatbot-placement-in-full-dashboard` browser frame unchanged                | Pass — E2E            |
| Shown in pills        | `band-project-link-chatbot-manatal-coop` visible with correct href           | Pass — E2E            |
| Queue carousel/detail | no `chatbot-*` assets                                                        | Pass — E2E regression |
| Unit tests            | portfolio, slides, optimize-images, carousel                                 | Pass                  |
| Quality               | `pnpm quality`                                                               | Pass                  |
| Visual capture        | `reference/screenshots/chatbot-band/` (390 + 768 + 1280)                     | Pass                  |

## Findings

| Severity | Finding                                       | Resolution                                      |
| -------- | --------------------------------------------- | ----------------------------------------------- |
| —        | Queue Support Chat UI on chatbot band slide 1 | Fixed — swapped to Manatal assistant screenshot |
| —        | Basic phone frame letterboxed Manatal crop    | Fixed — Manatal `fillMode="card"` branch        |

## Open items

None.
