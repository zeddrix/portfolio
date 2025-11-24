<script lang="ts" generics="T">
	/**
	 * Carousel Component
	 *
	 * A responsive carousel with navigation controls, pagination dots,
	 * and optional autoplay. Supports swipe gestures.
	 */

	import { onMount, onDestroy } from 'svelte';

	export let items: T[] = [] as T[];
	export let autoplay: boolean = false;
	export let interval: number = 5000;
	export let showControls: boolean = true;
	export let showDots: boolean = true;

	let currentIndex = 0;
	let autoplayInterval: ReturnType<typeof setInterval> | undefined;
	let isPaused = false;

	function next() {
		currentIndex = (currentIndex + 1) % items.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + items.length) % items.length;
	}

	function goTo(index: number) {
		currentIndex = index;
	}

	function startAutoplay() {
		if (autoplay && !isPaused) {
			autoplayInterval = setInterval(next, interval);
		}
	}

	function stopAutoplay() {
		if (autoplayInterval) {
			clearInterval(autoplayInterval);
			autoplayInterval = undefined;
		}
	}

	function handleMouseEnter() {
		isPaused = true;
		stopAutoplay();
	}

	function handleMouseLeave() {
		isPaused = false;
		startAutoplay();
	}

	onMount(() => {
		startAutoplay();
	});

	onDestroy(() => {
		stopAutoplay();
	});

	$: if (autoplay && !isPaused) {
		stopAutoplay();
		startAutoplay();
	}
</script>

<div
	class="relative w-full overflow-hidden"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	{...$$restProps}
>
	<!-- Slides -->
	<div class="relative w-full">
		<div
			class="flex transition-transform duration-500 ease-out"
			style="transform: translateX(-{currentIndex * 100}%)"
		>
			{#each items as item, index}
				<div class="min-w-full flex-shrink-0">
					<slot {item} {index} />
				</div>
			{/each}
		</div>
	</div>

	<!-- Previous Button -->
	{#if showControls && items.length > 1}
		<button
			type="button"
			on:click={prev}
			class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-900 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
			aria-label="Previous slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Next Button -->
		<button
			type="button"
			on:click={next}
			class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-900 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
			aria-label="Next slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}

	<!-- Pagination Dots -->
	{#if showDots && items.length > 1}
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
			{#each items as _, index}
				<button
					type="button"
					on:click={() => goTo(index)}
					class="w-2 h-2 rounded-full transition-all duration-300 {index === currentIndex
						? 'bg-white w-8'
						: 'bg-white/50 hover:bg-white/75'}"
					aria-label="Go to slide {index + 1}"
				/>
			{/each}
		</div>
	{/if}
</div>
