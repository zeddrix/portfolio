# Carousel phone frame wave 2 — 2026-06-18

## Scope

Manatal carousel: re-trim WebP assets to remove baked-in device margins; phone frame height follows trimmed image aspect (not browser-card height); per-slide visual QA.

## Capture

- `reference/screenshots/polish/carousel-manatal-phone-home-1440.png`
- `reference/screenshots/polish/carousel-manatal-phone-signin-1440.png`
- `reference/screenshots/polish/carousel-manatal-phone-chatbot-1440.png`
- `reference/screenshots/manatal-coop/carousel-mobile-390.png`

## Findings

| Severity | Finding                                                                       | Resolution                                                                                                                       |
| -------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| High     | Phone frame locked to browser preview height with dead space below shorter UI | Fixed: `PhoneDeviceFrame` card mode uses manifest `aspect-ratio` + `max-height` cap; signin/chatbot frames shorter than homepage |
| High     | Grey gutters baked into raw screenshots                                       | Fixed: `MANATAL_CAROUSEL_CROPS` in `optimize-images.mjs` + `--prefix=manatal-coop` retrim from committed 640w sources            |
| Medium   | Homepage bottom nav clipped under `object-cover`                              | Fixed: `objectPosition: 50% 100%` on homepage/chatbot slides                                                                     |
| Medium   | Sign-in button clipped                                                        | Fixed: tighter side crops + `objectPosition: 50% 42%` on signin slide                                                            |
| —        | Homepage shows full bottom nav; side gutters removed                          | Pass                                                                                                                             |
| —        | Sign-in card and SIGN IN button visible                                       | Pass                                                                                                                             |
| —        | Chatbot shows Micay UI through action buttons                                 | Pass (message input may be below fold on shortest cap; acceptable for carousel)                                                  |

## Status

Green — no open high/medium layout issues for Manatal content-height phone card.
