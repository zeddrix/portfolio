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

function carouselImage(page: import("@playwright/test").Page, slug: string) {
  return page
    .getByTestId(`carousel-project-image-${slug}`)
    .first()
    .locator("img");
}

function detailImage(page: import("@playwright/test").Page, testId: string) {
  return page.getByTestId(testId).locator("img");
}

test.describe("project image mapping", () => {
  test("Given homepage carousel, when user opens Queue showcase, then images use base-prefixed paths", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "highlights-carousel");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueCarouselImage = carouselImage(page, "queue");
    await expect(queueCarouselImage).toHaveAttribute(
      "src",
      /queue-1-dashboard.*\.webp/,
    );
    await expect(queueCarouselImage).toHaveAttribute("src", basePathPattern);
    await expect(queueCarouselImage).toHaveAttribute("srcset", /.+/);

    await Promise.all([
      page.waitForURL("**/projects/queue"),
      page.getByTestId("showcase-project-link-queue").click(),
    ]);
    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /queue-1-dashboard.*\.webp/);
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

    const queueImage = carouselImage(page, "queue");
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

    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /queue-1-dashboard.*\.webp/);
    await expect(
      detailImage(page, "project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /chatbot-start.*\.webp/);
    await expect(
      detailImage(page, "project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /chatbot-placement-in-full-dashboard.*\.webp/);

    const galleryUrls = [
      await detailImage(page, "project-detail-gallery-image-4").getAttribute(
        "src",
      ),
      await detailImage(page, "project-detail-gallery-image-5").getAttribute(
        "src",
      ),
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

    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /adverio-tools-1-overview.*\.webp/);
    await expect(
      detailImage(page, "project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /adverio-tools-2-forecasting.*\.webp/);
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

    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /usedelight-1-new-tab.*\.webp/);
    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("srcset", /640w/);
    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("srcset", /920w/);
    await expect(
      detailImage(page, "project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /usedelight-5-subscription.*\.webp/);
  });

  test("Given UseDelight detail, when hero image loads, then natural aspect is preserved with contain fit", async ({
    page,
  }) => {
    const expectedAspectRatio = 1840 / 1127;

    await gotoHome(page);
    await scrollToTestId(page, selectors.work.section);
    await page.getByTestId("work-filter-client").click();
    await Promise.all([
      page.waitForURL("**/projects/usedelight"),
      page.getByTestId("project-details-link-usedelight").click(),
    ]);

    const heroImage = detailImage(page, "project-detail-hero-image");
    await expect(heroImage).toBeVisible();
    await expect
      .poll(async () =>
        heroImage.evaluate(
          (img: HTMLImageElement) =>
            img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
        ),
      )
      .toBe(true);

    const measuredAspect = await heroImage.evaluate(
      (img: HTMLImageElement) => img.naturalWidth / img.naturalHeight,
    );
    const objectFit = await heroImage.evaluate(
      (img: HTMLImageElement) => getComputedStyle(img).objectFit,
    );

    expect(Math.abs(measuredAspect - expectedAspectRatio)).toBeLessThan(0.02);
    expect(objectFit).toBe("contain");
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

    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /merns-shop-1-homepage.*\.webp/);
    await expect(
      detailImage(page, "project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /atdd-playwright-e2e.*\.webp/);
  });

  test("Given AnswerIQ carousel card, when user opens detail, then hero and admin gallery assets render", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.getByTestId("highlight-card-5").scrollIntoViewIfNeeded();

    const answeriqCarouselImage = carouselImage(page, "answeriq");
    await expect(answeriqCarouselImage).toHaveAttribute(
      "src",
      /answeriq-1-dashboard.*\.webp/,
    );
    await expect(answeriqCarouselImage).toHaveAttribute("src", basePathPattern);

    await Promise.all([
      page.waitForURL("**/projects/answeriq"),
      page.getByTestId("showcase-project-link-answeriq").click(),
    ]);

    await expect(
      detailImage(page, "project-detail-hero-image"),
    ).toHaveAttribute("src", /answeriq-1-dashboard.*\.webp/);
    await expect(
      detailImage(page, "project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /answeriq-6-admin-users.*\.webp/);
  });
});
