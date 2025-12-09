<script lang="ts">
	import { onMount } from 'svelte';
	import type { AITool, AIProductivityStat } from '$lib/types/database';

	export let tools: AITool[] = [];
	export let stats: AIProductivityStat[] = [];

	let sectionVisible = false;
	let animatedValues: string[] = [];

	// Initialize animated values
	$: animatedValues = stats.map(() => '0');

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !sectionVisible) {
						sectionVisible = true;
						animateStats();
					}
				});
			},
			{ threshold: 0.3 }
		);

		const section = document.getElementById('ai-showcase');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});

	function animateStats() {
		stats.forEach((stat, index) => {
			// Extract numeric part and suffix
			const match = stat.value.match(/^([\d.]+)(.*)$/);
			if (!match) {
				animatedValues[index] = stat.value;
				return;
			}

			const target = parseFloat(match[1]);
			const suffix = match[2] || '';
			const duration = 1500;
			const startTime = performance.now();

			function updateValue(currentTime: number) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// Easing function
				const easeProgress = 1 - Math.pow(1 - progress, 3);
				const currentValue = target * easeProgress;

				// Format based on original value
				if (stat.value.includes('.')) {
					animatedValues[index] = currentValue.toFixed(1) + suffix;
				} else {
					animatedValues[index] = Math.round(currentValue) + suffix;
				}

				if (progress < 1) {
					requestAnimationFrame(updateValue);
				}
			}

			requestAnimationFrame(updateValue);
		});
	}
</script>

<section id="ai-showcase" class="py-20 bg-background">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
				Getting started has<br />never been easier with AI
			</h2>
			<p class="text-lg text-text-secondary">No experience required.</p>
		</div>

		<!-- Two Column Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Left: Productivity Stats -->
			<div class="bg-surface rounded-2xl p-8 border border-border">
				<h3 class="text-xl font-semibold text-text-primary mb-8">AI-Powered Productivity</h3>

				<div class="space-y-8">
					{#each stats as stat, index}
						<div class="text-center lg:text-left">
							<div class="text-5xl sm:text-6xl font-bold text-primary mb-2">
								{animatedValues[index]}
							</div>
							<div class="text-lg text-text-primary font-medium">{stat.label}</div>
							{#if stat.description}
								<p class="text-sm text-text-secondary mt-1">{stat.description}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Right: AI Tools Grid -->
			<div class="bg-surface rounded-2xl p-8 border border-border">
				<h3 class="text-xl font-semibold text-text-primary mb-8">Tools I Use</h3>

				<div class="grid grid-cols-2 gap-4">
					{#each tools as tool}
						<a
							href={tool.website_url || '#'}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex flex-col items-center p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
						>
							<!-- Icon -->
							{#if tool.icon_url}
								<img
									src={tool.icon_url}
									alt={tool.name}
									class="w-12 h-12 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300"
									loading="lazy"
								/>
							{:else}
								<div
									class="w-12 h-12 mb-3 rounded-xl bg-primary/10 flex items-center justify-center"
								>
									<span class="text-primary font-bold text-xl">{tool.name.charAt(0)}</span>
								</div>
							{/if}

							<span class="text-text-primary font-medium text-center">{tool.name}</span>

							{#if tool.description}
								<p class="text-xs text-text-secondary text-center mt-1 line-clamp-2">
									{tool.description}
								</p>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
