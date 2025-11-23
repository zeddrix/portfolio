<script lang="ts">
	/**
	 * Checkbox Component
	 *
	 * A custom checkbox with label support and two-way binding.
	 * Accessible and keyboard navigable.
	 */

	export let checked: boolean = false;
	export let label: string = '';
	export let disabled: boolean = false;
	export let id: string = '';

	$: inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="flex items-start" {...$$restProps}>
	<div class="flex items-center h-5">
		<input
			type="checkbox"
			{disabled}
			id={inputId}
			bind:checked
			class="w-4 h-4 border-2 border-neutral-300 rounded text-primary-500 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-out cursor-pointer"
			on:change
		/>
	</div>

	{#if label}
		<label
			for={inputId}
			class="ml-3 text-sm font-medium text-neutral-700 select-none {disabled
				? 'opacity-50 cursor-not-allowed'
				: 'cursor-pointer'}"
		>
			{label}
		</label>
	{/if}

	<slot />
</div>
