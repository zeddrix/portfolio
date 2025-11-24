/**
 * Validation schemas for certifications
 */

import { z } from 'zod';

/**
 * Create certification schema
 */
export const createCertificationSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
	issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer must be 100 characters or less'),
	issue_date: z.string().min(1, 'Issue date is required'),
	expiry_date: z.string().optional().or(z.literal('')),
	credential_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	credential_id: z
		.string()
		.max(100, 'Credential ID must be 100 characters or less')
		.optional()
		.or(z.literal(''))
});

export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;

/**
 * Update certification schema
 */
export const updateCertificationSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
	issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer must be 100 characters or less'),
	issue_date: z.string().min(1, 'Issue date is required'),
	expiry_date: z.string().optional().or(z.literal('')),
	credential_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	credential_id: z
		.string()
		.max(100, 'Credential ID must be 100 characters or less')
		.optional()
		.or(z.literal(''))
});

export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;

/**
 * Delete certification schema
 */
export const deleteCertificationSchema = z.object({
	id: z.string().uuid()
});

/**
 * Reorder certifications schema
 */
export const reorderCertificationsSchema = z.object({
	certifications: z.array(
		z.object({
			id: z.string().uuid(),
			display_order: z.number().int().nonnegative()
		})
	)
});
