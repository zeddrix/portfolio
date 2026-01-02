import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import type { Database, HeroAnimationType } from '$lib/types/database';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdmin();

	const { data: settings, error: settingsError } = await supabase
		.from('site_settings')
		.select('id, hero_animation_type, hero_intro_duration, hero_video_duration')
		.single();

	if (settingsError) {
		console.error('Error fetching hero settings:', settingsError);
		throw error(500, 'Failed to load hero settings');
	}

	return {
		settings: settings as Pick<
			SiteSettings,
			'id' | 'hero_animation_type' | 'hero_intro_duration' | 'hero_video_duration'
		>
	};
};

export const actions = {
	updateHeroSettings: async ({ request }) => {
		const supabase = getSupabaseAdmin();
		const formData = await request.formData();

		const heroAnimationType = formData.get('hero_animation_type') as string;
		const heroIntroDuration = parseInt(formData.get('hero_intro_duration') as string);
		const heroVideoDuration = parseInt(formData.get('hero_video_duration') as string);

		// Validate animation type
		const validAnimationTypes: HeroAnimationType[] = ['fade_up', 'typewriter', 'slide_in'];
		if (
			!heroAnimationType ||
			!validAnimationTypes.includes(heroAnimationType as HeroAnimationType)
		) {
			return fail(400, { error: 'Invalid animation type' });
		}

		// Validate durations (3-10 seconds = 3000-10000ms)
		if (isNaN(heroIntroDuration) || heroIntroDuration < 3000 || heroIntroDuration > 10000) {
			return fail(400, { error: 'Intro duration must be between 3 and 10 seconds' });
		}

		if (isNaN(heroVideoDuration) || heroVideoDuration < 3000 || heroVideoDuration > 10000) {
			return fail(400, { error: 'Video duration must be between 3 and 10 seconds' });
		}

		const { data: settings } = await supabase.from('site_settings').select('id').single();
		const typedSettings = settings as Pick<SiteSettings, 'id'> | null;

		const { error: updateError } = await supabase
			.from('site_settings')
			.update({
				hero_animation_type: heroAnimationType as HeroAnimationType,
				hero_intro_duration: heroIntroDuration,
				hero_video_duration: heroVideoDuration,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', typedSettings?.id || '');

		if (updateError) {
			console.error('Error updating hero settings:', updateError);
			return fail(500, { error: 'Failed to update hero settings' });
		}

		return { success: true, message: 'Hero settings updated successfully' };
	}
} satisfies Actions;
