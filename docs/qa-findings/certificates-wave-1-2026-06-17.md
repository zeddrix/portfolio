# Certificates visual QA — wave 1 (2026-06-17)

## Captures reviewed

- `reference/screenshots/certificates/index-desktop-1280.png`
- `reference/screenshots/certificates/mern-detail-desktop-1280.png`
- `reference/screenshots/certificates/index-mobile-390.png`

## Findings and fixes

| Severity | Finding                                                        | Fix                                                                                                                                             |
| -------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | MERN detail certificate image stayed on LQIP blur in captures  | Set `loading="eager"`, `preserveNaturalAspect`, `fit="contain"` on detail `OptimizedImage`; wait for `data-image-state="loaded"` in visual spec |
| Medium   | None open after re-capture                                     | —                                                                                                                                               |
| Low      | Bottom row of index has only two cards (expected with 5 certs) | No change                                                                                                                                       |

## Status

Wave 1 clean after re-capture.
