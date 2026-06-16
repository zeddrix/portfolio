import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import { gotoHome, scrollToTestId } from "../fixtures/test-helpers";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and navigates to work, then identity and section rhythm are clear", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(page.getByTestId(selectors.hero.title)).toContainText(
      "Zeddrix Fabian",
    );
    await expect(page.getByTestId(selectors.hero.subtitle)).toContainText(
      "Full-stack web app developer",
    );
    await expect(page.getByTestId(selectors.hero.subtitle)).toContainText(
      "AI-accelerated workflows",
    );

    const glanceCard = page.getByTestId("hero-glance-card");
    await expect(glanceCard).toBeVisible();
    await expect(page.getByTestId("hero-glance-experience")).toContainText(
      "2018",
    );
    await expect(page.getByTestId("hero-glance-proof")).toContainText("10");

    await expect(page.getByTestId(selectors.hero.cta)).toContainText(
      "Get in touch",
    );
    await page.getByTestId(selectors.hero.cta).click();
    await expect(page.getByTestId(selectors.hero.cta)).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );

    await scrollToTestId(page, selectors.work.section);
    await expect(page.getByTestId(selectors.work.section)).toBeInViewport();

    await scrollToTestId(page, selectors.sections.about);
    await expect(page.getByTestId("about-description")).toContainText(
      "I have been developing since 2018",
    );
    await expect(page.getByTestId("about-description")).toContainText("(ATDD)");
  });
});
