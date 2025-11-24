/**
 * Cloudinary server-side utilities for image upload and management
 */

import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} from '$env/static/private';

// Configure Cloudinary
cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

/**
 * Upload result interface
 */
export interface CloudinaryUploadResult {
	url: string;
	public_id: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
}

/**
 * Upload an image to Cloudinary from a base64 data URL
 * @param dataUrl - Base64 data URL of the image
 * @param folder - Cloudinary folder to upload to (default: 'portfolio')
 * @param publicId - Optional custom public ID for the image
 * @returns Upload result with URL and public_id
 */
export async function uploadImage(
	dataUrl: string,
	folder = 'portfolio',
	publicId?: string
): Promise<CloudinaryUploadResult> {
	try {
		const uploadOptions: Record<string, unknown> = {
			folder,
			resource_type: 'image',
			transformation: {
				width: 1200,
				height: 1200,
				crop: 'limit',
				quality: 'auto:good',
				fetch_format: 'auto'
			}
		};

		if (publicId) {
			uploadOptions.public_id = publicId;
		}

		const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

		return {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			resource_type: result.resource_type
		};
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		throw new Error('Failed to upload image to Cloudinary');
	}
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public_id of the image to delete
 * @returns Deletion result
 */
export async function deleteImage(publicId: string): Promise<boolean> {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result.result === 'ok';
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		return false;
	}
}

/**
 * Generate a transformation URL for an image
 * @param publicId - The public_id of the image
 * @param transformations - Transformation parameters
 * @returns Transformed image URL
 */
export function getTransformedImageUrl(
	publicId: string,
	transformations: Record<string, string | number> = {}
): string {
	return cloudinary.url(publicId, {
		secure: true,
		...transformations
	});
}

/**
 * Upload profile image with specific optimizations
 * @param dataUrl - Base64 data URL of the image
 * @param userId - User ID for unique naming
 * @returns Upload result
 */
export async function uploadProfileImage(
	dataUrl: string,
	userId: string
): Promise<CloudinaryUploadResult> {
	const publicId = `profile_${userId}`;

	return uploadImage(dataUrl, 'portfolio/profiles', publicId);
}

/**
 * Upload a video to Cloudinary from a base64 data URL
 * @param dataUrl - Base64 data URL of the video
 * @param folder - Cloudinary folder to upload to (default: 'portfolio/videos')
 * @param publicId - Optional custom public ID for the video
 * @returns Upload result with URL and public_id
 */
export async function uploadVideo(
	dataUrl: string,
	folder = 'portfolio/videos',
	publicId?: string
): Promise<CloudinaryUploadResult> {
	try {
		const uploadOptions: Record<string, unknown> = {
			folder,
			resource_type: 'video',
			eager: [
				{
					quality: 'auto',
					fetch_format: 'auto'
				}
			],
			eager_async: true
		};

		if (publicId) {
			uploadOptions.public_id = publicId;
		}

		const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

		return {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width || 0,
			height: result.height || 0,
			format: result.format,
			resource_type: result.resource_type
		};
	} catch (error) {
		console.error('Cloudinary video upload error:', error);
		throw new Error('Failed to upload video to Cloudinary');
	}
}

/**
 * Upload a GIF to Cloudinary (optionally convert to video for optimization)
 * @param dataUrl - Base64 data URL of the GIF
 * @param folder - Cloudinary folder to upload to (default: 'portfolio/gifs')
 * @param convertToVideo - Whether to convert GIF to video format for better performance
 * @param publicId - Optional custom public ID
 * @returns Upload result with URL and public_id
 */
export async function uploadGif(
	dataUrl: string,
	folder = 'portfolio/gifs',
	convertToVideo = false,
	publicId?: string
): Promise<CloudinaryUploadResult> {
	try {
		const uploadOptions: Record<string, string | number | boolean> = {
			folder,
			resource_type: convertToVideo ? 'video' : 'image'
		};

		if (publicId) {
			uploadOptions.public_id = publicId;
		}

		if (convertToVideo) {
			// Convert GIF to video format (MP4/WebM) for better performance
			uploadOptions.format = 'mp4';
			uploadOptions.quality = 'auto';
		}

		const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

		return {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width || 0,
			height: result.height || 0,
			format: result.format,
			resource_type: result.resource_type
		};
	} catch (error) {
		console.error('Cloudinary GIF upload error:', error);
		throw new Error('Failed to upload GIF to Cloudinary');
	}
}

