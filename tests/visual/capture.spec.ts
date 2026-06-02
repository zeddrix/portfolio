import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "reference", "screenshots");

test.describe("visual capture", () => {
  test("localhost hero and reference site hero", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 900 });

    const localBase =
      process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:7212";
    await page.goto(`${localBase}/`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Hello/i })).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, "localhost-hero.png"),
      fullPage: false,
    });

    await page.goto("https://www.rickwaalders.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page
      .locator("text=/Hello/i")
      .first()
      .waitFor({ state: "visible", timeout: 30_000 });
    await page.screenshot({
      path: path.join(outDir, "reference-rickwaalders-hero.png"),
      fullPage: false,
    });
  });
});
