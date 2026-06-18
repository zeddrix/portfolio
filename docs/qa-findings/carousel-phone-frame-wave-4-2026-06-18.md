# Carousel phone frame wave 4 — 2026-06-18

## Scope

Safe-zone gutter retrim (looser uniform crop), smaller card-mode border-radius, Manatal screen `max-height` cap to browser 16:10 image area, restore tight carousel-to-About gap.

## Capture

| Checkpoint     | Viewport | File                                                                   |
| -------------- | -------- | ---------------------------------------------------------------------- |
| Homepage slide | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-home-1440.png`    |
| Sign-in slide  | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-signin-1440.png`  |
| Chatbot slide  | 1440×900 | `reference/screenshots/polish/carousel-manatal-phone-chatbot-1440.png` |
| Homepage slide | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-home-390.png`     |
| Sign-in slide  | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-signin-390.png`   |
| Chatbot slide  | 390×844  | `reference/screenshots/polish/carousel-manatal-phone-chatbot-390.png`  |
| Carousel fold  | 1440×900 | `reference/screenshots/polish/carousel-fold-1440.png`                  |
| Work → About   | 1440×900 | `reference/screenshots/polish/work-about-transition-1440.png`          |
| Manatal mobile | 390×844  | `reference/screenshots/manatal-coop/carousel-mobile-390.png`           |

## Findings

| Severity | Finding                                                          | Resolution                                                                                   |
| -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| High     | App UI clipped at phone frame rounded corners (wave 3)           | Fixed: looser `MANATAL_GUTTER_CROP` keeps inner safe-zone; inner radius `1.85rem` → `1.5rem` |
| High     | Manatal phone taller than browser cards → large gap before About | Fixed: `MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS` + proportional width shrink                     |
| —        | Grey outer chrome removed; 1:1 fill preserved                    | Pass — `object-fill`, no letterboxing                                                        |
| —        | Homepage nav, sign-in SIGN IN, chatbot input/buttons visible     | Pass on 6 polish captures (post tune)                                                        |
| —        | Identical frame size across slides                               | Pass                                                                                         |
| —        | About gap tight                                                  | Pass — E2E ≤136 desktop / ≤96 mobile restored                                                |
| —        | E2E fill + height cap                                            | Pass — img vs screen ≤2px; screen ≤ browser image area +4px                                  |

## Crop config (final)

```js
MANATAL_GUTTER_CROP = { top: 0.03, left: 0.05, right: 0.05, bottom: 0.01 };
```

Manifest after retrim: all three paths at **650×1459**.

## Status

**Green** — no open high/medium layout issues.
