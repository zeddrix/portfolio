#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const resumeDir = join(rootDir, "resume");
const htmlPath = join(resumeDir, "resume.html");
const mdPath = join(resumeDir, "resume.md");
const pdfPath = join(resumeDir, "Zeddrix-Fabian-Resume.pdf");

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

function projectBullets(project: ProjectSnapshot): string[] {
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

  return bullets.slice(0, 2);
}

function formatLinks(project: ProjectSnapshot): string {
  if (project.links.length === 0) {
    return "";
  }

  return project.links.map((link) => link.url).join(" · ");
}

function buildSkillsHtml(groups: ProfileSnapshot["toolStripGroups"]): string {
  return groups
    .map(
      (group) => `
        <div class="skill-group">
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.items.join(" · "))}</p>
        </div>`,
    )
    .join("");
}

function buildProjectHtml(project: ProjectSnapshot, compact = false): string {
  const bullets = projectBullets(project);
  const links = formatLinks(project);
  const tech = project.techStack.slice(0, compact ? 6 : 8).join(" · ");

  if (compact) {
    return `
      <article class="project compact">
        <h3>${escapeHtml(project.name)} <span class="role">— ${escapeHtml(project.role)}</span></h3>
        <p>${escapeHtml(project.outcome || project.tagline)}</p>
        <p class="tech">${escapeHtml(tech)}</p>
      </article>`;
  }

  return `
    <article class="project">
      <h3>${escapeHtml(project.name)} <span class="role">— ${escapeHtml(project.role)}</span></h3>
      <ul>
        ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <p class="tech"><strong>Stack:</strong> ${escapeHtml(tech)}</p>
      ${links ? `<p class="links">${escapeHtml(links)}</p>` : ""}
    </article>`;
}

