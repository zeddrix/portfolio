import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

describe("buildApplicationResumeHtml", () => {
  it("renders page-one rail, cards, and selected projects", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    expect(html).toContain('data-testid="resume-page-1-sidebar"');
    expect(html).toContain("resume-rail");
    expect(html).toContain("resume-card");
    expect(html).toContain("Selected Projects");
    expect(html).toContain("More Projects");
    expect(html).toContain("Adverio Tools");
    expect(html).toContain("UseDelight");
    expect(html).toContain("MERN");
    const experienceSection = html.split("<h2>Selected Projects")[0] ?? "";
    expect(experienceSection).toContain("Queue");
    expect(experienceSection.indexOf("Queue")).toBeLessThan(
      experienceSection.indexOf("Adverio"),
    );
  });
});
