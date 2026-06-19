# Career profile manual checklist

Tasks the agent cannot complete — do these yourself after deploying the portfolio.

## 1. Deploy portfolio first

Certificate verify URLs only work after GitHub Pages deploy:

`https://zeddrix.com/certificates/{slug}`

## 2. LinkedIn — fix Education

Remove the **Udemy Alumni / MCA** entry. It reads like a formal degree.

Use **Licenses & Certifications** only (see step 3).

## 3. LinkedIn — update 5 certificates

After deploy, open `exports/linkedin-certificates.md` (run `pnpm generate:resume` locally) and for each cert set:

- **Credential URL** → `https://zeddrix.com/certificates/{slug}`
- Skills from the export block

## 4. LinkedIn — upload resume

Upload `resume/Zeddrix-Fabian-Resume-LinkedIn.pdf` first.

If LinkedIn’s parser misses Experience or Projects, upload `resume/Zeddrix-Fabian-Resume-LinkedIn.docx` instead (same content, Word-friendly).

Review parsed Experience, Projects, and Skills manually — LinkedIn’s parser is imperfect.

**There is no JSON/CSV import** for LinkedIn profile sections.

## 5. LinkedIn — refresh profile content

- Rewrite **About** to match portfolio (2018+, ATDD, AI-accelerated delivery)
- Add/update **Projects** from portfolio case studies
- Pin top skills: SvelteKit, TypeScript, React (or your target stack)

## 6. Push Zeddrix GitHub profile README

The `zeddrix/zeddrix` repo README was updated with a certifications table linking to the portfolio. Commit and push that repo after deploy.

## 7. WordPress legacy cert redirects (optional)

When ready to retire WordPress, redirect legacy cert paths to portfolio URLs. Legacy paths are stored in `src/lib/data/certificates.ts` as `legacyZeddrixPath`.

## 8. Job applications

Use `resume/Zeddrix-Fabian-Resume.pdf` (styled two-page version), not the LinkedIn variant.

## Regenerating local exports

```bash
pnpm generate:resume
```

Outputs:

- `resume/Zeddrix-Fabian-Resume.pdf` — job applications
- `resume/Zeddrix-Fabian-Resume-LinkedIn.pdf` — LinkedIn upload (try first)
- `resume/Zeddrix-Fabian-Resume-LinkedIn.docx` — LinkedIn upload fallback
- `exports/linkedin-certificates.md` — copy-paste aid for LinkedIn certs
- `exports/github-readme-projects.md` — project periods for GitHub README paste
- `exports/github-readme-manatal-coop.md` — Manatal Coop screenshot block for profile README paste
- `exports/certificate-urls.json` — machine-readable verify URLs

## 9. Keep career surfaces in sync

When you change **projects, experience, skills, profile copy, certificates, or contact info** in this repo, also:

1. Run `pnpm generate:resume`
2. Update `~/Documents/zeddrix/README.md` (paste from `exports/github-readme-*.md` where applicable)
3. Re-upload LinkedIn resume if PDF content changed (steps 4–5 above)

**UI-only or refactor changes** do not require README/resume updates. See `.cursor/rules/career-surface-sync.mdc` for the full mandatory vs optional decision guide.
