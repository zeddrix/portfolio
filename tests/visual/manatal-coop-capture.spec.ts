import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PAGES_BASE_PATH } from "../e2e/fixtures/pages-env";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "manatal-coop",
);

test.describe("manatal coop visual capture", () => {
  test("carousel mobile, detail desktop top, and full detail page", async ({
    page,
  }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGES_BASE_PATH, { waitUntil: "domcontentloaded" });
    await page.getByTestId("highlight-card-9").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, "carousel-mobile-390.png"),
    });

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
