<script lang="ts">
	import { animate_on_scroll } from '$lib/actions/animate';

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
		const base =
			'relative overflow-hidden rounded-lg bg-surface border border-border transition-all hover:shadow-lg hover:border-primary/50';

		switch (variant) {
			case 'list':
				return `${base} flex flex-col sm:flex-row`;
			case 'featured':
				return `${base} border-2 border-primary/30`;
			default:
				return base;
		}
	}

	function getImageClasses(): string {
		const base = 'w-full object-cover transition-transform duration-300';

		if (variant === 'list') {
			return `${base} h-48 sm:h-full sm:w-1/3`;
		} else if (variant === 'featured') {
			return `${base} h-64`;
		} else {
			return `${base} h-48`;
		}
	}

	function getTitleClasses(): string {
		return variant === 'featured'
			? 'text-2xl font-bold text-text-primary mb-2'
			: 'text-xl font-bold text-text-primary mb-2';
	}

	function getContentClasses(): string {
		return variant === 'list' ? 'p-6 sm:w-2/3' : 'p-6';
	}
</script>

<article use:animate_on_scroll={{ type: 'fadeInUp' }} class={getCardClasses()}>
	<a href={`/projects/${slug}`} class="block w-full h-full no-underline group">
		<!-- Image -->
		<div class="relative overflow-hidden">
			<img src={featuredImageUrl} alt={title} class={getImageClasses()} loading="lazy" />
			{#if isFeatured}
				<span
					class="absolute top-2 right-2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full"
				>
					Featured
				</span>
			{/if}
		</div>

		<!-- Content -->
		<div class={getContentClasses()}>
			<h3 class={getTitleClasses()}>{title}</h3>
			<p class="text-text-secondary mb-4 line-clamp-3">{shortDescription}</p>

			<!-- Tech Stack -->
			{#if techStack.length > 0}
				<div class="flex flex-wrap gap-2 mb-4">
					{#each techStack.slice(0, 4) as tech}
						<span
							class="text-xs font-medium px-2 py-1 bg-background text-primary rounded border border-border"
						>
							{tech}
						</span>
					{/each}
					{#if techStack.length > 4}
						<span
							class="text-xs font-medium px-2 py-1 bg-background text-primary rounded border border-border"
						>
							+{techStack.length - 4}
						</span>
					{/if}
				</div>
			{/if}

			<!-- Read More -->
			<div class="flex items-center text-primary font-medium">
				<span>View Details</span>
				<svg
					class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
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
	/* Hover effect for image scaling */
	article:hover img {
		transform: scale(1.05);
	}
</style>
