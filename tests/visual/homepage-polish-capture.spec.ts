import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { scrollCarouselCardIntoViewCenter } from "../e2e/fixtures/test-helpers";

const outDir = path.join(process.cwd(), "reference", "screenshots", "polish");

const manatalSlideCaptures = [
  {
    slug: "homepage",
    srcPattern: /manatal-coop-homepage/,
    filenames: {
      desktop: "carousel-manatal-phone-home-1440.png",
      tablet: "carousel-manatal-phone-home-768.png",
      mobile: "carousel-manatal-phone-home-390.png",
    },
  },
  {
    slug: "signin",
    srcPattern: /manatal-coop-signin/,
    filenames: {
      desktop: "carousel-manatal-phone-signin-1440.png",
      tablet: "carousel-manatal-phone-signin-768.png",
      mobile: "carousel-manatal-phone-signin-390.png",
    },
  },
  {
    slug: "chatbot",
    srcPattern: /manatal-coop-chatbot/,
    filenames: {
      desktop: "carousel-manatal-phone-chatbot-1440.png",
      tablet: "carousel-manatal-phone-chatbot-768.png",
      mobile: "carousel-manatal-phone-chatbot-390.png",
    },
  },
] as const;

type ManatalCaptureViewport = "desktop" | "tablet" | "mobile";

async function ensureManatalCardActive(
  page: import("@playwright/test").Page,
  viewport: ManatalCaptureViewport,
) {
  await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
  await page.getByTestId("highlight-card-3").evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  });

  if (viewport === "mobile" || viewport === "tablet") {
    await scrollCarouselCardIntoViewCenter(
      page,
      "highlight-card-column-manatal-coop",
    );
  }

  await page
    .getByTestId("highlight-card-3")
    .getByTestId("carousel-device-frame-phone")
    .waitFor({ state: "visible" });
}

async function waitForManatalSlideSrc(
  page: import("@playwright/test").Page,
  srcPattern: RegExp,
) {
  const manatalImage = page.getByTestId("carousel-project-image-manatal-coop");
  const manatalImg = manatalImage.locator("img");

  await expect
    .poll(async () => manatalImg.getAttribute("src"), { timeout: 20_000 })
    .toMatch(srcPattern);
  await expect(manatalImage).toHaveAttribute("data-image-state", "loaded");
}

async function captureManatalPhoneSlide(
  page: import("@playwright/test").Page,
  slide: (typeof manatalSlideCaptures)[number],
  viewport: ManatalCaptureViewport,
) {
  await waitForManatalSlideSrc(page, slide.srcPattern);

  const filename =
    viewport === "desktop"
      ? slide.filenames.desktop
      : viewport === "tablet"
        ? slide.filenames.tablet
        : slide.filenames.mobile;

  await page.getByTestId("highlight-card-column-manatal-coop").screenshot({
    path: path.join(outDir, filename.replace(/phone-/, "column-")),
  });

  await page
    .getByTestId("highlight-card-3")
    .getByTestId("carousel-device-frame-phone")
    .screenshot({
      path: path.join(outDir, filename),
    });
}

async function captureManatalSlidesAtViewport(
  page: import("@playwright/test").Page,
  viewport: ManatalCaptureViewport,
) {
  if (viewport === "desktop") {
    await page.setViewportSize({ width: 1440, height: 900 });
  } else if (viewport === "tablet") {
    await page.setViewportSize({ width: 768, height: 1024 });
  } else {
    await page.setViewportSize({ width: 390, height: 844 });
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await ensureManatalCardActive(page, viewport);

  for (const slide of manatalSlideCaptures) {
    await captureManatalPhoneSlide(page, slide, viewport);
  }
}

test.describe("homepage polish visual capture", () => {
  test("hero, carousel fold, and terminal bottom checkpoints", async ({
    page,
  }) => {
    test.setTimeout(180_000);
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

    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("tool-group-ai-delivery")
      .waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "tools-strip-1440.png"),
      fullPage: false,
    });

    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.getByTestId("about-section").waitFor({ state: "visible" });
    await page.screenshot({
      path: path.join(outDir, "tools-about-transition-1440.png"),
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

    await captureManatalSlidesAtViewport(page, "tablet");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("tool-group-ai-delivery")
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
