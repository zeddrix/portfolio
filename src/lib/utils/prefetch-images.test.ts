import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MockImage = vi.fn(function MockImage(this: {
  decoding: string;
  src: string;
}) {
  this.decoding = "";
  this.src = "";
});

describe("prefetch-images", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { requestIdleCallback: undefined });
    vi.stubGlobal("Image", MockImage);
    MockImage.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("dedupes prefetch requests for the same URL", async () => {
    const { prefetchImageUrl } = await import("./prefetch-images");

    prefetchImageUrl("/portfolio/dedupe-a.webp");
    prefetchImageUrl("/portfolio/dedupe-a.webp");

    expect(MockImage).toHaveBeenCalledTimes(1);
  });

  it("prefetches multiple unique URLs", async () => {
    const { prefetchImageUrls } = await import("./prefetch-images");

    prefetchImageUrls(["/portfolio/multi-b.webp", "/portfolio/multi-c.webp"]);

    expect(MockImage).toHaveBeenCalledTimes(2);
  });

  it("schedules idle prefetch when requestIdleCallback exists", async () => {
    const idleSpy = vi.fn((callback: () => void) => {
      callback();
      return 1;
    });
    vi.stubGlobal("window", { requestIdleCallback: idleSpy });

    const { scheduleIdlePrefetch } = await import("./prefetch-images");

    scheduleIdlePrefetch(["/portfolio/idle-d.webp"]);

    expect(idleSpy).toHaveBeenCalledTimes(1);
    expect(MockImage).toHaveBeenCalledTimes(1);
  });
});
