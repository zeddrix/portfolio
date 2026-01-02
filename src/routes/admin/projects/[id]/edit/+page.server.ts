import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import { projectFormSchema } from '$lib/schemas/project';
import { deleteMedia } from '$lib/server/cloudinary';
import type { Database, ButtonTextPreset, ProjectCategory } from '$lib/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

export const load: PageServerLoad = async ({ params }) => {
	try {
		const supabase = getSupabaseAdmin();

		const { data: project, error } = await supabase
			.from('projects')
			.select('*')
			.eq('id', params.id)
			.single();

		if (error || !project) {
			throw redirect(303, '/admin/projects');
		}

		// Load button text presets
		const { data: presets } = await supabase
			.from('button_text_presets')
			.select('*')
			.eq('is_active', true)
			.order('display_order');

		// Load project categories
		const { data: categories } = await supabase
			.from('project_categories')
			.select('*')
			.order('display_order');

		return {
			project: project as Project,
			buttonTextPresets: (presets || []) as ButtonTextPreset[],
			projectCategories: (categories || []) as ProjectCategory[]
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

			// Parse new fields
			const buttonTextMode = formData.get('button_text_mode')?.toString() || 'predefined';
			const buttonText = formData.get('button_text')?.toString() || null;
			const projectCategoryId = formData.get('project_category_id')?.toString() || null;
			const showInHeroCarousel = formData.get('show_in_hero_carousel') === 'true';
			const heroDisplayOrder = parseInt(formData.get('hero_display_order')?.toString() || '0', 10);
			const videoPreviewStart = parseFloat(formData.get('video_preview_start')?.toString() || '0');
			const videoPreviewEnd = parseFloat(formData.get('video_preview_end')?.toString() || '5');

			// Get old project data for media cleanup
			const { data: oldProject } = await getSupabaseAdmin()
				.from('projects')
				.select('featured_image_cloudinary_id, gallery_images, demo_video_cloudinary_id')
				.eq('id', params.id)
				.single();

			const typedOldProject = oldProject as Pick<
				Project,
				'featured_image_cloudinary_id' | 'gallery_images' | 'demo_video_cloudinary_id'
			> | null;

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
				metrics,
				// New fields from UI overhaul
				show_in_hero_carousel: showInHeroCarousel,
				hero_display_order: heroDisplayOrder,
				video_preview_start: videoPreviewStart,
				video_preview_end: videoPreviewEnd,
				button_text_mode: buttonTextMode as 'predefined' | 'custom' | 'category',
				button_text: buttonText,
				project_category_id: projectCategoryId || null
			};

			// Validate data
			const validated = projectFormSchema.parse(projectData);

			// Update project
			const { error } = await getSupabaseAdmin()
				.from('projects')
				.update({
					...validated,
					updated_at: new Date().toISOString()
				} as never)
				.eq('id', params.id);

			if (error) {
				console.error('Error updating project:', error);
				return fail(500, { error: 'Failed to update project' });
			}

			// Delete old media if changed
			if (typedOldProject) {
				if (
					typedOldProject.featured_image_cloudinary_id !== validated.featured_image_cloudinary_id
				) {
					deleteMedia(typedOldProject.featured_image_cloudinary_id, 'image').catch(console.error);
				}

				if (
					typedOldProject.demo_video_cloudinary_id &&
					typedOldProject.demo_video_cloudinary_id !== validated.demo_video_cloudinary_id
				) {
					deleteMedia(typedOldProject.demo_video_cloudinary_id, 'video').catch(console.error);
				}

				// Delete removed gallery items
				if (typedOldProject.gallery_images && Array.isArray(typedOldProject.gallery_images)) {
					typedOldProject.gallery_images.forEach(
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
