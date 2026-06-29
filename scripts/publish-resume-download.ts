#!/usr/bin/env tsx
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OPTIMIZED_RESUME_PDF_FILE } from "./generate-resume.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const resumeDir = join(rootDir, "resume");
const staticResumeDir = join(rootDir, "static", "resume");

async function main() {
  await mkdir(staticResumeDir, { recursive: true });
  const sourcePath = join(resumeDir, OPTIMIZED_RESUME_PDF_FILE);
  const outputPath = join(staticResumeDir, OPTIMIZED_RESUME_PDF_FILE);
  await copyFile(sourcePath, outputPath);
  console.log(`Published ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
