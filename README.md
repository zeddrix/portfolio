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
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

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
