<script>
	import {
		DEVICE_CAROUSEL_CHEVRON_BUTTON,
		DEVICE_CAROUSEL_OUTSIDE_CHEVRON,
	} from '$lib/constants/device-frame';

	/** @type {'prev' | 'next'} */
	export let direction;
	/** @type {string} */
	export let ariaLabel;
	/** @type {string} */
	export let testId;
	/** @type {'inside' | 'outside'} */
	export let variant = 'inside';
	/** @type {boolean} */
	export let disabled = false;
	/** @type {boolean} */
	export let alwaysVisible = false;
	/** @type {'left-1 sm:left-2' | 'right-1 sm:right-2'} */
	export let positionClass = 'left-1 sm:left-2';

	$: pathD = direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';
	$: buttonClass =
		variant === 'outside'
			? DEVICE_CAROUSEL_OUTSIDE_CHEVRON + (alwaysVisible ? ' !opacity-100' : '')
			: DEVICE_CAROUSEL_CHEVRON_BUTTON + ' ' + positionClass;
</script>

<button
	type="button"
	class={buttonClass}
	aria-label={ariaLabel}
	disabled={disabled}
	data-testid={testId}
	on:click
>
	<svg
		class={variant === 'outside' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		aria-hidden="true"
	>
		<path d={pathD} />
	</svg>
</button>
