import { env } from "$env/dynamic/public";
import { profile } from "$lib/data/portfolio";
import type { PortfolioProject } from "$lib/types/portfolio";

const devFallbackSiteUrl = "http://127.0.0.1:7212";

export const homeSeo = {
  title:
    "Zeddrix Fabian | Full-Stack Web App Developer (SvelteKit, React, Angular)",
  description:
    "Portfolio of Zeddrix Fabian — full-stack web app developer shipping live products with AI-accelerated workflows. Case studies in SvelteKit, React, Angular, and client SaaS.",
  path: "/",
} as const;

export function getSiteUrl(): string {
  const configured = env.PUBLIC_SITE_URL?.trim();
  const base =
    configured && configured.length > 0 ? configured : devFallbackSiteUrl;
  return base.replace(/\/$/, "");
}

export function buildAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getDefaultOgImageUrl(): string {
  return buildAbsoluteUrl("/me.png");
}

export interface PageSeoMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function buildProjectMeta(project: PortfolioProject): PageSeoMeta {
  const summary =
    project.outcome?.trim() ||
    project.tagline?.trim() ||
    project.description.trim();
  const description =
    summary.length > 160 ? `${summary.slice(0, 157)}...` : summary;

  return {
    title: `${project.name} Case Study | Zeddrix Fabian Portfolio`,
    description,
    path: `/projects/${project.slug}`,
    ogImage: project.primaryImage
      ? buildAbsoluteUrl(project.primaryImage)
      : getDefaultOgImageUrl(),
  };
}

export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full-Stack Web App Developer",
    url: getSiteUrl(),
    sameAs: [profile.websiteUrl],
    email: profile.contactEmail,
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

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
