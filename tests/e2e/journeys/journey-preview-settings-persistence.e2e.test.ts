import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  navigateToProjectViaGrid,
  scrollToTestId,
  setCapabilityLayout,
  setWorkLayout,
  waitForPageLoad,
} from "../fixtures/test-helpers";

test.describe.serial("Journey: preview settings persistence", () => {
  test("Case study + compact → reload → open project via case study link", async ({
    page,
  }) => {
    await gotoHomeWithCleanState(page);
    await setWorkLayout(page, "caseStudyLed");
    await setCapabilityLayout(page, "singleStack");
    await page.reload();

    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId(selectors.sections.approach)).toContainText(
      "End-to-end product delivery",
    );

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/queue`),
      page.getByTestId("case-study-link-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Grid + detailed → client filter → UseDelight detail", async ({
    page,
  }) => {
    await gotoHomeWithCleanState(page);
    await setWorkLayout(page, "featuredGrid");
    await setCapabilityLayout(page, "sevenBands");
    await page.reload();
    await waitForPageLoad(page);

    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();

    await navigateToProjectViaGrid(page, "usedelight", "client");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "UseDelight",
    );
  });

  test("Reset to defaults → verify grid and grouped restored", async ({
    page,
  }) => {
    await gotoHomeWithCleanState(page);
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId(selectors.work.grid)).toBeVisible();
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
  });
});
