<script lang="ts">
	/**
	 * Button Component
	 *
	 * A versatile button component with multiple variants, sizes, and states.
	 * Supports all native button attributes and events.
	 */

	export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let disabled: boolean = false;
	export let loading: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth: boolean = false;

	// Determine classes based on variant
	$: variantClasses = {
		primary:
			'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500/50',
		secondary:
			'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-500/50',
		outline:
			'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500/50',
		ghost:
			'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-500/50'
	}[variant];

	$: sizeClasses = {
		small: 'px-3 py-2 text-sm',
		medium: 'px-4 py-2 text-sm',
		large: 'px-6 py-3 text-base'
	}[size];

	$: widthClass = fullWidth ? 'w-full' : '';
</script>

<button
	{type}
	{disabled}
	class="inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none {variantClasses} {sizeClasses} {widthClass}"
	on:click
	on:mouseenter
	on:mouseleave
	on:focus
	on:blur
	{...$$restProps}
>
	{#if loading}
		<svg
			class="animate-spin h-4 w-4"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{/if}
	<slot />
</button>
