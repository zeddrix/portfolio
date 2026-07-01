# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.15.1 create --template minimal --types ts --install pnpm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

### Local GitHub Pages parity

Match custom-domain base path and public URL locally:

```sh
PUBLIC_SITE_URL=https://zeddrix.com \
BASE_PATH= \
pnpm build && pnpm preview
```

Open `http://127.0.0.1:4173/`.

## Deploy to GitHub Pages

This site uses `@sveltejs/adapter-static` and deploys automatically on push to `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

**Live URL:** `https://zeddrix.com`

CI sets:

- `BASE_PATH=` (empty — custom domain serves at site root)
- `PUBLIC_SITE_URL=https://zeddrix.com`

The workflow writes these into a temporary `.env` on the runner before `pnpm quality` and `pnpm build` (SvelteKit needs them at typegen/check time).

### One-time manual setup (repository owner)

1. Push this repo to GitHub (default branch `main`).
2. **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. Ensure **Settings → Actions → General → Workflow permissions** allows read/write (required for `pages: write` and `id-token: write`).
4. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.
5. Confirm the workflow succeeds and open the published URL from the **github-pages** environment.

### Custom domain

1. DNS A records + `www` CNAME point to GitHub Pages (see GitHub Pages docs).
2. **Settings → Pages → Custom domain:** `zeddrix.com`
3. Enable **Enforce HTTPS** once the certificate is ready.
4. Workflow env uses `PUBLIC_SITE_URL=https://zeddrix.com` and empty `BASE_PATH`.

## Quality and tests

```sh
pnpm quality
pnpm test:unit
pnpm test:e2e
```

Every `git commit` runs `pnpm quality` via Husky (Prettier check, ESLint, svelte-check) — the same gate as CI. Use `git commit --no-verify` only when you intentionally need to skip it.

E2E runs the dev server at site root for deployment parity (see `playwright.config.ts`).

## Visual screenshots (Playwright)

One-time browser install (after `pnpm install`):

```sh
pnpm exec playwright install chromium
```

Capture **localhost** and **[rickwaalders.com](https://www.rickwaalders.com/)** hero frames (same viewport) into `reference/screenshots/`. Playwright starts the dev server automatically via `playwright.config.ts` unless port 5173 is already in use:

```sh
pnpm screenshots
```

Override the local base URL (e.g. preview): `SCREENSHOT_BASE_URL=http://127.0.0.1:4173 pnpm screenshots`.
