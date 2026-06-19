import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("$app/paths", () => ({
  base: "",
}));

describe("resolveStaticAsset", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("prefixes root-relative paths with kit base", async () => {
    const { resolveStaticAsset } = await import("./static-asset");
    expect(resolveStaticAsset("/me.png")).toBe("/me.png");
    expect(resolveStaticAsset("queue-1-dashboard.png")).toBe(
      "/queue-1-dashboard.png",
    );
  });
});
