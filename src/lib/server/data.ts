/**
 * Server-side data fetching utilities
 * All functions fetch data from Supabase for server-side rendering
 */

import { createServerClient } from '$lib/server/supabase';
import type { Database } from '$lib/types/database';

// Type helpers
type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
type Profile = Database['public']['Tables']['profile']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type Certification = Database['public']['Tables']['certifications']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type SocialLink = Database['public']['Tables']['social_links']['Row'];

/**
 * Fetch site settings (layout, palette, theme)
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

	return data || [];
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

	return data || [];
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

	return data;
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

/**
 * Fetch all data needed for the home page
 */
export async function getHomePageData() {
	const [siteSettings, profile, projects, skills, certifications, experiences, socialLinks] =
		await Promise.all([
			getSiteSettings(),
			getProfile(),
			getProjects(),
			getSkills(),
			getCertifications(),
			getExperiences(),
			getSocialLinks()
		]);

	return {
		siteSettings,
		profile,
		projects,
		skills,
		certifications,
		experiences,
		socialLinks
	};
}
