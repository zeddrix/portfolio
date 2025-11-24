import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getSupabaseAdmin } from '$lib/server/supabase';
import {
	createSkillSchema,
	updateSkillSchema,
	deleteSkillSchema,
	reorderSkillsSchema,
	toggleFeaturedSchema
} from '$lib/schemas/skill';
import type { Database } from '$lib/types/database';

type Skill = Database['public']['Tables']['skills']['Row'];

/**
 * Load all skills grouped by category
 */
export const load: PageServerLoad = async () => {
	try {
		// Fetch all skills ordered by category and display_order
		const { data: skills, error } = await getSupabaseAdmin()
			.from('skills')
			.select('*')
			.order('category', { ascending: true })
			.order('display_order', { ascending: true });

		if (error) throw error;

		return {
			skills: skills as Skill[]
		};
	} catch (error) {
		console.error('Error loading skills:', error);
		return {
			skills: []
		};
	}
};

/**
 * Form actions for skill management
 */
export const actions: Actions = {
	/**
	 * Create a new skill
	 */
	create: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			name: formData.get('name'),
			category: formData.get('category'),
			proficiency_level: Number(formData.get('proficiency_level')),
			icon_url: formData.get('icon_url') || null,
			badge_url: formData.get('badge_url') || null,
			is_featured: formData.get('is_featured') === 'true'
		};

		// Validate input
		const result = createSkillSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Get the highest display_order in this category
			const { data: existingSkills } = await getSupabaseAdmin()
				.from('skills')
				.select('display_order')
				.eq('category', result.data.category)
				.order('display_order', { ascending: false })
				.limit(1);

			const typedExistingSkills = existingSkills as Pick<Skill, 'display_order'>[] | null;
			const maxOrder = typedExistingSkills?.[0]?.display_order ?? -1;
			const newOrder = maxOrder + 1;

			// Clean up empty string URLs
			const cleanData = {
				...result.data,
				icon_url: result.data.icon_url || null,
				badge_url: result.data.badge_url || null,
				display_order: newOrder
			};

			// Insert skill
			const { error: insertError } = await getSupabaseAdmin()
				.from('skills')
				.insert([cleanData] as never);

			if (insertError) throw insertError;

			return {
				success: true,
				message: 'Skill created successfully'
			};
		} catch (error) {
			console.error('Error creating skill:', error);
			return fail(500, {
				error: 'Failed to create skill. Please try again.',
				data
			});
		}
	},

	/**
	 * Update an existing skill
	 */
	update: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id'),
			name: formData.get('name'),
			category: formData.get('category'),
			proficiency_level: Number(formData.get('proficiency_level')),
			icon_url: formData.get('icon_url') || null,
			badge_url: formData.get('badge_url') || null,
			is_featured: formData.get('is_featured') === 'true'
		};

		// Validate input
		const result = updateSkillSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				data
			});
		}

		try {
			// Clean up empty string URLs
			const cleanData = {
				...result.data,
				icon_url: result.data.icon_url || null,
				badge_url: result.data.badge_url || null
			};

			// Remove id from update data
			const { id, ...updateData } = cleanData;

			// Update skill
			const { error: updateError } = await getSupabaseAdmin()
				.from('skills')
				.update(updateData as never)
				.eq('id', id);

			if (updateError) throw updateError;

			return {
				success: true,
				message: 'Skill updated successfully'
			};
		} catch (error) {
			console.error('Error updating skill:', error);
			return fail(500, {
				error: 'Failed to update skill. Please try again.',
				data
			});
		}
	},

	/**
	 * Delete a skill
	 */
	delete: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id')
		};

		// Validate input
		const result = deleteSkillSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Delete skill
			const { error: deleteError } = await getSupabaseAdmin()
				.from('skills')
				.delete()
				.eq('id', result.data.id);

			if (deleteError) throw deleteError;

			return {
				success: true,
				message: 'Skill deleted successfully'
			};
		} catch (error) {
			console.error('Error deleting skill:', error);
			return fail(500, {
				error: 'Failed to delete skill. Please try again.'
			});
		}
	},

	/**
	 * Reorder skills within a category
	 */
	reorder: async ({ request }) => {
		const formData = await request.formData();
		const skillsJson = formData.get('skills');

		if (typeof skillsJson !== 'string') {
			return fail(400, { error: 'Invalid skills data' });
		}

		const data = {
			skills: JSON.parse(skillsJson)
		};

		// Validate input
		const result = reorderSkillsSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Update display_order for each skill
			const updates = result.data.skills.map((skill) =>
				getSupabaseAdmin()
					.from('skills')
					.update({ display_order: skill.display_order } as never)
					.eq('id', skill.id)
			);

			await Promise.all(updates);

			return {
				success: true,
				message: 'Skills reordered successfully'
			};
		} catch (error) {
			console.error('Error reordering skills:', error);
			return fail(500, {
				error: 'Failed to reorder skills. Please try again.'
			});
		}
	},

	/**
	 * Toggle featured status
	 */
	toggleFeatured: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			id: formData.get('id'),
			is_featured: formData.get('is_featured') === 'true'
		};

		// Validate input
		const result = toggleFeaturedSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message
			});
		}

		try {
			// Update featured status
			const { error: updateError } = await getSupabaseAdmin()
				.from('skills')
				.update({ is_featured: result.data.is_featured } as never)
				.eq('id', result.data.id);

			if (updateError) throw updateError;

			return {
				success: true,
				message: `Skill ${result.data.is_featured ? 'featured' : 'unfeatured'} successfully`
			};
		} catch (error) {
			console.error('Error toggling featured status:', error);
			return fail(500, {
				error: 'Failed to update featured status. Please try again.'
			});
		}
	}
};
