import { expect, test } from "@playwright/test";
import { pagesPath } from "../fixtures/pages-env";

test.describe("project detail period", () => {
  test("Given MERN project page, when loaded, then period shows modernization timeline", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/merns-shop"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "MERN",
    );
    await expect(page.getByTestId("project-detail-period")).toContainText(
      "2026",
    );
    await expect(page.getByTestId("project-detail-period")).toContainText(
      "Modernized",
    );
  });

  test("Given Queue project page, when loaded, then period shows 2026", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/queue"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
    await expect(page.getByTestId("project-detail-period")).toContainText(
      "2026",
    );
  });
});
