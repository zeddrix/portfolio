import { expect, test, type Page } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  gotoHome,
  scrollCarouselNext,
  scrollCarouselToPosition,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

const alignmentTolerancePx = 4;
const manatalFillTolerancePx = 2;
const manatalHeightCapTolerancePx = 4;
const manatalPhoneFrameTolerancePx = 8;

const manatalSlidePatterns = [
  /manatal-coop-homepage/,
  /manatal-coop-signin/,
  /manatal-coop-chatbot/,
] as const;

/** @param {import('@playwright/test').Locator} card */
async function expectManatalImageFillsScreen(
  card: import("@playwright/test").Locator,
) {
  const screen = card.getByTestId("phone-device-screen");
  const image = card.getByTestId("carousel-project-image-manatal-coop");
  const screenBox = await screen.boundingBox();
  const imageBox = await image.boundingBox();

  if (!screenBox || !imageBox) {
    throw new Error("Expected Manatal screen and image bounding boxes.");
  }

  expect(Math.abs(imageBox.width - screenBox.width)).toBeLessThanOrEqual(
    manatalFillTolerancePx,
  );
  expect(Math.abs(imageBox.height - screenBox.height)).toBeLessThanOrEqual(
    manatalFillTolerancePx,
  );
}

/** @param {Page} page @param {RegExp} srcPattern */
async function waitForManatalSlide(page: Page, srcPattern: RegExp) {
  const manatalCard = page.getByTestId("highlight-card-9");
  const manatalImage = manatalCard.getByTestId(
    "carousel-project-image-manatal-coop",
  );
  await expect(manatalImage.locator("img")).toHaveAttribute("src", srcPattern);
  await expect(manatalImage).toHaveAttribute("data-image-state", "loaded");
  return manatalCard;
}

/** @param {import('@playwright/test').Locator} manatalCard */
async function expectManatalScreenHeightCapped(
  manatalCard: import("@playwright/test").Locator,
  usedelightCard: import("@playwright/test").Locator,
) {
  const manatalScreen = manatalCard.getByTestId("phone-device-screen");
  const usedelightBrowser = usedelightCard.getByTestId(
    "carousel-device-frame-browser",
  );
  const usedelightImageArea = usedelightBrowser.locator(
    ".aspect-\\[16\\/10\\]",
  );
  const manatalScreenBox = await manatalScreen.boundingBox();
  const browserImageBox = await usedelightImageArea.boundingBox();

  if (!manatalScreenBox || !browserImageBox) {
    throw new Error(
      "Expected Manatal screen and UseDelight browser image bounding boxes.",
    );
  }

  expect(manatalScreenBox.height).toBeLessThanOrEqual(
    browserImageBox.height + manatalHeightCapTolerancePx,
  );
}

/** @param {import('@playwright/test').Locator} manatalCard @param {import('@playwright/test').Locator} usedelightCard */
async function expectManatalPhoneFrameHeightCapped(
  manatalCard: import("@playwright/test").Locator,
  usedelightCard: import("@playwright/test").Locator,
) {
  const manatalPhone = manatalCard.getByTestId("carousel-device-frame-phone");
  const usedelightBrowser = usedelightCard.getByTestId(
    "carousel-device-frame-browser",
  );
  const manatalPhoneBox = await manatalPhone.boundingBox();
  const usedelightBrowserBox = await usedelightBrowser.boundingBox();

  if (!manatalPhoneBox || !usedelightBrowserBox) {
    throw new Error(
      "Expected Manatal phone and UseDelight browser frame bounding boxes.",
    );
  }

  expect(manatalPhoneBox.height).toBeLessThanOrEqual(
    usedelightBrowserBox.height + manatalPhoneFrameTolerancePx,
  );
}

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

/** @param {Page} page @param {number} maxGapPx */
async function expectTightCarouselToAboutGap(page: Page, maxGapPx: number) {
  await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
  await scrollCarouselToPosition(page, 0);

  const firstCardCta = page.getByTestId("showcase-project-link-usedelight");
  const aboutSection = page.getByTestId(selectors.sections.about);

  await expect(firstCardCta).toBeVisible();
  await expect(aboutSection).toBeAttached();

  const ctaBox = await firstCardCta.boundingBox();
  const aboutBox = await aboutSection.boundingBox();

  if (!ctaBox || !aboutBox) {
    throw new Error("Expected carousel CTA and about section bounding boxes.");
  }

  const gapPx = aboutBox.y - (ctaBox.y + ctaBox.height);
  expect(gapPx).toBeGreaterThanOrEqual(0);
  expect(gapPx).toBeLessThanOrEqual(maxGapPx);
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

  test("Given homepage at desktop with carousel at start, when user inspects UseDelight preview, then browser device frame is shown", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await scrollCarouselToPosition(page, 0);

    const usedelightCard = page.getByTestId("highlight-card-0");
    await expect(
      usedelightCard.getByTestId("carousel-device-frame-browser"),
    ).toBeVisible();
    await expect(
      usedelightCard.getByTestId("carousel-device-frame-phone"),
    ).toHaveCount(0);
    await expect(
      page.getByTestId("carousel-project-url-usedelight"),
    ).toBeVisible();
  });

  test("Given homepage at desktop with carousel at start, when user reads work then about, then spacing from first CTA to about is tight", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await expectTightCarouselToAboutGap(page, 136);
  });

  test("Given homepage on mobile with carousel at start, when user reads work then about, then spacing from first CTA to about is tight", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await expectTightCarouselToAboutGap(page, 96);
  });

  test("Given homepage at desktop with Manatal carousel card, when user compares preview to UseDelight, then Manatal phone is narrower and shorter", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await scrollCarouselToPosition(page, 0);
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();

    const usedelightCard = page.getByTestId("highlight-card-0");
    const manatalCard = page.getByTestId("highlight-card-9");
    const manatalPhone = manatalCard.getByTestId("carousel-device-frame-phone");
    const usedelightBox = await usedelightCard.boundingBox();
    const manatalPhoneBox = await manatalPhone.boundingBox();

    if (!usedelightBox || !manatalPhoneBox) {
      throw new Error(
        "Expected UseDelight and Manatal preview bounding boxes.",
      );
    }

    expect(manatalPhoneBox.width).toBeLessThan(usedelightBox.width);

    await expectManatalImageFillsScreen(manatalCard);
    await expectManatalScreenHeightCapped(manatalCard, usedelightCard);
    await expectManatalPhoneFrameHeightCapped(manatalCard, usedelightCard);
  });

  test("Given homepage at desktop with Manatal visible, when user compares screen to UseDelight browser image, then Manatal screen height is capped", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();

    const usedelightCard = page.getByTestId("highlight-card-0");
    const manatalCard = page.getByTestId("highlight-card-9");
    await expectManatalScreenHeightCapped(manatalCard, usedelightCard);
    await expectManatalPhoneFrameHeightCapped(manatalCard, usedelightCard);
  });

  test("Given Manatal carousel at desktop, when each slide is visible, then image fills phone screen 1:1", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();

    for (const [index, pattern] of manatalSlidePatterns.entries()) {
      if (index > 0) {
        await page.waitForTimeout(3500);
      }
      const card = await waitForManatalSlide(page, pattern);
      await expectManatalImageFillsScreen(card);
    }
  });

  test("Given Manatal carousel on mobile, when each slide is visible, then image fills phone screen 1:1", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();

    for (const [index, pattern] of manatalSlidePatterns.entries()) {
      if (index > 0) {
        await page.waitForTimeout(3500);
      }
      const card = await waitForManatalSlide(page, pattern);
      await expectManatalImageFillsScreen(card);
    }
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
