import { devices, expect, test, type Page } from "@playwright/test";
import {
  getCarouselCenter,
  getWindowScrollY,
  gotoHomeWithCleanState,
  scrollCarouselToPosition,
  scrollToTestId,
  touchDrag,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

test.use({ ...devices["Pixel 5"] });

const verticalDragDistancePx = 180;
const horizontalDragDistancePx = 200;
const minVerticalScrollDeltaPx = 80;
const minHorizontalScrollDeltaPx = 40;

/** @param {Page} page */
async function centerCarouselInViewport(page: Page) {
  await scrollToTestId(page, selectors.work.carousel);
  await page.getByTestId(selectors.work.carousel).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const targetTop =
      window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "instant" });
  });
  await expect(page.getByTestId(selectors.work.carousel)).toBeInViewport();
}

test.describe("homepage carousel touch scroll", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage on mobile, when user swipes vertically on carousel center, then page scrolls down and work grid enters viewport", async ({
    page,
  }) => {
    await centerCarouselInViewport(page);
    const startScrollY = await getWindowScrollY(page);
    const center = await getCarouselCenter(page);

    await touchDrag(page, center, {
      x: center.x,
      y: center.y - verticalDragDistancePx,
    });

    await expect
      .poll(async () => getWindowScrollY(page))
      .toBeGreaterThan(startScrollY + minVerticalScrollDeltaPx);
    await expect(page.getByTestId(selectors.work.grid)).toBeInViewport();
  });

  test("Given homepage on mobile, when user swipes vertically on highlight card image, then page scroll is not trapped", async ({
    page,
  }) => {
    await centerCarouselInViewport(page);
    const highlightCard = page.getByTestId("highlight-card-0");
    const cardBox = await highlightCard.boundingBox();
    if (!cardBox) {
      throw new Error("Expected highlight card bounding box.");
    }

    const startScrollY = await getWindowScrollY(page);
    const startY = cardBox.y + cardBox.height * 0.35;
    const startX = cardBox.x + cardBox.width / 2;

    await touchDrag(
      page,
      { x: startX, y: startY },
      {
        x: startX,
        y: startY - verticalDragDistancePx,
      },
    );

    await expect
      .poll(async () => getWindowScrollY(page))
      .toBeGreaterThan(startScrollY + minVerticalScrollDeltaPx);

    const workGrid = page.getByTestId(selectors.work.grid);
    const aboutSection = page.getByTestId(selectors.sections.about);
    await expect(async () => {
      const gridVisible = await workGrid.isVisible();
      const aboutVisible = await aboutSection.isVisible();
      expect(gridVisible || aboutVisible).toBe(true);
      if (gridVisible) {
        await expect(workGrid).toBeInViewport();
      }
    }).toPass();
  });

  test("Given homepage on mobile, when user swipes horizontally on carousel, then carousel advances", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await scrollCarouselToPosition(page, 0);

    const carousel = page.getByTestId(selectors.work.carousel);
    const center = await getCarouselCenter(page);
    const secondCard = page.getByTestId("highlight-card-1");

    const startScrollLeft = await carousel.evaluate(
      (element) => element.scrollLeft,
    );
    const secondCardStartX =
      (await secondCard.boundingBox())?.x ?? Number.POSITIVE_INFINITY;

    await touchDrag(page, center, {
      x: center.x - horizontalDragDistancePx,
      y: center.y,
    });

    await expect
      .poll(async () => carousel.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(startScrollLeft + minHorizontalScrollDeltaPx);

    const secondCardEndX =
      (await secondCard.boundingBox())?.x ?? Number.NEGATIVE_INFINITY;
    const viewportCenterX = await page.evaluate(() => window.innerWidth / 2);
    expect(Math.abs(secondCardEndX - viewportCenterX)).toBeLessThan(
      Math.abs(secondCardStartX - viewportCenterX),
    );
  });
});
