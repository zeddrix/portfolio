<script>
	export let capabilityLayoutMode = 'sevenBands';
	/** @type {string} */
	export let className = '';

	/** @type {(mode: string) => void} */
	export let onCapabilityLayoutChange = (_mode) => {};

	let announcement = '';

	const capabilityLayoutOptions = [
		{ mode: 'sevenBands', label: 'Detailed', testId: 'capability-layout-option-detailed' },
		{ mode: 'groupedBands', label: 'Grouped', testId: 'capability-layout-option-grouped' }
	];

	/** @param {string} mode */
	function selectCapabilityLayout(mode) {
		onCapabilityLayoutChange(mode);
		const label =
			capabilityLayoutOptions.find((option) => option.mode === mode)?.label ?? mode;
		announcement = 'Approach layout: ' + label;
	}
</script>

<div
	data-testid="capability-layout-toggle"
	class={'inline-flex items-center gap-4 ' + className}
	role="group"
	aria-label="Approach layout"
>
	{#each capabilityLayoutOptions as option (option.mode)}
		<button
			type="button"
			data-testid={option.testId}
			class={'text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ' +
				(capabilityLayoutMode === option.mode
					? 'text-zinc-900'
					: 'text-zinc-400 hover:text-zinc-600')}
			aria-pressed={capabilityLayoutMode === option.mode}
			on:click={() => selectCapabilityLayout(option.mode)}
		>
			{option.label}
		</button>
	{/each}
</div>
<p class="sr-only" aria-live="polite">{announcement}</p>
