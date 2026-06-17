import { expect, test } from "@playwright/test";
import { PAGES_SITE_URL, pagesPath } from "../fixtures/pages-env";

test.describe("certificate routes", () => {
  test("Given homepage footer, when user opens certifications, then index lists all certificates", async ({
    page,
  }) => {
    await page.goto(pagesPath("/"));
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.getByTestId("footer-certificates-link").click();
    await expect(page).toHaveURL(`${PAGES_SITE_URL}/certificates`);
    await expect(page.getByTestId("certificates-index-title")).toContainText(
      "Certifications",
    );
    await expect(
      page.getByTestId("certificate-card-mern-ecommerce-from-scratch"),
    ).toBeVisible();
    await expect(
      page.getByTestId("certificate-card-skills-mern-ecommerce-from-scratch"),
    ).toContainText("MERN Stack");
  });

  test("Given certifications index, when user opens MERN certificate, then detail shows image and metadata", async ({
    page,
  }) => {
    await page.goto(pagesPath("/certificates"));
    await page
      .getByTestId("certificate-card-mern-ecommerce-from-scratch")
      .click();
    await expect(page).toHaveURL(
      `${PAGES_SITE_URL}/certificates/mern-ecommerce-from-scratch`,
    );
    await expect(page.getByTestId("certificate-detail-title")).toContainText(
      "MERN eCommerce",
    );
    await expect(page.getByTestId("certificate-detail-image")).toBeVisible();
    await expect(page.getByTestId("certificate-detail-skills")).toContainText(
      "MERN Stack",
    );
  });
});
