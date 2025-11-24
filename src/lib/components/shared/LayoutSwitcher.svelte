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

<div class="layout-switcher">
	<div class="flex items-center space-x-2 bg-background rounded-lg p-1">
		{#each layoutOptions as { type, icon }}
			<button
				type="button"
				on:click={() => switchLayout(type)}
				class="layout-option"
				class:active={currentLayout === type}
				title={LAYOUT_DESCRIPTIONS[type]}
				aria-label={`Switch to ${LAYOUT_NAMES[type]} layout`}
				aria-pressed={currentLayout === type}
			>
				<span class="icon" aria-hidden="true">{icon}</span>
				<span class="label">{LAYOUT_NAMES[type]}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.layout-switcher {
		@apply inline-flex;
	}

	.layout-option {
		@apply flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all;
		@apply text-text-secondary hover:text-text-primary hover:bg-surface;
		@apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background;
	}

	.layout-option.active {
		@apply bg-primary text-white;
	}

	.icon {
		@apply text-base;
	}

	.label {
		@apply hidden sm:inline;
	}

	/* Mobile: show only icons */
	@media (max-width: 640px) {
		.layout-option {
			@apply px-2;
		}
	}
</style>
