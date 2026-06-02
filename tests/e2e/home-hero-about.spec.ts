import { expect, test } from "@playwright/test";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and scrolls through sections, then developer identity and improved layout rhythm are clear", async ({
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

    await page
      .getByTestId("projects-overview-section")
      .scrollIntoViewIfNeeded();
    await expect(page.getByTestId("about-section")).toBeVisible();
    await expect(page.getByTestId("projects-overview-section")).toBeVisible();

    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-1")).toBeVisible();
    await expect(page.getByTestId("highlight-band-0")).toHaveAttribute(
      "data-align",
      "left-media",
    );
    await expect(page.getByTestId("highlight-band-1")).toHaveAttribute(
      "data-align",
      "right-media",
    );
  });
});
