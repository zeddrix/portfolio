import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { ButtonTextPreset, ProjectCategory } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const [presetsResult, categoriesResult] = await Promise.all([
		supabase.from('button_text_presets').select('*').order('display_order', { ascending: true }),
		supabase.from('project_categories').select('*').order('display_order', { ascending: true })
	]);

	if (presetsResult.error) {
		console.error('Error fetching presets:', presetsResult.error);
		throw error(500, 'Failed to load button text presets');
	}

	return {
		presets: (presetsResult.data || []) as ButtonTextPreset[],
		categories: (categoriesResult.data || []) as ProjectCategory[]
	};
};

export const actions = {
	createPreset: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const text = formData.get('text') as string;
		if (!text) return fail(400, { error: 'Text is required' });

		const { data: existing } = await supabase
			.from('button_text_presets')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing?.[0] as { display_order?: number } | undefined)?.display_order ?? 0;

		const { error: insertError } = await supabase.from('button_text_presets').insert({
			text,
			is_active: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating preset:', insertError);
			return fail(500, { error: 'Failed to create preset' });
		}

		return { success: true, message: 'Preset created' };
	},

	updatePreset: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const text = formData.get('text') as string;
		const isActive = formData.get('is_active') === 'true';

		if (!id || !text) return fail(400, { error: 'ID and text are required' });

		const { error: updateError } = await supabase
			.from('button_text_presets')
			.update({ text, is_active: isActive } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating preset:', updateError);
			return fail(500, { error: 'Failed to update preset' });
		}

		return { success: true, message: 'Preset updated' };
	},

	deletePreset: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID is required' });

		const { error: deleteError } = await supabase.from('button_text_presets').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting preset:', deleteError);
			return fail(500, { error: 'Failed to delete preset' });
		}

		return { success: true, message: 'Preset deleted' };
	},

	createCategory: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const displayName = formData.get('display_name') as string;
		const defaultButtonText = formData.get('default_button_text') as string;

		if (!name || !displayName || !defaultButtonText) {
			return fail(400, { error: 'Name, display name and button text are required' });
		}

		const { data: existing } = await supabase
			.from('project_categories')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing?.[0] as { display_order?: number } | undefined)?.display_order ?? 0;

		const { error: insertError } = await supabase.from('project_categories').insert({
			name,
			display_name: displayName,
			default_button_text: defaultButtonText,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating category:', insertError);
			return fail(500, { error: 'Failed to create category' });
		}

		return { success: true, message: 'Category created' };
	},

	updateCategory: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const displayName = formData.get('display_name') as string;
		const defaultButtonText = formData.get('default_button_text') as string;

		if (!id || !name || !displayName || !defaultButtonText) {
			return fail(400, { error: 'All fields are required' });
		}

		const { error: updateError } = await supabase
			.from('project_categories')
			.update({ name, display_name: displayName, default_button_text: defaultButtonText } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating category:', updateError);
			return fail(500, { error: 'Failed to update category' });
		}

		return { success: true, message: 'Category updated' };
	},

	deleteCategory: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID is required' });

		const { error: deleteError } = await supabase.from('project_categories').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting category:', deleteError);
			return fail(500, { error: 'Failed to delete category' });
		}

		return { success: true, message: 'Category deleted' };
	}
} satisfies Actions;
