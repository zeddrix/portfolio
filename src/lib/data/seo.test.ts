import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const siteUrl = "https://zeddrix.github.io/zeddrix-portfolio";

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

  it("getSiteUrl falls back to dev URL when PUBLIC_SITE_URL is empty", async () => {
    vi.doMock("$env/static/public", () => ({
      PUBLIC_SITE_URL: "",
    }));
    const { getSiteUrl } = await import("./seo");
    expect(getSiteUrl()).toBe("http://127.0.0.1:7212");
  });
});
