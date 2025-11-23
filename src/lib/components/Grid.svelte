<script lang="ts">
	/**
	 * Grid Component
	 *
	 * A responsive grid layout system with customizable columns and gaps.
	 * Supports auto-fit and auto-fill patterns for flexible layouts.
	 */

	export let cols: number = 1;
	export let sm: number | undefined = undefined;
	export let md: number | undefined = undefined;
	export let lg: number | undefined = undefined;
	export let xl: number | undefined = undefined;
	export let gap: 'tight' | 'normal' | 'relaxed' | 'loose' = 'normal';
	export let autoFit: boolean = false;
	export let minItemWidth: string = '250px';

	$: gapClasses = {
		tight: 'gap-2',
		normal: 'gap-4',
		relaxed: 'gap-6',
		loose: 'gap-8'
	}[gap];

	// Build responsive column classes
	$: colsClass = `grid-cols-${cols}`;
	$: smClass = sm ? `sm:grid-cols-${sm}` : '';
	$: mdClass = md ? `md:grid-cols-${md}` : '';
	$: lgClass = lg ? `lg:grid-cols-${lg}` : '';
	$: xlClass = xl ? `xl:grid-cols-${xl}` : '';

	// For auto-fit/auto-fill, we use inline styles
	$: gridStyle = autoFit
		? `grid-template-columns: repeat(auto-fit, minmax(${minItemWidth}, 1fr));`
		: '';
</script>

{#if autoFit}
	<div class="grid {gapClasses}" style={gridStyle} {...$$restProps}>
		<slot />
	</div>
{:else}
	<div
		class="grid {colsClass} {smClass} {mdClass} {lgClass} {xlClass} {gapClasses}"
		{...$$restProps}
	>
		<slot />
	</div>
{/if}
