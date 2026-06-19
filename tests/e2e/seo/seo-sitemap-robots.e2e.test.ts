import { expect, test } from "@playwright/test";
import { certificates } from "../../../src/lib/data/certificates";
import { projects } from "../../../src/lib/data/portfolio";
import { PAGES_SITE_URL, pagesPath } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";

test.describe("seo sitemap and robots", () => {
  test("Given sitemap, when user fetches XML, then all project slugs are listed with absolute URLs and lastmod", async ({
    request,
  }) => {
    const sitemapResponse = await request.get(pagesPath("/sitemap.xml"));
    expect(sitemapResponse.ok()).toBeTruthy();

    const body = await sitemapResponse.text();
    expect(body).toContain(`<loc>${PAGES_SITE_URL}/</loc>`);
    expect(body).toContain(`<loc>${PAGES_SITE_URL}/certificates</loc>`);
    expect(body).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);

    for (const project of projects) {
      expect(body).toContain(
        `<loc>${PAGES_SITE_URL}/projects/${project.slug}</loc>`,
      );
    }

    for (const certificate of certificates) {
      expect(body).toContain(
        `<loc>${PAGES_SITE_URL}/certificates/${certificate.slug}</loc>`,
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

  test("Given missing project slug, when user opens detail route, then not-found UI is noindex", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/missing-slug"));
    await expect(page.getByTestId(selectors.project.notFound)).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/missing-slug`,
    );
  });

  test("Given missing certificate slug, when user opens detail route, then not-found UI is noindex", async ({
    page,
  }) => {
    await page.goto(pagesPath("/certificates/missing-slug"));
    await expect(page.getByTestId("certificate-not-found")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/certificates/missing-slug`,
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

  test("Given legacy WordPress cert path, when user fetches redirect page, then target certificate URL is referenced", async ({
    request,
  }) => {
    const response = await request.get(
      pagesPath("/mern-ecommerce-from-scratch-certificate/"),
      { maxRedirects: 0 },
    );
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(
      "/certificates/mern-ecommerce-from-scratch",
    );
  });
});

test.describe("seo accessibility landmarks", () => {
  test("Given homepage, when user tabs from top, then skip link targets main content", async ({
    page,
  }) => {
    await page.goto(pagesPath("/"));
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await skipLink.click();
    await expect(page.locator("#main")).toBeVisible();
  });
});
