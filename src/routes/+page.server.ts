/**
 * Server load function for home page
 * Fetches all data needed for the portfolio layouts
 */

import { getHomePageData } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getHomePageData();

	return {
		siteSettings: data.siteSettings,
		profile: data.profile,
		projects: data.projects,
		skills: data.skills,
		certifications: data.certifications,
		experiences: data.experiences,
		socialLinks: data.socialLinks
	};
};
