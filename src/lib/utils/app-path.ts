import { base } from "$app/paths";

/** Builds an in-app route path respecting `kit.paths.base` (e.g. GitHub Pages repo segment). */
export function appPath(path: string): string {
  if (path.length === 0) {
    return base || "/";
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
