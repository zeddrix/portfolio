<script>
	import { DEVICE_CAROUSEL_CHEVRON_BUTTON } from '$lib/constants/device-frame';

	/** @type {'prev' | 'next'} */
	export let direction;
	/** @type {string} */
	export let ariaLabel;
	/** @type {string} */
	export let testId;
	/** @type {'left-1 sm:left-2' | 'right-1 sm:right-2'} */
	export let positionClass;

	$: pathD = direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';
</script>

<button
	type="button"
	class={DEVICE_CAROUSEL_CHEVRON_BUTTON + ' ' + positionClass}
	aria-label={ariaLabel}
	data-testid={testId}
	on:click
>
	<svg
		class="h-5 w-5"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		aria-hidden="true"
	>
		<path d={pathD} />
	</svg>
</button>
