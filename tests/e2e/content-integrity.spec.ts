import { expect, test } from "@playwright/test";

test.describe("content integrity", () => {
  test("Given homepage, when user scans tools and approach sections, then required stack keywords are rendered", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("tools-strip-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "TypeScript",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Angular",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Cursor IDE",
    );
    await expect(page.getByTestId("tools-strip-section")).toContainText(
      "Claude Code",
    );

    await page.getByTestId("capability-bands-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Cloudflare",
    );
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Docker",
    );
    await expect(page.getByTestId("capability-bands-section")).toContainText(
      "Testing & ATDD",
    );
  });
});
