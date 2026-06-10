import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  scrollCarouselNext,
  scrollToTestId,
  setWorkLayout,
} from "../fixtures/test-helpers";

test.describe("homepage work section", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage, when user cycles work filters, then matching project cards are shown", async ({
    page,
  }) => {
    const grid = page.getByTestId(selectors.work.grid);
    await scrollToTestId(page, selectors.work.section);
    await expect(grid).toBeVisible();

    await page.getByTestId(selectors.work.filterClient).click();
    await expect(grid.getByTestId("project-card-usedelight")).toBeVisible();
    await expect(grid.getByTestId("project-card-queue")).toHaveCount(0);

    await page.getByTestId(selectors.work.filterPersonal).click();
    await expect(grid.getByTestId("project-card-queue")).toBeVisible();
    await expect(grid.getByTestId("project-card-usedelight")).toHaveCount(0);

    await page.getByTestId(selectors.work.filterAll).click();
    await expect(grid.getByTestId("project-card-merns-shop")).toBeVisible();
    await expect(grid.getByTestId("project-card-trulyhappy")).toBeVisible();
  });

  test("Given case study layout, when user opens case study link, then project detail loads", async ({
    page,
  }) => {
    await setWorkLayout(page, "caseStudyLed");
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("case-study-queue")).toBeVisible();

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/queue`),
      page.getByTestId("case-study-link-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given homepage carousel, when user clicks next and opens showcase link, then project detail loads", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await scrollCarouselNext(page);
    await scrollCarouselNext(page);

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/queue`),
      page.getByTestId("showcase-project-link-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given homepage carousel, when user reads highlight labels, then client and personal labels are accurate", async ({
    page,
  }) => {
    const carousel = page.getByTestId(selectors.work.carousel);
    await scrollToTestId(page, selectors.work.section);
    await carousel.scrollIntoViewIfNeeded();

    await expect(
      carousel.getByTestId("carousel-project-type-label-usedelight"),
    ).toContainText("Client work");

    await scrollCarouselNext(page);
    await scrollCarouselNext(page);
    await expect(
      carousel.getByTestId("carousel-project-type-label-queue"),
    ).toContainText("Personal");
  });

  test("Given homepage work section, when user explores highlights and grid, then grouped projects remain reachable", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-card-3")).toHaveAttribute(
      "data-highlight-slug",
      "jw-tabs",
    );

    await scrollToTestId(page, selectors.work.section);
    await page.getByTestId(selectors.work.filterAll).click();
    await expect(page.getByTestId("project-card-bolt-to-github")).toBeVisible();
  });

  test("Given case study layout, when user opens more projects card, then additional project is reachable", async ({
    page,
  }) => {
    await setWorkLayout(page, "caseStudyLed");
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("work-more-projects")).toBeVisible();

    await page.getByTestId("work-more-projects").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("work-more-projects")).toContainText(
      "More projects",
    );
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/trulyhappy`),
      page.getByTestId("project-details-link-trulyhappy").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "TrulyHappy",
    );
  });
});
