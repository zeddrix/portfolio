import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { ColorPaletteRow, ColorCombination } from '$lib/types/database';

export const load: PageServerLoad = async ({ params }) => {
	const supabase = getSupabaseAdmin();

	const [paletteResult, combinationsResult] = await Promise.all([
		supabase.from('color_palettes').select('*').eq('id', params.id).single(),
		supabase
			.from('color_combinations')
			.select('*')
			.eq('palette_id', params.id)
			.order('display_order', { ascending: true })
	]);

	const paletteData = paletteResult as unknown as {
		error: Error | null;
		data: ColorPaletteRow | null;
	};
	const combinationsData = combinationsResult as unknown as { data: ColorCombination[] | null };

	if (paletteData.error || !paletteData.data) {
		throw error(404, 'Palette not found');
	}

	return {
		palette: paletteData.data,
		combinations: combinationsData.data || []
	};
};

export const actions = {
	createCombination: async ({ request, params }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const primaryColor = formData.get('primary_color') as string;
		const secondaryColor = formData.get('secondary_color') as string;
		const accentColor = formData.get('accent_color') as string;
		const backgroundDark = formData.get('background_dark') as string;
		const backgroundLight = formData.get('background_light') as string;
		const surfaceDark = formData.get('surface_dark') as string;
		const surfaceLight = formData.get('surface_light') as string;
		const textPrimaryDark = formData.get('text_primary_dark') as string;
		const textPrimaryLight = formData.get('text_primary_light') as string;
		const textSecondaryDark = formData.get('text_secondary_dark') as string;
		const textSecondaryLight = formData.get('text_secondary_light') as string;
		const borderDark = formData.get('border_dark') as string;
		const borderLight = formData.get('border_light') as string;

		if (!name || !primaryColor || !secondaryColor || !accentColor) {
			return fail(400, { error: 'Name and primary colors are required' });
		}

		// Get max display_order
		const { data: existing } = await supabase
			.from('color_combinations')
			.select('display_order')
			.eq('palette_id', params.id)
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing?.[0] as { display_order?: number } | undefined)?.display_order ?? 0;

		// Check if this should be default (first combination)
		const isDefault = maxOrder === 0;

		const { error: insertError } = await supabase.from('color_combinations').insert({
			palette_id: params.id,
			name,
			is_default: isDefault,
			primary_color: primaryColor,
			secondary_color: secondaryColor,
			accent_color: accentColor,
			background_dark: backgroundDark || '#0a0a0a',
			background_light: backgroundLight || '#ffffff',
			surface_dark: surfaceDark || '#1a1a1a',
			surface_light: surfaceLight || '#f5f5f5',
			text_primary_dark: textPrimaryDark || '#ffffff',
			text_primary_light: textPrimaryLight || '#0a0a0a',
			text_secondary_dark: textSecondaryDark || '#a3a3a3',
			text_secondary_light: textSecondaryLight || '#525252',
			border_dark: borderDark || '#262626',
			border_light: borderLight || '#e5e5e5',
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating combination:', insertError);
			return fail(500, { error: 'Failed to create color combination' });
		}

		return { success: true, message: 'Color combination created successfully' };
	},

	updateCombination: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const primaryColor = formData.get('primary_color') as string;
		const secondaryColor = formData.get('secondary_color') as string;
		const accentColor = formData.get('accent_color') as string;
		const backgroundDark = formData.get('background_dark') as string;
		const backgroundLight = formData.get('background_light') as string;
		const surfaceDark = formData.get('surface_dark') as string;
		const surfaceLight = formData.get('surface_light') as string;
		const textPrimaryDark = formData.get('text_primary_dark') as string;
		const textPrimaryLight = formData.get('text_primary_light') as string;
		const textSecondaryDark = formData.get('text_secondary_dark') as string;
		const textSecondaryLight = formData.get('text_secondary_light') as string;
		const borderDark = formData.get('border_dark') as string;
		const borderLight = formData.get('border_light') as string;

		if (!id || !name || !primaryColor || !secondaryColor || !accentColor) {
			return fail(400, { error: 'ID, name, and primary colors are required' });
		}

		const { error: updateError } = await supabase
			.from('color_combinations')
			.update({
				name,
				primary_color: primaryColor,
				secondary_color: secondaryColor,
				accent_color: accentColor,
				background_dark: backgroundDark,
				background_light: backgroundLight,
				surface_dark: surfaceDark,
				surface_light: surfaceLight,
				text_primary_dark: textPrimaryDark,
				text_primary_light: textPrimaryLight,
				text_secondary_dark: textSecondaryDark,
				text_secondary_light: textSecondaryLight,
				border_dark: borderDark,
				border_light: borderLight,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating combination:', updateError);
			return fail(500, { error: 'Failed to update color combination' });
		}

		return { success: true, message: 'Color combination updated successfully' };
	},

	deleteCombination: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Combination ID is required' });
		}

		// Check if it's the default combination
		const { data: combination } = await supabase
			.from('color_combinations')
			.select('is_default')
			.eq('id', id)
			.single();

		const typedCombination = combination as { is_default?: boolean } | null;

		if (typedCombination?.is_default) {
			return fail(400, { error: 'Cannot delete the default combination' });
		}

		const { error: deleteError } = await supabase.from('color_combinations').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting combination:', deleteError);
			return fail(500, { error: 'Failed to delete color combination' });
		}

		return { success: true, message: 'Color combination deleted successfully' };
	},

	setDefaultCombination: async ({ request, params }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Combination ID is required' });
		}

		// Reset all combinations in this palette to non-default
		await supabase
			.from('color_combinations')
			.update({ is_default: false } as never)
			.eq('palette_id', params.id);

		// Set the selected one as default
		const { error: updateError } = await supabase
			.from('color_combinations')
			.update({ is_default: true, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error setting default combination:', updateError);
			return fail(500, { error: 'Failed to set default combination' });
		}

		return { success: true, message: 'Default combination updated' };
	},

	reorderCombinations: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const orderData = formData.get('order') as string;

		try {
			const order = JSON.parse(orderData) as { id: string; display_order: number }[];

			for (const item of order) {
				await supabase
					.from('color_combinations')
					.update({ display_order: item.display_order } as never)
					.eq('id', item.id);
			}

			return { success: true, message: 'Order updated successfully' };
		} catch {
			return fail(400, { error: 'Invalid order data' });
		}
	}
} satisfies Actions;
