import { createServerClient } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

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
		siteSettings,
		stats: {
			totalProjects: projectsResult.count || 0,
			totalSkills: skillsResult.count || 0,
			totalCertifications: certificationsResult.count || 0,
			totalExperiences: experiencesResult.count || 0
		},
		recentProjects: recentProjects || []
	};
};
