import { expect, test } from "@playwright/test";
import { PAGES_HOME_PATH } from "./fixtures/pages-env";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and navigates to work, then identity and section rhythm are clear", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);

    await expect(page.getByTestId("hero-title")).toContainText(
      "Zeddrix Fabian",
    );
    await expect(page.getByTestId("hero-subtitle")).toContainText(
      "Full-stack web app developer",
    );
    await expect(page.getByTestId("hero-subtitle")).toContainText(
      "AI-accelerated workflows",
    );
    await expect(page.getByTestId("hero-subtitle")).not.toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("hero-proof")).toHaveCount(0);
    await expect(page.getByTestId("hero-motto")).toHaveCount(0);

    const glanceCard = page.getByTestId("hero-glance-card");
    await expect(glanceCard).toBeVisible();
    await expect(page.getByTestId("hero-glance-profile-image")).toHaveCount(0);
    await expect(page.getByTestId("hero-glance-experience")).toContainText(
      "2018",
    );
    await expect(page.getByTestId("hero-glance-proof")).toContainText(
      "Built 7 live products",
    );
    await expect(page.getByTestId("hero-glance-proof")).toContainText("Queue");
    await expect(page.getByTestId("hero-glance-specialization")).toContainText(
      "SvelteKit",
    );
    await expect(page.getByTestId("hero-glance-specialization")).toContainText(
      "React",
    );
    await expect(glanceCard.getByText("Personal products")).toHaveCount(0);
    await expect(glanceCard.getByText("Client engagements")).toHaveCount(0);

    await page.getByTestId("hero-cta").click();
    await expect(page.getByTestId("hero-cta")).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );

    await page.getByTestId("hero-work-cta").click();
    await expect(page).toHaveURL(/#work$/);

    await page.getByTestId("about-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("about-description")).toContainText(
      "I like to work smart, not hard.",
    );
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
