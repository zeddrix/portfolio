import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  gotoHome,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("contact and footer", () => {
  test("Given homepage, when user navigates to contact and verifies links, then identity links are coherent", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(page.getByTestId(selectors.nav.github)).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );

    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);

    const ctaDimensions = await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="contact-cta"]');
      const card = document.querySelector(
        '[data-testid="contact-section-card"]',
      );
      return {
        ctaWidth: cta?.getBoundingClientRect().width ?? 0,
        cardWidth: card?.getBoundingClientRect().width ?? 0,
      };
    });
    expect(ctaDimensions.ctaWidth).toBeLessThan(ctaDimensions.cardWidth * 0.85);

    await page.getByTestId(selectors.contact.cta).click();
    await expect(page.getByTestId(selectors.contact.cta)).toHaveAttribute(
      "href",
      "mailto:zeddrix.fabian@gmail.com",
    );

    await scrollToTestId(page, selectors.sections.footer);
    await expect(page.getByTestId(selectors.sections.footer)).toContainText(
      "Thanks for checking my work.",
    );
    await expect(
      page.getByTestId(selectors.contact.footerEmail),
    ).toHaveAttribute("href", "mailto:zeddrix.fabian@gmail.com");
    await expect(
      page.getByTestId(selectors.contact.footerWebsite),
    ).toHaveAttribute("href", "https://github.com/zeddrix");
  });

  test("Given approach section, when user uses contact path from approach, then contact section is reachable", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);
    await expect(page.getByTestId(selectors.contact.approachCta)).toBeVisible();
    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);
    await page.getByTestId(selectors.contact.cta).click();
    await expect(page.getByTestId(selectors.contact.cta)).toHaveAttribute(
      "href",
      "mailto:zeddrix.fabian@gmail.com",
    );
  });

  test("Given homepage footer, when user scrolls to footer, then height stays compact", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.contact);
    await scrollToTestId(page, selectors.sections.footer);

    const dimensions = await page.evaluate(() => {
      const footerContent = document.querySelector(
        '[data-testid="footer-section-content"]',
      );
      return {
        footerHeight: footerContent?.getBoundingClientRect().height ?? 0,
        viewportHeight: window.innerHeight,
      };
    });
    expect(dimensions.footerHeight).toBeLessThan(
      dimensions.viewportHeight * 0.7,
    );
  });

  test("Given homepage at max scroll, when user reaches page bottom, then contact and footer are visible without tools strip", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await expect(page.getByTestId(selectors.sections.contact)).toBeInViewport();
    await expect(page.getByTestId(selectors.sections.footer)).toBeInViewport();

    const toolsClear = await page.evaluate(() => {
      const tools = document.querySelector(
        '[data-testid="tools-strip-section"]',
      );
      return tools?.getBoundingClientRect().bottom ?? 0;
    });
    expect(toolsClear).toBeLessThanOrEqual(1);

    const terminalMetrics = await page.evaluate(() => {
      const terminal = document.querySelector('[data-testid="page-terminal"]');
      const closing = document.querySelector('[data-testid="footer-section"]');
      const closingContent = document.querySelector(
        '[data-testid="footer-section-content"]',
      );
      const closingRect = closing?.getBoundingClientRect();
      const contentRect = closingContent?.getBoundingClientRect();
      if (!closingRect || !contentRect) {
        return {
          terminalHeight: 0,
          viewportHeight: window.innerHeight,
          centeringDelta: Number.POSITIVE_INFINITY,
        };
      }
      const contentCenterY = contentRect.top + contentRect.height / 2;
      const closingCenterY = closingRect.top + closingRect.height / 2;
      return {
        terminalHeight: terminal?.getBoundingClientRect().height ?? 0,
        viewportHeight: window.innerHeight,
        centeringDelta:
          Math.abs(contentCenterY - closingCenterY) / closingRect.height,
      };
    });
    expect(terminalMetrics.terminalHeight).toBeGreaterThanOrEqual(
      terminalMetrics.viewportHeight * 0.95,
    );
    expect(terminalMetrics.centeringDelta).toBeLessThanOrEqual(0.15);

    const contactVisibility = await page.evaluate(() => {
      const card = document.querySelector(
        '[data-testid="contact-section-card"]',
      );
      const contactZone = document.querySelector(
        '[data-testid="contact-terminal-zone"]',
      );
      const cardRect = card?.getBoundingClientRect();
      const zoneRect = contactZone?.getBoundingClientRect();
      if (!cardRect || !zoneRect) {
        return {
          fullyVisible: false,
          contactCenteringDelta: Number.POSITIVE_INFINITY,
        };
      }
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const zoneCenterY = zoneRect.top + zoneRect.height / 2;
      return {
        fullyVisible:
          cardRect.top >= -4 && cardRect.bottom <= window.innerHeight + 4,
        contactCenteringDelta:
          Math.abs(cardCenterY - zoneCenterY) / zoneRect.height,
      };
    });
    expect(contactVisibility.fullyVisible).toBe(true);
    expect(contactVisibility.contactCenteringDelta).toBeLessThanOrEqual(0.15);
  });

  test("Given homepage at max scroll on mobile, when user reaches page bottom, then contact and footer are visible without tools strip", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    await expect(page.getByTestId(selectors.sections.contact)).toBeInViewport();
    await expect(page.getByTestId(selectors.sections.footer)).toBeInViewport();

    const toolsClear = await page.evaluate(() => {
      const tools = document.querySelector(
        '[data-testid="tools-strip-section"]',
      );
      return tools?.getBoundingClientRect().bottom ?? 0;
    });
    expect(toolsClear).toBeLessThanOrEqual(1);

    const contactVisibility = await page.evaluate(() => {
      const card = document.querySelector(
        '[data-testid="contact-section-card"]',
      );
      const cardRect = card?.getBoundingClientRect();
      if (!cardRect) {
        return { fullyVisible: false };
      }
      return {
        fullyVisible:
          cardRect.top >= -4 && cardRect.bottom <= window.innerHeight + 4,
      };
    });
    expect(contactVisibility.fullyVisible).toBe(true);
  });
});
