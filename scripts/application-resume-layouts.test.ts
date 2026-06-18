import { describe, expect, it } from "vitest";
import {
  DEFAULT_APPLICATION_RESUME_LAYOUT,
  getExpectedPageCount,
} from "./application-resume-config";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

describe("buildApplicationResumeHtml layouts", () => {
  const snapshot = buildPortfolioSnapshot();

  it("defaults to refined-lorna when layout is omitted", async () => {
    const defaultHtml = await buildApplicationResumeHtml(snapshot as never);
    const explicitHtml = await buildApplicationResumeHtml(
      snapshot as never,
      DEFAULT_APPLICATION_RESUME_LAYOUT,
    );

    expect(DEFAULT_APPLICATION_RESUME_LAYOUT).toBe("refined-lorna");
    expect(defaultHtml).toBe(explicitHtml);
    expect(defaultHtml).toContain('data-testid="resume-page-1-sidebar"');
  });

  it.each([
    {
      layout: "refined-lorna" as const,
      hasSidebar: true,
      hasSkillsBand: false,
      hasSkillsInline: false,
      hasFeaturedProjects: false,
      hasPageTwoFooter: false,
      projectGridClass: "more-projects-grid",
      pageOneExperienceRows: 12,
      pageTwoCompactRows: 0,
      pageOneNonCompactRows: 12,
      featuredProjectCount: 0,
      featuredProjectNames: [] as string[],
      hasPageTwoLanguages: false,
    },
    {
      layout: "executive" as const,
      hasSidebar: false,
      hasSkillsBand: true,
      hasSkillsInline: false,
      hasFeaturedProjects: false,
      hasPageTwoFooter: true,
      projectGridClass: "more-projects-grid",
      pageOneExperienceRows: 8,
      pageTwoCompactRows: 4,
      pageOneNonCompactRows: 8,
      featuredProjectCount: 0,
      featuredProjectNames: [] as string[],
      hasPageTwoLanguages: false,
    },
    {
      layout: "portfolio-led" as const,
      hasSidebar: false,
      hasSkillsBand: false,
      hasSkillsInline: true,
      hasFeaturedProjects: true,
      hasPageTwoFooter: false,
      projectGridClass: "",
      pageOneExperienceRows: 6,
      pageTwoCompactRows: 0,
      pageOneNonCompactRows: 0,
      featuredProjectCount: 4,
      featuredProjectNames: [
        "Adverio Tools",
        "UseDelight",
        "MERN's Shop",
        "Queue",
      ],
      hasPageTwoLanguages: false,
    },
  ])(
    "renders $layout with target page count and layout-specific markers",
    async ({
      layout,
      hasSidebar,
      hasSkillsBand,
      hasSkillsInline,
      hasFeaturedProjects,
      hasPageTwoFooter,
      projectGridClass,
      pageOneExperienceRows,
      pageTwoCompactRows,
      pageOneNonCompactRows,
      featuredProjectCount,
      featuredProjectNames,
      hasPageTwoLanguages,
    }) => {
      const html = await buildApplicationResumeHtml(snapshot as never, layout);
      const expectedPages = getExpectedPageCount(layout);

      expect((html.match(/data-testid="resume-page-1"/g) ?? []).length).toBe(1);
      expect((html.match(/data-testid="resume-page-2"/g) ?? []).length).toBe(
        expectedPages === 2 ? 1 : 0,
      );

      if (hasSidebar) {
        expect(html).toContain('data-testid="resume-page-1-sidebar"');
        expect(html).toContain(".main-section-ribbon");
      } else {
        expect(html).not.toContain('data-testid="resume-page-1-sidebar"');
        expect(html).toContain('data-testid="resume-contact-band"');
      }

      if (hasSkillsBand) {
        expect(html).toContain('data-testid="resume-skills-band"');
        expect(html).toContain("skills-band-compact");
      }

      if (hasSkillsInline) {
        expect(html).toContain('data-testid="resume-skills-inline"');
      }

      if (hasFeaturedProjects) {
        expect(html).toContain('data-testid="resume-featured-projects"');
        expect(html).toContain("density-compact-one-page");
        const featuredSection =
          html.split('data-testid="resume-featured-projects"')[1] ?? "";
        expect(
          (featuredSection.match(/class="project-line compact"/g) ?? []).length,
        ).toBe(featuredProjectCount);
        for (const projectName of featuredProjectNames) {
          expect(featuredSection).toContain(projectName);
        }
      }

      if (hasPageTwoFooter) {
        const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
        expect(pageTwo).toContain('data-testid="resume-page-2-footer"');
      }

      if (hasPageTwoLanguages) {
        const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
        expect(pageTwo).toContain('data-testid="resume-page-2-languages"');
      }

      if (projectGridClass) {
        const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
        expect(pageTwo).toContain(projectGridClass);
        expect(pageTwo).toContain('data-testid="resume-more-projects"');
      }

      const pageOne = html.split('data-testid="resume-page-2"')[0] ?? html;
      const experienceBlock = pageOne.split("Featured Projects")[0] ?? pageOne;
      expect(
        (experienceBlock.match(/class="timeline-row(?: compact)?"/g) ?? [])
          .length,
      ).toBe(pageOneExperienceRows);

      if (pageOneNonCompactRows > 0) {
        expect(
          (experienceBlock.match(/class="timeline-row"/g) ?? []).length,
        ).toBe(pageOneNonCompactRows);
        expect(
          (experienceBlock.match(/class="timeline-row compact"/g) ?? []).length,
        ).toBe(0);
      }

      if (pageTwoCompactRows > 0) {
        const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
        const pageTwoExperience = pageTwo.split("Selected Projects")[0] ?? "";
        expect(
          (pageTwoExperience.match(/class="timeline-row compact"/g) ?? [])
            .length,
        ).toBe(pageTwoCompactRows);
      }

      expect(html).toContain("timeline-role");
      expect(html).toContain("Professional Experience");
    },
  );
});
