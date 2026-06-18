import {
  escapeHtml,
  formatCertificateMonthYear,
  formatExperienceRange,
  formatResumeProjectRoleLine,
  type CertificateSnapshot,
  type ExperienceSnapshot,
  type ProfileSnapshot,
  type ProjectSnapshot,
} from "../resume-content.js";

export function buildSidebarRibbon(title: string): string {
  return `<h2 class="sidebar-ribbon">${escapeHtml(title)}</h2>`;
}

export function buildMainSectionRibbon(title: string): string {
  return `<h2 class="main-section-ribbon">${escapeHtml(title)}</h2>`;
}

export function buildExecutiveSectionTitle(title: string): string {
  return `<h2 class="executive-section-title">${escapeHtml(title)}</h2>`;
}

export function buildSidebarContactHtml(
  profile: ProfileSnapshot["profile"],
): string {
  return `
    <div class="sidebar-contact" data-testid="resume-sidebar-contact">
      <p><a href="mailto:${escapeHtml(profile.contactEmail)}">${escapeHtml(profile.contactEmail)}</a></p>
      <p><a href="${escapeHtml(profile.websiteUrl)}">${escapeHtml(profile.websiteUrl.replace("https://", ""))}</a></p>
      <p><a href="${escapeHtml(profile.githubUrl)}">${escapeHtml(profile.githubUrl.replace("https://", ""))}</a></p>
      <p><a href="${escapeHtml(profile.linkedinUrl)}">${escapeHtml(profile.linkedinUrl.replace("https://www.linkedin.com/in/", "linkedin.com/in/"))}</a></p>
    </div>`;
}

export function buildContactBandHtml(
  profile: ProfileSnapshot["profile"],
): string {
  return `
    <p class="contact-band" data-testid="resume-contact-band">
      <a href="mailto:${escapeHtml(profile.contactEmail)}">${escapeHtml(profile.contactEmail)}</a>
      <span class="contact-sep">·</span>
      <a href="${escapeHtml(profile.websiteUrl)}">${escapeHtml(profile.websiteUrl.replace("https://", ""))}</a>
      <span class="contact-sep">·</span>
      <a href="${escapeHtml(profile.githubUrl)}">${escapeHtml(profile.githubUrl.replace("https://", ""))}</a>
      <span class="contact-sep">·</span>
      <a href="${escapeHtml(profile.linkedinUrl)}">${escapeHtml(profile.linkedinUrl.replace("https://www.linkedin.com/in/", "linkedin.com/in/"))}</a>
    </p>`;
}

export function buildSidebarSkillsHtml(
  groups: ProfileSnapshot["toolStripGroups"],
  twoColumn = false,
): string {
  const groupClass = twoColumn ? "sidebar-group two-col" : "sidebar-group";
  return groups
    .map(
      (group) => `
        <div class="${groupClass}">
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.items.join(" · "))}</p>
        </div>`,
    )
    .join("");
}

export function buildSkillsBandHtml(
  groups: ProfileSnapshot["toolStripGroups"],
  footerNote: string,
): string {
  return `
    <section class="skills-band" data-testid="resume-skills-band">
      ${groups
        .map(
          (group) => `
        <div class="skills-band-group">
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.items.join(" · "))}</p>
        </div>`,
        )
        .join("")}
      <p class="skills-band-footer" data-testid="resume-skills-footer-note">${escapeHtml(footerNote)}</p>
    </section>`;
}

