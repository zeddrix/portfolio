import { getProjects } from '$lib/server/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const siteUrl = url.origin;

	try {
		// Fetch all published projects
		const projects = await getProjects();
		const publishedProjects = projects.filter((p) => p.published);

		// Generate sitemap XML
		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Project Pages -->
${publishedProjects
	.map(
		(project) => `  <url>
    <loc>${siteUrl}/projects/${project.slug}</loc>
    <lastmod>${new Date(project.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

		return new Response(sitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
