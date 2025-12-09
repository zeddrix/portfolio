<script lang="ts">
	import { onMount } from 'svelte';
	import type { StatsCounter, Skill, StatsDisplayModeType } from '$lib/types/database';
	import TechStackGrid from './TechStackGrid.svelte';

	export let counters: StatsCounter[] = [];
	export let skills: Skill[] = [];
	export let displayMode: StatsDisplayModeType = 'hybrid';
	export let countersEnabled: boolean = true;
	export let iconsEnabled: boolean = true;

	let sectionVisible = false;
	let animatedValues: number[] = [];

	// Initialize animated values
	$: animatedValues = counters.map(() => 0);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !sectionVisible) {
						sectionVisible = true;
						animateCounters();
					}
				});
			},
			{ threshold: 0.2 }
		);

		const section = document.getElementById('stats-section');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});

	function animateCounters() {
		counters.forEach((counter, index) => {
			const target = parseFloat(counter.value.replace(/[^0-9.]/g, ''));
			const duration = 2000;
			const startTime = performance.now();

			function updateValue(currentTime: number) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// Easing function (ease-out-cubic)
				const easeProgress = 1 - Math.pow(1 - progress, 3);
				animatedValues[index] = Math.round(target * easeProgress);

				if (progress < 1) {
					requestAnimationFrame(updateValue);
				}
			}

			requestAnimationFrame(updateValue);
		});
	}

	function formatValue(value: number, originalValue: string): string {
		if (originalValue.includes('.')) {
			return value.toFixed(originalValue.split('.')[1]?.length || 0);
		}
		return value.toString();
	}
</script>

<!-- Stats Section - Squarespace Style -->
<section id="stats-section" class="relative">
	<!-- Dark Stats Banner -->
	{#if (displayMode === 'counters' || displayMode === 'hybrid') && countersEnabled && counters.length > 0}
		<div class="bg-black py-24 sm:py-32">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<!-- Headline -->
				<p class="text-center text-text-secondary mb-16 text-lg sm:text-xl">
					Delivering quality solutions for clients worldwide.
				</p>

				<!-- Stats Grid - HUGE Numbers -->
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
					{#each counters as counter, index}
						<div class="text-center">
							<div
								class="stats-number text-7xl sm:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-tight"
							>
								{formatValue(animatedValues[index], counter.value)}{counter.suffix || ''}
							</div>
							<div class="text-base sm:text-lg text-gray-400 uppercase tracking-wider">
								{counter.label}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Tech Stack Section -->
	{#if (displayMode === 'icons' || displayMode === 'hybrid' || displayMode === 'categories') && iconsEnabled && skills.length > 0}
		<div class="bg-surface py-20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<TechStackGrid {skills} showCategories={displayMode === 'categories'} />
			</div>
		</div>
	{/if}
</section>

<style>
	.stats-number {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1;
	}
</style>
