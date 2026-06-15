import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const siteUrl = "https://zeddrix.github.io/portfolio";

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

  it("getDefaultOgImageUrl returns absolute path to default image", async () => {
    const { getDefaultOgImageUrl } = await import("./seo");
    expect(getDefaultOgImageUrl()).toBe(`${siteUrl}/me.png`);
  });

  it("buildPersonJsonLd includes site URL and Person type fields", async () => {
    const { buildPersonJsonLd, serializeJsonLd, homeSeo, getSiteUrl } =
      await import("./seo");
    const jsonLd = buildPersonJsonLd();
    const serialized = serializeJsonLd(jsonLd);

    expect(jsonLd["@type"]).toBe("Person");
    expect(serialized).toContain(getSiteUrl());
    expect(jsonLd.name).toBeTruthy();
    expect(homeSeo.title).toMatch(/Zeddrix Fabian/i);
    expect(homeSeo.description).toMatch(/full-stack web app developer/i);
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
    expect(meta.ogImage).toBe(buildAbsoluteUrl("/answeriq-1-dashboard.webp"));
  });

  it("buildWebsiteJsonLd references portfolio site URL", async () => {
    const { buildWebsiteJsonLd, getSiteUrl } = await import("./seo");
    const jsonLd = buildWebsiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.url).toBe(getSiteUrl());
  });

  it("homeSeo path builds canonical home URL", async () => {
    const { homeSeo, buildAbsoluteUrl } = await import("./seo");
    expect(buildAbsoluteUrl(homeSeo.path)).toBe(`${siteUrl}/`);
    expect(homeSeo.path).toBe("/");
  });

  it("getSiteUrl falls back to dev URL when PUBLIC_SITE_URL is empty", async () => {
    vi.doMock("$env/static/public", () => ({
      PUBLIC_SITE_URL: "",
    }));
    const { getSiteUrl } = await import("./seo");
    expect(getSiteUrl()).toBe("http://127.0.0.1:7212");
  });
});
