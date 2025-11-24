<script lang="ts">
	/**
	 * Section Component
	 *
	 * A semantic section wrapper with consistent vertical padding and
	 * background variants for layout consistency.
	 * Enhanced with Squarespace-quality generous spacing (up to 240px padding).
	 */

	export let background: 'white' | 'gray' | 'dark' | 'primary' = 'white';
	export let padding: 'small' | 'medium' | 'large' = 'medium';
	export let contained: boolean = true;

	$: bgClasses = {
		white: 'bg-white text-neutral-900',
		gray: 'bg-neutral-50 text-neutral-900',
		dark: 'bg-neutral-900 text-white',
		primary: 'bg-primary-500 text-white'
	}[background];

	$: paddingClasses = {
		small: 'py-16 md:py-20',
		medium: 'py-20 md:py-28',
		large: 'py-32 md:py-40 lg:py-48'
	}[padding];
</script>

<section class="{bgClasses} {paddingClasses}" {...$$restProps}>
	{#if contained}
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</section>
