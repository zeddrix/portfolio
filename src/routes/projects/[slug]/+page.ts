import { getProjectBySlug } from "$lib/data/portfolio";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const project = getProjectBySlug(params.slug);
  return { project };
};
