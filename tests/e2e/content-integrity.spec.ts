import { expect, test } from "@playwright/test";

test.describe("content integrity", () => {
  test("Given homepage, when user scans tools and approach sections, then required stack keywords are rendered", async ({
    page,
  }) => {
    await page.goto("/");

    const toolsSection = page.getByTestId("tools-strip-section");
    await toolsSection.scrollIntoViewIfNeeded();
    await expect(page.getByTestId("tool-group-ai-delivery")).toBeVisible();
    await expect(
      page.getByTestId("tool-group-frontend-frameworks"),
    ).toBeVisible();
    await expect(toolsSection).toContainText("SvelteKit");
    await expect(toolsSection).toContainText("TypeScript");
    await expect(toolsSection).toContainText("Angular");
    await expect(toolsSection).toContainText("Cursor IDE");
    await expect(toolsSection).toContainText("Claude Code");
    await expect(toolsSection).toContainText("Playwright");

    await page.getByTestId("capability-bands-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Cloudflare",
    );
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Docker",
    );
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Testing & ATDD",
    );
  });
});
