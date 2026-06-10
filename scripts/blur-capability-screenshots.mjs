import { existsSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { imageBlurConfigs } from "./blur-regions.mjs";

const staticDir = join(dirname(fileURLToPath(import.meta.url)), "..", "static");
const blurSigma = 18;

/**
 * @param {Buffer} buffer
 * @param {{ x: number, y: number, width: number, height: number, solidFill?: { r: number, g: number, b: number, alpha?: number } }} region
 */
async function applyRegion(buffer, region) {
  const metadata = await sharp(buffer).metadata();
  const imageWidth = metadata.width ?? 0;
  const imageHeight = metadata.height ?? 0;

  const left = Math.max(0, Math.min(region.x, imageWidth - 1));
  const top = Math.max(0, Math.min(region.y, imageHeight - 1));
  const width = Math.min(region.width, imageWidth - left);
  const height = Math.min(region.height, imageHeight - top);

  if (width <= 0 || height <= 0) {
    return buffer;
  }

  let overlay;

  if (region.solidFill) {
    overlay = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: {
          r: region.solidFill.r,
          g: region.solidFill.g,
          b: region.solidFill.b,
          alpha: region.solidFill.alpha ?? 1,
        },
      },
    })
      .png()
      .toBuffer();
  } else {
    overlay = await sharp(buffer)
      .extract({ left, top, width, height })
      .blur(blurSigma)
      .resize(width, height, { fit: "fill" })
      .png()
      .toBuffer();
  }

  return sharp(buffer)
    .composite([{ input: overlay, left, top }])
    .png()
    .toBuffer();
}

/**
 * @param {string} filePath
 * @param {import('./blur-regions.mjs').ImageBlurConfig} config
 */
async function processImage(filePath, config) {
  let buffer = await sharp(filePath).png().toBuffer();
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (config.cropTop && config.cropTop > 0 && height > config.cropTop) {
    buffer = await sharp(buffer)
      .extract({
        left: 0,
        top: config.cropTop,
        width,
        height: height - config.cropTop,
      })
      .png()
      .toBuffer();
  }

  if (config.regions && config.regions.length > 0) {
    for (const region of config.regions) {
      buffer = await applyRegion(buffer, region);
    }
  }

  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, buffer);
  renameSync(tempPath, filePath);
}

async function main() {
  const requestedFiles = process.argv.slice(2);
  const configs =
    requestedFiles.length > 0
      ? imageBlurConfigs.filter((config) =>
          requestedFiles.includes(config.file),
        )
      : imageBlurConfigs;

  if (requestedFiles.length > 0 && configs.length === 0) {
    console.error("No matching blur configs for:", requestedFiles.join(", "));
    process.exit(1);
  }

  for (const config of configs) {
    const filePath = join(staticDir, config.file);

    if (!existsSync(filePath)) {
      console.warn(`Skipping missing file: ${config.file}`);
      continue;
    }

    console.log(`Processing ${config.file}...`);
    await processImage(filePath, config);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
