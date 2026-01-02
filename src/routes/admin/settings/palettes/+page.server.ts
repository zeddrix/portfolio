import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { ColorPaletteRow } from '$lib/types/database';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const { data: palettes, error: fetchError } = await supabase
		.from('color_palettes')
		.select('*')
		.order('is_system', { ascending: false })
		.order('name', { ascending: true });

	if (fetchError) {
		console.error('Error fetching palettes:', fetchError);
		throw error(500, 'Failed to load color palettes');
	}

	return {
		palettes: (palettes || []) as ColorPaletteRow[]
	};
};

export const actions = {
	createPalette: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const displayName = formData.get('display_name') as string;
		const description = (formData.get('description') as string) || null;

		if (!name || !displayName) {
			return fail(400, { error: 'Name and display name are required' });
		}

		// Validate name format (lowercase, no spaces)
		if (!/^[a-z0-9-]+$/.test(name)) {
			return fail(400, { error: 'Name must be lowercase letters, numbers, and hyphens only' });
		}

		const { error: insertError } = await supabase.from('color_palettes').insert({
			name,
			display_name: displayName,
			description,
			is_system: false,
			is_active: false
		} as never);

		if (insertError) {
			console.error('Error creating palette:', insertError);
			if (insertError.code === '23505') {
				return fail(400, { error: 'A palette with this name already exists' });
			}
			return fail(500, { error: 'Failed to create palette' });
		}

		return { success: true, message: 'Palette created successfully' };
	},

	updatePalette: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const displayName = formData.get('display_name') as string;
		const description = (formData.get('description') as string) || null;

		if (!id || !displayName) {
			return fail(400, { error: 'ID and display name are required' });
		}

		const { error: updateError } = await supabase
			.from('color_palettes')
			.update({
				display_name: displayName,
				description,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating palette:', updateError);
			return fail(500, { error: 'Failed to update palette' });
		}

		return { success: true, message: 'Palette updated successfully' };
	},

	deletePalette: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Palette ID is required' });
		}

		// Check if it's a system palette
		const { data: palette } = await supabase
			.from('color_palettes')
			.select('is_system, is_active')
			.eq('id', id)
			.single();

		const typedPalette = palette as { is_system?: boolean; is_active?: boolean } | null;

		if (typedPalette?.is_system) {
			return fail(400, { error: 'Cannot delete system palettes' });
		}

		if (typedPalette?.is_active) {
			return fail(400, { error: 'Cannot delete the active palette' });
		}

		const { error: deleteError } = await supabase.from('color_palettes').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting palette:', deleteError);
			return fail(500, { error: 'Failed to delete palette' });
		}

		return { success: true, message: 'Palette deleted successfully' };
	},

	activatePalette: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Palette ID is required' });
		}

		// Deactivate all palettes first
		await supabase
			.from('color_palettes')
			.update({ is_active: false } as never)
			.neq('id', '');

		// Activate the selected palette
		const { error: updateError } = await supabase
			.from('color_palettes')
			.update({ is_active: true, updated_at: new Date().toISOString() } as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error activating palette:', updateError);
			return fail(500, { error: 'Failed to activate palette' });
		}

		return { success: true, message: 'Palette activated successfully' };
	}
} satisfies Actions;