export function buildSidebarCertsHtml(
  certificates: CertificateSnapshot[],
): string {
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

function buildRoleTitle(role: ExperienceSnapshot): string {
  return role.employmentType
    ? `${role.title} (${role.employmentType})`
    : role.title;
}

export function buildTimelineRow(
  role: ExperienceSnapshot,
  compact = false,
): string {
  const roleTitle = buildRoleTitle(role);
  const dateLine = formatExperienceRange(role);

  if (compact) {
    return `
      <article class="timeline-row compact">
        <p class="timeline-dates">${escapeHtml(dateLine)}</p>
        <div class="timeline-divider" aria-hidden="true"></div>
        <div class="timeline-body">
          <p class="timeline-role"><strong>${escapeHtml(roleTitle)} — ${escapeHtml(role.company)}</strong></p>
          <p class="timeline-meta">${escapeHtml(role.location)}</p>
        </div>
      </article>`;
  }

  const bullet = role.bullets[0] ?? "";
  return `
      <article class="timeline-row">
        <p class="timeline-dates">${escapeHtml(dateLine)}</p>
        <div class="timeline-divider" aria-hidden="true"></div>
        <div class="timeline-body">
          <p class="timeline-role"><strong>${escapeHtml(roleTitle)}</strong></p>
          <p class="timeline-company">${escapeHtml(role.company)}</p>
          <p class="timeline-bullet">${escapeHtml(bullet)}</p>
        </div>
      </article>`;
}

export function buildTimelineHtml(
  experience: ExperienceSnapshot[],
  compact = false,
): string {
  return `<div class="timeline">${experience.map((role) => buildTimelineRow(role, compact)).join("")}</div>`;
}

export function buildProjectCompactHtml(project: ProjectSnapshot): string {
  const tech = project.techStack.slice(0, 5).join(" · ");
  return `
      <article class="project-line compact">
        <p class="project-line-title"><strong>${escapeHtml(project.name)}</strong> — ${escapeHtml(formatResumeProjectRoleLine(project))}</p>
        <p class="project-line-body">${escapeHtml(project.outcome || project.tagline)}</p>
        <p class="tech">${escapeHtml(tech)}</p>
      </article>`;
}

export function buildMoreProjectCardHtml(project: ProjectSnapshot): string {
  const tech = project.techStack.slice(0, 4).join(" · ");
  return `
        <article class="more-project-card">
          <p class="more-project-name"><strong>${escapeHtml(project.name)}</strong></p>
          <p class="more-project-role">${escapeHtml(formatResumeProjectRoleLine(project))}</p>
          <p class="more-project-outcome">${escapeHtml(project.outcome || project.tagline)}</p>
          <p class="tech">${escapeHtml(tech)}</p>
        </article>`;
}

export function buildMoreProjectsGridHtml(projects: ProjectSnapshot[]): string {
  return `
        <div class="more-projects-grid" data-testid="resume-more-projects">
          ${projects.map((project) => buildMoreProjectCardHtml(project)).join("")}
        </div>`;
}

export function buildProjectIndexRowHtml(project: ProjectSnapshot): string {
  const tech = project.techStack.slice(0, 4).join(" · ");
  return `
        <article class="project-index-row">
          <p class="project-index-name"><strong>${escapeHtml(project.name)}</strong></p>
          <p class="project-index-stack">${escapeHtml(tech)}</p>
          <p class="project-index-outcome">${escapeHtml(project.outcome || project.tagline)}</p>
        </article>`;
}

export function buildProjectIndexGridHtml(projects: ProjectSnapshot[]): string {
  return `
        <div class="project-index-grid" data-testid="resume-more-projects">
          ${projects.map((project) => buildProjectIndexRowHtml(project)).join("")}
        </div>`;
}

export function wrapApplicationResumeHtml(
  profile: ProfileSnapshot["profile"],
  fontCss: string,
  bodyContent: string,
  extraCss = "",
): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.name)} — Resume</title>
    <style>
      ${fontCss}
      ${SHARED_APPLICATION_RESUME_CSS}
      ${extraCss}
    </style>
  </head>
  <body>
    ${bodyContent}
  </body>
