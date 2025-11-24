import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import { deleteMedia } from '$lib/server/cloudinary';
import { projectReorderSchema, projectDeleteSchema } from '$lib/schemas/project';
import type { Database } from '$lib/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const filter = url.searchParams.get('filter') || 'all'; // all, published, draft, featured
	const sort = url.searchParams.get('sort') || 'updated_at'; // updated_at, created_at, title, display_order

	try {
		const supabase = getSupabaseAdmin();
		let query = supabase.from('projects').select('*');

		// Apply search filter
		if (search) {
			query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
		}

		// Apply status filter
		if (filter === 'published') {
			query = query.eq('published', true);
		} else if (filter === 'draft') {
			query = query.eq('published', false);
		} else if (filter === 'featured') {
			query = query.eq('is_featured', true);
		}

		// Apply sorting
		switch (sort) {
			case 'updated_at':
				query = query.order('updated_at', { ascending: false });
				break;
			case 'created_at':
				query = query.order('created_at', { ascending: false });
				break;
			case 'title':
				query = query.order('title', { ascending: true });
				break;
			case 'display_order':
				query = query.order('display_order', { ascending: true });
				break;
		}

		const { data: projects, error } = await query;

		if (error) {
			console.error('Error fetching projects:', error);
			return {
				projects: [] as Project[],
				search,
				filter,
				sort,
				error: 'Failed to load projects'
			};
		}

		return {
			projects: (projects || []) as Project[],
			search,
			filter,
			sort
		};
	} catch (error) {
		console.error('Unexpected error fetching projects:', error);
		return {
			projects: [] as Project[],
			search,
			filter,
			sort,
			error: 'An unexpected error occurred'
		};
	}
};

export const actions: Actions = {
	togglePublished: async ({ request }) => {
		try {
			const formData = await request.formData();
			const projectId = formData.get('id')?.toString();
			const currentStatus = formData.get('published') === 'true';

			if (!projectId) {
				return fail(400, { error: 'Project ID is required' });
			}

			const supabase = getSupabaseAdmin();
			const { error } = await supabase
				.from('projects')
				.update({
					published: !currentStatus,
					updated_at: new Date().toISOString()
				} as never)
				.eq('id', projectId);

			if (error) {
				console.error('Error toggling published status:', error);
				return fail(500, { error: 'Failed to update project status' });
			}

			return {
				success: true,
				message: `Project ${!currentStatus ? 'published' : 'unpublished'} successfully`
			};
		} catch (error) {
			console.error('Unexpected error toggling published status:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	},

	toggleFeatured: async ({ request }) => {
		try {
			const formData = await request.formData();
			const projectId = formData.get('id')?.toString();
			const currentStatus = formData.get('is_featured') === 'true';

			if (!projectId) {
				return fail(400, { error: 'Project ID is required' });
			}

			const { error } = await getSupabaseAdmin()
				.from('projects')
				.update({
					is_featured: !currentStatus,
					updated_at: new Date().toISOString()
				} as never)
				.eq('id', projectId);

			if (error) {
				console.error('Error toggling featured status:', error);
				return fail(500, { error: 'Failed to update featured status' });
			}

			return {
				success: true,
				message: `Project ${!currentStatus ? 'marked as featured' : 'removed from featured'}`
			};
		} catch (error) {
			console.error('Unexpected error toggling featured status:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	},

	reorder: async ({ request }) => {
		try {
			const formData = await request.formData();
			const dataStr = formData.get('data')?.toString();

			if (!dataStr) {
				return fail(400, { error: 'Reorder data is required' });
			}

			const data = JSON.parse(dataStr);
			const validated = projectReorderSchema.parse(data);

			const { error } = await getSupabaseAdmin()
				.from('projects')
				.update({
					display_order: validated.newOrder,
					updated_at: new Date().toISOString()
				} as never)
				.eq('id', validated.projectId);

			if (error) {
				console.error('Error reordering project:', error);
				return fail(500, { error: 'Failed to reorder project' });
			}

			return {
				success: true,
				message: 'Project order updated successfully'
			};
		} catch (error) {
			console.error('Unexpected error reordering project:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const dataStr = formData.get('data')?.toString();

			if (!dataStr) {
				return fail(400, { error: 'Project data is required' });
			}

			const data = JSON.parse(dataStr);
			const validated = projectDeleteSchema.parse(data);

			// Fetch project to get media IDs before deletion
			const { data: project, error: fetchError } = await getSupabaseAdmin()
				.from('projects')
				.select('featured_image_cloudinary_id, gallery_images, demo_video_cloudinary_id')
				.eq('id', validated.id)
				.single();

			if (fetchError) {
				console.error('Error fetching project for deletion:', fetchError);
				return fail(500, { error: 'Failed to fetch project data' });
			}

			const typedProject = project as Pick<
				Project,
				'featured_image_cloudinary_id' | 'gallery_images' | 'demo_video_cloudinary_id'
			> | null;

			// Delete project from database
			const { error: deleteError } = await getSupabaseAdmin()
				.from('projects')
				.delete()
				.eq('id', validated.id);

			if (deleteError) {
				console.error('Error deleting project:', deleteError);
				return fail(500, { error: 'Failed to delete project' });
			}

			// Delete associated media from Cloudinary (in background, don't block response)
			if (typedProject) {
				// Delete featured image
				if (typedProject.featured_image_cloudinary_id) {
					deleteMedia(typedProject.featured_image_cloudinary_id, 'image').catch(console.error);
				}

				// Delete demo video
				if (typedProject.demo_video_cloudinary_id) {
					deleteMedia(typedProject.demo_video_cloudinary_id, 'video').catch(console.error);
				}

				// Delete gallery images/videos
				if (typedProject.gallery_images && Array.isArray(typedProject.gallery_images)) {
					typedProject.gallery_images.forEach(
						(media: { cloudinary_id: string; media_type: string }) => {
							const resourceType = media.media_type === 'video' ? 'video' : 'image';
							deleteMedia(media.cloudinary_id, resourceType).catch(console.error);
						}
					);
				}
			}

			return {
				success: true,
				message: 'Project deleted successfully'
			};
		} catch (error) {
			console.error('Unexpected error deleting project:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}
};
