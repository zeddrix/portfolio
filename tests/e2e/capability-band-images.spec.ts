import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, PAGES_HOME_PATH } from "./fixtures/pages-env";

const capabilityLayoutStorageKey = "capability-band-layout-mode";

test.describe("capability band images", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGES_HOME_PATH);
    await page.evaluate((capabilityKey) => {
      localStorage.setItem(capabilityKey, "sevenBands");
    }, capabilityLayoutStorageKey);
    await page.reload();
    await page.getByTestId("capability-bands-section").scrollIntoViewIfNeeded();
  });

  test("Given detailed capability layout, when user views capability bands, then mapped screenshots render with valid assets", async ({
    page,
  }) => {
    const dockerImage = page
      .getByTestId("highlight-band-5")
      .getByTestId("capability-band-image-0");
    await expect(dockerImage).toHaveAttribute("src", /docker-desktop\.png/);
    await expect(dockerImage).toHaveAttribute(
      "src",
      new RegExp(`${PAGES_BASE_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`),
    );

    const pwaSplit = page
      .getByTestId("highlight-band-1")
      .getByTestId("capability-band-visual-split");
    await expect(pwaSplit).toBeVisible();
    await expect(
      page
        .getByTestId("highlight-band-1")
        .getByTestId("capability-band-image-0"),
    ).toHaveAttribute("src", /pwa-queue-desktop\.png/);
    await expect(
      page
        .getByTestId("highlight-band-1")
        .getByTestId("capability-band-image-1"),
    ).toHaveAttribute("src", /pwa-queue-mobile\.png/);

    const deploymentCarousel = page
      .getByTestId("highlight-band-6")
      .getByTestId("capability-band-visual-carousel");
    await expect(deploymentCarousel).toBeVisible();
    await expect(
      page
        .getByTestId("highlight-band-6")
        .getByTestId("capability-band-image-0"),
    ).toHaveAttribute("src", /namecheap-dashboard-domain\.png/);

    const billingImage = page
      .getByTestId("highlight-band-2")
      .getByTestId("capability-band-image-0");
    await expect(billingImage).toHaveAttribute(
      "src",
      /lemonsqueezy-dashboard\.png/,
    );

    const atddImage = page
      .getByTestId("highlight-band-7")
      .getByTestId("capability-band-image-0");
    await expect(atddImage).toHaveAttribute("src", /atdd-playwright-e2e\.png/);

    const imageUrls = [
      await dockerImage.getAttribute("src"),
      await billingImage.getAttribute("src"),
      await page
        .getByTestId("highlight-band-3")
        .getByTestId("capability-band-image-0")
        .getAttribute("src"),
      await atddImage.getAttribute("src"),
    ];

    for (const imageUrl of imageUrls) {
      expect(imageUrl).not.toBeNull();
      const resolvedUrl = new URL(imageUrl ?? "", page.url()).href;
      expect((await page.request.get(resolvedUrl)).ok()).toBeTruthy();
    }
  });

  test("Given deployment carousel, when user advances slides, then screenshot source updates", async ({
    page,
  }) => {
    const deploymentBand = page.getByTestId("highlight-band-6");
    await expect(
      deploymentBand.getByTestId("capability-band-image-0"),
    ).toHaveAttribute("src", /namecheap-dashboard-domain\.png/);

    await deploymentBand
      .getByRole("button", {
        name: "Next Website Domain and Deployment screenshot",
      })
      .click();

    await expect(
      deploymentBand.getByTestId("capability-band-image-1"),
    ).toHaveAttribute("src", /cloudflare-dashboard\.png/);
    await expect(
      deploymentBand.getByTestId("capability-band-image-1"),
    ).not.toHaveAttribute("aria-hidden", "true");
  });
});
