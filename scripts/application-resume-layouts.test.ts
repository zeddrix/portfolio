import { describe, expect, it } from "vitest";
import { DEFAULT_APPLICATION_RESUME_LAYOUT } from "./application-resume-config";
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
      hasFeaturedProjects: false,
      projectGridClass: "more-projects-grid",
    },
    {
      layout: "executive" as const,
      hasSidebar: false,
      hasSkillsBand: true,
      hasFeaturedProjects: false,
      projectGridClass: "more-projects-grid",
    },
    {
      layout: "portfolio-led" as const,
      hasSidebar: false,
      hasSkillsBand: false,
      hasFeaturedProjects: true,
      projectGridClass: "project-index-grid",
    },
  ])(
    "renders $layout with two pages and layout-specific markers",
    async ({
      layout,
      hasSidebar,
      hasSkillsBand,
      hasFeaturedProjects,
      projectGridClass,
    }) => {
      const html = await buildApplicationResumeHtml(snapshot as never, layout);

      expect((html.match(/data-testid="resume-page-[12]"/g) ?? []).length).toBe(
        2,
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
        expect(html).toContain('data-testid="resume-skills-footer-note"');
      } else if (layout === "refined-lorna") {
        expect(html).toContain('data-testid="resume-skills-footer-note"');
      }

      if (hasFeaturedProjects) {
        expect(html).toContain('data-testid="resume-featured-projects"');
        const pageOne = html.split('data-testid="resume-page-2"')[0] ?? "";
        const featuredSection =
          pageOne.split('data-testid="resume-featured-projects"')[1] ?? "";
        expect(
          (featuredSection.match(/class="project-line compact"/g) ?? []).length,
        ).toBe(2);
      }

      const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
      expect(pageTwo).toContain(projectGridClass);
      expect(pageTwo).toContain('data-testid="resume-more-projects"');
      expect(html).toContain("timeline-role");
      expect(html).toContain("timeline-company");
      expect(html).toContain("Professional Experience");
    },
  );
});
