import { expect, test } from "@playwright/test";

test.describe("project details routing", () => {
  test("Given homepage work grid, when user opens a project, then detail page shows metadata and stack", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await page.getByTestId("work-filter-personal").click();
    await page.getByTestId("project-link-queue").click();
    await page.waitForURL("**/projects/queue");

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
    await expect(page.getByTestId("project-detail-role")).toContainText(
      "Sole builder",
    );
    await expect(page.getByTestId("project-detail-status")).toContainText(
      "Live",
    );
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toContainText("PWA");
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "SvelteKit",
    );
  });

  test("Given approach section, when user opens band project link, then detail page loads", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("capability-bands-section").scrollIntoViewIfNeeded();
    await page.getByTestId("band-project-link-pwa-queue").click();
    await page.waitForURL("**/projects/queue");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
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
