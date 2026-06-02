import { expect, test } from "@playwright/test";

test.describe("contact and footer", () => {
  test("Given contact section, when user uses CTA and verifies footer links, then identity links are coherent", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("contact-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("contact-cta")).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );
    await page.getByTestId("contact-cta").click();

    await page.getByTestId("footer-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("footer-email")).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );
    await expect(page.getByTestId("footer-x-link")).toHaveAttribute(
      "href",
      /x\.com\/zeddrix/i,
    );
  });
});
