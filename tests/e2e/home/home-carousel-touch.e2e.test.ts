import { devices, expect, test, type Page } from "@playwright/test";
import {
  getCarouselCardVisibleOverlapPx,
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
const horizontalDragDistancePx = 360;
const minVerticalScrollDeltaPx = 80;
const minHorizontalScrollDeltaPx = 80;
const minCarouselCardOverlapPx = 32;
const maxHorizontalSwipeAttempts = 3;

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

  test("Given homepage on mobile, when user swipes vertically on carousel center, then page scrolls down and approach section enters viewport", async ({
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
    await expect(
      page.getByTestId(selectors.sections.approach),
    ).toBeInViewport();
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

    const approachSection = page.getByTestId(selectors.sections.approach);
    await expect(async () => {
      await expect(approachSection).toBeVisible();
      await expect(approachSection).toBeInViewport();
    }).toPass();
  });

  test("Given homepage on mobile, when user swipes horizontally on carousel, then carousel advances", async ({
    page,
  }) => {
    await centerCarouselInViewport(page);
    await scrollCarouselToPosition(page, 0);

    const carousel = page.getByTestId(selectors.work.carousel);
    const startScrollLeft = await carousel.evaluate(
      (element) => element.scrollLeft,
    );

    const highlightCard = page.getByTestId("highlight-card-0");
    const cardBox = await highlightCard.boundingBox();
    if (!cardBox) {
      throw new Error("Expected highlight card bounding box.");
    }

    const swipeY = cardBox.y + cardBox.height * 0.35;

    let advanced = false;
    for (let attempt = 0; attempt < maxHorizontalSwipeAttempts; attempt += 1) {
      const startX = cardBox.x + cardBox.width * (0.8 - attempt * 0.05);
      await touchDrag(
        page,
        { x: startX, y: swipeY },
        { x: startX - horizontalDragDistancePx, y: swipeY },
        20,
      );

      const scrollLeft = await carousel.evaluate(
        (element) => element.scrollLeft,
      );
      const overlapPx = await getCarouselCardVisibleOverlapPx(
        page,
        "highlight-card-1",
      );

      if (
        scrollLeft > startScrollLeft + minHorizontalScrollDeltaPx &&
        overlapPx >= minCarouselCardOverlapPx
      ) {
        advanced = true;
        break;
      }
    }

    expect(advanced).toBe(true);
    await expect(page.getByTestId("highlights-carousel-prev")).toBeHidden();
    await expect(page.getByTestId("highlights-carousel-next")).toBeHidden();
  });
});
