# Resume visual QA — wave 2 (2026-06-17)

## Captures reviewed

- `reference/screenshots/resumes/application-page-1.png`
- `reference/screenshots/resumes/application-page-2.png`
- `reference/screenshots/resumes/application-sidebar.png`
- `reference/screenshots/resumes/linkedin-top.png`
- `reference/screenshots/resumes/linkedin-mid.png`
- `resume/Zeddrix-Fabian-Resume.pdf` (generated)

## Findings and fixes

| Severity | Finding                                                            | Fix                                                                                               |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| High     | Page 1 viewport capture showed page-2 sidebar bleeding into page 1 | Element screenshots per `resume-page-1` / `resume-page-2`; explicit `page-break-after` on `.page` |
| Medium   | Page 1 overcrowded with four case-study projects                   | Reduced page-one projects to three; tightened bullet count and font size slightly                 |
| Medium   | Sidebar lacked visual hierarchy                                    | Added navy left border accent on sidebar                                                          |
| Low      | LinkedIn variant readability                                       | Single-column Arial layout verified in captures                                                   |

## Status

Wave 2 clean after re-capture. Application resume remains 2 pages with skills/certs sidebar on page 2.
