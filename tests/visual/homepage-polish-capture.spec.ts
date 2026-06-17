import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "reference", "screenshots", "polish");

test.describe("homepage polish visual capture", () => {
  test("hero, carousel fold, and terminal bottom checkpoints", async ({
    page,
  }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("hero-cta").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "hero-cta-1440.png"),
      fullPage: false,
    });

    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.getByTestId("highlight-card-0").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "carousel-fold-1440.png"),
      fullPage: false,
    });

    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("tools-strip-footer-note")
      .waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "tools-strip-1440.png"),
      fullPage: false,
    });

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.getByTestId("contact-section").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "terminal-bottom-1440.png"),
      fullPage: false,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("tools-strip-footer-note")
      .waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "tools-strip-390.png"),
      fullPage: false,
    });

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.getByTestId("footer-section").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "terminal-bottom-390.png"),
      fullPage: false,
    });
  });
});
