import { describe, expect, it } from "vitest";
import { certificates } from "../src/lib/data/certificates";
import {
  buildCertificateStaticVariantPath,
  certificateSourceMap,
  resolveCertificateCopyOutcome,
} from "./copy-certificate-sources.mjs";

describe("resolveCertificateCopyOutcome", () => {
  it("copies when the source file exists", () => {
    expect(
      resolveCertificateCopyOutcome({
        sourceExists: true,
        backupExists: false,
        staticVariantExists: false,
      }),
    ).toBe("copy");
  });

  it("keeps the backup when the source is missing but backup exists", () => {
    expect(
      resolveCertificateCopyOutcome({
        sourceExists: false,
        backupExists: true,
        staticVariantExists: false,
      }),
    ).toBe("keep-backup");
  });

  it("skips when source and backup are missing but committed static variant exists", () => {
    expect(
      resolveCertificateCopyOutcome({
        sourceExists: false,
        backupExists: false,
        staticVariantExists: true,
      }),
    ).toBe("skip-static");
  });

  it("errors when source, backup, and committed static variant are all missing", () => {
    expect(
      resolveCertificateCopyOutcome({
        sourceExists: false,
        backupExists: false,
        staticVariantExists: false,
      }),
    ).toBe("error");
  });
});

describe("buildCertificateStaticVariantPath", () => {
  it("maps backup filenames to committed 640w webp paths", () => {
    expect(
      buildCertificateStaticVariantPath(
        "certificate-modern-javascript.jpg",
        "/repo/static",
      ),
    ).toBe("/repo/static/certificate-modern-javascript-640w.webp");
    expect(
      buildCertificateStaticVariantPath(
        "certificate-mern-ecommerce.jpeg",
        "/repo/static",
      ),
    ).toBe("/repo/static/certificate-mern-ecommerce-640w.webp");
  });
});

describe("certificateSourceMap", () => {
  it("maps every certificate slug to a certificate- prefixed backup filename", () => {
    const destNames = Object.values(certificateSourceMap);

    expect(destNames).toHaveLength(certificates.length);

    for (const certificate of certificates) {
      const baseName = certificate.imagePath
        .replace(/^\/certificate-/, "")
        .replace(/\.webp$/, "");
      const match = destNames.find((name) => name.includes(baseName));
      expect(match, certificate.slug).toBeTruthy();
    }
  });
});
