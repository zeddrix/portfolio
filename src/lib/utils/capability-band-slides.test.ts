import { describe, expect, it } from "vitest";
import { capabilityBands } from "$lib/data/portfolio";
import {
  getBandCarouselSlideCount,
  normalizeBandSlides,
} from "$lib/utils/capability-band-slides";

describe("normalizeBandSlides", () => {
  it("returns explicit slide metadata for billing band", () => {
    const billing = capabilityBands.find((band) => band.id === "billing");
    expect(billing).toBeDefined();

    const slides = normalizeBandSlides(billing!.visual);
    expect(slides).toHaveLength(2);
    expect(slides[0]).toMatchObject({
      src: "/lemonsqueezy-dashboard.webp",
      frame: "browser",
      domain: "lemonsqueezy.com",
    });
    expect(slides[1]).toMatchObject({
      src: "/merns-shop-4-checkout.webp",
      frame: "browser",
      domain: "merns-shop.onrender.com",
    });
  });

  it("returns phone then browser frames for chatbot band", () => {
    const chatbot = capabilityBands.find((band) => band.id === "chatbot");
    expect(chatbot).toBeDefined();

    const slides = normalizeBandSlides(chatbot!.visual);
    expect(slides[0]?.frame).toBe("phone");
    expect(slides[0]?.domain).toBe("queue.place");
    expect(slides[1]?.frame).toBe("browser");
  });

  it("returns browser frames for deployment carousel", () => {
    const deployment = capabilityBands.find((band) => band.id === "deployment");
    expect(deployment).toBeDefined();

    const slides = normalizeBandSlides(deployment!.visual);
    expect(slides).toHaveLength(4);
    expect(slides.every((slide) => slide.frame === "browser")).toBe(true);
  });

  it("infers frames from legacy images array when slides are absent", () => {
    const slides = normalizeBandSlides({
      type: "screenshot",
      images: ["/pwa-queue-desktop.webp", "/pwa-queue-mobile.webp"],
      imageLayout: "split",
    });
    expect(slides).toHaveLength(2);
    expect(slides[0]?.frame).toBe("browser");
  });
});

describe("getBandCarouselSlideCount", () => {
  it("returns slide count only for carousel layouts", () => {
    const billing = capabilityBands.find((band) => band.id === "billing");
    expect(getBandCarouselSlideCount(billing!.visual)).toBe(2);

    const docker = capabilityBands.find((band) => band.id === "docker");
    expect(getBandCarouselSlideCount(docker!.visual)).toBe(0);
  });
});
