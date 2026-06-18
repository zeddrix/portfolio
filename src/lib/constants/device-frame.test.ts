import { describe, expect, it } from "vitest";
import {
  DEVICE_BADGE_CHIP,
  DEVICE_CARD_GRADIENT,
  DEVICE_CAROUSEL_CHEVRON_BUTTON,
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
  });
});
