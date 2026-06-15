<script>
	import { onDestroy, onMount } from 'svelte';
	import OptimizedImage from '$lib/components/OptimizedImage.svelte';
	import { highlightProjects } from '$lib/data/portfolio';
	import {
		getProjectDisplayUrl,
		getProjectTypeLabel
	} from '$lib/utils/portfolio-display';
	import { getDefaultImageSrc } from '$lib/utils/optimized-image';
	import { prefetchImageUrl, scheduleIdlePrefetch } from '$lib/utils/prefetch-images';
	import { appPath } from '$lib/utils/app-path';

	/** @typedef {import('$lib/types/portfolio').PortfolioProject} PortfolioProject */
	/** @typedef {{ current: number }} SlideState */

	const carouselScrollClass =
		'highlights-carousel-scroll snap-x overflow-x-auto scroll-pb-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

	const carouselSizes = '(max-width: 640px) 88vw, 920px';

	/** @type {Record<string, SlideState>} */
	const slideStates = {};
	/** @type {Record<string, string[]>} */
	const highlightImageSets = {};
	/** @type {ReturnType<typeof setInterval>[]} */
	const intervalIds = [];
	/** @type {Record<string, boolean>} */
	const activeHighlightSlides = {};
	/** @type {Record<string, HTMLElement | null>} */
	const highlightSlideElements = {};
	/** @type {IntersectionObserver | null} */
	let highlightIntersectionObserver = null;
	/** @type {IntersectionObserver | null} */
	let carouselPrefetchObserver = null;

	/** @param {PortfolioProject} project */
	function getProjectImages(project) {
		const imageCandidates = [
			...(project.primaryImage ? [project.primaryImage] : []),
			...project.galleryImages
		];
		/** @type {string[]} */
		const uniqueImages = [];
		for (const image of imageCandidates) {
			if (typeof image === 'string' && image.length > 0 && !uniqueImages.includes(image)) {
				uniqueImages.push(image);
			}
		}
		return uniqueImages;
	}

	/** @param {number} cardIndex */
	function getCardLoading(cardIndex) {
		return cardIndex <= 2 ? 'eager' : 'lazy';
	}

	/** @param {number} cardIndex */
	function getCardFetchPriority(cardIndex) {
		return cardIndex === 0 ? 'high' : '';
	}

	function initHighlightSlides() {
		for (const project of highlightProjects) {
			const imageSet = getProjectImages(project);
			highlightImageSets[project.slug] = imageSet;
			slideStates[project.slug] = { current: 0 };
			activeHighlightSlides[project.slug] = false;
		}
	}

	initHighlightSlides();

	function initHighlightObserver() {
		if (typeof IntersectionObserver === 'undefined') return;

		highlightIntersectionObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const targetSlug = entry.target.getAttribute('data-highlight-slug');
					if (!targetSlug) continue;
					activeHighlightSlides[targetSlug] = entry.isIntersecting && entry.intersectionRatio >= 0.5;
				}
			},
			{ threshold: [0, 0.5, 0.9] }
		);

		for (const project of highlightProjects) {
			const element = highlightSlideElements[project.slug];
			if (element) highlightIntersectionObserver.observe(element);
		}
	}

	function initCarouselPrefetchObserver() {
		if (typeof IntersectionObserver === 'undefined' || !carouselElement) return;

		carouselPrefetchObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					for (const project of highlightProjects) {
						const images = highlightImageSets[project.slug] ?? [];
						const currentIndex = slideStates[project.slug]?.current ?? 0;
						const currentImage = images[currentIndex];
						if (currentImage) {
							prefetchImageUrl(getDefaultImageSrc(currentImage, 920));
						}
					}
				}
			},
			{ rootMargin: '400px' }
		);

		carouselPrefetchObserver.observe(carouselElement);
	}

	function startHighlightSlides() {
		for (const project of highlightProjects) {
			const imageSet = highlightImageSets[project.slug] ?? [];
			if (imageSet.length <= 1) continue;

			const intervalId = setInterval(() => {
				if (!activeHighlightSlides[project.slug]) return;
				const currentState = slideStates[project.slug];
				const nextIndex = (currentState.current + 1) % imageSet.length;
				const nextImage = imageSet[nextIndex];
				if (nextImage) {
					prefetchImageUrl(getDefaultImageSrc(nextImage, 920));
				}
				slideStates[project.slug] = { current: nextIndex };
			}, 3000);

			intervalIds.push(intervalId);
		}
	}

	onMount(() => {
		initHighlightObserver();
		initCarouselPrefetchObserver();
		startHighlightSlides();

		const prefetchPaths = highlightProjects
			.slice(1, 4)
			.flatMap((project) => (project.primaryImage ? [project.primaryImage] : []))
			.map((path) => getDefaultImageSrc(path, 920));
		scheduleIdlePrefetch(prefetchPaths);
	});

	onDestroy(() => {
		for (const intervalId of intervalIds) clearInterval(intervalId);
		if (highlightIntersectionObserver) highlightIntersectionObserver.disconnect();
		if (carouselPrefetchObserver) carouselPrefetchObserver.disconnect();
	});

	/** @type {HTMLElement | null} */
	let carouselElement = null;

	/** @param {'prev' | 'next'} direction */
	function scrollCarouselHorizontally(direction) {
		if (!carouselElement) return;
		const scrollAmount = Math.max(carouselElement.clientWidth * 0.85, 320);
		carouselElement.scrollBy({
			left: direction === 'next' ? scrollAmount : -scrollAmount,
			behavior: 'smooth'
		});
	}
