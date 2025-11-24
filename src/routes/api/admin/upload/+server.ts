/**
 * Admin API endpoint for uploading media to Cloudinary
 * Handles images, videos, and GIFs with automatic optimization
 */

import { json, error as svelteKitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	uploadProjectFeaturedImage,
	uploadGalleryMedia,
	uploadVideo
} from '$lib/server/cloudinary';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw svelteKitError(401, 'Unauthorized');
	}

	try {
		const body = await request.json();
		const { dataUrl, mediaType, projectSlug, uploadType } = body;

		// Validate required fields
		if (!dataUrl || !mediaType || !projectSlug || !uploadType) {
			throw svelteKitError(
				400,
				'Missing required fields: dataUrl, mediaType, projectSlug, uploadType'
			);
		}

		// Validate mediaType
		if (!['image', 'video', 'gif'].includes(mediaType)) {
			throw svelteKitError(400, 'Invalid mediaType. Must be: image, video, or gif');
		}

		// Validate uploadType
		if (!['featured', 'gallery', 'demo'].includes(uploadType)) {
			throw svelteKitError(400, 'Invalid uploadType. Must be: featured, gallery, or demo');
		}

		let result;

		// Route to appropriate upload function based on uploadType and mediaType
		if (uploadType === 'featured') {
			// Featured images are always images
			if (mediaType !== 'image') {
				throw svelteKitError(400, 'Featured image must be an image file');
			}
			result = await uploadProjectFeaturedImage(dataUrl, projectSlug);
		} else if (uploadType === 'gallery') {
			// Gallery can be image, video, or gif
			result = await uploadGalleryMedia(dataUrl, projectSlug, mediaType);
		} else {
			// uploadType === 'demo'
			// Demo videos
			if (mediaType !== 'video') {
				throw svelteKitError(400, 'Demo video must be a video file');
			}
			result = await uploadVideo(
				dataUrl,
				'portfolio/projects/demos',
				`demo_${projectSlug}_${Date.now()}`
			);
		}

		// Return the upload result
		return json({
			success: true,
			url: result.url,
			cloudinaryId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			resourceType: result.resource_type
		});
	} catch (err) {
		console.error('Upload error:', err);

		// If it's already a SvelteKit error, rethrow it
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		// Otherwise, return a 500 error
		throw svelteKitError(500, err instanceof Error ? err.message : 'Failed to upload media');
	}
};
