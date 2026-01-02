import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { Database, StatsDisplayModeType, StatsCounter } from '$lib/types/database';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

const VALID_DISPLAY_MODES: StatsDisplayModeType[] = ['counters', 'icons', 'categories', 'hybrid'];

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const [settingsResult, countersResult] = await Promise.all([
		supabase
			.from('site_settings')
			.select('id, stats_display_mode, stats_counters_enabled, stats_icons_enabled')
			.single(),
		supabase.from('stats_counters').select('*').order('display_order', { ascending: true })
	]);

	if (settingsResult.error) {
		console.error('Error fetching stats settings:', settingsResult.error);
		throw error(500, 'Failed to load stats settings');
	}

	return {
		settings: settingsResult.data as Pick<
			SiteSettings,
			'id' | 'stats_display_mode' | 'stats_counters_enabled' | 'stats_icons_enabled'
		>,
		counters: (countersResult.data || []) as StatsCounter[]
	};
};

export const actions = {
	updateSettings: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const displayMode = formData.get('stats_display_mode') as string;
		const countersEnabled = formData.get('stats_counters_enabled') === 'true';
		const iconsEnabled = formData.get('stats_icons_enabled') === 'true';

		if (!VALID_DISPLAY_MODES.includes(displayMode as StatsDisplayModeType)) {
			return fail(400, { error: 'Invalid display mode' });
		}

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({
				stats_display_mode: displayMode as StatsDisplayModeType,
				stats_counters_enabled: countersEnabled,
				stats_icons_enabled: iconsEnabled,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating stats settings:', updateError);
			return fail(500, { error: 'Failed to update stats settings' });
		}

		return { success: true, message: 'Stats settings updated successfully' };
	},

	createCounter: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const label = formData.get('label') as string;
		const value = formData.get('value') as string;
		const suffix = (formData.get('suffix') as string) || null;
		const icon = (formData.get('icon') as string) || null;

		if (!label || !value) {
			return fail(400, { error: 'Label and value are required' });
		}

		// Get max display_order
		const { data: existing } = await supabase
			.from('stats_counters')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const maxOrder = (existing?.[0] as { display_order?: number } | undefined)?.display_order ?? 0;

		const { error: insertError } = await supabase.from('stats_counters').insert({
			label,
			value,
			suffix,
			icon,
			is_visible: true,
			display_order: maxOrder + 1
		} as never);

		if (insertError) {
			console.error('Error creating counter:', insertError);
			return fail(500, { error: 'Failed to create counter' });
		}

		return { success: true, message: 'Counter created successfully' };
	},

	updateCounter: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const label = formData.get('label') as string;
		const value = formData.get('value') as string;
		const suffix = (formData.get('suffix') as string) || null;
		const icon = (formData.get('icon') as string) || null;
		const isVisible = formData.get('is_visible') === 'true';

		if (!id || !label || !value) {
			return fail(400, { error: 'ID, label and value are required' });
		}

		const { error: updateError } = await supabase
			.from('stats_counters')
			.update({
				label,
				value,
				suffix,
				icon,
				is_visible: isVisible,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', id);

		if (updateError) {
			console.error('Error updating counter:', updateError);
			return fail(500, { error: 'Failed to update counter' });
		}

		return { success: true, message: 'Counter updated successfully' };
	},

	deleteCounter: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Counter ID is required' });
		}

		const { error: deleteError } = await supabase.from('stats_counters').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting counter:', deleteError);
			return fail(500, { error: 'Failed to delete counter' });
		}

		return { success: true, message: 'Counter deleted successfully' };
	},

	reorderCounters: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const orderData = formData.get('order') as string;

		try {
			const order = JSON.parse(orderData) as { id: string; display_order: number }[];

			for (const item of order) {
				await supabase
					.from('stats_counters')
					.update({ display_order: item.display_order } as never)
					.eq('id', item.id);
			}

			return { success: true, message: 'Order updated successfully' };
		} catch {
			return fail(400, { error: 'Invalid order data' });
		}
	}
} satisfies Actions;
