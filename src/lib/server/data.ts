/**
 * Server-side data fetching utilities
 * All functions fetch data from Supabase for server-side rendering
 */

import { createServerClient } from '$lib/server/supabase';
import type {
	ColorPaletteRow,
	ColorCombination,
	ProjectCategory,
	ButtonTextPreset,
	StatsCounter,
	DevelopmentProcessStep,
	ProjectDeliverable,
	AITool,
	AIProductivityStat,
	SiteSettings,
	Profile,
	Project,
	Skill,
	Certification,
	Experience,
	SocialLink
} from '$lib/types/database';

/**
 * Fetch site settings (palette, theme, hero config, stats config)
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
	const supabase = createServerClient();

	const { data, error } = await supabase.from('site_settings').select('*').single();

	if (error) {
		console.error('Error fetching site settings:', error);
		return null;
	}

	return data;
}

/**
 * Fetch profile data
 */
export async function getProfile(): Promise<Profile | null> {
	const supabase = createServerClient();

	const { data, error } = await supabase.from('profile').select('*').single();

	if (error) {
		console.error('Error fetching profile:', error);
		return null;
	}

	return data;
}

/**
 * Fetch all published projects, ordered by display_order
 */
export async function getProjects(): Promise<Project[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('published', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching projects:', error);
		return [];
	}

	return (data as Project[]) || [];
}

/**
 * Fetch featured projects only
 */
export async function getFeaturedProjects(): Promise<Project[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('published', true)
		.eq('is_featured', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching featured projects:', error);
		return [];
	}

	return (data as Project[]) || [];
}

/**
 * Fetch projects for hero carousel
 */
export async function getHeroCarouselProjects(): Promise<Project[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('published', true)
		.eq('show_in_hero_carousel', true)
		.order('hero_display_order', { ascending: true });

	if (error) {
		console.error('Error fetching hero carousel projects:', error);
		return [];
	}

	return (data as Project[]) || [];
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('slug', slug)
		.eq('published', true)
		.single();

	if (error) {
		console.error(`Error fetching project with slug "${slug}":`, error);
		return null;
	}

	return data as Project;
}

/**
 * Fetch all skills, ordered by category and display_order
 */
export async function getSkills(): Promise<Skill[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('skills')
		.select('*')
		.order('category', { ascending: true })
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching skills:', error);
		return [];
	}

	return data || [];
}

/**
 * Fetch featured skills only
 */
export async function getFeaturedSkills(): Promise<Skill[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('skills')
		.select('*')
		.eq('is_featured', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching featured skills:', error);
		return [];
	}

	return data || [];
}

/**
 * Fetch all certifications, ordered by display_order
 */
export async function getCertifications(): Promise<Certification[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('certifications')
		.select('*')
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching certifications:', error);
		return [];
	}

	return data || [];
}

/**
 * Fetch all work experiences, ordered by display_order
 */
export async function getExperiences(): Promise<Experience[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('experiences')
		.select('*')
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching experiences:', error);
		return [];
	}

	return data || [];
}

/**
 * Fetch visible social links, ordered by display_order
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('social_links')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching social links:', error);
		return [];
	}

	return data || [];
}

// ============================================================================
// NEW FUNCTIONS FROM UI OVERHAUL
// ============================================================================

/**
 * Fetch all active color palettes
 */
export async function getColorPalettes(): Promise<ColorPaletteRow[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('color_palettes')
		.select('*')
		.eq('is_active', true)
		.order('name', { ascending: true });

	if (error) {
		console.error('Error fetching color palettes:', error);
		return [];
	}

	return (data as ColorPaletteRow[]) || [];
}

/**
 * Fetch color combinations for a specific palette
 */
export async function getColorCombinations(paletteId: string): Promise<ColorCombination[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('color_combinations')
		.select('*')
		.eq('palette_id', paletteId)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching color combinations:', error);
		return [];
	}

	return (data as ColorCombination[]) || [];
}

/**
 * Fetch default color combination for a palette
 */
export async function getDefaultColorCombination(
	paletteId: string
): Promise<ColorCombination | null> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('color_combinations')
		.select('*')
		.eq('palette_id', paletteId)
		.eq('is_default', true)
		.single();

	if (error) {
		console.error('Error fetching default color combination:', error);
		return null;
	}

	return data as ColorCombination;
}

/**
 * Fetch visible stats counters
 */
export async function getStatsCounters(): Promise<StatsCounter[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('stats_counters')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching stats counters:', error);
		return [];
	}

	return (data as StatsCounter[]) || [];
}

/**
 * Fetch visible development process steps
 */
export async function getDevelopmentProcessSteps(): Promise<DevelopmentProcessStep[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('development_process_steps')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching development process steps:', error);
		return [];
	}

	return (data as DevelopmentProcessStep[]) || [];
}

/**
 * Fetch visible project deliverables
 */
export async function getProjectDeliverables(): Promise<ProjectDeliverable[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('project_deliverables')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching project deliverables:', error);
		return [];
	}

	return (data as ProjectDeliverable[]) || [];
}

/**
 * Fetch visible AI tools
 */
export async function getAITools(): Promise<AITool[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('ai_tools')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching AI tools:', error);
		return [];
	}

	return (data as AITool[]) || [];
}

/**
 * Fetch visible AI productivity stats
 */
export async function getAIProductivityStats(): Promise<AIProductivityStat[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('ai_productivity_stats')
		.select('*')
		.eq('is_visible', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching AI productivity stats:', error);
		return [];
	}

	return (data as AIProductivityStat[]) || [];
}

/**
 * Fetch active button text presets
 */
export async function getButtonTextPresets(): Promise<ButtonTextPreset[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('button_text_presets')
		.select('*')
		.eq('is_active', true)
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching button text presets:', error);
		return [];
	}

	return (data as ButtonTextPreset[]) || [];
}

/**
 * Fetch all project categories
 */
export async function getProjectCategories(): Promise<ProjectCategory[]> {
	const supabase = createServerClient();

	const { data, error } = await supabase
		.from('project_categories')
		.select('*')
		.order('display_order', { ascending: true });

	if (error) {
		console.error('Error fetching project categories:', error);
		return [];
	}

	return (data as ProjectCategory[]) || [];
}

/**
 * Fetch all data needed for the home page (updated with new sections)
 */
export async function getHomePageData() {
	const [
		siteSettings,
		profile,
		projects,
		heroCarouselProjects,
		skills,
		certifications,
		experiences,
		socialLinks,
		statsCounters,
		developmentSteps,
		deliverables,
		aiTools,
		aiProductivityStats
	] = await Promise.all([
		getSiteSettings(),
		getProfile(),
		getProjects(),
		getHeroCarouselProjects(),
		getSkills(),
		getCertifications(),
		getExperiences(),
		getSocialLinks(),
		getStatsCounters(),
		getDevelopmentProcessSteps(),
		getProjectDeliverables(),
		getAITools(),
		getAIProductivityStats()
	]);

	return {
		siteSettings,
		profile,
		projects,
		heroCarouselProjects,
		skills,
		certifications,
		experiences,
		socialLinks,
		statsCounters,
		developmentSteps,
		deliverables,
		aiTools,
		aiProductivityStats
	};
}
