import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const siteUrl = "https://zeddrix.com";

vi.mock("$env/static/public", () => ({
  PUBLIC_SITE_URL: siteUrl,
}));

describe("seo URL helpers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("getSiteUrl trims trailing slash from configured URL", async () => {
    vi.doMock("$env/static/public", () => ({
      PUBLIC_SITE_URL: `${siteUrl}/`,
    }));
    const { getSiteUrl } = await import("./seo");
    expect(getSiteUrl()).toBe(siteUrl);
  });

  it("buildAbsoluteUrl normalizes paths and combines with site URL", async () => {
    const { buildAbsoluteUrl } = await import("./seo");
    expect(buildAbsoluteUrl("/")).toBe(`${siteUrl}/`);
    expect(buildAbsoluteUrl("projects/queue")).toBe(
      `${siteUrl}/projects/queue`,
    );
    expect(buildAbsoluteUrl("/projects/queue")).toBe(
      `${siteUrl}/projects/queue`,
    );
  });

  it("getDefaultOgImageUrl returns absolute path to default OG image", async () => {
    const { getDefaultOgImageUrl, DEFAULT_OG_IMAGE_PATH } =
      await import("./seo");
    expect(getDefaultOgImageUrl()).toBe(`${siteUrl}${DEFAULT_OG_IMAGE_PATH}`);
  });

  it("buildPersonJsonLd includes LinkedIn in sameAs and ContactPoint instead of email", async () => {
    const { buildPersonJsonLd, getSiteUrl } = await import("./seo");
    const jsonLd = buildPersonJsonLd();

    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.url).toBe(getSiteUrl());
    expect(jsonLd.email).toBeUndefined();
    expect(jsonLd.sameAs).toEqual(
      expect.arrayContaining([
        siteUrl,
        "https://github.com/zeddrix",
        "https://www.linkedin.com/in/zeddrix-fabian-30a18029a/",
      ]),
    );
    expect(jsonLd.contactPoint).toMatchObject({
      "@type": "ContactPoint",
      contactType: "professional",
    });
  });

  it("buildProjectMeta produces canonical project paths and titles", async () => {
    const { buildProjectMeta } = await import("./seo");
    const { getProjectBySlug } = await import("./portfolio");
    const queue = getProjectBySlug("queue");
    expect(queue).toBeDefined();
    if (!queue) return;

    const meta = buildProjectMeta(queue);
    expect(meta.title).toMatch(/Queue Case Study/i);
    expect(meta.path).toBe("/projects/queue");
    expect(meta.description.length).toBeGreaterThan(0);
  });

  it("buildCertificateMeta produces certificate paths and og image", async () => {
    const { buildCertificateMeta, buildAbsoluteUrl } = await import("./seo");
    const { getCertificateBySlug } = await import("./certificates");
    const certificate = getCertificateBySlug("mern-ecommerce-from-scratch");
    expect(certificate).toBeDefined();
    if (!certificate) return;

    const meta = buildCertificateMeta(certificate);
    expect(meta.title).toMatch(/MERN eCommerce/i);
    expect(meta.path).toBe("/certificates/mern-ecommerce-from-scratch");
    expect(meta.ogImage).toBe(buildAbsoluteUrl(certificate.imagePath));
  });

  it("buildProjectMeta produces AnswerIQ SEO fields from portfolio data", async () => {
    const { buildProjectMeta, buildAbsoluteUrl } = await import("./seo");
    const { getProjectBySlug } = await import("./portfolio");
    const answeriq = getProjectBySlug("answeriq");
    expect(answeriq).toBeDefined();
    if (!answeriq) return;

    const meta = buildProjectMeta(answeriq);
    expect(meta.title).toMatch(/AnswerIQ Case Study/i);
    expect(meta.path).toBe("/projects/answeriq");
    expect(meta.description.length).toBeGreaterThan(0);
    expect(meta.ogImage).toBe(buildAbsoluteUrl("/answeriq-1-landingpage.webp"));
  });

  it("buildWebsiteJsonLd references portfolio site URL", async () => {
    const { buildWebsiteJsonLd, getSiteUrl } = await import("./seo");
    const jsonLd = buildWebsiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.url).toBe(getSiteUrl());
  });

  it("buildProjectJsonLd uses SoftwareApplication when live demo links exist", async () => {
    const { buildProjectJsonLd } = await import("./seo");
    const { getProjectBySlug } = await import("./portfolio");
    const answeriq = getProjectBySlug("answeriq");
    expect(answeriq).toBeDefined();
    if (!answeriq) return;

    const jsonLd = buildProjectJsonLd(answeriq);
    expect(jsonLd["@type"]).toBe("SoftwareApplication");
    expect(jsonLd.url).toBe(`${siteUrl}/projects/answeriq`);
  });

  it("buildCertificateJsonLd includes EducationalOccupationalCredential fields", async () => {
    const { buildCertificateJsonLd, buildAbsoluteUrl } = await import("./seo");
    const { getCertificateBySlug } = await import("./certificates");
    const certificate = getCertificateBySlug("mern-ecommerce-from-scratch");
    expect(certificate).toBeDefined();
    if (!certificate) return;

    const jsonLd = buildCertificateJsonLd(certificate);
    expect(jsonLd["@type"]).toBe("EducationalOccupationalCredential");
    expect(jsonLd.url).toBe(
      `${siteUrl}/certificates/mern-ecommerce-from-scratch`,
    );
    expect(jsonLd.image).toBe(buildAbsoluteUrl(certificate.imagePath));
  });

  it("buildBreadcrumbJsonLd emits ordered ListItem entries", async () => {
    const { buildBreadcrumbJsonLd } = await import("./seo");
    const jsonLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Queue", path: "/projects/queue" },
    ]);

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Queue",
        item: `${siteUrl}/projects/queue`,
      },
    ]);
  });

  it("buildCertificatesIndexJsonLd lists certificate URLs", async () => {
    const { buildCertificatesIndexJsonLd } = await import("./seo");
    const { certificates } = await import("./certificates");
    const jsonLd = buildCertificatesIndexJsonLd();

    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.itemListElement).toHaveLength(certificates.length);
  });

  it("getProjectLastMod prefers resume end date when present", async () => {
    const { getProjectLastMod } = await import("./seo");
    const { getProjectBySlug } = await import("./portfolio");
    const answeriq = getProjectBySlug("answeriq");
    expect(answeriq).toBeDefined();
    if (!answeriq) return;

    expect(getProjectLastMod(answeriq)).toBe("2025-10-01");
  });

  it("getCertificateLastMod returns issuedAt", async () => {
    const { getCertificateLastMod } = await import("./seo");
    const { getCertificateBySlug } = await import("./certificates");
    const certificate = getCertificateBySlug("mern-ecommerce-from-scratch");
    expect(certificate).toBeDefined();
    if (!certificate) return;

    expect(getCertificateLastMod(certificate)).toBe("2021-04-06");
  });

  it("homeSeo path builds canonical home URL", async () => {
    const { homeSeo, buildAbsoluteUrl } = await import("./seo");
    expect(buildAbsoluteUrl(homeSeo.path)).toBe(`${siteUrl}/`);
    expect(homeSeo.path).toBe("/");
    expect(homeSeo.title).toMatch(/Zeddrix Fabian/i);
    expect(homeSeo.description).toMatch(/full-stack developer/i);
    expect(homeSeo.description).toMatch(/production PWAs|SaaS|e-commerce/i);
    expect(homeSeo.description).toMatch(/SvelteKit, React, and Angular/i);
    expect(homeSeo.description.length).toBeLessThanOrEqual(160);
  });

  it("getSiteUrl falls back to dev URL when PUBLIC_SITE_URL is empty", async () => {
    vi.doMock("$env/static/public", () => ({
      PUBLIC_SITE_URL: "",
    }));
    const { getSiteUrl } = await import("./seo");
    expect(getSiteUrl()).toBe("http://127.0.0.1:7212");
  });
});

