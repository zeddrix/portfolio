import { describe, expect, it } from "vitest";
import type { ProfileSnapshot } from "./resume-content";
import { partitionProjects } from "./resume-content";

function project(slug: string): ProfileSnapshot["selectedProjects"][number] {
  return {
    slug,
    name: slug,
    role: "Role",
    outcome: "Outcome",
    tagline: "Tagline",
    description: "Description",
    techStack: ["TypeScript"],
    links: [],
    detailSections: [],
  };
}

describe("partitionProjects", () => {
  const snapshot: ProfileSnapshot = {
    profile: {
      name: "Test",
      heroSubtitle: "Subtitle",
      about: [],
      contactEmail: "test@example.com",
      websiteUrl: "https://example.com",
      githubUrl: "https://github.com/test",
      linkedinUrl: "https://linkedin.com/in/test",
      specialization: "SvelteKit",
      experienceSince: "2018",
      jobTitle: "Developer",
    },
    experience: [],
    certificates: [],
    highlightProjects: [project("queue"), project("usedelight")],
    selectedProjects: [
      project("adverio-tools"),
      project("usedelight"),
      project("merns-shop"),
    ],
    moreProjects: [
      project("queue"),
      project("answeriq"),
      project("jw-tabs"),
      project("manatal-coop"),
      project("trulyhappy"),
      project("articulearn"),
      project("bolt-to-github"),
    ],
    resumeSelectedProjectSlugs: ["adverio-tools", "usedelight", "merns-shop"],
    resumeMoreProjectSlugs: [
      "queue",
      "answeriq",
      "jw-tabs",
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ],
    toolStripGroups: [],
  };

  it("orders selected projects for resume page one", () => {
    const { selectedProjects } = partitionProjects(snapshot);

    expect(selectedProjects.map((item) => item.slug)).toEqual([
      "adverio-tools",
      "usedelight",
      "merns-shop",
    ]);
  });

  it("keeps Queue in additional projects", () => {
    const { additionalProjects } = partitionProjects(snapshot);

    expect(additionalProjects.map((item) => item.slug)).toEqual([
      "queue",
      "answeriq",
      "jw-tabs",
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
  });
});
