#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const staticDir = join(rootDir, "static");
const sourcePath = join(staticDir, "me.png");

const SIZES = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
];

/**
 * @param {number} size
 * @returns {Promise<Buffer>}
 */
async function resizeMePng(size) {
  return sharp(sourcePath)
    .resize(size, size, {
      fit: "cover",
      position: "centre",
    })
    .png()
    .toBuffer();
}

async function main() {
  const pngBuffers = [];

  for (const { name, size } of SIZES) {
    const buffer = await resizeMePng(size);
    await writeFile(join(staticDir, name), buffer);
    console.log(`Wrote static/${name} (${size}x${size})`);

    if (size === 16 || size === 32) {
      pngBuffers.push(buffer);
    }
  }

  const icoBuffer = await toIco(pngBuffers);
  await writeFile(join(staticDir, "favicon.ico"), icoBuffer);
  console.log("Wrote static/favicon.ico");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
