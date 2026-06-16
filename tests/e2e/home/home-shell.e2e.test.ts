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
  });
});
