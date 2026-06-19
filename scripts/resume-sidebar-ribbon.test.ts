import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

const SIDEBAR_RIBBON_TEST_IDS = [
  "resume-sidebar-ribbon-contact",
  "resume-sidebar-ribbon-core-skills",
  "resume-sidebar-ribbon-professional-development",
  "resume-sidebar-ribbon-languages",
] as const;

describe("application resume sidebar ribbons", () => {
  it("uses full-height clip-path fold instead of fixed border triangle", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    expect(html).toContain("clip-path: polygon(0 0, 100% 50%, 0 100%)");
    expect(html).toMatch(/\.sidebar-ribbon::after[\s\S]*bottom:\s*0/);
    expect(html).not.toContain("border-top: 10px solid transparent");
  });

  it("exposes stable data-testids for all four sidebar ribbons", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    for (const testId of SIDEBAR_RIBBON_TEST_IDS) {
      expect(html).toContain(`data-testid="${testId}"`);
    }
  });

  it("renders Professional Development ribbon with correct label in sidebar", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);
    const sidebar =
      html
        .split('data-testid="resume-page-1-sidebar"')[1]
        ?.split("</aside>")[0] ?? "";

    expect(sidebar).toContain(
      'data-testid="resume-sidebar-ribbon-professional-development"',
    );
    expect(sidebar).toContain("Professional Development");
  });
});
