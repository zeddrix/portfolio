import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("content integrity", () => {
  test("Given homepage, when user opens detailed layout and clicks ATDD band link, then required stack keywords and project detail resolve", async ({
    page,
  }) => {
    await gotoHome(page);

    const toolsSection = page.getByTestId(selectors.sections.tools);
    await scrollToTestId(page, selectors.sections.tools);
    await expect(toolsSection).toContainText("SvelteKit");
    await expect(toolsSection).toContainText("Playwright");
    await expect(toolsSection).toContainText("NestJS");

    await setCapabilityLayout(page, "sevenBands");

    await scrollToTestId(page, selectors.sections.approach);
    await expect(
      page.getByTestId("band-project-link-atdd-merns-shop"),
    ).toBeVisible();
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("band-project-link-atdd-merns-shop").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "MERN's Shop",
    );
  });
});
