import type { ProfileSnapshot } from "./resume-content.js";

const OPTIMIZED_EXPERIENCE_IDS = [
  "independent-queue",
  "codefrost-manatal-2026",
  "independent-merns-modernization",
  "codefrost-adverio",
  "codefrost-bolt",
  "independent-answeriq",
  "codefrost-usedelight",
  "codefrost-articulearn",
] as const;

const OPTIMIZED_SELECTED_PROJECT_SLUGS = [
  "queue",
  "merns-shop",
  "usedelight",
] as const;

const OPTIMIZED_MORE_PROJECT_SLUGS = [
  "adverio-tools",
  "answeriq",
  "jw-tabs",
] as const;

const OPTIMIZED_TOOL_GROUP_TITLES = [
  "Frontend frameworks",
  "Languages",
  "Backend & architecture",
  "Data & storage",
  "Testing",
  "DevOps, platforms & workflow",
] as const;

function filterProjectsBySlugs(
  projects: ProfileSnapshot["selectedProjects"][number][],
  orderedSlugs: readonly string[],
): ProfileSnapshot["selectedProjects"] {
  return orderedSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is ProfileSnapshot["selectedProjects"][number] =>
      Boolean(project),
    );
}

export function buildOptimizedResumeSnapshot(
  snapshot: ProfileSnapshot,
): ProfileSnapshot {
  const combinedProjects = [
    ...snapshot.highlightProjects,
    ...snapshot.selectedProjects,
    ...snapshot.moreProjects,
  ];

  const optimizedSelectedProjects = filterProjectsBySlugs(
    combinedProjects,
    OPTIMIZED_SELECTED_PROJECT_SLUGS,
  );
  const optimizedMoreProjects = filterProjectsBySlugs(
    combinedProjects,
    OPTIMIZED_MORE_PROJECT_SLUGS,
  );

  return {
    ...snapshot,
    profile: {
      ...snapshot.profile,
      heroSubtitle:
        "Freelance full-stack product engineer shipping production web apps with clear ownership and reliable delivery.",
      about: [
        "I build production-ready web apps end-to-end, from UX flows to backend integrations and deployment.",
        "I focus on outcomes: faster shipping, reliable billing and operations flows, and maintainable code backed by ATDD.",
      ],
    },
    experience: snapshot.experience.filter((role) =>
      OPTIMIZED_EXPERIENCE_IDS.includes(
        role.id as (typeof OPTIMIZED_EXPERIENCE_IDS)[number],
      ),
    ),
    selectedProjects: optimizedSelectedProjects,
    moreProjects: optimizedMoreProjects,
    resumeSelectedProjectSlugs: [...OPTIMIZED_SELECTED_PROJECT_SLUGS],
    resumeMoreProjectSlugs: [...OPTIMIZED_MORE_PROJECT_SLUGS],
    toolStripGroups: snapshot.toolStripGroups.filter((group) =>
      OPTIMIZED_TOOL_GROUP_TITLES.includes(
        group.title as (typeof OPTIMIZED_TOOL_GROUP_TITLES)[number],
      ),
    ),
    certificates: snapshot.certificates.slice(0, 3),
  };
}
