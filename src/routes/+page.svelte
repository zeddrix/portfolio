<script>
	import { onMount } from 'svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import CapabilityBandsSection from '$lib/components/CapabilityBandsSection.svelte';
	import ToolsStrip from '$lib/components/ToolsStrip.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { homeSeo } from '$lib/data/seo';
	import {
		defaultCapabilityBandLayoutMode,
		defaultWorkSectionLayoutMode,
		profile
	} from '$lib/data/portfolio';

	/** @typedef {import('$lib/types/portfolio').CapabilityBandLayoutMode} CapabilityBandLayoutMode */
	/** @typedef {import('$lib/types/portfolio').WorkSectionLayoutMode} WorkSectionLayoutMode */

	const pageContainerClass = 'mx-auto w-[90%] max-w-[1400px]';
	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';

	const workLayoutStorageKey = 'portfolio-work-layout-mode';
	const capabilityBandLayoutStorageKey = 'capability-band-layout-mode';

	/** @type {WorkSectionLayoutMode} */
	let workLayoutMode = defaultWorkSectionLayoutMode;
	/** @type {CapabilityBandLayoutMode} */
	let capabilityLayoutMode = defaultCapabilityBandLayoutMode;

	/** @param {string} mode */
	function isWorkSectionLayoutMode(mode) {
		return mode === 'featuredGrid' || mode === 'caseStudyLed';
	}

	/** @param {string} mode */
	function isCapabilityBandLayoutMode(mode) {
		return mode === 'sevenBands' || mode === 'groupedBands' || mode === 'singleStack';
	}

	/** @param {WorkSectionLayoutMode} mode */
	function setWorkLayoutMode(mode) {
		workLayoutMode = mode;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(workLayoutStorageKey, mode);
		}
	}

	/** @param {CapabilityBandLayoutMode} mode */
	function setCapabilityLayoutMode(mode) {
		capabilityLayoutMode = mode;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(capabilityBandLayoutStorageKey, mode);
		}
	}

	onMount(() => {
		if (typeof localStorage === 'undefined') return;

		const storedWorkMode = localStorage.getItem(workLayoutStorageKey);
		if (storedWorkMode && isWorkSectionLayoutMode(storedWorkMode)) {
			workLayoutMode = /** @type {WorkSectionLayoutMode} */ (storedWorkMode);
		}

		const storedCapabilityMode = localStorage.getItem(capabilityBandLayoutStorageKey);
		if (storedCapabilityMode && isCapabilityBandLayoutMode(storedCapabilityMode)) {
			capabilityLayoutMode = /** @type {CapabilityBandLayoutMode} */ (storedCapabilityMode);
		}
	});
</script>

<SeoHead
	title={homeSeo.title}
	description={homeSeo.description}
	path={homeSeo.path}
/>

<div class="min-h-screen min-w-0 bg-[#f5f5f5] text-zinc-950">
	<SiteHeader
		{workLayoutMode}
		{capabilityLayoutMode}
		onWorkLayoutChange={(mode) =>
			setWorkLayoutMode(/** @type {WorkSectionLayoutMode} */ (mode))}
		onCapabilityLayoutChange={(mode) =>
			setCapabilityLayoutMode(/** @type {CapabilityBandLayoutMode} */ (mode))}
	/>

	<main>
		<section
			data-testid="hero-section"
			class="{pageContainerClass} pb-16 pt-2 sm:pb-24 sm:pt-3 md:pb-32 md:pt-4 lg:min-h-[min(78vh,880px)] lg:pb-32 lg:pt-6"
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
					<div class="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center lg:mt-12">
						<a
							data-testid="hero-cta"
							href={'mailto:' + profile.contactEmail}
							class="inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto sm:px-9 sm:text-xl"
						>
							Contact me
						</a>
						<a
							data-testid="hero-work-cta"
							href="#work"
							class="inline-flex w-full min-h-[52px] items-center justify-center rounded-full border border-zinc-300 bg-white px-8 py-3.5 text-lg font-semibold text-zinc-900 transition-colors hover:border-zinc-400 sm:w-auto sm:px-9 sm:text-xl"
						>
							See work
						</a>
					</div>
				</div>
				<div
					data-testid="hero-glance-card"
					class="rounded-[2rem] border border-zinc-200/70 bg-white/80 p-6 shadow-[0_28px_56px_-28px_rgba(0,0,0,0.3)] sm:p-8"
				>
					<p class="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">At a glance</p>
					<dl class="mt-5 space-y-5">
						<div>
							<dt class="text-sm font-medium text-zinc-500">Experience since</dt>
							<dd
								data-testid="hero-glance-experience"
								class="text-xl font-semibold text-zinc-900"
							>
								{profile.experienceSince}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Shipped products</dt>
							<dd
								data-testid="hero-glance-proof"
								class="text-xl font-semibold leading-snug text-zinc-900"
							>
								{profile.heroProof}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Strong in</dt>
							<dd
								data-testid="hero-glance-specialization"
								class="text-xl font-semibold leading-snug text-zinc-900"
							>
								{profile.specialization}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>

		<WorkSection {workLayoutMode} />

		<section
			id="about"
			data-testid="about-section"
			class="{pageContainerClass} pb-20 sm:pb-24 md:pb-32"
		>
			<div class="min-w-0">
				<h2 class={sectionHeadingClass}>About me</h2>
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

		<CapabilityBandsSection {capabilityLayoutMode} />

		<ToolsStrip />

		<ContactSection />

		<footer data-testid="footer-section" class="bg-[#f5f5f5] py-12 sm:py-16">
			<div class="{pageContainerClass} text-center">
				<span class="footer-wave block text-3xl leading-none sm:text-4xl" aria-hidden="true">👋</span>
				<p class="mt-4 text-[clamp(1.75rem,calc(0.25rem+3vw),2.25rem)] font-semibold leading-[1.35] text-zinc-950">
					Thanks for checking my work.
				</p>
				<div class="mt-5 space-y-1.5 text-base font-medium leading-relaxed text-zinc-500 sm:text-lg">
					<p>
						<a
							data-testid="footer-email"
							class="break-words transition-colors hover:text-zinc-900"
							href={'mailto:' + profile.contactEmail}
						>
							{profile.contactEmail}
						</a>
					</p>
					<p>
						<a
							data-testid="footer-website-link"
							class="break-words transition-colors hover:text-zinc-900"
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

<style>
	.footer-wave {
		display: inline-block;
		transform-origin: 70% 75%;
		animation: footer-wave 2.2s ease-in-out infinite;
	}

	@keyframes footer-wave {
		0%,
		45%,
		100% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(18deg);
		}
		20% {
			transform: rotate(-10deg);
		}
		30% {
			transform: rotate(16deg);
		}
		40% {
			transform: rotate(-6deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.footer-wave {
			animation: none;
		}
	}
</style>
