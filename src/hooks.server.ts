import { legacyRedirectTargets } from "$lib/data/legacy-redirects";
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

  return resolve(event);
};
