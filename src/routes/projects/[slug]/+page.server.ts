/**
 * Server load function for project detail page
 * Fetches a specific project by slug
 */

import { getProjectBySlug, getProjects } from '$lib/server/data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const project = await getProjectBySlug(params.slug);

	if (!project) {
		throw error(404, {
			message: 'Project not found'
		});
	}

	// Fetch other projects for "related projects" section
	const allProjects = await getProjects();
	const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

	return {
		project,
		relatedProjects
	};
};
