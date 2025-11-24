<script lang="ts">
	/**
	 * Project data for case study display
	 */
	export let title: string;
	export let slug: string;
	export let shortDescription: string;
	export let challenge: string | null = null;
	export let solution: string | null = null;
	export let techStack: string[] = [];
	export let featuredImageUrl: string;
	export let metrics: Record<string, string> | null = null;

	/**
	 * Expanded state for read more functionality
	 */
	let isExpanded = false;

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}
</script>

<article class="mb-20 overflow-hidden">
	<!-- Featured Image -->
	<div class="w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-8">
		<img src={featuredImageUrl} alt={title} class="w-full h-full object-cover" loading="lazy" />
	</div>

	<!-- Content Section -->
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Title -->
		<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">{title}</h2>

		<!-- Short Description -->
		<p class="text-lg sm:text-xl text-text-secondary mb-8">{shortDescription}</p>

		<!-- Metrics (if available) -->
		{#if metrics}
			<div
				class="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 p-6 bg-surface rounded-lg border border-border"
			>
				{#each Object.entries(metrics) as [key, value]}
					<div class="text-center">
						<span class="block text-2xl sm:text-3xl font-bold text-primary mb-1">{value}</span>
						<span class="block text-sm text-text-secondary">{key}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Expandable Details -->
		{#if isExpanded}
			<div class="space-y-8 mb-8">
				<!-- Challenge -->
				{#if challenge}
					<div class="space-y-3">
						<h3 class="text-xl sm:text-2xl font-bold text-text-primary">The Challenge</h3>
						<p class="text-text-secondary leading-relaxed">{challenge}</p>
					</div>
				{/if}

				<!-- Solution -->
				{#if solution}
					<div class="space-y-3">
						<h3 class="text-xl sm:text-2xl font-bold text-text-primary">The Solution</h3>
						<p class="text-text-secondary leading-relaxed">{solution}</p>
					</div>
				{/if}

				<!-- Tech Stack -->
				{#if techStack.length > 0}
					<div class="space-y-3">
						<h3 class="text-xl sm:text-2xl font-bold text-text-primary">Technologies Used</h3>
						<div class="flex flex-wrap gap-2">
							{#each techStack as tech}
								<span
									class="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/30"
								>
									{tech}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions -->
		<div
			class="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-border"
		>
			<button
				type="button"
				on:click={toggleExpanded}
				class="flex items-center gap-2 text-text-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:rounded"
			>
				{isExpanded ? 'Show Less' : 'Read More'}
				<svg
					class="w-5 h-5 transition-transform"
					class:rotate-180={isExpanded}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<a
				href={`/projects/${slug}`}
				class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
			>
				View Full Project
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
</article>
