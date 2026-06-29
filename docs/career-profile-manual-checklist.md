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

## 4. LinkedIn — manual profile build

**Full copy-paste guide:** [`docs/linkedin-profile-manual.md`](linkedin-profile-manual.md) — headline, About, all 12 experience entries, 10 projects, 5 certs, skills, languages, Featured, and QA.

LinkedIn **does not** bulk-import profile sections from a resume upload. Copy all section content manually from the guide or `resume/resume.md`.

## 5. LinkedIn — Featured + resume files

- **Featured:** portfolio link (`https://zeddrix.com`) + `resume/Zeddrix-Fabian-Resume.pdf` (optimized)
- **Easy Apply:** same optimized PDF under Jobs → Application settings
- Pin top skills: **About** → SvelteKit, TypeScript, React, Angular, Full-Stack Development; **Skills card** → SvelteKit, TypeScript, React (see [`linkedin-profile-manual.md`](linkedin-profile-manual.md) §3.2 and §9)

## 6. Push Zeddrix GitHub profile README

The `zeddrix/zeddrix` repo README was updated with a certifications table linking to the portfolio. Commit and push that repo after deploy.

## 7. WordPress legacy cert redirects

After deploy, legacy certificate URLs redirect automatically (see [`docs/seo-offsite-checklist.md`](seo-offsite-checklist.md) §5 and §10). Legacy paths are defined in `src/lib/data/certificates.ts` as `legacyZeddrixPath`.

## 8. Job applications

Use `resume/Zeddrix-Fabian-Resume.pdf` (optimized version) for quick applications and `resume/Zeddrix-Fabian-Resume-Complete.pdf` when you need the full two-page complete version.

## Regenerating local exports

```bash
pnpm generate:resume
```

Outputs:

- `resume/Zeddrix-Fabian-Resume.pdf` — job applications
- `resume/Zeddrix-Fabian-Resume-Complete.pdf` — complete two-page baseline
- `exports/linkedin-certificates.md` — copy-paste aid for LinkedIn certs
- `exports/github-readme-projects.md` — project periods for GitHub README paste
- `exports/github-readme-manatal-coop.md` — Manatal Coop screenshot block for profile README paste
- `exports/certificate-urls.json` — machine-readable verify URLs

## 9. Keep career surfaces in sync

When you change **projects, experience, skills, profile copy, certificates, or contact info** in this repo, also:

1. Run `pnpm generate:resume`
2. Update `~/Documents/zeddrix/README.md` (paste from `exports/github-readme-*.md` where applicable)
3. Update LinkedIn sections per [`docs/linkedin-profile-manual.md`](linkedin-profile-manual.md); re-upload Featured / Application-settings PDF if resume content changed

**UI-only or refactor changes** do not require README/resume updates. See `.cursor/rules/career-surface-sync.mdc` for the full mandatory vs optional decision guide.
