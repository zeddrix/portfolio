<script lang="ts">
	/**
	 * Select Component
	 *
	 * A select dropdown with label, error states, and validation support.
	 * Two-way binding for selected value.
	 */

	export interface SelectOption {
		value: string | number;
		label: string;
	}

	export let options: SelectOption[] = [];
	export let value: string | number = '';
	export let label: string = '';
	export let placeholder: string = 'Select an option';
	export let error: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let id: string = '';

	$: inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
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

	<div class="relative">
		<select
			{disabled}
			{required}
			id={inputId}
			bind:value
			class="w-full px-4 py-2 pr-10 border rounded-lg text-neutral-900 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-neutral-100 disabled:cursor-not-allowed appearance-none bg-white
				{hasError
				? 'border-error focus:border-error focus:ring-error/50'
				: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/50'}"
			on:change
			on:focus
			on:blur
		>
			{#if placeholder}
				<option value="" disabled selected>{placeholder}</option>
			{/if}
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>

		<!-- Dropdown arrow icon -->
		<div
			class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400"
		>
			<svg
				class="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>

	{#if error}
		<p class="mt-2 text-sm text-error">{error}</p>
	{/if}
</div>
