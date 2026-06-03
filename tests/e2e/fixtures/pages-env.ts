/** GitHub repository name (Project Pages base path segment). */
export const PAGES_REPO_NAME = "portfolio";

/** Mirrors GitHub Project Pages base path for E2E parity. */
export const PAGES_BASE_PATH = `/${PAGES_REPO_NAME}`;

/** Site URL used in Playwright (includes repo subpath). */
export const PAGES_SITE_URL = `http://127.0.0.1:7212${PAGES_BASE_PATH}`;

export function pagesPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PAGES_BASE_PATH}${normalized}`;
}

/** Homepage path under Project Pages base (use with `page.goto`). */
export const PAGES_HOME_PATH = pagesPath("/");
