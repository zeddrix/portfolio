import { escapeHtml } from "../../resume-content.js";
import type { ApplicationResumeBuildContext } from "../types.js";
import {
  buildContactBandHtml,
  buildMainSectionRibbon,
  buildProjectCompactHtml,
  buildSkillsInlineHtml,
  buildTimelineHtml,
  DENSITY_COMPACT_ONE_PAGE_CSS,
  wrapApplicationResumeHtml,
} from "../shared.js";

function buildShortSummary(summary: string): string {
  const match = summary.match(/^[^.!?]+[.!?]/);
  return match?.[0]?.trim() ?? summary;
}

export function buildPortfolioLedResumeHtml(
  context: ApplicationResumeBuildContext,
): string {
  const {
    profile,
    toolStripGroups,
    summary,
    firstPageExperience,
    onePageProjects,
    fontCss,
  } = context;

  const body = `
    <section class="page page-full-width" data-testid="resume-page-1">
      <header class="header">
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="title">${escapeHtml(profile.jobTitle)}</p>
        ${buildContactBandHtml(profile)}
      </header>

      <p class="summary">${escapeHtml(buildShortSummary(summary))}</p>

      ${buildSkillsInlineHtml(toolStripGroups)}

      <section class="experience-section">
        ${buildMainSectionRibbon("Professional Experience")}
        ${buildTimelineHtml(firstPageExperience, { compact: true })}
      </section>

      <section class="featured-section" data-testid="resume-featured-projects">
        ${buildMainSectionRibbon("Featured Projects")}
        <div class="featured-projects">
          ${onePageProjects.map((project) => buildProjectCompactHtml(project)).join("")}
        </div>
      </section>
    </section>`;

  return wrapApplicationResumeHtml(profile, fontCss, body, {
    bodyClass: "density-compact-one-page",
    extraCss: DENSITY_COMPACT_ONE_PAGE_CSS,
  });
}
