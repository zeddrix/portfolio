<script>
	import CapabilityBandVisual from '$lib/components/CapabilityBandVisual.svelte';
	import CapabilityLayoutToggle from '$lib/components/CapabilityLayoutToggle.svelte';
	import {
		capabilityBandGroups,
		capabilityBands,
		profile
	} from '$lib/data/portfolio';
	import { pageShellClass } from '$lib/constants/layout';
	import { DEVICE_BADGE_CHIP } from '$lib/constants/device-frame';
	import { getBandCarouselSlideCount } from '$lib/utils/capability-band-slides';
	import { appPath } from '$lib/utils/app-path';

	export let capabilityLayoutMode = 'sevenBands';
	/** @type {(mode: string) => void} */
	export let onCapabilityLayoutChange = (_mode) => {};

	/** @type {number[]} */
	let sevenBandCarouselIndices = capabilityBands.map(() => 0);
	/** @type {number[]} */
	let groupedBandCarouselIndices = capabilityBandGroups.map(() => 0);

	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';

	/** @type {import('$lib/types/portfolio').CapabilityBandVisual} */
	const singleStackVisual = {
		type: 'iconPanel',
		icons: ['fullstack', 'pwa', 'billing', 'dashboard', 'chatbot', 'docker', 'deployment', 'testing']
	};

	/** @param {number} index */
	function getBandTestId(index) {
		return 'highlight-band-' + index;
	}

	/** @param {import('$lib/types/portfolio').CapabilityBandVisual | undefined} visual */
	function getSlideCount(visual) {
		if (!visual) {
			return 0;
		}
		return getBandCarouselSlideCount(visual);
	}

	/** @param {import('$lib/types/portfolio').CapabilityBandGroup} group */
	function getGroupBadges(group) {
		/** @type {string[]} */
		const badges = [];
		for (const band of group.bands) {
			for (const badge of band.visual.badges ?? []) {
				if (!badges.includes(badge)) {
					badges.push(badge);
				}
			}
		}
		return badges;
	}
</script>

<section
	id="approach"
	data-testid="capability-bands-section"
	class="bg-[#f5f5f5] py-20 sm:py-28 md:py-32"
