import { expect, test } from "@playwright/test";

test.describe("content integrity", () => {
  test("Given homepage, when user scans capability section, then required stack keywords are rendered", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("capabilities-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "TypeScript",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Supabase",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Cloudflare",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Docker",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Cursor IDE",
    );
    await expect(page.getByTestId("capabilities-section")).toContainText(
      "Claude Code",
    );
  });
});
