import { expect, test } from "@playwright/test";

test.describe("homepage navigation", () => {
  test("Given homepage, when user uses header nav, then work and contact sections are reachable", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("nav-link-work").click();
    await expect(page.getByTestId("work-section")).toBeInViewport();

    await page.getByTestId("nav-link-contact").click();
    await expect(page.getByTestId("contact-section")).toBeInViewport();
  });

  test("Given homepage DOM order, when sections are compared, then work precedes about and approach", async ({
    page,
  }) => {
    await page.goto("/");

    const order = await page.evaluate(() => {
      const ids = ["work-section", "about-section", "capability-bands-section"];
      return ids.map((id) => {
        const element = document.querySelector(`[data-testid="${id}"]`);
        return element
          ? Array.from(document.querySelectorAll("[data-testid]")).filter(
              (node) => node.compareDocumentPosition(element) === 0,
            ).length
          : -1;
      });
    });

    const workIndex = await page
      .getByTestId("work-section")
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );
    const aboutIndex = await page
      .getByTestId("about-section")
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );
    const approachIndex = await page
      .getByTestId("capability-bands-section")
      .evaluate((element) =>
        Array.from(document.querySelectorAll("main [data-testid]")).indexOf(
          element,
        ),
      );

    expect(workIndex).toBeGreaterThan(-1);
    expect(aboutIndex).toBeGreaterThan(workIndex);
    expect(approachIndex).toBeGreaterThan(aboutIndex);
    expect(order).toBeDefined();
  });
});
