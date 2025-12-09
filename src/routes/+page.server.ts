/**
 * Server load function for home page
 * Fetches all data needed for the portfolio (updated for UI overhaul)
 */

import { getHomePageData } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getHomePageData();

	return {
		siteSettings: data.siteSettings,
		profile: data.profile,
		projects: data.projects,
		heroCarouselProjects: data.heroCarouselProjects,
		skills: data.skills,
		certifications: data.certifications,
		experiences: data.experiences,
		socialLinks: data.socialLinks,
		// New section data
		statsCounters: data.statsCounters,
		developmentSteps: data.developmentSteps,
		deliverables: data.deliverables,
		aiTools: data.aiTools,
		aiProductivityStats: data.aiProductivityStats
	};
};
