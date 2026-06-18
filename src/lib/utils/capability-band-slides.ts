import type {
  CapabilityBandSlide,
  CapabilityBandVisual,
  CapabilitySlideFrame,
} from "$lib/types/portfolio";
import { isPortraitImage } from "$lib/utils/optimized-image";

function inferSlideFrame(src: string): CapabilitySlideFrame {
  return isPortraitImage(src) ? "phone" : "browser";
}

/**
 * Resolves carousel/single media into normalized slides with frame metadata.
 */
export function normalizeBandSlides(
  visual: CapabilityBandVisual,
): CapabilityBandSlide[] {
  if (visual.slides && visual.slides.length > 0) {
    return visual.slides.map((slide) => ({
      src: slide.src,
      frame: slide.frame ?? inferSlideFrame(slide.src),
      domain: slide.domain,
    }));
  }

  const sources =
    visual.images && visual.images.length > 0
      ? visual.images
      : visual.image
        ? [visual.image]
        : [];

  return sources.map((src) => ({
    src,
    frame: inferSlideFrame(src),
  }));
}

export function getBandSlideCount(visual: CapabilityBandVisual): number {
  return normalizeBandSlides(visual).length;
}

export function getBandCarouselSlideCount(
  visual: CapabilityBandVisual,
): number {
  if (visual.imageLayout !== "carousel") {
    return 0;
  }
  return normalizeBandSlides(visual).length;
}
