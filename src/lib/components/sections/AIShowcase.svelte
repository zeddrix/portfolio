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
			{ threshold: 0.2 }
		);

		const section = document.getElementById('ai-showcase');
		if (section) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	});

	function animateStats() {
		stats.forEach((stat, index) => {
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
				const easeProgress = 1 - Math.pow(1 - progress, 3);
				const currentValue = target * easeProgress;

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

<section id="ai-showcase" class="relative py-20 sm:py-28 overflow-hidden">
	<!-- Gradient Background -->
	<div class="absolute inset-0 bg-gradient-to-b from-background via-background to-amber-50/30" />

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div
			class="text-center mb-16 transition-all duration-700"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
			class:translate-y-0={sectionVisible}
			class:translate-y-8={!sectionVisible}
		>
			<!-- Decorative Icon -->
			<div class="flex justify-center mb-6">
				<div class="flex gap-1">
					<div class="w-3 h-3 rounded-full bg-text-primary" />
					<div class="w-3 h-3 rounded-full bg-text-primary/40" />
				</div>
			</div>

			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
				Getting started has<br />never been easier with AI
			</h2>
			<p class="text-lg sm:text-xl text-text-secondary">No experience required.</p>
		</div>

		<!-- Two Card Layout -->
		<div
			class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 delay-200"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<!-- Left Card: AI Productivity Stats -->
			<div
				class="bg-zinc-900 rounded-2xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
			>
				<!-- Image Preview Area -->
				<div class="relative h-[280px] sm:h-[320px] overflow-hidden">
					<div
						class="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-zinc-900 to-zinc-900"
					/>
					<!-- Stats Grid Preview -->
					<div class="absolute inset-0 p-8 flex flex-col justify-center">
						<div class="grid grid-cols-2 gap-6">
							{#each stats.slice(0, 4) as stat, index}
								<div class="text-center">
									<div class="text-3xl sm:text-4xl font-bold text-white mb-1">
										{animatedValues[index]}
									</div>
									<div class="text-sm text-gray-400">{stat.label}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Content -->
				<div class="p-6 sm:p-8">
					<h3 class="text-xl sm:text-2xl font-semibold text-white mb-3">AI-Powered Productivity</h3>
					<p class="text-gray-400 mb-6 leading-relaxed">
						Leveraging AI tools to accelerate development, automate repetitive tasks, and deliver
						high-quality solutions faster.
					</p>

					<!-- CTA -->
					<button
						type="button"
						class="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors"
					>
						Learn more
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Right Card: AI Tools Grid -->
			<div
				class="bg-zinc-900 rounded-2xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
			>
				<!-- Tools Grid Preview -->
				<div class="relative h-[280px] sm:h-[320px] overflow-hidden p-4">
					<div class="grid grid-cols-3 gap-2 h-full">
						{#each tools.slice(0, 9) as tool, index}
							<div
								class="bg-zinc-800 rounded-lg flex items-center justify-center p-3 hover:bg-zinc-700 transition-colors"
								style="animation-delay: {index * 50}ms"
							>
								{#if tool.icon_url}
									<img
										src={tool.icon_url}
										alt={tool.name}
										class="w-10 h-10 object-contain"
										loading="lazy"
									/>
								{:else}
									<div
										class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold"
									>
										{tool.name.charAt(0)}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Content -->
				<div class="p-6 sm:p-8">
					<h3 class="text-xl sm:text-2xl font-semibold text-white mb-3">Tools I Use</h3>
					<p class="text-gray-400 mb-6 leading-relaxed">
						A curated selection of AI tools and technologies that power my development workflow.
					</p>

					<!-- CTA -->
					<button
						type="button"
						class="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors"
					>
						View all tools
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom Badge/Caption -->
		<div
			class="text-center mt-12 transition-all duration-700 delay-300"
			class:opacity-100={sectionVisible}
			class:opacity-0={!sectionVisible}
		>
			<p class="text-sm sm:text-base text-text-secondary">
				Building smarter, faster solutions with cutting-edge AI technology
			</p>
		</div>
	</div>
</section>
