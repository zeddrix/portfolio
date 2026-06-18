import imageManifest from "$lib/data/image-manifest.json";
import { resolveStaticAsset } from "$lib/utils/static-asset";

export interface ImageVariant {
  width: number;
  path: string;
}

export interface ImageManifestEntry {
  width: number;
  height: number;
  variants: ImageVariant[];
  lqip: string;
}

export type ImageManifest = Record<string, ImageManifestEntry>;

const manifest = imageManifest as ImageManifest;

const DEFAULT_WIDTH = 920;

/**
 * Normalize a portfolio image path to the manifest logical key.
 */
export function toLogicalImagePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.endsWith(".webp")) {
    return normalized;
  }
  return normalized.replace(/\.(png|jpe?g)$/i, ".webp");
}

export function getImageManifestEntry(
  path: string,
): ImageManifestEntry | undefined {
  return manifest[toLogicalImagePath(path)];
}

export function getSharpenProfileKey(
  filename: string,
): "strong" | "mild" | "none" {
  if (filename.startsWith("answeriq-") || filename.startsWith("chatbot-")) {
    return "strong";
  }
  return "mild";
}

export function pickVariantWidth(
  entry: ImageManifestEntry,
  preferredWidth = DEFAULT_WIDTH,
): ImageVariant {
  const sorted = [...entry.variants].sort((a, b) => a.width - b.width);
  const match =
    sorted.find((variant) => variant.width >= preferredWidth) ??
    sorted[sorted.length - 1];
  return match;
}

export function buildSrcSet(path: string): string | undefined {
  const entry = getImageManifestEntry(path);
  if (!entry) {
    return undefined;
  }
  return entry.variants
    .map((variant) => `${resolveStaticAsset(variant.path)} ${variant.width}w`)
    .join(", ");
}

export function getDefaultImageSrc(
  path: string,
  preferredWidth = DEFAULT_WIDTH,
): string {
  const entry = getImageManifestEntry(path);
  if (!entry) {
    return resolveStaticAsset(toLogicalImagePath(path));
  }
  const variant = pickVariantWidth(entry, preferredWidth);
  return resolveStaticAsset(variant.path);
}

export function getImageDimensions(path: string):
  | {
      width: number;
      height: number;
    }
  | undefined {
  const entry = getImageManifestEntry(path);
  if (!entry) {
    return undefined;
  }
  return { width: entry.width, height: entry.height };
}

export function isPortraitImage(path: string): boolean {
  const dimensions = getImageDimensions(path);
  return dimensions ? dimensions.height > dimensions.width : false;
}

export function getImageLqip(path: string): string | undefined {
  return getImageManifestEntry(path)?.lqip;
}

export function getHighlightPreloadPaths(): string[] {
  return [
    "/usedelight-1-new-tab.webp",
    "/adverio-tools-1-overview.webp",
    "/queue-1-dashboard.webp",
    "/jw-tabs-1-homepage.webp",
  ];
}

export function getHighlightInlineLqipPaths(): string[] {
  return getHighlightPreloadPaths().slice(0, 3);
}

export function getVariantSrc(path: string, width: number): string | undefined {
  const entry = getImageManifestEntry(path);
  if (!entry) {
    return undefined;
  }
  const variant = entry.variants.find((item) => item.width === width);
  if (!variant) {
    return undefined;
  }
  return resolveStaticAsset(variant.path);
}
