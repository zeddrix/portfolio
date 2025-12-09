<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile, HeroAnimationType } from '$lib/types/database';
	import ProfilePicture from '$lib/components/shared/ProfilePicture.svelte';

	export let profile: Profile | null = null;
	export let animationType: HeroAnimationType = 'fade_up';
	export let introDuration: number = 5000;
	export let onIntroComplete: () => void = () => {};

	let visible = true;
	let animationClass = '';

	// Extract profile data with fallbacks
	$: fullName = profile?.full_name || 'Zeddrix Fabian';
	$: tagline = profile?.tagline || 'Full-Stack Web Developer';
	$: quote = '"The key to efficiency is to work smart, not hard."';
	$: profileImage = profile?.profile_image_url;

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
	<!-- Animated background -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="hero-bg-gradient" />
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
			<!-- Left Content -->
			<div class="text-center lg:text-left space-y-6">
				<p
					class="text-lg sm:text-xl text-text-secondary {animationClass}"
					style="animation-delay: 0ms;"
				>
					Hi! I'm
				</p>
				<h1
					class="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary {animationClass}"
					style="animation-delay: 200ms;"
				>
					{fullName}
				</h1>
				<p
					class="text-xl sm:text-2xl text-text-primary {animationClass}"
					style="animation-delay: 400ms;"
				>
					{tagline}
				</p>
				<p
					class="text-base sm:text-lg text-text-secondary italic max-w-lg mx-auto lg:mx-0 {animationClass}"
					style="animation-delay: 600ms;"
				>
					{quote}
				</p>
			</div>

			<!-- Right Content - Profile Picture -->
			<div
				class="flex justify-center lg:justify-end {animationClass}"
				style="animation-delay: 300ms;"
			>
				{#if profileImage}
					<ProfilePicture src={profileImage} alt={fullName} size="xl" />
				{:else}
					<div
						class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
					>
						<span class="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary/50">
							{fullName.charAt(0)}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.hero-bg-gradient {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgb(var(--color-primary) / 0.1) 0%,
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
