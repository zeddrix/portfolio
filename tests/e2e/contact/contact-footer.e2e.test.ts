import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  clickNavLink,
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

    await clickNavLink(page, "contact");
    await assertSectionInViewport(page, selectors.sections.contact);
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
    await clickNavLink(page, "contact");
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
    await clickNavLink(page, "contact");
    await scrollToTestId(page, selectors.sections.footer);

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
