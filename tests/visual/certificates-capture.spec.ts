import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PAGES_BASE_PATH } from "../e2e/fixtures/pages-env";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "certificates",
);

test.describe("certificates visual capture", () => {
  test("index and MERN detail checkpoints", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${PAGES_BASE_PATH}/certificates`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByTestId("certificates-index").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "index-desktop-1280.png"),
      fullPage: true,
    });

    await page
      .getByTestId("certificate-card-mern-ecommerce-from-scratch")
      .click();
    await page
      .getByTestId("certificate-detail-title")
      .waitFor({ state: "visible" });
    await page
      .getByTestId("certificate-detail-image-frame")
      .waitFor({ state: "visible" });
    await page.waitForFunction(() => {
      const frame = document.querySelector(
        '[data-testid="certificate-detail-image-frame"]',
      );
      return frame?.getAttribute("data-image-state") === "loaded";
    });
    await page.screenshot({
      path: path.join(outDir, "mern-detail-desktop-1280.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${PAGES_BASE_PATH}/certificates`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByTestId("certificates-index").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "index-mobile-390.png"),
      fullPage: true,
    });
  });
});
