<script lang="ts" generics="T extends TimelineItem">
	import type { TimelineItem } from '$lib/types/timeline';

	/**
	 * Timeline items (generic)
	 */
	export let items: T[] = [] as T[];

	/**
	 * Timeline type for styling
	 */
	export let type: 'experience' | 'certification' = 'experience';

	/**
	 * Format date for display
	 */
	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}
</script>

<div class="timeline">
	{#each items as item, index (item.id)}
		<div class="timeline-item" class:last={index === items.length - 1}>
			<!-- Timeline Dot & Line -->
			<div class="timeline-marker">
				<div class="dot" class:current={item.isCurrent}></div>
				{#if index !== items.length - 1}
					<div class="line"></div>
				{/if}
			</div>

			<!-- Content -->
			<div class="timeline-content">
				<!-- Date Range -->
				<div class="date-range">
					{formatDate(item.startDate)}
					{#if item.isCurrent}
						- Present
					{:else if item.endDate}
						- {formatDate(item.endDate)}
					{/if}
				</div>

				<!-- Title -->
				<h3 class="item-title">
					{#if item.url}
						<a href={item.url} target="_blank" rel="noopener noreferrer" class="title-link">
							{item.title}
							<svg class="external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
						</a>
					{:else}
						{item.title}
					{/if}
				</h3>

				<!-- Subtitle -->
				<p class="item-subtitle">{item.subtitle}</p>

				<!-- Description -->
				<p class="item-description">{item.description}</p>

				<!-- Current Badge -->
				{#if item.isCurrent}
					<span class="current-badge">Current</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.timeline {
		@apply relative space-y-8;
	}

	.timeline-item {
		@apply relative flex gap-6;
	}

	.timeline-marker {
		@apply relative flex flex-col items-center;
	}

	.dot {
		@apply w-4 h-4 rounded-full bg-border border-2 border-background;
		@apply flex-shrink-0 z-10;
		@apply transition-all;
	}

	.dot.current {
		@apply bg-primary border-primary scale-125 animate-pulse;
	}

	.line {
		@apply w-0.5 h-full bg-border mt-2;
		@apply absolute top-4 left-1/2 -translate-x-1/2;
	}

	.timeline-content {
		@apply flex-1 pb-8;
	}

	.date-range {
		@apply text-sm text-text-secondary font-medium mb-2;
	}

	.item-title {
		@apply text-lg sm:text-xl font-bold text-text-primary mb-1;
	}

	.title-link {
		@apply inline-flex items-center gap-1 hover:text-primary transition-colors no-underline;
	}

	.external-icon {
		@apply w-4 h-4;
	}

	.item-subtitle {
		@apply text-sm sm:text-base text-primary font-medium mb-2;
	}

	.item-description {
		@apply text-sm sm:text-base text-text-secondary leading-relaxed;
	}

	.current-badge {
		@apply inline-block mt-3 px-3 py-1 text-xs font-semibold;
		@apply bg-primary/10 text-primary rounded-full border border-primary/30;
	}

	/* Hover Effects */
	.timeline-item:hover .dot {
		@apply bg-primary border-primary scale-110;
	}

	.timeline-item:hover .line {
		@apply bg-primary/50;
	}
</style>
