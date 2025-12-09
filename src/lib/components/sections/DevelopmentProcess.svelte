<script lang="ts">
	import { onMount } from 'svelte';
	import type { DevelopmentProcessStep } from '$lib/types/database';

	export let steps: DevelopmentProcessStep[] = [];

	let activeTab = 0;
	let carouselContainer: HTMLDivElement;
	let sectionVisible = false;

	// Default placeholder images for steps if none provided
	const defaultImages: Record<string, string> = {
		search:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
		palette:
			'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&auto=format',
		code: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&auto=format',
		rocket:
			'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=600&fit=crop&auto=format'
	};

	function scrollToCard(index: number) {
		activeTab = index;
		if (carouselContainer) {
			const cards = carouselContainer.querySelectorAll('.process-card');
			if (cards[index]) {
				const card = cards[index] as HTMLElement;
				const containerWidth = carouselContainer.offsetWidth;
				const cardWidth = card.offsetWidth;
				const scrollPosition = card.offsetLeft - (containerWidth - cardWidth) / 2;
				carouselContainer.scrollTo({
					left: scrollPosition,
					behavior: 'smooth'
				});
			}
		}
	}

	function handleScroll() {
		if (carouselContainer) {
			const scrollLeft = carouselContainer.scrollLeft;
			const containerWidth = carouselContainer.offsetWidth;
			const cards = carouselContainer.querySelectorAll('.process-card');

			cards.forEach((card, index) => {
				const cardElement = card as HTMLElement;
				const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
				const viewportCenter = scrollLeft + containerWidth / 2;

				if (Math.abs(cardCenter - viewportCenter) < cardElement.offsetWidth / 2) {
					activeTab = index;
				}
			});
		}
	}

	function nextCard() {
		if (activeTab < steps.length - 1) {
			scrollToCard(activeTab + 1);
		}
	}

	function prevCard() {
		if (activeTab > 0) {
			scrollToCard(activeTab - 1);
		}
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			scrollToCard(index);
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
</script>

<section id="development-process" class="py-20 sm:py-28 bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div
			class="text-center mb-12 transition-all duration-700"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
			class:translate-y-0={sectionVisible}
			class:translate-y-8={!sectionVisible}
		>
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
				Development Process
			</h2>
			<p class="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
				A systematic approach to bringing your vision to life.
			</p>
		</div>

		<!-- Horizontal Tab Bar -->
		<div
			class="flex justify-center mb-12 transition-all duration-700 delay-100"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<div class="inline-flex flex-wrap justify-center gap-2 sm:gap-3">
				{#each steps as step, index}
					<button
						type="button"
						class="px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300
							{activeTab === index
							? 'bg-text-primary text-background shadow-lg'
							: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface'}"
						on:click={() => scrollToCard(index)}
						on:keydown={(e) => handleKeyDown(e, index)}
					>
						{step.title}
					</button>
				{/each}
			</div>
		</div>

		<!-- Card Carousel -->
		<div
			class="relative transition-all duration-700 delay-200"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<!-- Navigation Arrows -->
			<button
				type="button"
				class="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg items-center justify-center text-text-primary hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				on:click={prevCard}
				disabled={activeTab === 0}
				aria-label="Previous step"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				type="button"
				class="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg items-center justify-center text-text-primary hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				on:click={nextCard}
				disabled={activeTab === steps.length - 1}
				aria-label="Next step"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Carousel Container -->
			<div
				bind:this={carouselContainer}
				on:scroll={handleScroll}
				class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 px-4 sm:px-12 -mx-4 sm:-mx-12 hide-scrollbar"
			>
				{#each steps as step, index}
					<div
						class="process-card flex-shrink-0 w-[85vw] sm:w-[600px] lg:w-[700px] snap-center"
						role="article"
					>
						<div
							class="relative h-[400px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
							on:click={() => scrollToCard(index)}
							on:keydown={(e) => handleKeyDown(e, index)}
							role="button"
							tabindex="0"
						>
							<!-- Background Image -->
							<img
								src={defaultImages[step.icon || 'code']}
								alt={step.title}
								class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>

							<!-- Gradient Overlay -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
							/>

							<!-- Content Overlay -->
							<div class="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
								<!-- Step Number -->
								<span
									class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 w-fit"
								>
									Step {step.display_order}
								</span>

								<!-- Title -->
								<h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
									{step.title}
								</h3>

								<!-- Description -->
								<p class="text-base sm:text-lg text-white/90 max-w-lg leading-relaxed">
									{step.description}
								</p>

								<!-- Arrow indicator -->
								<div
									class="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Dot Indicators -->
			<div class="flex justify-center gap-2 mt-6">
				{#each steps as _, index}
					<button
						type="button"
						class="w-2 h-2 rounded-full transition-all duration-300 {activeTab === index
							? 'bg-text-primary w-6'
							: 'bg-border hover:bg-text-secondary'}"
						on:click={() => scrollToCard(index)}
						aria-label="Go to step {index + 1}"
					/>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
