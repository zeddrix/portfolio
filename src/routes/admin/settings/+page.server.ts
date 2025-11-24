import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '$lib/server/supabase';
import type { Database } from '$lib/types/database';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export const load: PageServerLoad = async () => {
	const supabase = createServerClient();

	// Fetch current site settings
	const { data: settings, error: settingsError } = await supabase
		.from('site_settings')
		.select('*')
		.single();

	if (settingsError) {
		console.error('Error fetching site settings:', settingsError);
		throw error(500, 'Failed to load site settings');
	}

	return {
		settings: settings as SiteSettings
	};
};

export const actions = {
	updateLayout: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const layout = formData.get('layout') as string;

		if (!layout || !['case_study', 'single_page', 'bento_grid'].includes(layout)) {
			return fail(400, { error: 'Invalid layout value' });
		}

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({ active_layout: layout, updated_at: new Date().toISOString() } as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating layout:', updateError);
			return fail(500, { error: 'Failed to update layout' });
		}

		return { success: true, message: 'Default layout updated successfully' };
	},

	updatePalette: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const palette = formData.get('palette') as string;

		const validPalettes = [
			'cyber_blue',
			'neon_nights',
			'sunset_ember',
			'forest_zen',
			'monochrome_pro',
			'purple_haze',
			'ocean_deep'
		];

		if (!palette || !validPalettes.includes(palette)) {
			return fail(400, { error: 'Invalid palette value' });
		}

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({ active_palette: palette, updated_at: new Date().toISOString() } as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating palette:', updateError);
			return fail(500, { error: 'Failed to update color palette' });
		}

		return { success: true, message: 'Default color palette updated successfully' };
	},

	updateTheme: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const theme = formData.get('theme') as string;

		if (!theme || !['dark', 'light'].includes(theme)) {
			return fail(400, { error: 'Invalid theme value' });
		}

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({ theme_mode: theme, updated_at: new Date().toISOString() } as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating theme:', updateError);
			return fail(500, { error: 'Failed to update theme' });
		}

		return { success: true, message: 'Default theme updated successfully' };
	},

	updateMaintenanceMode: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const maintenanceMode = formData.get('maintenance_mode') === 'true';

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({ maintenance_mode: maintenanceMode, updated_at: new Date().toISOString() } as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating maintenance mode:', updateError);
			return fail(500, { error: 'Failed to update maintenance mode' });
		}

		return {
			success: true,
			message: maintenanceMode
				? 'Maintenance mode enabled - public site is now offline'
				: 'Maintenance mode disabled - public site is now online'
		};
	}
} satisfies Actions;
