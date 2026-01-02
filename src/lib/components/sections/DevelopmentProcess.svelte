<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { DevelopmentProcessStep } from '$lib/types/database';

	export let steps: DevelopmentProcessStep[] = [];

	let activeTab = 0;
	let sectionVisible = false;

	// Default placeholder images for steps
	const defaultImages: Record<string, string> = {
		search:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
		palette:
			'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&auto=format',
		code: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&auto=format',
		rocket:
			'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=600&fit=crop&auto=format'
	};

	function selectTab(index: number) {
		activeTab = index;
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectTab(index);
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionVisible = true;
					}
				});
			},
			{ threshold: 0.2 }
		);

		const section = document.getElementById('development-process');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});

	$: currentStep = steps[activeTab];
</script>

<!-- Development Process Section - Squarespace "Grow Your Business" Style -->
<section id="development-process" class="py-24 sm:py-32 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div
			class="text-center mb-12 transition-all duration-700"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
			class:translate-y-0={sectionVisible}
			class:translate-y-8={!sectionVisible}
		>
			<h2 class="heading-section text-gray-900 mb-4">Development Process</h2>
			<p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
				A systematic approach to bringing your vision to life.
			</p>
		</div>

		<!-- Horizontal Tab Bar - Squarespace Style Pill Buttons -->
		<div
			class="flex justify-center mb-12 transition-all duration-700 delay-100"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<div class="inline-flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist">
				{#each steps as step, index}
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === index}
						class="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300
							{activeTab === index
							? 'bg-gray-900 text-white shadow-lg'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						on:click={() => selectTab(index)}
						on:keydown={(e) => handleKeyDown(e, index)}
					>
						{step.title}
					</button>
				{/each}
			</div>
		</div>

		<!-- Single Featured Card - Shows active step -->
		<div
			class="max-w-4xl mx-auto transition-all duration-700 delay-200"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			{#if currentStep}
				{#key activeTab}
					<div
						class="relative h-[450px] sm:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden group"
						in:fade={{ duration: 300 }}
						role="tabpanel"
					>
						<!-- Background Image -->
						<img
							src={defaultImages[currentStep.icon || 'code']}
							alt={currentStep.title}
							class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>

						<!-- Dark Gradient Overlay -->
						<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

						<!-- Content Overlay -->
						<div class="absolute inset-0 p-8 sm:p-10 lg:p-12 flex flex-col justify-end">
							<!-- Step Number Badge -->
							<span
								class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 w-fit"
							>
								Step {currentStep.display_order}
							</span>

							<!-- Title -->
							<h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
								{currentStep.title}
							</h3>

							<!-- Description -->
							<p class="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed">
								{currentStep.description}
							</p>

							<!-- CTA Button -->
							<div class="mt-8">
								<a href="#contact" class="btn-white">
									Get Started
									<svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				{/key}
			{/if}
		</div>
	</div>
</section>
