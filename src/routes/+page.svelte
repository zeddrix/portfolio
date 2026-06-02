<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		capabilityCards,
		clientProjects,
		highlightProjects,
		personalProjects,
		profile,
		projects
	} from '$lib/data/portfolio';
	/** @typedef {import('$lib/types/portfolio').PortfolioProject} PortfolioProject */
	/** @typedef {{ current: number }} SlideState */

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
	const staticImagePaths = Object.keys(import.meta.glob('/static/*.{png,jpg,jpeg,webp,avif,gif}'));

	/** @param {PortfolioProject} project */
	function getProjectImages(project) {
		const slugPrefix = `/static/${project.slug}-`;
		const sequencePattern = new RegExp(`^/static/${project.slug}-(\\d+)`);
		const autoDiscoveredImages = staticImagePaths
			.filter((modulePath) => modulePath.startsWith(slugPrefix))
			// Files in /static are served from root (e.g. /usedelight-1-new-tab.png).
			.map((modulePath) => modulePath.replace('/static', ''))
			.sort((firstImage, secondImage) => {
				const firstPath = `/static${firstImage}`;
				const secondPath = `/static${secondImage}`;
				const firstMatch = firstPath.match(sequencePattern);
				const secondMatch = secondPath.match(sequencePattern);
				const firstSequence = firstMatch ? Number(firstMatch[1]) : Number.MAX_SAFE_INTEGER;
				const secondSequence = secondMatch ? Number(secondMatch[1]) : Number.MAX_SAFE_INTEGER;
				if (firstSequence !== secondSequence) return firstSequence - secondSequence;
				return firstImage.localeCompare(secondImage);
			});

		const imageCandidates = [...autoDiscoveredImages, project.primaryImage, ...project.galleryImages];
		/** @type {string[]} */
		const uniqueImages = [];
		for (const image of imageCandidates) {
			if (typeof image === 'string' && image.length > 0 && !uniqueImages.includes(image)) {
				uniqueImages.push(image);
			}
		}
		return uniqueImages;
	}

	/** @param {PortfolioProject} project */
	function getImageFocusClass(project) {
		switch (project.imageFocus) {
			case 'top':
				return 'object-top';
			case 'bottom':
				return 'object-bottom';
			case 'left':
				return 'object-left';
			case 'right':
				return 'object-right';
			case 'top-left':
				return 'object-[left_top]';
			case 'top-right':
				return 'object-[right_top]';
			case 'bottom-left':
				return 'object-[left_bottom]';
			case 'bottom-right':
				return 'object-[right_bottom]';
			default:
				return 'object-center';
		}
	}

	/** @param {PortfolioProject} project */
	function getProjectDisplayUrl(project) {
		switch (project.slug) {
			case 'usedelight':
				return 'usedelight.com';
			case 'adverio-tools':
				return 'tools.adverio.com';
			case 'queue':
				return 'queue.place';
			case 'jw-tabs':
				return 'jwtabs.app';
			case 'iaso':
				return 'iaso.doctor';
			default:
				return '/projects/' + project.slug;
		}
	}

	function initHighlightSlides() {
		for (const project of highlightProjects) {
			const imageSet = getProjectImages(project);
			highlightImageSets[project.slug] = imageSet;
			slideStates[project.slug] = { current: 0 };
			activeHighlightSlides[project.slug] = false;
		}
	}

	function initHighlightObserver() {
		if (typeof IntersectionObserver === 'undefined') return;

		highlightIntersectionObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const targetSlug = entry.target.getAttribute('data-highlight-slug');
					if (!targetSlug) continue;
					activeHighlightSlides[targetSlug] = entry.isIntersecting && entry.intersectionRatio >= 0.9;
				}
			},
			{
				threshold: [0.9]
			}
		);

		for (const project of highlightProjects) {
			const element = highlightSlideElements[project.slug];
			if (element) highlightIntersectionObserver.observe(element);
		}
	}

	function startHighlightSlides() {
		for (const project of highlightProjects) {
			const imageSet = highlightImageSets[project.slug] ?? [];
			if (imageSet.length <= 1) continue;

			const intervalId = setInterval(() => {
				if (!activeHighlightSlides[project.slug]) return;
				const currentState = slideStates[project.slug];
				const nextIndex = (currentState.current + 1) % imageSet.length;
				slideStates[project.slug] = { current: nextIndex };
			}, 3000);

			intervalIds.push(intervalId);
		}
	}

	function clearSlideTimers() {
		for (const intervalId of intervalIds) clearInterval(intervalId);
	}

	function clearHighlightObserver() {
		if (highlightIntersectionObserver) highlightIntersectionObserver.disconnect();
		highlightIntersectionObserver = null;
	}

	onMount(() => {
		initHighlightSlides();
		initHighlightObserver();
		startHighlightSlides();
	});

	onDestroy(() => {
		clearSlideTimers();
		clearHighlightObserver();
	});
