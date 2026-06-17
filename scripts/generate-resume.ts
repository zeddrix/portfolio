#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
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
  formatResumeProjectRoleLine,
  projectBullets,
  buildSkillsText,
  type CertificateSnapshot,
  type ExperienceSnapshot,
  type ProfileSnapshot,
  type ProjectSnapshot,
} from "./resume-content.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const resumeDir = join(rootDir, "resume");
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

function buildSidebarSkillsHtml(
  groups: ProfileSnapshot["toolStripGroups"],
): string {
  return groups
    .map(
      (group) => `
        <div class="sidebar-group">
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.items.join(" · "))}</p>
        </div>`,
    )
    .join("");
}

function buildSidebarCertsHtml(certificates: CertificateSnapshot[]): string {
  return certificates
    .map(
      (certificate) => `
        <div class="sidebar-cert">
          <p class="cert-title">${escapeHtml(certificate.title)}</p>
          <p class="cert-meta">${escapeHtml(certificate.issuer)} · ${escapeHtml(formatCertificateMonthYear(certificate.issuedAt))}</p>
        </div>`,
    )
    .join("");
}

function buildExperienceHtmlApplication(
  experience: ExperienceSnapshot[],
): string {
  return experience
    .map((role) => {
      const titleLine = role.employmentType
        ? `${role.title} (${role.employmentType})`
        : role.title;
      const bullet = role.bullets[0] ?? "";
      return `
      <article class="role resume-card">
        <h3>${escapeHtml(titleLine)}</h3>
        <p class="company">${escapeHtml(role.company)}</p>
        <p class="meta">${escapeHtml(formatExperienceRange(role))} · ${escapeHtml(role.location)}</p>
        <p class="role-bullet">${escapeHtml(bullet)}</p>
      </article>`;
    })
    .join("");
}

function buildProjectHtmlApplication(
  project: ProjectSnapshot,
  compact = false,
): string {
  const bullets = projectBullets(project, compact ? 1 : 2);
  const tech = project.techStack.slice(0, compact ? 5 : 7).join(" · ");

  if (compact) {
    return `
      <article class="project compact resume-card">
        <h3>${escapeHtml(project.name)}</h3>
        <p class="role-line">${escapeHtml(formatResumeProjectRoleLine(project))}</p>
        <p>${escapeHtml(project.outcome || project.tagline)}</p>
        <p class="tech">${escapeHtml(tech)}</p>
      </article>`;
  }

  return `
    <article class="project resume-card">
      <h3>${escapeHtml(project.name)}</h3>
      <p class="role-line">${escapeHtml(formatResumeProjectRoleLine(project))}</p>
      <ul>
        ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <p class="tech">${escapeHtml(tech)}</p>
    </article>`;
}

