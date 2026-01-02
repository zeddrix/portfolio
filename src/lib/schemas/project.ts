import { z } from 'zod';

// Gallery media item schema
export const galleryMediaSchema = z.object({
	url: z.string().url('Invalid media URL'),
	cloudinary_id: z.string().min(1, 'Cloudinary ID is required'),
	media_type: z.enum(['image', 'video', 'gif']),
	order: z.number().int().min(0).optional()
});

// Project metrics schema (flexible JSON)
export const projectMetricsSchema = z
	.record(z.string(), z.union([z.string(), z.number()]))
	.optional()
	.nullable();

// Button text mode enum
export const buttonTextModeSchema = z.enum(['predefined', 'custom', 'category']);

// Project form schema
export const projectFormSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.max(200, 'Slug must be less than 200 characters')
		.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
	short_description: z
		.string()
		.min(1, 'Short description is required')
		.max(500, 'Short description must be less than 500 characters'),
	full_description: z.string().min(1, 'Full description is required'),
	challenge: z.string().optional().nullable(),
	solution: z.string().optional().nullable(),
	tech_stack: z
		.array(z.string())
		.min(1, 'At least one technology is required')
		.max(20, 'Maximum 20 technologies allowed'),
	project_url: z.string().url('Invalid project URL').optional().nullable().or(z.literal('')),
	github_url: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
	featured_image_url: z
		.string()
		.url('Featured image is required')
		.min(1, 'Featured image is required'),
	featured_image_cloudinary_id: z.string().min(1, 'Featured image Cloudinary ID is required'),
	gallery_images: z.array(galleryMediaSchema).default([]),
	demo_video_url: z.string().url('Invalid video URL').optional().nullable().or(z.literal('')),
	demo_video_cloudinary_id: z.string().optional().nullable().or(z.literal('')),
	is_featured: z.boolean().default(false),
	published: z.boolean().default(false),
	metrics: projectMetricsSchema,
	// Hero carousel settings
	show_in_hero_carousel: z.boolean().default(false),
	hero_display_order: z.number().int().min(0).default(0),
	// Video preview settings (in seconds)
	video_preview_start: z.number().min(0).default(0),
	video_preview_end: z.number().min(0).default(5),
	// Button text settings
	button_text_mode: buttonTextModeSchema.default('predefined'),
	button_text: z.string().optional().nullable(),
	project_category_id: z.string().uuid().optional().nullable()
});

// Project update schema (partial for editing)
export const projectUpdateSchema = projectFormSchema.partial().extend({
	id: z.string().uuid('Invalid project ID')
});

// Project reorder schema
export const projectReorderSchema = z.object({
	projectId: z.string().uuid('Invalid project ID'),
	newOrder: z.number().int().min(0, 'Display order must be a positive number')
});

// Project deletion schema
export const projectDeleteSchema = z.object({
	id: z.string().uuid('Invalid project ID'),
	confirm: z.literal(true)
});

// Gallery media upload schema
export const galleryMediaUploadSchema = z.object({
	project_id: z.string().uuid('Invalid project ID'),
	media: z.array(galleryMediaSchema).min(1, 'At least one media item is required')
});

// Gallery media delete schema
export const galleryMediaDeleteSchema = z.object({
	project_id: z.string().uuid('Invalid project ID'),
	cloudinary_id: z.string().min(1, 'Cloudinary ID is required')
});

// Tech stack tag input (for creating tags from comma-separated string)
export const techStackInputSchema = z
	.string()
	.transform((val) =>
		val
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0)
	)
	.pipe(z.array(z.string()).min(1, 'At least one technology is required'));

// Type exports
export type GalleryMedia = z.infer<typeof galleryMediaSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
export type ProjectReorderData = z.infer<typeof projectReorderSchema>;
export type ProjectDeleteData = z.infer<typeof projectDeleteSchema>;
export type GalleryMediaUploadData = z.infer<typeof galleryMediaUploadSchema>;
export type GalleryMediaDeleteData = z.infer<typeof galleryMediaDeleteSchema>;
