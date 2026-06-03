<script>
	import { resolveStaticAsset } from '$lib/utils/static-asset';

	/** @type {import('$lib/types/portfolio').CapabilityBandVisual} */
	export let visual;
	/** @type {string} */
	export let title;

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

	$: iconIds = visual.icons ?? [];
	$: badges = visual.badges ?? [];
	$: screenshotAlt = title + ' capability preview';
	$: iconPanelAlt = title + ' capability illustration';
</script>

<div
	class="relative min-h-[260px] w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)] sm:min-h-[300px] lg:min-h-[340px]"
>
	{#if visual.type === 'screenshot' && visual.image}
		<img
			src={resolveStaticAsset(visual.image)}
			alt={screenshotAlt}
			class="h-full min-h-[260px] w-full object-contain p-4 sm:min-h-[300px] lg:min-h-[340px]"
			loading="lazy"
		/>
	{:else if visual.type === 'hybrid' && visual.image}
		<img
			src={resolveStaticAsset(visual.image)}
			alt={screenshotAlt}
			class="h-full min-h-[260px] w-full object-contain p-4 sm:min-h-[300px] lg:min-h-[340px]"
			loading="lazy"
		/>
		{#if badges.length > 0}
			<div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-zinc-950/90 to-transparent p-5 pt-12">
				{#each badges as badge (badge)}
					<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-100 ring-1 ring-white/15">
						{badge}
					</span>
				{/each}
			</div>
		{/if}
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
