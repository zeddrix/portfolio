import { expect, test } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_HOME_PATH,
  pagesPath,
} from "./fixtures/pages-env";

const basePathPattern = new RegExp(
  `${PAGES_BASE_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`,
);

test.describe("project image mapping", () => {
  test("Given homepage cards, when user inspects media and opens Queue detail, then images use base-prefixed paths", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);
    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();

    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();
    const queueCarouselImage = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue");
    await expect(queueCarouselImage).toHaveAttribute(
      "src",
      /queue-1-dashboard\.png/,
    );
    await expect(queueCarouselImage).toHaveAttribute("src", basePathPattern);

    await page.getByTestId("showcase-project-link-queue").click();
    await page.waitForURL("**/projects/queue");
    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      basePathPattern,
    );
    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /queue-1-dashboard\.png/,
    );
  });

  test("Given multi-image highlight cards, when carousel advances, then image source transitions", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueImage = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue")
      .first();
    const firstSrc = await queueImage.getAttribute("src");
    await expect(queueImage).toHaveAttribute("data-transition-state", "active");

    await expect
      .poll(async () => queueImage.getAttribute("src"))
      .not.toBe(firstSrc);
  });

  test("Given a project detail page, when user views gallery, then slug media matches mapped assets", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/adverio-tools"));

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Adverio Tools",
    );
    const heroImage = page.getByTestId("project-detail-hero-image");
    await expect(heroImage).toHaveAttribute(
      "src",
      /adverio-tools-1-overview\.png/,
    );
    const heroSrc = await heroImage.getAttribute("src");
    expect(heroSrc).not.toBeNull();
    const heroUrl = new URL(heroSrc ?? "", page.url()).href;
    expect(heroUrl).toContain(`${PAGES_BASE_PATH}/`);
    expect((await page.request.get(heroUrl)).ok()).toBeTruthy();

    await expect(
      page.getByTestId("project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /adverio-tools-2-forecasting\.png/);
  });

  test("Given UseDelight detail page, when user views gallery, then updated static assets are rendered", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/usedelight"));

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /usedelight-1-new-tab\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /usedelight-5-subscription\.png/);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "UseDelight",
    );
  });

  test("Given homepage carousel, when user inspects MERN's Shop card, then preview image uses mapped asset", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);
    await page.getByTestId("highlight-card-4").scrollIntoViewIfNeeded();

    const mernsShopImage = page
      .getByTestId("highlight-card-4")
      .getByTestId("carousel-project-image-merns-shop");
    await expect(mernsShopImage).toHaveAttribute(
      "src",
      /merns-shop-1-homepage\.png/,
    );
    await expect(mernsShopImage).toHaveAttribute("src", basePathPattern);
  });

  test("Given MERN's Shop detail page, when user views gallery, then mapped static assets are rendered", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/merns-shop"));

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "MERN's Shop",
    );
    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /merns-shop-1-homepage\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /merns-shop-2-product\.png/);
    await expect(
      page.getByTestId("project-detail-gallery-image-2"),
    ).toHaveAttribute("src", /merns-shop-4-checkout\.png/);
    await expect(
      page.getByTestId("project-detail-gallery-image-5"),
    ).toHaveAttribute("src", /atdd-playwright-e2e\.png/);
  });
});
