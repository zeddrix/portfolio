<script>
	export let capabilityLayoutMode = 'groupedBands';
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
	class={'inline-flex flex-col items-end gap-2 ' + className}
>
	<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
		Approach layout
	</span>
	<div
		class="inline-flex rounded-full bg-zinc-100/90 p-1 ring-1 ring-zinc-200/70"
		role="group"
		aria-label="Approach layout"
	>
		{#each capabilityLayoutOptions as option (option.mode)}
			<button
				type="button"
				data-testid={option.testId}
				class={'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ' +
					(capabilityLayoutMode === option.mode
						? 'bg-zinc-900 text-white shadow-sm'
						: 'text-zinc-600 hover:text-zinc-900')}
				aria-pressed={capabilityLayoutMode === option.mode}
				on:click={() => selectCapabilityLayout(option.mode)}
			>
				{option.label}
			</button>
		{/each}
	</div>
</div>
<p class="sr-only" aria-live="polite">{announcement}</p>
