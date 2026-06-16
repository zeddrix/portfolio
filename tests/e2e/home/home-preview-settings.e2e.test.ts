import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  openPreviewSettings,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("homepage preview settings", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage, when user selects each capability layout, then matching band structure renders", async ({
    page,
  }) => {
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
    await expect(page.getByTestId(selectors.sections.approach)).toContainText(
      "Docker Containerization",
    );

    await setCapabilityLayout(page, "groupedBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-1")).toBeVisible();
    await expect(page.getByTestId("highlight-band-6")).toHaveCount(0);
  });

  test("Given fresh homepage, when user opens preview settings, then grouped approach layout is selected", async ({
    page,
  }) => {
    await openPreviewSettings(page);
    await expect(
      page.getByTestId(selectors.previewSettings.capabilityGrouped),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("Given preview settings changed, when page reloads, then capability layout persists", async ({
    page,
  }) => {
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
    await page.reload();

    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
    await expect(page.getByTestId(selectors.sections.approach)).toContainText(
      "Docker Containerization",
    );
  });

  test("Given homepage, when user opens and closes preview panel, then panel toggles visibility", async ({
    page,
  }) => {
    await openPreviewSettings(page);
    await expect(
      page.getByTestId(selectors.previewSettings.panel),
    ).toBeVisible();
    await page.getByTestId(selectors.previewSettings.toggle).click();
    await expect(
      page.getByTestId(selectors.previewSettings.panel),
    ).toBeHidden();
  });
});
