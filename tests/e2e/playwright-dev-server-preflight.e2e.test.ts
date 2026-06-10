import { expect, test } from "@playwright/test";
import { PAGES_HOME_PATH } from "./fixtures/pages-env";
import { selectors } from "./fixtures/selectors";

test.describe("Playwright dev server preflight", () => {
  test("Given dev server, when homepage loads, then response is healthy and hero is attached", async ({
    page,
  }) => {
    const response = await page.goto(PAGES_HOME_PATH, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status() ?? 0).toBeLessThan(500);
    await expect(page.getByTestId(selectors.hero.section)).toBeAttached();
  });
});