function buildResumeHtml(snapshot: ProfileSnapshot): string {
  const { profile, highlightProjects, moreProjects, toolStripGroups } =
    snapshot;

  const caseStudySet = new Set(snapshot.caseStudySlugs);
  const selectedProjects = highlightProjects.filter((project) =>
    caseStudySet.has(project.slug),
  );
  const additionalProjects = [
    ...highlightProjects.filter((project) => !caseStudySet.has(project.slug)),
    ...moreProjects,
  ];

  const summary = [profile.heroSubtitle, ...profile.about.slice(0, 2)].join(
    " ",
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume</title>
    <style>
      @page {
        size: letter;
        margin: 0.55in 0.6in;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        font-size: 9.8pt;
        line-height: 1.28;
        color: #18181b;
      }

      h1,
      h2,
      h3,
      p,
      ul {
        margin: 0;
      }

      .header {
        border-bottom: 1.5px solid #18181b;
        padding-bottom: 10px;
        margin-bottom: 14px;
      }

      h1 {
        font-size: 22pt;
        letter-spacing: 0.02em;
      }

      .title {
        margin-top: 4px;
        font-size: 11.5pt;
        font-weight: 600;
      }

      .contact {
        margin-top: 8px;
        font-size: 9.5pt;
        color: #3f3f46;
      }

      h2 {
        font-size: 10pt;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 10px 0 6px;
        border-bottom: 1px solid #d4d4d8;
        padding-bottom: 2px;
      }

      .summary {
        color: #27272a;
      }

      .skills {
        columns: 2;
        column-gap: 18px;
      }

      .skill-group {
        break-inside: avoid;
        margin-bottom: 6px;
      }

      .skill-group h3 {
        font-size: 9pt;
        margin-bottom: 1px;
      }

      .skill-group p {
        font-size: 8.8pt;
        color: #3f3f46;
      }

      .project {
        margin-bottom: 7px;
        break-inside: avoid;
      }

      .project h3 {
        font-size: 10pt;
      }

      .project .role {
        font-weight: 500;
        color: #3f3f46;
      }

      .project .summary,
      .project p {
        margin-top: 3px;
        color: #27272a;
      }

      .project ul {
        margin: 4px 0 0 18px;
        padding: 0;
      }

      .project li {
        margin-bottom: 2px;
      }

      .project .tech,
      .project .links {
        margin-top: 3px;
        font-size: 9.3pt;
        color: #52525b;
      }

      .project.compact {
        margin-bottom: 8px;
      }

      .page-break {
        break-before: page;
        padding-top: 2px;
      }

      .footer-note {
        margin-top: 12px;
        font-size: 9pt;
        color: #52525b;
      }
    </style>
  </head>
  <body>
    <header class="header">
      <h1>${escapeHtml(profile.name.toUpperCase())}</h1>
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
      <h2>Selected Projects</h2>
      ${selectedProjects.map((project) => buildProjectHtml(project)).join("")}
    </section>

    <section class="page-break">
      <h2>Core Skills</h2>
      <div class="skills">${buildSkillsHtml(toolStripGroups)}</div>
    </section>

    <section>
      <h2>Additional Projects</h2>
      ${additionalProjects.map((project) => buildProjectHtml(project, true)).join("")}
    </section>

    <section class="meta-row">
      <h2>Certifications & Languages</h2>
      <p>
        Certifications:
        <a href="${escapeHtml(profile.linkedinUrl)}/details/certifications/">LinkedIn</a>
        · Tagalog (Native) · English (Professional)
      </p>
    </section>
  </body>
</html>`;
}

function buildResumeMarkdown(snapshot: ProfileSnapshot): string {
  const { profile, highlightProjects, moreProjects, toolStripGroups } =
    snapshot;

  const caseStudySet = new Set(snapshot.caseStudySlugs);
  const selectedProjects = highlightProjects.filter((project) =>
    caseStudySet.has(project.slug),
  );
  const additionalProjects = [
    ...highlightProjects.filter((project) => !caseStudySet.has(project.slug)),
    ...moreProjects,
  ];

  const summary = [profile.heroSubtitle, ...profile.about.slice(0, 2)].join(
    " ",
  );

  const skills = toolStripGroups
    .map((group) => `- **${group.title}:** ${group.items.join(", ")}`)
    .join("\n");

  const selected = selectedProjects
    .map((project) => {
      const bullets = projectBullets(project)
        .map((bullet) => `  - ${bullet}`)
        .join("\n");
      return `### ${project.name} (${project.role})\n${project.tagline}\n${bullets}\n- **Stack:** ${project.techStack.join(", ")}`;
    })
    .join("\n\n");

  const additional = additionalProjects
    .map(
      (project) =>
        `- **${project.name}** (${project.role}) — ${project.outcome || project.tagline}. Stack: ${project.techStack.slice(0, 6).join(", ")}`,
    )
    .join("\n");

  return `# ${profile.name}

${profile.jobTitle}

${profile.contactEmail} | ${profile.websiteUrl} | ${profile.githubUrl} | ${profile.linkedinUrl}

## Summary

${summary}

## Core Skills

${skills}

## Selected Projects

${selected}

## Additional Projects

${additional}

## Certifications

${profile.linkedinUrl}/details/certifications/

## Languages

Tagalog (Native), English (Professional Working Proficiency)
`;
}

async function main() {
  const snapshotRaw = await readFile(snapshotPath, "utf8");
  const snapshot = JSON.parse(snapshotRaw) as ProfileSnapshot;

  const html = buildResumeHtml(snapshot);
  const markdown = buildResumeMarkdown(snapshot);

  await mkdir(resumeDir, { recursive: true });
  await writeFile(htmlPath, html);
  await writeFile(mdPath, markdown);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: pdfPath,
    format: "Letter",
    printBackground: true,
    scale: 0.94,
    margin: {
      top: "0.5in",
      right: "0.55in",
      bottom: "0.5in",
      left: "0.55in",
    },
  });
  await browser.close();

  console.log(`Wrote ${htmlPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`Wrote ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
