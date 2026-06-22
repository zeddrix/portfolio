import { describe, expect, it } from "vitest";
import { buildStaticNotFoundHtml } from "./static-not-found-html";

const siteUrl = "https://zeddrix.com";

describe("buildStaticNotFoundHtml", () => {
  it("includes noindex robots meta and page not found copy", () => {
    const html = buildStaticNotFoundHtml(siteUrl);

    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).toContain("Page not found");
    expect(html).toContain(siteUrl);
    expect(html).toContain("Back to home");
  });

  it("does not include SvelteKit SPA markers", () => {
    const html = buildStaticNotFoundHtml(siteUrl);

    expect(html).not.toContain("__sveltekit");
  });
});
