import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

describe("buildApplicationResumeHtml", () => {
  it("renders two pages with rail only on page one and brown theme", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    expect((html.match(/data-testid="resume-page-[12]"/g) ?? []).length).toBe(
      2,
    );
    expect(html).toContain('data-testid="resume-page-1-sidebar"');
    expect(html).toContain('data-testid="resume-skills-footer-note"');
    expect(html).toContain("Primary depth in the stacks above");
    expect(html).toContain("AI-accelerated workflows");
    expect(html).toContain(".sidebar-skills-footer");
    expect(html).toContain("resume-rail");
    expect(html).toContain("page-with-rail");
    expect(html).toContain("page-full-width");
    expect(html).toContain("--accent-mid: #a67c6a");
    expect(html).not.toContain("#1e3a5f");
    expect(html).toContain("Selected Projects");
    expect(html).toContain("More Projects");
    expect(html).toContain("Experience (continued)");

    const pageTwo = html.split('data-testid="resume-page-2"')[1] ?? "";
    expect(pageTwo).not.toContain("resume-page-1-sidebar");
    expect(pageTwo).not.toContain('class="resume-rail"');

    const experienceSection = html.split("<h2>Experience (continued)")[0] ?? "";
    expect(experienceSection).toContain("Queue");
    expect(experienceSection.indexOf("Queue")).toBeLessThan(
      experienceSection.indexOf("Adverio"),
    );
  });
});
