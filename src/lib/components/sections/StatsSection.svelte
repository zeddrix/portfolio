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

	// Extract suffix from original value (like M+, B+, +, etc.)
	function getSuffix(originalValue: string): string {
		const match = originalValue.match(/[A-Za-z+%$]+$/);
		return match ? match[0] : '';
	}
</script>

<!-- Stats Section - Squarespace Style (MASSIVE Numbers) -->
<section id="stats-section" class="relative">
	<!-- Stats Banner -->
	{#if (displayMode === 'counters' || displayMode === 'hybrid') && countersEnabled && counters.length > 0}
		<div class="bg-white py-28 sm:py-36 lg:py-44">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<!-- Headline -->
				<p
					class="text-center text-gray-600 mb-16 sm:mb-20 text-base sm:text-lg transition-all duration-700"
					class:opacity-100={sectionVisible}
					class:opacity-0={!sectionVisible}
				>
					Delivering quality solutions for clients worldwide.
				</p>

				<!-- Stats Grid - MASSIVE Numbers like Squarespace -->
				<div
					class="grid grid-cols-1 sm:grid-cols-3 gap-16 sm:gap-8 lg:gap-12 transition-all duration-700 delay-100"
					class:opacity-100={sectionVisible}
					class:opacity-0={!sectionVisible}
				>
					{#each counters as counter, index}
						<div class="text-center">
							<div class="stats-number mb-4 sm:mb-6">
								<span class="text-black font-bold tracking-tighter leading-none">
									{formatValue(animatedValues[index], counter.value)}{getSuffix(counter.value)}
								</span>
							</div>
							<div
								class="text-sm sm:text-base text-gray-500 uppercase tracking-[0.2em] font-medium"
							>
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
		<div class="bg-gray-50 py-20">
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
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	/* MASSIVE numbers like Squarespace's 14M+ style */
	.stats-number span {
		font-size: clamp(5rem, 20vw, 12rem);
		letter-spacing: -0.05em;
		display: block;
	}

	@media (min-width: 640px) {
		.stats-number span {
			font-size: clamp(4.5rem, 12vw, 10rem);
		}
	}

	@media (min-width: 1024px) {
		.stats-number span {
			font-size: clamp(7rem, 12vw, 14rem);
		}
	}
</style>
