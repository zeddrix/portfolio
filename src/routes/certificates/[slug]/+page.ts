import { certificates } from "$lib/data/certificates";
import type { PageLoad } from "./$types";

export const prerender = true;

export function entries() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export const load: PageLoad = ({ params }) => {
  const certificate = certificates.find((item) => item.slug === params.slug);
  return { certificate };
};
