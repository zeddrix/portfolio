<script>
	import { onMount } from 'svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import CapabilityBandsSection from '$lib/components/CapabilityBandsSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import GetInTouchButton from '$lib/components/GetInTouchButton.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { homeSeo } from '$lib/data/seo';
	import { profile } from '$lib/data/profile';
	import {
		defaultCapabilityBandLayoutMode
	} from '$lib/data/portfolio';
	import { pageShellClass } from '$lib/constants/layout';
	import { appPath } from '$lib/utils/app-path';

	/** @typedef {import('$lib/types/portfolio').CapabilityBandLayoutMode} CapabilityBandLayoutMode */
	/** @type {typeof import('$lib/components/ToolsStrip.svelte').default | null} */
	let ToolsStrip = null;

	const pageContainerClass = pageShellClass;
	const sectionHeadingClass =
		'text-[clamp(2.6rem,calc(0.25rem+5vw),4.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#111111]';

	const capabilityBandLayoutStorageKey = 'capability-band-layout-mode';

	/** @type {CapabilityBandLayoutMode} */
	let capabilityLayoutMode = defaultCapabilityBandLayoutMode;
	const clientReady = typeof window !== 'undefined';

	if (typeof localStorage !== 'undefined') {
		const storedCapabilityMode = localStorage.getItem(capabilityBandLayoutStorageKey);
		if (storedCapabilityMode === 'singleStack') {
			capabilityLayoutMode = 'sevenBands';
			localStorage.setItem(capabilityBandLayoutStorageKey, 'sevenBands');
		} else if (storedCapabilityMode && isCapabilityBandLayoutMode(storedCapabilityMode)) {
			capabilityLayoutMode = /** @type {CapabilityBandLayoutMode} */ (storedCapabilityMode);
		}
	}

	/** @param {string} mode */
	function isCapabilityBandLayoutMode(mode) {
		return mode === 'sevenBands' || mode === 'groupedBands';
	}

	/** @param {CapabilityBandLayoutMode} mode */
	function setCapabilityLayoutMode(mode) {
		capabilityLayoutMode = mode;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(capabilityBandLayoutStorageKey, mode);
		}
	}

	onMount(async () => {
		const toolsModule = await import('$lib/components/ToolsStrip.svelte');
		ToolsStrip = toolsModule.default;
	});
</script>

<SeoHead
	title={homeSeo.title}
	description={homeSeo.description}
	path={homeSeo.path}
/>

<div class="min-h-screen min-w-0 bg-[#f5f5f5] text-zinc-950">
	{#if clientReady}
		<span data-testid="client-ready" class="sr-only">ready</span>
	{/if}
	<SiteHeader />

	<main>
		<section
			data-testid="hero-section"
			class="{pageContainerClass} pb-16 pt-2 sm:pb-20 sm:pt-3 md:pb-24 md:pt-4 lg:min-h-0 lg:pb-28 lg:pt-6"
		>
			<div class="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-3 lg:gap-12 xl:gap-16">
				<div class="min-w-0 lg:col-span-2">
					<h1
						data-testid="hero-title"
						class="max-lg:whitespace-normal text-[clamp(3rem,calc(0.25rem+5.5vw),5rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black lg:whitespace-nowrap lg:text-[clamp(2.75rem,4.5vw,5rem)]"
					>
						{profile.heroTitle}
					</h1>
					<p
						data-testid="hero-subtitle"
						class="mt-3 max-w-[38rem] text-[clamp(1.125rem,calc(1.1rem+1.25vw),2rem)] font-medium leading-[1.45] text-[#8E8E93] sm:mt-4 lg:max-w-[44rem]"
					>
						{profile.heroSubtitle}
					</p>
					<div class="mt-8 sm:mt-10 lg:mt-12">
						<GetInTouchButton href={'mailto:' + profile.contactEmail} />
					</div>
				</div>
				<div
					data-testid="hero-glance-card"
					class="rounded-[2rem] border border-zinc-200/70 bg-white/80 p-5 shadow-[0_28px_56px_-28px_rgba(0,0,0,0.3)] sm:p-6 lg:col-span-1"
				>
					<p class="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">At a glance</p>
					<dl class="mt-4 space-y-4">
						<div>
							<dt class="text-sm font-medium text-zinc-500">Experience since</dt>
							<dd
								data-testid="hero-glance-experience"
								class="text-lg font-semibold text-zinc-900"
							>
								{profile.experienceSince}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Shipped products</dt>
							<dd
								data-testid="hero-glance-proof"
								class="text-lg font-semibold leading-snug text-zinc-900"
							>
								{profile.heroProof}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-zinc-500">Strong in</dt>
							<dd
								data-testid="hero-glance-specialization"
								class="text-lg font-semibold leading-snug text-zinc-900"
							>
								{profile.specialization}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>

		<WorkSection />

		<CapabilityBandsSection
			{capabilityLayoutMode}
			onCapabilityLayoutChange={(mode) =>
				setCapabilityLayoutMode(/** @type {CapabilityBandLayoutMode} */ (mode))}
		/>

		{#if ToolsStrip}
			<svelte:component this={ToolsStrip} />
		{/if}

		<section
			id="about"
			data-testid="about-section"
			class="{pageContainerClass} pt-12 pb-16 sm:pt-16 sm:pb-20 md:pb-24"
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

		<div class="h-12 shrink-0 sm:h-16" aria-hidden="true"></div>

		<div
			data-testid="page-terminal"
			class="grid min-h-screen grid-rows-[minmax(0,1fr)_minmax(0,1fr)] bg-[#f5f5f5]"
		>
			<div
				data-testid="contact-terminal-zone"
				class="flex min-h-0 flex-col justify-center"
			>
				<ContactSection />
			</div>

			<section
				data-testid="footer-section"
				class="flex min-h-0 flex-col justify-center bg-[#f5f5f5]"
			>
				<div data-testid="footer-section-content" class="{pageContainerClass} text-center">
					<span class="footer-wave block text-3xl leading-none sm:text-4xl" aria-hidden="true">👋</span>
					<p class="mt-6 text-[clamp(1.75rem,calc(0.25rem+3vw),2.25rem)] font-semibold leading-[1.35] text-zinc-950">
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
								data-testid="footer-certificates-link"
								class="break-words transition-colors hover:text-zinc-900"
								href={appPath('/certificates')}
							>
								Certifications
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
			</section>
		</div>
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
