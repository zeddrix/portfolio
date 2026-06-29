import { PUBLIC_SITE_URL } from "$env/static/public";
import { certificates } from "$lib/data/certificates";
import { profile } from "$lib/data/portfolio";
import type { Certificate, PortfolioProject } from "$lib/types/portfolio";

const devFallbackSiteUrl = "http://127.0.0.1:7212";

export const DEFAULT_OG_IMAGE_PATH = "/og-default.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_ALT =
  "Zeddrix Fabian — Full-Stack Web App Developer portfolio";

export const homeSeo = {
  title:
    "Zeddrix Fabian | Full-Stack Web App Developer (SvelteKit, React, Angular)",
  description:
    "Full-stack developer shipping production PWAs, SaaS, and e-commerce. SvelteKit, React, and Angular case studies—billing, admin dashboards, and ATDD delivery.",
  path: "/",
} as const;

export function getSiteUrl(): string {
  const configured = PUBLIC_SITE_URL?.trim();
  const base =
    configured && configured.length > 0 ? configured : devFallbackSiteUrl;
  return base.replace(/\/$/, "");
}

export function buildAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getDefaultOgImageUrl(): string {
  return buildAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function getBuildLastMod(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface PageSeoMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: number;
}

function truncateDescription(text: string, maxLength = 160): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function resumePeriodToIsoDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`;
  }
  if (/^\d{4}$/.test(value)) {
    return `${value}-01-01`;
  }
  return getBuildLastMod();
}

export function getProjectLastMod(project: PortfolioProject): string {
  const period = project.resumePeriod;
  if (!period) {
    return getBuildLastMod();
  }
  if (period.endDate) {
    return resumePeriodToIsoDate(period.endDate);
  }
  return resumePeriodToIsoDate(period.startDate);
}

export function getCertificateLastMod(certificate: Certificate): string {
  return certificate.issuedAt;
}

export function buildProjectMeta(project: PortfolioProject): PageSeoMeta {
  const summary =
    project.outcome?.trim() ||
    project.tagline?.trim() ||
    project.description.trim();
  const description = truncateDescription(summary);

  return {
    title: `${project.name} Case Study | Zeddrix Fabian Portfolio`,
    description,
    path: `/projects/${project.slug}`,
    ogImage: project.primaryImage
      ? buildAbsoluteUrl(project.primaryImage)
      : getDefaultOgImageUrl(),
  };
}

export function buildCertificateMeta(certificate: Certificate): PageSeoMeta {
  const description = truncateDescription(certificate.summary);

  return {
    title: `${certificate.title} Certificate | Zeddrix Fabian`,
    description,
    path: `/certificates/${certificate.slug}`,
    ogImage: buildAbsoluteUrl(certificate.imagePath),
  };
}

export const certificatesIndexSeo: PageSeoMeta = {
  title: "Certifications | Zeddrix Fabian Portfolio",
  description:
    "Udemy professional development certificates in JavaScript, React, CSS, Node.js, and the MERN stack.",
  path: "/certificates",
};

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full-Stack Web App Developer",
    url: getSiteUrl(),
    sameAs: [profile.websiteUrl, profile.githubUrl, profile.linkedinUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional",
      email: profile.contactEmail,
    },
    knowsAbout: profile.specialization.split(", ").map((item) => item.trim()),
  };
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} Portfolio`,
    url: getSiteUrl(),
    description: homeSeo.description,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function buildProjectJsonLd(
  project: PortfolioProject,
): Record<string, unknown> {
  const hasLiveDemo = project.links.some((link) => link.external);
  const summary =
    project.outcome?.trim() ||
    project.tagline?.trim() ||
    project.description.trim();

  return {
    "@context": "https://schema.org",
    "@type": hasLiveDemo ? "SoftwareApplication" : "CreativeWork",
    name: project.name,
    description: summary,
    url: buildAbsoluteUrl(`/projects/${project.slug}`),
    author: {
      "@type": "Person",
      name: profile.name,
      url: getSiteUrl(),
    },
    ...(project.primaryImage
      ? { image: buildAbsoluteUrl(project.primaryImage) }
      : {}),
    ...(project.techStack.length > 0
      ? { keywords: project.techStack.join(", ") }
      : {}),
  };
}

export function buildCertificateJsonLd(
  certificate: Certificate,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: certificate.title,
    description: certificate.summary,
    url: buildAbsoluteUrl(`/certificates/${certificate.slug}`),
    credentialCategory: "Professional Development Certificate",
    recognizedBy: {
      "@type": "Organization",
      name: certificate.issuer,
    },
    dateCreated: certificate.issuedAt,
    image: buildAbsoluteUrl(certificate.imagePath),
  };
}

export function buildCertificatesIndexJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Professional Certifications",
    itemListElement: certificates.map((certificate, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildAbsoluteUrl(`/certificates/${certificate.slug}`),
      name: certificate.title,
    })),
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
