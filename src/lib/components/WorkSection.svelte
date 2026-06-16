<script>
	import { onMount } from 'svelte';
	import FeaturedProjectCarousel from '$lib/components/FeaturedProjectCarousel.svelte';
	import WorkFeaturedGrid from '$lib/components/WorkFeaturedGrid.svelte';
	import { highlightPrimaryImages } from '$lib/data/highlight-images';
	import {
		buildSrcSet,
		getDefaultImageSrc,
		getHighlightPreloadPaths,
		getVariantSrc
	} from '$lib/utils/optimized-image';

	export let workLayoutMode = 'featuredGrid';

	const carouselSizes = '(max-width: 640px) 88vw, 920px';

	/** @type {typeof import('$lib/components/WorkCaseStudyLayout.svelte').default | null} */
	let WorkCaseStudyLayout = null;

	onMount(async () => {
		if (workLayoutMode === 'caseStudyLed') {
			WorkCaseStudyLayout = (
				await import('$lib/components/WorkCaseStudyLayout.svelte')
			).default;
		}
	});

	$: if (workLayoutMode === 'caseStudyLed' && !WorkCaseStudyLayout) {
		import('$lib/components/WorkCaseStudyLayout.svelte').then((module) => {
			WorkCaseStudyLayout = module.default;
		});
	}

	$: preloadPath = getHighlightPreloadPaths()[0];
	$: preloadSrc640 = getVariantSrc(preloadPath, 640);
	$: preloadSrc920 = getDefaultImageSrc(preloadPath, 920);
	$: preloadSrcSet = buildSrcSet(preloadPath);
	$: prefetchPaths = highlightPrimaryImages.slice(1, 4);
</script>

<svelte:head>
	{#if preloadSrc640}
		<link rel="preload" as="image" href={preloadSrc640} />
	{/if}
	{#if preloadSrc920}
		<link
			rel="preload"
			as="image"
			href={preloadSrc920}
			imagesrcset={preloadSrcSet}
			imagesizes={carouselSizes}
		/>
	{/if}
	{#each prefetchPaths as imagePath (imagePath)}
		<link rel="prefetch" as="image" href={getDefaultImageSrc(imagePath, 920)} />
	{/each}
</svelte:head>

<section
	id="work"
	data-testid="work-section"
	class="pb-16 sm:pb-24 md:pb-28"
>
	<FeaturedProjectCarousel />

	<div class="mx-auto mt-14 w-[90%] max-w-[1400px]">
		{#if workLayoutMode === 'caseStudyLed'}
			{#if WorkCaseStudyLayout}
				<svelte:component this={WorkCaseStudyLayout} />
			{/if}
		{:else}
			<WorkFeaturedGrid />
		{/if}
	</div>
</section>
