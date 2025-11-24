<script lang="ts">
	/**
	 * Card variant for different layouts
	 */
	export let variant: 'grid' | 'list' | 'featured' = 'grid';

	/**
	 * Project data
	 */
	export let title: string;
	export let slug: string;
	export let shortDescription: string;
	export let techStack: string[] = [];
	export let featuredImageUrl: string;
	export let isFeatured = false;

	/**
	 * Get variant-specific classes
	 */
	function getCardClasses(): string {
		switch (variant) {
			case 'grid':
				return 'project-card-grid';
			case 'list':
				return 'project-card-list';
			case 'featured':
				return 'project-card-featured';
			default:
				return 'project-card-grid';
		}
	}
</script>

<article class={`project-card ${getCardClasses()}`}>
	<a href={`/projects/${slug}`} class="card-link">
		<!-- Image -->
		<div class="image-wrapper">
			<img src={featuredImageUrl} alt={title} class="project-image" loading="lazy" />
			{#if isFeatured}
				<span class="featured-badge">Featured</span>
			{/if}
		</div>

		<!-- Content -->
		<div class="card-content">
			<h3 class="project-title">{title}</h3>
			<p class="project-description">{shortDescription}</p>

			<!-- Tech Stack -->
			{#if techStack.length > 0}
				<div class="tech-stack">
					{#each techStack.slice(0, 4) as tech}
						<span class="tech-tag">{tech}</span>
					{/each}
					{#if techStack.length > 4}
						<span class="tech-tag">+{techStack.length - 4}</span>
					{/if}
				</div>
			{/if}

			<!-- Read More -->
			<div class="read-more">
				<span>View Details</span>
				<svg
					class="arrow-icon"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
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
	</a>
</article>

<style>
	.project-card {
		@apply relative overflow-hidden rounded-lg bg-surface border border-border transition-all;
		@apply hover:shadow-lg hover:border-primary/50;
	}

	.card-link {
		@apply block w-full h-full no-underline;
	}

	.image-wrapper {
		@apply relative overflow-hidden;
	}

	.project-image {
		@apply w-full h-48 object-cover transition-transform duration-300;
	}

	.project-card:hover .project-image {
		@apply scale-105;
	}

	.featured-badge {
		@apply absolute top-2 right-2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full;
	}

	.card-content {
		@apply p-6;
	}

	.project-title {
		@apply text-xl font-bold text-text-primary mb-2;
	}

	.project-description {
		@apply text-text-secondary mb-4 line-clamp-3;
	}

	.tech-stack {
		@apply flex flex-wrap gap-2 mb-4;
	}

	.tech-tag {
		@apply text-xs font-medium px-2 py-1 bg-background text-primary rounded border border-border;
	}

	.read-more {
		@apply flex items-center text-primary font-medium;
	}

	.arrow-icon {
		@apply w-4 h-4 ml-2 transition-transform;
	}

	.project-card:hover .arrow-icon {
		@apply translate-x-1;
	}

	/* Grid variant (default) */
	.project-card-grid {
		/* Default styles already applied */
	}

	/* List variant (for single-page layout) */
	.project-card-list {
		@apply flex flex-col sm:flex-row;
	}

	.project-card-list .image-wrapper {
		@apply sm:w-1/3;
	}

	.project-card-list .project-image {
		@apply sm:h-full;
	}

	.project-card-list .card-content {
		@apply sm:w-2/3;
	}

	/* Featured variant (for case study layout) */
	.project-card-featured {
		@apply border-2 border-primary/30;
	}

	.project-card-featured .project-title {
		@apply text-2xl;
	}

	.project-card-featured .project-image {
		@apply h-64;
	}
</style>
