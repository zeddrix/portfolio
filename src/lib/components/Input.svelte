<script lang="ts">
	/**
	 * Input Component
	 *
	 * A text input with label, error states, and validation support.
	 * Two-way binding and all native input attributes supported.
	 */

	export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
	export let value: string | number = '';
	export let placeholder: string = '';
	export let label: string = '';
	export let error: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let id: string = '';

	$: inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
	$: hasError = !!error;
</script>

<div class="w-full" {...$$restProps}>
	{#if label}
		<label for={inputId} class="block text-sm font-medium text-neutral-700 mb-2">
			{label}
			{#if required}
				<span class="text-error">*</span>
			{/if}
		</label>
	{/if}

	<input
		{type}
		{placeholder}
		{disabled}
		{required}
		{value}
		id={inputId}
		on:input={(e) => (value = e.currentTarget.value)}
		class="w-full px-4 py-2 border rounded-lg text-neutral-900 placeholder-neutral-400 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-neutral-100 disabled:cursor-not-allowed
			{hasError
			? 'border-error focus:border-error focus:ring-error/50'
			: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/50'}"
		on:focus
		on:blur
		on:change
	/>

	{#if error}
		<p class="mt-2 text-sm text-error">{error}</p>
	{/if}
</div>
