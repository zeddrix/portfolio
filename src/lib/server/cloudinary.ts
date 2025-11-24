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
		const uploadOptions: Record<string, string> = {
			folder,
			resource_type: 'image',
			transformation: [
				{
					width: 1200,
					height: 1200,
					crop: 'limit',
					quality: 'auto:good',
					fetch_format: 'auto'
				}
			]
				.map((t) => JSON.stringify(t))
				.join(',')
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
