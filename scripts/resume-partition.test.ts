import { describe, expect, it } from "vitest";
import type { ProfileSnapshot, ProjectCategory } from "./resume-content";
import {
  partitionProjects,
  partitionResumeProjectsByCategory,
} from "./resume-content";

function project(
  slug: string,
  category: ProjectCategory,
): ProfileSnapshot["selectedProjects"][number] {
  return {
    slug,
    name: slug,
    category,
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
    highlightProjects: [
      project("queue", "personal"),
      project("usedelight", "client"),
    ],
    selectedProjects: [
      project("adverio-tools", "client"),
      project("usedelight", "client"),
      project("merns-shop", "personal"),
    ],
    moreProjects: [
      project("queue", "personal"),
      project("answeriq", "client"),
      project("jw-tabs", "personal"),
      project("manatal-coop", "client"),
      project("trulyhappy", "client"),
      project("articulearn", "client"),
      project("bolt-to-github", "client"),
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

describe("partitionResumeProjectsByCategory", () => {
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
    highlightProjects: [
      project("queue", "personal"),
      project("usedelight", "client"),
    ],
    selectedProjects: [
      project("adverio-tools", "client"),
      project("usedelight", "client"),
      project("merns-shop", "personal"),
    ],
    moreProjects: [
      project("queue", "personal"),
      project("answeriq", "client"),
      project("jw-tabs", "personal"),
      project("manatal-coop", "client"),
      project("trulyhappy", "client"),
      project("articulearn", "client"),
      project("bolt-to-github", "client"),
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

  it("groups client projects in resume priority order", () => {
    const { clientProjects } = partitionResumeProjectsByCategory(snapshot);

    expect(clientProjects.map((item) => item.slug)).toEqual([
      "adverio-tools",
      "usedelight",
      "answeriq",
      "manatal-coop",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
  });

  it("groups personal projects in resume priority order", () => {
    const { personalProjects } = partitionResumeProjectsByCategory(snapshot);

    expect(personalProjects.map((item) => item.slug)).toEqual([
      "merns-shop",
      "queue",
      "jw-tabs",
    ]);
  });

  it("does not duplicate projects across sections", () => {
    const { clientProjects, personalProjects } =
      partitionResumeProjectsByCategory(snapshot);
    const slugs = [
      ...clientProjects.map((item) => item.slug),
      ...personalProjects.map((item) => item.slug),
    ];

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toHaveLength(10);
  });
});
