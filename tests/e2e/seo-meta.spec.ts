import { expect, test } from "@playwright/test";

test.describe("seo metadata", () => {
  test("Given homepage, when user inspects document head, then core SEO and social tags are present", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(
      /Zeddrix Fabian.*Full-Stack Web App Developer/i,
    );

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /full-stack web app/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /.+\/$/);

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Zeddrix Fabian/i,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /me\.png$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const personJsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .evaluate((node) => node.textContent ?? "");
    expect(personJsonLd).toMatch(/"@type"\s*:\s*"Person"/);
    expect(personJsonLd).toContain("Zeddrix Fabian");

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute("href", /me\.png/);
  });

  test("Given project detail route, when user opens Queue case study, then title and description are project-specific", async ({
    page,
  }) => {
    await page.goto("/projects/queue");

    await expect(page).toHaveTitle(/Queue.*Zeddrix Fabian/i);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /walk-in|booking|operations/i);
    await expect(description).toHaveAttribute("content", /.+/);

    await page.getByTestId("project-detail-title").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given dev server, when user requests sitemap, then homepage and project URLs are listed", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("<loc>");
    expect(body).toContain("/projects/queue");
    expect(body).toMatch(/<loc>[^<]+\/<\/loc>/);
  });
});
