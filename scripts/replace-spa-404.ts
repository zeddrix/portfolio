#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildStaticNotFoundHtml } from "../src/lib/seo/static-not-found-html.js";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const build404Path = join(rootDir, "build", "404.html");

async function main() {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://zeddrix.com";
  const html = buildStaticNotFoundHtml(siteUrl);
  await writeFile(build404Path, html, "utf8");
  console.log(`Wrote static 404 page: ${build404Path}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
