<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Project } from '$lib/types/database';
	import CarouselThumbnails from './CarouselThumbnails.svelte';
	import HeroOverlay from './HeroOverlay.svelte';

	export let projects: Project[] = [];
	export let videoDuration: number = 5000;
	export let visible: boolean = true;

	let currentIndex = 0;
	let videoElement: HTMLVideoElement | null = null;
	let intervalId: ReturnType<typeof setInterval> | undefined;

	$: currentProject = projects[currentIndex];

	function nextVideo() {
		currentIndex = (currentIndex + 1) % projects.length;
	}

	function goToVideo(index: number) {
		currentIndex = index;
		resetInterval();
	}

	function resetInterval() {
		if (intervalId) {
			clearInterval(intervalId);
		}
		intervalId = setInterval(nextVideo, videoDuration);
	}

	onMount(() => {
		if (projects.length > 1) {
			intervalId = setInterval(nextVideo, videoDuration);
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	// Update video time when project changes
	$: if (videoElement && currentProject?.demo_video_url) {
		videoElement.currentTime = currentProject.video_preview_start || 0;
	}
</script>

<div
	class="absolute inset-0 transition-opacity duration-500 {visible
		? 'opacity-100'
		: 'opacity-0 pointer-events-none'}"
>
	{#if projects.length > 0 && currentProject}
		<!-- Video Background -->
		<div class="absolute inset-0 overflow-hidden">
			{#if currentProject.demo_video_url}
				<video
					bind:this={videoElement}
					src={currentProject.demo_video_url}
					class="w-full h-full object-cover"
					autoplay
					loop
					muted
					playsinline
				>
					<track kind="captions" />
				</video>
			{:else}
				<!-- Fallback to featured image -->
				<img
					src={currentProject.featured_image_url}
					alt={currentProject.title}
					class="w-full h-full object-cover"
				/>
			{/if}

			<!-- Dark overlay gradient -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30"
			/>
		</div>

		<!-- Overlay Content -->
		<HeroOverlay project={currentProject} />

		<!-- Thumbnail Carousel -->
		{#if projects.length > 1}
			<CarouselThumbnails {projects} {currentIndex} onSelect={goToVideo} />
		{/if}
	{:else}
		<!-- Fallback when no carousel projects -->
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="text-center">
				<h2 class="text-3xl font-bold text-text-primary mb-4">Welcome to My Portfolio</h2>
				<p class="text-text-secondary">Explore my projects below</p>
			</div>
		</div>
	{/if}
</div>
