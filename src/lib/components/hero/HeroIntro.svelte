<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile, HeroAnimationType } from '$lib/types/database';

	export let profile: Profile | null = null;
	export let animationType: HeroAnimationType = 'fade_up';
	export let introDuration: number = 3000; // Reduced to 2-3 seconds for hybrid approach
	export let onIntroComplete: () => void = () => {};

	let visible = true;
	let animationClass = '';

	// Extract profile data with fallbacks
	$: fullName = profile?.full_name || 'Zeddrix Fabian';
	$: tagline = profile?.tagline || 'Full-Stack Web Developer';

	// Set animation class based on type
	$: {
		switch (animationType) {
			case 'fade_up':
				animationClass = 'animate-fade-up';
				break;
			case 'typewriter':
				animationClass = 'animate-typewriter';
				break;
			case 'slide_in':
				animationClass = 'animate-slide-in';
				break;
			default:
				animationClass = 'animate-fade-up';
		}
	}

	onMount(() => {
		// Transition to video carousel after intro duration
		const timer = setTimeout(() => {
			visible = false;
			setTimeout(onIntroComplete, 500); // Wait for fade out
		}, introDuration);

		return () => clearTimeout(timer);
	});
</script>

<div
	class="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-500 {visible
		? 'opacity-100'
		: 'opacity-0 pointer-events-none'}"
>
	<!-- Dark overlay background -->
	<div class="absolute inset-0 bg-black/70">
		<div class="hero-bg-gradient" />
	</div>

	<!-- Centered Content - Squarespace Style -->
	<div class="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Main Headline - Elegant Serif Italic -->
		<h1 class="heading-hero text-white mb-4 {animationClass}" style="animation-delay: 0ms;">
			Hi, I'm {fullName}
		</h1>

		<!-- Tagline -->
		<p
			class="text-xl sm:text-2xl text-white/80 mb-6 {animationClass}"
			style="animation-delay: 200ms;"
		>
			{tagline}
		</p>

		<!-- Quote - Inspirational -->
		<p
			class="text-base sm:text-lg text-white/60 italic mb-10 max-w-2xl mx-auto {animationClass}"
			style="animation-delay: 300ms;"
		>
			"The key to efficiency is to work smart, not hard."
		</p>

		<!-- CTA Button - Squarespace Style with Arrow -->
		<div class={animationClass} style="animation-delay: 400ms;">
			<a href="#contact" class="btn-white group">
				Get in Touch
				<svg
					class="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					/>
				</svg>
			</a>
		</div>

		<!-- Subtext -->
		<p class="text-sm text-white/60 mt-6 {animationClass}" style="animation-delay: 600ms;">
			Scroll to explore my work
		</p>
	</div>
</div>

<style>
	.hero-bg-gradient {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgb(var(--color-primary) / 0.15) 0%,
			transparent 70%
		);
		animation: pulse-glow 4s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(1.05);
		}
	}

	.animate-fade-up {
		opacity: 0;
		transform: translateY(30px);
		animation: fadeUp 0.8s ease-out forwards;
	}

	.animate-slide-in {
		opacity: 0;
		transform: translateX(-50px);
		animation: slideIn 0.8s ease-out forwards;
	}

	.animate-typewriter {
		opacity: 0;
		animation: fadeIn 0.5s ease-out forwards;
	}

	@keyframes fadeUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideIn {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
</style>
