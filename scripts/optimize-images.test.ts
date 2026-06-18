import { describe, expect, it } from "vitest";
import imageManifest from "../src/lib/data/image-manifest.json";
import {
  getImageCropConfig,
  getManatalCanonicalCropSize,
  getOptimizationProfile,
  getSharpenProfile,
  MANATAL_GUTTER_CROP,
  mergeManifestEntry,
  resolveImageCropRect,
} from "./optimize-images.mjs";

describe("optimize-images sharpen profiles", () => {
  it("returns strong profile for AnswerIQ screenshots", () => {
    expect(getSharpenProfile("answeriq-1-landingpage.png")).toBe("strong");
    expect(getSharpenProfile("answeriq-7-admin-users.png")).toBe("strong");
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
    expect(getSharpenProfile("manatal-coop-homepage.png")).toBe("mild");
  });
});

describe("optimize-images optimization profiles", () => {
  it("uses default variants for AnswerIQ screenshots", () => {
    expect(getOptimizationProfile("answeriq-1-landingpage.png")).toEqual({
      variantWidths: [640, 920, 1280],
      quality: 82,
      maxWidth: 1840,
    });
    expect(getOptimizationProfile("answeriq-6-admin-dashboard.png")).toEqual({
      variantWidths: [640, 920, 1280],
      quality: 82,
      maxWidth: 1840,
    });
  });

  it("uses compact variants for chatbot and Manatal UI screenshots", () => {
    expect(getOptimizationProfile("chatbot-start.png")).toEqual({
      variantWidths: [640],
      quality: 72,
      maxWidth: 1024,
    });
    expect(getOptimizationProfile("manatal-coop-homepage.png")).toEqual({
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

describe("optimize-images crop rects", () => {
  it("resolves percentage insets into pixel extract rect", () => {
    const rect = resolveImageCropRect(720, 1520, {
      top: 0.1,
      left: 0.08,
      right: 0.08,
      bottom: 0.2,
    });

    expect(rect).toEqual({
      left: 58,
      top: 152,
      width: 604,
      height: 1064,
    });
  });

  it("applies unified MANATAL_GUTTER_CROP to all Manatal screenshots", () => {
    expect(getImageCropConfig("manatal-coop-homepage.png")).toEqual(
      MANATAL_GUTTER_CROP,
    );
    expect(getImageCropConfig("manatal-coop-signin.png")).toEqual(
      MANATAL_GUTTER_CROP,
    );
    expect(getImageCropConfig("manatal-coop-chatbot.png")).toEqual(
      MANATAL_GUTTER_CROP,
    );
  });

  it("defines canonical Manatal crop size from reference viewport", () => {
    expect(getManatalCanonicalCropSize()).toEqual({
      width: 650,
      height: 1459,
    });
  });

  it("keeps identical manifest dimensions for all Manatal carousel images", () => {
    const homepage = imageManifest["/manatal-coop-homepage.webp"];
    const signin = imageManifest["/manatal-coop-signin.webp"];
    const chatbot = imageManifest["/manatal-coop-chatbot.webp"];

    expect(homepage?.width).toBe(signin?.width);
    expect(homepage?.height).toBe(signin?.height);
    expect(homepage?.width).toBe(chatbot?.width);
    expect(homepage?.height).toBe(chatbot?.height);
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
