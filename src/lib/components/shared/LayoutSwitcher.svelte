<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import { LAYOUT_NAMES, LAYOUT_DESCRIPTIONS } from '$lib/types/layout';
	import type { LayoutType } from '$lib/types/layout';

	/**
	 * Current active layout
	 */
	let currentLayout: LayoutType;
	layoutStore.subscribe((value) => {
		currentLayout = value;
	});

	/**
	 * Switch to a different layout
	 */
	function switchLayout(layout: LayoutType) {
		layoutStore.set(layout);
	}

	/**
	 * Layout options with icons
	 */
	const layoutOptions: Array<{ type: LayoutType; icon: string }> = [
		{ type: 'case_study', icon: '📋' },
		{ type: 'single_page', icon: '📜' },
		{ type: 'bento_grid', icon: '🎨' }
	];
</script>

<div class="inline-flex">
	<div class="flex items-center space-x-2 bg-background rounded-lg p-1">
		{#each layoutOptions as { type, icon }}
			<button
				type="button"
				on:click={() => switchLayout(type)}
				class={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all text-text-secondary hover:text-text-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${currentLayout === type ? 'bg-primary text-white' : ''}`}
				title={LAYOUT_DESCRIPTIONS[type]}
				aria-label={`Switch to ${LAYOUT_NAMES[type]} layout`}
				aria-pressed={currentLayout === type}
			>
				<span class="text-base" aria-hidden="true">{icon}</span>
				<span class="hidden sm:inline">{LAYOUT_NAMES[type]}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	/* Mobile: show only icons */
	@media (max-width: 640px) {
		button {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
	}
</style>
