/**
 * Validation schemas for skills
 */

import { z } from 'zod';

/**
 * Skill categories
 */
export const skillCategories = ['programming', 'frontend', 'backend', 'devops', 'tools'] as const;

export type SkillCategory = (typeof skillCategories)[number];

/**
 * Skill category metadata
 */
export const skillCategoryMetadata: Record<
	SkillCategory,
	{ label: string; icon: string; description: string }
> = {
	programming: {
		label: 'Programming Languages',
		icon: 'code',
		description: 'Core programming languages and paradigms'
	},
	frontend: {
		label: 'Frontend Development',
		icon: 'web',
		description: 'UI/UX technologies and frameworks'
	},
	backend: {
		label: 'Backend Development',
		icon: 'storage',
		description: 'Server-side technologies and APIs'
	},
	devops: {
		label: 'DevOps & Infrastructure',
		icon: 'cloud',
		description: 'Deployment, CI/CD, and infrastructure'
	},
	tools: {
		label: 'Tools & Platforms',
		icon: 'build',
		description: 'Development tools and platforms'
	}
};

/**
 * Create skill schema
 */
export const createSkillSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
	category: z.enum(skillCategories, { message: 'Category is required' }),
	proficiency_level: z
		.number()
		.int()
		.min(1, 'Proficiency must be at least 1')
		.max(5, 'Proficiency must be at most 5'),
	icon_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	badge_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	is_featured: z.boolean().default(false)
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;

/**
 * Update skill schema
 */
export const updateSkillSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
	category: z.enum(skillCategories, { message: 'Category is required' }),
	proficiency_level: z
		.number()
		.int()
		.min(1, 'Proficiency must be at least 1')
		.max(5, 'Proficiency must be at most 5'),
	icon_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	badge_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	is_featured: z.boolean()
});

export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;

/**
 * Delete skill schema
 */
export const deleteSkillSchema = z.object({
	id: z.string().uuid()
});

/**
 * Reorder skills schema
 */
export const reorderSkillsSchema = z.object({
	skills: z.array(
		z.object({
			id: z.string().uuid(),
			display_order: z.number().int().nonnegative()
		})
	)
});

/**
 * Toggle featured schema
 */
export const toggleFeaturedSchema = z.object({
	id: z.string().uuid(),
	is_featured: z.boolean()
});
