#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  formatResumeProjectHeader,
  formatResumeProjectRoleLine,
  type ResumeProjectContext,
} from "./resume-project-header.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const resumeDir = join(rootDir, "resume");

interface ProjectLink {
  label: string;
  url: string;
}

interface DetailSection {
  title: string;
  body: string;
}

interface ProjectSnapshot {
  slug: string;
  name: string;
  role: string;
  outcome: string;
  tagline: string;
  description: string;
  techStack: string[];
  links: ProjectLink[];
  detailSections: DetailSection[];
  displayDomain?: string;
  resumeContext?: ResumeProjectContext;
}

interface ExperienceSnapshot {
  id: string;
  company: string;
  title: string;
  employmentType?: string;
  location: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
}

interface CertificateSnapshot {
  slug: string;
  title: string;
  issuer: string;
  issuedAt: string;
  skills: string[];
  verifyUrl: string;
  udemyCredentialId?: string;
}

interface ProfileSnapshot {
  profile: {
    name: string;
    heroSubtitle: string;
    about: string[];
    contactEmail: string;
    websiteUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    specialization: string;
    experienceSince: string;
    jobTitle: string;
  };
  experience: ExperienceSnapshot[];
  certificates: CertificateSnapshot[];
  highlightProjects: ProjectSnapshot[];
  moreProjects: ProjectSnapshot[];
  caseStudySlugs: string[];
  toolStripGroups: Array<{ title: string; items: string[] }>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMonthYear(value: string): string {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatExperienceRange(experience: ExperienceSnapshot): string {
  const start = formatMonthYear(experience.startDate);
  const end = experience.endDate
    ? formatMonthYear(experience.endDate)
    : "Present";
  return `${start} – ${end}`;
}

function formatCertificateMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function projectBullets(project: ProjectSnapshot, limit = 2): string[] {
  const bullets: string[] = [];

  if (project.outcome) {
    bullets.push(project.outcome);
  }

  const approach = project.detailSections.find(
    (section) => section.title.toLowerCase() === "approach",
  );
  if (approach) {
    bullets.push(approach.body);
  }

  if (project.displayDomain) {
    bullets.push(`Deployed at ${project.displayDomain}.`);
  }

  return bullets.slice(0, limit);
}

function formatLinks(project: ProjectSnapshot): string {
  if (project.links.length === 0) {
    return "";
  }

  return project.links.map((link) => link.url).join(" · ");
}

function buildSummary(snapshot: ProfileSnapshot): string {
  return [
    snapshot.profile.heroSubtitle,
    ...snapshot.profile.about.slice(0, 2),
  ].join(" ");
}

function partitionProjects(snapshot: ProfileSnapshot): {
  selectedProjects: ProjectSnapshot[];
  additionalProjects: ProjectSnapshot[];
  pageOneProjects: ProjectSnapshot[];
  pageTwoProjects: ProjectSnapshot[];
} {
  const caseStudySet = new Set(snapshot.caseStudySlugs);
  const selectedProjects = snapshot.highlightProjects.filter((project) =>
    caseStudySet.has(project.slug),
  );
  const additionalProjects = [
    ...snapshot.highlightProjects.filter(
      (project) => !caseStudySet.has(project.slug),
    ),
    ...snapshot.moreProjects,
  ];

  return {
    selectedProjects,
    additionalProjects,
    pageOneProjects: selectedProjects.slice(0, 3),
    pageTwoProjects: selectedProjects.slice(3),
  };
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
  const bullets = projectBullets(project);
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

function buildSkillsText(groups: ProfileSnapshot["toolStripGroups"]): string {
  return groups
    .map((group) => `${group.title}: ${group.items.join(", ")}`)
    .join("\n");
}

function buildCertificatesText(certificates: CertificateSnapshot[]): string {
  return certificates
    .map(
      (certificate) =>
        `${certificate.title} (${certificate.issuer}, ${formatCertificateMonthYear(certificate.issuedAt)}) — ${certificate.verifyUrl}`,
    )
    .join("\n");
}

function buildLinkedInResumeHtml(snapshot: ProfileSnapshot): string {
  const { profile, experience, certificates, toolStripGroups } = snapshot;
  const { selectedProjects, additionalProjects } = partitionProjects(snapshot);
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

    <section>
      <h2>Experience</h2>
      ${buildExperienceHtmlLinkedIn(experience)}
    </section>

    <section>
      <h2>Projects</h2>
      ${selectedProjects.map((project) => buildProjectHtmlLinkedIn(project)).join("")}
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
      const bullets = role.bullets
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join("");

      return `
      <article class="role">
        <h3>${escapeHtml(titleLine)}</h3>
        <p class="company">${escapeHtml(role.company)}</p>
        <p class="meta">${escapeHtml(formatExperienceRange(role))} · ${escapeHtml(role.location)}</p>
        <ul>${bullets}</ul>
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
      <article class="project compact">
        <h3>${escapeHtml(project.name)}</h3>
        <p class="role-line">${escapeHtml(formatResumeProjectRoleLine(project))}</p>
        <p>${escapeHtml(project.outcome || project.tagline)}</p>
        <p class="tech">${escapeHtml(tech)}</p>
      </article>`;
  }

  return `
    <article class="project">
      <h3>${escapeHtml(project.name)}</h3>
      <p class="role-line">${escapeHtml(formatResumeProjectRoleLine(project))}</p>
      <ul>
        ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <p class="tech">${escapeHtml(tech)}</p>
    </article>`;
}

function buildApplicationResumeHtml(snapshot: ProfileSnapshot): string {
  const { profile, experience, certificates, toolStripGroups } = snapshot;
  const { pageOneProjects, pageTwoProjects, additionalProjects } =
    partitionProjects(snapshot);
  const summary = buildSummary(snapshot);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume</title>
    <style>
      @page { size: letter; margin: 0.45in 0.5in; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        font-size: 9.2pt;
        line-height: 1.28;
        color: #1f2937;
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
      .page-one-main,
      .page-two-main {
        width: 100%;
      }
      .page-two-grid {
        display: grid;
        grid-template-columns: 1.05fr 2fr;
        gap: 18px;
        align-items: start;
      }
      .header {
        border-bottom: 2px solid #1e3a5f;
        padding-bottom: 10px;
        margin-bottom: 12px;
      }
      h1 {
        font-size: 21pt;
        color: #1e3a5f;
        letter-spacing: 0.02em;
      }
      .title {
        margin-top: 4px;
        font-size: 11pt;
        font-weight: 600;
        color: #334155;
      }
      .contact {
        margin-top: 8px;
        font-size: 9pt;
        color: #475569;
      }
      h2 {
        font-size: 9.5pt;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #1e3a5f;
        margin: 10px 0 5px;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 2px;
      }
      .summary { color: #334155; }
      .role, .project { margin-bottom: 7px; break-inside: avoid; }
      .role h3, .project h3 {
        font-size: 10pt;
        color: #0f172a;
      }
      .company, .role-line {
        margin-top: 1px;
        font-size: 9.2pt;
        font-weight: 600;
        color: #475569;
      }
      .meta {
        margin-top: 1px;
        font-size: 8.8pt;
        color: #64748b;
      }
      ul {
        margin: 3px 0 0 16px;
        padding: 0;
      }
      li { margin-bottom: 2px; }
      .tech {
        margin-top: 2px;
        font-size: 8.8pt;
        color: #64748b;
      }
      .project.compact { margin-bottom: 6px; }
      .page-break { break-before: page; padding-top: 0; }
      .sidebar {
        background: #f8fafc;
        border-left: 3px solid #1e3a5f;
        border-radius: 0 8px 8px 0;
        padding: 12px 10px 12px 12px;
      }
      .sidebar h2 {
        margin-top: 0;
      }
      .sidebar-group {
        margin-bottom: 8px;
        break-inside: avoid;
      }
      .sidebar-group h3 {
        font-size: 8.6pt;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #1e3a5f;
        margin-bottom: 2px;
      }
      .sidebar-group p {
        font-size: 8.5pt;
        color: #475569;
      }
      .sidebar-cert {
        margin-bottom: 6px;
      }
      .cert-title {
        font-size: 8.6pt;
        font-weight: 600;
        color: #0f172a;
      }
      .cert-meta {
        font-size: 8.2pt;
        color: #64748b;
      }
      .languages {
        font-size: 8.8pt;
        color: #475569;
      }
    </style>
  </head>
  <body>
    <section class="page" data-testid="resume-page-1">
        <div class="page-one-main" data-testid="resume-main">
          <header class="header">
            <h1>${escapeHtml(profile.name)}</h1>
            <p class="title">${escapeHtml(profile.jobTitle)}</p>
            <p class="contact">
              ${escapeHtml(profile.contactEmail)} ·
              ${escapeHtml(profile.websiteUrl.replace("https://", ""))} ·
              ${escapeHtml(profile.githubUrl.replace("https://", ""))} ·
              LinkedIn
            </p>
          </header>

          <section>
            <h2>Summary</h2>
            <p class="summary">${escapeHtml(summary)}</p>
          </section>

          <section>
            <h2>Experience</h2>
            ${buildExperienceHtmlApplication(experience)}
          </section>

          <section>
            <h2>Selected Projects</h2>
            ${pageOneProjects.map((project) => buildProjectHtmlApplication(project)).join("")}
          </section>
        </div>
      </section>

      <section class="page" data-testid="resume-page-2">
        <div class="page-two-grid">
          <aside class="sidebar" data-testid="resume-sidebar">
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

          <div class="page-two-main" data-testid="resume-main-page-2">
            <section>
              <h2>More Projects</h2>
              ${pageTwoProjects.map((project) => buildProjectHtmlApplication(project)).join("")}
              ${additionalProjects.map((project) => buildProjectHtmlApplication(project, true)).join("")}
            </section>
          </div>
        </div>
      </section>
  </body>
</html>`;
}

function buildResumeMarkdown(snapshot: ProfileSnapshot): string {
  const { profile, experience, certificates, toolStripGroups } = snapshot;
  const { selectedProjects, additionalProjects } = partitionProjects(snapshot);
  const summary = buildSummary(snapshot);

  const skills = toolStripGroups
    .map((group) => `- **${group.title}:** ${group.items.join(", ")}`)
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

## Core Skills

${skills}

## Selected Projects

${selected}

## Additional Projects

${additional}

## Professional Development

${certs}

## Languages

Tagalog (Native), English (Professional Working Proficiency)
`;
}

async function writePdf(html: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: outputPath,
    format: "Letter",
    printBackground: true,
    scale: 0.96,
    margin: {
      top: "0.45in",
      right: "0.5in",
      bottom: "0.45in",
      left: "0.5in",
    },
  });
  await browser.close();
}

async function main() {
  const snapshotRaw = await readFile(snapshotPath, "utf8");
  const snapshot = JSON.parse(snapshotRaw) as ProfileSnapshot;

  const linkedInHtml = buildLinkedInResumeHtml(snapshot);
  const applicationHtml = buildApplicationResumeHtml(snapshot);
  const markdown = buildResumeMarkdown(snapshot);

  await mkdir(resumeDir, { recursive: true });

  const linkedInHtmlPath = join(resumeDir, "resume-linkedin.html");
  const applicationHtmlPath = join(resumeDir, "resume-application.html");
  const markdownPath = join(resumeDir, "resume.md");
  const linkedInPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume-LinkedIn.pdf");
  const applicationPdfPath = join(resumeDir, "Zeddrix-Fabian-Resume.pdf");

  await writeFile(linkedInHtmlPath, linkedInHtml);
  await writeFile(applicationHtmlPath, applicationHtml);
  await writeFile(markdownPath, markdown);

  await writePdf(linkedInHtml, linkedInPdfPath);
  await writePdf(applicationHtml, applicationPdfPath);

  console.log(`Wrote ${linkedInHtmlPath}`);
  console.log(`Wrote ${applicationHtmlPath}`);
  console.log(`Wrote ${markdownPath}`);
  console.log(`Wrote ${linkedInPdfPath}`);
  console.log(`Wrote ${applicationPdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
