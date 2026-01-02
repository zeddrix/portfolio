<script lang="ts">
	import { onMount } from 'svelte';
	import type { ProjectDeliverable } from '$lib/types/database';

	export let deliverables: ProjectDeliverable[] = [];

	let activeIndex = 0;
	let carouselContainer: HTMLDivElement;
	let sectionVisible = false;

	// Default images for deliverables based on icon
	const defaultImages: Record<string, string> = {
		'code-bracket':
			'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=800&fit=crop&auto=format',
		'document-text':
			'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=800&fit=crop&auto=format',
		'cloud-arrow-up':
			'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=800&fit=crop&auto=format',
		'wrench-screwdriver':
			'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=600&h=800&fit=crop&auto=format'
	};

	// Color schemes for cards
	const colorSchemes = [
		'from-rose-100 to-rose-200',
		'from-zinc-900 to-black',
		'from-amber-100 to-amber-200',
		'from-slate-800 to-slate-900'
	];

	function scrollToCard(index: number) {
		activeIndex = index;
		if (carouselContainer) {
			const cards = carouselContainer.querySelectorAll('.deliverable-card');
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
			const cards = carouselContainer.querySelectorAll('.deliverable-card');

			cards.forEach((card, index) => {
				const cardElement = card as HTMLElement;
				const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
				const viewportCenter = scrollLeft + containerWidth / 2;

				if (Math.abs(cardCenter - viewportCenter) < cardElement.offsetWidth / 2) {
					activeIndex = index;
				}
			});
		}
	}

	function nextCard() {
		if (activeIndex < deliverables.length - 1) {
			scrollToCard(activeIndex + 1);
		}
	}

	function prevCard() {
		if (activeIndex > 0) {
			scrollToCard(activeIndex - 1);
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

		const section = document.getElementById('deliverables');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});
</script>

<section id="deliverables" class="py-24 sm:py-32 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header - Split Layout (Squarespace Style) -->
		<div
			class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 transition-all duration-700"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
			class:translate-y-0={sectionVisible}
			class:translate-y-8={!sectionVisible}
		>
			<h2 class="heading-section text-gray-900 leading-tight max-w-md">
				Everything you need<br />on one platform
			</h2>
			<p
				class="mt-6 lg:mt-0 text-lg sm:text-xl text-gray-600 max-w-md lg:text-right leading-relaxed"
			>
				Complete solutions with all the deliverables and tools you need for a successful project.
			</p>
		</div>

		<!-- Card Carousel -->
		<div
			class="relative transition-all duration-700 delay-200"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<!-- Carousel Container -->
			<div
				bind:this={carouselContainer}
				on:scroll={handleScroll}
				class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 -mx-4 px-4 lg:-mx-12 lg:px-12 hide-scrollbar"
			>
				{#each deliverables as deliverable, index}
					<div
						class="deliverable-card flex-shrink-0 w-[300px] sm:w-[340px] snap-center"
						role="article"
					>
						<div
							class="relative h-[480px] sm:h-[540px] rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-b {colorSchemes[
								index % colorSchemes.length
							]}"
							on:click={() => scrollToCard(index)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									scrollToCard(index);
								}
							}}
							role="button"
							tabindex="0"
						>
							<!-- Content -->
							<div class="absolute top-0 left-0 right-0 p-6 z-10">
								<h3
									class="text-xl sm:text-2xl font-semibold mb-3 {index % 4 === 1 || index % 4 === 3
										? 'text-white'
										: 'text-gray-900'}"
								>
									{deliverable.title}
								</h3>
								<p
									class="text-sm sm:text-base leading-relaxed {index % 4 === 1 || index % 4 === 3
										? 'text-gray-300'
										: 'text-gray-700'}"
								>
									{deliverable.description}
								</p>
							</div>

							<!-- Image Container -->
							<div class="absolute bottom-0 left-0 right-0 h-[65%] overflow-hidden">
								<img
									src={defaultImages[deliverable.icon || 'code-bracket']}
									alt={deliverable.title}
									class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							<!-- Arrow -->
							<div
								class="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30"
							>
								<svg
									class="w-5 h-5 {index % 4 === 1 || index % 4 === 3
										? 'text-white'
										: 'text-gray-900'}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Navigation - Squarespace Style (Dots left, Arrows right) -->
			<div class="flex items-center justify-between mt-8">
				<!-- Dot Indicators -->
				<div class="flex gap-2">
					{#each deliverables as _, index}
						<button
							type="button"
							class="w-2 h-2 rounded-full transition-all duration-300 {activeIndex === index
								? 'bg-gray-900 w-6'
								: 'bg-gray-300 hover:bg-gray-400'}"
							on:click={() => scrollToCard(index)}
							aria-label="Go to item {index + 1}"
						/>
					{/each}
				</div>

				<!-- Arrow Buttons -->
				<div class="flex gap-3">
					<button
						type="button"
						class="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
						on:click={prevCard}
						disabled={activeIndex === 0}
						aria-label="Previous item"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
						class="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
						on:click={nextCard}
						disabled={activeIndex === deliverables.length - 1}
						aria-label="Next item"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
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
