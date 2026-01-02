import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { Database } from '$lib/types/database';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

const VALID_LOCATIONS = ['nav', 'about', 'footer', 'contact'] as const;

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const { data: settings, error: settingsError } = await supabase
		.from('site_settings')
		.select('id, profile_picture_locations')
		.single();

	if (settingsError) {
		console.error('Error fetching profile display settings:', settingsError);
		throw error(500, 'Failed to load profile display settings');
	}

	return {
		settings: settings as Pick<SiteSettings, 'id' | 'profile_picture_locations'>
	};
};

export const actions = {
	updateProfileDisplay: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		// Get all selected locations
		const locations = formData.getAll('locations') as string[];

		// Validate locations
		const validLocations = locations.filter((loc) =>
			VALID_LOCATIONS.includes(loc as (typeof VALID_LOCATIONS)[number])
		);

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({
				profile_picture_locations: validLocations,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating profile display settings:', updateError);
			return fail(500, { error: 'Failed to update profile display settings' });
		}

		return { success: true, message: 'Profile display settings updated successfully' };
	}
} satisfies Actions;
