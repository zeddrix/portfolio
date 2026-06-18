<script>
	import { onDestroy, onMount } from 'svelte';
	import CarouselChevronButton from '$lib/components/CarouselChevronButton.svelte';
	import DeviceBadgeFooter from '$lib/components/DeviceBadgeFooter.svelte';
	import DeviceStageSurface from '$lib/components/DeviceStageSurface.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import {
		DEVICE_CARD_GRADIENT,
		DEVICE_FRAME_SHELL,
	} from '$lib/constants/device-frame';

	/** @type {import('$lib/types/portfolio').CapabilityBandVisual} */
	export let visual;
	/** @type {string} */
	export let title;

	let carouselIndex = 0;
	/** @type {HTMLElement | null} */
	let visualRoot = null;
	let isVisible = false;
	/** @type {ReturnType<typeof setInterval> | null} */
	let autoRotateIntervalId = null;
	/** @type {IntersectionObserver | null} */
	let visibilityObserver = null;

	/** @param {string} iconId */
	function getIconLabel(iconId) {
		switch (iconId) {
			case 'fullstack':
				return 'Full-stack';
			case 'pwa':
				return 'PWA';
			case 'billing':
				return 'Billing';
			case 'dashboard':
				return 'Dashboard';
			case 'chatbot':
				return 'Chatbot';
			case 'docker':
				return 'Docker';
			case 'deployment':
				return 'Deployment';
			case 'testing':
				return 'ATDD';
			default:
				return title;
		}
	}

	/** @param {string[]} images */
	function getImageLayout(images) {
		if (visual.imageLayout) {
			return visual.imageLayout;
		}

		if (images.length > 2) {
			return 'carousel';
		}

		if (images.length === 2) {
			return 'split';
		}

		return 'single';
	}

	$: iconIds = visual.icons ?? [];
	$: badges = visual.badges ?? [];
	$: screenshotAlt = title + ' capability preview';
	$: iconPanelAlt = title + ' capability illustration';
	$: displayImages =
		visual.images && visual.images.length > 0
			? visual.images
			: visual.image
				? [visual.image]
				: [];
	$: imageLayout = getImageLayout(displayImages);
	$: hasVisualMedia =
		(visual.type === 'screenshot' || visual.type === 'hybrid') && displayImages.length > 0;
	$: carouselCount = displayImages.length;
	$: safeCarouselIndex =
		carouselCount > 0 ? ((carouselIndex % carouselCount) + carouselCount) % carouselCount : 0;
	$: autoRotate = visual.autoRotate === true && imageLayout === 'carousel' && carouselCount > 1;
	$: showCarouselControls = imageLayout === 'carousel' && !autoRotate;
	$: useCardGradient = visual.type === 'hybrid' || imageLayout === 'carousel';
	$: showFooter =
		badges.length > 0 || (imageLayout === 'carousel' && carouselCount >= 3);
	$: frameShellClass =
		(useCardGradient ? DEVICE_CARD_GRADIENT : 'bg-zinc-900') +
		' relative min-h-[260px] w-full ' +
		DEVICE_FRAME_SHELL +
		' sm:min-h-[300px] lg:min-h-[340px]';
	$: mediaColumnClass = showFooter
		? 'grid min-h-[260px] grid-rows-[1fr_auto] sm:min-h-[300px] lg:min-h-[340px]'
		: 'flex min-h-[260px] flex-col sm:min-h-[300px] lg:min-h-[340px]';

	/** @param {number} nextIndex */
	function setCarouselIndex(nextIndex) {
		if (carouselCount === 0) {
			return;
		}

		carouselIndex = ((nextIndex % carouselCount) + carouselCount) % carouselCount;
	}

	function showPreviousSlide() {
		setCarouselIndex(safeCarouselIndex - 1);
	}

	function showNextSlide() {
		setCarouselIndex(safeCarouselIndex + 1);
	}

	function startAutoRotate() {
		if (!autoRotate || autoRotateIntervalId) {
			return;
		}

		autoRotateIntervalId = setInterval(() => {
			if (!isVisible) {
				return;
			}
			setCarouselIndex(safeCarouselIndex + 1);
		}, 3000);
	}

	function stopAutoRotate() {
		if (!autoRotateIntervalId) {
			return;
		}
		clearInterval(autoRotateIntervalId);
		autoRotateIntervalId = null;
	}

	function initVisibilityObserver() {
		if (typeof IntersectionObserver === 'undefined' || !visualRoot) {
			return;
		}

		visibilityObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
				}
			},
			{ threshold: [0, 0.5, 0.9] }
		);
		visibilityObserver.observe(visualRoot);
	}

	onMount(() => {
		initVisibilityObserver();
		startAutoRotate();
	});

	onDestroy(() => {
		stopAutoRotate();
		if (visibilityObserver) {
			visibilityObserver.disconnect();
		}
	});

	$: if (autoRotate) {
		startAutoRotate();
	} else {
		stopAutoRotate();
	}

	$: if (carouselIndex >= carouselCount) {
		carouselIndex = 0;
	}
</script>

