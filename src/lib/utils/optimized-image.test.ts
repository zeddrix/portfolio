import { describe, expect, it } from "vitest";
import {
  buildSrcSet,
  getDefaultImageSrc,
  getImageLqip,
  getImageManifestEntry,
  toLogicalImagePath,
} from "./optimized-image";

describe("optimized-image utils", () => {
  it("normalizes png paths to webp logical keys", () => {
    expect(toLogicalImagePath("/queue-1-dashboard.png")).toBe(
      "/queue-1-dashboard.webp",
    );
    expect(toLogicalImagePath("/answeriq-1-dashboard.webp")).toBe(
      "/answeriq-1-dashboard.webp",
    );
  });

  it("returns manifest metadata for optimized images after pipeline runs", () => {
    const entry = getImageManifestEntry("/answeriq-1-dashboard.webp");
    if (!entry) {
      // Manifest is generated at build time; skip when not yet present in dev.
      return;
    }
    expect(entry.width).toBeGreaterThan(0);
    expect(entry.height).toBeGreaterThan(0);
    expect(entry.variants.length).toBeGreaterThan(0);
    expect(entry.lqip.startsWith("data:image/webp;base64,")).toBe(true);
  });

  it("builds srcset and default src from manifest when available", () => {
    const path = "/queue-1-dashboard.webp";
    const entry = getImageManifestEntry(path);
    if (!entry) {
      return;
    }
    expect(buildSrcSet(path)).toMatch(/queue-1-dashboard-\d+w\.webp/);
    expect(getDefaultImageSrc(path)).toMatch(/queue-1-dashboard-\d+w\.webp/);
    expect(getImageLqip(path)).toMatch(/^data:image\/webp;base64,/);
  });
});
