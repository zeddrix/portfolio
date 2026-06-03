<script>
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
	class="relative h-[220px] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 shadow-sm sm:h-[290px]"
>
	{#if visual.type === 'screenshot' && visual.image}
		<img
			src={visual.image}
			alt={screenshotAlt}
			class="h-full w-full object-contain p-2"
			loading="lazy"
		/>
	{:else if visual.type === 'hybrid' && visual.image}
		<img
			src={visual.image}
			alt={screenshotAlt}
			class="h-full w-full object-contain p-2"
			loading="lazy"
		/>
		<div class="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-black/55 to-transparent p-4 pt-10">
			{#each badges as badge (badge)}
				<span class="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
					{badge}
				</span>
			{/each}
		</div>
		{#if iconIds.length > 0}
			<div
				class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-zinc-700 shadow-sm"
				aria-hidden="true"
			>
				{#if iconIds[0] === 'billing'}
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<rect x="3" y="5" width="18" height="14" rx="2" />
						<path d="M3 10h18" />
					</svg>
				{:else if iconIds[0] === 'deployment'}
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<circle cx="12" cy="12" r="9" />
						<path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
					</svg>
				{/if}
			</div>
		{/if}
	{:else}
		<div
			class="flex h-full flex-col items-center justify-center gap-5 p-6"
			role="img"
			aria-label={iconPanelAlt}
		>
			<div
				class={"grid place-items-center gap-4 " +
					(iconIds.length > 3 ? 'grid-cols-3 sm:grid-cols-4' : iconIds.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}
			>
				{#each iconIds.length > 0 ? iconIds : ['fullstack'] as iconId (iconId)}
					<div class="flex flex-col items-center gap-2 text-center">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 shadow-sm sm:h-16 sm:w-16"
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
							{/if}
						</div>
						{#if iconIds.length <= 3}
							<span class="text-xs font-medium text-zinc-500">{getIconLabel(iconId)}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
