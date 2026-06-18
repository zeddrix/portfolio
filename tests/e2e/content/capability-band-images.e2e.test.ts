import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  capabilityLayoutStorageKey,
  gotoHome,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

const manatalFillTolerancePx = 2;
const chatbotPhoneCenterTolerancePx = 12;

const chatbotPhoneViewports = [
  {
    name: "mobile",
    width: 390,
    height: 844,
    maxPhoneWidth: 280,
    minPhoneHeight: 300,
  },
  {
    name: "tablet",
    width: 768,
    height: 1024,
    maxPhoneWidth: 280,
    minPhoneHeight: 300,
  },
  {
    name: "desktop",
    width: 1280,
    height: 900,
    maxPhoneWidth: 280,
    minPhoneHeight: 300,
  },
] as const;

async function scrollToChatbotBand(page: import("@playwright/test").Page) {
  await scrollToTestId(page, selectors.sections.approach);
  const chatbotBand = page.getByTestId("highlight-band-4");
  await chatbotBand.scrollIntoViewIfNeeded();
  return chatbotBand;
}

/** @param {import('@playwright/test').Locator} screen @param {import('@playwright/test').Locator} image */
async function expectImageFillsPhoneScreenEdges(
  screen: import("@playwright/test").Locator,
  image: import("@playwright/test").Locator,
  tolerancePx: number,
) {
  const screenBox = await screen.boundingBox();
  const imageBox = await image.boundingBox();
  if (!screenBox || !imageBox) {
    throw new Error("Expected phone screen and image bounding boxes.");
  }

  expect(imageBox.x).toBeLessThanOrEqual(screenBox.x + tolerancePx);
  expect(imageBox.y).toBeLessThanOrEqual(screenBox.y + tolerancePx);
  expect(imageBox.x + imageBox.width).toBeGreaterThanOrEqual(
    screenBox.x + screenBox.width - tolerancePx,
  );
  expect(imageBox.y + imageBox.height).toBeGreaterThanOrEqual(
    screenBox.y + screenBox.height - tolerancePx,
  );
}

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

function bandTextColumn(
  page: import("@playwright/test").Page,
  bandIndex: number,
) {
  return page
    .getByTestId(`highlight-band-${bandIndex}`)
    .getByTestId("capability-band-text-column");
}

