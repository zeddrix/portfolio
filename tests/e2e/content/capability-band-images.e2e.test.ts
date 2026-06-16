import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  capabilityLayoutStorageKey,
  gotoHome,
  openPreviewSettings,
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

  test("Given chatbot carousel, when user advances slides, then screenshot source updates", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    await expect(bandImage(page, 4, 0)).toHaveAttribute(
      "src",
      /chatbot-start.*\.webp/,
    );

    await chatbotBand
      .getByRole("button", { name: "Next Chatbot screenshot" })
      .click();

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

    await deploymentBand
      .getByRole("button", {
        name: "Next Website Domain and Deployment screenshot",
      })
      .click();

    await expect(bandImage(page, 6, 1)).toHaveAttribute(
      "src",
      /cloudflare-dashboard.*\.webp/,
    );
  });

  test("Given grouped capability layout, when user switches from preview settings, then grouped bands render without detailed band six", async ({
    page,
  }) => {
    await setCapabilityLayout(page, "groupedBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
    await openPreviewSettings(page);
    await page
      .getByTestId(selectors.previewSettings.capabilityDetailed)
      .click();
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
  });

  test("Given chatbot carousel in detailed layout, when slide loads, then image fills most of visual frame", async ({
    page,
  }) => {
    const chatbotBand = page.getByTestId("highlight-band-4");
    const visual = chatbotBand.getByTestId("capability-band-visual");
    const image = bandImage(page, 4, 0);

    await expect(image).toHaveAttribute("src", /chatbot-start.*\.webp/);
    await expect(
      chatbotBand.getByTestId("capability-band-image-0"),
    ).toHaveAttribute("data-image-state", /^(lqip|loaded)$/);

    const visualBox = await visual.boundingBox();
    const imageBox = await image.boundingBox();
    if (!visualBox || !imageBox) {
      throw new Error("Expected chatbot visual and image bounding boxes.");
    }

    expect(imageBox.height / visualBox.height).toBeGreaterThan(0.4);
  });

  test("Given deployment carousel in detailed layout, when slide loads, then image fills most of visual frame", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    const visual = deploymentBand.getByTestId("capability-band-visual");
    const image = bandImage(page, 6, 0);

    await expect(image).toHaveAttribute(
      "src",
      /namecheap-dashboard-domain.*\.webp/,
    );

    const visualBox = await visual.boundingBox();
    const imageBox = await image.boundingBox();
    if (!visualBox || !imageBox) {
      throw new Error("Expected deployment visual and image bounding boxes.");
    }

    expect(imageBox.height / visualBox.height).toBeGreaterThan(0.4);
  });
});
