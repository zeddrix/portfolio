import { expect, test } from "@playwright/test";

test.describe("contact and footer", () => {
  test("Given homepage, when user navigates to contact and verifies links, then identity links are coherent", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("header-github-link")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );

    await page.getByTestId("nav-link-contact").click();
    await expect(page.getByTestId("contact-section")).toBeInViewport();
    await page.getByTestId("contact-cta").click();
    await expect(page.getByTestId("contact-cta")).toHaveAttribute(
      "href",
      "mailto:zeddrix.fabian@gmail.com",
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

    const dimensions = await page.evaluate(() => {
      const footer = document.querySelector('[data-testid="footer-section"]');
      return {
        footerHeight: footer?.getBoundingClientRect().height ?? 0,
        viewportHeight: window.innerHeight,
      };
    });
    expect(dimensions.footerHeight).toBeLessThan(
      dimensions.viewportHeight * 0.7,
    );
  });
});
