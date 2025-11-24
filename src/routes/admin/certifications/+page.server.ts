import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getSupabaseAdmin } from '$lib/server/supabase';
import {
	createCertificationSchema,
	updateCertificationSchema,
	deleteCertificationSchema,
	reorderCertificationsSchema
} from '$lib/schemas/certification';
import {
	createExperienceSchema,
	updateExperienceSchema,
	deleteExperienceSchema,
	reorderExperiencesSchema
} from '$lib/schemas/experience';
import type { Database } from '$lib/types/database';

type Certification = Database['public']['Tables']['certifications']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];

/**
 * Load all certifications and experiences
 */
export const load: PageServerLoad = async () => {
	try {
		// Fetch all certifications ordered by display_order
		const { data: certifications, error: certError } = await getSupabaseAdmin()
			.from('certifications')
			.select('*')
			.order('display_order', { ascending: true });

		if (certError) throw certError;

		// Fetch all experiences ordered by display_order
		const { data: experiences, error: expError } = await getSupabaseAdmin()
			.from('experiences')
			.select('*')
			.order('display_order', { ascending: true });

		if (expError) throw expError;

		return {
			certifications: certifications as Certification[],
			experiences: experiences as Experience[]
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			certifications: [],
			experiences: []
		};
	}
};

/**
 * Form actions for certifications and experiences management
 */
