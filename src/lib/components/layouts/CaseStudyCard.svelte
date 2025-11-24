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

<article class="case-study-card">
	<!-- Featured Image -->
	<div class="image-section">
		<img src={featuredImageUrl} alt={title} class="featured-image" loading="lazy" />
	</div>

	<!-- Content Section -->
	<div class="content-section">
		<!-- Title -->
		<h2 class="case-title">{title}</h2>

		<!-- Short Description -->
		<p class="short-description">{shortDescription}</p>

		<!-- Metrics (if available) -->
		{#if metrics}
			<div class="metrics">
				{#each Object.entries(metrics) as [key, value]}
					<div class="metric-item">
						<span class="metric-value">{value}</span>
						<span class="metric-label">{key}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Expandable Details -->
		{#if isExpanded}
			<div class="expanded-content">
				<!-- Challenge -->
				{#if challenge}
					<div class="detail-section">
						<h3 class="detail-title">The Challenge</h3>
						<p class="detail-text">{challenge}</p>
					</div>
				{/if}

				<!-- Solution -->
				{#if solution}
					<div class="detail-section">
						<h3 class="detail-title">The Solution</h3>
						<p class="detail-text">{solution}</p>
					</div>
				{/if}

				<!-- Tech Stack -->
				{#if techStack.length > 0}
					<div class="detail-section">
						<h3 class="detail-title">Technologies Used</h3>
						<div class="tech-stack">
							{#each techStack as tech}
								<span class="tech-tag">{tech}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions -->
		<div class="actions">
			<button type="button" on:click={toggleExpanded} class="read-more-button">
				{isExpanded ? 'Show Less' : 'Read More'}
				<svg
					class="chevron"
					class:rotated={isExpanded}
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

			<a href={`/projects/${slug}`} class="view-project-button">
				View Full Project
				<svg class="arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

<style>
	.case-study-card {
		@apply mb-20 overflow-hidden;
	}

	.image-section {
		@apply w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-8;
	}

	.featured-image {
		@apply w-full h-full object-cover;
	}

	.content-section {
		@apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
	}

	.case-title {
		@apply text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6;
	}

	.short-description {
		@apply text-lg sm:text-xl text-text-secondary mb-8;
	}

	.metrics {
		@apply grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 p-6 bg-surface rounded-lg border border-border;
	}

	.metric-item {
		@apply text-center;
	}

	.metric-value {
		@apply block text-2xl sm:text-3xl font-bold text-primary mb-1;
	}

	.metric-label {
		@apply block text-sm text-text-secondary;
	}

	.expanded-content {
		@apply space-y-8 mb-8;
	}

	.detail-section {
		@apply space-y-3;
	}

	.detail-title {
		@apply text-xl sm:text-2xl font-bold text-text-primary;
	}

	.detail-text {
		@apply text-text-secondary leading-relaxed;
	}

	.tech-stack {
		@apply flex flex-wrap gap-2;
	}

	.tech-tag {
		@apply px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/30;
	}

	.actions {
		@apply flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-border;
	}

	.read-more-button {
		@apply flex items-center gap-2 text-text-primary hover:text-primary transition-colors;
		@apply focus:outline-none focus:ring-2 focus:ring-primary focus:rounded;
	}

	.chevron {
		@apply w-5 h-5 transition-transform;
	}

	.chevron.rotated {
		@apply rotate-180;
	}

	.view-project-button {
		@apply inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg;
		@apply hover:bg-primary/90 transition-colors no-underline;
		@apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background;
	}

	.arrow {
		@apply w-4 h-4;
	}
</style>