</script>

<div class="min-h-screen min-w-0 bg-[#f5f5f5] text-zinc-950">
	<header class="mx-auto w-[94%] max-w-[1800px] pt-3 sm:pt-4 md:pt-5">
		<div class="flex justify-end">
			<a
				data-testid="header-github-link"
				href={profile.websiteUrl}
				class="inline-flex items-center gap-2 text-[15px] font-semibold text-[#8E8E93] transition-colors hover:text-zinc-700"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 .296C5.372.296 0 5.67 0 12.303c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.01-1.04-.015-2.042-3.338.726-4.042-1.612-4.042-1.612-.546-1.388-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.932 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.45 11.45 0 0 1 3.006-.403c1.02.004 2.047.138 3.006.403 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.771.84 1.233 1.911 1.233 3.221 0 4.61-2.806 5.625-5.479 5.921.43.37.814 1.096.814 2.21 0 1.595-.014 2.882-.014 3.274 0 .319.216.694.825.576C20.565 22.1 24 17.603 24 12.303 24 5.67 18.627.296 12 .296z"
					/>
				</svg>
				<span>GitHub</span>
			</a>
		</div>
	</header>

	<main>
		<section
			class="mx-auto w-[94%] max-w-[1800px] pb-16 pt-2 sm:pb-24 sm:pt-3 md:pb-32 md:pt-4 lg:min-h-[min(78vh,880px)] lg:pb-32 lg:pt-6"
		>
			<div class="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 xl:gap-16">
				<div class="min-w-0">
					<h1
						data-testid="hero-title"
						class="text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black"
					>
						{profile.heroTitle}
					</h1>
					<p
						data-testid="hero-subtitle"
						class="mt-3 max-w-[38rem] text-[clamp(1.125rem,calc(1.1rem+1.25vw),2rem)] font-medium leading-[1.45] text-[#8E8E93] sm:mt-4"
					>
						{profile.heroSubtitle}
					</p>
					<p data-testid="hero-motto" class="mt-3 text-lg font-semibold text-zinc-700">
						{profile.motto}
					</p>
					<div class="mt-8 sm:mt-10 lg:mt-12">
						<a
							data-testid="hero-cta"
							href={`mailto:${profile.contactEmail}`}
							class="inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:px-9 sm:text-xl"
						>
							<svg class="h-[1.15em] w-[1.15em] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M4 6h16v12H4V6zm2 0 6 5 6-5"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Contact me
						</a>
					</div>
				</div>
				<div class="rounded-[2rem] border border-zinc-200/70 bg-white/80 p-6 shadow-[0_28px_56px_-28px_rgba(0,0,0,0.3)] sm:p-8">
					<p class="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">At a glance</p>
					<dl class="mt-5 space-y-5">
						<div>
							<dt class="text-sm font-medium text-zinc-500">Experience since</dt>
							<dd class="text-xl font-semibold text-zinc-900">{profile.experienceSince}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Specialization</dt>
							<dd class="text-xl font-semibold text-zinc-900">{profile.specialization}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Projects shipped</dt>
							<dd class="text-xl font-semibold text-zinc-900">{projects.length}</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>

		<section class="pb-16 sm:pb-24 md:pb-28">
			<div
				data-testid="highlights-carousel"
				class="mx-auto w-[94%] max-w-[1800px] touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-pb-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<div class="flex w-max gap-5 sm:gap-6 md:gap-8">
					{#each highlightProjects as project, index (project.slug)}
						<div class="w-[min(88vw,920px)] shrink-0 snap-center space-y-4 sm:w-[min(90vw,920px)]">
							<article
								data-testid={"highlight-card-" + index}
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
											<img
												data-testid={"project-image-" + project.slug}
												data-transition-state="active"
												src={highlightImageSets[project.slug][slideStates[project.slug]?.current ?? 0]}
												alt={project.name + ' preview image'}
												transition:fade={{ duration: 900 }}
												class="col-start-1 row-start-1 block w-full h-auto transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.01]"
												loading="lazy"
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
								<p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Personal Project</p>
								<h2 class="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{project.name}</h2>
								<p class="max-w-[34ch] text-lg font-medium leading-relaxed text-zinc-600">{project.tagline}</p>
								<a
									data-testid={"showcase-project-link-" + project.slug}
									href={"/projects/" + project.slug}
									class="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								>
									View project details
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section
			data-testid="about-section"
			class="mx-auto w-[94%] max-w-[1800px] pb-20 sm:pb-24 md:pb-32"
		>
			<div class="min-w-0">
				<h2 class="text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]">
					About me
				</h2>
				<div
					data-testid="about-description"
					class="mt-6 max-w-[68rem] space-y-5 text-xl font-medium leading-[1.6] text-[rgba(17,17,17,0.62)] sm:mt-8 sm:text-2xl"
				>
					{#each profile.about as paragraph (paragraph)}
						<p>{paragraph}</p>
					{/each}
				</div>
			</div>
		</section>

		<section class="bg-gradient-to-b from-[#f5f5f5] via-[#efefef] to-[#f5f5f5] py-16 sm:py-20 md:py-24">
			<div class="mx-auto w-[94%] max-w-[1800px] space-y-10 md:space-y-14">
				{#each highlightProjects.slice(0, 2) as project, index (project.slug)}
					<article
						data-testid={"highlight-band-" + index}
						data-align={index % 2 === 0 ? 'left-media' : 'right-media'}
						class="group overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-[0_26px_50px_-34px_rgba(0,0,0,0.35)] sm:p-8"
					>
						<div class={"grid items-center gap-7 lg:grid-cols-2 lg:gap-10 " + (index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '')}>
							<div class="relative h-[220px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 sm:h-[290px]">
								{#if getProjectImages(project)[0]}
									<img
										src={getProjectImages(project)[0]}
										alt={project.name + ' featured image'}
										class={"h-full w-full object-contain transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.02] " + getImageFocusClass(project)}
										loading="lazy"
									/>
								{/if}
							</div>
							<div class="space-y-4">
								<p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Project highlight</p>
								<h3 class="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{project.name}</h3>
								<p class="max-w-[34ch] text-lg font-medium leading-relaxed text-zinc-600">{project.tagline}</p>
								<a
									href={"/projects/" + project.slug}
									class="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
								>
									Explore this case study
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section
			data-testid="projects-overview-section"
			class="mx-auto w-[94%] max-w-[1800px] pb-20 pt-16 sm:pb-24 sm:pt-20 md:pb-32 md:pt-24"
		>
			<div class="space-y-8">
				<h2 class="text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]">
					Projects overview
				</h2>

				<div data-testid="my-projects-group" class="space-y-4">
					<h3 class="text-2xl font-semibold text-zinc-900">My projects</h3>
					<ul class="space-y-3">
						{#each personalProjects as project (project.slug)}
							<li data-testid={"project-card-" + project.slug} class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
								<div class="flex items-start justify-between gap-4">
									<div class="min-w-0">
										<p class="text-xl font-semibold text-zinc-950">{project.name}</p>
										<p class="mt-1 text-base text-zinc-600">{project.tagline}</p>
									</div>
									<a
										data-testid={"project-link-" + project.slug}
										href={"/projects/" + project.slug}
										class="shrink-0 text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
									>
										Open
									</a>
								</div>
							</li>
						{/each}
					</ul>
				</div>

				<div data-testid="client-projects-group" class="space-y-4">
					<h3 class="text-2xl font-semibold text-zinc-900">Client projects</h3>
					<ul class="space-y-4">
						{#each clientProjects as project (project.slug)}
							<li data-testid={"project-card-" + project.slug} class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
								<div class="grid gap-0 sm:grid-cols-[180px_1fr]">
									{#if project.primaryImage}
										<img
											data-testid={"project-image-" + project.slug}
											src={project.primaryImage}
											alt={project.name + ' preview'}
											class="h-full min-h-[140px] w-full object-cover"
											loading="lazy"
										/>
									{:else}
										<div class="h-full min-h-[140px] bg-zinc-100"></div>
									{/if}
									<div class="space-y-3 p-5">
										<p class="text-xl font-semibold text-zinc-950">{project.name}</p>
										<p class="text-base text-zinc-600">{project.tagline}</p>
										<div class="flex flex-wrap gap-2">
											{#each project.links as link, linkIndex (link.url)}
												<a
													data-testid={linkIndex === 0 ? "project-link-" + project.slug : undefined}
													href={link.url}
													target={link.external ? '_blank' : undefined}
													rel={link.external ? 'noopener noreferrer' : undefined}
													class="text-sm font-semibold text-[#136ef6] hover:text-[#0f5dcc]"
												>
													{link.label}
												</a>
											{/each}
										</div>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<section
			data-testid="capabilities-section"
			class="mx-auto w-[94%] max-w-[1800px] pb-20 sm:pb-24 md:pb-32"
		>
			<h2 class="text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]">
				Capabilities
			</h2>
			<div class="mt-10 grid gap-5 md:grid-cols-3">
				{#each capabilityCards as capability (capability.id)}
					<article
						data-testid={"capability-card-" + capability.id}
						class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
					>
						<h3 class="text-xl font-semibold text-zinc-900">{capability.title}</h3>
						<p class="mt-3 text-base leading-relaxed text-zinc-600">{capability.description}</p>
						<div class="mt-4 flex flex-wrap gap-2">
							{#each capability.highlights as highlight (highlight)}
								<span class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
									{highlight}
								</span>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section data-testid="contact-section" class="bg-[#f5f5f5] pb-20 pt-8 sm:pb-28 sm:pt-10 md:pb-36 md:pt-16">
			<div class="mx-auto w-[94%] max-w-[900px]">
				<div class="rounded-2xl bg-white p-6 shadow-[0_32px_90px_-36px_rgba(0,0,0,0.22)] sm:rounded-[2rem] sm:p-10 md:p-14">
					<h2 class="text-[2rem] font-semibold leading-[1.3] text-[#111111]">Contact</h2>
					<p class="mt-6 text-xl font-medium leading-[1.55] text-[rgba(17,17,17,0.6)] sm:text-2xl">
						Want to build something practical and high quality together? Send me the context and I can
						respond with concrete next steps.
					</p>
					<div class="mt-8 flex justify-center sm:mt-10">
						<a
							data-testid="contact-cta"
							href={`mailto:${profile.contactEmail}`}
							class="inline-flex min-h-[52px] w-full max-w-sm items-center justify-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:max-w-none sm:px-9 sm:text-xl"
						>
							Send an email
						</a>
					</div>
				</div>
			</div>
		</section>

		<footer data-testid="footer-section" class="bg-[#f5f5f5] pb-24 pt-6 sm:pb-32 sm:pt-8 md:pb-36">
			<div class="mx-auto w-[94%] max-w-[900px] text-center">
				<p class="text-[2rem] font-semibold leading-[1.5] text-[#111111] sm:text-[2.3rem]">
					Thanks for checking my work.
				</p>
				<div class="mt-7 space-y-2 text-xl font-medium leading-[1.5] text-[rgba(17,17,17,0.6)] sm:text-2xl">
					<p>
						<a
							data-testid="footer-email"
							class="break-words hover:text-[#111111]"
							href={`mailto:${profile.contactEmail}`}
						>
							{profile.contactEmail}
						</a>
					</p>
					<p>
						<a
							data-testid="footer-website-link"
							class="break-words hover:text-[#111111]"
							href={profile.websiteUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{profile.websiteUrl}
						</a>
					</p>
				</div>
			</div>
		</footer>
	</main>
</div>

<style></style>
