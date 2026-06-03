import { base } from "$app/paths";

/**
 * Prefixes a root-relative static asset path with the SvelteKit base path (e.g. GitHub Pages repo segment).
 */
export function resolveStaticAsset(path: string): string {
  if (path.length === 0) {
    return base || "/";
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
