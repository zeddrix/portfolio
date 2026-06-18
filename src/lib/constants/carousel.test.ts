import { describe, expect, it } from "vitest";
import {
  CAROUSEL_BROWSER_CHROME_PX,
  CAROUSEL_MAX_CARD_WIDTH_PX,
  CAROUSEL_PREVIEW_HEIGHT_CSS,
  getManatalPhoneScreenAspectCss,
  getManatalPhoneScreenWidthCss,
  getCarouselPreviewHeight,
  MANATAL_PHONE_FRAME_WIDTH_CSS,
  MANATAL_PHONE_SCREEN_ASPECT_CSS,
  MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS,
} from "./carousel";

describe("carousel preview height", () => {
  it("computes browser card preview height from chrome plus 16:10 image area", () => {
    expect(getCarouselPreviewHeight(920)).toBe(619);
    expect(CAROUSEL_PREVIEW_HEIGHT_CSS).toContain("2.75rem");
    expect(CAROUSEL_BROWSER_CHROME_PX).toBe(44);
    expect(CAROUSEL_MAX_CARD_WIDTH_PX).toBe(920);
  });

  it("uses fixed Manatal phone frame width, capped screen height, and cropped aspect from manifest", () => {
    expect(MANATAL_PHONE_FRAME_WIDTH_CSS).toBe("min(42vw, 280px)");
    expect(MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS).toBe(
      "calc(min(88vw, 920px) * 10 / 16)",
    );
    expect(getManatalPhoneScreenAspectCss()).toMatch(/^\d+ \/ \d+$/);
    expect(MANATAL_PHONE_SCREEN_ASPECT_CSS).toBe(
      getManatalPhoneScreenAspectCss(),
    );
    expect(getManatalPhoneScreenWidthCss()).toContain(
      MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS,
    );
  });
});
