<script>
	import FeaturedProjectCarousel from '$lib/components/FeaturedProjectCarousel.svelte';
	import { highlightPrimaryImages } from '$lib/data/highlight-images';
	import {
		buildSrcSet,
		getDefaultImageSrc,
		getHighlightPreloadPaths,
		getVariantSrc
	} from '$lib/utils/optimized-image';

	const carouselSizes = '(max-width: 640px) 88vw, 920px';

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
	class="pt-4 pb-8 sm:pt-6 sm:pb-10 md:pb-12"
>
	<FeaturedProjectCarousel />
</section>
