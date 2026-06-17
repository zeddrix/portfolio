export type ProjectCategory = "personal" | "client";

export type ProjectStatus = "live" | "in_progress" | "concept";

export type WorkSectionLayoutMode = "featuredGrid" | "caseStudyLed";

export type WorkProjectFilter = "all" | "personal" | "client";

export interface ProjectLink {
  label: string;
  url: string;
  external: boolean;
}

export interface ProjectDetailSection {
  title: string;
  body: string;
}

/** Used by resume export only — never rendered on portfolio site or GitHub README */
export interface ProjectResumeContext {
  employer?: "Codefrost";
  productOwner?: "codefrost" | "client" | "personal";
  clientBrand?: string;
}

export interface ProjectResumePeriod {
  startDate: string;
  endDate?: string;
  note?: string;
}

export type ResumeEngagementKind = "employment" | "independent" | "client";

export interface ResumeEngagement {
  id: string;
  projectSlug?: string;
  title: string;
  company: string;
  contextLabel?: string;
  employmentType?: string;
  location: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
  kind: ResumeEngagementKind;
}

export interface PortfolioProject {
  slug: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  role: string;
  outcome?: string;
  displayDomain?: string;
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
  hiddenFromPortfolio?: boolean;
  resumeContext?: ProjectResumeContext;
  resumePeriod?: ProjectResumePeriod;
  displayPeriod?: string;
}

export interface ToolStripItem {
  id: string;
  label: string;
}

export interface ToolStripGroup {
  id: string;
  title: string;
  items: ToolStripItem[];
}

export type CapabilityBandVisualType = "screenshot" | "iconPanel" | "hybrid";

export type CapabilityBandImageLayout = "single" | "split" | "carousel";

export type CapabilityBandLayoutMode =
  | "sevenBands"
  | "groupedBands"
  | "singleStack";

export interface CapabilityBandVisual {
  type: CapabilityBandVisualType;
  image?: string;
  images?: string[];
  imageLayout?: CapabilityBandImageLayout;
  autoRotate?: boolean;
  icons?: string[];
  badges?: string[];
}

export interface CapabilityBand {
  id: string;
  title: string;
  description: string;
  highlights?: string[];
  relatedProjectSlugs: string[];
  visual: CapabilityBandVisual;
}

export interface CapabilityBandGroup {
  id: string;
  title: string;
  description?: string;
  visual?: CapabilityBandVisual;
  bands: CapabilityBand[];
}

export interface PortfolioProfile {
  name: string;
  motto: string;
  heroTitle: string;
  heroSubtitle: string;
  heroProof: string;
  about: string[];
  experienceSince: string;
  specialization: string;
  contactEmail: string;
  websiteUrl: string;
  githubUrl: string;
}

export interface Certificate {
  slug: string;
  title: string;
  issuer: "Udemy";
  issuedAt: string;
  hours?: number;
  sections?: number;
  lectures?: number;
  durationLabel?: string;
  skills: string[];
  imagePath: string;
  udemyCredentialId?: string;
  legacyZeddrixPath: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  employmentType?: string;
  location: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
}
