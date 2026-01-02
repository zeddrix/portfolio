import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { ProjectDeliverable } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const { data: deliverables, error: fetchError } = await supabase
		.from('project_deliverables')
		.select('*')
		.order('display_order', { ascending: true });

	if (fetchError) {
		console.error('Error fetching deliverables:', fetchError);
		throw error(500, 'Failed to load deliverables');
	}

	return {
		deliverables: (deliverables || []) as ProjectDeliverable[]
	};
};

export const actions = {
	createDeliverable: async ({ request }) => {
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
			.from('project_deliverables')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing as { display_order: number }[] | null)?.[0]?.display_order ?? 0;

		const { error: insertError } = await supabase.from('project_deliverables').insert({
			title,
			description,
			icon,
			is_visible: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating deliverable:', insertError);
			return fail(500, { error: 'Failed to create deliverable' });
		}

		return { success: true, message: 'Deliverable created successfully' };
	},

	updateDeliverable: async ({ request }) => {
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
			.from('project_deliverables')
			.update({
				title,
				description,
				icon,
				is_visible: isVisible,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating deliverable:', updateError);
			return fail(500, { error: 'Failed to update deliverable' });
		}

		return { success: true, message: 'Deliverable updated successfully' };
	},

	deleteDeliverable: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Deliverable ID is required' });
		}

		const { error: deleteError } = await supabase
			.from('project_deliverables')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting deliverable:', deleteError);
			return fail(500, { error: 'Failed to delete deliverable' });
		}

		return { success: true, message: 'Deliverable deleted successfully' };
	},

	toggleVisibility: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id) {
			return fail(400, { error: 'Deliverable ID is required' });
		}

		const { error: updateError } = await supabase
			.from('project_deliverables')
			.update({ is_visible: !isVisible, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error toggling visibility:', updateError);
			return fail(500, { error: 'Failed to toggle visibility' });
		}

		return { success: true, message: `Deliverable ${!isVisible ? 'shown' : 'hidden'}` };
	},

	reorderDeliverables: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const orderData = formData.get('order') as string;

		try {
			const order = JSON.parse(orderData) as { id: string; display_order: number }[];

			for (const item of order) {
				await supabase
					.from('project_deliverables')
					.update({ display_order: item.display_order } as never)
					.eq('id', item.id);
			}

			return { success: true, message: 'Order updated successfully' };
		} catch {
			return fail(400, { error: 'Invalid order data' });
		}
	}
} satisfies Actions;
