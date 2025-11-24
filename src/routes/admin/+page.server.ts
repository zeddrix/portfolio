import { createServerClient } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';
import type { Database } from '$lib/types/database';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

export const load: PageServerLoad = async () => {
	const supabase = createServerClient();

	// Fetch site settings
	const { data: siteSettings } = await supabase.from('site_settings').select('*').single();

	// Fetch counts for statistics
	const [projectsResult, skillsResult, certificationsResult, experiencesResult] = await Promise.all(
		[
			supabase.from('projects').select('id', { count: 'exact', head: true }),
			supabase.from('skills').select('id', { count: 'exact', head: true }),
			supabase.from('certifications').select('id', { count: 'exact', head: true }),
			supabase.from('experiences').select('id', { count: 'exact', head: true })
		]
	);

	// Fetch recent projects
	const { data: recentProjects } = await supabase
		.from('projects')
		.select('id, title, slug, updated_at, published')
		.order('updated_at', { ascending: false })
		.limit(5);

	return {
		siteSettings: (siteSettings || null) as SiteSettings | null,
		stats: {
			totalProjects: projectsResult.count || 0,
			totalSkills: skillsResult.count || 0,
			totalCertifications: certificationsResult.count || 0,
			totalExperiences: experiencesResult.count || 0
		},
		recentProjects: (recentProjects || []) as Pick<
			Project,
			'id' | 'title' | 'slug' | 'updated_at' | 'published'
		>[]
	};
};
