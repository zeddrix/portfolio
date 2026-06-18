import { escapeHtml } from "../../resume-content.js";
import type { ApplicationResumeBuildContext } from "../types.js";
import {
  buildMainSectionRibbon,
  buildSidebarCertsHtml,
  buildSidebarContactHtml,
  buildSidebarRibbon,
  buildSidebarSkillsHtml,
  buildMoreProjectsGridHtml,
  buildProjectExpandedHtml,
  buildTimelineHtml,
  DENSITY_MAXIMIZED_CSS,
  wrapApplicationResumeHtml,
} from "../shared.js";

export function buildRefinedLornaResumeHtml(
  context: ApplicationResumeBuildContext,
): string {
  const {
    profile,
    certificates,
    toolStripGroups,
    config,
    summary,
    firstPageExperience,
    selectedProjects,
    additionalProjects,
    fontCss,
  } = context;

  const body = `
    <section class="page page-with-rail page-one" data-testid="resume-page-1">
      <div class="page-one-grid">
        <aside class="resume-rail" data-testid="resume-page-1-sidebar">
          <section class="sidebar-section">
            ${buildSidebarRibbon("Contact")}
            ${buildSidebarContactHtml(profile)}
          </section>
          <section class="sidebar-section">
            ${buildSidebarRibbon("Core Skills")}
            ${buildSidebarSkillsHtml(toolStripGroups, true)}
          </section>
          <section class="sidebar-section">
            ${buildSidebarRibbon("Professional Development")}
            ${buildSidebarCertsHtml(certificates)}
          </section>
          <section class="sidebar-section">
            ${buildSidebarRibbon("Languages")}
            <p class="languages">Tagalog (Native)<br />English (Professional)</p>
          </section>
        </aside>

        <div class="resume-main" data-testid="resume-main">
          <header class="header">
            <h1>${escapeHtml(profile.name)}</h1>
            <p class="title">${escapeHtml(profile.jobTitle)}</p>
          </header>

          <p class="summary">${escapeHtml(summary)}</p>

          <section class="experience-section">
            ${buildMainSectionRibbon("Professional Experience")}
            ${buildTimelineHtml(firstPageExperience, { bulletCount: config.pageOneBulletCount })}
          </section>
        </div>
      </div>
    </section>

    <section class="page page-full-width page-two" data-testid="resume-page-2">
      <section class="page-two-section">
        ${buildMainSectionRibbon("Selected Projects")}
        ${selectedProjects.map((project) => buildProjectExpandedHtml(project)).join("")}
      </section>

      <section class="page-two-section">
        ${buildMainSectionRibbon("More Projects")}
        ${buildMoreProjectsGridHtml(additionalProjects)}
      </section>
    </section>`;

  return wrapApplicationResumeHtml(profile, fontCss, body, {
    bodyClass: "density-maximized layout-refined-lorna",
    extraCss: DENSITY_MAXIMIZED_CSS,
  });
}
