import { expect, test } from "@playwright/test";
import { PAGES_HOME_PATH } from "./fixtures/pages-env";

const workLayoutStorageKey = "portfolio-work-layout-mode";
const capabilityLayoutStorageKey = "capability-band-layout-mode";

test.describe("homepage work section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGES_HOME_PATH);
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

  test("Given homepage, when user filters work grid by client then personal, then matching project cards are shown", async ({
    page,
  }) => {
    const grid = page.getByTestId("work-featured-grid");

    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await expect(grid).toBeVisible();

    await grid.getByTestId("work-filter-client").click();
    await expect(
      grid.getByRole("button", { name: "Client", pressed: true }),
    ).toBeVisible();
    await expect(grid.getByTestId("project-card-usedelight")).toBeVisible();
    await expect(grid.getByTestId("project-card-queue")).toHaveCount(0);

    await grid.getByTestId("work-filter-personal").click();
    await expect(grid.getByTestId("project-card-queue")).toBeVisible();
    await expect(grid.getByTestId("project-card-usedelight")).toHaveCount(0);
  });

  test("Given homepage, when user switches to case study layout, then flagship case studies are visible", async ({
    page,
  }) => {
    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("portfolio-preview-settings")
      .scrollIntoViewIfNeeded();
    await page.getByTestId("portfolio-preview-settings").click();
    await expect(
      page.getByTestId("portfolio-preview-settings-panel"),
    ).toBeVisible();
    await page.getByTestId("work-layout-option-case-studies").click();

    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("case-study-usedelight")).toBeVisible();
    await expect(page.getByTestId("case-study-adverio-tools")).toBeVisible();
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await expect(page.getByTestId("work-featured-grid")).toHaveCount(0);
  });

  test("Given case study layout, when page reloads, then case studies remain visible", async ({
    page,
  }) => {
    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await page
      .getByTestId("portfolio-preview-settings")
      .scrollIntoViewIfNeeded();
    await page.getByTestId("portfolio-preview-settings").click();
    await expect(
      page.getByTestId("portfolio-preview-settings-panel"),
    ).toBeVisible();
    await page.getByTestId("work-layout-option-case-studies").click();
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await page.reload();

    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("case-study-queue")).toBeVisible();
    await expect(page.getByTestId("work-featured-grid")).toHaveCount(0);
  });

  test("Given homepage carousel, when user reads highlight labels, then client and personal labels are accurate", async ({
    page,
  }) => {
    const carousel = page.getByTestId("highlights-carousel");
    await carousel.scrollIntoViewIfNeeded();
    await expect(
      carousel.getByTestId("carousel-project-type-label-usedelight"),
    ).toContainText("Client work");

    await carousel
      .getByTestId("showcase-project-link-queue")
      .scrollIntoViewIfNeeded();
    await expect(
      carousel.getByTestId("carousel-project-type-label-queue"),
    ).toContainText("Personal");
  });

  test("Given homepage work section, when user explores highlights and grid, then all grouped projects remain reachable", async ({
    page,
  }) => {
    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlights-carousel")).toContainText(
      "UseDelight",
    );
    await expect(page.getByTestId("highlights-carousel")).toContainText(
      "Adverio Tools",
    );
    await expect(page.getByTestId("highlights-carousel")).toContainText(
      "Queue",
    );

    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await page.getByTestId("work-filter-all").click();
    await expect(page.getByTestId("project-card-trulyhappy")).toBeVisible();
    await expect(page.getByTestId("project-card-bolt-to-github")).toBeVisible();
  });
});