/**
 * Upload project featured image with optimizations
 * @param dataUrl - Base64 data URL of the image
 * @param projectSlug - Project slug for unique naming
 * @returns Upload result
 */
export async function uploadProjectFeaturedImage(
	dataUrl: string,
	projectSlug: string
): Promise<CloudinaryUploadResult> {
	const publicId = `featured_${projectSlug}_${Date.now()}`;

	try {
		const uploadOptions = {
			folder: 'portfolio/projects/featured',
			resource_type: 'image' as const,
			public_id: publicId,
			transformation: {
				width: 1920,
				height: 1080,
				crop: 'limit',
				quality: 'auto:good',
				fetch_format: 'auto'
			}
		};

		const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

		return {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			resource_type: result.resource_type
		};
	} catch (error) {
		console.error('Cloudinary featured image upload error:', error);
		throw new Error('Failed to upload featured image to Cloudinary');
	}
}

/**
 * Upload gallery media (image, video, or GIF) to Cloudinary
 * @param dataUrl - Base64 data URL of the media
 * @param projectSlug - Project slug for organizing uploads
 * @param mediaType - Type of media: 'image', 'video', or 'gif'
 * @returns Upload result
 */
export async function uploadGalleryMedia(
	dataUrl: string,
	projectSlug: string,
	mediaType: 'image' | 'video' | 'gif'
): Promise<CloudinaryUploadResult> {
	const timestamp = Date.now();
	const publicId = `gallery_${projectSlug}_${mediaType}_${timestamp}`;

	switch (mediaType) {
		case 'image':
			return uploadImage(dataUrl, 'portfolio/projects/gallery', publicId);
		case 'video':
			return uploadVideo(dataUrl, 'portfolio/projects/gallery', publicId);
		case 'gif':
			// Convert GIFs to video for better performance (90%+ size reduction)
			return uploadGif(dataUrl, 'portfolio/projects/gallery', true, publicId);
		default:
			throw new Error(`Unsupported media type: ${mediaType}`);
	}
}

/**
 * Delete media from Cloudinary (handles all resource types)
 * @param publicId - The public_id of the media to delete
 * @param resourceType - The resource type ('image', 'video', 'raw')
 * @returns Deletion result
 */
export async function deleteMedia(
	publicId: string,
	resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<boolean> {
	try {
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType
		});
		return result.result === 'ok';
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		return false;
	}
}

/**
 * Generate a responsive image srcset for different screen sizes
 * @param publicId - The public_id of the image
 * @param widths - Array of widths to generate (default: [400, 800, 1200, 1920])
 * @returns Object with URLs for each width
 */
export function generateResponsiveImageUrls(
	publicId: string,
	widths = [400, 800, 1200, 1920]
): Record<number, string> {
	const urls: Record<number, string> = {};

	widths.forEach((width) => {
		urls[width] = cloudinary.url(publicId, {
			secure: true,
			width,
			crop: 'limit',
			quality: 'auto:good',
			fetch_format: 'auto'
		});
	});

	return urls;
}

/**
 * Generate a responsive image srcset string for HTML img element
 * @param publicId - The public_id of the image
 * @param widths - Array of widths to generate (default: [400, 800, 1200, 1920])
 * @returns Srcset string for use in img elements
 */
export function generateImageSrcset(publicId: string, widths = [400, 800, 1200, 1920]): string {
	return widths
		.map((width) => {
			const url = cloudinary.url(publicId, {
				secure: true,
				width,
				crop: 'limit',
				quality: 'auto:good',
				fetch_format: 'auto'
			});
			return `${url} ${width}w`;
		})
		.join(', ');
}

