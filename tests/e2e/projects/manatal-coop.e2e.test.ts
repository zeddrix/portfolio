import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, pagesPath } from "../fixtures/pages-env";
import {
  gotoHomeWithCleanState,
  scrollToTestId,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

test.describe("manatal coop project", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage carousel, when user opens Manatal Coop showcase, then detail page loads with placeholder", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-card-9")).toHaveAttribute(
      "data-highlight-slug",
      "manatal-coop",
    );

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/manatal-coop`),
      page.getByTestId("showcase-project-link-manatal-coop").click(),
    ]);

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Manatal Coop",
    );
    await expect(page.getByTestId("project-detail-hero-image")).toBeVisible();
  });

  test("Given Manatal detail, when page loads, then type label is Client work without Codefrost", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/manatal-coop"));

    await expect(page.getByTestId("project-detail-type")).toHaveText(
      "Client work",
    );
    await expect(page.getByTestId("project-detail-title")).not.toContainText(
      "Codefrost",
    );
    await expect(page.locator("body")).not.toContainText("Codefrost");
  });

  test("Given bolt-to-github detail, when page loads, then website and Chrome store links resolve", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/bolt-to-github"));

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Bolt to Github",
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://bolt2github.com/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveAttribute(
      "href",
      /chromewebstore\.google\.com/,
    );
    await expect(page.locator("body")).not.toContainText("Codefrost");
  });

  test("Given Manatal detail, when user clicks member app link, then external URL opens", async ({
    page,
    context,
  }) => {
    await page.goto(pagesPath("/projects/manatal-coop"));

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: "Member app" }).click(),
    ]);

    await expect(newPage).toHaveURL(/manatalcoop\.app/);
    await newPage.close();
  });
});
