import { expect, test } from "@playwright/test";

test.describe("homepage capabilities", () => {
  test("Given homepage, when user reviews developer capabilities, then sections are developer-focused", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("capabilities-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("capability-card-fullstack")).toContainText(
      "Full-stack product development",
    );
    await expect(page.getByTestId("capability-card-deployment")).toContainText(
      "Deployment and infrastructure",
    );

    await page
      .getByTestId("capability-card-ai-workflow")
      .scrollIntoViewIfNeeded();
    await expect(page.getByTestId("capability-card-ai-workflow")).toContainText(
      "AI-assisted workflows",
    );
  });
});
