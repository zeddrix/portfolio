import { describe, expect, it } from "vitest";
import { certificates } from "../src/lib/data/certificates";
import { certificateSourceMap } from "./copy-certificate-sources.mjs";

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
