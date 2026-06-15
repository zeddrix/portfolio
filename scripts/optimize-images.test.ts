import { describe, expect, it } from "vitest";
import {
  getOptimizationProfile,
  getSharpenProfile,
} from "../../scripts/optimize-images.mjs";

describe("optimize-images sharpen profiles", () => {
  it("returns strong profile for AnswerIQ screenshots", () => {
    expect(getSharpenProfile("answeriq-1-dashboard.png")).toBe("strong");
    expect(getSharpenProfile("answeriq-6-admin-users.png")).toBe("strong");
  });

  it("returns strong profile for chatbot screenshots", () => {
    expect(getSharpenProfile("chatbot-start.png")).toBe("strong");
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
});
