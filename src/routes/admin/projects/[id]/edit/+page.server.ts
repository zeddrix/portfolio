import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { projectFormSchema } from '$lib/schemas/project';
import { deleteMedia } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { data: project, error } = await supabaseAdmin
			.from('projects')
			.select('*')
			.eq('id', params.id)
			.single();

		if (error || !project) {
			throw redirect(303, '/admin/projects');
		}

		return {
			project
		};
	} catch (error) {
		if (error instanceof Response) throw error;
		throw redirect(303, '/admin/projects');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		try {
			const formData = await request.formData();

			// Parse JSON fields
			const tech_stack = JSON.parse(formData.get('tech_stack')?.toString() || '[]');
			const gallery_images = JSON.parse(formData.get('gallery_images')?.toString() || '[]');
			const metrics = formData.get('metrics')?.toString()
				? JSON.parse(formData.get('metrics')?.toString() || '{}')
				: null;

			// Get old project data for media cleanup
			const { data: oldProject } = await supabaseAdmin
				.from('projects')
				.select('featured_image_cloudinary_id, gallery_images, demo_video_cloudinary_id')
				.eq('id', params.id)
				.single();

			// Build update data
			const projectData = {
				title: formData.get('title')?.toString() || '',
				slug: formData.get('slug')?.toString() || '',
				short_description: formData.get('short_description')?.toString() || '',
				full_description: formData.get('full_description')?.toString() || '',
				challenge: formData.get('challenge')?.toString() || null,
				solution: formData.get('solution')?.toString() || null,
				tech_stack,
				project_url: formData.get('project_url')?.toString() || null,
				github_url: formData.get('github_url')?.toString() || null,
				featured_image_url: formData.get('featured_image_url')?.toString() || '',
				featured_image_cloudinary_id:
					formData.get('featured_image_cloudinary_id')?.toString() || '',
				gallery_images,
				demo_video_url: formData.get('demo_video_url')?.toString() || null,
				demo_video_cloudinary_id: formData.get('demo_video_cloudinary_id')?.toString() || null,
				is_featured: formData.get('is_featured') === 'true',
				published: formData.get('published') === 'true',
				metrics
			};

			// Validate data
			const validated = projectFormSchema.parse(projectData);

			// Update project
			const { error } = await supabaseAdmin
				.from('projects')
				.update({
					...validated,
					updated_at: new Date().toISOString()
				})
				.eq('id', params.id);

			if (error) {
				console.error('Error updating project:', error);
				return fail(500, { error: 'Failed to update project' });
			}

			// Delete old media if changed
			if (oldProject) {
				if (oldProject.featured_image_cloudinary_id !== validated.featured_image_cloudinary_id) {
					deleteMedia(oldProject.featured_image_cloudinary_id, 'image').catch(console.error);
				}

				if (
					oldProject.demo_video_cloudinary_id &&
					oldProject.demo_video_cloudinary_id !== validated.demo_video_cloudinary_id
				) {
					deleteMedia(oldProject.demo_video_cloudinary_id, 'video').catch(console.error);
				}

				// Delete removed gallery items
				if (oldProject.gallery_images && Array.isArray(oldProject.gallery_images)) {
					oldProject.gallery_images.forEach(
						(oldMedia: { cloudinary_id: string; media_type: string }) => {
							const stillExists = validated.gallery_images.some(
								(newMedia) => newMedia.cloudinary_id === oldMedia.cloudinary_id
							);
							if (!stillExists) {
								const resourceType = oldMedia.media_type === 'video' ? 'video' : 'image';
								deleteMedia(oldMedia.cloudinary_id, resourceType).catch(console.error);
							}
						}
					);
				}
			}

			// Redirect to projects list
			throw redirect(303, '/admin/projects');
		} catch (error) {
			if (error instanceof Response) throw error;
			console.error('Unexpected error updating project:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}
};