describe("legacy redirects", () => {
  it("maps certificate legacy paths to portfolio certificate routes", async () => {
    const { getLegacyRedirectEntries } = await import("./legacy-redirects");
    const entries = getLegacyRedirectEntries(siteUrl);
    const mernRedirect = entries.find(
      (entry) =>
        entry.sourcePath === "/mern-ecommerce-from-scratch-certificate",
    );

    expect(mernRedirect).toEqual({
      sourcePath: "/mern-ecommerce-from-scratch-certificate",
      targetPath: "/certificates/mern-ecommerce-from-scratch",
      targetUrl: `${siteUrl}/certificates/mern-ecommerce-from-scratch`,
    });
  });

  it("maps indexed WordPress cert alias paths to portfolio certificate routes", async () => {
    const { getLegacyRedirectEntries } = await import("./legacy-redirects");
    const entries = getLegacyRedirectEntries(siteUrl);

    expect(
      entries.find(
        (entry) =>
          entry.sourcePath ===
          "/css-the-complete-guide-2021-incl-flexbox-grid-sass",
      ),
    ).toEqual({
      sourcePath: "/css-the-complete-guide-2021-incl-flexbox-grid-sass",
      targetPath: "/certificates/css-complete-guide-2021",
      targetUrl: `${siteUrl}/certificates/css-complete-guide-2021`,
    });

    expect(
      entries.find(
        (entry) =>
          entry.sourcePath ===
          "/node-js-api-masterclass-with-express-mongodb-certificate",
      ),
    ).toEqual({
      sourcePath: "/node-js-api-masterclass-with-express-mongodb-certificate",
      targetPath: "/certificates/nodejs-api-masterclass",
      targetUrl: `${siteUrl}/certificates/nodejs-api-masterclass`,
    });
  });
});
