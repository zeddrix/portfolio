#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { buildApplicationResumeHtml } from "./application-resume/build-application-resume.js";
import { buildOptimizedResumeSnapshot } from "./resume-optimized-snapshot.js";
import {
  buildAdditionalProjectsBlocks,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  buildSummary,
  formatCertificateMonthYear,
  formatExperienceRange,
  formatResumeProjectHeader,
  projectBullets,
  buildSkillsText,
  type ProfileSnapshot,
} from "./resume-content.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const resumeDir = join(rootDir, "resume");

export const COMPLETE_RESUME_DIR = "complete";
export const OPTIMIZED_RESUME_DIR = "optimized";
export const RESUME_HTML_FILE = "resume.html";
export const RESUME_PDF_FILE = "Zeddrix-Fabian-Resume.pdf";
export const COMPLETE_RESUME_HTML_FILE = join(
  COMPLETE_RESUME_DIR,
  RESUME_HTML_FILE,
);
export const OPTIMIZED_RESUME_HTML_FILE = join(
  OPTIMIZED_RESUME_DIR,
  RESUME_HTML_FILE,
);
export const COMPLETE_RESUME_PDF_FILE = join(
  COMPLETE_RESUME_DIR,
  RESUME_PDF_FILE,
);
export const OPTIMIZED_RESUME_PDF_FILE = join(
  OPTIMIZED_RESUME_DIR,
  RESUME_PDF_FILE,
);

export { buildApplicationResumeHtml } from "./application-resume/build-application-resume.js";

function buildResumeMarkdown(snapshot: ProfileSnapshot): string {
  const { profile, certificates, toolStripGroups } = snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const selectedProjects = buildSelectedProjectsBlocks(snapshot);
  const additionalProjects = buildAdditionalProjectsBlocks(snapshot);
  const summary = buildSummary(snapshot);

  const skills = buildSkillsText(toolStripGroups)
    .split("\n")
    .map((line) => `- ${line}`)
    .join("\n");

  const experienceMd = experience
    .map((role) => {
      const titleLine = role.employmentType
        ? `${role.title} (${role.employmentType})`
        : role.title;
      const bullets = role.bullets.map((bullet) => `  - ${bullet}`).join("\n");
      return `### ${titleLine} — ${role.company}\n${formatExperienceRange(role)} · ${role.location}\n${bullets}`;
    })
    .join("\n\n");

  const selected = selectedProjects
    .map((project) => {
      const bullets = projectBullets(project)
        .map((bullet) => `  - ${bullet}`)
        .join("\n");
      return `### ${formatResumeProjectHeader(project)}\n${project.tagline}\n${bullets}\n- **Stack:** ${project.techStack.join(", ")}`;
    })
    .join("\n\n");

  const additional = additionalProjects
    .map(
      (project) =>
        `- **${formatResumeProjectHeader(project)}** — ${project.outcome || project.tagline}. Stack: ${project.techStack.slice(0, 6).join(", ")}`,
    )
    .join("\n");

  const certs = certificates
    .map(
      (certificate) =>
        `- ${certificate.title} (${certificate.issuer}, ${formatCertificateMonthYear(certificate.issuedAt)}) — ${certificate.verifyUrl}`,
    )
    .join("\n");

  return `# ${profile.name}

${profile.jobTitle}

${profile.contactEmail} | ${profile.websiteUrl} | ${profile.githubUrl} | ${profile.linkedinUrl}

## Summary

${summary}

## Experience

${experienceMd}

## Selected Projects

${selected}

## Additional Projects

${additional}

## Core Skills

${skills}

## Professional Development

${certs}

## Languages

Tagalog (Native), English (Professional Working Proficiency)
`;
}

async function writePdf(
  html: string,
  outputPath: string,
  margin = "0.45in",
): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: outputPath,
    format: "Letter",
    printBackground: true,
    scale: 0.96,
    margin: {
      top: margin,
      right: margin,
      bottom: margin,
      left: margin,
    },
  });
  await browser.close();
}

async function main() {
  const snapshotRaw = await readFile(snapshotPath, "utf8");
  const completeSnapshot = JSON.parse(snapshotRaw) as ProfileSnapshot;
  const optimizedSnapshot = buildOptimizedResumeSnapshot(completeSnapshot);

  const markdown = buildResumeMarkdown(optimizedSnapshot);
  const completeHtml = await buildApplicationResumeHtml(completeSnapshot);
  const optimizedHtml = await buildApplicationResumeHtml(optimizedSnapshot);

  await mkdir(resumeDir, { recursive: true });
  await mkdir(join(resumeDir, COMPLETE_RESUME_DIR), { recursive: true });
  await mkdir(join(resumeDir, OPTIMIZED_RESUME_DIR), { recursive: true });

  const completeHtmlPath = join(resumeDir, COMPLETE_RESUME_HTML_FILE);
  const optimizedHtmlPath = join(resumeDir, OPTIMIZED_RESUME_HTML_FILE);
  const markdownPath = join(resumeDir, "resume.md");
  const completePdfPath = join(resumeDir, COMPLETE_RESUME_PDF_FILE);
  const optimizedPdfPath = join(resumeDir, OPTIMIZED_RESUME_PDF_FILE);

  await writeFile(completeHtmlPath, completeHtml);
  await writeFile(optimizedHtmlPath, optimizedHtml);
  await writeFile(markdownPath, markdown);

  await writePdf(completeHtml, completePdfPath, "0");
  await writePdf(optimizedHtml, optimizedPdfPath, "0");

  console.log(`Wrote ${completeHtmlPath}`);
  console.log(`Wrote ${optimizedHtmlPath}`);
  console.log(`Wrote ${markdownPath}`);
  console.log(`Wrote ${completePdfPath}`);
  console.log(`Wrote ${optimizedPdfPath}`);
}

const isCli =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
