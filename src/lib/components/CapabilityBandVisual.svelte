<script>
	import { onDestroy, onMount } from 'svelte';
	import CapabilityBandSlideSurface from '$lib/components/CapabilityBandSlideSurface.svelte';
	import CarouselChevronButton from '$lib/components/CarouselChevronButton.svelte';
	import CapabilityBandSlideSurfaceWide from '$lib/components/CapabilityBandSlideSurfaceWide.svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { DEVICE_FRAME_SHELL } from '$lib/constants/device-frame';
	import { normalizeBandSlides } from '$lib/utils/capability-band-slides';

	/** @type {import('$lib/types/portfolio').CapabilityBandVisual} */
	export let visual;
	/** @type {string} */
	export let title;
	/** @type {number} */
	export let activeCarouselIndex = 0;

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

	/** @param {import('$lib/types/portfolio').CapabilityBandSlide[]} slides */
	function getImageLayout(slides) {
		if (visual.imageLayout) {
			return visual.imageLayout;
		}

		if (slides.length > 2) {
			return 'carousel';
		}

		if (slides.length === 2) {
			return 'split';
		}

		return 'single';
	}

	$: iconIds = visual.icons ?? [];
	$: slides = normalizeBandSlides(visual);
	$: screenshotAlt = title + ' capability preview';
	$: iconPanelAlt = title + ' capability illustration';
	$: imageLayout = getImageLayout(slides);
	$: hasVisualMedia =
		(visual.type === 'screenshot' || visual.type === 'hybrid') && slides.length > 0;
	$: carouselCount = slides.length;
	$: safeCarouselIndex =
		carouselCount > 0 ? ((carouselIndex % carouselCount) + carouselCount) % carouselCount : 0;
	$: activeCarouselIndex = safeCarouselIndex;
	$: autoRotate = visual.autoRotate === true && imageLayout === 'carousel' && carouselCount > 1;
	$: showCarouselControls = imageLayout === 'carousel' && !autoRotate;
	$: frameShellClass = 'relative w-full ' + DEVICE_FRAME_SHELL;

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
		<div
			class="grid min-h-[220px] grid-cols-[1.35fr_0.65fr] items-center gap-2 p-4 sm:min-h-[260px] sm:gap-3 lg:min-h-[300px]"
			data-testid="capability-band-visual-split"
		>
			{#each slides as slide, index (slide.src)}
				<OptimizedImage
					src={slide.src}
					alt={screenshotAlt + (index === 0 ? ' desktop' : ' mobile')}
					className="w-full"
					fit="contain"
					sizes="(max-width: 1024px) 100vw, 600px"
					loading="lazy"
					testId={'capability-band-image-' + index}
				/>
			{/each}
		</div>
	{:else if hasVisualMedia && imageLayout === 'carousel'}
		<div class="group p-1 sm:p-2" data-testid="capability-band-visual-carousel">
			<div
				class="flex items-center gap-2 sm:gap-3"
				data-testid="capability-band-carousel-row"
			>
				{#if showCarouselControls}
					<CarouselChevronButton
						variant="outside"
						direction="prev"
						ariaLabel={'Previous ' + title + ' screenshot'}
						testId="capability-carousel-prev"
						alwaysVisible
						on:click={showPreviousSlide}
					/>
				{/if}

				<div class="relative min-w-0 flex-1">
					{#each slides as slide, index (slide.src)}
						<div
							class={'transition-opacity duration-300 ' +
								(index === safeCarouselIndex
									? 'relative opacity-100'
									: 'pointer-events-none absolute inset-0 opacity-0')}
						>
							<CapabilityBandSlideSurface
								src={slide.src}
								alt={screenshotAlt + ' slide ' + (index + 1)}
								frame={slide.frame ?? 'browser'}
								domain={slide.domain}
								imageIndex={index}
								loading={index === 0 ? 'eager' : 'lazy'}
							/>
						</div>
					{/each}
				</div>

				{#if showCarouselControls}
					<CarouselChevronButton
						variant="outside"
						direction="next"
						ariaLabel={'Next ' + title + ' screenshot'}
						testId="capability-carousel-next"
						alwaysVisible
						on:click={showNextSlide}
					/>
				{/if}
			</div>
		</div>
	{:else if hasVisualMedia}
		<div class="p-1 sm:p-2">
			{#if visual.type === 'hybrid'}
				<CapabilityBandSlideSurface
					src={slides[0].src}
					alt={screenshotAlt}
					frame={slides[0].frame ?? 'browser'}
					domain={slides[0].domain}
					imageIndex={0}
					loading="lazy"
				/>
			{:else}
				<CapabilityBandSlideSurfaceWide
					src={slides[0].src}
					alt={screenshotAlt}
					imageIndex={0}
				/>
			{/if}
		</div>
	{:else}
		<div
			class="flex min-h-[260px] flex-col items-center justify-center gap-6 p-8 sm:min-h-[300px] lg:min-h-[340px]"
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