export const actions: Actions = {
	// ==================== CERTIFICATIONS ====================

	/**
	 * Create a new certification
	 */
	createCertification: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			title: formData.get('title'),
			issuer: formData.get('issuer'),
			issue_date: formData.get('issue_date'),
			expiry_date: formData.get('expiry_date') || null,
			credential_url: formData.get('credential_url') || null,
			credential_id: formData.get('credential_id') || null
		};

		// Validate input
		const result = createCertificationSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Get the highest display_order
			const { data: existing } = await getSupabaseAdmin()
				.from('certifications')
				.select('display_order')
				.order('display_order', { ascending: false })
				.limit(1);

			const maxOrder = existing?.[0]?.display_order ?? -1;
			const newOrder = maxOrder + 1;

			// Clean up empty strings
			const cleanData = {
				...result.data,
				expiry_date: result.data.expiry_date || null,
				credential_url: result.data.credential_url || null,
				credential_id: result.data.credential_id || null,
				display_order: newOrder
			};

			// Insert certification
			const { error: insertError } = await getSupabaseAdmin()
				.from('certifications')
				.insert([cleanData]);

			if (insertError) throw insertError;

			return {
				success: true,
				message: 'Certification created successfully'
			};
		} catch (error) {
			console.error('Error creating certification:', error);
			return fail(500, {
				error: 'Failed to create certification. Please try again.',
				data
			});
		}
	},

	/**
	 * Update an existing certification
	 */
	updateCertification: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id'),
			title: formData.get('title'),
			issuer: formData.get('issuer'),
			issue_date: formData.get('issue_date'),
			expiry_date: formData.get('expiry_date') || null,
			credential_url: formData.get('credential_url') || null,
			credential_id: formData.get('credential_id') || null
		};

		// Validate input
		const result = updateCertificationSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Clean up empty strings
			const cleanData = {
				...result.data,
				expiry_date: result.data.expiry_date || null,
				credential_url: result.data.credential_url || null,
				credential_id: result.data.credential_id || null
			};

			// Remove id from update data
			const { id, ...updateData } = cleanData;

			// Update certification
			const { error: updateError } = await getSupabaseAdmin()
				.from('certifications')
				.update(updateData)
				.eq('id', id);

			if (updateError) throw updateError;

			return {
				success: true,
				message: 'Certification updated successfully'
			};
		} catch (error) {
			console.error('Error updating certification:', error);
			return fail(500, {
				error: 'Failed to update certification. Please try again.',
				data
			});
		}
	},

	/**
	 * Delete a certification
	 */
	deleteCertification: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id')
		};

		// Validate input
		const result = deleteCertificationSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Delete certification
			const { error: deleteError } = await getSupabaseAdmin()
				.from('certifications')
				.delete()
				.eq('id', result.data.id);

			if (deleteError) throw deleteError;

			return {
				success: true,
				message: 'Certification deleted successfully'
			};
		} catch (error) {
			console.error('Error deleting certification:', error);
			return fail(500, {
				error: 'Failed to delete certification. Please try again.'
			});
		}
	},

	/**
	 * Reorder certifications
	 */
	reorderCertifications: async ({ request }) => {
		const formData = await request.formData();
		const certificationsJson = formData.get('certifications');

		if (typeof certificationsJson !== 'string') {
			return fail(400, { error: 'Invalid certifications data' });
		}

		const data = {
			certifications: JSON.parse(certificationsJson)
		};

		// Validate input
		const result = reorderCertificationsSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Update display_order for each certification
			const updates = result.data.certifications.map((cert) =>
				getSupabaseAdmin()
					.from('certifications')
					.update({ display_order: cert.display_order })
					.eq('id', cert.id)
			);

			await Promise.all(updates);

			return {
				success: true,
				message: 'Certifications reordered successfully'
			};
		} catch (error) {
			console.error('Error reordering certifications:', error);
			return fail(500, {
				error: 'Failed to reorder certifications. Please try again.'
			});
		}
	},

	// ==================== EXPERIENCES ====================

	/**
	 * Create a new experience
	 */
	createExperience: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			company: formData.get('company'),
			position: formData.get('position'),
			description: formData.get('description'),
			start_date: formData.get('start_date'),
			end_date: formData.get('end_date') || null,
			is_current: formData.get('is_current') === 'true',
			location: formData.get('location') || null
		};

		// Validate input
		const result = createExperienceSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Get the highest display_order
			const { data: existing } = await getSupabaseAdmin()
				.from('experiences')
				.select('display_order')
				.order('display_order', { ascending: false })
				.limit(1);

			const maxOrder = existing?.[0]?.display_order ?? -1;
			const newOrder = maxOrder + 1;

			// Clean up empty strings
			const cleanData = {
				...result.data,
				end_date: result.data.end_date || null,
				location: result.data.location || null,
				display_order: newOrder
			};

			// Insert experience
			const { error: insertError } = await getSupabaseAdmin()
				.from('experiences')
				.insert([cleanData]);

			if (insertError) throw insertError;

			return {
				success: true,
				message: 'Experience created successfully'
			};
		} catch (error) {
			console.error('Error creating experience:', error);
			return fail(500, {
				error: 'Failed to create experience. Please try again.',
				data
			});
		}
	},

	/**
	 * Update an existing experience
	 */
	updateExperience: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id'),
			company: formData.get('company'),
			position: formData.get('position'),
			description: formData.get('description'),
			start_date: formData.get('start_date'),
			end_date: formData.get('end_date') || null,
			is_current: formData.get('is_current') === 'true',
			location: formData.get('location') || null
		};

		// Validate input
		const result = updateExperienceSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Clean up empty strings
			const cleanData = {
				...result.data,
				end_date: result.data.end_date || null,
				location: result.data.location || null
			};

			// Remove id from update data
			const { id, ...updateData } = cleanData;

			// Update experience
			const { error: updateError } = await getSupabaseAdmin()
				.from('experiences')
				.update(updateData)
				.eq('id', id);

			if (updateError) throw updateError;

			return {
				success: true,
				message: 'Experience updated successfully'
			};
		} catch (error) {
			console.error('Error updating experience:', error);
			return fail(500, {
				error: 'Failed to update experience. Please try again.',
				data
			});
		}
	},

	/**
	 * Delete an experience
	 */
	deleteExperience: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id')
		};

		// Validate input
		const result = deleteExperienceSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Delete experience
			const { error: deleteError } = await getSupabaseAdmin()
				.from('experiences')
				.delete()
				.eq('id', result.data.id);

			if (deleteError) throw deleteError;

			return {
				success: true,
				message: 'Experience deleted successfully'
			};
		} catch (error) {
			console.error('Error deleting experience:', error);
			return fail(500, {
				error: 'Failed to delete experience. Please try again.'
			});
		}
	},

	/**
	 * Reorder experiences
	 */
	reorderExperiences: async ({ request }) => {
		const formData = await request.formData();
		const experiencesJson = formData.get('experiences');

		if (typeof experiencesJson !== 'string') {
			return fail(400, { error: 'Invalid experiences data' });
		}

		const data = {
			experiences: JSON.parse(experiencesJson)
		};

		// Validate input
		const result = reorderExperiencesSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Update display_order for each experience
			const updates = result.data.experiences.map((exp) =>
				getSupabaseAdmin()
					.from('experiences')
					.update({ display_order: exp.display_order })
					.eq('id', exp.id)
			);

			await Promise.all(updates);

			return {
				success: true,
				message: 'Experiences reordered successfully'
			};
		} catch (error) {
			console.error('Error reordering experiences:', error);
			return fail(500, {
				error: 'Failed to reorder experiences. Please try again.'
			});
		}
	}
};
