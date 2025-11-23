<script lang="ts">
	/**
	 * Card Component
	 *
	 * A flexible card container with optional header, body, and footer sections.
	 * Supports different padding sizes, shadows, borders, and interactive states.
	 */

	export let padding: 'small' | 'medium' | 'large' = 'medium';
	export let shadow: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'sm';
	export let border: boolean = false;
	export let rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
	export let clickable: boolean = false;
	export let hover: boolean = false;

	$: paddingClasses = {
		small: 'p-4',
		medium: 'p-6',
		large: 'p-8'
	}[padding];

	$: shadowClasses = {
		none: 'shadow-none',
		xs: 'shadow-xs',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg',
		xl: 'shadow-xl',
		'2xl': 'shadow-2xl'
	}[shadow];

	$: roundedClasses = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl'
	}[rounded];

	$: borderClass = border ? 'border border-neutral-200' : '';
	$: clickableClass = clickable ? 'cursor-pointer' : '';
	$: hoverClass = hover
		? 'transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1'
		: '';
</script>

<div
	class="bg-white {paddingClasses} {shadowClasses} {roundedClasses} {borderClass} {clickableClass} {hoverClass}"
	on:click
	on:mouseenter
	on:mouseleave
	on:focus
	on:blur
	role={clickable ? 'button' : undefined}
	tabindex={clickable ? 0 : undefined}
	{...$$restProps}
>
	{#if $$slots.header}
		<div class="card-header mb-4">
			<slot name="header" />
		</div>
	{/if}

	<div class="card-body">
		<slot />
	</div>

	{#if $$slots.footer}
		<div class="card-footer mt-4">
			<slot name="footer" />
		</div>
	{/if}
</div>
