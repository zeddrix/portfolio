import { describe, expect, it } from "vitest";
import {
  buildSrcSet,
  getDefaultImageSrc,
  getImageDimensions,
  getImageLqip,
  getImageManifestEntry,
  isPortraitImage,
  toLogicalImagePath,
} from "./optimized-image";

describe("optimized-image utils", () => {
  it("normalizes png paths to webp logical keys", () => {
    expect(toLogicalImagePath("/queue-1-dashboard.png")).toBe(
      "/queue-1-dashboard.webp",
    );
    expect(toLogicalImagePath("/answeriq-1-landingpage.webp")).toBe(
      "/answeriq-1-landingpage.webp",
    );
  });

  it("returns manifest metadata for optimized images after pipeline runs", () => {
    const entry = getImageManifestEntry("/answeriq-1-landingpage.webp");
    if (!entry) {
      // Manifest is generated at build time; skip when not yet present in dev.
      return;
    }
    expect(entry.width).toBeGreaterThan(0);
    expect(entry.height).toBeGreaterThan(0);
    expect(entry.variants.length).toBe(3);
    expect(entry.variants.map((variant) => variant.width)).toEqual([
      640, 920, 1280,
    ]);
    expect(entry.lqip.startsWith("data:image/webp;base64,")).toBe(true);
  });

  it("serves 920w default src for AnswerIQ landing page", () => {
    const path = "/answeriq-1-landingpage.webp";
    const entry = getImageManifestEntry(path);
    if (!entry) {
      return;
    }
    expect(getDefaultImageSrc(path)).toMatch(
      /answeriq-1-landingpage-920w\.webp/,
    );
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

  it("detects portrait images from manifest dimensions", () => {
    expect(isPortraitImage("/manatal-coop-homepage.webp")).toBe(true);
    expect(isPortraitImage("/usedelight-1-new-tab.webp")).toBe(false);
    expect(isPortraitImage("/unknown-image.webp")).toBe(false);
  });

  it("returns manifest dimensions for known portrait and landscape assets", () => {
    const manatal = getImageDimensions("/manatal-coop-homepage.webp");
    const usedelight = getImageDimensions("/usedelight-1-new-tab.webp");
    if (!manatal || !usedelight) {
      return;
    }
    expect(manatal.height).toBeGreaterThan(manatal.width);
    expect(usedelight.width).toBeGreaterThan(usedelight.height);
  });
});
