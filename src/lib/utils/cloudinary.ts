/**
 * Client-side Cloudinary utility functions
 * These can be used in Svelte components for generating optimized media URLs
 */

import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

/**
 * Generate responsive image srcset for Cloudinary image
 * @param cloudinaryId - The public_id of the image
 * @param widths - Array of widths to generate
 * @returns Srcset string for img element
 */
export function generateImageSrcset(
	cloudinaryId: string,
	widths: number[] = [400, 800, 1200, 1920]
): string {
	return widths
		.map((width) => {
			const url = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},c_limit,q_auto:good,f_auto/${cloudinaryId}`;
			return `${url} ${width}w`;
		})
		.join(', ');
}

/**
 * Generate blur placeholder URL for progressive image loading
 * @param cloudinaryId - The public_id of the image
 * @returns Tiny blurred image URL
 */
export function generateBlurPlaceholder(cloudinaryId: string): string {
	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_40,q_auto:low,e_blur:1000/${cloudinaryId}`;
}

/**
 * Generate optimized image URL with transformations
 * @param cloudinaryId - The public_id of the image
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function generateOptimizedImageUrl(
	cloudinaryId: string,
	options: {
		width?: number;
		height?: number;
		quality?: 'auto:low' | 'auto:good' | 'auto:best' | 'auto';
		format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
		crop?: 'limit' | 'fill' | 'scale' | 'fit';
	} = {}
): string {
	const { width, height, quality = 'auto:good', format = 'auto', crop = 'limit' } = options;

	const transformations: string[] = [];

	if (width) transformations.push(`w_${width}`);
	if (height) transformations.push(`h_${height}`);
	transformations.push(`c_${crop}`);
	transformations.push(`q_${quality}`);
	transformations.push(`f_${format}`);

	const transformString = transformations.join(',');

	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${cloudinaryId}`;
}

/**
 * Generate video thumbnail/poster URL
 * @param videoCloudinaryId - The public_id of the video
 * @param timeInSeconds - Time in seconds for the thumbnail (default: 0)
 * @returns Video thumbnail URL
 */
export function generateVideoThumbnail(videoCloudinaryId: string, timeInSeconds = 0): string {
	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_${timeInSeconds},w_1920,c_limit,q_auto:good/${videoCloudinaryId}.jpg`;
}

/**
 * Generate optimized video URL
 * @param videoCloudinaryId - The public_id of the video
 * @param options - Video transformation options
 * @returns Optimized video URL
 */
export function generateOptimizedVideoUrl(
	videoCloudinaryId: string,
	options: {
		width?: number;
		height?: number;
		quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
		format?: 'mp4' | 'webm' | 'auto';
	} = {}
): string {
	const { width, height, quality = 'auto', format = 'auto' } = options;

	const transformations: string[] = [];

	if (width) transformations.push(`w_${width}`);
	if (height) transformations.push(`h_${height}`);
	if (width || height) transformations.push('c_limit');
	transformations.push(`q_${quality}`);
	if (format !== 'auto') transformations.push(`f_${format}`);

	const transformString = transformations.join(',');

	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${transformString}/${videoCloudinaryId}.${format === 'auto' ? 'mp4' : format}`;
}

/**
 * Generate HLS streaming URL for adaptive bitrate video
 * @param videoCloudinaryId - The public_id of the video
 * @returns HLS streaming URL
 */
export function generateHlsUrl(videoCloudinaryId: string): string {
	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/sp_hd/${videoCloudinaryId}.m3u8`;
}

/**
 * Generate DASH streaming URL for adaptive bitrate video
 * @param videoCloudinaryId - The public_id of the video
 * @returns DASH streaming URL
 */
export function generateDashUrl(videoCloudinaryId: string): string {
	return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/sp_hd/${videoCloudinaryId}.mpd`;
}

/**
 * Check if media is from Cloudinary
 * @param url - Media URL to check
 * @returns True if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
	return url.includes('res.cloudinary.com') || url.includes(PUBLIC_CLOUDINARY_CLOUD_NAME);
}

/**
 * Extract Cloudinary public_id from URL
 * @param url - Cloudinary URL
 * @returns Public ID or empty string if not extractable
 */
export function extractCloudinaryId(url: string): string {
	if (!isCloudinaryUrl(url)) {
		return '';
	}

	// Pattern: .../upload/[transformations]/public_id.ext
	const match = url.match(/\/upload\/(?:v\d+\/)?(?:[^/]+\/)*([^/.]+)(?:\.[^.]+)?$/);
	return match ? match[1] : '';
}
