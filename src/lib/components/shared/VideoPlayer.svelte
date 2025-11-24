<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	// Props
	export let videoUrl: string;
	export let cloudinaryId: string = '';
	export let posterUrl: string = '';
	export let autoplay: boolean = false;
	export let loop: boolean = false;
	export let muted: boolean = false;
	export let controls: boolean = true;
	export let lazyLoad: boolean = true;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let className: string = '';

	let videoElement: HTMLVideoElement;
	let isLoaded = false;
	let isIntersecting = false;
	let observer: IntersectionObserver;

	// Generate poster from Cloudinary video if not provided
	$: generatedPoster =
		posterUrl ||
		(cloudinaryId
			? `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0,w_1920,c_limit,q_auto:good/${cloudinaryId}.jpg`
			: '');

	onMount(() => {
		if (lazyLoad && videoElement) {
			// Set up Intersection Observer for lazy loading
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							isIntersecting = true;
							loadVideo();
							observer.disconnect();
						}
					});
				},
				{
					rootMargin: '50px' // Start loading slightly before entering viewport
				}
			);

			observer.observe(videoElement);
		} else {
			// Load immediately if lazy loading is disabled
			loadVideo();
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	function loadVideo() {
		if (!isLoaded && videoElement) {
			isLoaded = true;
			videoElement.load();
		}
	}

	function handlePlay() {
		if (!isLoaded) {
			loadVideo();
		}
	}
</script>

<div class="video-player-container {className}">
	<video
		bind:this={videoElement}
		{controls}
		{autoplay}
		{loop}
		{muted}
		{width}
		{height}
		poster={generatedPoster}
		preload={lazyLoad ? 'none' : 'metadata'}
		class="video-player w-full h-auto rounded-lg"
		on:play={handlePlay}
	>
		{#if isLoaded || !lazyLoad}
			<source src={videoUrl} type="video/mp4" />
			{#if cloudinaryId}
				<!-- WebM alternative -->
				<source
					src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_webm/${cloudinaryId}.webm`}
					type="video/webm"
				/>
			{/if}
			<track kind="captions" />
		{/if}
		<p class="text-text-secondary text-sm">
			Your browser does not support the video tag. <a
				href={videoUrl}
				class="text-primary hover:underline">Download the video</a
			>.
		</p>
	</video>

	{#if !isLoaded && lazyLoad && !isIntersecting}
		<div
			class="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-lg"
		>
			<button
				type="button"
				on:click={loadVideo}
				class="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
			>
				<span class="material-icons">play_arrow</span>
				<span>Load Video</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.video-player-container {
		position: relative;
		width: 100%;
	}

	.video-player {
		display: block;
		max-width: 100%;
		height: auto;
		background-color: rgb(var(--color-background));
	}

	.video-player:focus-visible {
		outline: 2px solid rgb(var(--color-primary));
		outline-offset: 2px;
	}
</style>
