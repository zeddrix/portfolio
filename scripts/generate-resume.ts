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
  splitExperienceForApplicationResume,
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
  compact = false,
): string {
  return experience
    .map((role) => {
      const titleLine = role.employmentType
        ? `${role.title} (${role.employmentType})`
        : role.title;
      if (compact) {
        return `
      <article class="role resume-card compact">
        <h3>${escapeHtml(titleLine)}</h3>
        <p class="company">${escapeHtml(role.company)}</p>
        <p class="meta">${escapeHtml(formatExperienceRange(role))} · ${escapeHtml(role.location)}</p>
      </article>`;
      }
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
  mode: "full" | "compact" | "minimal" = "full",
): string {
  const bullets = projectBullets(project, mode === "full" ? 2 : 1);
  const tech = project.techStack
    .slice(0, mode === "minimal" ? 4 : mode === "compact" ? 5 : 7)
    .join(" · ");

  if (mode === "minimal") {
    return `
      <p class="more-project-line">
        <strong>${escapeHtml(project.name)}</strong> —
        ${escapeHtml(formatResumeProjectRoleLine(project))}.
        ${escapeHtml(project.outcome || project.tagline)}.
        <span class="tech">${escapeHtml(tech)}</span>
      </p>`;
  }

  if (mode === "compact") {
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
  const { firstPageExperience, secondPageExperience } =
    splitExperienceForApplicationResume(experience, 8);
  const summary = buildSummary(snapshot);
  const fontCss = await buildInterFontFaceCss();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume</title>
    <style>
      ${fontCss}
      :root {
        --accent-dark: #5c4a3a;
        --accent-mid: #a67c6a;
        --accent-soft: #f3ebe3;
        --text-body: #2c2420;
        --text-muted: #6b5b4f;
        --rail-text: #faf7f4;
        --rail-meta: #ede4dc;
      }
      @page { size: letter; margin: 0; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        font-size: 8.4pt;
        line-height: 1.22;
        color: var(--text-body);
        background: var(--accent-soft);
      }
      h1, h2, h3, p, ul { margin: 0; }
      .page {
        break-after: page;
        page-break-after: always;
      }
      .page:last-child {
        break-after: auto;
        page-break-after: auto;
      }
      .page-with-rail {
        padding: 0.34in 0.4in 0.34in 0;
      }
      .page-full-width {
        padding: 0.34in 0.4in;
      }
      .page-one-grid {
        display: grid;
        grid-template-columns: 0.78fr 2.22fr;
        gap: 12px;
        align-items: stretch;
      }
      .resume-rail {
        background: var(--accent-mid);
        color: var(--rail-text);
        border-radius: 0;
        margin: 0;
        padding: 0.34in 11px 0.34in 0.4in;
      }
      .resume-rail h2 {
        color: var(--rail-text);
        border-bottom-color: rgba(255, 255, 255, 0.28);
      }
      .resume-rail .sidebar-group h3 {
        color: var(--rail-meta);
      }
      .resume-rail .sidebar-group p,
      .resume-rail .cert-title,
      .resume-rail .cert-meta,
      .resume-rail .languages {
        color: var(--rail-meta);
      }
      .resume-main {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .header {
        border-bottom: 2px solid var(--accent-mid);
        padding-bottom: 7px;
      }
      h1 {
        font-size: 25pt;
        font-weight: 800;
        color: var(--accent-dark);
        letter-spacing: 0.01em;
      }
      .title {
        margin-top: 3px;
        font-size: 11pt;
        font-weight: 600;
        color: var(--text-muted);
      }
      .contact-footer {
        margin-top: 6px;
        font-size: 8.2pt;
        color: var(--text-muted);
        letter-spacing: 0.01em;
      }
      h2 {
        font-size: 8.6pt;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--accent-dark);
        margin: 0 0 4px;
        border-bottom: 1px solid var(--accent-mid);
        padding-bottom: 2px;
      }
      .resume-card {
        border: 1px solid #e8ddd3;
        border-radius: 10px;
        background: #ffffff;
        padding: 6px 8px;
        margin-bottom: 4px;
        break-inside: avoid;
        box-shadow: 0 1px 0 rgba(92, 74, 58, 0.06);
      }
      .summary { color: var(--text-muted); }
      .role h3, .project h3 {
        font-size: 9pt;
        font-weight: 700;
        color: var(--text-body);
      }
      .company, .role-line {
        margin-top: 1px;
        font-size: 8.4pt;
        font-weight: 600;
        color: var(--text-muted);
      }
      .meta, .tech, .role-bullet {
        margin-top: 1px;
        font-size: 8pt;
        color: var(--text-muted);
      }
      ul {
        margin: 2px 0 0 14px;
        padding: 0;
      }
      li { margin-bottom: 1px; }
      .project.compact { margin-bottom: 3px; }
      .sidebar-group { margin-bottom: 6px; break-inside: avoid; }
      .sidebar-group h3 {
        font-size: 7.6pt;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 2px;
      }
      .sidebar-group p { font-size: 7.6pt; }
      .sidebar-cert { margin-bottom: 4px; }
      .cert-title { font-size: 7.6pt; font-weight: 600; }
      .cert-meta { font-size: 7.2pt; }
      .languages { font-size: 7.8pt; }
      .experience-grid .role { margin-bottom: 3px; }
      .experience-grid .role.compact { margin-bottom: 2px; padding: 5px 7px; }
      .page-two-section { margin-bottom: 7px; }
      .more-project-line {
        margin: 0 0 3px;
        font-size: 8pt;
        line-height: 1.2;
        color: var(--text-body);
        break-inside: avoid;
      }
      .more-project-line .tech { color: var(--text-muted); }
    </style>
  </head>
  <body>
    <section class="page page-with-rail" data-testid="resume-page-1">
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
            ${buildExperienceHtmlApplication(firstPageExperience)}
          </section>
        </div>
      </div>
    </section>

    <section class="page page-full-width" data-testid="resume-page-2">
      <section class="page-two-section experience-grid">
        <h2>Experience (continued)</h2>
        ${buildExperienceHtmlApplication(secondPageExperience, true)}
      </section>

      <section class="page-two-section">
        <h2>Selected Projects</h2>
        ${selectedProjects.map((project) => buildProjectHtmlApplication(project, "compact")).join("")}
      </section>

      <section class="page-two-section" data-testid="resume-more-projects">
        <h2>More Projects</h2>
        ${additionalProjects.map((project) => buildProjectHtmlApplication(project, "minimal")).join("")}
      </section>
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
