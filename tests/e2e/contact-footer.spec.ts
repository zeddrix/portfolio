import { expect, test } from "@playwright/test";

test.describe("contact and footer", () => {
  test("Given contact section, when user uses CTA and verifies footer links, then identity links are coherent", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("header-github-link")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );

    await page.getByTestId("contact-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("contact-cta")).toHaveAttribute(
      "href",
      "mailto:zeddrix.fabian@gmail.com",
    );
    await page.getByTestId("contact-cta").click();

    await page.getByTestId("footer-section").scrollIntoViewIfNeeded();
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
