import { expect, test, type Page } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  gotoHome,
  scrollCarouselNext,
  scrollCarouselToPosition,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

const alignmentTolerancePx = 4;

/** @param {Page} page */
async function getPageWidth(page: Page) {
  return page.evaluate(() => document.documentElement.clientWidth);
}

/** @param {import('@playwright/test').Locator} card @param {import('@playwright/test').Locator} url */
async function expectUrlCenteredInCard(
  card: import("@playwright/test").Locator,
  url: import("@playwright/test").Locator,
) {
  const cardBox = await card.boundingBox();
  const urlBox = await url.boundingBox();

  if (!cardBox || !urlBox) {
    throw new Error("Expected carousel card and URL bounding boxes.");
  }

  const cardCenterX = cardBox.x + cardBox.width / 2;
  const urlCenterX = urlBox.x + urlBox.width / 2;

  expect(Math.abs(urlCenterX - cardCenterX)).toBeLessThanOrEqual(
    alignmentTolerancePx,
  );
}

test.describe("homepage carousel layout", () => {
  test("Given homepage at desktop, when user lands without scrolling, then first carousel card is large relative to viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();

    const firstCard = page.getByTestId("highlight-card-0");
    const box = await firstCard.boundingBox();
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    if (!box) {
      throw new Error("Expected first carousel card bounding box.");
    }

    const expectedMinWidth = Math.min(viewportWidth * 0.88, 920) - 8;
    expect(box.width).toBeGreaterThanOrEqual(expectedMinWidth);
  });

  test("Given homepage at desktop, when user lands without scrolling, then second carousel card peeks at right edge", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();

    const secondCard = page.getByTestId("highlight-card-1");
    const box = await secondCard.boundingBox();
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    if (!box) {
      throw new Error("Expected second carousel card bounding box.");
    }

    expect(box.x).toBeLessThan(viewportWidth);
    expect(box.x + box.width).toBeGreaterThan(viewportWidth * 0.92);
  });

  test("Given homepage at desktop, when user lands without scrolling, then first carousel card peeks into viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);

    await expect(page.getByTestId("highlight-card-0")).toBeInViewport();
  });

  test("Given homepage at desktop, when user lands without scrolling, then carousel has no nav chevrons and tighter card gap", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();

    await expect(page.getByTestId("carousel-control-prev")).toHaveCount(0);
    await expect(page.getByTestId("carousel-control-next")).toHaveCount(0);

    const interCardGap = await page.evaluate(() => {
      const firstCard = document.querySelector(
        '[data-testid="highlight-card-0"]',
      );
      const secondCard = document.querySelector(
        '[data-testid="highlight-card-1"]',
      );
      if (!firstCard || !secondCard) return 0;
      const firstRect = firstCard.getBoundingClientRect();
      const secondRect = secondCard.getBoundingClientRect();
      return secondRect.left - firstRect.right;
    });

    expect(interCardGap).toBeGreaterThanOrEqual(12);
    expect(interCardGap).toBeLessThanOrEqual(22);
  });

  test("Given homepage, when user scrolls carousel with controls and positions, then margins exist only at ends", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);

    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await scrollCarouselToPosition(page, 0);
    await page.getByTestId(selectors.sections.about).scrollIntoViewIfNeeded();

    const heroTitle = page.getByTestId(selectors.hero.title);
    const aboutSection = page.getByTestId(selectors.sections.about);
    const firstCard = page.getByTestId("highlight-card-0");
    const carousel = page.getByTestId(selectors.work.carousel);

    await expect(heroTitle).toBeVisible();
    await expect(firstCard).toBeVisible();

    const pageWidth = await getPageWidth(page);
    const heroBox = await heroTitle.boundingBox();
    const aboutBox = await aboutSection.boundingBox();
    const firstCardBox = await firstCard.boundingBox();
    const carouselBox = await carousel.boundingBox();

    if (!heroBox || !aboutBox || !firstCardBox || !carouselBox) {
      throw new Error("Expected layout boxes at carousel start.");
    }

    expect(Math.abs(heroBox.x - aboutBox.x)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );
    expect(Math.abs(firstCardBox.x - aboutBox.x)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );

    await scrollCarouselNext(page);
    await scrollCarouselNext(page);
    await assertNoHorizontalOverflow(page);

    const middleScrollLeft = await carousel.evaluate((element) =>
      Math.floor(element.scrollWidth / 2),
    );
    await scrollCarouselToPosition(page, middleScrollLeft);

    const startCardBoxAtMiddle = await page
      .getByTestId("highlight-card-0")
      .boundingBox();
    const aboutBoxAtMiddle = await aboutSection.boundingBox();
    if (!startCardBoxAtMiddle || !aboutBoxAtMiddle) {
      throw new Error("Expected layout boxes at carousel middle.");
    }
    expect(startCardBoxAtMiddle.x).toBeLessThan(
      aboutBoxAtMiddle.x - alignmentTolerancePx,
    );

    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(selectors.work.carousel)).toBeVisible();

    const endScrollLeft = await carousel.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    );
    await scrollCarouselToPosition(page, endScrollLeft);

    const lastCard = page.getByTestId("highlight-card-9");
    const lastCardBox = await lastCard.boundingBox();
    const aboutBoxAtEnd = await aboutSection.boundingBox();
    if (!lastCardBox || !aboutBoxAtEnd) {
      throw new Error("Expected layout boxes at carousel end.");
    }

    const aboutRight = aboutBoxAtEnd.x + aboutBoxAtEnd.width;
    const lastCardRight = lastCardBox.x + lastCardBox.width;
    expect(Math.abs(lastCardRight - aboutRight)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );
    expect(pageWidth).toBeGreaterThan(0);
  });

  test("Given homepage carousel on mobile, when user scrolls to UseDelight card, then project URL is centered within card edges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-0").scrollIntoViewIfNeeded();

    const card = page.getByTestId("highlight-card-0");
    const url = page.getByTestId("carousel-project-url-usedelight");

    await expect(card).toBeVisible();
    await expect(url).toHaveText("usedelight.com");
    await expectUrlCenteredInCard(card, url);
    await assertNoHorizontalOverflow(page);
  });

  test("Given homepage carousel on desktop, when user scrolls to UseDelight card, then project URL is centered within card edges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-0").scrollIntoViewIfNeeded();

    const card = page.getByTestId("highlight-card-0");
    const url = page.getByTestId("carousel-project-url-usedelight");

    await expect(card).toBeVisible();
    await expect(url).toHaveText("usedelight.com");
    await expectUrlCenteredInCard(card, url);
  });
});
