/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single dash
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Validate if a string is a valid slug
 * @param slug - The string to validate
 * @returns True if valid slug format
 */
export function isValidSlug(slug: string): boolean {
	return /^[a-z0-9-]+$/.test(slug);
}
