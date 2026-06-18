import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

describe("buildApplicationResumeHtml refined-lorna", () => {
  it("renders two pages with ribbon sidebar, timeline v2, and project grid", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(
      snapshot as never,
      "refined-lorna",
    );

    expect((html.match(/data-testid="resume-page-[12]"/g) ?? []).length).toBe(
      2,
    );
    expect(html).toContain('data-testid="resume-page-1-sidebar"');
    expect(html).toContain('data-testid="resume-sidebar-contact"');
    expect(html).toContain(".sidebar-ribbon");
    expect(html).toContain(".main-section-ribbon");
    expect(html).toContain("density-maximized");
    expect(html).toContain("layout-refined-lorna");
    expect(html).toContain("project-expanded");
    expect(html).toContain("timeline-row");
    expect(html).toContain("timeline-dates");
    expect(html).toContain("timeline-role");
    expect(html).toContain("timeline-company");
    expect(html).toContain("more-projects-grid");
    expect(html).toContain("Professional Experience");
    expect(html).not.toContain("Professional Experience (continued)");
    expect(html).toContain("Selected Projects");
    expect(html).toContain("More Projects");

    const pageOne = html.split('data-testid="resume-page-2"')[0] ?? html;
    const pageOneTimelineRows = (pageOne.match(/class="timeline-row"/g) ?? [])
      .length;
    expect(pageOneTimelineRows).toBe(12);
    expect(pageOne).toContain("Queue");
    expect(pageOne.indexOf("Queue")).toBeLessThan(pageOne.indexOf("Adverio"));

    const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
    expect(pageTwo).not.toContain("timeline-row");
    expect(pageTwo).not.toContain('data-testid="resume-page-2-languages"');
  });
});
