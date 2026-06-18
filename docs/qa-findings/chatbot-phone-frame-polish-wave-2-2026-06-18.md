# Chatbot band phone frame polish — wave 2 — 2026-06-18

## Scope

Fix chatbot capability band slide 1 Manatal phone frame: image fill, horizontal centering, and band-column sizing on mobile (390×844), tablet (768×1024), and desktop (1280×900).

## Root cause

Capability band reused `PhoneDeviceFrame` with homepage carousel desktop sizing (`88vw` / `920px` caps) inside a ~280px column, used `absolute inset-0` image mounting instead of carousel `preserveNaturalAspect`, and lacked flex centering on the gradient stage.

## Changes

- [`src/lib/constants/carousel.ts`](../src/lib/constants/carousel.ts): `MANATAL_PHONE_BAND_*` constants + `getManatalPhoneScreenBandConstraintCss()`
- [`src/lib/components/PhoneDeviceFrame.svelte`](../src/lib/components/PhoneDeviceFrame.svelte): `layoutContext="capabilityBand"` + `.manatal-band-phone-screen` CSS
- [`src/lib/components/CapabilityBandSlideSurface.svelte`](../src/lib/components/CapabilityBandSlideSurface.svelte): carousel image parity, `capability-band-phone-stage` / `capability-band-gradient-stage`, flex centering
- [`tests/e2e/content/capability-band-images.e2e.test.ts`](../../tests/e2e/content/capability-band-images.e2e.test.ts): viewport edge-fill, centering, sizing tests
- [`tests/visual/chatbot-band-capture.spec.ts`](../../tests/visual/chatbot-band-capture.spec.ts): phone frame, phone screen, full band, browser slide captures

## Verification

| Surface                     | Check                                                 | Result     |
| --------------------------- | ----------------------------------------------------- | ---------- |
| Phone fill                  | Four-edge tolerance on active slide at 390/768/1280   | Pass — E2E |
| Phone centering             | Frame center within 12px of gradient stage            | Pass — E2E |
| Band sizing                 | Width ≤ 280px, height ≥ 300px                         | Pass — E2E |
| Capability band regression  | 26/26 `capability-band-images` tests                  | Pass       |
| Manatal carousel regression | 15/15 `home-carousel-layout` Manatal tests            | Pass       |
| Project images regression   | 11/11 `project-images` tests                          | Pass       |
| Unit                        | `carousel.test.ts` band constraints                   | Pass       |
| Quality                     | `pnpm quality`                                        | Pass       |
| Visual capture              | `reference/screenshots/chatbot-band/` (9 checkpoints) | Pass       |

## Visual triage

| Severity | Finding                                                     | Resolution                                                                   |
| -------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| High     | Phone left-aligned with empty right gutter in gradient card | Fixed — flex centering + band layout context                                 |
| High     | Image top-clipped / bottom black bars in phone screen       | Fixed — band sizing + carousel image mounting parity                         |
| Medium   | E2E strict-mode violation on duplicate gradient testids     | Fixed — scope to `.opacity-100` active slide                                 |
| —        | E2E viewport pollution after mobile/tablet chatbot tests    | Fixed — reset to 1280×900 in `beforeEach`; scope fill test to `.opacity-100` |
| —        | Obsolete wave-1 screenshot filenames in reference dir       | Removed — canonical wave-2 capture names only                                |
| —        | `objectPosition` tweak for chatbot slide                    | Not needed — `50% 0%` looks correct after layout fix                         |

## Static-source cleanup

- Checked `static-source/chatbot-start.png`: **not present** (no action required)
- `chatbot-start` optimize pipeline already removed in wave 1

## Related docs

- Wave 1 asset swap: [`chatbot-manatal-phone-wave-1-2026-06-18.md`](chatbot-manatal-phone-wave-1-2026-06-18.md)
- Queue scope (carousel/detail only): [`queue-chatbot-scope-wave-1-2026-06-18.md`](queue-chatbot-scope-wave-1-2026-06-18.md)

## Open items

None.
