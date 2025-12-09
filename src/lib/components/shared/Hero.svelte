<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile, Project, HeroAnimationType } from '$lib/types/database';
	import HeroIntro from '$lib/components/hero/HeroIntro.svelte';
	import VideoCarousel from '$lib/components/hero/VideoCarousel.svelte';

	export let profile: Profile | null = null;
	export let heroCarouselProjects: Project[] = [];
	export let animationType: HeroAnimationType = 'fade_up';
	export let introDuration: number = 5000;
	export let videoDuration: number = 5000;

	let showCarousel = false;

	function handleIntroComplete() {
		showCarousel = true;
	}

	onMount(() => {
		// If no carousel projects, stay in intro state
		if (heroCarouselProjects.length === 0) {
			showCarousel = false;
		}
	});
</script>

<section id="hero" class="relative min-h-screen overflow-hidden bg-background">
	<!-- Intro State -->
	{#if heroCarouselProjects.length > 0}
		<HeroIntro {profile} {animationType} {introDuration} onIntroComplete={handleIntroComplete} />
	{:else}
		<!-- Static hero when no carousel projects -->
		<HeroIntro {profile} {animationType} introDuration={999999} onIntroComplete={() => {}} />
	{/if}

	<!-- Video Carousel State -->
	{#if heroCarouselProjects.length > 0}
		<VideoCarousel projects={heroCarouselProjects} {videoDuration} visible={showCarousel} />
	{/if}

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce"
		class:opacity-0={!showCarousel && heroCarouselProjects.length > 0}
		class:opacity-100={showCarousel || heroCarouselProjects.length === 0}
	>
		<a
			href="#stats-section"
			class="flex flex-col items-center text-text-secondary hover:text-primary transition-colors"
			aria-label="Scroll down"
		>
			<span class="text-sm mb-2">Scroll</span>
			<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				/>
			</svg>
		</a>
	</div>
</section>
