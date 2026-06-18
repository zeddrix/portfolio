<script>
	import { DEVICE_BADGE_CHIP, DEVICE_FOOTER_BAR } from '$lib/constants/device-frame';

	/** @type {string[]} */
	export let badges = [];
	/** @type {number} */
	export let slideCount = 0;
	/** @type {number} */
	export let activeIndex = 0;

	$: showSlideCounter = slideCount >= 3;
	$: slideCounterLabel = activeIndex + 1 + ' / ' + slideCount;
</script>

<div class={DEVICE_FOOTER_BAR} data-testid="capability-band-footer">
	<div
		class="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto sm:gap-2"
		data-testid="capability-band-badges"
	>
		{#each badges as badge (badge)}
			<span class={DEVICE_BADGE_CHIP}>{badge}</span>
		{/each}
	</div>
	{#if showSlideCounter}
		<p
			class="shrink-0 text-[11px] font-medium tabular-nums text-zinc-300 sm:text-xs"
			data-testid="capability-band-slide-counter"
			aria-live="polite"
		>
			{slideCounterLabel}
		</p>
	{/if}
</div>
