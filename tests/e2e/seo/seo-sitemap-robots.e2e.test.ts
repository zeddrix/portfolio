import { expect, test } from "@playwright/test";
import { projects } from "../../../src/lib/data/portfolio";
import { PAGES_SITE_URL, pagesPath } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";

test.describe("seo sitemap and robots", () => {
  test("Given sitemap, when user fetches XML, then all project slugs are listed with absolute URLs", async ({
    request,
  }) => {
    const sitemapResponse = await request.get(pagesPath("/sitemap.xml"));
    expect(sitemapResponse.ok()).toBeTruthy();

    const body = await sitemapResponse.text();
    expect(body).toContain(`<loc>${PAGES_SITE_URL}/</loc>`);

    for (const project of projects) {
      expect(body).toContain(
        `<loc>${PAGES_SITE_URL}/projects/${project.slug}</loc>`,
      );
    }
  });

  test("Given robots.txt, when user fetches and follows sitemap project URL, then detail page loads", async ({
    page,
    request,
  }) => {
    const robotsResponse = await request.get(pagesPath("/robots.txt"));
    expect(robotsResponse.ok()).toBeTruthy();
    const robotsBody = await robotsResponse.text();
    expect(robotsBody).toContain(`Sitemap: ${PAGES_SITE_URL}/sitemap.xml`);

    await page.goto(pagesPath("/projects/articulearn"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Articulearn",
    );
  });

  test("Given 404 project route, when user returns home via not-found link, then homepage loads", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/missing-slug"));
    await expect(page.getByTestId(selectors.project.notFound)).toBeVisible();
    await page.getByTestId(selectors.project.notFoundHome).click();
    await page.waitForURL(
      new RegExp(`${PAGES_SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`),
    );
    await expect(page.getByTestId(selectors.hero.title)).toBeVisible();
  });
});
