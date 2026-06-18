import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPLICATION_RESUME_LAYOUT_CONFIG,
  DEFAULT_APPLICATION_RESUME_LAYOUT,
  type ApplicationResumeLayout,
} from "../application-resume-config.js";
import {
  buildAdditionalProjectsBlocks,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  buildSummary,
  splitExperienceForApplicationResume,
  type ProfileSnapshot,
  type ProjectSnapshot,
} from "../resume-content.js";
import { buildExecutiveResumeHtml } from "./layouts/executive.js";
import { buildPortfolioLedResumeHtml } from "./layouts/portfolio-led.js";
import { buildRefinedLornaResumeHtml } from "./layouts/refined-lorna.js";
import type { ApplicationResumeBuildContext } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..");
const fontDir = join(rootDir, "static", "fonts");

async function buildInterFontFaceCss(): Promise<string> {
  const weights = [400, 500, 600, 700, 800];
  const rules: string[] = [];

  for (const weight of weights) {
    const fontPath = join(fontDir, `inter-latin-${weight}-normal.woff2`);
    const data = await readFile(fontPath);
    rules.push(
      `@font-face{font-family:'Inter';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${data.toString("base64")}) format('woff2');}`,
    );
  }

  return rules.join("");
}

function resolveOnePageProjects(
  snapshot: ProfileSnapshot,
  slugs: readonly string[],
): ProjectSnapshot[] {
  const pool = [
    ...buildSelectedProjectsBlocks(snapshot),
    ...buildAdditionalProjectsBlocks(snapshot),
  ];
  const bySlug = new Map(pool.map((project) => [project.slug, project]));

  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is ProjectSnapshot => project !== undefined);
}

function buildContext(
  snapshot: ProfileSnapshot,
  layout: ApplicationResumeLayout,
  fontCss: string,
): ApplicationResumeBuildContext {
  const { profile, certificates, toolStripGroups } = snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const selectedProjects = buildSelectedProjectsBlocks(snapshot);
  const additionalProjects = buildAdditionalProjectsBlocks(snapshot);
  const config = APPLICATION_RESUME_LAYOUT_CONFIG[layout];
  const { firstPageExperience, secondPageExperience } =
    splitExperienceForApplicationResume(
      experience,
      config.firstPageExperienceCount,
    );
  const onePageProjects = config.onePageProjectSlugs
    ? resolveOnePageProjects(snapshot, config.onePageProjectSlugs)
    : [];

  return {
    layout,
    config,
    profile,
    certificates,
    toolStripGroups,
    summary: buildSummary(snapshot),
    experience,
    firstPageExperience,
    secondPageExperience,
    selectedProjects,
    additionalProjects,
    onePageProjects,
    fontCss,
  };
}

function renderLayout(context: ApplicationResumeBuildContext): string {
  switch (context.layout) {
    case "refined-lorna":
      return buildRefinedLornaResumeHtml(context);
    case "executive":
      return buildExecutiveResumeHtml(context);
    case "portfolio-led":
      return buildPortfolioLedResumeHtml(context);
  }
}

export async function buildApplicationResumeHtml(
  snapshot: ProfileSnapshot,
  layout: ApplicationResumeLayout = DEFAULT_APPLICATION_RESUME_LAYOUT,
): Promise<string> {
  const fontCss = await buildInterFontFaceCss();
  const context = buildContext(snapshot, layout, fontCss);
  return renderLayout(context);
}

export {
  APPLICATION_RESUME_LAYOUTS,
  DEFAULT_APPLICATION_RESUME_LAYOUT,
  getExpectedPageCount,
  type ApplicationResumeLayout,
} from "../application-resume-config.js";
