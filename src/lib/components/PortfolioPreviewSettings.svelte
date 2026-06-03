<script>
	export let workLayoutMode = 'featuredGrid';
	export let capabilityLayoutMode = 'groupedBands';

	/** @type {(mode: string) => void} */
	export let onWorkLayoutChange = (_mode) => {};
	/** @type {(mode: string) => void} */
	export let onCapabilityLayoutChange = (_mode) => {};

	let open = false;
	let announcement = 'Preview settings closed';

	const workLayoutOptions = [
		{ mode: 'featuredGrid', label: 'Featured grid', testId: 'work-layout-option-featured-grid' },
		{ mode: 'caseStudyLed', label: 'Case studies', testId: 'work-layout-option-case-studies' }
	];

	const capabilityLayoutOptions = [
		{ mode: 'sevenBands', label: 'Detailed', testId: 'capability-layout-option-detailed' },
		{ mode: 'groupedBands', label: 'Grouped', testId: 'capability-layout-option-grouped' },
		{ mode: 'singleStack', label: 'Compact', testId: 'capability-layout-option-compact' }
	];

	/** @param {string} mode */
	function selectWorkLayout(mode) {
		onWorkLayoutChange(mode);
		const label = workLayoutOptions.find((option) => option.mode === mode)?.label ?? mode;
		announcement = 'Work layout: ' + label;
	}

	/** @param {string} mode */
	function selectCapabilityLayout(mode) {
		onCapabilityLayoutChange(mode);
		const label =
			capabilityLayoutOptions.find((option) => option.mode === mode)?.label ?? mode;
		announcement = 'Capability layout: ' + label;
	}

	function togglePanel() {
		open = !open;
		announcement = open ? 'Preview settings opened' : 'Preview settings closed';
	}
</script>

<div class="relative">
	<button
		type="button"
		data-testid="portfolio-preview-settings"
		class="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
		aria-expanded={open}
		on:click={togglePanel}
	>
		View options
	</button>
	<div
		data-testid="portfolio-preview-settings-panel"
		class={'absolute right-0 z-20 mt-2 w-[min(92vw,320px)] space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg ' +
			(open ? 'block' : 'hidden')}
	>
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Work layout</p>
			<div class="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Work layout">
				{#each workLayoutOptions as option (option.mode)}
					<button
						type="button"
						data-testid={option.testId}
						class={'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ' +
							(workLayoutMode === option.mode
								? 'bg-zinc-900 text-white'
								: 'bg-zinc-100 text-zinc-600 hover:text-zinc-900')}
						aria-pressed={workLayoutMode === option.mode}
						on:click={() => selectWorkLayout(option.mode)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Approach layout</p>
			<div class="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Capability layout">
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
	</div>
</div>
<p class="sr-only" aria-live="polite">{announcement}</p>
