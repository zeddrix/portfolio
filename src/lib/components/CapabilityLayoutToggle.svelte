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
	class={'rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4 ' + className}
>
	<p class="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Approach layout</p>
	<div class="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Approach layout">
		{#each capabilityLayoutOptions as option (option.mode)}
			<button
				type="button"
				data-testid={option.testId}
				class={'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ' +
					(capabilityLayoutMode === option.mode
						? 'bg-zinc-900 text-white'
						: 'bg-zinc-100 text-zinc-600 hover:text-zinc-900')}
				aria-pressed={capabilityLayoutMode === option.mode}
				on:click={() => selectCapabilityLayout(option.mode)}
			>
				{option.label}
			</button>
		{/each}
	</div>
</div>
<p class="sr-only" aria-live="polite">{announcement}</p>
