#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const staticDir = join(rootDir, "static");
const sourcePath = join(staticDir, "me.png");
const outputPath = join(staticDir, "og-default.png");

const WIDTH = 1200;
const HEIGHT = 630;

const BACKGROUND = "#111111";
const ACCENT = "#136ef6";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a1a1aa";

/**
 * @param {string} text
 * @param {number} fontSize
 * @param {string} fill
 * @param {number} y
 * @param {string} fontWeight
 * @returns {string}
 */
function textSvg(text, fontSize, fill, y, fontWeight = "700") {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `<text x="80" y="${y}" fill="${fill}" font-family="Inter, system-ui, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}">${escaped}</text>`;
}

async function main() {
  const photoSize = 220;
  const photoBuffer = await sharp(sourcePath)
    .resize(photoSize, photoSize, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  const photoLeft = WIDTH - photoSize - 80;
  const photoTop = Math.round((HEIGHT - photoSize) / 2);

  const overlaySvg =
    Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BACKGROUND}"/>
  <rect x="0" y="0" width="8" height="${HEIGHT}" fill="${ACCENT}"/>
  ${textSvg("Zeddrix Fabian", 56, TEXT_PRIMARY, 220)}
  ${textSvg("Full-Stack Web App Developer", 34, ACCENT, 280, "600")}
  ${textSvg("SvelteKit · React · Angular", 26, TEXT_SECONDARY, 340, "500")}
  ${textSvg("zeddrix.com", 24, TEXT_SECONDARY, 390, "500")}
  <circle cx="${photoLeft + photoSize / 2}" cy="${photoTop + photoSize / 2}" r="${photoSize / 2 + 4}" fill="none" stroke="${ACCENT}" stroke-width="3"/>
</svg>`);

  const base = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BACKGROUND,
    },
  }).composite([{ input: overlaySvg, top: 0, left: 0 }]);

  const withPhoto = await base
    .composite([
      {
        input: await sharp(photoBuffer)
          .composite([
            {
              input: Buffer.from(
                `<svg width="${photoSize}" height="${photoSize}"><circle cx="${photoSize / 2}" cy="${photoSize / 2}" r="${photoSize / 2}" fill="white"/></svg>`,
              ),
              blend: "dest-in",
            },
          ])
          .png()
          .toBuffer(),
        top: photoTop,
        left: photoLeft,
      },
    ])
    .png()
    .toBuffer();

  await writeFile(outputPath, withPhoto);
  console.log(`Wrote static/og-default.png (${WIDTH}x${HEIGHT})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
