import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  gotoHome,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("homepage navigation", () => {
  test("Given homepage, when user scrolls through main sections, then work about and approach appear in DOM order", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(page.getByTestId("nav-link-work")).toHaveCount(0);
    await expect(page.getByTestId("nav-link-about")).toHaveCount(0);
    await expect(page.getByTestId("nav-link-approach")).toHaveCount(0);
    await expect(page.getByTestId("nav-link-contact")).toHaveCount(0);
    await expect(page.getByTestId("portfolio-preview-settings")).toHaveCount(0);

    await scrollToTestId(page, selectors.work.section);
    await assertSectionInViewport(page, selectors.work.section);

    await scrollToTestId(page, selectors.sections.about);
    await assertSectionInViewport(page, selectors.sections.about);

    await scrollToTestId(page, selectors.sections.approach);
    await assertSectionInViewport(page, selectors.sections.approach);

    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);

    const workIndex = await page
      .getByTestId(selectors.work.section)
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );
    const aboutIndex = await page
      .getByTestId(selectors.sections.about)
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );
    const approachIndex = await page
      .getByTestId(selectors.sections.approach)
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );

    expect(workIndex).toBeGreaterThan(-1);
    expect(aboutIndex).toBeGreaterThan(workIndex);
    expect(approachIndex).toBeGreaterThan(aboutIndex);
  });

  test("Given homepage scrolled to contact, when user returns to top, then hero title is in view without header name link", async ({
    page,
  }) => {
    await gotoHome(page);

    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);

    await expect(page.getByRole("banner").getByRole("link")).toHaveCount(1);
    await expect(page.getByTestId(selectors.nav.github)).toBeVisible();

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await expect(page.getByTestId(selectors.hero.title)).toBeInViewport();
    await expect(page.getByTestId(selectors.hero.title)).toContainText(
      "Zeddrix Fabian",
    );
  });
});
