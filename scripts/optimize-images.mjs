#!/usr/bin/env node
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const staticDir = join(rootDir, "static");
const sourceBackupDir = join(rootDir, "static-source");
const manifestPath = join(rootDir, "src/lib/data/image-manifest.json");

const MAX_WIDTH = 1840;
const DEFAULT_VARIANT_WIDTHS = [640, 920, 1280];
const SKIP_FILES = new Set([
  "me.png",
  "favicon.ico",
  "favicon-16.png",
  "favicon-32.png",
  "apple-touch-icon.png",
  ".nojekyll",
]);
const DELETE_ORPHANS = ["pwa-jwtabs-desktop.png"];
const COMPACT_PREFIXES = ["answeriq-", "chatbot-", "manatal-coop-"];
const CERTIFICATE_PREFIX = "certificate-";

/** @typedef {'strong' | 'mild' | 'none'} SharpenProfile */
/** @typedef {{ variantWidths: number[]; quality: number; maxWidth: number }} OptimizationProfile */

/** @type {Record<string, SharpenProfile>} */
const SHARPEN_PREFIXES = {
  "answeriq-": "strong",
  "chatbot-": "strong",
  [CERTIFICATE_PREFIX]: "strong",
};

/**
 * @param {string} filename
 * @returns {SharpenProfile}
 */
export function getSharpenProfile(filename) {
  for (const [prefix, profile] of Object.entries(SHARPEN_PREFIXES)) {
    if (filename.startsWith(prefix)) {
      return profile;
    }
  }
  return "mild";
}

/**
 * @param {string} filename
 * @returns {OptimizationProfile}
 */
export function getOptimizationProfile(filename) {
  if (filename.startsWith(CERTIFICATE_PREFIX)) {
    return { variantWidths: [640, 920], quality: 78, maxWidth: 1200 };
  }
  if (COMPACT_PREFIXES.some((prefix) => filename.startsWith(prefix))) {
    return { variantWidths: [640], quality: 72, maxWidth: 1024 };
  }
  return {
    variantWidths: DEFAULT_VARIANT_WIDTHS,
    quality: 82,
    maxWidth: MAX_WIDTH,
  };
}

/**
 * @param {sharp.Sharp} pipeline
 * @param {SharpenProfile} profile
 */
function applySharpen(pipeline, profile) {
  if (profile === "strong") {
    return pipeline.sharpen({
      sigma: 1.2,
      m1: 1.0,
      m2: 0.7,
      x1: 2,
      y2: 10,
      y3: 20,
    });
  }
  if (profile === "mild") {
    return pipeline.sharpen({ sigma: 0.6, m1: 0.5, m2: 0.3 });
  }
  return pipeline;
}

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {number} width
 * @param {SharpenProfile} sharpenProfile
 * @param {number} quality
 */
async function writeWebPVariant(
  inputPath,
  outputPath,
  width,
  sharpenProfile,
  quality,
) {
  let pipeline = sharp(inputPath).rotate().resize({
    width,
    withoutEnlargement: true,
    fit: "inside",
  });
  pipeline = applySharpen(pipeline, sharpenProfile);
  await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);
}

/**
 * @param {string} inputPath
 * @param {SharpenProfile} sharpenProfile
 * @returns {Promise<string>}
 */