/**
 * Generate a blur placeholder (LQIP - Low Quality Image Placeholder) for progressive loading
 * @param publicId - The public_id of the image
 * @returns Tiny blurred image URL for placeholder
 */
export function generateBlurPlaceholder(publicId: string): string {
	return cloudinary.url(publicId, {
		secure: true,
		width: 40,
		quality: 'auto:low',
		fetch_format: 'auto',
		effect: 'blur:1000'
	});
}

/**
 * Generate video thumbnail/poster image
 * @param videoPublicId - The public_id of the video
 * @param time - Time in seconds for the thumbnail (default: 0)
 * @returns URL of the video thumbnail
 */
export function generateVideoThumbnail(videoPublicId: string, time = 0): string {
	return cloudinary.url(videoPublicId, {
		secure: true,
		resource_type: 'video',
		format: 'jpg',
		start_offset: time,
		quality: 'auto:good',
		width: 1920,
		crop: 'limit'
	});
}

/**
 * Generate video URL with optimizations (transcoding, format, quality)
 * @param videoPublicId - The public_id of the video
 * @param options - Video transformation options
 * @returns Optimized video URL
 */
export function generateOptimizedVideoUrl(
	videoPublicId: string,
	options: {
		width?: number;
		height?: number;
		quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
		format?: 'mp4' | 'webm' | 'auto';
		bitRate?: string;
	} = {}
): string {
	const { width, height, quality = 'auto', format = 'auto', bitRate } = options;

	const transformation: Record<string, string | number | boolean> = {
		secure: true,
		resource_type: 'video',
		quality,
		fetch_format: format
	};

	if (width) transformation.width = width;
	if (height) transformation.height = height;
	if (width || height) transformation.crop = 'limit';
	if (bitRate) transformation.bit_rate = bitRate;

	return cloudinary.url(videoPublicId, transformation);
}

/**
 * Generate adaptive bitrate streaming URLs (HLS/DASH) for video
 * @param videoPublicId - The public_id of the video
 * @returns Object with HLS and DASH streaming URLs
 */
export function generateStreamingUrls(videoPublicId: string): {
	hls: string;
	dash: string;
} {
	return {
		hls: cloudinary.url(videoPublicId, {
			secure: true,
			resource_type: 'video',
			format: 'm3u8',
			streaming_profile: 'hd'
		}),
		dash: cloudinary.url(videoPublicId, {
			secure: true,
			resource_type: 'video',
			format: 'mpd',
			streaming_profile: 'hd'
		})
	};
}

/**
 * Upload video with advanced optimizations (adaptive streaming, multiple formats)
 * @param dataUrl - Base64 data URL of the video
 * @param folder - Cloudinary folder to upload to
 * @param publicId - Optional custom public ID
 * @returns Upload result with URL and streaming URLs
 */
export async function uploadVideoAdvanced(
	dataUrl: string,
	folder = 'portfolio/videos',
	publicId?: string
): Promise<CloudinaryUploadResult & { streaming?: { hls: string; dash: string } }> {
	try {
		const uploadOptions: Record<string, string | number | boolean | object> = {
			folder,
			resource_type: 'video',
			// Eager transformations for immediate availability
			eager: [
				{
					streaming_profile: 'hd',
					format: 'm3u8'
				},
				{
					quality: 'auto',
					format: 'mp4',
					width: 1920,
					crop: 'limit'
				},
				{
					quality: 'auto',
					format: 'webm',
					width: 1920,
					crop: 'limit'
				}
			],
			eager_async: true
		};

		if (publicId) {
			uploadOptions.public_id = publicId;
		}

		const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

		const response: CloudinaryUploadResult & { streaming?: { hls: string; dash: string } } = {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width || 0,
			height: result.height || 0,
			format: result.format,
			resource_type: result.resource_type
		};

		// Add streaming URLs if available
		if (result.resource_type === 'video') {
			response.streaming = generateStreamingUrls(result.public_id);
		}

		return response;
	} catch (error) {
		console.error('Cloudinary advanced video upload error:', error);
		throw new Error('Failed to upload video with advanced optimizations');
	}
}
