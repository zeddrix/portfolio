import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  navigateToProjectViaCarousel,
  scrollToTestId,
  setCapabilityLayout,
  waitForPageLoad,
} from "../fixtures/test-helpers";

test.describe.serial("Journey: preview settings persistence", () => {
  test("Grouped default → reload → open project via carousel link", async ({
    page,
  }) => {
    await gotoHomeWithCleanState(page);
    await setCapabilityLayout(page, "groupedBands");
    await page.reload();

    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("highlight-card-2")).toBeVisible();
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);

    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/queue`),
      page.getByTestId("showcase-project-link-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Detailed approach → carousel → UseDelight detail", async ({ page }) => {
    await gotoHomeWithCleanState(page);
    await setCapabilityLayout(page, "sevenBands");
    await page.reload();
    await waitForPageLoad(page);

    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();

    await navigateToProjectViaCarousel(page, "usedelight");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "UseDelight",
    );
  });

  test("Reset to defaults → verify grouped approach restored", async ({
    page,
  }) => {
    await gotoHomeWithCleanState(page);
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("highlight-card-9")).toBeVisible();
  });
});