async function generateLqip(inputPath, sharpenProfile) {
  let pipeline = sharp(inputPath)
    .rotate()
    .resize({ width: 32, withoutEnlargement: true })
    .blur(1.2);
  pipeline = applySharpen(pipeline, sharpenProfile);
  const buffer = await pipeline.webp({ quality: 35, effort: 4 }).toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

/**
 * @param {string} filename
 */
async function backupSource(filename) {
  await mkdir(sourceBackupDir, { recursive: true });
  const source = join(staticDir, filename);
  const dest = join(sourceBackupDir, filename);
  const data = await readFile(source);
  await writeFile(dest, data);
}

/**
 * @param {string} filename
 * @param {string} inputPath
 */
async function removeExistingVariants(filename) {
  const baseName = basename(filename, extname(filename));
  const entries = await readdir(staticDir);
  for (const entry of entries) {
    if (entry.startsWith(`${baseName}-`) && entry.endsWith("w.webp")) {
      await rm(join(staticDir, entry));
    }
  }
}

/**
 * @param {string} filename
 * @param {string} inputPath
 */
async function optimizeImageFromPath(filename, inputPath) {
  const meta = await sharp(inputPath).metadata();
  const sourceWidth = meta.width ?? 0;
  const sourceHeight = meta.height ?? 0;
  if (sourceWidth === 0 || sourceHeight === 0) {
    throw new Error(`Could not read dimensions for ${filename}`);
  }

  const optimizationProfile = getOptimizationProfile(filename);
  const sharpenProfile = getSharpenProfile(filename);
  const baseName = basename(filename, extname(filename));
  const logicalPath = `/${baseName}.webp`;

  const cappedWidth = Math.min(sourceWidth, optimizationProfile.maxWidth);
  const widthsToEmit = optimizationProfile.variantWidths.filter(
    (width) => width <= cappedWidth,
  );
  if (widthsToEmit.length === 0) {
    widthsToEmit.push(cappedWidth);
  }

  const uniqueWidths = [...new Set(widthsToEmit)].sort((a, b) => a - b);
  /** @type {{ width: number; path: string }[]} */
  const variants = [];

  await removeExistingVariants(filename);

  for (const width of uniqueWidths) {
    const variantFilename = `${baseName}-${width}w.webp`;
    const variantPath = join(staticDir, variantFilename);
    await writeWebPVariant(
      inputPath,
      variantPath,
      width,
      sharpenProfile,
      optimizationProfile.quality,
    );
    variants.push({ width, path: `/${variantFilename}` });
  }

  const lqip = await generateLqip(inputPath, sharpenProfile);
  const aspectHeight = Math.round((sourceHeight / sourceWidth) * cappedWidth);

  return {
    logicalPath,
    width: cappedWidth,
    height: aspectHeight,
    variants,
    lqip,
  };
}

async function optimizeImage(filename) {
  const inputPath = join(staticDir, filename);
  const result = await optimizeImageFromPath(filename, inputPath);
  await backupSource(filename);
  await rm(inputPath);
  return result;
}

async function optimizeMePng() {
  const filename = "me.png";
  const inputPath = join(staticDir, filename);
  const tempPath = join(staticDir, "me-optimized.png");
  await sharp(inputPath)
    .rotate()
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 85 })
    .toFile(tempPath);
  await backupSource(filename);
  await rm(inputPath);
  const data = await readFile(tempPath);
  await writeFile(join(staticDir, filename), data);
  await rm(tempPath);
}

/**
 * @param {string | undefined} prefixFilter
 */
async function reoptimizeFromBackup(prefixFilter) {
  const backupEntries = await readdir(sourceBackupDir);
  const targets = backupEntries.filter((entry) => {
    const ext = extname(entry).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      return false;
    }
    if (prefixFilter && !entry.startsWith(prefixFilter)) {
      return false;
    }
    return true;
  });

  if (targets.length === 0) {
    console.log("No backup sources matched for re-optimization.");
    return null;
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  for (const filename of targets) {
    console.log(`Re-optimizing ${filename} from static-source...`);
    const inputPath = join(sourceBackupDir, filename);
    const result = await optimizeImageFromPath(filename, inputPath);
    manifest[result.logicalPath] = {
      width: result.width,
      height: result.height,
      variants: result.variants,
      lqip: result.lqip,
    };
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Updated manifest for ${targets.length} re-optimized images.`);
  return manifest;
}

/**
 * @param {Record<string, unknown>} existing
 * @param {string} logicalPath
 * @param {{ width: number; height: number; variants: { width: number; path: string }[]; lqip: string }} entry
 */
export function mergeManifestEntry(existing, logicalPath, entry) {
  return {
    ...existing,
    [logicalPath]: entry,
  };
}

async function main() {
  const prefixArg = process.argv.find((arg) => arg.startsWith("--prefix="));
  const prefixFilter = prefixArg?.split("=")[1];

  if (prefixFilter) {
    await reoptimizeFromBackup(prefixFilter);
    return;
  }

  const entries = await readdir(staticDir);
  const imageFiles = entries.filter((entry) => {
    const ext = extname(entry).toLowerCase();
    return (
      [".png", ".jpg", ".jpeg"].includes(ext) &&
      !SKIP_FILES.has(entry) &&
      !/-\d+w\.webp$/i.test(entry)
    );
  });

  if (imageFiles.length === 0) {
    console.log("No source images to optimize; keeping existing manifest.");
    return;
  }

  /** @type {Record<string, { width: number; height: number; variants: { width: number; path: string }[]; lqip: string }>} */
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    manifest = {};
  }

  for (const filename of imageFiles) {
    console.log(`Optimizing ${filename}...`);
    const result = await optimizeImage(filename);
    manifest = mergeManifestEntry(manifest, result.logicalPath, {
      width: result.width,
      height: result.height,
      variants: result.variants,
      lqip: result.lqip,
    });
  }

  for (const orphan of DELETE_ORPHANS) {
    const orphanPath = join(staticDir, orphan);
    try {
      await backupSource(orphan);
      await rm(orphanPath);
      console.log(`Removed orphan ${orphan}`);
    } catch {
      // already removed
    }
  }

  if (entries.includes("me.png")) {
    console.log("Optimizing me.png...");
    await optimizeMePng();
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Wrote manifest with ${Object.keys(manifest).length} images (${imageFiles.length} newly optimized).`,
  );
}

const isCli =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
