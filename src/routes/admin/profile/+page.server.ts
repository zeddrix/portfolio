/**
 * Admin profile management - server-side load and actions
 */

import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '$lib/server/supabase';
import { profileSchema, socialLinkSchema, socialLinksReorderSchema } from '$lib/schemas/profile';
import { uploadProfileImage, deleteImage } from '$lib/server/cloudinary';
import type { Database } from '$lib/types/database';

type Profile = Database['public']['Tables']['profile']['Row'];
type SocialLink = Database['public']['Tables']['social_links']['Row'];

/**
 * Load profile and social links data
 */
export const load: PageServerLoad = async () => {
	const supabase = createServerClient();

	// Fetch profile
	const { data: profile, error: profileError } = await supabase
		.from('profile')
		.select('*')
		.single();

	if (profileError) {
		console.error('Error fetching profile:', profileError);
	}

	// Fetch all social links (including hidden ones for admin)
	const { data: socialLinks, error: linksError } = await supabase
		.from('social_links')
		.select('*')
		.order('display_order', { ascending: true });

	if (linksError) {
		console.error('Error fetching social links:', linksError);
	}

	return {
		profile: (profile || null) as Profile | null,
		socialLinks: (socialLinks || []) as SocialLink[]
	};
};

/**
 * Form actions for profile management
 */
export const actions: Actions = {
	/**
	 * Update profile information
	 */
	updateProfile: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();

		// Parse form data
		const profileData = {
			full_name: formData.get('full_name'),
			tagline: formData.get('tagline'),
			bio: formData.get('bio'),
			email: formData.get('email'),
			phone: formData.get('phone') || null,
			linkedin_url: formData.get('linkedin_url') || null,
			github_url: formData.get('github_url') || null,
			website_url: formData.get('website_url') || null,
			location: formData.get('location') || null,
			available_for_work: formData.get('available_for_work') === 'true',
			profile_image_url: formData.get('profile_image_url') || null,
			profile_image_cloudinary_id: formData.get('profile_image_cloudinary_id') || null
		};

		// Handle image upload if new image provided
		const imageDataUrl = formData.get('new_image_data') as string | null;
		const oldCloudinaryId = formData.get('old_cloudinary_id') as string | null;

		if (imageDataUrl) {
			try {
				// Get profile ID for unique naming
				const { data: currentProfile } = await supabase.from('profile').select('id').single();

				if (!currentProfile) {
					return fail(400, { error: 'Profile not found' });
				}

				// Upload new image
				const typedProfile = currentProfile as Pick<Profile, 'id'> | null;
				const uploadResult = await uploadProfileImage(imageDataUrl, typedProfile?.id || '');

				// Delete old image if it exists
				if (oldCloudinaryId) {
					await deleteImage(oldCloudinaryId);
				}

				// Update profile data with new image
				profileData.profile_image_url = uploadResult.url;
				profileData.profile_image_cloudinary_id = uploadResult.public_id;
			} catch (error) {
				console.error('Image upload error:', error);
				return fail(500, { error: 'Failed to upload profile image' });
			}
		}

		// Validate data
		const validation = profileSchema.safeParse(profileData);

		if (!validation.success) {
			return fail(400, {
				error: 'Validation failed',
				errors: validation.error.flatten().fieldErrors
			});
		}

		// Get profile ID
		const { data: currentProfile } = await supabase.from('profile').select('id').single();
		const typedCurrentProfile = currentProfile as Pick<Profile, 'id'> | null;

		// Update profile in database
		const { error } = await supabase
			.from('profile')
			.update({
				...validation.data,
				updated_at: new Date().toISOString()
			} as never)
			.eq('id', typedCurrentProfile?.id || '');

		if (error) {
			console.error('Error updating profile:', error);
			return fail(500, { error: 'Failed to update profile' });
		}

		return { success: true, message: 'Profile updated successfully' };
	},

	/**
	 * Create new social link
	 */
	createSocialLink: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();

		const linkData = {
			platform: formData.get('platform'),
			url: formData.get('url'),
			icon_name: formData.get('icon_name'),
			is_visible: formData.get('is_visible') === 'true'
		};

		// Validate data
		const validation = socialLinkSchema.safeParse(linkData);

		if (!validation.success) {
			return fail(400, {
				error: 'Validation failed',
				errors: validation.error.flatten().fieldErrors
			});
		}

		// Get next display order
		const { data: existingLinks } = await supabase
			.from('social_links')
			.select('display_order')
			.order('display_order', { ascending: false })
			.limit(1);

		const typedExistingLinks = existingLinks as Pick<SocialLink, 'display_order'>[] | null;
		const nextOrder =
			typedExistingLinks && typedExistingLinks.length > 0
				? typedExistingLinks[0].display_order + 1
				: 0;

		// Insert new social link
		const { error } = await supabase.from('social_links').insert({
			...validation.data,
			display_order: nextOrder
		} as never);

		if (error) {
			console.error('Error creating social link:', error);
			return fail(500, { error: 'Failed to create social link' });
		}

		return { success: true, message: 'Social link created successfully' };
	},

	/**
	 * Update existing social link
	 */
	updateSocialLink: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();

		const linkId = formData.get('id') as string;
		const linkData = {
			platform: formData.get('platform'),
			url: formData.get('url'),
			icon_name: formData.get('icon_name'),
			is_visible: formData.get('is_visible') === 'true'
		};

		// Validate data
		const validation = socialLinkSchema.safeParse(linkData);

		if (!validation.success) {
			return fail(400, {
				error: 'Validation failed',
				errors: validation.error.flatten().fieldErrors
			});
		}

		// Update social link
		const { error } = await supabase
			.from('social_links')
			.update(validation.data as never)
			.eq('id', linkId);

		if (error) {
			console.error('Error updating social link:', error);
			return fail(500, { error: 'Failed to update social link' });
		}

		return { success: true, message: 'Social link updated successfully' };
	},

	/**
	 * Delete social link
	 */
	deleteSocialLink: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const linkId = formData.get('id') as string;

		const { error } = await supabase.from('social_links').delete().eq('id', linkId);

		if (error) {
			console.error('Error deleting social link:', error);
			return fail(500, { error: 'Failed to delete social link' });
		}

		return { success: true, message: 'Social link deleted successfully' };
	},

	/**
	 * Reorder social links
	 */
	reorderSocialLinks: async ({ request }) => {
		const supabase = createServerClient();
		const formData = await request.formData();
		const linksJson = formData.get('links') as string;

		try {
			const linksData = JSON.parse(linksJson);

			// Validate data
			const validation = socialLinksReorderSchema.safeParse({ links: linksData });

			if (!validation.success) {
				return fail(400, {
					error: 'Validation failed',
					errors: validation.error.flatten().fieldErrors
				});
			}

			// Update display order for each link
			const updates = validation.data.links.map((link) =>
				supabase
					.from('social_links')
					.update({ display_order: link.display_order } as never)
					.eq('id', link.id)
			);

			await Promise.all(updates);

			return { success: true, message: 'Social links reordered successfully' };
		} catch (error) {
			console.error('Error reordering social links:', error);
			return fail(500, { error: 'Failed to reorder social links' });
		}
	}
};
