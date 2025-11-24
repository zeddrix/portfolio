import type { Database } from '$lib/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

/**
 * Generate JSON-LD structured data for a project
 */
export function generateProjectStructuredData(project: Project, siteUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.short_description,
		url: `${siteUrl}/projects/${project.slug}`,
		image: project.featured_image_url,
		author: {
			'@type': 'Person',
			name: 'Zeddrix',
			url: siteUrl
		},
		datePublished: project.created_at,
		dateModified: project.updated_at,
		keywords: project.tech_stack?.join(', '),
		inLanguage: 'en-US'
	};
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
		.trim();
}

/**
 * Truncate text to a specific length for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Extract plain text from HTML (for meta descriptions)
 */
export function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate meta keywords from tech stack and categories
 */
export function generateKeywords(techStack: string[], additionalKeywords: string[] = []): string {
	const allKeywords = [...techStack, ...additionalKeywords, 'portfolio', 'web development'];
	return [...new Set(allKeywords)].join(', ');
}
