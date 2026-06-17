import { describe, expect, it } from "vitest";
import {
  buildCertificatePublicUrl,
  certificates,
} from "../src/lib/data/certificates";
import { workExperience } from "../src/lib/data/experience";
import {
  caseStudyProjectSlugs,
  highlightProjectSlugs,
} from "../src/lib/data/portfolio";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";

describe("export-portfolio-snapshot output", () => {
  it("includes experience, certificates, and project slugs aligned with portfolio data", () => {
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.experience).toEqual(workExperience);
    expect(snapshot.certificates).toHaveLength(certificates.length);

    for (const certificate of certificates) {
      const exported = snapshot.certificates.find(
        (item) => item.slug === certificate.slug,
      );
      expect(exported?.verifyUrl).toBe(
        buildCertificatePublicUrl(certificate.slug),
      );
    }

    expect(snapshot.caseStudySlugs).toEqual([...caseStudyProjectSlugs]);
    expect(snapshot.highlightProjects.map((project) => project.slug)).toEqual([
      ...highlightProjectSlugs,
    ]);
    expect(snapshot.moreProjects.length).toBeGreaterThan(0);
  });
});
