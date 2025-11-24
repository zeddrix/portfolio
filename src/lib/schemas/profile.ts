/**
 * Zod validation schemas for profile and social links
 */

import { z } from 'zod';

/**
 * Profile form validation schema
 */
export const profileSchema = z.object({
	full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
	tagline: z.string().min(10, 'Tagline must be at least 10 characters').max(200),
	bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000),
	email: z.string().email('Invalid email address'),
	phone: z.string().nullable().optional(),
	linkedin_url: z.string().url('Invalid LinkedIn URL').nullable().optional().or(z.literal('')),
	github_url: z.string().url('Invalid GitHub URL').nullable().optional().or(z.literal('')),
	website_url: z.string().url('Invalid website URL').nullable().optional().or(z.literal('')),
	location: z.string().max(100).nullable().optional(),
	available_for_work: z.boolean().default(true),
	profile_image_url: z.string().nullable().optional(),
	profile_image_cloudinary_id: z.string().nullable().optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Social link form validation schema
 */
export const socialLinkSchema = z.object({
	platform: z.string().min(2, 'Platform name must be at least 2 characters').max(50),
	url: z.string().url('Invalid URL'),
	icon_name: z.string().min(1, 'Icon name is required').max(50),
	is_visible: z.boolean().default(true)
});

export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

/**
 * Social link update schema (includes ID for updates)
 */
export const socialLinkUpdateSchema = socialLinkSchema.extend({
	id: z.string().uuid()
});

export type SocialLinkUpdateData = z.infer<typeof socialLinkUpdateSchema>;

/**
 * Social link reorder schema
 */
export const socialLinksReorderSchema = z.object({
	links: z.array(
		z.object({
			id: z.string().uuid(),
			display_order: z.number().int().min(0)
		})
	)
});

export type SocialLinksReorderData = z.infer<typeof socialLinksReorderSchema>;
