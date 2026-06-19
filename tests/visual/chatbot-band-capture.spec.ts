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

async function prepareChatbotBandSlide1(
  page: import("@playwright/test").Page,
  viewport: (typeof viewports)[number],
) {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await gotoHome(page);
  await scrollToTestId(page, selectors.sections.approach);

  const chatbotBand = page.getByTestId("highlight-band-4");
  await chatbotBand.scrollIntoViewIfNeeded();

  const phoneImage = chatbotBand
    .locator(".opacity-100")
    .getByTestId("capability-band-image-0")
    .locator("img");
  await expect(phoneImage).toHaveAttribute(
    "src",
    /manatal-coop-chatbot.*\.webp/,
  );
  await expect(
    chatbotBand
      .locator(".opacity-100")
      .getByTestId("phone-device-frame-domain"),
  ).toHaveText("manatalcoop.app");
  await expect(
    chatbotBand.locator(".opacity-100").getByTestId("capability-band-image-0"),
  ).toHaveAttribute("data-image-state", "loaded");

  return chatbotBand.locator(".opacity-100");
}

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
    test(`captures chatbot phone frame at ${viewport.name}`, async ({
      page,
    }) => {
      mkdirSync(outDir, { recursive: true });
      const activeSlide = await prepareChatbotBandSlide1(page, viewport);

      await activeSlide.getByTestId("carousel-device-frame-phone").screenshot({
        path: path.join(
          outDir,
          `chatbot-phone-frame-${viewport.name}-${viewport.width}.png`,
        ),
      });
    });

    test(`captures chatbot phone screen at ${viewport.name}`, async ({
      page,
    }) => {
      mkdirSync(outDir, { recursive: true });
      const activeSlide = await prepareChatbotBandSlide1(page, viewport);

      await activeSlide.getByTestId("phone-device-screen").screenshot({
        path: path.join(
          outDir,
          `chatbot-phone-screen-${viewport.name}-${viewport.width}.png`,
        ),
      });
    });
  }

  test("captures full chatbot band context on desktop slide 1", async ({
    page,
  }) => {
    mkdirSync(outDir, { recursive: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);

    const chatbotBand = page.getByTestId("highlight-band-4");
    await chatbotBand.scrollIntoViewIfNeeded();
    await expect(
      chatbotBand
        .locator(".opacity-100")
        .getByTestId("capability-band-image-0"),
    ).toHaveAttribute("data-image-state", "loaded");

    await chatbotBand.screenshot({
      path: path.join(outDir, "chatbot-band-slide1-full-desktop-1280.png"),
    });
  });

  for (const viewport of viewports) {
    test(`captures chatbot browser slide at ${viewport.name}`, async ({
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

      await chatbotBand
        .locator(".opacity-100")
        .getByTestId("browser-device-frame")
        .screenshot({
          path: path.join(
            outDir,
            `chatbot-browser-slide-${viewport.name}-${viewport.width}.png`,
          ),
        });
    });
  }
});
