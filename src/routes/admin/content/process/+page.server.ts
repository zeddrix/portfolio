import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { DevelopmentProcessStep } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const { data: steps, error: fetchError } = await supabase
		.from('development_process_steps')
		.select('*')
		.order('display_order', { ascending: true });

	if (fetchError) {
		console.error('Error fetching process steps:', fetchError);
		throw error(500, 'Failed to load development process steps');
	}

	return {
		steps: (steps || []) as DevelopmentProcessStep[]
	};
};

export const actions = {
	createStep: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const icon = (formData.get('icon') as string) || null;

		if (!title || !description) {
			return fail(400, { error: 'Title and description are required' });
		}

		// Get max display_order
		const { data: existing } = await supabase
			.from('development_process_steps')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing as { display_order: number }[] | null)?.[0]?.display_order ?? 0;

		const { error: insertError } = await supabase.from('development_process_steps').insert({
			title,
			description,
			icon,
			is_visible: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating step:', insertError);
			return fail(500, { error: 'Failed to create step' });
		}

		return { success: true, message: 'Step created successfully' };
	},

	updateStep: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const icon = (formData.get('icon') as string) || null;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id || !title || !description) {
			return fail(400, { error: 'ID, title and description are required' });
		}

		const { error: updateError } = await supabase
			.from('development_process_steps')
			.update({
				title,
				description,
				icon,
				is_visible: isVisible,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating step:', updateError);
			return fail(500, { error: 'Failed to update step' });
		}

		return { success: true, message: 'Step updated successfully' };
	},

	deleteStep: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Step ID is required' });
		}

		const { error: deleteError } = await supabase
			.from('development_process_steps')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting step:', deleteError);
			return fail(500, { error: 'Failed to delete step' });
		}

		return { success: true, message: 'Step deleted successfully' };
	},

	toggleVisibility: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id) {
			return fail(400, { error: 'Step ID is required' });
		}

		const { error: updateError } = await supabase
			.from('development_process_steps')
			.update({ is_visible: !isVisible, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error toggling visibility:', updateError);
			return fail(500, { error: 'Failed to toggle visibility' });
		}

		return { success: true, message: `Step ${!isVisible ? 'shown' : 'hidden'}` };
	},

	reorderSteps: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const orderData = formData.get('order') as string;

		try {
			const order = JSON.parse(orderData) as { id: string; display_order: number }[];

			for (const item of order) {
				await supabase
					.from('development_process_steps')
					.update({ display_order: item.display_order } as never)
					.eq('id', item.id);
			}

			return { success: true, message: 'Order updated successfully' };
		} catch {
			return fail(400, { error: 'Invalid order data' });
		}
	}
} satisfies Actions;
