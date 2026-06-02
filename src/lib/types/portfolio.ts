export type ProjectCategory = "personal" | "client";

export interface ProjectLink {
  label: string;
  url: string;
  external: boolean;
}

export interface ProjectDetailSection {
  title: string;
  body: string;
}

export interface PortfolioProject {
  slug: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  techStack: string[];
  primaryImage?: string;
  galleryImages: string[];
  links: ProjectLink[];
  detailSections: ProjectDetailSection[];
}

export interface CapabilityCard {
  id: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface PortfolioProfile {
  name: string;
  motto: string;
  heroTitle: string;
  heroSubtitle: string;
  about: string[];
  experienceSince: string;
  specialization: string;
  contactEmail: string;
  xUrl: string;
}
