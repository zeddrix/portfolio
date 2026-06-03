import { expect, test } from "@playwright/test";

test.describe("contact and footer", () => {
  test("Given footer closing block, when user verifies links, then identity links are coherent", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("header-github-link")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );

    await page.getByTestId("footer-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("footer-section")).toContainText(
      "Thanks for checking my work.",
    );
    await expect(page.getByTestId("footer-email")).toHaveAttribute(
      "href",
      "mailto:zeddrix.fabian@gmail.com",
    );
    await expect(page.getByTestId("footer-website-link")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );
    await expect(page.getByTestId("footer-section")).not.toContainText("x.com");
  });
});
