<script lang="ts" context="module">
	export interface NavItem {
		label: string;
		href: string;
		active?: boolean;
	}
</script>

<script lang="ts">
	/**
	 * Nav Component
	 *
	 * A horizontal navigation menu for desktop layouts.
	 * Highlights the active route and supports hover effects.
	 */

	export let items: NavItem[] = [];
	export let activeRoute: string = '';

	function isActive(item: NavItem): boolean {
		if (item.active !== undefined) {
			return item.active;
		}
		return activeRoute === item.href;
	}
</script>

<nav class="flex items-center gap-1" {...$$restProps}>
	{#each items as item}
		<a
			href={item.href}
			class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-out
				{isActive(item)
				? 'text-primary-600 bg-primary-50'
				: 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'}"
		>
			{item.label}
		</a>
	{/each}
	<slot />
</nav>
