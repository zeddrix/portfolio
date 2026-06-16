import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "cta-hover",
);
const frameMs = [0, 100, 200, 300, 400];

async function captureHoverFrames(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
  prefix: string,
) {
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Could not resolve bounding box for ${prefix}`);

  const clip = {
    x: Math.max(0, box.x - 24),
    y: Math.max(0, box.y - 24),
    width: box.width + 48,
    height: box.height + 48,
  };

  await locator.hover({ force: true });

  for (const ms of frameMs) {
    if (ms > 0) {
      await page.waitForTimeout(ms - frameMs[frameMs.indexOf(ms) - 1]!);
    }
    await page.screenshot({
      path: path.join(outDir, `${prefix}-${ms}ms.png`),
      clip,
    });
  }
}

test.describe("hero CTA hover frame capture", () => {
  test("local and Rick reference at 100ms intervals", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 900 });

    const localBase =
      process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:7212";
    await page.goto(`${localBase}/`, { waitUntil: "domcontentloaded" });
    const localCta = page.getByTestId("hero-cta");
    await localCta.waitFor({ state: "visible" });
    await captureHoverFrames(page, localCta, "local");

    await page.goto("https://www.rickwaalders.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    const rickCta = page.getByRole("link", { name: /get in touch/i }).first();
    await rickCta.waitFor({ state: "visible", timeout: 30_000 });
    await captureHoverFrames(page, rickCta, "rick");
  });
});
