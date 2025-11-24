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

<div class="relative space-y-8">
	{#each items as item, index (item.id)}
		<div class="timeline-item relative flex gap-6" class:last={index === items.length - 1}>
			<!-- Timeline Dot & Line -->
			<div class="relative flex flex-col items-center">
				<div
					class="w-4 h-4 rounded-full bg-border border-2 border-background flex-shrink-0 z-10 transition-all"
					class:bg-primary={item.isCurrent}
					class:border-primary={item.isCurrent}
					class:scale-125={item.isCurrent}
					class:animate-pulse={item.isCurrent}
				></div>
				{#if index !== items.length - 1}
					<div
						class="timeline-line w-0.5 h-full bg-border mt-2 absolute top-4 left-1/2 -translate-x-1/2"
					></div>
				{/if}
			</div>

			<!-- Content -->
			<div class="flex-1 pb-8">
				<!-- Date Range -->
				<div class="text-sm text-text-secondary font-medium mb-2">
					{formatDate(item.startDate)}
					{#if item.isCurrent}
						- Present
					{:else if item.endDate}
						- {formatDate(item.endDate)}
					{/if}
				</div>

				<!-- Title -->
				<h3 class="text-lg sm:text-xl font-bold text-text-primary mb-1">
					{#if item.url}
						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 hover:text-primary transition-colors no-underline"
						>
							{item.title}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
				<p class="text-sm sm:text-base text-primary font-medium mb-2">{item.subtitle}</p>

				<!-- Description -->
				<p class="text-sm sm:text-base text-text-secondary leading-relaxed">{item.description}</p>

				<!-- Current Badge -->
				{#if item.isCurrent}
					<span
						class="inline-block mt-3 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/30"
					>
						Current
					</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	/* Hover Effects */
	.timeline-item:hover .w-4 {
		background-color: rgb(var(--color-primary));
		border-color: rgb(var(--color-primary));
		transform: scale(1.1);
	}

	.timeline-item:hover .timeline-line {
		background-color: rgb(var(--color-primary) / 0.5);
	}
</style>
