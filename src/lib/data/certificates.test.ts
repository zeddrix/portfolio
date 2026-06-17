import { describe, expect, it } from "vitest";
import {
  buildCertificatePath,
  buildCertificatePublicUrl,
  certificates,
  formatCertificateDate,
  getCertificateBySlug,
} from "$lib/data/certificates";

describe("certificates data", () => {
  it("contains five unique Udemy certificates", () => {
    expect(certificates).toHaveLength(5);
    const slugs = certificates.map((certificate) => certificate.slug);
    expect(new Set(slugs).size).toBe(5);
    expect(
      certificates.every((certificate) => certificate.issuer === "Udemy"),
    ).toBe(true);
  });

  it("uses optimized webp image paths", () => {
    for (const certificate of certificates) {
      expect(certificate.imagePath).toMatch(/^\/certificate-.+\.webp$/);
    }
  });

  it("formats certificate dates consistently", () => {
    expect(formatCertificateDate("2021-04-06")).toBe("Apr 2021");
  });

  it("resolves certificates by slug", () => {
    const certificate = getCertificateBySlug("mern-ecommerce-from-scratch");
    expect(certificate?.title).toContain("MERN eCommerce");
  });

  it("builds stable public certificate URLs", () => {
    expect(buildCertificatePath("reactjs-front-to-back")).toBe(
      "/certificates/reactjs-front-to-back",
    );
    expect(buildCertificatePublicUrl("reactjs-front-to-back")).toBe(
      "https://zeddrix.github.io/portfolio/certificates/reactjs-front-to-back",
    );
  });
});
