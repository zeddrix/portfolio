import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PAGES_BASE_PATH } from "../e2e/fixtures/pages-env";
import { selectors } from "../e2e/fixtures/selectors";
import { scrollCarouselCardIntoViewCenter } from "../e2e/fixtures/test-helpers";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "manatal-coop",
);

const manatalSlideCaptures = [
  {
    slug: "homepage",
    srcPattern: /manatal-coop-homepage/,
    filename: "carousel-manatal-homepage-768.png",
  },
  {
    slug: "signin",
    srcPattern: /manatal-coop-signin/,
    filename: "carousel-manatal-signin-768.png",
  },
  {
    slug: "chatbot",
    srcPattern: /manatal-coop-chatbot/,
    filename: "carousel-manatal-chatbot-768.png",
  },
] as const;

test.describe("manatal coop visual capture", () => {
  test("carousel mobile, tablet column, detail desktop top, and full detail page", async ({
    page,
  }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGES_BASE_PATH, { waitUntil: "domcontentloaded" });
    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, "carousel-mobile-390.png"),
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGES_BASE_PATH, { waitUntil: "domcontentloaded" });
    await page.getByTestId(selectors.work.carousel).scrollIntoViewIfNeeded();
    await scrollCarouselCardIntoViewCenter(
      page,
      "highlight-card-column-manatal-coop",
    );
    await page.getByTestId("highlight-card-column-manatal-coop").screenshot({
      path: path.join(outDir, "carousel-tablet-768.png"),
    });

    for (const [index, slide] of manatalSlideCaptures.entries()) {
      if (index > 0) {
        await page.waitForTimeout(3500);
      }
      const manatalImage = page.getByTestId(
        "carousel-project-image-manatal-coop",
      );
      await expect(manatalImage.locator("img")).toHaveAttribute(
        "src",
        slide.srcPattern,
      );
      await expect(manatalImage).toHaveAttribute("data-image-state", "loaded");
      await page.getByTestId("highlight-card-column-manatal-coop").screenshot({
        path: path.join(outDir, slide.filename),
      });
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${PAGES_BASE_PATH}/projects/manatal-coop`, {
      waitUntil: "domcontentloaded",
    });
    await page
      .getByTestId("project-detail-title")
      .waitFor({ state: "visible" });
    await page.getByTestId("project-detail-type").waitFor({ state: "visible" });
    await page
      .getByTestId("project-detail-hero-image")
      .waitFor({ state: "visible" });
    await page
      .getByTestId("project-detail-gallery-image-1")
      .waitFor({ state: "visible" });
    await page
      .getByTestId("project-detail-gallery-image-2")
      .waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "detail-desktop-top-1280.png"),
    });
    await page.screenshot({
      path: path.join(outDir, "detail-desktop-full-1280.png"),
      fullPage: true,
    });
  });
});
