import { expect, test, type Page } from "@playwright/test";

const alignmentTolerancePx = 4;

/** @param {Page} page */
async function scrollCarousel(page: Page, scrollLeft: number) {
  await page.getByTestId("highlights-carousel").evaluate((element, left) => {
    element.scrollLeft = left;
  }, scrollLeft);
}

/** @param {Page} page */
async function getPageWidth(page: Page) {
  return page.evaluate(() => document.documentElement.clientWidth);
}

test.describe("homepage carousel layout", () => {
  test("Given homepage, when user scrolls carousel start/middle/end, then margins exist only at ends and cards bleed in between", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();
    await scrollCarousel(page, 0);
    await page.getByTestId("about-section").scrollIntoViewIfNeeded();

    const heroTitle = page.getByTestId("hero-title");
    const aboutSection = page.getByTestId("about-section");
    const firstCard = page.getByTestId("highlight-card-0");
    const startCard = page.getByTestId("highlight-card-0");
    const lastCard = page.getByTestId("highlight-card-4");
    const carousel = page.getByTestId("highlights-carousel");

    await expect(heroTitle).toBeVisible();
    await expect(aboutSection).toBeVisible();
    await expect(firstCard).toBeVisible();
    await expect(carousel).toBeVisible();

    const pageWidth = await getPageWidth(page);

    const heroBox = await heroTitle.boundingBox();
    const aboutBox = await aboutSection.boundingBox();
    const firstCardBox = await firstCard.boundingBox();
    const carouselBox = await carousel.boundingBox();

    if (!heroBox || !aboutBox || !firstCardBox || !carouselBox) {
      throw new Error(
        "Expected layout boxes to be available at carousel start.",
      );
    }

    expect(Math.abs(heroBox.x - aboutBox.x)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );
    expect(Math.abs(firstCardBox.x - aboutBox.x)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );
    expect(Math.abs(carouselBox.x)).toBeLessThanOrEqual(alignmentTolerancePx);
    expect(
      Math.abs(carouselBox.x + carouselBox.width - pageWidth),
    ).toBeLessThanOrEqual(alignmentTolerancePx);

    const middleScrollLeft = await carousel.evaluate((element) =>
      Math.floor(element.scrollWidth / 2),
    );
    await scrollCarousel(page, middleScrollLeft);

    const startCardBoxAtMiddle = await startCard.boundingBox();
    const carouselBoxAtMiddle = await carousel.boundingBox();
    const aboutBoxAtMiddle = await aboutSection.boundingBox();

    if (!startCardBoxAtMiddle || !carouselBoxAtMiddle || !aboutBoxAtMiddle) {
      throw new Error(
        "Expected layout boxes to be available at carousel middle.",
      );
    }

    expect(startCardBoxAtMiddle.x).toBeLessThan(
      aboutBoxAtMiddle.x - alignmentTolerancePx,
    );
    expect(Math.abs(carouselBoxAtMiddle.x)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );
    expect(
      Math.abs(carouselBoxAtMiddle.x + carouselBoxAtMiddle.width - pageWidth),
    ).toBeLessThanOrEqual(alignmentTolerancePx);

    const endScrollLeft = await carousel.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    );
    await scrollCarousel(page, endScrollLeft);

    const lastCardBox = await lastCard.boundingBox();
    const aboutBoxAtEnd = await aboutSection.boundingBox();

    if (!lastCardBox || !aboutBoxAtEnd) {
      throw new Error("Expected layout boxes to be available at carousel end.");
    }

    const aboutRight = aboutBoxAtEnd.x + aboutBoxAtEnd.width;
    const lastCardRight = lastCardBox.x + lastCardBox.width;

    expect(Math.abs(lastCardRight - aboutRight)).toBeLessThanOrEqual(
      alignmentTolerancePx,
    );

    await expect(page.getByTestId("about-description")).toContainText("(ATDD)");
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Testing & ATDD",
    );
  });
});
