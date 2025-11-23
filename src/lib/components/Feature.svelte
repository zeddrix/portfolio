<script lang="ts">
	/**
	 * Feature Component
	 *
	 * A flexible feature card or block for displaying features, services, or benefits.
	 * Supports horizontal and vertical layouts with optional icons.
	 */

	export let title: string = '';
	export let description: string = '';
	export let layout: 'vertical' | 'horizontal' = 'vertical';
	export let iconColor: string = 'text-primary-500';
	export let hover: boolean = false;

	$: layoutClasses =
		layout === 'vertical' ? 'flex-col text-center items-center' : 'flex-row text-left items-start';

	$: hoverClass = hover ? 'transition-transform duration-300 ease-out hover:scale-105' : '';
</script>

<div class="flex {layoutClasses} gap-4 {hoverClass}" {...$$restProps}>
	{#if $$slots.icon}
		<div class="flex-shrink-0 {iconColor}">
			<slot name="icon" />
		</div>
	{/if}

	<div class="flex-1">
		{#if title}
			<h3 class="text-xl font-semibold text-neutral-900 mb-2">
				{title}
			</h3>
		{/if}

		{#if description}
			<p class="text-neutral-600 leading-relaxed">
				{description}
			</p>
		{/if}

		<slot />
	</div>
</div>
