import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  openPreviewSettings,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("homepage tools strip", () => {
  test("Given homepage, when user opens preview settings and clicks ATDD band link, then MERN's Shop detail loads", async ({
    page,
  }) => {
    await gotoHome(page);

    const toolsSection = page.getByTestId(selectors.sections.tools);
    await scrollToTestId(page, selectors.sections.tools);
    await expect(page.getByTestId("tool-group-ai-delivery")).toBeVisible();
    await expect(toolsSection).toContainText("SvelteKit");
    await expect(toolsSection).toContainText("Playwright");

    await openPreviewSettings(page);
    await page
      .getByTestId(selectors.previewSettings.capabilityDetailed)
      .click();

    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("band-project-link-atdd-merns-shop").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "MERN's Shop",
    );
  });
});
