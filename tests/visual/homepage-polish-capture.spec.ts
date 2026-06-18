import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "reference", "screenshots", "polish");

const manatalSlideCaptures = [
  {
    slug: "homepage",
    srcPattern: /manatal-coop-homepage/,
    filenames: {
      desktop: "carousel-manatal-phone-home-1440.png",
      mobile: "carousel-manatal-phone-home-390.png",
    },
  },
  {
    slug: "signin",
    srcPattern: /manatal-coop-signin/,
    filenames: {
      desktop: "carousel-manatal-phone-signin-1440.png",
      mobile: "carousel-manatal-phone-signin-390.png",
    },
  },
  {
    slug: "chatbot",
    srcPattern: /manatal-coop-chatbot/,
    filenames: {
      desktop: "carousel-manatal-phone-chatbot-1440.png",
      mobile: "carousel-manatal-phone-chatbot-390.png",
    },
  },
] as const;

async function captureManatalPhoneSlide(
  page: import("@playwright/test").Page,
  slide: (typeof manatalSlideCaptures)[number],
  viewport: "desktop" | "mobile",
) {
  const manatalImage = page.getByTestId("carousel-project-image-manatal-coop");
  const manatalImg = manatalImage.locator("img");
  await expect(manatalImg).toHaveAttribute("src", slide.srcPattern);
  await expect(manatalImage).toHaveAttribute("data-image-state", "loaded");

  const filename =
    viewport === "desktop" ? slide.filenames.desktop : slide.filenames.mobile;

  await page
    .getByTestId("highlight-card-3")
    .getByTestId("carousel-device-frame-phone")
    .screenshot({
      path: path.join(outDir, filename),
    });
}

async function captureManatalSlidesAtViewport(
  page: import("@playwright/test").Page,
  viewport: "desktop" | "mobile",
) {
  if (viewport === "desktop") {
    await page.setViewportSize({ width: 1440, height: 900 });
  } else {
    await page.setViewportSize({ width: 390, height: 844 });
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
  await page
    .getByTestId("highlight-card-3")
    .getByTestId("carousel-device-frame-phone")
    .waitFor({ state: "visible" });

  await captureManatalPhoneSlide(page, manatalSlideCaptures[0], viewport);

  for (const slide of manatalSlideCaptures.slice(1)) {
    await page.waitForTimeout(3500);
    await captureManatalPhoneSlide(page, slide, viewport);
  }
}

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

    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await captureManatalSlidesAtViewport(page, "desktop");

    await page.screenshot({
      path: path.join(outDir, "carousel-manatal-phone-1440.png"),
      fullPage: false,
    });

    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.getByTestId("about-section").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "work-about-transition-1440.png"),
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
    await captureManatalSlidesAtViewport(page, "mobile");

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
