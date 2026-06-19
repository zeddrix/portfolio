import { projects, getProjectBySlug } from "$lib/data/portfolio";
import type { PageLoad } from "./$types";

export const prerender = true;

export function entries() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const load: PageLoad = ({ params }) => {
  const project = getProjectBySlug(params.slug);
  return { project, slug: params.slug };
};
