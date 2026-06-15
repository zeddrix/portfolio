#!/usr/bin/env node
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const fontsDir = join(rootDir, "static/fonts");
const sourceDir = join(rootDir, "node_modules/@fontsource/inter/files");

const weights = [400, 500, 600, 700, 800];

async function main() {
  await mkdir(fontsDir, { recursive: true });
  for (const weight of weights) {
    const file = `inter-latin-${weight}-normal.woff2`;
    await copyFile(join(sourceDir, file), join(fontsDir, file));
  }
  console.log(
    `Copied ${weights.length} Inter latin WOFF2 files to static/fonts`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
