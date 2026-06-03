import { expect, test } from "@playwright/test";

const workLayoutStorageKey = "portfolio-work-layout-mode";
const capabilityLayoutStorageKey = "capability-band-layout-mode";

test.describe("portfolio preview settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(
      ({ workKey, capabilityKey }) => {
        localStorage.removeItem(workKey);
        localStorage.removeItem(capabilityKey);
      },
      {
        workKey: workLayoutStorageKey,
        capabilityKey: capabilityLayoutStorageKey,
      },
    );
    await page.reload();
  });

  test("Given homepage, when user toggles work layouts, then grid and case studies swap", async ({
    page,
  }) => {
    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("work-featured-grid")).toBeVisible();

    await page
      .getByTestId("portfolio-preview-settings")
      .scrollIntoViewIfNeeded();
    await page.getByTestId("portfolio-preview-settings").click();
    await expect(
      page.getByTestId("portfolio-preview-settings-panel"),
    ).toBeVisible();
    await page.getByTestId("work-layout-option-case-studies").click();
    await expect(page.getByTestId("case-study-queue")).toBeVisible();

    await page.getByTestId("work-layout-option-featured-grid").click();
    await expect(page.getByTestId("work-featured-grid")).toBeVisible();
    await expect(page.getByTestId("case-study-queue")).toBeHidden();
  });

  test("Given homepage, when user selects detailed capability layout, then more capability bands render", async ({
    page,
  }) => {
    await page
      .getByTestId("portfolio-preview-settings")
      .scrollIntoViewIfNeeded();
    await page.getByTestId("portfolio-preview-settings").click();
    await expect(
      page.getByTestId("portfolio-preview-settings-panel"),
    ).toBeVisible();
    await page.getByTestId("capability-layout-option-detailed").click();

    await page.getByTestId("capability-bands-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-band-6")).toBeVisible();
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Docker Containerization",
    );
  });
});
