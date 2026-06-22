#!/usr/bin/env tsx
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getLegacyRedirectEntries } from "../src/lib/data/legacy-redirects.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const staticDir = join(rootDir, "static");

function buildRedirectHtml(targetUrl: string, targetPath: string): string {
  const safeTargetUrl = targetUrl.replace(/"/g, "&quot;");
  const safeTargetPath = targetPath.replace(/</g, "&lt;");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <link rel="canonical" href="${safeTargetUrl}" />
    <meta http-equiv="refresh" content="0;url=${safeTargetUrl}" />
    <meta name="robots" content="noindex, follow" />
    <script>window.location.replace("${safeTargetUrl}");</script>
  </head>
  <body>
    <p>This page has moved. <a href="${safeTargetUrl}">Continue to ${safeTargetPath}</a>.</p>
  </body>
</html>
`;
}

function sourcePathToDir(sourcePath: string): string {
  const trimmed = sourcePath.replace(/^\/+|\/+$/g, "");
  if (!trimmed) {
    return staticDir;
  }
  return join(staticDir, trimmed);
}

async function main() {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://zeddrix.com";
  const entries = getLegacyRedirectEntries(siteUrl);
  const written = new Set<string>();

  for (const entry of entries) {
    const dir = sourcePathToDir(entry.sourcePath);
    if (written.has(dir)) {
      continue;
    }
    written.add(dir);
    await mkdir(dir, { recursive: true });
    const html = buildRedirectHtml(entry.targetUrl, entry.targetPath);
    await writeFile(join(dir, "index.html"), html);
    console.log(
      `Wrote legacy redirect: ${entry.sourcePath} → ${entry.targetPath}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
