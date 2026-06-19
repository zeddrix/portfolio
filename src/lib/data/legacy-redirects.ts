import { buildCertificatePath, certificates } from "$lib/data/certificates";

/** WordPress and legacy paths → portfolio paths (no trailing slash). */
export const legacyRedirectTargets: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    certificates.map((certificate) => [
      normalizeLegacyPath(certificate.legacyZeddrixPath),
      buildCertificatePath(certificate.slug),
    ]),
  ),
  "/home": "/",
  "/home/archives": "/",
  "/about-zeddrix-fabian": "/",
  "/about": "/",
};

function normalizeLegacyPath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

function buildTargetUrl(siteUrl: string, targetPath: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const normalizedPath = targetPath.startsWith("/")
    ? targetPath
    : `/${targetPath}`;
  return `${base}${normalizedPath}`;
}

export function getLegacyRedirectEntries(siteUrl: string): Array<{
  sourcePath: string;
  targetPath: string;
  targetUrl: string;
}> {
  const entries: Array<{
    sourcePath: string;
    targetPath: string;
    targetUrl: string;
  }> = [];

  for (const [source, target] of Object.entries(legacyRedirectTargets)) {
    const targetPath = target.startsWith("/") ? target : `/${target}`;
    const targetUrl = buildTargetUrl(siteUrl, targetPath);
    entries.push({ sourcePath: source, targetPath, targetUrl });
    if (!source.endsWith("/") && source !== "/") {
      entries.push({
        sourcePath: `${source}/`,
        targetPath,
        targetUrl,
      });
    }
  }

  return entries;
}