</html>`;
}

export const SHARED_APPLICATION_RESUME_CSS = `
      :root {
        --sidebar-bg: #f0f0f0;
        --ribbon-bg: #1f1f1f;
        --main-bg: #ffffff;
        --text-body: #222222;
        --text-muted: #555555;
        --rule-color: #cccccc;
        --accent-link: #2c5282;
        --timeline-divider: #999999;
      }
      @page { size: letter; margin: 0; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        font-size: 8.7pt;
        line-height: 1.32;
        color: var(--text-body);
        background: #ffffff;
      }
      a { color: var(--accent-link); text-decoration: none; }
      h1, h2, h3, p, ul { margin: 0; }
      .page {
        break-after: page;
        page-break-after: always;
        background: var(--main-bg);
      }
      .page:last-child {
        break-after: auto;
        page-break-after: auto;
      }
      .page-with-rail {
        padding: 0.3in 0.36in 0.3in 0;
      }
      .page-full-width {
        padding: 0.3in 0.36in;
      }
      .page-one-grid {
        display: grid;
        grid-template-columns: 0.82fr 2.18fr;
        gap: 10px;
        align-items: stretch;
      }
      .resume-rail {
        background: var(--sidebar-bg);
        color: var(--text-body);
        margin: 0;
        padding: 0.3in 10px 0.3in 0.36in;
      }
      .sidebar-ribbon,
      .main-section-ribbon {
        background: var(--ribbon-bg);
        color: #ffffff;
        font-size: 7.3pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 4px 8px 4px 10px;
        margin: 0 0 5px 0;
        position: relative;
      }
      .sidebar-ribbon::after,
      .main-section-ribbon::after {
        content: "";
        position: absolute;
        right: -5px;
        top: 0;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 5px solid var(--ribbon-bg);
      }
      .sidebar-section {
        margin-bottom: 7px;
        break-inside: avoid;
      }
      .sidebar-contact p {
        font-size: 7.4pt;
        line-height: 1.35;
        margin-bottom: 2px;
        color: var(--text-muted);
      }
      .resume-main {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .header {
        border-bottom: 1px solid var(--rule-color);
        padding-bottom: 6px;
        margin-bottom: 2px;
      }
      h1 {
        font-size: 22pt;
        font-weight: 800;
        color: var(--text-body);
        letter-spacing: 0.03em;
      }
      .title {
        margin-top: 2px;
        font-size: 10.5pt;
        font-weight: 600;
        color: var(--text-muted);
      }
      .summary {
        color: var(--text-muted);
        font-size: 8.5pt;
        line-height: 1.3;
      }
      .contact-band {
        margin-top: 4px;
        font-size: 7.6pt;
        line-height: 1.35;
        color: var(--text-muted);
      }
      .contact-sep { margin: 0 4px; color: var(--rule-color); }
      .executive-section-title {
        font-size: 9pt;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-body);
        border-bottom: 2px solid var(--text-body);
        padding-bottom: 2px;
        margin-bottom: 6px;
      }
      .skills-band {
        border: 1px solid var(--rule-color);
        background: #fafafa;
        padding: 6px 8px;
        margin-bottom: 4px;
        break-inside: avoid;
      }
      .skills-band-group {
        margin-bottom: 3px;
      }
      .skills-band-group h3 {
        font-size: 7pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 1px;
      }
      .skills-band-group p {
        font-size: 7.2pt;
        color: var(--text-muted);
        line-height: 1.28;
      }
      .skills-band-footer {
        margin-top: 4px;
        padding-top: 3px;
        border-top: 1px solid var(--rule-color);
        font-size: 6.6pt;
        line-height: 1.26;
        color: var(--text-muted);
      }
      .timeline-row {
        display: grid;
        grid-template-columns: 0.88in 2px 1fr;
        column-gap: 8px;
        margin-bottom: 6px;
        break-inside: avoid;
      }
      .timeline-row.compact {
        margin-bottom: 4px;
      }
      .timeline-dates {
        font-size: 7.5pt;
        font-weight: 600;
        color: var(--text-muted);
        line-height: 1.28;
        text-align: right;
        padding-right: 2px;
      }
      .timeline-divider {
        background: var(--timeline-divider);
        width: 2px;
        min-height: 100%;
      }
      .timeline-role {
        font-size: 8.5pt;
        line-height: 1.28;
        color: var(--text-body);
      }
      .timeline-company {
        margin-top: 1px;
        font-size: 7.8pt;
        line-height: 1.26;
        color: var(--text-muted);
      }
      .timeline-bullet,
      .timeline-meta {
        margin-top: 2px;
        font-size: 7.8pt;
        line-height: 1.28;
        color: var(--text-muted);
      }
      .sidebar-group { margin-bottom: 4px; break-inside: avoid; }
      .sidebar-group.two-col p {
        column-count: 2;
        column-gap: 6px;
      }
      .sidebar-group h3 {
        font-size: 7pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 1px;
        color: var(--text-body);
      }
      .sidebar-group p { font-size: 7.1pt; color: var(--text-muted); line-height: 1.26; }
      .sidebar-skills-footer {
        margin-top: 4px;
        padding-top: 3px;
        border-top: 1px solid var(--rule-color);
        font-size: 6.5pt;
        line-height: 1.26;
        color: var(--text-muted);
      }
      .sidebar-cert { margin-bottom: 3px; }
      .cert-title { font-size: 7.1pt; font-weight: 600; }
      .cert-meta { font-size: 6.7pt; color: var(--text-muted); }
      .languages { font-size: 7.3pt; color: var(--text-muted); }
      .page-two-section { margin-bottom: 7px; }
      .project-line { margin-bottom: 5px; break-inside: avoid; }
      .project-line-title { font-size: 8.3pt; }
      .project-line-body { font-size: 7.8pt; color: var(--text-muted); line-height: 1.28; }
      .tech {
        margin-top: 1px;
        font-size: 7.3pt;
        color: var(--text-muted);
      }
      .more-projects-grid,
      .project-index-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px 10px;
      }
      .more-project-card,
      .project-index-row {
        break-inside: avoid;
        padding-bottom: 3px;
      }
      .more-project-name,
      .project-index-name { font-size: 7.9pt; }
      .more-project-role { font-size: 7.4pt; color: var(--text-muted); }
      .more-project-outcome,
      .project-index-outcome {
        font-size: 7.3pt;
        color: var(--text-muted);
        line-height: 1.26;
      }
      .project-index-stack {
        font-size: 7.1pt;
        color: var(--text-muted);
        margin-top: 1px;
      }
      .featured-projects {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
`;
