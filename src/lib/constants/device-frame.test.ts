import { describe, expect, it } from "vitest";
import {
  CAPABILITY_BROWSER_ASPECT,
  DEVICE_BADGE_CHIP,
  DEVICE_BLUR_BACKDROP,
  DEVICE_CARD_GRADIENT,
  DEVICE_CAROUSEL_CHEVRON_BUTTON,
  DEVICE_CAROUSEL_OUTSIDE_CHEVRON,
  DEVICE_FOOTER_BAR,
  DEVICE_FRAME_SHELL,
  DEVICE_STAGE_VIGNETTE,
} from "./device-frame";

describe("device frame constants", () => {
  it("exports non-empty device frame class strings", () => {
    expect(DEVICE_CARD_GRADIENT.length).toBeGreaterThan(0);
    expect(DEVICE_FRAME_SHELL.length).toBeGreaterThan(0);
    expect(DEVICE_STAGE_VIGNETTE.length).toBeGreaterThan(0);
    expect(DEVICE_FOOTER_BAR.length).toBeGreaterThan(0);
    expect(DEVICE_BADGE_CHIP.length).toBeGreaterThan(0);
    expect(DEVICE_CAROUSEL_CHEVRON_BUTTON.length).toBeGreaterThan(0);
    expect(DEVICE_CAROUSEL_OUTSIDE_CHEVRON.length).toBeGreaterThan(0);
    expect(CAPABILITY_BROWSER_ASPECT.length).toBeGreaterThan(0);
    expect(DEVICE_BLUR_BACKDROP.length).toBeGreaterThan(0);
  });
});
