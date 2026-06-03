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
  imageFocus?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
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

export type CapabilityBandVisualType = "screenshot" | "iconPanel" | "hybrid";

export type CapabilityBandLayoutMode =
  | "sevenBands"
  | "groupedBands"
  | "singleStack";

export interface CapabilityBandVisual {
  type: CapabilityBandVisualType;
  image?: string;
  icons?: string[];
  badges?: string[];
}

export interface CapabilityBand {
  id: string;
  title: string;
  description: string;
  highlights?: string[];
  visual: CapabilityBandVisual;
}

export interface CapabilityBandGroup {
  id: string;
  title: string;
  description?: string;
  bands: CapabilityBand[];
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
  websiteUrl: string;
}