>
	<div class={pageShellClass}>
		<div class="flex flex-col gap-6">
			<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
				<h2 class="{sectionHeadingClass} min-w-0 max-w-[20ch]">How I deliver</h2>
				<CapabilityLayoutToggle
					{capabilityLayoutMode}
					{onCapabilityLayoutChange}
					className="shrink-0"
				/>
			</div>
			<p class="max-w-[52ch] text-lg font-medium leading-relaxed text-zinc-600">
				What I build across products—from full-stack foundations through billing, operations, and
				shipping infrastructure.
			</p>
		</div>

		<div class="mt-14 space-y-20 sm:mt-16 sm:space-y-24 md:space-y-28">
			{#if capabilityLayoutMode === 'sevenBands'}
				{#each capabilityBands as band, index (band.id)}
					{@const slideCount = getSlideCount(band.visual)}
					{@const bandBadges = band.visual.badges ?? []}
					<article
						data-testid={getBandTestId(index)}
						data-align={index % 2 === 0 ? 'left-media' : 'right-media'}
					>
						<div
							class={'grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ' +
								(index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '')}
						>
							<CapabilityBandVisual
								visual={band.visual}
								title={band.title}
								bind:activeCarouselIndex={sevenBandCarouselIndices[index]}
							/>
							<div class="space-y-5 lg:py-4" data-testid="capability-band-text-column">
								<h3
									class="text-[clamp(1.75rem,calc(0.25rem+3vw),2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-zinc-950"
								>
									{band.title}
								</h3>
								<p class="max-w-[46ch] text-lg leading-[1.65] text-zinc-600">{band.description}</p>
								{#if bandBadges.length > 0 || slideCount >= 3}
									<div class="flex flex-wrap items-center gap-2">
										{#if bandBadges.length > 0}
											<div
												class="flex flex-wrap items-center gap-1.5 sm:gap-2"
												data-testid="capability-band-badges"
											>
												{#each bandBadges as badge (badge)}
													<span class={DEVICE_BADGE_CHIP + ' bg-zinc-900/90 text-zinc-100'}>{badge}</span>
												{/each}
											</div>
										{/if}
										{#if slideCount >= 3}
											<p
												class="text-sm font-medium tabular-nums text-zinc-500"
												data-testid="capability-band-slide-counter"
											>
												{sevenBandCarouselIndices[index] + 1} / {slideCount}
											</p>
										{/if}
									</div>
								{/if}
								{#if band.relatedProjectSlugs.length > 0}
									<div class="flex flex-wrap items-center gap-2 pt-1">
										<span class="text-sm font-semibold text-zinc-500">Shown in:</span>
										{#each band.relatedProjectSlugs as slug (slug)}
											<a
												data-testid={'band-project-link-' + band.id + '-' + slug}
												href={appPath('/projects/' + slug)}
												class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#136ef6] ring-1 ring-zinc-200 hover:text-[#0f5dcc]"
											>
												{slug}
											</a>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			{:else if capabilityLayoutMode === 'groupedBands'}
				{#each capabilityBandGroups as group, index (group.id)}
					{@const groupVisual = group.visual ?? group.bands[0].visual}
					{@const slideCount = getSlideCount(groupVisual)}
					{@const groupBadges = getGroupBadges(group)}
					<article
						data-testid={getBandTestId(index)}
						data-align={index % 2 === 0 ? 'left-media' : 'right-media'}
					>
						<div
							class={'grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ' +
								(index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '')}
						>
							<CapabilityBandVisual
								visual={groupVisual}
								title={group.title}
								bind:activeCarouselIndex={groupedBandCarouselIndices[index]}
							/>
							<div class="space-y-6 lg:py-4" data-testid="capability-band-text-column">
								<h3
									class="text-[clamp(1.75rem,calc(0.25rem+3vw),2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-zinc-950"
								>
									{group.title}
								</h3>
								{#if group.description}
									<p class="max-w-[46ch] text-lg leading-[1.65] text-zinc-600">{group.description}</p>
								{/if}
								{#if groupBadges.length > 0}
									<div
										class="flex flex-wrap items-center gap-1.5 sm:gap-2"
										data-testid="capability-band-badges"
									>
										{#each groupBadges as badge (badge)}
											<span class={DEVICE_BADGE_CHIP + ' bg-zinc-900/90 text-zinc-100'}>{badge}</span>
										{/each}
									</div>
								{/if}
								{#if slideCount >= 3 && !groupVisual?.autoRotate}
									<p
										class="text-sm font-medium tabular-nums text-zinc-500"
										data-testid="capability-band-slide-counter"
									>
										{groupedBandCarouselIndices[index] + 1} / {slideCount}
									</p>
								{/if}
								<ul class="space-y-5 pt-1">
									{#each group.bands as band (band.id)}
										<li class="space-y-2">
											<p class="text-base font-semibold text-zinc-900">{band.title}</p>
											<p class="max-w-[44ch] text-base leading-relaxed text-zinc-600">{band.description}</p>
											{#if band.relatedProjectSlugs.length > 0}
												<div class="flex flex-wrap gap-2">
													{#each band.relatedProjectSlugs as slug (slug)}
														<a
															data-testid={'band-project-link-' + band.id + '-' + slug}
															href={appPath('/projects/' + slug)}
															class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#136ef6] ring-1 ring-zinc-200 hover:text-[#0f5dcc]"
														>
															{slug}
														</a>
													{/each}
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</article>
				{/each}
			{:else}
				<article data-testid="highlight-band-0" data-align="left-media">
					<div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						<CapabilityBandVisual visual={singleStackVisual} title="Technology stack" />
						<div class="space-y-6 lg:py-4" data-testid="capability-band-text-column">
							<h3
								class="text-[clamp(1.75rem,calc(0.25rem+3vw),2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-zinc-950"
							>
								End-to-end product delivery
							</h3>
							<p class="max-w-[46ch] text-lg leading-[1.65] text-zinc-600">
								From frontend and backend product work to billing, admin tooling, chatbot support, and
								deployment.
							</p>
							<ul class="space-y-5">
								{#each capabilityBands as band (band.id)}
									<li class="space-y-2">
										<p class="text-base font-semibold text-zinc-900">{band.title}</p>
										<p class="max-w-[44ch] text-base leading-relaxed text-zinc-600">{band.description}</p>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</article>
			{/if}
		</div>

		<div class="mt-16 text-center">
			<a
				data-testid="approach-contact-cta"
				href={'mailto:' + profile.contactEmail}
				class="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
			>
				Get in touch
			</a>
		</div>
	</div>
</section>
