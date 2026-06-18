#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  APPLICATION_RESUME_LAYOUTS,
  buildApplicationResumeHtml,
  DEFAULT_APPLICATION_RESUME_LAYOUT,
} from "./application-resume/build-application-resume.js";
import { buildLinkedInDocxBuffer } from "./build-linkedin-docx.js";
import {
  buildAdditionalProjectsBlocks,
  buildCertificatesText,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  buildSummary,
  escapeHtml,
  formatCertificateMonthYear,
  formatExperienceRange,
  formatLinks,
  formatResumeProjectHeader,
  projectBullets,
  buildSkillsText,
  type ExperienceSnapshot,
  type ProfileSnapshot,
  type ProjectSnapshot,
} from "./resume-content.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const resumeDir = join(rootDir, "resume");
const variantsDir = join(resumeDir, "variants");

function buildExperienceHtmlLinkedIn(experience: ExperienceSnapshot[]): string {
  return experience
    .map((role) => {
      const titleLine = role.employmentType
        ? `${role.title} (${role.employmentType})`
        : role.title;
      const bullets = role.bullets
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join("");

      return `
      <article class="role">
        <h3>${escapeHtml(titleLine)} — ${escapeHtml(role.company)}</h3>
        <p class="meta">${escapeHtml(formatExperienceRange(role))} · ${escapeHtml(role.location)}</p>
        <ul>${bullets}</ul>
      </article>`;
    })
    .join("");
}

function buildProjectHtmlLinkedIn(
  project: ProjectSnapshot,
  compact = false,
): string {
  const bullets = projectBullets(project, compact ? 1 : 2);
  const links = formatLinks(project);
  const tech = project.techStack.slice(0, compact ? 6 : 8).join(" · ");

  if (compact) {
    return `
      <article class="project compact">
        <h3>${escapeHtml(formatResumeProjectHeader(project))}</h3>
        <p>${escapeHtml(project.outcome || project.tagline)}</p>
        <p class="tech">${escapeHtml(tech)}</p>
      </article>`;
  }

  return `
    <article class="project">
      <h3>${escapeHtml(formatResumeProjectHeader(project))}</h3>
      <ul>
        ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <p class="tech">Stack: ${escapeHtml(tech)}</p>
      ${links ? `<p class="links">${escapeHtml(links)}</p>` : ""}
    </article>`;
}

