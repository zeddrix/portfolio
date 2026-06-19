import { certificates } from "$lib/data/certificates";
import { projects } from "$lib/data/portfolio";
import {
  buildAbsoluteUrl,
  getBuildLastMod,
  getCertificateLastMod,
  getProjectLastMod,
  type SitemapEntry,
} from "$lib/data/seo";

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatSitemapUrl(entry: SitemapEntry): string {
  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`;
}

export function GET() {
  const buildLastMod = getBuildLastMod();
  const certificateIndexLastMod = certificates.reduce((latest, certificate) => {
    const issuedAt = getCertificateLastMod(certificate);
    return issuedAt > latest ? issuedAt : latest;
  }, buildLastMod);

  const entries: SitemapEntry[] = [
    {
      loc: buildAbsoluteUrl("/"),
      lastmod: buildLastMod,
      priority: 1.0,
    },
    {
      loc: buildAbsoluteUrl("/certificates"),
      lastmod: certificateIndexLastMod,
      priority: 0.6,
    },
    ...projects.map((project) => ({
      loc: buildAbsoluteUrl(`/projects/${project.slug}`),
      lastmod: getProjectLastMod(project),
      priority: 0.8,
    })),
    ...certificates.map((certificate) => ({
      loc: buildAbsoluteUrl(`/certificates/${certificate.slug}`),
      lastmod: getCertificateLastMod(certificate),
      priority: 0.6,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(formatSitemapUrl).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
