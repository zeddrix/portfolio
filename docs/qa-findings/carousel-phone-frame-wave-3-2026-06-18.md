# Carousel phone frame wave 3 — 2026-06-18

## Scope

Uniform gutter-only trim on all three Manatal carousel screenshots; fixed responsive phone frame at cropped aspect ratio; 1:1 `object-fill` render (no `object-cover`, letterboxing, `max-height`, or per-slide `objectPosition`).

## Capture

| Checkpoint     | Viewport | File                                                                   |
| -------------- | -------- | ---------------------------------------------------------------------- |
| Homepage slide | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-home-1440.png`    |
| Sign-in slide  | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-signin-1440.png`  |
| Chatbot slide  | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-chatbot-1440.png` |
| Homepage slide | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-home-390.png`     |
| Sign-in slide  | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-signin-390.png`   |
| Chatbot slide  | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-chatbot-390.png`  |

## Findings

| Severity | Finding                                                                     | Resolution                                                                                                   |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| High     | Per-file crop insets produced different output sizes and sliced UI (wave 2) | Fixed: single `MANATAL_GUTTER_CROP` on all `manatal-coop-*` sources; canonical normalize to 620×1429         |
| High     | `object-cover` + `max-height` re-cropped trimmed assets on mobile           | Fixed: removed; `fit="fill"` with fixed `MANATAL_PHONE_SCREEN_ASPECT_CSS`                                    |
| High     | Per-slide frame aspect caused mismatched phone sizes between slides         | Fixed: one aspect (`620 / 1429`) for all slides                                                              |
| —        | Grey device gutters removed; app UI preserved                               | Pass — homepage bottom nav, sign-in SIGN IN button, chatbot input + action buttons visible on all 6 captures |
| —        | Identical frame dimensions across slides                                    | Pass — same phone shell width/height at 1440 and 390                                                         |
| —        | E2E img box matches screen box ≤2px                                         | Pass — `home-carousel-layout.e2e.test.ts` desktop + mobile, all three slides                                 |
| Low      | Taller Manatal phone increases carousel-to-about gap                        | Accepted — E2E gap thresholds updated (210 desktop / 260 mobile); not fixed via CSS re-crop                  |

## Crop config (starting values, tuned in visual loop)

```js
MANATAL_GUTTER_CROP = { top: 0.04, left: 0.07, right: 0.07, bottom: 0.02 };
```

Manifest after retrim: all three paths at **620×1429**.

## Status

**Green** — no open high/medium layout issues. Uniform gutter crop + fixed 1:1 phone frame meets acceptance criteria.
