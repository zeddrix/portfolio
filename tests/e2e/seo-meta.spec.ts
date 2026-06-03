import { expect, test } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_HOME_PATH,
  PAGES_SITE_URL,
  pagesPath,
} from "./fixtures/pages-env";

const projectPath = (slug: string) => pagesPath(`/projects/${slug}`);

test.describe("seo metadata", () => {
  test("Given homepage, when user inspects head and opens Queue project, then SEO URLs match configured site URL", async ({
    page,
  }) => {
    // Given homepage
    await page.goto(PAGES_HOME_PATH);

    await expect(page).toHaveTitle(
      /Zeddrix Fabian.*Full-Stack Web App Developer/i,
    );

    const homeCanonical = `${PAGES_SITE_URL}/`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      homeCanonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      homeCanonical,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(
        `${PAGES_SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/me\\.png$`,
      ),
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute("href", /me\.png/);
    const faviconHref = await favicon.getAttribute("href");
    expect(faviconHref).not.toBeNull();
    const faviconUrl = new URL(faviconHref ?? "", page.url()).href;
    expect(faviconUrl).toContain(`${PAGES_BASE_PATH}/`);
    expect(faviconUrl).toMatch(/me\.png$/);

    const personJsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .evaluate((node) => node.textContent ?? "");
    expect(personJsonLd).toMatch(/"@type"\s*:\s*"Person"/);
    expect(personJsonLd).toContain(PAGES_SITE_URL);

    // When user navigates to project detail
    await page.getByTestId("work-section").scrollIntoViewIfNeeded();
    await page.getByTestId("work-filter-personal").click();
    await page.getByTestId("project-link-queue").click();
    await page.waitForURL("**/projects/queue");

    // Then project-specific SEO is present
    await expect(page).toHaveTitle(/Queue.*Zeddrix Fabian/i);
    const projectCanonical = `${PAGES_SITE_URL}/projects/queue`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      projectCanonical,
    );
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given project detail route, when user opens Queue and scrolls to title, then description is project-specific", async ({
    page,
  }) => {
    await page.goto(projectPath("queue"));

    await expect(page).toHaveTitle(/Queue.*Zeddrix Fabian/i);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      /walk-in|booking|operations/i,
    );

    await page.getByTestId("project-detail-title").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given sitemap and robots, when user fetches both and opens listed project URL, then URLs are absolute and reachable", async ({
    page,
    request,
  }) => {
    const sitemapResponse = await request.get(pagesPath("/sitemap.xml"));
    expect(sitemapResponse.ok()).toBeTruthy();

    const body = await sitemapResponse.text();
    const queueLoc = `${PAGES_SITE_URL}/projects/queue`;
    expect(body).toContain(`<loc>${queueLoc}</loc>`);
    expect(body).toContain(`<loc>${PAGES_SITE_URL}/</loc>`);

    const robotsResponse = await request.get(pagesPath("/robots.txt"));
    expect(robotsResponse.ok()).toBeTruthy();
    const robotsBody = await robotsResponse.text();
    expect(robotsBody).toContain(`Sitemap: ${PAGES_SITE_URL}/sitemap.xml`);

    await page.goto(projectPath("queue"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });
});
