import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import {
  buildAdditionalProjectsBlocks,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  partitionProjects,
  partitionResumeProjectsByCategory,
  splitExperienceForApplicationResume,
} from "./resume-content";

describe("resume-content builders", () => {
  const snapshot = buildPortfolioSnapshot() as never;

  it("returns twelve experience blocks in plan order with Queue first", () => {
    const experience = buildEngagementExperienceBlocks(snapshot);

    expect(experience).toHaveLength(12);
    expect(experience[0]?.title).toContain("Queue");
    expect(experience[0]?.id).toBe("independent-queue");
  });

  it("returns selected project slugs Adverio, UseDelight, MERN Shop", () => {
    const selected = buildSelectedProjectsBlocks(snapshot);

    expect(selected.map((project) => project.slug)).toEqual([
      "adverio-tools",
      "usedelight",
      "merns-shop",
    ]);
  });

  it("returns additional project slugs with Queue and without selected overlap", () => {
    const additional = buildAdditionalProjectsBlocks(snapshot);
    const { selectedProjects } = partitionProjects(snapshot);

    expect(additional.map((project) => project.slug)).toEqual([
      "queue",
      "answeriq",
      "jw-tabs",
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
    for (const project of selectedProjects) {
      expect(additional.some((item) => item.slug === project.slug)).toBe(false);
    }
  });

  it("partitions application resume projects into client and personal sections", () => {
    const { clientProjects, personalProjects } =
      partitionResumeProjectsByCategory(snapshot);

    expect(clientProjects.map((project) => project.slug)).toEqual([
      "adverio-tools",
      "usedelight",
      "answeriq",
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
    expect(personalProjects.map((project) => project.slug)).toEqual([
      "merns-shop",
      "queue",
      "jw-tabs",
    ]);
  });

  it("splits experience into eight rows for page one and four for page two", () => {
    const experience = buildEngagementExperienceBlocks(snapshot);

    const { firstPageExperience, secondPageExperience } =
      splitExperienceForApplicationResume(experience, 8);

    expect(firstPageExperience).toHaveLength(8);
    expect(secondPageExperience).toHaveLength(4);
    expect(firstPageExperience[0]?.id).toBe("independent-queue");
    expect(secondPageExperience[0]?.id).toBe("codefrost-trulyhappy");
  });

  it("includes devops payment tools in tool strip group snapshot", () => {
    const built = buildPortfolioSnapshot();
    const devopsGroup = built.toolStripGroups.find(
      (group) => group.title === "DevOps, platforms & workflow",
    );

    expect(devopsGroup?.items).toContain("PayPal");
    expect(devopsGroup?.items).toContain("Stripe");
    expect(devopsGroup?.items).toContain("Lemon Squeezy");
  });
});
