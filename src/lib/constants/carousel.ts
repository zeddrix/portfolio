import { getImageDimensions } from "$lib/utils/optimized-image";

export const CAROUSEL_BROWSER_CHROME_PX = 44;
export const CAROUSEL_IMAGE_ASPECT_WIDTH = 16;
export const CAROUSEL_IMAGE_ASPECT_HEIGHT = 10;
export const CAROUSEL_MAX_CARD_WIDTH_PX = 920;

export function getCarouselPreviewHeight(cardWidthPx: number) {
  const imageHeight =
    (cardWidthPx * CAROUSEL_IMAGE_ASPECT_HEIGHT) / CAROUSEL_IMAGE_ASPECT_WIDTH;
  return CAROUSEL_BROWSER_CHROME_PX + imageHeight;
}

export const CAROUSEL_PREVIEW_HEIGHT_CSS =
  "calc(2.75rem + min(88vw, 920px) * 10 / 16)";

export const MANATAL_PHONE_FRAME_WIDTH_CSS = "min(42vw, 280px)";

export const MANATAL_PHONE_FRAME_MAX_WIDTH_MOBILE_CSS = "min(56vw, 300px)";

export const MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS =
  "calc(min(88vw, 920px) * 10 / 16)";

const MANATAL_REFERENCE_IMAGE_PATH = "/manatal-coop-homepage.webp";

export type ManatalPhoneScreenLayout = "mobile" | "desktop";

export function getManatalPhoneScreenAspectCss(): string {
  const dimensions = getImageDimensions(MANATAL_REFERENCE_IMAGE_PATH);
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
    return "650 / 1459";
  }
  return `${dimensions.width} / ${dimensions.height}`;
}

export const MANATAL_PHONE_SCREEN_ASPECT_CSS = getManatalPhoneScreenAspectCss();

export function getManatalPhoneScreenWidthCss(
  layout: ManatalPhoneScreenLayout = "desktop",
): string {
  if (layout === "mobile") {
    return "min(100%, 300px)";
  }

  const dimensions = getImageDimensions(MANATAL_REFERENCE_IMAGE_PATH);
  const width = dimensions?.width ?? 650;
  const height = dimensions?.height ?? 1459;
  return `min(${MANATAL_PHONE_FRAME_WIDTH_CSS}, calc(${MANATAL_PHONE_SCREEN_MAX_HEIGHT_CSS} * ${width} / ${height}))`;
}

export interface ManatalCarouselSlideMeta {
  objectPosition: string;
}

export const MANATAL_CAROUSEL_SLIDE_META: Record<
  string,
  ManatalCarouselSlideMeta
> = {
  "/manatal-coop-homepage.webp": { objectPosition: "50% 0%" },
  "/manatal-coop-signin.webp": { objectPosition: "50% 0%" },
  "/manatal-coop-chatbot.webp": { objectPosition: "50% 0%" },
};

export function getManatalCarouselSlideMeta(
  imagePath: string,
): ManatalCarouselSlideMeta {
  return MANATAL_CAROUSEL_SLIDE_META[imagePath] ?? { objectPosition: "50% 0%" };
}
