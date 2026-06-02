import { expect, test } from "@playwright/test";

test.describe("project details routing", () => {
  test("Given homepage, when user opens a project, then detail page shows stack and links", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("project-card-queue").scrollIntoViewIfNeeded();
    await page.getByTestId("project-link-queue").click();
    await page.waitForURL("**/projects/queue");

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "Supabase",
    );
  });

  test("Given unknown slug, when route loads, then not found page is shown", async ({
    page,
  }) => {
    await page.goto("/projects/non-existent");

    await expect(page.getByTestId("project-not-found")).toBeVisible();
    await page.getByTestId("project-not-found-home-link").click();
    await page.waitForURL("**/");
  });
});
