import { isLegacyGonePath } from "$lib/data/legacy-gone-paths";
import { legacyRedirectTargets } from "$lib/data/legacy-redirects";
import { getSiteUrl } from "$lib/data/seo";
import { buildStaticNotFoundHtml } from "$lib/seo/static-not-found-html";
import type { Handle } from "@sveltejs/kit";

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

export const handle: Handle = async ({ event, resolve }) => {
  const normalizedPath = normalizePathname(event.url.pathname);
  const targetPath = legacyRedirectTargets[normalizedPath];

  if (targetPath) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: targetPath,
      },
    });
  }

  if (isLegacyGonePath(normalizedPath)) {
    return new Response(buildStaticNotFoundHtml(getSiteUrl()), {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return resolve(event);
};