<div bind:this={visualRoot} class={frameShellClass} data-testid="capability-band-visual">
	{#if hasVisualMedia && imageLayout === 'split'}
		<div class={mediaColumnClass}>
			<DeviceStageSurface>
				<div
					class="grid h-full min-h-[220px] grid-cols-[1.35fr_0.65fr] items-center gap-2 p-4 sm:min-h-[260px] sm:gap-3 lg:min-h-[300px]"
					data-testid="capability-band-visual-split"
				>
					{#each displayImages as imagePath, index (imagePath)}
						<OptimizedImage
							src={imagePath}
							alt={screenshotAlt + (index === 0 ? ' desktop' : ' mobile')}
							className="w-full"
							fit="contain"
							sizes="(max-width: 1024px) 100vw, 600px"
							loading="lazy"
							testId={'capability-band-image-' + index}
						/>
					{/each}
				</div>
			</DeviceStageSurface>
		</div>
	{:else if hasVisualMedia && imageLayout === 'carousel'}
		<div class={mediaColumnClass} data-testid="capability-band-visual-carousel">
			<DeviceStageSurface>
				{#each displayImages as imagePath, index (imagePath)}
					<div
						class={'absolute inset-0 flex items-center justify-center px-2 py-4 transition-opacity duration-300 sm:px-3 ' +
							(index === safeCarouselIndex ? 'opacity-100' : 'pointer-events-none opacity-0')}
					>
						<OptimizedImage
							src={imagePath}
							alt={screenshotAlt + ' slide ' + (index + 1)}
							className="h-full w-full"
							fit="contain"
							preserveNaturalAspect={true}
							sizes="(max-width: 1024px) 100vw, 600px"
							loading={index === 0 ? 'eager' : 'lazy'}
							testId={'capability-band-image-' + index}
						/>
					</div>
				{/each}
				{#if showCarouselControls}
					<CarouselChevronButton
						direction="prev"
						ariaLabel={'Previous ' + title + ' screenshot'}
						testId="capability-carousel-prev"
						positionClass="left-1 sm:left-2"
						on:click={showPreviousSlide}
					/>
					<CarouselChevronButton
						direction="next"
						ariaLabel={'Next ' + title + ' screenshot'}
						testId="capability-carousel-next"
						positionClass="right-1 sm:right-2"
						on:click={showNextSlide}
					/>
				{/if}
			</DeviceStageSurface>
			{#if showFooter}
				<DeviceBadgeFooter
					{badges}
					slideCount={carouselCount}
					activeIndex={safeCarouselIndex}
				/>
			{/if}
		</div>
	{:else if hasVisualMedia}
		<div class={mediaColumnClass}>
			<DeviceStageSurface>
				<div class="flex h-full min-h-[220px] items-center justify-center p-4 sm:min-h-[260px] lg:min-h-[300px]">
					<OptimizedImage
						src={displayImages[0]}
						alt={screenshotAlt}
						className="h-full w-full"
						fit="contain"
						sizes="(max-width: 1024px) 100vw, 600px"
						loading="lazy"
						testId="capability-band-image-0"
					/>
				</div>
			</DeviceStageSurface>
			{#if showFooter}
				<DeviceBadgeFooter {badges} slideCount={0} activeIndex={0} />
			{/if}
		</div>
	{:else}
		<div
			class="flex h-full min-h-[260px] flex-col items-center justify-center gap-6 p-8 sm:min-h-[300px] lg:min-h-[340px]"
			role="img"
			aria-label={iconPanelAlt}
		>
			<div
				class={"grid place-items-center gap-6 " +
					(iconIds.length > 3 ? 'grid-cols-3 sm:grid-cols-4' : iconIds.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}
			>
				{#each iconIds.length > 0 ? iconIds : ['fullstack'] as iconId (iconId)}
					<div class="flex flex-col items-center gap-3 text-center">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-zinc-100 ring-1 ring-white/15 sm:h-16 sm:w-16"
						>
							{#if iconId === 'fullstack'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<rect x="3" y="4" width="8" height="7" rx="1.5" />
									<rect x="13" y="4" width="8" height="7" rx="1.5" />
									<rect x="8" y="14" width="8" height="6" rx="1.5" />
								</svg>
							{:else if iconId === 'pwa'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<rect x="7" y="2" width="10" height="20" rx="2" />
									<path d="M11 18h2" />
								</svg>
							{:else if iconId === 'billing'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<rect x="3" y="5" width="18" height="14" rx="2" />
									<path d="M3 10h18" />
								</svg>
							{:else if iconId === 'dashboard'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<rect x="3" y="3" width="8" height="8" rx="1.5" />
									<rect x="13" y="3" width="8" height="5" rx="1.5" />
									<rect x="13" y="10" width="8" height="11" rx="1.5" />
									<rect x="3" y="13" width="8" height="8" rx="1.5" />
								</svg>
							{:else if iconId === 'chatbot'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<path d="M7 9h10M7 13h6" />
									<path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-3 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
								</svg>
							{:else if iconId === 'docker'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<rect x="3" y="10" width="4" height="4" />
									<rect x="8" y="10" width="4" height="4" />
									<rect x="13" y="10" width="4" height="4" />
									<rect x="8" y="5" width="4" height="4" />
									<path d="M18 10h2v3a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-3h3" />
								</svg>
							{:else if iconId === 'deployment'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
									<path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
								</svg>
							{:else if iconId === 'testing'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
									<path d="M9 11l3 3L22 4" />
									<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
								</svg>
							{/if}
						</div>
						{#if iconIds.length <= 3}
							<span class="text-xs font-medium text-zinc-400">{getIconLabel(iconId)}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
