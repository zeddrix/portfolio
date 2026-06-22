/** WordPress paths that should return HTTP 404 (no longer exist on zeddrix.com). */
export const legacyGonePathPrefixes = [
  "/author",
  "/category",
  "/tag",
  "/page",
  "/coding-projects",
  "/beamazedd-shop-a-dummy-e-commerce-platform-for-my-products",
] as const;

/** Indexed legacy post slugs from GSC (exact paths, no redirect target). */
export const legacyGoneExactPaths = [
  "/about-justcolor-version-1-0",
  "/booklist-add-your-books-titles-the-authors-name-isbn",
  "/github-findersearch-github-users-web-app-api",
  "/mastering-the-biology-course-on-khan-academy",
  "/task-list-a-simple-web-app-widget",
  "/tracalorie-web-app-for-tracking-calorie-intake",
  "/weatherjs-web-app-and-widget",
] as const;

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

export function isLegacyGonePath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  if (normalized === "/") {
    return false;
  }

  if (legacyGoneExactPaths.some((path) => normalized === path)) {
    return true;
  }

  return legacyGonePathPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}
