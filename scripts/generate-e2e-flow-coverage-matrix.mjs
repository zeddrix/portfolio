import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";

const E2E_ROOT = path.resolve("tests/e2e");
const OUT = path.resolve("docs/e2e-flow-coverage-matrix.md");

/** @param {string} dir */
function listE2eSpecFiles(dir) {
  /** @type {string[]} */
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "fixtures") continue;
      results.push(...listE2eSpecFiles(full));
    } else if (entry.name.endsWith(".e2e.test.ts")) {
      results.push(path.relative(process.cwd(), full).replace(/\\/g, "/"));
    }
  }
  return results;
}

/** @param {string} file */
function domainFor(file) {
  if (file.includes("/journeys/")) return "journeys";
  if (file.includes("/home/")) return "home";
  if (file.includes("/projects/")) return "projects";
  if (file.includes("/seo/")) return "seo";
  if (file.includes("/content/")) return "content";
  if (file.includes("/contact/")) return "contact";
  if (file.includes("preflight")) return "infra";
  return "other";
}

/** @param {string} file */
function minActions(file) {
  if (file.includes("preflight")) return 1;
  if (file.includes("/journeys/")) return 3;
  return 2;
}

/** @param {string} file */
function branchesFor(file) {
  if (file.includes("home-navigation")) return "nav";
  if (file.includes("home-work-section"))
    return "work-filters,work-layouts,carousel";
  if (file.includes("home-preview-settings"))
    return "work-layouts,capability-layouts";
  if (file.includes("home-carousel-layout")) return "carousel";
  if (file.includes("home-carousel-touch")) return "carousel-touch";
  if (file.includes("project-all-slugs")) return "project-routing,404";
  if (file.includes("project-details")) return "project-routing";
  if (file.includes("project-images")) return "project-routing";
  if (file.includes("seo-navigation")) return "seo";
  if (file.includes("seo-sitemap-robots")) return "seo,sitemap";
  if (file.includes("content-integrity")) return "content";
  if (file.includes("capability-band-images")) return "capability-layouts";
  if (file.includes("contact-footer")) return "contact,nav";
  if (file.includes("/journeys/")) return "journey";
  if (file.includes("preflight")) return "infra";
  return "—";
}

/** @param {string} file */
function journeyTier(file) {
  if (file.includes("/journeys/")) return "golden-path";
  return "focused";
}

function main() {
  const files = listE2eSpecFiles(E2E_ROOT).sort();
  let md = "# E2E Flow Coverage Matrix\n\n";
  md += `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;
  md += "| Spec file | Domain | MinActions | BranchesCovered | JourneyTier |\n";
  md += "|-----------|--------|------------|-----------------|-------------|\n";

  for (const file of files) {
    md += `| \`${file}\` | ${domainFor(file)} | ${minActions(file)} | ${branchesFor(file)} | ${journeyTier(file)} |\n`;
  }

  md += `\nTotal specs: **${files.length}**\n`;
  fs.writeFileSync(OUT, md, "utf8");

  const prettier = spawnSync("pnpm", ["exec", "prettier", "--write", OUT], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (prettier.status !== 0) {
    process.exit(prettier.status ?? 1);
  }

  console.log(`Wrote ${OUT} (${files.length} rows)`);
}

main();
