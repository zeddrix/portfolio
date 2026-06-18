import { escapeHtml } from "../../resume-content.js";
import type { ApplicationResumeBuildContext } from "../types.js";
import {
  buildCompactSkillsBandHtml,
  buildContactBandHtml,
  buildExecutiveSectionTitle,
  buildFooterCertsHtml,
  buildMoreProjectsGridHtml,
  buildProjectExpandedHtml,
  buildTimelineHtml,
  DENSITY_MAXIMIZED_CSS,
  wrapApplicationResumeHtml,
} from "../shared.js";

export function buildExecutiveResumeHtml(
  context: ApplicationResumeBuildContext,
): string {
  const {
    profile,
    certificates,
    toolStripGroups,
    config,
    summary,
    firstPageExperience,
    secondPageExperience,
    selectedProjects,
    additionalProjects,
    fontCss,
  } = context;

  const body = `
    <section class="page page-full-width page-one" data-testid="resume-page-1">
      <header class="header">
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="title">${escapeHtml(profile.jobTitle)}</p>
        ${buildContactBandHtml(profile)}
      </header>

      <p class="summary">${escapeHtml(summary)}</p>

      ${buildCompactSkillsBandHtml(toolStripGroups)}

      <section class="experience-section">
        ${buildExecutiveSectionTitle("Professional Experience")}
        ${buildTimelineHtml(firstPageExperience, { bulletCount: config.pageOneBulletCount })}
      </section>
    </section>

    <section class="page page-full-width page-two" data-testid="resume-page-2">
      <section class="page-two-section experience-section">
        ${buildExecutiveSectionTitle("Professional Experience (continued)")}
        ${buildTimelineHtml(secondPageExperience, { compact: true })}
      </section>

      <section class="page-two-section">
        ${buildExecutiveSectionTitle("Selected Projects")}
        ${selectedProjects.map((project) => buildProjectExpandedHtml(project)).join("")}
      </section>

      <section class="page-two-section">
        ${buildExecutiveSectionTitle("More Projects")}
        ${buildMoreProjectsGridHtml(additionalProjects)}
      </section>

      ${buildFooterCertsHtml(certificates)}
    </section>`;

  return wrapApplicationResumeHtml(profile, fontCss, body, {
    bodyClass: "density-maximized layout-executive",
    extraCss: DENSITY_MAXIMIZED_CSS,
  });
}
