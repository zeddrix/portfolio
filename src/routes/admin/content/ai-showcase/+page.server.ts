import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { AITool, AIProductivityStat } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const [toolsResult, statsResult] = await Promise.all([
		supabase.from('ai_tools').select('*').order('display_order', { ascending: true }),
		supabase.from('ai_productivity_stats').select('*').order('display_order', { ascending: true })
	]);

	if (toolsResult.error) {
		console.error('Error fetching AI tools:', toolsResult.error);
		throw error(500, 'Failed to load AI tools');
	}

	return {
		tools: (toolsResult.data || []) as AITool[],
		stats: (statsResult.data || []) as AIProductivityStat[]
	};
};

export const actions = {
	// AI Tools CRUD
	createTool: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const description = (formData.get('description') as string) || null;
		const iconUrl = (formData.get('icon_url') as string) || null;
		const websiteUrl = (formData.get('website_url') as string) || null;

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		const { data: existing } = await supabase
			.from('ai_tools')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing as { display_order: number }[] | null)?.[0]?.display_order ?? 0;

		const { error: insertError } = await supabase.from('ai_tools').insert({
			name,
			description,
			icon_url: iconUrl,
			website_url: websiteUrl,
			is_visible: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating tool:', insertError);
			return fail(500, { error: 'Failed to create tool' });
		}

		return { success: true, message: 'AI tool created successfully' };
	},

	updateTool: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = (formData.get('description') as string) || null;
		const iconUrl = (formData.get('icon_url') as string) || null;
		const websiteUrl = (formData.get('website_url') as string) || null;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id || !name) {
			return fail(400, { error: 'ID and name are required' });
		}

		const { error: updateError } = await supabase
			.from('ai_tools')
			.update({
				name,
				description,
				icon_url: iconUrl,
				website_url: websiteUrl,
				is_visible: isVisible,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating tool:', updateError);
			return fail(500, { error: 'Failed to update tool' });
		}

		return { success: true, message: 'AI tool updated successfully' };
	},

	deleteTool: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Tool ID is required' });
		}

		const { error: deleteError } = await supabase.from('ai_tools').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting tool:', deleteError);
			return fail(500, { error: 'Failed to delete tool' });
		}

		return { success: true, message: 'AI tool deleted successfully' };
	},

	toggleToolVisibility: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id) {
			return fail(400, { error: 'Tool ID is required' });
		}

		const { error: updateError } = await supabase
			.from('ai_tools')
			.update({ is_visible: !isVisible, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error toggling visibility:', updateError);
			return fail(500, { error: 'Failed to toggle visibility' });
		}

		return { success: true, message: `Tool ${!isVisible ? 'shown' : 'hidden'}` };
	},

	// AI Productivity Stats CRUD
	createStat: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const label = formData.get('label') as string;
		const value = formData.get('value') as string;
		const description = (formData.get('description') as string) || null;

		if (!label || !value) {
			return fail(400, { error: 'Label and value are required' });
		}

		const { data: existing } = await supabase
			.from('ai_productivity_stats')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing as { display_order: number }[] | null)?.[0]?.display_order ?? 0;

		const { error: insertError } = await supabase.from('ai_productivity_stats').insert({
			label,
			value,
			description,
			is_visible: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating stat:', insertError);
			return fail(500, { error: 'Failed to create stat' });
		}

		return { success: true, message: 'Productivity stat created successfully' };
	},

	updateStat: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const label = formData.get('label') as string;
		const value = formData.get('value') as string;
		const description = (formData.get('description') as string) || null;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id || !label || !value) {
			return fail(400, { error: 'ID, label and value are required' });
		}

		const { error: updateError } = await supabase
			.from('ai_productivity_stats')
			.update({
				label,
				value,
				description,
				is_visible: isVisible,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating stat:', updateError);
			return fail(500, { error: 'Failed to update stat' });
		}

		return { success: true, message: 'Productivity stat updated successfully' };
	},

	deleteStat: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Stat ID is required' });
		}

		const { error: deleteError } = await supabase
			.from('ai_productivity_stats')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting stat:', deleteError);
			return fail(500, { error: 'Failed to delete stat' });
		}

		return { success: true, message: 'Productivity stat deleted successfully' };
	},

	toggleStatVisibility: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id) {
			return fail(400, { error: 'Stat ID is required' });
		}

		const { error: updateError } = await supabase
			.from('ai_productivity_stats')
			.update({ is_visible: !isVisible, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error toggling visibility:', updateError);
			return fail(500, { error: 'Failed to toggle visibility' });
		}

		return { success: true, message: `Stat ${!isVisible ? 'shown' : 'hidden'}` };
	}
} satisfies Actions;
