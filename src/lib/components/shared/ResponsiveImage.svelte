<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	// Props
	export let src: string;
	export let cloudinaryId: string = '';
	export let alt: string;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let sizes: string = '100vw';
	export let className: string = '';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let blurUp: boolean = true;
	export let widths: number[] = [400, 800, 1200, 1920];

	let imgElement: HTMLImageElement;
	let isLoaded = false;
	let isError = false;

	// Generate srcset from Cloudinary if cloudinaryId is provided
	$: srcset = cloudinaryId ? generateCloudinarySrcset(cloudinaryId, widths) : '';

	// Generate blur placeholder
	$: blurPlaceholder = cloudinaryId
		? `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_40,q_auto:low,e_blur:1000/${cloudinaryId}`
		: '';

	function generateCloudinarySrcset(id: string, sizes: number[]): string {
		return sizes
			.map((size) => {
				const url = `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${size},c_limit,q_auto:good,f_auto/${id}`;
				return `${url} ${size}w`;
			})
			.join(', ');
	}

	function handleLoad() {
		isLoaded = true;
	}

	function handleError() {
		isError = true;
		console.error('Failed to load image:', src);
	}

	onMount(() => {
		// Check if image is already cached
		if (imgElement && imgElement.complete) {
			isLoaded = true;
		}
	});
</script>

<div
	class="responsive-image-container {className}"
	style:aspect-ratio={width && height ? `${width}/${height}` : undefined}
>
	{#if blurUp && blurPlaceholder && !isLoaded}
		<img src={blurPlaceholder} {alt} class="blur-placeholder" aria-hidden="true" />
	{/if}

	<img
		bind:this={imgElement}
		{src}
		srcset={srcset || undefined}
		{sizes}
		{alt}
		{width}
		{height}
		{loading}
		class="main-image {isLoaded ? 'loaded' : ''}"
		on:load={handleLoad}
		on:error={handleError}
	/>

	{#if isError}
		<div class="error-placeholder">
			<span class="material-icons text-4xl text-text-secondary">broken_image</span>
			<p class="text-sm text-text-secondary mt-2">Failed to load image</p>
		</div>
	{/if}
</div>

<style>
	.responsive-image-container {
		position: relative;
		overflow: hidden;
		width: 100%;
		background-color: rgb(var(--color-surface));
	}

	.blur-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(20px);
		transform: scale(1.1);
		z-index: 1;
	}

	.main-image {
		position: relative;
		width: 100%;
		height: auto;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
		z-index: 2;
	}

	.main-image.loaded {
		opacity: 1;
	}

	.main-image:focus-visible {
		outline: 2px solid rgb(var(--color-primary));
		outline-offset: 2px;
	}

	.error-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgb(var(--color-surface));
		z-index: 3;
	}
</style>
