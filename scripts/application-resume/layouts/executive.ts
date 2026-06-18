import { escapeHtml } from "../../resume-content.js";
import type { ApplicationResumeBuildContext } from "../types.js";
import {
  buildContactBandHtml,
  buildExecutiveSectionTitle,
  buildMoreProjectsGridHtml,
  buildProjectCompactHtml,
  buildSkillsBandHtml,
  buildTimelineHtml,
  wrapApplicationResumeHtml,
} from "../shared.js";

export function buildExecutiveResumeHtml(
  context: ApplicationResumeBuildContext,
): string {
  const {
    profile,
    toolStripGroups,
    toolStripFooterNote,
    summary,
    firstPageExperience,
    secondPageExperience,
    selectedProjects,
    additionalProjects,
    fontCss,
  } = context;

  const body = `
    <section class="page page-full-width" data-testid="resume-page-1">
      <header class="header">
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="title">${escapeHtml(profile.jobTitle)}</p>
        ${buildContactBandHtml(profile)}
      </header>

      <p class="summary">${escapeHtml(summary)}</p>

      ${buildSkillsBandHtml(toolStripGroups, toolStripFooterNote)}

      <section class="experience-section">
        ${buildExecutiveSectionTitle("Professional Experience")}
        ${buildTimelineHtml(firstPageExperience)}
      </section>
    </section>

    <section class="page page-full-width" data-testid="resume-page-2">
      <section class="page-two-section experience-section">
        ${buildExecutiveSectionTitle("Professional Experience (continued)")}
        ${buildTimelineHtml(secondPageExperience, true)}
      </section>

      <section class="page-two-section">
        ${buildExecutiveSectionTitle("Selected Projects")}
        ${selectedProjects.map((project) => buildProjectCompactHtml(project)).join("")}
      </section>

      <section class="page-two-section">
        ${buildExecutiveSectionTitle("More Projects")}
        ${buildMoreProjectsGridHtml(additionalProjects)}
      </section>
    </section>`;

  return wrapApplicationResumeHtml(profile, fontCss, body);
}
