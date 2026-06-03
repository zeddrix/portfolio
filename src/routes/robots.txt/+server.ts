import { buildAbsoluteUrl } from "$lib/data/seo";

export const prerender = true;

export function GET() {
  const body = `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${buildAbsoluteUrl("/sitemap.xml")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
