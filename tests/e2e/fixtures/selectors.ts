/** Canonical data-testid map for E2E specs. */
export const selectors = {
  hero: {
    section: "hero-section",
    title: "hero-title",
    subtitle: "hero-subtitle",
    cta: "hero-cta",
    glanceCard: "hero-glance-card",
  },
  nav: {
    work: "nav-link-work",
    about: "nav-link-about",
    approach: "nav-link-approach",
    contact: "nav-link-contact",
    github: "header-github-link",
  },
  work: {
    section: "work-section",
    grid: "work-featured-grid",
    filterAll: "work-filter-all",
    filterClient: "work-filter-client",
    filterPersonal: "work-filter-personal",
    carousel: "highlights-carousel",
    carouselTrack: "highlights-carousel-track",
    carouselNext: "carousel-control-next",
    carouselPrev: "carousel-control-prev",
  },
  previewSettings: {
    toggle: "portfolio-preview-settings",
    panel: "portfolio-preview-settings-panel",
    capabilityDetailed: "capability-layout-option-detailed",
    capabilityGrouped: "capability-layout-option-grouped",
  },
  sections: {
    about: "about-section",
    tools: "tools-strip-section",
    approach: "capability-bands-section",
    contact: "contact-section",
    footer: "footer-section",
  },
  project: {
    detailTitle: "project-detail-title",
    detailBack: "project-detail-back-link",
    detailLinks: "project-detail-links-section",
    notFound: "project-not-found",
    notFoundHome: "project-not-found-home-link",
  },
  contact: {
    cta: "contact-cta",
    approachCta: "approach-contact-cta",
    footerEmail: "footer-email",
    footerWebsite: "footer-website-link",
  },
} as const;

export function projectCardTestId(slug: string): string {
  return `project-card-${slug}`;
}

export function projectLinkTestId(slug: string): string {
  return `project-link-${slug}`;
}

export function projectDetailsLinkTestId(slug: string): string {
  return `project-details-link-${slug}`;
}

export function showcaseLinkTestId(slug: string): string {
  return `showcase-project-link-${slug}`;
}

export function caseStudyTestId(slug: string): string {
  return `case-study-${slug}`;
}

export function caseStudyLinkTestId(slug: string): string {
  return `case-study-link-${slug}`;
}

export function bandProjectLinkTestId(bandId: string, slug: string): string {
  return `band-project-link-${bandId}-${slug}`;
}

export function projectExternalLinkTestId(index: number): string {
  return `project-external-link-${index}`;
}
