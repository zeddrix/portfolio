import { expect, type Page } from "@playwright/test";
import { PAGES_HOME_PATH } from "./pages-env";
import { selectors } from "./selectors";

export const workLayoutStorageKey = "portfolio-work-layout-mode";
export const capabilityLayoutStorageKey = "capability-band-layout-mode";

export type WorkLayoutMode = "featuredGrid" | "caseStudyLed";
export type CapabilityLayoutMode =
  | "sevenBands"
  | "groupedBands"
  | "singleStack";

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  try {
    await page.waitForLoadState("networkidle", { timeout: 5_000 });
  } catch {
    // SPA may never reach networkidle; domcontentloaded + load is enough.
  }
}

export async function gotoHome(page: Page): Promise<void> {
  await page.goto(PAGES_HOME_PATH);
  await waitForPageLoad(page);
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
    ({ workKey, capabilityKey }) => {
      localStorage.removeItem(workKey);
      localStorage.removeItem(capabilityKey);
    },
    {
      workKey: workLayoutStorageKey,
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

export async function openPreviewSettings(page: Page): Promise<void> {
  await page
    .getByTestId(selectors.previewSettings.toggle)
    .scrollIntoViewIfNeeded();
  const panel = page.getByTestId(selectors.previewSettings.panel);
  if (!(await panel.isVisible())) {
    await page.getByTestId(selectors.previewSettings.toggle).click();
  }
  await expect(panel).toBeVisible();
}

export async function setWorkLayout(
  page: Page,
  mode: WorkLayoutMode,
): Promise<void> {
  await openPreviewSettings(page);
  const testId =
    mode === "caseStudyLed"
      ? selectors.previewSettings.workCaseStudies
      : selectors.previewSettings.workGrid;
  await page.getByTestId(testId).click();
}

export async function setCapabilityLayout(
  page: Page,
  mode: CapabilityLayoutMode,
): Promise<void> {
  await openPreviewSettings(page);
  const testIdMap: Record<CapabilityLayoutMode, string> = {
    sevenBands: selectors.previewSettings.capabilityDetailed,
    groupedBands: selectors.previewSettings.capabilityGrouped,
    singleStack: selectors.previewSettings.capabilityCompact,
  };
  await page.getByTestId(testIdMap[mode]).click();
}

export async function navigateToProjectViaGrid(
  page: Page,
  slug: string,
  filter?: "all" | "client" | "personal",
): Promise<void> {
  await scrollToTestId(page, selectors.work.section);
  if (filter === "client") {
    await page.getByTestId(selectors.work.filterClient).click();
  } else if (filter === "personal") {
    await page.getByTestId(selectors.work.filterPersonal).click();
  } else if (filter === "all") {
    await page.getByTestId(selectors.work.filterAll).click();
  }

  const projectLink = page.getByTestId(`project-details-link-${slug}`);
  await expect(projectLink).toBeVisible();
  await projectLink.scrollIntoViewIfNeeded();
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
  const image = page.getByTestId(`carousel-project-image-${slug}`).first();
  const firstSrc = await image.getAttribute("src");
  await expect.poll(async () => image.getAttribute("src")).not.toBe(firstSrc);
}

export async function scrollCarouselNext(page: Page): Promise<void> {
  await page.getByTestId(selectors.work.carouselNext).click();
}

export async function scrollCarouselPrev(page: Page): Promise<void> {
  await page.getByTestId(selectors.work.carouselPrev).click();
}

export async function scrollCarouselToPosition(
  page: Page,
  scrollLeft: number,
): Promise<void> {
  await page.getByTestId(selectors.work.carousel).evaluate((element, left) => {
    element.scrollLeft = left;
  }, scrollLeft);
}

export async function clickNavLink(
  page: Page,
  link: keyof typeof selectors.nav,
): Promise<void> {
  if (link === "github") {
    await page.getByTestId(selectors.nav.github).click();
    return;
  }
  await page.getByTestId(selectors.nav[link]).click();
}

export async function assertSectionInViewport(
  page: Page,
  testId: string,
): Promise<void> {
  await expect(page.getByTestId(testId)).toBeInViewport();
}
