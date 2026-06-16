import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  navigateToProjectViaCarousel,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe.serial("Journey: home to project discovery", () => {
  test("Hero → work carousel → Queue detail → back home", async ({ page }) => {
    await gotoHome(page);

    await scrollToTestId(page, selectors.work.section);

    await navigateToProjectViaCarousel(page, "queue");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );

    await page.getByTestId("project-detail-back-link").click();
    await page.waitForURL(new RegExp(`${PAGES_BASE_PATH}/?$`));
    await expect(page.getByTestId(selectors.hero.title)).toBeVisible();
  });

  test("Carousel showcase → MERN's Shop → related capabilities → back", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-4").scrollIntoViewIfNeeded();

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("showcase-project-link-merns-shop").click(),
    ]);
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toBeVisible();

    await page.getByTestId("project-detail-back-link").click();
    await expect(page.getByTestId(selectors.work.section)).toBeVisible();
  });

  test("Carousel card after MERN's Shop → AnswerIQ detail → related capabilities → back", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-5").scrollIntoViewIfNeeded();

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/answeriq`),
      page.getByTestId("showcase-project-link-answeriq").click(),
    ]);
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toBeVisible();

    await page.getByTestId("project-detail-back-link").click();
    await expect(page.getByTestId(selectors.work.section)).toBeVisible();
  });

  test("Tools strip → approach band → Adverio detail", async ({ page }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.tools);
    await scrollToTestId(page, selectors.sections.approach);

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/adverio-tools`),
      page.getByTestId("band-project-link-fullstack-adverio-tools").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Adverio Tools",
    );
  });
});
