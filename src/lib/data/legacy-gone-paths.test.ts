import { describe, expect, it } from "vitest";
import { isLegacyGonePath } from "./legacy-gone-paths";

describe("isLegacyGonePath", () => {
  it("matches WordPress author archive paths", () => {
    expect(isLegacyGonePath("/author/zedd")).toBe(true);
    expect(isLegacyGonePath("/author/zedd/page/4")).toBe(true);
    expect(isLegacyGonePath("/author/zedd/page/4/")).toBe(true);
  });

  it("matches WordPress category and pagination paths", () => {
    expect(isLegacyGonePath("/category/coding-projects")).toBe(true);
    expect(isLegacyGonePath("/category/coding-projects/justcolor/")).toBe(true);
    expect(isLegacyGonePath("/page/2")).toBe(true);
  });

  it("matches known indexed legacy post slugs", () => {
    expect(
      isLegacyGonePath("/booklist-add-your-books-titles-the-authors-name-isbn"),
    ).toBe(true);
    expect(
      isLegacyGonePath("/github-findersearch-github-users-web-app-api/"),
    ).toBe(true);
  });

  it("does not match current portfolio routes", () => {
    expect(isLegacyGonePath("/")).toBe(false);
    expect(isLegacyGonePath("/projects/articulearn")).toBe(false);
    expect(isLegacyGonePath("/certificates")).toBe(false);
    expect(isLegacyGonePath("/mern-ecommerce-from-scratch-certificate")).toBe(
      false,
    );
  });
});
