import { expect, test } from "@playwright/test";
import { PAGES_HOME_PATH } from "./fixtures/pages-env";

test.describe("homepage tools strip", () => {
  test("Given homepage, when user reviews grouped tools strip, then stack groups render in order without duplicate chips", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);

    const toolsSection = page.getByTestId("tools-strip-section");
    await toolsSection.scrollIntoViewIfNeeded();

    await expect(page.getByTestId("tool-group-ai-delivery")).toBeVisible();
    await expect(
      page.getByTestId("tool-group-frontend-frameworks"),
    ).toBeVisible();
    await expect(page.getByTestId("tool-group-testing")).toBeVisible();

    const aiGroup = page.getByTestId("tool-group-ai-delivery");
    const testingGroup = page.getByTestId("tool-group-testing");
    const aiBox = await aiGroup.boundingBox();
    const testingBox = await testingGroup.boundingBox();
    expect(aiBox).not.toBeNull();
    expect(testingBox).not.toBeNull();
    if (aiBox && testingBox) {
      expect(aiBox.y).toBeLessThan(testingBox.y);
    }

    await expect(toolsSection).toContainText("SvelteKit");
    await expect(toolsSection).toContainText("Playwright");
    await expect(toolsSection).toContainText("Cloudflare");
    await expect(toolsSection).toContainText("Docker");
    await expect(page.getByTestId("capability-card-fullstack")).toHaveCount(0);

    const chipLabels = await toolsSection
      .locator('[data-testid^="tool-chip-"]')
      .allTextContents();
    const normalized = chipLabels.map((label) => label.trim()).filter(Boolean);
    expect(new Set(normalized).size).toBe(normalized.length);
  });
});
