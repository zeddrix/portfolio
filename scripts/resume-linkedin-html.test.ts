import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildLinkedInResumeHtml } from "./generate-resume";

describe("buildLinkedInResumeHtml", () => {
  it("renders twelve experience roles and selected/additional project sections", () => {
    const snapshot = buildPortfolioSnapshot();
    const html = buildLinkedInResumeHtml(snapshot as never);

    expect(html).toContain("Selected Projects");
    expect(html).toContain("Additional Projects");
    expect(html).toContain('data-testid="resume-linkedin-skills"');
    expect(html).not.toContain("Primary depth in the stacks above");
    expect(html).not.toContain("2022");
    expect(html).not.toContain("2023");
    expect((html.match(/<article class="role">/g) ?? []).length).toBe(12);
    const experienceSection = html.split("<h2>Selected Projects")[0] ?? "";
    expect(experienceSection).toContain("Queue");
    expect(experienceSection.indexOf("Queue")).toBeLessThan(
      experienceSection.indexOf("Adverio"),
    );
  });
});
