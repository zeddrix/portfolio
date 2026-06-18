#!/usr/bin/env node
import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const sourceDir = join(rootDir, "static", "certificates");
const backupDir = join(rootDir, "static-source");
const staticDir = join(rootDir, "static");

/** @type {Record<string, string>} */
export const certificateSourceMap = {
  "1. JS Certificate.jpg": "certificate-modern-javascript.jpg",
  "2. React Certificate.jpg": "certificate-reactjs-front-to-back.jpg",
  "3. CSS Certificate.jpeg": "certificate-css-complete-guide.jpeg",
  "4. Nodejs Certificate.jpeg": "certificate-nodejs-api-masterclass.jpeg",
  "5. MERN Certificate.jpeg": "certificate-mern-ecommerce.jpeg",
};

/** @typedef {'copy' | 'keep-backup' | 'skip-static' | 'error'} CertificateCopyOutcome */

/**
 * @param {{ sourceExists: boolean; backupExists: boolean; staticVariantExists: boolean }} input
 * @returns {CertificateCopyOutcome}
 */
export function resolveCertificateCopyOutcome({
  sourceExists,
  backupExists,
  staticVariantExists,
}) {
  if (sourceExists) {
    return "copy";
  }
  if (backupExists) {
    return "keep-backup";
  }
  if (staticVariantExists) {
    return "skip-static";
  }
  return "error";
}

/**
 * @param {string} destName
 * @param {string} staticDir
 */
export function buildCertificateStaticVariantPath(destName, staticDir) {
  const baseName = destName.replace(/\.(jpe?g)$/i, "");
  return join(staticDir, `${baseName}-640w.webp`);
}

export async function copyCertificateSources() {
  await mkdir(backupDir, { recursive: true });
  const copied = [];

  for (const [sourceName, destName] of Object.entries(certificateSourceMap)) {
    const sourcePath = join(sourceDir, sourceName);
    const destPath = join(backupDir, destName);

    try {
      const [sourceStats, destStats] = await Promise.all([
        stat(sourcePath),
        stat(destPath).catch(() => null),
      ]);

      if (destStats && destStats.size === sourceStats.size) {
        copied.push(destName);
        continue;
      }

      await copyFile(sourcePath, destPath);
      copied.push(destName);
    } catch (error) {
      const staticVariantPath = buildCertificateStaticVariantPath(
        destName,
        staticDir,
      );
      const [backupStats, staticVariantStats] = await Promise.all([
        stat(destPath).catch(() => null),
        stat(staticVariantPath).catch(() => null),
      ]);
      const outcome = resolveCertificateCopyOutcome({
        sourceExists: false,
        backupExists: backupStats !== null,
        staticVariantExists: staticVariantStats !== null,
      });

      if (outcome === "keep-backup") {
        console.warn(
          `Source missing for ${sourceName}; keeping existing ${destName}`,
        );
        copied.push(destName);
        continue;
      }

      if (outcome === "skip-static") {
        console.warn(
          `Source missing for ${sourceName}; using committed ${relative(rootDir, staticVariantPath)} (add scans to static/certificates/ to re-optimize locally)`,
        );
        continue;
      }

      throw new Error(`Failed to copy ${sourceName} → ${destName}: ${error}`);
    }
  }

  return copied;
}

const isCli =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  copyCertificateSources()
    .then((files) => {
      console.log(
        `Copied ${files.length} certificate sources to static-source/`,
      );
      for (const file of files) {
        console.log(`  ${file}`);
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
