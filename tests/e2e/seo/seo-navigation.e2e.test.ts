import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, PAGES_SITE_URL } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("seo navigation metadata", () => {
  test("Given homepage, when user navigates to Queue project, then canonical and title update", async ({
    page,
  }) => {
    await gotoHome(page);

    await scrollToTestId(page, selectors.work.section);
    await page.getByTestId(selectors.work.filterPersonal).click();
    await Promise.all([
      page.waitForURL("**/projects/queue"),
      page.getByTestId("project-link-queue").click(),
    ]);

    await expect(page).toHaveTitle(/Queue.*Zeddrix Fabian/i);
    const projectCanonical = `${PAGES_SITE_URL}/projects/queue`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      projectCanonical,
    );
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given homepage approach band, when user opens MERN's Shop, then SEO meta and external links resolve", async ({
    page,
  }) => {
    await gotoHome(page);
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("band-project-link-atdd-merns-shop").click(),
    ]);

    await expect(page).toHaveTitle(/MERN's Shop.*Zeddrix Fabian/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/merns-shop`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /electronics|PayPal|Playwright/i,
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://merns-shop.onrender.com/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix/merns-shop",
    );
  });

  test("Given homepage billing band, when user opens AnswerIQ, then SEO meta and live demo link resolve", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/answeriq`),
      page.getByTestId("band-project-link-billing-answeriq").click(),
    ]);

    await expect(page).toHaveTitle(/AnswerIQ.*Zeddrix Fabian/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/answeriq`,
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://answeriq.io/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveCount(0);
  });
});
