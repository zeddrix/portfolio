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
			{ threshold: 0.3 }
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
		// Preserve original format (e.g., "50" stays as is, not "50.00")
		if (originalValue.includes('.')) {
			return value.toFixed(originalValue.split('.')[1]?.length || 0);
		}
		return value.toString();
	}
</script>

<section id="stats-section" class="py-20 bg-surface">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Stats Counters -->
		{#if (displayMode === 'counters' || displayMode === 'hybrid') && countersEnabled && counters.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
				{#each counters as counter, index}
					<div class="text-center">
						<div class="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-2">
							{formatValue(animatedValues[index], counter.value)}{counter.suffix || ''}
						</div>
						<div class="text-lg text-text-secondary">{counter.label}</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tech Stack Grid -->
		{#if (displayMode === 'icons' || displayMode === 'hybrid' || displayMode === 'categories') && iconsEnabled && skills.length > 0}
			<TechStackGrid {skills} showCategories={displayMode === 'categories'} />
		{/if}
	</div>
</section>
