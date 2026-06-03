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

Match Project Pages base path and public URL locally:

```sh
BASE_PATH=/zeddrix-portfolio \
PUBLIC_SITE_URL=http://127.0.0.1:4173/zeddrix-portfolio \
pnpm build && pnpm preview
```

Open `http://127.0.0.1:4173/zeddrix-portfolio/`.

## Deploy to GitHub Pages

This site uses `@sveltejs/adapter-static` and deploys automatically on push to `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

**Live URL (Project Pages):** `https://<github-username>.github.io/zeddrix-portfolio/`

CI sets:

- `BASE_PATH=/<repository-name>`
- `PUBLIC_SITE_URL=https://<owner>.github.io/<repository-name>`

### One-time manual setup (repository owner)

1. Push this repo to GitHub (default branch `main`).
2. **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. Ensure **Settings → Actions → General → Workflow permissions** allows read/write (required for `pages: write` and `id-token: write`).
4. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.
5. Confirm the workflow succeeds and open the published URL from the **github-pages** environment.

### Custom domain (optional, later)

1. Add DNS records for your domain per GitHub Pages docs.
2. Set **Settings → Pages → Custom domain**.
3. Set `PUBLIC_SITE_URL` in the workflow env to your custom domain (no trailing slash).

## Quality and tests

```sh
pnpm quality
pnpm test:unit
pnpm test:e2e
```

E2E runs the dev server with `BASE_PATH=/zeddrix-portfolio` for deployment parity (see `playwright.config.ts`).

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
