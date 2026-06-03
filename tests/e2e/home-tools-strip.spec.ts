import { expect, test } from "@playwright/test";

test.describe("homepage tools strip", () => {
  test("Given homepage, when user reviews tools strip, then core stack tools are listed without duplicate capability cards", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Cursor IDE",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Cloudflare",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Docker",
    );
    await expect(page.getByTestId("capability-card-fullstack")).toHaveCount(0);
  });
});
