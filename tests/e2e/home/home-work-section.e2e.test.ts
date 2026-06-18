import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  scrollCarouselNext,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("homepage work section", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage carousel, when user loads work section, then ten project cards render without grid or case studies", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId(selectors.work.carousel)).toBeVisible();
    await expect(page.getByTestId("highlight-card-9")).toBeVisible();
    await expect(page.getByTestId("highlight-card-0")).toHaveAttribute(
      "data-highlight-slug",
      "usedelight",
    );
    await expect(page.getByTestId(selectors.work.grid)).toHaveCount(0);
    await expect(page.getByTestId("case-study-queue")).toHaveCount(0);
    await expect(page.getByTestId("project-card-iaso")).toHaveCount(0);
  });

  test("Given homepage carousel, when user scrolls to tail projects, then trulyhappy is reachable", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-7").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-card-7")).toHaveAttribute(
      "data-highlight-slug",
      "trulyhappy",
    );
    await expect(
      page.getByTestId("showcase-project-link-trulyhappy"),
    ).toBeVisible();
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

  test("Given homepage carousel, when user scrolls to card after MERN's Shop, then AnswerIQ slug and label are accurate", async ({
    page,
  }) => {
    const carousel = page.getByTestId(selectors.work.carousel);
    await scrollToTestId(page, selectors.work.section);
    await carousel.scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-6").scrollIntoViewIfNeeded();

    await expect(page.getByTestId("highlight-card-6")).toHaveAttribute(
      "data-highlight-slug",
      "answeriq",
    );
    await expect(
      carousel.getByTestId("carousel-project-type-label-answeriq"),
    ).toContainText("Client work");
  });

  test("Given homepage carousel, when user opens bolt-to-github showcase, then project detail loads", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/bolt-to-github`),
      page.getByTestId("showcase-project-link-bolt-to-github").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Bolt to Github",
    );
  });
});
