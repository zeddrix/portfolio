/**
 * Validation schemas for work experiences
 */

import { z } from 'zod';

/**
 * Create experience schema
 */
export const createExperienceSchema = z.object({
	company: z
		.string()
		.min(1, 'Company is required')
		.max(100, 'Company must be 100 characters or less'),
	position: z
		.string()
		.min(1, 'Position is required')
		.max(100, 'Position must be 100 characters or less'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(1000, 'Description must be 1000 characters or less'),
	start_date: z.string().min(1, 'Start date is required'),
	end_date: z.string().optional().or(z.literal('')),
	is_current: z.boolean().default(false),
	location: z
		.string()
		.max(100, 'Location must be 100 characters or less')
		.optional()
		.or(z.literal(''))
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;

/**
 * Update experience schema
 */
export const updateExperienceSchema = z.object({
	id: z.string().uuid(),
	company: z
		.string()
		.min(1, 'Company is required')
		.max(100, 'Company must be 100 characters or less'),
	position: z
		.string()
		.min(1, 'Position is required')
		.max(100, 'Position must be 100 characters or less'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(1000, 'Description must be 1000 characters or less'),
	start_date: z.string().min(1, 'Start date is required'),
	end_date: z.string().optional().or(z.literal('')),
	is_current: z.boolean(),
	location: z
		.string()
		.max(100, 'Location must be 100 characters or less')
		.optional()
		.or(z.literal(''))
});

export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;

/**
 * Delete experience schema
 */
export const deleteExperienceSchema = z.object({
	id: z.string().uuid()
});

/**
 * Reorder experiences schema
 */
export const reorderExperiencesSchema = z.object({
	experiences: z.array(
		z.object({
			id: z.string().uuid(),
			display_order: z.number().int().nonnegative()
		})
	)
});
