import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  scrollCarouselNext,
  scrollToTestId,
  waitForCarouselImageChange,
} from "../fixtures/test-helpers";

const basePathPattern = new RegExp(
  `${PAGES_BASE_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`,
);

test.describe("project image mapping", () => {
  test("Given homepage carousel, when user opens Queue showcase, then images use base-prefixed paths", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "highlights-carousel");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueCarouselImage = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue")
      .first();
    await expect(queueCarouselImage).toHaveAttribute(
      "src",
      /queue-1-dashboard\.png/,
    );
    await expect(queueCarouselImage).toHaveAttribute("src", basePathPattern);

    await Promise.all([
      page.waitForURL("**/projects/queue"),
      page.getByTestId("showcase-project-link-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /queue-1-dashboard\.png/,
    );
  });

  test("Given multi-image highlight card, when user advances carousel control, then visible card changes", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "highlights-carousel");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    await scrollCarouselNext(page);
    await expect(page.getByTestId("highlight-card-3")).toBeInViewport();
  });

  test("Given multi-image Queue card, when user scrolls card into view and waits, then image source transitions", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueImage = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue")
      .first();
    const firstSrc = await queueImage.getAttribute("src");
    await waitForCarouselImageChange(page, "queue");
    await expect
      .poll(async () => queueImage.getAttribute("src"))
      .not.toBe(firstSrc);
  });

  test("Given Queue carousel journey, when user opens detail, then chatbot gallery assets render", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL("**/projects/queue"),
      page.getByTestId("showcase-project-link-queue").click(),
    ]);

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /queue-1-dashboard\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /chatbot-start\.png/);
    await expect(
      page.getByTestId("project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /chatbot-placement-in-full-dashboard\.png/);

    const galleryUrls = [
      await page
        .getByTestId("project-detail-gallery-image-4")
        .getAttribute("src"),
      await page
        .getByTestId("project-detail-gallery-image-5")
        .getAttribute("src"),
    ];

    for (const imageUrl of galleryUrls) {
      expect(imageUrl).not.toBeNull();
      const resolvedUrl = new URL(imageUrl ?? "", page.url()).href;
      expect((await page.request.get(resolvedUrl)).ok()).toBeTruthy();
    }
  });

  test("Given Adverio band link journey, when user opens project, then gallery assets render", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "capability-bands-section");
    await Promise.all([
      page.waitForURL("**/projects/adverio-tools"),
      page.getByTestId("band-project-link-fullstack-adverio-tools").click(),
    ]);

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /adverio-tools-1-overview\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /adverio-tools-2-forecasting\.png/);
  });

  test("Given UseDelight grid journey, when user filters client and opens project, then gallery renders", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "work-section");
    await page.getByTestId("work-filter-client").click();
    await Promise.all([
      page.waitForURL("**/projects/usedelight"),
      page.getByTestId("project-details-link-usedelight").click(),
    ]);

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /usedelight-1-new-tab\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /usedelight-5-subscription\.png/);
  });

  test("Given MERN's Shop carousel journey, when user opens detail, then mapped gallery assets render", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.getByTestId("highlight-card-4").scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL("**/projects/merns-shop"),
      page.getByTestId("showcase-project-link-merns-shop").click(),
    ]);

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /merns-shop-1-homepage\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /atdd-playwright-e2e\.png/);
  });

  test("Given AnswerIQ carousel card, when user opens detail, then hero and admin gallery assets render", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.getByTestId("highlight-card-5").scrollIntoViewIfNeeded();

    const answeriqCarouselImage = page
      .getByTestId("highlight-card-5")
      .getByTestId("carousel-project-image-answeriq");
    await expect(answeriqCarouselImage).toHaveAttribute(
      "src",
      /answeriq-1-dashboard\.png/,
    );
    await expect(answeriqCarouselImage).toHaveAttribute("src", basePathPattern);

    await Promise.all([
      page.waitForURL("**/projects/answeriq"),
      page.getByTestId("showcase-project-link-answeriq").click(),
    ]);

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /answeriq-1-dashboard\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /answeriq-6-admin-users\.png/);
  });
});
