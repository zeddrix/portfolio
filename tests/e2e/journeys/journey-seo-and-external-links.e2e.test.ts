import { expect, test } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_SITE_URL,
  pagesPath,
} from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import { gotoHome, scrollToTestId } from "../fixtures/test-helpers";

test.describe("Journey: seo and external links", () => {
  test("Home → merns-shop → canonical + live demo link", async ({ page }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("band-project-link-atdd-merns-shop").click(),
    ]);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/merns-shop`,
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://merns-shop.onrender.com/",
    );
  });

  test("Sitemap slug → articulearn → website link", async ({
    page,
    request,
  }) => {
    const sitemapResponse = await request.get(pagesPath("/sitemap.xml"));
    expect(sitemapResponse.ok()).toBeTruthy();
    const body = await sitemapResponse.text();
    expect(body).toContain(`<loc>${PAGES_SITE_URL}/projects/articulearn</loc>`);

    await page.goto(pagesPath("/projects/articulearn"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Articulearn",
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://articulearn.app/",
    );
  });

  test("404 → home → sitemap project", async ({ page, request }) => {
    await page.goto(pagesPath("/projects/not-a-real-slug"));
    await expect(page.getByTestId(selectors.project.notFound)).toBeVisible();
    await page.getByTestId(selectors.project.notFoundHome).click();
    await page.waitForURL(new RegExp(`${PAGES_BASE_PATH}/?$`));

    const sitemapResponse = await request.get(pagesPath("/sitemap.xml"));
    expect(sitemapResponse.ok()).toBeTruthy();
    await page.goto(pagesPath("/projects/trulyhappy"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "TrulyHappy",
    );
  });
});
