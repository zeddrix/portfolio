import { expect, test } from "@playwright/test";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and navigates to work, then identity and section rhythm are clear", async ({
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

    await expect(page.getByTestId("hero-glance-personal-count")).toContainText(
      "4",
    );
    await expect(page.getByTestId("hero-glance-client-count")).toContainText(
      "4",
    );

    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("hero-cta")).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );

    await page.getByTestId("hero-work-cta").click();
    await expect(page).toHaveURL(/#work$/);

    await page.getByTestId("about-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("about-description")).toContainText(
      "AI Agentic Developer",
    );
    await expect(page.getByTestId("about-description")).not.toContainText(
      "(ATDD)",
    );

    await expect(page.getByTestId("work-section")).toBeVisible();
    await expect(page.getByTestId("about-section")).toBeVisible();
    await expect(page.getByTestId("highlight-band-0")).toBeVisible();
    await expect(page.getByTestId("highlight-band-1")).toBeVisible();
  });
});
