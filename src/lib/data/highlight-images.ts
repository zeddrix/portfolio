import { highlightProjectSlugs, projects } from "$lib/data/portfolio";

export const highlightPrimaryImages = highlightProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .flatMap((project) => (project?.primaryImage ? [project.primaryImage] : []));
