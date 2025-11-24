import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const siteUrl = url.origin;

	const robotsTxt = `# robots.txt for ${siteUrl}

# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin routes
Disallow: /admin/
Disallow: /admin/*

# Disallow maintenance page
Disallow: /maintenance

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay (optional, in seconds)
# Crawl-delay: 1
`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
		}
	});
};
