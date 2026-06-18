import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  capabilityLayoutStorageKey,
  gotoHome,
  scrollToTestId,
} from "../e2e/fixtures/test-helpers";
import { selectors } from "../e2e/fixtures/selectors";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "chatbot-band",
);

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
] as const;

test.describe("chatbot band visual capture", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ({ capabilityKey, mode }) => {
        localStorage.setItem(capabilityKey, mode);
      },
      { capabilityKey: capabilityLayoutStorageKey, mode: "sevenBands" },
    );
  });

  for (const viewport of viewports) {
    test(`captures chatbot band slide 1 phone at ${viewport.name}`, async ({
      page,
    }) => {
      mkdirSync(outDir, { recursive: true });
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await gotoHome(page);
      await scrollToTestId(page, selectors.sections.approach);

      const chatbotBand = page.getByTestId("highlight-band-4");
      await chatbotBand.scrollIntoViewIfNeeded();

      const phoneImage = chatbotBand
        .getByTestId("capability-band-image-0")
        .locator("img");
      await expect(phoneImage).toHaveAttribute(
        "src",
        /manatal-coop-chatbot.*\.webp/,
      );
      await expect(
        chatbotBand.getByTestId("phone-device-frame-domain"),
      ).toHaveText("manatalcoop.app");
      await expect(
        chatbotBand.getByTestId("capability-band-image-0"),
      ).toHaveAttribute("data-image-state", "loaded");

      await chatbotBand.screenshot({
        path: path.join(
          outDir,
          `chatbot-band-slide1-phone-${viewport.name}-${viewport.width}.png`,
        ),
      });
    });

    test(`captures chatbot band slide 2 browser at ${viewport.name}`, async ({
      page,
    }) => {
      mkdirSync(outDir, { recursive: true });
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await gotoHome(page);
      await scrollToTestId(page, selectors.sections.approach);

      const chatbotBand = page.getByTestId("highlight-band-4");
      await chatbotBand.scrollIntoViewIfNeeded();
      await chatbotBand.getByTestId("capability-carousel-next").click();

      const browserImage = chatbotBand
        .getByTestId("capability-band-image-1")
        .locator("img");
      await expect(browserImage).toHaveAttribute(
        "src",
        /chatbot-placement-in-full-dashboard.*\.webp/,
      );
      await expect(
        chatbotBand.locator(".opacity-100").getByTestId("browser-device-frame"),
      ).toBeVisible();

      await chatbotBand.screenshot({
        path: path.join(
          outDir,
          `chatbot-band-slide2-browser-${viewport.name}-${viewport.width}.png`,
        ),
      });
    });
  }
});
