<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	/**
	 * Optimized image component with Cloudinary transformations
	 *
	 * Features:
	 * - Responsive images with srcset
	 * - Lazy loading below the fold
	 * - Blur-up placeholder (LQIP - Low Quality Image Placeholder)
	 * - WebP/AVIF automatic format selection
	 * - Configurable quality and transformations
	 */

	/** Cloudinary public ID (required) */
	export let src: string;

	/** Alt text for accessibility (required) */
	export let alt: string;

	/** Image width in pixels (for responsive sizing) */
	export let width: number | undefined = undefined;

	/** Image height in pixels (for responsive sizing) */
	export let height: number | undefined = undefined;

	/** CSS classes to apply */
	let className: string = '';
	export { className as class };

	/** Image quality (1-100, default: 80 for good balance) */
	export let quality: number = 80;

	/** Enable lazy loading (default: true) */
	export let lazy: boolean = true;

	/** Enable blur-up placeholder (default: true) */
	export let blurUp: boolean = true;

	/** Aspect ratio (e.g., '16:9', '4:3', '1:1') */
	export let aspectRatio: string | undefined = undefined;

	/** Crop mode: 'fill', 'fit', 'scale', 'crop', 'thumb', 'pad' */
	export let crop: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' = 'fill';

	/** Gravity for cropping (e.g., 'auto', 'face', 'center', 'north') */
	export let gravity: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west' = 'auto';

	/** Additional Cloudinary transformations */
	export let transformations: string = '';

	// State
	let loaded = false;
	let error = false;
	let imageElement: HTMLImageElement;

	// Generate Cloudinary URL with transformations
	function getCloudinaryUrl(options: {
		width?: number;
		quality?: number;
		format?: string;
		blur?: boolean;
	}): string {
		if (!src) return '';

		// Check if src is already a full URL
		if (src.startsWith('http://') || src.startsWith('https://')) {
			return src;
		}

		const baseUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

		const transforms: string[] = [];

		// Format
		if (options.format) {
			transforms.push(`f_${options.format}`);
		} else {
			transforms.push('f_auto'); // Auto format (WebP/AVIF)
		}

		// Quality
		transforms.push(`q_${options.quality || quality}`);

		// Width
		if (options.width) {
			transforms.push(`w_${options.width}`);
		} else if (width) {
			transforms.push(`w_${width}`);
		}

		// Height
		if (height) {
			transforms.push(`h_${height}`);
		}

		// Aspect ratio
		if (aspectRatio) {
			transforms.push(`ar_${aspectRatio.replace(':', '_')}`);
		}

		// Crop mode
		transforms.push(`c_${crop}`);

		// Gravity
		if (crop === 'fill' || crop === 'crop' || crop === 'thumb') {
			transforms.push(`g_${gravity}`);
		}

		// Blur for placeholder
		if (options.blur) {
			transforms.push('e_blur:1000', 'q_1');
		}

		// Additional transformations
		if (transformations) {
			transforms.push(transformations);
		}

		// DPR (Device Pixel Ratio) for retina displays
		transforms.push('dpr_auto');

		return `${baseUrl}/${transforms.join(',')}/${src}`;
	}

	// Generate srcset for responsive images
	function getSrcSet(): string {
		if (!src || src.startsWith('http')) return '';

		const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
		const srcsetEntries = widths
			.filter((w) => !width || w <= width * 2) // Only include up to 2x the specified width
			.map((w) => `${getCloudinaryUrl({ width: w })} ${w}w`);

		return srcsetEntries.join(', ');
	}

	// Placeholder URL (low quality, blurred)
	const placeholderUrl = blurUp ? getCloudinaryUrl({ width: 20, quality: 1, blur: true }) : '';

	// Main image URL
	const mainUrl = getCloudinaryUrl({});

	// Srcset for responsive images
	const srcset = getSrcSet();

	// Sizes attribute for responsive images
	$: sizes = width ? `(max-width: ${width}px) 100vw, ${width}px` : '100vw';

	// Handle image load
	function handleLoad() {
		loaded = true;
	}

	// Handle image error
	function handleError() {
		error = true;
		console.error('Failed to load image:', src);
	}

	// Lazy loading with Intersection Observer
	onMount(() => {
		if (!lazy || !imageElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Start loading the image
						const img = entry.target as HTMLImageElement;
						if (img.dataset.src) {
							img.src = img.dataset.src;
						}
						if (img.dataset.srcset) {
							img.srcset = img.dataset.srcset;
						}
						observer.unobserve(img);
					}
				});
			},
			{
				rootMargin: '50px' // Start loading 50px before entering viewport
			}
		);

		observer.observe(imageElement);

		return () => {
			observer.disconnect();
		};
	});
</script>

<div class="relative overflow-hidden {className}">
	{#if blurUp && placeholderUrl && !loaded}
		<img
			src={placeholderUrl}
			{alt}
			class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
			style="filter: blur(10px); transform: scale(1.1);"
			aria-hidden="true"
		/>
	{/if}

	<img
		bind:this={imageElement}
		src={lazy ? placeholderUrl : mainUrl}
		data-src={lazy ? mainUrl : undefined}
		data-srcset={lazy && srcset ? srcset : undefined}
		srcset={!lazy && srcset ? srcset : undefined}
		{sizes}
		{alt}
		{width}
		{height}
		class="w-full h-full object-cover transition-opacity duration-300 {loaded
			? 'opacity-100'
			: 'opacity-0'}"
		loading={lazy ? 'lazy' : 'eager'}
		on:load={handleLoad}
		on:error={handleError}
	/>

	{#if error}
		<div
			class="absolute inset-0 flex items-center justify-center bg-surface/50 text-text-secondary"
		>
			<span class="text-sm">Failed to load image</span>
		</div>
	{/if}
</div>
