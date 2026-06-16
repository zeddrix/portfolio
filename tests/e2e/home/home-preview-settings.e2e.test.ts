import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  openPreviewSettings,
  scrollToTestId,
  setCapabilityLayout,
  setWorkLayout,
} from "../fixtures/test-helpers";

test.describe("homepage preview settings", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeWithCleanState(page);
  });

  test("Given homepage, when user toggles work layouts, then grid and case studies swap", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId(selectors.work.grid)).toBeVisible();

    await setWorkLayout(page, "caseStudyLed");
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await expect(page.getByTestId(selectors.work.grid)).toHaveCount(0);

    await setWorkLayout(page, "featuredGrid");
    await expect(page.getByTestId(selectors.work.grid)).toBeVisible();
    await expect(page.getByTestId("case-study-queue")).toBeHidden();
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

  test("Given fresh homepage, when user opens preview settings, then detailed approach layout is selected", async ({
    page,
  }) => {
    await openPreviewSettings(page);
    await expect(
      page.getByTestId(selectors.previewSettings.capabilityDetailed),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("Given preview settings changed, when page reloads, then case study and detailed layouts persist", async ({
    page,
  }) => {
    await setWorkLayout(page, "caseStudyLed");
    await setCapabilityLayout(page, "sevenBands");
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await page.reload();

    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await expect(page.getByTestId(selectors.work.grid)).toHaveCount(0);

    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
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