export function buildLinkedInResumeHtml(snapshot: ProfileSnapshot): string {
  const { profile, certificates, toolStripGroups, toolStripFooterNote } =
    snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const selectedProjects = buildSelectedProjectsBlocks(snapshot);
  const additionalProjects = buildAdditionalProjectsBlocks(snapshot);
  const summary = buildSummary(snapshot);
  const skillsText = buildSkillsText(toolStripGroups);
  const certsText = buildCertificatesText(certificates);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume (LinkedIn)</title>
    <style>
      @page { size: letter; margin: 0.55in 0.6in; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Calibri, "Segoe UI", sans-serif;
        font-size: 11pt;
        line-height: 1.35;
        color: #111111;
      }
      h1, h2, h3, p, ul { margin: 0; }
      .header { margin-bottom: 14px; }
      h1 { font-size: 20pt; }
      .title { margin-top: 4px; font-size: 12pt; font-weight: 700; }
      .contact { margin-top: 8px; font-size: 10.5pt; }
      h2 {
        font-size: 11pt;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 14px 0 6px;
        border-bottom: 1px solid #cccccc;
        padding-bottom: 2px;
      }
      .role, .project { margin-bottom: 10px; }
      .role h3, .project h3 { font-size: 11pt; font-weight: 700; }
      .meta { margin-top: 2px; font-size: 10.5pt; color: #333333; }
      ul { margin: 4px 0 0 18px; padding: 0; }
      li { margin-bottom: 2px; }
      .tech, .links { margin-top: 3px; font-size: 10.5pt; color: #333333; }
      .plain-block { white-space: pre-wrap; font-size: 10.5pt; }
      .skills-footer {
        margin-top: 6px;
        font-size: 10pt;
        line-height: 1.35;
        color: #333333;
      }
      .page-break { break-before: page; padding-top: 2px; }
    </style>
  </head>
  <body data-testid="resume-linkedin-body">
    <header class="header">
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="title">${escapeHtml(profile.jobTitle)}</p>
      <p class="contact">
        ${escapeHtml(profile.contactEmail)} |
        ${escapeHtml(profile.websiteUrl)} |
        ${escapeHtml(profile.githubUrl)} |
        ${escapeHtml(profile.linkedinUrl)}
      </p>
    </header>

    <section>
      <h2>Summary</h2>
      <p>${escapeHtml(summary)}</p>
    </section>

    <section data-testid="resume-linkedin-experience">
      <h2>Experience</h2>
      ${buildExperienceHtmlLinkedIn(experience)}
    </section>

    <section>
      <h2>Selected Projects</h2>
      ${selectedProjects.map((project) => buildProjectHtmlLinkedIn(project)).join("")}
    </section>

    <section>
      <h2>Additional Projects</h2>
      ${additionalProjects.map((project) => buildProjectHtmlLinkedIn(project, true)).join("")}
    </section>

    <section class="page-break" data-testid="resume-linkedin-skills">
      <h2>Skills</h2>
      <p class="plain-block">${escapeHtml(skillsText)}</p>
      <p class="skills-footer" data-testid="resume-linkedin-skills-footer">${escapeHtml(toolStripFooterNote)}</p>
    </section>

    <section>
      <h2>Professional Development</h2>
      <p class="plain-block">${escapeHtml(certsText)}</p>
    </section>

    <section>
      <h2>Languages</h2>
      <p>Tagalog (Native), English (Professional Working Proficiency)</p>
    </section>
  </body>
</html>`;
}

export { buildApplicationResumeHtml } from "./application-resume/build-application-resume.js";

function buildResumeMarkdown(snapshot: ProfileSnapshot): string {
  const { profile, certificates, toolStripGroups, toolStripFooterNote } =
    snapshot;
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

*${toolStripFooterNote}*

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
  const snapshot = JSON.parse(snapshotRaw) as ProfileSnapshot;

  const linkedInHtml = buildLinkedInResumeHtml(snapshot);
  const markdown = buildResumeMarkdown(snapshot);
  const linkedInDocx = await buildLinkedInDocxBuffer(snapshot);

  await mkdir(resumeDir, { recursive: true });
  await mkdir(variantsDir, { recursive: true });

  const linkedInHtmlPath = join(resumeDir, "resume-linkedin.html");
  const applicationHtmlPath = join(resumeDir, "resume-application.html");
  const markdownPath = join(resumeDir, "resume.md");
  const linkedInPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume-LinkedIn.pdf");
  const applicationPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume.pdf");
  const linkedInDocxPath = join(
    resumeDir,
    "Zeddrix-Fabian-Resume-LinkedIn.docx",
  );

  let defaultApplicationHtml = "";

  for (const layout of APPLICATION_RESUME_LAYOUTS) {
    const layoutHtml = await buildApplicationResumeHtml(snapshot, layout);
    const layoutDir = join(variantsDir, layout);
    await mkdir(layoutDir, { recursive: true });

    const layoutHtmlPath = join(layoutDir, "resume-application.html");
    const layoutPdfPath = join(layoutDir, "Zeddrix-Fabian-Resume.pdf");

    await writeFile(layoutHtmlPath, layoutHtml);
    await writePdf(layoutHtml, layoutPdfPath, "0");

    if (layout === DEFAULT_APPLICATION_RESUME_LAYOUT) {
      defaultApplicationHtml = layoutHtml;
    }

    console.log(`Wrote ${layoutHtmlPath}`);
    console.log(`Wrote ${layoutPdfPath}`);
  }

  await writeFile(linkedInHtmlPath, linkedInHtml);
  await writeFile(applicationHtmlPath, defaultApplicationHtml);
  await writeFile(markdownPath, markdown);
  await writeFile(linkedInDocxPath, linkedInDocx);

  await writePdf(linkedInHtml, linkedInPdfPath, "0.55in");
  await writePdf(defaultApplicationHtml, applicationPdfPath, "0");

  console.log(`Wrote ${linkedInHtmlPath}`);
  console.log(`Wrote ${applicationHtmlPath}`);
  console.log(`Wrote ${markdownPath}`);
  console.log(`Wrote ${linkedInPdfPath}`);
  console.log(`Wrote ${applicationPdfPath}`);
  console.log(`Wrote ${linkedInDocxPath}`);
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
