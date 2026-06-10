import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  openPreviewSettings,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("capability band images", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
  });

  test("Given detailed capability layout, when user views capability bands, then mapped screenshots render with valid assets", async ({
    page,
  }) => {
    const dockerImage = page
      .getByTestId("highlight-band-5")
      .getByTestId("capability-band-image-0");
    await expect(dockerImage).toHaveAttribute("src", /docker-desktop\.png/);

    const pwaSplit = page
      .getByTestId("highlight-band-1")
      .getByTestId("capability-band-visual-split");
    await expect(pwaSplit).toBeVisible();

    const atddImage = page
      .getByTestId("highlight-band-7")
      .getByTestId("capability-band-image-0");
    await expect(atddImage).toHaveAttribute("src", /atdd-playwright-e2e\.png/);

    const imageUrls = [
      await dockerImage.getAttribute("src"),
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

  test("Given compact capability layout, when user selects compact mode, then single stack band renders", async ({
    page,
  }) => {
    await setCapabilityLayout(page, "singleStack");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId(selectors.sections.approach)).toContainText(
      "End-to-end product delivery",
    );
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
  });
});
