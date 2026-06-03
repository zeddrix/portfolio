import type {
  PortfolioProject,
  ProjectStatus,
  WorkProjectFilter,
} from "$lib/types/portfolio";

/** @param {PortfolioProject} project */
export function getProjectDisplayUrl(project: PortfolioProject): string {
  if (project.displayDomain) {
    return project.displayDomain;
  }
  return `/projects/${project.slug}`;
}

/** @param {PortfolioProject} project */
export function getProjectTypeLabel(project: PortfolioProject): string {
  if (project.status === "concept") {
    return "Concept";
  }
  if (project.category === "client") {
    return "Client work";
  }
  return "Personal";
}

/** @param {ProjectStatus} status */
export function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "in_progress":
      return "In progress";
    case "concept":
      return "Concept";
  }
}

/** @param {PortfolioProject[]} projectList @param {WorkProjectFilter} filter */
export function filterProjectsByWorkFilter(
  projectList: PortfolioProject[],
  filter: WorkProjectFilter,
): PortfolioProject[] {
  if (filter === "all") {
    return projectList;
  }
  if (filter === "personal") {
    return projectList.filter((project) => project.category === "personal");
  }
  return projectList.filter((project) => project.category === "client");
}