export function buildLinkedInResumeHtml(snapshot: ProfileSnapshot): string {
  const { profile, certificates, toolStripGroups } = snapshot;
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

    <section class="page-break">
      <h2>Skills</h2>
      <p class="plain-block">${escapeHtml(skillsText)}</p>
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

export async function buildApplicationResumeHtml(
  snapshot: ProfileSnapshot,
): Promise<string> {
  const { profile, certificates, toolStripGroups } = snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const selectedProjects = buildSelectedProjectsBlocks(snapshot);
  const additionalProjects = buildAdditionalProjectsBlocks(snapshot);
  const summary = buildSummary(snapshot);
  const fontCss = await buildInterFontFaceCss();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume</title>
    <style>
      ${fontCss}
      @page { size: letter; margin: 0; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        font-size: 8.6pt;
        line-height: 1.24;
        color: #18181b;
        background: #f5f5f5;
      }
      h1, h2, h3, p, ul { margin: 0; }
      .page {
        min-height: 10.5in;
        break-after: page;
        page-break-after: always;
        padding: 0.38in 0.42in;
      }
      .page:last-child {
        break-after: auto;
        page-break-after: auto;
      }
      .page-one-grid {
        display: grid;
        grid-template-columns: 0.82fr 2.18fr;
        gap: 14px;
        min-height: 9.7in;
        align-items: stretch;
      }
      .resume-rail {
        background: #1e3a5f;
        color: #f8fafc;
        border-radius: 12px 0 0 12px;
        padding: 14px 11px 14px 13px;
        min-height: 100%;
      }
      .resume-rail h2 {
        color: #ffffff;
        border-bottom-color: rgba(255,255,255,0.25);
      }
      .resume-rail .sidebar-group h3 {
        color: #dbeafe;
      }
      .resume-rail .sidebar-group p,
      .resume-rail .cert-title,
      .resume-rail .cert-meta,
      .resume-rail .languages {
        color: #e2e8f0;
      }
      .resume-main {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .header {
        border-bottom: 2px solid #1e3a5f;
        padding-bottom: 8px;
      }
      h1 {
        font-size: 26pt;
        font-weight: 800;
        color: #1e3a5f;
        letter-spacing: 0.01em;
      }
      .title {
        margin-top: 3px;
        font-size: 11.5pt;
        font-weight: 600;
        color: #334155;
      }
      .contact-footer {
        margin-top: 7px;
        font-size: 8.4pt;
        color: #64748b;
        letter-spacing: 0.01em;
      }
      h2 {
        font-size: 8.8pt;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #1e3a5f;
        margin: 0 0 4px;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 2px;
      }
      .resume-card {
        border: 1px solid #e4e4e7;
        border-radius: 10px;
        background: #ffffff;
        padding: 7px 9px;
        margin-bottom: 5px;
        break-inside: avoid;
      }
      .summary { color: #334155; }
      .role h3, .project h3 {
        font-size: 9.2pt;
        font-weight: 700;
        color: #0f172a;
      }
      .company, .role-line {
        margin-top: 1px;
        font-size: 8.6pt;
        font-weight: 600;
        color: #475569;
      }
      .meta, .tech, .role-bullet {
        margin-top: 1px;
        font-size: 8.2pt;
        color: #64748b;
      }
      ul {
        margin: 2px 0 0 14px;
        padding: 0;
      }
      li { margin-bottom: 1px; }
      .project.compact { margin-bottom: 4px; }
      .sidebar-group { margin-bottom: 7px; break-inside: avoid; }
      .sidebar-group h3 {
        font-size: 7.8pt;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 2px;
      }
      .sidebar-group p { font-size: 7.8pt; }
      .sidebar-cert { margin-bottom: 5px; }
      .cert-title { font-size: 7.8pt; font-weight: 600; }
      .cert-meta { font-size: 7.4pt; }
      .languages { font-size: 8pt; }
      .experience-grid .role { margin-bottom: 4px; }
    </style>
  </head>
  <body>
    <section class="page" data-testid="resume-page-1">
      <div class="page-one-grid">
        <aside class="resume-rail" data-testid="resume-page-1-sidebar">
          <section>
            <h2>Core Skills</h2>
            ${buildSidebarSkillsHtml(toolStripGroups)}
          </section>
          <section>
            <h2>Professional Development</h2>
            ${buildSidebarCertsHtml(certificates)}
          </section>
          <section>
            <h2>Languages</h2>
            <p class="languages">Tagalog (Native)<br />English (Professional)</p>
          </section>
        </aside>

        <div class="resume-main" data-testid="resume-main">
          <header class="header">
            <h1>${escapeHtml(profile.name)}</h1>
            <p class="title">${escapeHtml(profile.jobTitle)}</p>
            <p class="contact-footer">
              ${escapeHtml(profile.contactEmail)} ·
              ${escapeHtml(profile.websiteUrl.replace("https://", ""))} ·
              ${escapeHtml(profile.githubUrl.replace("https://", ""))} ·
              ${escapeHtml(profile.linkedinUrl.replace("https://www.linkedin.com/in/", "linkedin.com/in/"))}
            </p>
          </header>

          <section class="resume-card">
            <h2>Summary</h2>
            <p class="summary">${escapeHtml(summary)}</p>
          </section>

          <section class="experience-grid">
            <h2>Experience</h2>
            ${buildExperienceHtmlApplication(experience)}
          </section>

          <section>
            <h2>Selected Projects</h2>
            ${selectedProjects.map((project) => buildProjectHtmlApplication(project)).join("")}
          </section>
        </div>
      </div>
    </section>

    <section class="page" data-testid="resume-page-2">
      <div data-testid="resume-more-projects">
        <h2>More Projects</h2>
        ${additionalProjects.map((project) => buildProjectHtmlApplication(project, true)).join("")}
      </div>
    </section>
  </body>
</html>`;
}

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
  const snapshot = JSON.parse(snapshotRaw) as ProfileSnapshot;

  const linkedInHtml = buildLinkedInResumeHtml(snapshot);
  const applicationHtml = await buildApplicationResumeHtml(snapshot);
  const markdown = buildResumeMarkdown(snapshot);
  const linkedInDocx = await buildLinkedInDocxBuffer(snapshot);

  await mkdir(resumeDir, { recursive: true });

  const linkedInHtmlPath = join(resumeDir, "resume-linkedin.html");
  const applicationHtmlPath = join(resumeDir, "resume-application.html");
  const markdownPath = join(resumeDir, "resume.md");
  const linkedInPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume-LinkedIn.pdf");
  const applicationPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume.pdf");
  const linkedInDocxPath = join(
    resumeDir,
    "Zeddrix-Fabian-Resume-LinkedIn.docx",
  );

  await writeFile(linkedInHtmlPath, linkedInHtml);
  await writeFile(applicationHtmlPath, applicationHtml);
  await writeFile(markdownPath, markdown);
  await writeFile(linkedInDocxPath, linkedInDocx);

  await writePdf(linkedInHtml, linkedInPdfPath, "0.55in");
  await writePdf(applicationHtml, applicationPdfPath, "0");

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
