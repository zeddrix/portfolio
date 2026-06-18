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
    expect(html).toContain('data-testid="resume-skills-footer-note"');
    expect(html).toContain("Primary depth in the stacks above");
    expect(html).toContain("AI-accelerated workflows");
    expect(html).toContain(".sidebar-ribbon");
    expect(html).toContain(".main-section-ribbon");
    expect(html).toContain("--sidebar-bg: #f0f0f0");
    expect(html).toContain("--ribbon-bg: #1f1f1f");
    expect(html).not.toContain("#a67c6a");
    expect(html).not.toContain("#1e3a5f");
    expect(html).not.toContain("contact-footer");
    expect(html).toContain("timeline-row");
    expect(html).toContain("timeline-dates");
    expect(html).toContain("timeline-role");
    expect(html).toContain("timeline-company");
    expect(html).toContain("more-projects-grid");
    expect(html).toContain("resume-rail");
    expect(html).toContain("page-with-rail");
    expect(html).toContain("page-full-width");
    expect(html).toContain("Professional Experience");
    expect(html).toContain("Professional Experience (continued)");
    expect(html).toContain("Selected Projects");
    expect(html).toContain("More Projects");

    const sidebar = html.split('data-testid="resume-page-1-sidebar"')[1] ?? "";
    expect(sidebar).toContain(snapshot.profile.contactEmail);
    expect(sidebar).toContain("sidebar-ribbon");
    expect(sidebar).toContain("Contact");

    const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
    expect(pageTwo).not.toContain("resume-page-1-sidebar");
    expect(pageTwo).not.toContain('class="resume-rail"');
    expect(pageTwo).toContain('data-testid="resume-more-projects"');

    const experienceSection =
      html.split("Professional Experience (continued)")[0] ?? "";
    const pageOneTimelineRows = (
      experienceSection.match(/class="timeline-row"/g) ?? []
    ).length;
    expect(pageOneTimelineRows).toBe(6);
    expect(experienceSection).toContain("Queue");
    expect(experienceSection.indexOf("Queue")).toBeLessThan(
      experienceSection.indexOf("Adverio"),
    );
  });
});
