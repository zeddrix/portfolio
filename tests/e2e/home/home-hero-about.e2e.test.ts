import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import { gotoHome, scrollToTestId } from "../fixtures/test-helpers";

test.describe("homepage hero and about", () => {
  test("Given homepage, when user reads intro and navigates to work, then identity and section rhythm are clear", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
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
    await expect(page.getByTestId("hero-glance-proof")).toContainText("11");

    const heroLayout = await page.evaluate(() => {
      const heroSection = document.querySelector(
        '[data-testid="hero-section"]',
      );
      const glanceCard = document.querySelector(
        '[data-testid="hero-glance-card"]',
      );
      const greetingColumn = document.querySelector(
        '[data-testid="hero-title"]',
      )?.parentElement;
      const cta = document.querySelector('[data-testid="hero-cta"]');
      const firstCard = document.querySelector(
        '[data-testid="highlight-card-0"]',
      );
      const heroRect = heroSection?.getBoundingClientRect();
      const glanceRect = glanceCard?.getBoundingClientRect();
      const greetingRect = greetingColumn?.getBoundingClientRect();
      const ctaRect = cta?.getBoundingClientRect();
      const cardRect = firstCard?.getBoundingClientRect();
      return {
        heroWidth: heroRect?.width ?? 0,
        glanceWidth: glanceRect?.width ?? 0,
        greetingWidth: greetingRect?.width ?? 0,
        ctaToCarouselGap:
          cardRect && ctaRect ? cardRect.top - ctaRect.bottom : 0,
      };
    });
    expect(heroLayout.glanceWidth).toBeGreaterThanOrEqual(
      heroLayout.heroWidth * 0.28,
    );
    expect(heroLayout.glanceWidth).toBeLessThanOrEqual(
      heroLayout.heroWidth * 0.38,
    );
    expect(heroLayout.greetingWidth).toBeGreaterThanOrEqual(
      heroLayout.heroWidth * 0.55,
    );
    expect(heroLayout.ctaToCarouselGap).toBeGreaterThanOrEqual(48);

    const heroTitleSingleLine = await page
      .getByTestId(selectors.hero.title)
      .evaluate((el) => {
        const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
        return el.getBoundingClientRect().height <= lineHeight * 1.15;
      });
    expect(heroTitleSingleLine).toBe(true);

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
