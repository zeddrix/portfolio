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
import { createServerClient } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
	console.log('[API /admin/upload] Request received');

	// Check authentication using Authorization header
	const authHeader = request.headers.get('Authorization');
	console.log('[API /admin/upload] Authorization header present:', !!authHeader);

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		console.error('[API /admin/upload] No Authorization header or invalid format');
		throw svelteKitError(401, 'Unauthorized - Please log in');
	}

	const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
	console.log('[API /admin/upload] Access token extracted');

	// Create Supabase client with the access token
	const supabase = createServerClient(accessToken);

	// Verify the token by getting the user
	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error('[API /admin/upload] Invalid access token:', userError);
		throw svelteKitError(401, 'Unauthorized - Please log in');
	}

	console.log('[API /admin/upload] User authenticated:', user.email);

	try {
		const body = await request.json();
		const { dataUrl, mediaType, projectSlug, uploadType } = body;

		console.log('[API /admin/upload] Request body parsed:', {
			mediaType,
			projectSlug,
			uploadType,
			dataUrlLength: dataUrl?.length || 0
		});

		// Validate required fields
		if (!dataUrl || !mediaType || !projectSlug || !uploadType) {
			const missing = [];
			if (!dataUrl) missing.push('dataUrl');
			if (!mediaType) missing.push('mediaType');
			if (!projectSlug) missing.push('projectSlug');
			if (!uploadType) missing.push('uploadType');

			const errorMsg = `Missing required fields: ${missing.join(', ')}`;
			console.error('[API /admin/upload]', errorMsg);
			throw svelteKitError(400, errorMsg);
		}

		// Validate mediaType
		if (!['image', 'video', 'gif'].includes(mediaType)) {
			const errorMsg = `Invalid mediaType '${mediaType}'. Must be: image, video, or gif`;
			console.error('[API /admin/upload]', errorMsg);
			throw svelteKitError(400, errorMsg);
		}

		// Validate uploadType
		if (!['featured', 'gallery', 'demo'].includes(uploadType)) {
			const errorMsg = `Invalid uploadType '${uploadType}'. Must be: featured, gallery, or demo`;
			console.error('[API /admin/upload]', errorMsg);
			throw svelteKitError(400, errorMsg);
		}

		console.log('[API /admin/upload] All validations passed, proceeding with upload');

		let result;

		// Route to appropriate upload function based on uploadType and mediaType
		if (uploadType === 'featured') {
			// Featured images are always images
			if (mediaType !== 'image') {
				const errorMsg = `Featured image must be an image file, got: ${mediaType}`;
				console.error('[API /admin/upload]', errorMsg);
				throw svelteKitError(400, errorMsg);
			}
			console.log(`[API /admin/upload] Uploading featured image for project: ${projectSlug}`);
			result = await uploadProjectFeaturedImage(dataUrl, projectSlug);
		} else if (uploadType === 'gallery') {
			// Gallery can be image, video, or gif
			console.log(`[API /admin/upload] Uploading gallery ${mediaType} for project: ${projectSlug}`);
			result = await uploadGalleryMedia(dataUrl, projectSlug, mediaType);
		} else {
			// uploadType === 'demo'
			// Demo videos
			if (mediaType !== 'video') {
				const errorMsg = `Demo video must be a video file, got: ${mediaType}`;
				console.error('[API /admin/upload]', errorMsg);
				throw svelteKitError(400, errorMsg);
			}
			console.log(`[API /admin/upload] Uploading demo video for project: ${projectSlug}`);
			result = await uploadVideo(
				dataUrl,
				'portfolio/projects/demos',
				`demo_${projectSlug}_${Date.now()}`
			);
		}

		console.log('[API /admin/upload] Upload to Cloudinary successful:', {
			publicId: result.public_id,
			url: result.url,
			resourceType: result.resource_type
		});

		// Return the upload result
		const response = {
			success: true,
			url: result.url,
			cloudinaryId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			resourceType: result.resource_type
		};

		console.log('[API /admin/upload] Returning success response');
		return json(response);
	} catch (err) {
		console.error('[API /admin/upload] Error occurred:', err);

		// If it's already a SvelteKit error, rethrow it
		if (err && typeof err === 'object' && 'status' in err) {
			console.error('[API /admin/upload] Rethrowing SvelteKit error with status:', err.status);
			throw err;
		}

		// Extract detailed error message
		let errorMessage = 'Failed to upload media';
		if (err instanceof Error) {
			errorMessage = err.message;
			console.error('[API /admin/upload] Error details:', {
				name: err.name,
				message: err.message,
				stack: err.stack
			});
		}

		// Otherwise, return a 500 error
		console.error('[API /admin/upload] Returning 500 error:', errorMessage);
		throw svelteKitError(500, errorMessage);
	}
};
