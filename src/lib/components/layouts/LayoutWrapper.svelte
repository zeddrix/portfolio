<script lang="ts">
	import { fade } from 'svelte/transition';
	import { layoutStore } from '$lib/stores/layout';
	import CaseStudyLayout from './CaseStudyLayout.svelte';
	import SinglePageLayout from './SinglePageLayout.svelte';
	import BentoGridLayout from './BentoGridLayout.svelte';
	import type { LayoutType } from '$lib/types/layout';

	/**
	 * Current active layout
	 */
	let currentLayout: LayoutType;
	layoutStore.subscribe((value) => {
		currentLayout = value;
	});
</script>

<div class="layout-wrapper">
	{#if currentLayout === 'case_study'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<CaseStudyLayout />
		</div>
	{:else if currentLayout === 'single_page'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<SinglePageLayout />
		</div>
	{:else if currentLayout === 'bento_grid'}
		<div in:fade={{ duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<BentoGridLayout />
		</div>
	{/if}
</div>

<style>
	.layout-wrapper {
		min-height: 100vh;
		width: 100%;
	}
</style>
