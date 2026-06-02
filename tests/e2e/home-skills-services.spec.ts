import { expect, test } from "@playwright/test";

test.describe("homepage capabilities", () => {
  test("Given homepage, when user reviews developer capabilities, then complete draft skill coverage is visible", async ({
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
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Github",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Docker Containerization",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Supabase",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Cloudflare",
    );
  });
});
