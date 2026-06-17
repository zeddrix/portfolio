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
    for (const project of [
      ...snapshot.highlightProjects,
      ...snapshot.moreProjects,
    ]) {
      expect(project.resumeContext).toBeDefined();
    }
    expect(snapshot.moreProjects.map((project) => project.slug)).toEqual([
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
    expect(snapshot.moreProjects[0]?.resumeContext).toEqual({
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "Manatal Cooperative",
    });
  });
});
