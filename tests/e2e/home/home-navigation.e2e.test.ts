import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  gotoHome,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("homepage navigation", () => {
  test("Given homepage, when user scrolls through main sections, then work approach tools and about appear in DOM order", async ({
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

    await scrollToTestId(page, selectors.sections.approach);
    await assertSectionInViewport(page, selectors.sections.approach);

    await scrollToTestId(page, selectors.sections.tools);
    await assertSectionInViewport(page, selectors.sections.tools);

    await scrollToTestId(page, selectors.sections.about);
    await assertSectionInViewport(page, selectors.sections.about);

    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);

    const workIndex = await page
      .getByTestId(selectors.work.section)
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
    const toolsIndex = await page
      .getByTestId(selectors.sections.tools)
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

    expect(workIndex).toBeGreaterThan(-1);
    expect(approachIndex).toBeGreaterThan(workIndex);
    expect(toolsIndex).toBeGreaterThan(approachIndex);
    expect(aboutIndex).toBeGreaterThan(toolsIndex);
  });

  test("Given homepage scrolled to contact, when user returns to top, then hero title is in view with github and resume header links", async ({
    page,
  }) => {
    await gotoHome(page);

    await scrollToTestId(page, selectors.sections.contact);
    await assertSectionInViewport(page, selectors.sections.contact);

    await expect(page.getByRole("banner").getByRole("link")).toHaveCount(2);
    await expect(page.getByTestId(selectors.nav.github)).toBeVisible();
    await expect(page.getByTestId(selectors.nav.resume)).toBeVisible();

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await expect(page.getByTestId(selectors.hero.title)).toBeInViewport();
    await expect(page.getByTestId(selectors.hero.title)).toContainText(
      "Zeddrix Fabian",
    );
  });
});
