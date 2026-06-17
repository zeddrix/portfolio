import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import {
  buildAdditionalProjectsBlocks,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  partitionProjects,
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

  it("splits experience into eight rows for page one and four for page two", () => {
    const experience = buildEngagementExperienceBlocks(snapshot);

    const { firstPageExperience, secondPageExperience } =
      splitExperienceForApplicationResume(experience, 8);

    expect(firstPageExperience).toHaveLength(8);
    expect(secondPageExperience).toHaveLength(4);
    expect(firstPageExperience[0]?.id).toBe("independent-queue");
    expect(secondPageExperience[0]?.id).toBe("codefrost-trulyhappy");
  });
});
