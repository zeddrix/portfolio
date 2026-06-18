# AnswerIQ image optimization — Wave 1 QA

**Date:** 2026-06-18  
**Scope:** AnswerIQ screenshot renumber, HQ re-optimization, landing page hero, gallery trim

## Summary

Wave 1 complete. Eight AnswerIQ screens renumbered from 2880×1800 PNG sources, optimized to 640w/920w/1280w WebP variants with strong sharpen, and wired through portfolio data, capability bands, manifest, and E2E.

## Image inventory

| #   | `static-source/` PNG              | Logical path                        | Role                            |
| --- | --------------------------------- | ----------------------------------- | ------------------------------- |
| 1   | `answeriq-1-landingpage.png`      | `/answeriq-1-landingpage.webp`      | Hero, carousel, OG              |
| 2   | `answeriq-2-dashboard.png`        | `/answeriq-2-dashboard.webp`        | Gallery                         |
| 3   | `answeriq-3-articles.png`         | `/answeriq-3-articles.webp`         | Gallery                         |
| 4   | `answeriq-4-profile.png`          | `/answeriq-4-profile.webp`          | Gallery                         |
| 5   | `answeriq-5-settings.png`         | `/answeriq-5-settings.webp`         | Gallery                         |
| 6   | `answeriq-6-admin-dashboard.png`  | `/answeriq-6-admin-dashboard.webp`  | Gallery + admin capability band |
| 7   | `answeriq-7-admin-users.png`      | `/answeriq-7-admin-users.webp`      | Gallery                         |
| 8   | `answeriq-8-admin-workspaces.png` | `/answeriq-8-admin-workspaces.webp` | Gallery                         |

**Removed intentionally:** old `answeriq-7-admin-subscriptions`, `answeriq-9-admin-system-settings`.

## Verified

| Check                                                     | Result      |
| --------------------------------------------------------- | ----------- |
| 8 PNG sources in `static-source/` with numbered names     | Pass        |
| 24 WebP variants (640/920/1280 × 8) in `static/`          | Pass        |
| Manifest has 8 AnswerIQ keys, no orphan old paths         | Pass        |
| Default src resolves to 920w (`answeriq-1-landingpage`)   | Pass (unit) |
| AnswerIQ removed from `COMPACT_PREFIXES`                  | Pass        |
| Carousel + detail hero show landing page                  | Pass (E2E)  |
| Gallery image 6 shows admin users                         | Pass (E2E)  |
| Admin-dashboard band uses `answeriq-6-admin-dashboard`    | Pass (E2E)  |
| Monetization carousel rotates to AnswerIQ admin dashboard | Pass (E2E)  |
| SEO ogImage uses landing page                             | Pass (unit) |

## E2E

- `project-images.e2e.test.ts` — AnswerIQ carousel, hero, gallery-6
- `capability-band-images.e2e.test.ts` — admin-dashboard band + monetization carousel

## Before / after

| Area            | Before                                               | After                                                      |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Hero / carousel | In-app dashboard (`answeriq-1-dashboard`, 640w only) | Marketing landing (`answeriq-1-landingpage`, 920w default) |
| Gallery         | 8 images incl. subscriptions + system settings       | 7 app screens (#2–#8)                                      |
| Admin band      | `answeriq-5-admin-dashboard` 640w                    | `answeriq-6-admin-dashboard` 920w+                         |
| Optimization    | Compact 640w / 1024 cap                              | Full 640/920/1280 from 2880px source                       |

## Findings

None (high/medium).
