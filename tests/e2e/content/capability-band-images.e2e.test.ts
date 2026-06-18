import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  capabilityLayoutStorageKey,
  gotoHome,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

function bandImage(
  page: import("@playwright/test").Page,
  bandIndex: number,
  imageIndex: number,
) {
  return page
    .getByTestId(`highlight-band-${bandIndex}`)
    .getByTestId(`capability-band-image-${imageIndex}`)
    .locator("img");
}

test.describe("capability band images", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ({ capabilityKey, mode }) => {
        localStorage.setItem(capabilityKey, mode);
      },
      { capabilityKey: capabilityLayoutStorageKey, mode: "sevenBands" },
    );
    await gotoHome(page);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
    await scrollToTestId(page, selectors.sections.approach);
  });

  test("Given detailed capability layout, when user views capability bands, then mapped screenshots render with valid assets", async ({
    page,
  }) => {
    const dockerImage = bandImage(page, 5, 0);
    await expect(dockerImage).toHaveAttribute("src", /docker-desktop.*\.webp/);

    const pwaSplit = page
      .getByTestId("highlight-band-1")
      .getByTestId("capability-band-visual-split");
    await expect(pwaSplit).toBeVisible();

    const atddImage = bandImage(page, 7, 0);
    await expect(atddImage).toHaveAttribute(
      "src",
      /atdd-playwright-e2e.*\.webp/,
    );

    const adminDashboardImage = bandImage(page, 3, 0);
    await expect(adminDashboardImage).toHaveAttribute(
      "src",
      /answeriq-5-admin-dashboard.*\.webp/,
    );

    const chatbotBand = page.getByTestId("highlight-band-4");
    await expect(
      chatbotBand.getByTestId("capability-band-visual-carousel"),
    ).toBeVisible();
    const chatbotImage = bandImage(page, 4, 0);
    await expect(chatbotImage).toHaveAttribute("src", /chatbot-start.*\.webp/);
    await expect(chatbotBand).toContainText("Groq");
    await expect(chatbotBand).toContainText("Anthropic Claude");

    const imageUrls = [
      await dockerImage.getAttribute("src"),
      await atddImage.getAttribute("src"),
      await adminDashboardImage.getAttribute("src"),
      await chatbotImage.getAttribute("src"),
    ];

    for (const imageUrl of imageUrls) {
      expect(imageUrl).not.toBeNull();
      const resolvedUrl = new URL(imageUrl ?? "", page.url()).href;
      expect((await page.request.get(resolvedUrl)).ok()).toBeTruthy();
    }
  });

  test("Given billing carousel, when user advances slide, then checkout screenshot loads", async ({
    page,
  }) => {
    const billingBand = page.getByTestId("highlight-band-2");
    await expect(bandImage(page, 2, 0)).toHaveAttribute(
      "src",
      /lemonsqueezy-dashboard.*\.webp/,
    );

    await billingBand.getByTestId("capability-carousel-next").click();

    await expect(bandImage(page, 2, 1)).toHaveAttribute(
      "src",
      /merns-shop-4-checkout.*\.webp/,
    );
  });

  test("Given chatbot carousel, when user advances slides, then screenshot source updates", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await expect(bandImage(page, 4, 0)).toHaveAttribute(
      "src",
      /chatbot-start.*\.webp/,
    );

    await chatbotBand.getByTestId("capability-carousel-next").click();

    await expect(bandImage(page, 4, 1)).toHaveAttribute(
      "src",
      /chatbot-placement-in-full-dashboard.*\.webp/,
    );
  });

  test("Given deployment carousel, when user advances slides, then screenshot source updates", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    await expect(bandImage(page, 6, 0)).toHaveAttribute(
      "src",
      /namecheap-dashboard-domain.*\.webp/,
    );

    await deploymentBand.getByTestId("capability-carousel-next").click();

    await expect(bandImage(page, 6, 1)).toHaveAttribute(
      "src",
      /cloudflare-dashboard.*\.webp/,
    );
  });

  test("Given grouped capability layout on mobile, when user views product foundations PWA split, then desktop and mobile screenshots render side-by-side", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(
      ({ capabilityKey, mode }) => {
        localStorage.setItem(capabilityKey, mode);
      },
      { capabilityKey: capabilityLayoutStorageKey, mode: "groupedBands" },
    );
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);

    const productFoundations = page.getByTestId("highlight-band-0");
    await productFoundations.scrollIntoViewIfNeeded();
    await expect(
      productFoundations.getByTestId("capability-band-visual-split"),
    ).toBeVisible();

    const desktopImage = bandImage(page, 0, 0);
    const mobileImage = bandImage(page, 0, 1);
    await expect(desktopImage).toHaveAttribute(
      "src",
      /pwa-queue-desktop.*\.webp/,
    );
    await expect(mobileImage).toHaveAttribute(
      "src",
      /pwa-queue-mobile.*\.webp/,
    );

    const desktopBox = await desktopImage.boundingBox();
    const mobileBox = await mobileImage.boundingBox();
    if (!desktopBox || !mobileBox) {
      throw new Error("Expected PWA split image bounding boxes.");
    }

    expect(mobileBox.x).toBeGreaterThanOrEqual(
      desktopBox.x + desktopBox.width - 2,
    );
    expect(
      Math.abs(
        mobileBox.y +
          mobileBox.height / 2 -
          (desktopBox.y + desktopBox.height / 2),
      ),
    ).toBeLessThanOrEqual(8);
  });

  test("Given grouped capability layout, when user views product foundations, then PWA split visual renders", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ capabilityKey, mode }) => {
        localStorage.setItem(capabilityKey, mode);
      },
      { capabilityKey: capabilityLayoutStorageKey, mode: "groupedBands" },
    );
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);

    const productFoundations = page.getByTestId("highlight-band-0");
    await expect(
      productFoundations.getByTestId("capability-band-visual-split"),
    ).toBeVisible();
    await expect(bandImage(page, 0, 0)).toHaveAttribute(
      "src",
      /pwa-queue-desktop.*\.webp/,
    );
  });

  test("Given grouped monetization band, when auto-rotate runs, then screenshot source switches", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ capabilityKey, mode }) => {
        localStorage.setItem(capabilityKey, mode);
      },
      { capabilityKey: capabilityLayoutStorageKey, mode: "groupedBands" },
    );
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);

    const monetizationBand = page.getByTestId("highlight-band-1");
    await monetizationBand.scrollIntoViewIfNeeded();
    const activeImage = monetizationBand.locator(
      '[data-testid="capability-band-visual-carousel"] .opacity-100 img',
    );
    await expect(activeImage).toHaveAttribute(
      "src",
      /lemonsqueezy-dashboard.*\.webp/,
    );

    await expect
      .poll(async () => activeImage.getAttribute("src"), {
        timeout: 5_000,
      })
      .toMatch(/answeriq-5-admin-dashboard.*\.webp/);
  });

  test("Given grouped capability layout, when user switches from preview settings, then grouped bands render without detailed band six", async ({
    page,
  }) => {
    await setCapabilityLayout(page, "groupedBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
  });

  test("Given chatbot carousel in detailed layout, when slide loads, then image fills most of visual frame", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    const stage = chatbotBand.getByTestId("capability-band-stage");
    const image = bandImage(page, 4, 0);

    await expect(image).toHaveAttribute("src", /chatbot-start.*\.webp/);
    await expect(
      chatbotBand.getByTestId("capability-band-image-0"),
    ).toHaveAttribute("data-image-state", /^(lqip|loaded)$/);

    const stageBox = await stage.boundingBox();
    const imageBox = await image.boundingBox();
    if (!stageBox || !imageBox) {
      throw new Error("Expected chatbot stage and image bounding boxes.");
    }

    expect(imageBox.height / stageBox.height).toBeGreaterThan(0.4);
  });

  test("Given deployment carousel in detailed layout, when slide loads, then image fills most of visual frame", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    const stage = deploymentBand.getByTestId("capability-band-stage");
    const image = bandImage(page, 6, 0);

    await expect(image).toHaveAttribute(
      "src",
      /namecheap-dashboard-domain.*\.webp/,
    );

    const stageBox = await stage.boundingBox();
    const imageBox = await image.boundingBox();
    if (!stageBox || !imageBox) {
      throw new Error("Expected deployment stage and image bounding boxes.");
    }

    expect(imageBox.height / stageBox.height).toBeGreaterThan(0.4);
  });

  test("Given billing hybrid footer, when user views band, then badges render without slide dots", async ({
    page,
  }) => {
    const billingBand = page.getByTestId("highlight-band-2");
    await billingBand.scrollIntoViewIfNeeded();
    const footer = billingBand.getByTestId("capability-band-footer");
    const badges = billingBand.getByTestId("capability-band-badges");

    await expect(footer).toBeVisible();
    await expect(badges).toContainText("Stripe");
    await expect(badges).toContainText("PayPal");
    await expect(billingBand.getByRole("tab")).toHaveCount(0);
    await expect(
      billingBand.getByTestId("capability-band-slide-counter"),
    ).toHaveCount(0);
  });

  test("Given chatbot hybrid footer, when user views band, then badges render without slide dots", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await chatbotBand.scrollIntoViewIfNeeded();
    const badges = chatbotBand.getByTestId("capability-band-badges");

    await expect(
      chatbotBand.getByTestId("capability-band-footer"),
    ).toBeVisible();
    await expect(badges).toContainText("Groq");
    await expect(badges).toContainText("Anthropic Claude");
    await expect(chatbotBand.getByRole("tab")).toHaveCount(0);
  });

  test("Given deployment hybrid footer, when user advances slide, then slide counter updates", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    await deploymentBand.scrollIntoViewIfNeeded();
    const counter = deploymentBand.getByTestId("capability-band-slide-counter");

    await expect(counter).toHaveText("1 / 4");
    await deploymentBand.getByTestId("capability-carousel-next").click();
    await expect(counter).toHaveText("2 / 4");
  });

  test("Given ATDD hybrid single image, when user views band, then footer badges render below screenshot", async ({
    page,
  }) => {
    const atddBand = page.getByTestId("highlight-band-7");
    await atddBand.scrollIntoViewIfNeeded();
    const badges = atddBand.getByTestId("capability-band-badges");
    const image = bandImage(page, 7, 0);

    await expect(atddBand.getByTestId("capability-band-footer")).toBeVisible();
    await expect(badges).toContainText("Playwright");
    await expect(badges).toContainText("Vitest");

    const imageBox = await image.boundingBox();
    const badgesBox = await badges.boundingBox();
    if (!imageBox || !badgesBox) {
      throw new Error("Expected ATDD image and badge bounding boxes.");
    }

    expect(badgesBox.y).toBeGreaterThanOrEqual(
      imageBox.y + imageBox.height - 4,
    );
  });

  test("Given chatbot carousel chevrons, when controls render, then nav buttons anchor to stage edges", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    const stage = chatbotBand.getByTestId("capability-band-stage");
    const prevButton = chatbotBand.getByTestId("capability-carousel-prev");
    const nextButton = chatbotBand.getByTestId("capability-carousel-next");

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(chatbotBand.getByText("Prev")).toHaveCount(0);
    await expect(chatbotBand.getByText("Next")).toHaveCount(0);

    const stageBox = await stage.boundingBox();
    const prevBox = await prevButton.boundingBox();
    const nextBox = await nextButton.boundingBox();
    if (!stageBox || !prevBox || !nextBox) {
      throw new Error("Expected chatbot carousel bounding boxes.");
    }

    expect(prevBox.x).toBeGreaterThanOrEqual(stageBox.x - 4);
    expect(prevBox.x + prevBox.width).toBeLessThanOrEqual(
      stageBox.x + stageBox.width / 2 + 4,
    );
    expect(nextBox.x).toBeGreaterThanOrEqual(
      stageBox.x + stageBox.width / 2 - 4,
    );
    expect(nextBox.x + nextBox.width).toBeLessThanOrEqual(
      stageBox.x + stageBox.width + 4,
    );

    const prevCenterY = prevBox.y + prevBox.height / 2;
    const stageCenterY = stageBox.y + stageBox.height / 2;
    expect(Math.abs(prevCenterY - stageCenterY)).toBeLessThanOrEqual(12);
  });
});
