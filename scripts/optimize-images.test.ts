import { describe, expect, it } from "vitest";
import {
  getOptimizationProfile,
  getSharpenProfile,
  mergeManifestEntry,
} from "./optimize-images.mjs";

describe("optimize-images sharpen profiles", () => {
  it("returns strong profile for AnswerIQ screenshots", () => {
    expect(getSharpenProfile("answeriq-1-dashboard.png")).toBe("strong");
    expect(getSharpenProfile("answeriq-6-admin-users.png")).toBe("strong");
  });

  it("returns strong profile for chatbot screenshots", () => {
    expect(getSharpenProfile("chatbot-start.png")).toBe("strong");
  });

  it("returns strong profile for certificate scans", () => {
    expect(getSharpenProfile("certificate-mern-ecommerce.jpeg")).toBe("strong");
  });

  it("returns mild profile for other screenshots", () => {
    expect(getSharpenProfile("usedelight-1-new-tab.png")).toBe("mild");
    expect(getSharpenProfile("queue-1-dashboard.png")).toBe("mild");
  });
});

describe("optimize-images optimization profiles", () => {
  it("uses compact variants for AnswerIQ and chatbot UI screenshots", () => {
    expect(getOptimizationProfile("answeriq-1-dashboard.png")).toEqual({
      variantWidths: [640],
      quality: 72,
      maxWidth: 1024,
    });
    expect(getOptimizationProfile("chatbot-start.png")).toEqual({
      variantWidths: [640],
      quality: 72,
      maxWidth: 1024,
    });
  });

  it("uses default variants for large portfolio screenshots", () => {
    expect(getOptimizationProfile("usedelight-1-new-tab.png")).toEqual({
      variantWidths: [640, 920, 1280],
      quality: 82,
      maxWidth: 1840,
    });
  });

  it("uses certificate variants for certificate scans", () => {
    expect(getOptimizationProfile("certificate-mern-ecommerce.jpeg")).toEqual({
      variantWidths: [640, 920],
      quality: 78,
      maxWidth: 1200,
    });
  });
});

describe("optimize-images manifest merge", () => {
  it("preserves existing manifest entries when adding new images", () => {
    const existing = {
      "/queue-1-dashboard.webp": {
        width: 1840,
        height: 1150,
        variants: [{ width: 920, path: "/queue-1-dashboard-920w.webp" }],
        lqip: "data:image/webp;base64,abc",
      },
    };

    const merged = mergeManifestEntry(
      existing,
      "/certificate-mern-ecommerce.webp",
      {
        width: 1200,
        height: 900,
        variants: [
          { width: 920, path: "/certificate-mern-ecommerce-920w.webp" },
        ],
        lqip: "data:image/webp;base64,def",
      },
    );

    expect(Object.keys(merged)).toHaveLength(2);
    expect(merged["/queue-1-dashboard.webp"]).toEqual(
      existing["/queue-1-dashboard.webp"],
    );
    expect(merged["/certificate-mern-ecommerce.webp"]?.width).toBe(1200);
  });
});
