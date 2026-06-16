import { expect, test } from "@playwright/test";
import { selectors } from "../fixtures/selectors";
import {
  assertSectionInViewport,
  clickNavLink,
  gotoHome,
} from "../fixtures/test-helpers";

test.describe("homepage navigation", () => {
  test("Given homepage, when user clicks all header nav links, then each section scrolls into viewport in DOM order", async ({
    page,
  }) => {
    await gotoHome(page);

    await clickNavLink(page, "work");
    await assertSectionInViewport(page, selectors.work.section);

    await clickNavLink(page, "about");
    await assertSectionInViewport(page, selectors.sections.about);

    await clickNavLink(page, "approach");
    await assertSectionInViewport(page, selectors.sections.approach);

    await clickNavLink(page, "contact");
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

  test("Given homepage scrolled to contact, when user clicks header name, then hero title returns to view", async ({
    page,
  }) => {
    await gotoHome(page);

    await clickNavLink(page, "contact");
    await assertSectionInViewport(page, selectors.sections.contact);

    await page.getByRole("link", { name: "Zeddrix Fabian" }).click();
    await expect(page).toHaveURL(/\/portfolio\/?$/);
    await expect(page.getByTestId(selectors.hero.title)).toBeInViewport();
  });
});
