import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

describe("buildApplicationResumeHtml application-resume", () => {
  it("renders two pages with ribbon sidebar, timeline, and category project grids", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    expect((html.match(/data-testid="resume-page-[12]"/g) ?? []).length).toBe(
      2,
    );
    expect(html).toContain('data-testid="resume-page-1-sidebar"');
    expect(html).toContain('data-testid="resume-sidebar-contact"');
    expect(html).toContain(".sidebar-ribbon");
    expect(html).toContain(".main-section-ribbon");
    expect(html).toContain("density-maximized");
    expect(html).toContain("layout-application-resume");
    expect(html).toContain("expanded-projects-grid");
    expect(html).toContain("timeline-row");
    expect(html).toContain("timeline-dates");
    expect(html).toContain("timeline-role");
    expect(html).toContain("timeline-company");
    expect(html).toContain("Professional Experience");
    expect(html).not.toContain("Professional Experience (continued)");
    expect(html).toContain("Client Work");
    expect(html).toContain("Personal Projects");
    expect(html).not.toContain("Selected Projects");
    expect(html).not.toContain("More Projects");
    expect(html).not.toContain("more-projects-grid");
    expect(html).not.toContain("more-project-card");

    const pageOne = html.split('data-testid="resume-page-2"')[0] ?? html;
    const pageOneTimelineRows = (pageOne.match(/class="timeline-row"/g) ?? [])
      .length;
    expect(pageOneTimelineRows).toBe(12);
    expect(pageOne).toContain("Queue");
    expect(pageOne.indexOf("Queue")).toBeLessThan(pageOne.indexOf("Adverio"));

    const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
    expect(pageTwo).not.toContain("timeline-row");
    expect(pageTwo).not.toContain('data-testid="resume-page-2-languages"');
    expect(pageTwo).toContain('data-testid="resume-client-projects"');
    expect(pageTwo).toContain('data-testid="resume-personal-projects"');

    const expandedCards = (pageTwo.match(/class="project-expanded"/g) ?? [])
      .length;
    expect(expandedCards).toBe(10);
  });
});
