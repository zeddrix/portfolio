import { escapeHtml } from "../../resume-content.js";
import type { ApplicationResumeBuildContext } from "../types.js";
import {
  buildContactBandHtml,
  buildMainSectionRibbon,
  buildProjectCompactHtml,
  buildProjectIndexGridHtml,
  buildTimelineHtml,
  wrapApplicationResumeHtml,
} from "../shared.js";

export function buildPortfolioLedResumeHtml(
  context: ApplicationResumeBuildContext,
): string {
  const {
    profile,
    summary,
    firstPageExperience,
    secondPageExperience,
    featuredProjects,
    remainingSelectedProjects,
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

      <section class="experience-section">
        ${buildMainSectionRibbon("Professional Experience")}
        ${buildTimelineHtml(firstPageExperience)}
      </section>

      <section class="featured-section" data-testid="resume-featured-projects">
        ${buildMainSectionRibbon("Featured Projects")}
        <div class="featured-projects">
          ${featuredProjects.map((project) => buildProjectCompactHtml(project)).join("")}
        </div>
      </section>
    </section>

    <section class="page page-full-width" data-testid="resume-page-2">
      <section class="page-two-section experience-section">
        ${buildMainSectionRibbon("Professional Experience (continued)")}
        ${buildTimelineHtml(secondPageExperience, true)}
      </section>

      ${
        remainingSelectedProjects.length > 0
          ? `
      <section class="page-two-section">
        ${buildMainSectionRibbon("Selected Projects")}
        ${remainingSelectedProjects.map((project) => buildProjectCompactHtml(project)).join("")}
      </section>`
          : ""
      }

      <section class="page-two-section">
        ${buildMainSectionRibbon("Project Index")}
        ${buildProjectIndexGridHtml(additionalProjects)}
      </section>
    </section>`;

  return wrapApplicationResumeHtml(profile, fontCss, body);
}
