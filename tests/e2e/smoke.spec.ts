import { expect, test } from "@playwright/test";
import { PAGES_HOME_PATH } from "./fixtures/pages-env";

test.describe("smoke baseline", () => {
  test("Given homepage, when loaded and hero actions inspected, then core shell and github identity are visible", async ({
    page,
  }) => {
    await page.goto(PAGES_HOME_PATH);

    const heroHeading = page.getByRole("heading", { level: 1 });
    await expect(heroHeading).toBeVisible();

    const contactCta = page.getByTestId("hero-cta");
    await expect(contactCta).toBeVisible();
    await expect(contactCta).toHaveAttribute("href", /mailto:/i);

    const githubLink = page.getByTestId("header-github-link");
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/zeddrix",
    );
  });
});
