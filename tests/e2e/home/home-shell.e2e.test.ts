import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  clickNavLink,
  gotoHome,
} from "../fixtures/test-helpers";

test.describe("homepage shell", () => {
  test("Given homepage, when user uses hero CTA and inspects github link, then work section and identity links resolve", async ({
    page,
  }) => {
    await gotoHome(page);

    await clickNavLink(page, "work");
    await expect(page).toHaveURL(/#work$/);
    await assertSectionInViewport(page, selectors.work.section);

    await page.getByTestId(selectors.hero.cta).click();
    await expect(page.getByTestId(selectors.hero.cta)).toHaveAttribute(
      "href",
      /mailto:zeddrix/i,
    );

    const githubLink = page.getByTestId(selectors.nav.github);
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );
    await expect(githubLink).toHaveAttribute("target", "_blank");

    const iconGap = await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="hero-cta"]');
      if (!cta) return null;
      const icon = cta.querySelector(".get-in-touch__icon");
      const label = cta.querySelector(".get-in-touch__label");
      if (!icon || !label) return null;
      const iconBox = icon.getBoundingClientRect();
      const labelBox = label.getBoundingClientRect();
      return labelBox.left - iconBox.right;
    });
    expect(iconGap).not.toBeNull();
    expect(iconGap ?? 0).toBeGreaterThanOrEqual(8);
  });
});
