import { describe, expect, it } from "vitest";
import {
  buildCertificatePublicUrl,
  certificates,
} from "../src/lib/data/certificates";
import { workExperience } from "../src/lib/data/experience";
import { sortedResumeEngagements } from "../src/lib/data/resume-engagements";
import { highlightProjectSlugs } from "../src/lib/data/portfolio";
import {
  buildPortfolioSnapshot,
  resumeMoreProjectSlugs,
  resumeSelectedProjectSlugs,
} from "./export-portfolio-snapshot";

describe("export-portfolio-snapshot output", () => {
  it("includes experience, certificates, and project slugs aligned with portfolio data", () => {
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.experience).toEqual(workExperience);
    expect(snapshot.experience).toHaveLength(sortedResumeEngagements.length);
    expect(snapshot.certificates).toHaveLength(certificates.length);

    for (const certificate of certificates) {
      const exported = snapshot.certificates.find(
        (item) => item.slug === certificate.slug,
      );
      expect(exported?.verifyUrl).toBe(
        buildCertificatePublicUrl(certificate.slug),
      );
    }

    expect(snapshot.resumeSelectedProjectSlugs).toEqual([
      ...resumeSelectedProjectSlugs,
    ]);
    expect(snapshot.resumeMoreProjectSlugs).toEqual([
      ...resumeMoreProjectSlugs,
    ]);
    expect(snapshot.selectedProjects.map((project) => project.slug)).toEqual([
      ...resumeSelectedProjectSlugs,
    ]);
    expect(snapshot.moreProjects.map((project) => project.slug)).toEqual([
      ...resumeMoreProjectSlugs,
    ]);
    expect(snapshot.highlightProjects.map((project) => project.slug)).toEqual([
      ...highlightProjectSlugs,
    ]);
    for (const project of [
      ...snapshot.selectedProjects,
      ...snapshot.moreProjects,
    ]) {
      expect(project.resumeContext).toBeDefined();
      expect(project.displayPeriod).toBeTruthy();
      expect(project.category).toMatch(/^(client|personal)$/);
    }
    expect(
      snapshot.moreProjects.find((project) => project.slug === "manatal-coop")
        ?.resumeContext,
    ).toEqual({
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "Manatal Cooperative",
    });
  });
});