</script>

<div class="relative">
<div bind:this={carouselElement} data-testid="highlights-carousel" class={carouselScrollClass}>
	<div
		data-testid="highlights-carousel-track"
		class="highlights-carousel-track flex w-max gap-5 sm:gap-6 md:gap-8"
	>
		{#each highlightProjects as project, index (project.slug)}
			<div class="w-[min(88vw,920px)] shrink-0 snap-start space-y-4 sm:w-[min(90vw,920px)]">
				<article
					data-testid={'highlight-card-' + index}
					data-highlight-slug={project.slug}
					bind:this={highlightSlideElements[project.slug]}
					class="group overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e1033] via-[#120a1f] to-black shadow-[0_32px_64px_-28px_rgba(0,0,0,0.45)] ring-1 ring-black/10 sm:rounded-[1.85rem]"
				>
					<div class="flex h-11 items-center gap-3 border-b border-white/5 px-4">
						<div class="flex gap-1.5">
							<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></span>
						</div>
						<div
							class="mx-auto flex h-7 min-w-0 max-w-md flex-1 items-center justify-center rounded-lg bg-black/40 px-3 text-xs text-zinc-300"
						>
							{getProjectDisplayUrl(project)}
						</div>
					</div>
					{#if (highlightImageSets[project.slug] ?? []).length > 0}
						<div class="grid w-full overflow-hidden bg-black/20">
							{#key highlightImageSets[project.slug][slideStates[project.slug]?.current ?? 0]}
								<OptimizedImage
									testId={'carousel-project-image-' + project.slug}
									src={highlightImageSets[project.slug][slideStates[project.slug]?.current ?? 0]}
									alt={project.name + ' preview image'}
									loading={getCardLoading(index)}
									fetchpriority={getCardFetchPriority(index)}
									sizes={carouselSizes}
									fit="contain"
									fadeOnMount={(slideStates[project.slug]?.current ?? 0) > 0}
									className="col-start-1 row-start-1 transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.01]"
								/>
							{/key}
						</div>
					{:else}
						<div
							class="flex h-[280px] w-full items-center justify-center bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent text-sm font-medium text-zinc-500"
						>
							No preview image yet
						</div>
					{/if}
				</article>
				<div class="space-y-3 px-2">
					<p
						data-testid={'carousel-project-type-label-' + project.slug}
						class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
					>
						{getProjectTypeLabel(project)}
					</p>
					<h3 class="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{project.name}</h3>
					<p class="max-w-[34ch] text-lg font-medium leading-relaxed text-zinc-600">{project.tagline}</p>
					<a
						data-testid={'showcase-project-link-' + project.slug}
						href={appPath('/projects/' + project.slug)}
						class="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						View project details
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
<div class="mt-3 flex justify-end gap-2 px-2">
	<button
		type="button"
		data-testid="carousel-control-prev"
		class="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
		aria-label="Previous highlight project"
		on:click={() => scrollCarouselHorizontally('prev')}
	>
		Previous
	</button>
	<button
		type="button"
		data-testid="carousel-control-next"
		class="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
		aria-label="Next highlight project"
		on:click={() => scrollCarouselHorizontally('next')}
	>
		Next
	</button>
</div>
</div>
