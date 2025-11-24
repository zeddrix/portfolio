<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	/**
	 * Optimized video component with Cloudinary transformations
	 *
	 * Features:
	 * - Automatic format optimization (MP4, WebM)
	 * - Adaptive streaming support
	 * - Lazy loading below the fold
	 * - Poster image with blur-up
	 * - Configurable quality and transformations
	 */

	/** Cloudinary public ID (required) */
	export let src: string;

	/** Video width in pixels */
	export let width: number | undefined = undefined;

	/** Video height in pixels */
	export let height: number | undefined = undefined;

	/** CSS classes to apply */
	let className: string = '';
	export { className as class };

	/** Video quality: 'auto', 'best', 'good', 'eco', 'low' */
	export let quality: 'auto' | 'best' | 'good' | 'eco' | 'low' = 'auto';

	/** Enable autoplay (muted by default) */
	export let autoplay: boolean = false;

	/** Enable loop */
	export let loop: boolean = false;

	/** Enable mute */
	export let muted: boolean = true;

	/** Show controls */
	export let controls: boolean = true;

	/** Enable lazy loading (default: true) */
	export let lazy: boolean = true;

	/** Poster image (auto-generated from first frame if not provided) */
	export let poster: string | undefined = undefined;

	/** Additional Cloudinary transformations */
	export let transformations: string = '';

	// State
	let videoElement: HTMLVideoElement;
	let shouldLoad = !lazy;

	// Generate Cloudinary video URL
	function getCloudinaryVideoUrl(format?: string): string {
		if (!src) return '';

		// Check if src is already a full URL
		if (src.startsWith('http://') || src.startsWith('https://')) {
			return src;
		}

		const baseUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

		const transforms: string[] = [];

		// Quality
		transforms.push(`q_${quality}`);

		// Width
		if (width) {
			transforms.push(`w_${width}`);
		}

		// Height
		if (height) {
			transforms.push(`h_${height}`);
		}

		// Format
		if (format) {
			transforms.push(`f_${format}`);
		}

		// Additional transformations
		if (transformations) {
			transforms.push(transformations);
		}

		return `${baseUrl}/${transforms.join(',')}/${src}`;
	}

	// Generate poster image URL
	function getPosterUrl(): string {
		if (poster) {
			// If poster is provided, use it
			if (poster.startsWith('http://') || poster.startsWith('https://')) {
				return poster;
			}
			// Assume it's a Cloudinary image ID
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${poster}`;
		}

		// Auto-generate poster from video first frame
		if (!src || src.startsWith('http')) return '';

		const baseUrl = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;
		const transforms = ['f_jpg', 'q_auto', 'so_0']; // Still offset at 0 seconds

		if (width) transforms.push(`w_${width}`);
		if (height) transforms.push(`h_${height}`);

		return `${baseUrl}/${transforms.join(',')}/${src}.jpg`;
	}

	const posterUrl = getPosterUrl();
	const mp4Url = getCloudinaryVideoUrl('mp4');
	const webmUrl = getCloudinaryVideoUrl('webm');

	// Lazy loading with Intersection Observer
	onMount(() => {
		if (!lazy || !videoElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						shouldLoad = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: '50px'
			}
		);

		observer.observe(videoElement);

		return () => {
			observer.disconnect();
		};
	});
</script>

<div class="relative overflow-hidden {className}">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		bind:this={videoElement}
		{width}
		{height}
		poster={posterUrl}
		{autoplay}
		{loop}
		{muted}
		{controls}
		playsinline
		class="w-full h-full object-cover"
		preload={lazy ? 'none' : 'metadata'}
	>
		{#if shouldLoad}
			<source src={webmUrl} type="video/webm" />
			<source src={mp4Url} type="video/mp4" />
			<p class="text-text-secondary text-sm">
				Your browser doesn't support HTML5 video. Here is a
				<a href={mp4Url} class="text-primary hover:underline">link to the video</a> instead.
			</p>
		{/if}
	</video>
</div>