test.describe("capability band images", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
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
      /answeriq-6-admin-dashboard.*\.webp/,
    );

    const chatbotBand = page.getByTestId("highlight-band-4");
    await expect(
      chatbotBand.getByTestId("capability-band-visual-carousel"),
    ).toBeVisible();
    const chatbotImage = bandImage(page, 4, 0);
    await expect(chatbotImage).toHaveAttribute(
      "src",
      /manatal-coop-chatbot.*\.webp/,
    );
    await expect(
      chatbotBand.getByTestId("phone-device-frame-domain"),
    ).toHaveText("manatalcoop.app");
    await expect(bandTextColumn(page, 4)).toContainText("Groq");
    await expect(bandTextColumn(page, 4)).toContainText("Anthropic Claude");

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
      /manatal-coop-chatbot.*\.webp/,
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
    const activeImage = monetizationBand
      .locator('[data-testid="capability-band-visual-carousel"] .opacity-100')
      .locator('[data-testid^="capability-band-image-"]')
      .locator("img");
    await expect(activeImage).toHaveAttribute(
      "src",
      /lemonsqueezy-dashboard.*\.webp/,
    );

    await expect
      .poll(async () => activeImage.getAttribute("src"), {
        timeout: 5_000,
      })
      .toMatch(/answeriq-6-admin-dashboard.*\.webp/);
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

  for (const viewport of chatbotPhoneViewports) {
    test(`Given chatbot band at ${viewport.name}, when slide 1 loads, then image fills phone screen edges`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      const chatbotBand = await scrollToChatbotBand(page);
      const screen = chatbotBand
        .locator(".opacity-100")
        .getByTestId("phone-device-screen");
      const image = chatbotBand
        .locator(".opacity-100")
        .getByTestId("capability-band-image-0")
        .locator("img");

      await expect(image).toHaveAttribute(
        "src",
        /manatal-coop-chatbot.*\.webp/,
      );
      await expect(
        chatbotBand.getByTestId("capability-band-image-0"),
      ).toHaveAttribute("data-image-state", /^(lqip|loaded)$/);

      await expectImageFillsPhoneScreenEdges(
        screen,
        image,
        manatalFillTolerancePx,
      );
    });

    test(`Given chatbot band at ${viewport.name}, when slide 1 loads, then phone frame is centered in gradient stage`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      const chatbotBand = await scrollToChatbotBand(page);
      const activeSlide = chatbotBand.locator(".opacity-100");
      const gradientStage = activeSlide.getByTestId(
        "capability-band-gradient-stage",
      );
      const phone = activeSlide.getByTestId("carousel-device-frame-phone");

      const gradientBox = await gradientStage.boundingBox();
      const phoneBox = await phone.boundingBox();
      if (!gradientBox || !phoneBox) {
        throw new Error(
          "Expected chatbot gradient stage and phone frame bounding boxes.",
        );
      }

      const gradientCenterX = gradientBox.x + gradientBox.width / 2;
      const phoneCenterX = phoneBox.x + phoneBox.width / 2;
      expect(Math.abs(phoneCenterX - gradientCenterX)).toBeLessThanOrEqual(
        chatbotPhoneCenterTolerancePx,
      );
    });

    test(`Given chatbot band at ${viewport.name}, when slide 1 loads, then phone frame fits band column`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      const chatbotBand = await scrollToChatbotBand(page);
      const phone = chatbotBand
        .locator(".opacity-100")
        .getByTestId("carousel-device-frame-phone");
      const phoneBox = await phone.boundingBox();
      if (!phoneBox) {
        throw new Error("Expected chatbot phone frame bounding box.");
      }

      expect(phoneBox.width).toBeLessThanOrEqual(viewport.maxPhoneWidth + 2);
      expect(phoneBox.height).toBeGreaterThanOrEqual(viewport.minPhoneHeight);
    });
  }

  test("Given chatbot hybrid band, when user views band, then Shown in includes manatal-coop project link", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await chatbotBand.scrollIntoViewIfNeeded();

    await expect(
      chatbotBand.getByTestId("band-project-link-chatbot-manatal-coop"),
    ).toBeVisible();
    await expect(
      chatbotBand.getByTestId("band-project-link-chatbot-manatal-coop"),
    ).toHaveText("manatal-coop");
    await expect(
      chatbotBand.getByTestId("band-project-link-chatbot-manatal-coop"),
    ).toHaveAttribute("href", /\/projects\/manatal-coop$/);
  });

  test("Given deployment carousel in detailed layout, when slide loads, then image fills browser screen area", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    const browserScreen = deploymentBand
      .locator(".opacity-100")
      .getByTestId("browser-device-screen");
    const image = bandImage(page, 6, 0);

    await expect(image).toHaveAttribute(
      "src",
      /namecheap-dashboard-domain.*\.webp/,
    );

    const screenBox = await browserScreen.boundingBox();
    const imageBox = await image.boundingBox();
    if (!screenBox || !imageBox) {
      throw new Error(
        "Expected deployment browser screen and image bounding boxes.",
      );
    }

    expect(imageBox.height / screenBox.height).toBeGreaterThan(0.4);
  });

  test("Given billing hybrid band, when user views band, then badges render in text column without slide dots", async ({
    page,
  }) => {
    const billingBand = page.getByTestId("highlight-band-2");
    await billingBand.scrollIntoViewIfNeeded();
    const textColumn = bandTextColumn(page, 2);
    const badges = textColumn.getByTestId("capability-band-badges");

    await expect(billingBand.getByTestId("capability-band-footer")).toHaveCount(
      0,
    );
    await expect(badges).toContainText("Stripe");
    await expect(badges).toContainText("PayPal");
    await expect(billingBand.getByRole("tab")).toHaveCount(0);
    await expect(
      textColumn.getByTestId("capability-band-slide-counter"),
    ).toHaveCount(0);
  });

  test("Given chatbot hybrid band, when user views band, then badges render in text column without slide dots", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await chatbotBand.scrollIntoViewIfNeeded();
    const textColumn = bandTextColumn(page, 4);
    const badges = textColumn.getByTestId("capability-band-badges");

    await expect(chatbotBand.getByTestId("capability-band-footer")).toHaveCount(
      0,
    );
    await expect(badges).toContainText("Groq");
    await expect(badges).toContainText("Anthropic Claude");
    await expect(chatbotBand.getByRole("tab")).toHaveCount(0);
  });

  test("Given deployment hybrid band, when user advances slide, then slide counter in text column updates", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    await deploymentBand.scrollIntoViewIfNeeded();
    const counter = bandTextColumn(page, 6).getByTestId(
      "capability-band-slide-counter",
    );

    await expect(counter).toHaveText("1 / 4");
    await deploymentBand.getByTestId("capability-carousel-next").click();
    await expect(counter).toHaveText("2 / 4");
  });

  test("Given ATDD hybrid single image, when user views band, then badges render in text column", async ({
    page,
  }) => {
    const atddBand = page.getByTestId("highlight-band-7");
    await atddBand.scrollIntoViewIfNeeded();
    const textColumn = bandTextColumn(page, 7);
    const badges = textColumn.getByTestId("capability-band-badges");

    await expect(atddBand.getByTestId("capability-band-footer")).toHaveCount(0);
    await expect(badges).toContainText("Playwright");
    await expect(badges).toContainText("Vitest");
    await expect(textColumn).toBeVisible();
  });

  test("Given chatbot carousel, when user views slide one then advances, then phone frame then browser frame render", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await chatbotBand.scrollIntoViewIfNeeded();

    await expect(
      chatbotBand
        .locator(".opacity-100")
        .getByTestId("carousel-device-frame-phone"),
    ).toBeVisible();
    await chatbotBand.getByTestId("capability-carousel-next").click();
    await expect(
      chatbotBand.locator(".opacity-100").getByTestId("browser-device-frame"),
    ).toBeVisible();
  });

  test("Given billing carousel, when user advances slide, then both slides use browser frame", async ({
    page,
  }) => {
    const billingBand = page.getByTestId("highlight-band-2");
    await billingBand.scrollIntoViewIfNeeded();

    await expect(
      billingBand.locator(".opacity-100").getByTestId("browser-device-frame"),
    ).toBeVisible();
    await billingBand.getByTestId("capability-carousel-next").click();
    await expect(
      billingBand.locator(".opacity-100").getByTestId("browser-device-frame"),
    ).toBeVisible();
  });

  test("Given chatbot carousel chevrons, when controls render, then nav buttons sit outside device frame", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    const carouselRow = chatbotBand.getByTestId("capability-band-carousel-row");
    const prevButton = chatbotBand.getByTestId("capability-carousel-prev");
    const nextButton = chatbotBand.getByTestId("capability-carousel-next");

    await expect(carouselRow).toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(chatbotBand.getByText("Prev")).toHaveCount(0);
    await expect(chatbotBand.getByText("Next")).toHaveCount(0);

    await expect(chatbotBand.getByTestId("capability-band-stage")).toHaveCount(
      0,
    );
    await expect(prevButton).not.toHaveClass(/absolute/);
  });
});
