<script>
	import FeaturedProjectCarousel from '$lib/components/FeaturedProjectCarousel.svelte';
	import { highlightPrimaryImages } from '$lib/data/highlight-images';
	import {
		buildSrcSet,
		getDefaultImageSrc,
		getHighlightPreloadPaths,
		getVariantSrc
	} from '$lib/utils/optimized-image';

	const carouselSizes = '(max-width: 640px) 78vw, 720px';

	$: preloadPath = getHighlightPreloadPaths()[0];
	$: preloadSrc640 = getVariantSrc(preloadPath, 640);
	$: preloadSrc720 = getDefaultImageSrc(preloadPath, 720);
	$: preloadSrcSet = buildSrcSet(preloadPath);
	$: prefetchPaths = highlightPrimaryImages.slice(1, 4);
</script>

<svelte:head>
	{#if preloadSrc640}
		<link rel="preload" as="image" href={preloadSrc640} />
	{/if}
	{#if preloadSrc720}
		<link
			rel="preload"
			as="image"
			href={preloadSrc720}
			imagesrcset={preloadSrcSet}
			imagesizes={carouselSizes}
		/>
	{/if}
	{#each prefetchPaths as imagePath (imagePath)}
		<link rel="prefetch" as="image" href={getDefaultImageSrc(imagePath, 720)} />
	{/each}
</svelte:head>

<section
	id="work"
	data-testid="work-section"
	class="pb-16 sm:pb-24 md:pb-28"
>
	<FeaturedProjectCarousel />
</section>
