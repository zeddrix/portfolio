import { z } from 'zod';

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be less than 100 characters')
		.trim(),
	email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
	message: z
		.string()
		.min(10, 'Message must be at least 10 characters')
		.max(2000, 'Message must be less than 2000 characters')
		.trim(),
	// Honeypot field for spam protection (should be empty)
	website: z.string().max(0, 'Invalid submission').optional().default('')
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Profile edit form validation schema
 */
export const profileSchema = z.object({
	full_name: z
		.string()
		.min(2, 'Full name must be at least 2 characters')
		.max(100, 'Full name must be less than 100 characters')
		.trim(),
	tagline: z
		.string()
		.min(5, 'Tagline must be at least 5 characters')
		.max(200, 'Tagline must be less than 200 characters')
		.trim(),
	bio: z.string().min(20, 'Bio must be at least 20 characters').max(2000).trim(),
	email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
	phone: z
		.string()
		.regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
			message: 'Please enter a valid phone number'
		})
		.optional()
		.or(z.literal('')),
	linkedin_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	github_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	location: z.string().max(100).optional().or(z.literal('')),
	available_for_work: z.boolean().default(true)
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Project form validation schema
 */
export const projectSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, 'Title must be less than 200 characters')
		.trim(),
	slug: z
		.string()
		.min(3, 'Slug must be at least 3 characters')
		.max(200, 'Slug must be less than 200 characters')
		.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
		.trim(),
	short_description: z
		.string()
		.min(10, 'Short description must be at least 10 characters')
		.max(500, 'Short description must be less than 500 characters')
		.trim(),
	full_description: z
		.string()
		.min(50, 'Full description must be at least 50 characters')
		.max(10000)
		.trim(),
	challenge: z.string().max(5000).optional().or(z.literal('')),
	solution: z.string().max(5000).optional().or(z.literal('')),
	tech_stack: z
		.array(z.string())
		.min(1, 'Please add at least one technology')
		.max(20, 'Maximum 20 technologies allowed'),
	project_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	github_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	featured_image_url: z.string().url().optional().or(z.literal('')),
	featured_image_cloudinary_id: z.string().optional().or(z.literal('')),
	demo_video_url: z.string().url().optional().or(z.literal('')),
	demo_video_cloudinary_id: z.string().optional().or(z.literal('')),
	is_featured: z.boolean().default(false),
	published: z.boolean().default(false)
});

export type ProjectFormData = z.infer<typeof projectSchema>;

/**
 * Skill form validation schema
 */
export const skillSchema = z.object({
	name: z
		.string()
		.min(1, 'Skill name is required')
		.max(100, 'Skill name must be less than 100 characters')
		.trim(),
	category: z.enum(['programming', 'frontend', 'backend', 'devops', 'tools']),
	proficiency_level: z
		.number()
		.int()
		.min(1, 'Proficiency level must be between 1 and 5')
		.max(5, 'Proficiency level must be between 1 and 5'),
	icon_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	badge_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	is_featured: z.boolean().default(false)
});

export type SkillFormData = z.infer<typeof skillSchema>;

/**
 * Certification form validation schema
 */
export const certificationSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, 'Title must be less than 200 characters')
		.trim(),
	issuer: z
		.string()
		.min(2, 'Issuer must be at least 2 characters')
		.max(200, 'Issuer must be less than 200 characters')
		.trim(),
	issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
	expiry_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)')
		.optional()
		.or(z.literal('')),
	credential_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	credential_id: z.string().max(200).optional().or(z.literal(''))
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

/**
 * Experience form validation schema
 */
export const experienceSchema = z.object({
	company: z
		.string()
		.min(2, 'Company name must be at least 2 characters')
		.max(200, 'Company name must be less than 200 characters')
		.trim(),
	position: z
		.string()
		.min(2, 'Position must be at least 2 characters')
		.max(200, 'Position must be less than 200 characters')
		.trim(),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters')
		.max(2000, 'Description must be less than 2000 characters')
		.trim(),
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)')
		.optional()
		.or(z.literal('')),
	is_current: z.boolean().default(false),
	location: z.string().max(100).optional().or(z.literal(''))
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

/**
 * Social link form validation schema
 */
export const socialLinkSchema = z.object({
	platform: z
		.string()
		.min(2, 'Platform name must be at least 2 characters')
		.max(50, 'Platform name must be less than 50 characters')
		.trim(),
	url: z.string().url('Please enter a valid URL').trim(),
	icon_name: z.string().max(50).trim(),
	is_visible: z.boolean().default(true)
});

export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;
