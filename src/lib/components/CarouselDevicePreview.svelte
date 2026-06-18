<script>
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import PhoneDeviceFrame from '$lib/components/PhoneDeviceFrame.svelte';
	import BrowserDeviceFrame from '$lib/components/BrowserDeviceFrame.svelte';
	import { MANATAL_PHONE_SCREEN_ASPECT_CSS, getManatalCarouselSlideMeta } from '$lib/constants/carousel';
	import { getProjectDisplayUrl } from '$lib/utils/portfolio-display';
	import { isPortraitImage } from '$lib/utils/optimized-image';
	import { DEVICE_CARD_GRADIENT } from '$lib/constants/device-frame';

	/** @typedef {import('$lib/types/portfolio').PortfolioProject} PortfolioProject */

	/** @type {PortfolioProject} */
	export let project;
	/** @type {string} */
	export let imagePath;
	/** @type {number} */
	export let cardIndex = 0;
	/** @type {boolean} */
	export let fadeOnMount = false;
	/** @type {string} */
	export let carouselSizes = '(max-width: 640px) 88vw, 920px';

	const hoverZoomClass =
		'transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.01]';

	/** @param {number} cardIndex */
	function getCardLoading(cardIndex) {
		return cardIndex <= 2 ? 'eager' : 'lazy';
	}

	/** @param {number} cardIndex */
	function getCardFetchPriority(cardIndex) {
		return cardIndex === 0 ? 'high' : '';
	}

	$: phoneOnlyCard = project.slug === 'manatal-coop';
	$: portraitPreview = phoneOnlyCard || isPortraitImage(imagePath);
	$: displayUrl = getProjectDisplayUrl(project);
	$: imageClassName = phoneOnlyCard
		? 'absolute inset-0 h-full w-full'
		: `h-full w-full ${hoverZoomClass}`;
	$: manatalSlideMeta = phoneOnlyCard
		? getManatalCarouselSlideMeta(imagePath)
		: { objectPosition: '50% 50%' };
</script>

{#if phoneOnlyCard}
	<PhoneDeviceFrame
		fillMode="card"
		domain={displayUrl}
		screenAspectRatio={MANATAL_PHONE_SCREEN_ASPECT_CSS}
		hideDomainOnMobile={true}
		carouselMobileLayout={true}
	>
		{#key imagePath}
			<OptimizedImage
				testId={'carousel-project-image-' + project.slug}
				src={imagePath}
				alt={project.name + ' preview image'}
				loading={getCardLoading(cardIndex)}
				fetchpriority={getCardFetchPriority(cardIndex)}
				sizes={carouselSizes}
				fit="cover"
				objectPosition={manatalSlideMeta.objectPosition}
				{fadeOnMount}
				className={imageClassName}
			/>
		{/key}
	</PhoneDeviceFrame>
{:else if portraitPreview}
	<div
		class={'aspect-[16/10] flex w-full items-center justify-center overflow-hidden ' +
			DEVICE_CARD_GRADIENT}
	>
		<PhoneDeviceFrame domain={displayUrl}>
			{#key imagePath}
				<OptimizedImage
					testId={'carousel-project-image-' + project.slug}
					src={imagePath}
					alt={project.name + ' preview image'}
					loading={getCardLoading(cardIndex)}
					fetchpriority={getCardFetchPriority(cardIndex)}
					sizes={carouselSizes}
					fit="cover"
					preserveNaturalAspect={true}
					{fadeOnMount}
					className={`h-full w-full ${hoverZoomClass}`}
				/>
			{/key}
		</PhoneDeviceFrame>
	</div>
{:else}
	<div data-testid="carousel-device-frame-browser">
		<BrowserDeviceFrame domain={displayUrl} urlTestId={'carousel-project-url-' + project.slug}>
			{#key imagePath}
				<OptimizedImage
					testId={'carousel-project-image-' + project.slug}
					src={imagePath}
					alt={project.name + ' preview image'}
					loading={getCardLoading(cardIndex)}
					fetchpriority={getCardFetchPriority(cardIndex)}
					sizes={carouselSizes}
					fit="contain"
					preserveNaturalAspect={true}
					{fadeOnMount}
					className={`h-full w-full ${hoverZoomClass}`}
				/>
			{/key}
		</BrowserDeviceFrame>
	</div>
{/if}
