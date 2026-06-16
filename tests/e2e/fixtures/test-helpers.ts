import { expect, type Page } from "@playwright/test";
import { PAGES_HOME_PATH } from "./pages-env";
import { selectors } from "./selectors";

export const capabilityLayoutStorageKey = "capability-band-layout-mode";

export type CapabilityLayoutMode = "sevenBands" | "groupedBands";

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  try {
    await page.waitForLoadState("networkidle", { timeout: 5_000 });
  } catch {
    // SPA may never reach networkidle; domcontentloaded + load is enough.
  }
}

export async function waitForClientReady(
  page: Page,
  timeout = 30_000,
): Promise<void> {
  await expect(page.getByTestId("client-ready")).toBeAttached({ timeout });
}

export async function gotoHomeForNetworkThrottling(page: Page): Promise<void> {
  await page.goto(PAGES_HOME_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("hero-title")).toBeVisible({ timeout: 60_000 });
}

export async function gotoHome(
  page: Page,
  options?: { readyTimeout?: number },
): Promise<void> {
  await page.goto(PAGES_HOME_PATH);
  await waitForPageLoad(page);
  await waitForClientReady(page, options?.readyTimeout);
}

export async function scrollToTestId(
  page: Page,
  testId: string,
): Promise<void> {
  await page.getByTestId(testId).scrollIntoViewIfNeeded();
  await expect(page.getByTestId(testId)).toBeVisible();
}

export async function resetPortfolioLocalStorage(page: Page): Promise<void> {
  await page.evaluate(
    ({ capabilityKey, legacyWorkKey }) => {
      localStorage.removeItem(legacyWorkKey);
      localStorage.removeItem(capabilityKey);
    },
    {
      legacyWorkKey: "portfolio-work-layout-mode",
      capabilityKey: capabilityLayoutStorageKey,
    },
  );
}

export async function gotoHomeWithCleanState(page: Page): Promise<void> {
  await gotoHome(page);
  await resetPortfolioLocalStorage(page);
  await page.reload();
  await waitForPageLoad(page);
}

export async function setCapabilityLayout(
  page: Page,
  mode: CapabilityLayoutMode,
): Promise<void> {
  await scrollToTestId(page, selectors.sections.approach);
  const testIdMap: Record<CapabilityLayoutMode, string> = {
    sevenBands: selectors.approachLayout.capabilityDetailed,
    groupedBands: selectors.approachLayout.capabilityGrouped,
  };
  await page.getByTestId(testIdMap[mode]).click();
}

export async function clickGithubLink(page: Page): Promise<void> {
  await page.getByTestId(selectors.nav.github).click();
}

export async function navigateToProjectViaCarousel(
  page: Page,
  slug: string,
): Promise<void> {
  await scrollToTestId(page, selectors.work.section);
  const card = page.locator(`[data-highlight-slug="${slug}"]`);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();

  const projectLink = page.getByTestId(`showcase-project-link-${slug}`);
  await expect(projectLink).toBeVisible();
  await Promise.all([
    page.waitForURL(`**/projects/${slug}`),
    projectLink.click(),
  ]);
}

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
}

export async function waitForCarouselImageChange(
  page: Page,
  slug: string,
): Promise<void> {
  const image = page
    .getByTestId(`carousel-project-image-${slug}`)
    .first()
    .locator("img");
  const firstSrc = await image.getAttribute("src");
  await expect.poll(async () => image.getAttribute("src")).not.toBe(firstSrc);
}

export async function scrollCarouselNext(page: Page): Promise<void> {
  await page.getByTestId(selectors.work.carousel).evaluate((element) => {
    const track = element.querySelector(
      '[data-testid="highlights-carousel-track"]',
    );
    const firstCard = track?.firstElementChild;
    let scrollAmount = Math.max(element.clientWidth * 0.72, 320);

    if (firstCard instanceof HTMLElement && track instanceof HTMLElement) {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gapValue =
        getComputedStyle(track).columnGap || getComputedStyle(track).gap;
      const gap = Number.parseFloat(gapValue) || 16;
      scrollAmount = cardWidth + gap;
    }

    element.scrollBy({ left: scrollAmount, behavior: "instant" });
  });
}

export async function scrollCarouselPrev(page: Page): Promise<void> {
  await page.getByTestId(selectors.work.carousel).evaluate((element) => {
    const track = element.querySelector(
      '[data-testid="highlights-carousel-track"]',
    );
    const firstCard = track?.firstElementChild;
    let scrollAmount = Math.max(element.clientWidth * 0.72, 320);

    if (firstCard instanceof HTMLElement && track instanceof HTMLElement) {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gapValue =
        getComputedStyle(track).columnGap || getComputedStyle(track).gap;
      const gap = Number.parseFloat(gapValue) || 16;
      scrollAmount = cardWidth + gap;
    }

    element.scrollBy({ left: -scrollAmount, behavior: "instant" });
  });
}

export async function scrollCarouselToPosition(
  page: Page,
  scrollLeft: number,
): Promise<void> {
  await page.getByTestId(selectors.work.carousel).evaluate((element, left) => {
    element.scrollLeft = left;
  }, scrollLeft);
}

export async function assertSectionInViewport(
  page: Page,
  testId: string,
): Promise<void> {
  await expect(page.getByTestId(testId)).toBeInViewport();
}

export type TouchPoint = { x: number; y: number };

export async function getWindowScrollY(page: Page): Promise<number> {
  return page.evaluate(() => window.scrollY);
}

export async function getCarouselCenter(page: Page): Promise<TouchPoint> {
  const carousel = page.getByTestId(selectors.work.carousel);
  const box = await carousel.boundingBox();
  if (!box) {
    throw new Error("Expected highlights carousel bounding box.");
  }
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
}

export async function touchDrag(
  page: Page,
  from: TouchPoint,
  to: TouchPoint,
  steps = 12,
): Promise<void> {
  const client = await page.context().newCDPSession(page);

  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: Math.round(from.x), y: Math.round(from.y) }],
  });

  for (let step = 1; step <= steps; step += 1) {
    const ratio = step / steps;
    const x = Math.round(from.x + (to.x - from.x) * ratio);
    const y = Math.round(from.y + (to.y - from.y) * ratio);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y }],
    });
  }

  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
}

/** Chrome DevTools Slow 3G: ~400 Kbps, 400 ms RTT */
export async function emulateSlow3G(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8,
    latency: 400,
  });
}
