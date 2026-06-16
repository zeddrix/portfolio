import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  gotoHomeWithCleanState,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("homepage approach layout toggle", () => {
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

  test("Given fresh homepage, when user scrolls to approach section, then grouped layout is selected", async ({
    page,
  }) => {
    await scrollToTestId(page, selectors.sections.approach);
    await expect(
      page.getByTestId(selectors.approachLayout.capabilityGrouped),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByTestId(selectors.approachLayout.toggle),
    ).toBeVisible();
  });

  test("Given approach layout changed, when page reloads, then capability layout persists", async ({
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
});
