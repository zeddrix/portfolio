import { expect, test } from "@playwright/test";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and scrolls, then developer identity and motto are clear", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("hero-title")).toContainText(
      "Zeddrix Fabian",
    );
    await expect(page.getByTestId("hero-subtitle")).toContainText(
      "AI Agentic Developer",
    );
    await expect(page.getByTestId("hero-motto")).toContainText(
      "I like to work smart, not hard.",
    );

    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("hero-cta")).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );

    await page.getByTestId("about-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("about-description")).toContainText(
      "AI Agentic Developer",
    );
  });
});
