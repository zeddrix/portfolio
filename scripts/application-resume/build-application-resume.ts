import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APPLICATION_RESUME_CONFIG } from "../application-resume-config.js";
import {
  buildEngagementExperienceBlocks,
  buildSummary,
  partitionResumeProjectsByCategory,
  splitExperienceForApplicationResume,
  type ProfileSnapshot,
} from "../resume-content.js";
import { buildApplicationResumeLayoutHtml } from "./layouts/application-resume.js";
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

function buildContext(
  snapshot: ProfileSnapshot,
  fontCss: string,
): ApplicationResumeBuildContext {
  const { profile, certificates, toolStripGroups } = snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const { clientProjects, personalProjects } =
    partitionResumeProjectsByCategory(snapshot);
  const { firstPageExperience } = splitExperienceForApplicationResume(
    experience,
    APPLICATION_RESUME_CONFIG.firstPageExperienceCount,
  );

  return {
    config: APPLICATION_RESUME_CONFIG,
    profile,
    certificates,
    toolStripGroups,
    summary: buildSummary(snapshot),
    firstPageExperience,
    clientProjects,
    personalProjects,
    fontCss,
  };
}

export async function buildApplicationResumeHtml(
  snapshot: ProfileSnapshot,
): Promise<string> {
  const fontCss = await buildInterFontFaceCss();
  const context = buildContext(snapshot, fontCss);
  return buildApplicationResumeLayoutHtml(context);
}
