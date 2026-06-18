import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, pagesPath } from "../fixtures/pages-env";
import {
  gotoHomeWithCleanState,
  scrollToTestId,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

test.describe("manatal coop project", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage carousel, when user opens Manatal Coop showcase, then detail shows homepage screenshot", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.carousel);
    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-card-3")).toHaveAttribute(
      "data-highlight-slug",
      "manatal-coop",
    );

    await expect(
      page
        .getByTestId("highlight-card-3")
        .getByTestId("carousel-device-frame-phone"),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("highlight-card-3")
        .getByTestId("carousel-device-frame-browser"),
    ).toHaveCount(0);

    const usedelightCard = page.getByTestId("highlight-card-0");
    const manatalCard = page.getByTestId("highlight-card-3");
    const manatalPhone = manatalCard.getByTestId("carousel-device-frame-phone");
    const usedelightBox = await usedelightCard.boundingBox();
    const manatalPhoneBox = await manatalPhone.boundingBox();
    if (!usedelightBox || !manatalPhoneBox) {
      throw new Error(
        "Expected UseDelight and Manatal preview bounding boxes.",
      );
    }
    expect(manatalPhoneBox.width).toBeLessThan(usedelightBox.width);

    const manatalScreen = manatalCard.getByTestId("phone-device-screen");
    const manatalImage = manatalCard.getByTestId(
      "carousel-project-image-manatal-coop",
    );
    const screenBox = await manatalScreen.boundingBox();
    const imageBox = await manatalImage.boundingBox();
    if (!screenBox || !imageBox) {
      throw new Error("Expected Manatal screen and image bounding boxes.");
    }
    expect(Math.abs(imageBox.width - screenBox.width)).toBeLessThanOrEqual(2);
    expect(Math.abs(imageBox.height - screenBox.height)).toBeLessThanOrEqual(2);

    const usedelightBrowser = usedelightCard.getByTestId(
      "carousel-device-frame-browser",
    );
    const usedelightImageArea = usedelightBrowser.locator(
      ".aspect-\\[16\\/10\\]",
    );
    const browserImageBox = await usedelightImageArea.boundingBox();
    if (!browserImageBox) {
      throw new Error("Expected UseDelight browser image area bounding box.");
    }
    expect(screenBox.height).toBeLessThanOrEqual(browserImageBox.height + 4);

    const manatalCarouselImage = page
      .getByTestId("carousel-project-image-manatal-coop")
      .first()
      .locator("img");
    await expect(manatalCarouselImage).toHaveAttribute(
      "src",
      /manatal-coop-homepage.*\.webp/,
    );

    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/manatal-coop`),
      page.getByTestId("showcase-project-link-manatal-coop").click(),
    ]);

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Manatal Coop",
    );
    await expect(
      page.getByTestId("project-detail-hero-image").locator("img"),
    ).toHaveAttribute("src", /manatal-coop-homepage.*\.webp/);
  });

  test("Given Manatal detail route, when page loads, then hero uses homepage webp not placeholder", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/manatal-coop"));

    await expect(
      page.getByTestId("project-detail-hero-image").locator("img"),
    ).toHaveAttribute("src", /manatal-coop-homepage.*\.webp/);
    await expect(
      page.getByTestId("project-detail-hero-image").locator("img"),
    ).not.toHaveAttribute("src", /placeholder/);
  });

  test("Given Manatal detail, when page loads, then type label is Client work without Codefrost", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/manatal-coop"));

    await expect(page.getByTestId("project-detail-type")).toHaveText(
      "Client work",
    );
    await expect(page.getByTestId("project-detail-title")).not.toContainText(
      "Codefrost",
    );
    await expect(page.locator("body")).not.toContainText("Codefrost");
  });

  test("Given bolt-to-github detail, when page loads, then website and Chrome store links resolve", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/bolt-to-github"));

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Bolt to Github",
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://bolt2github.com/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveAttribute(
      "href",
      /chromewebstore\.google\.com/,
    );
    await expect(page.locator("body")).not.toContainText("Codefrost");
  });

  test("Given Manatal detail, when user clicks member app link, then external URL opens", async ({
    page,
    context,
  }) => {
    await page.goto(pagesPath("/projects/manatal-coop"));

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: "Member app" }).click(),
    ]);

    await expect(newPage).toHaveURL(/manatalcoop\.app/);
    await newPage.close();
  });
});
