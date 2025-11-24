<script lang="ts">
	import { enhance } from '$app/forms';
	import { PALETTES, type ColorPalette } from '$lib/stores/palette';

	export let currentPalette: ColorPalette;
	export let showConfirmation: boolean = false;

	let selectedPalette: ColorPalette = currentPalette;
	let showConfirmDialog = false;
	let pendingPalette: ColorPalette | null = null;
	let isSubmitting = false;

	function handlePaletteClick(palette: ColorPalette) {
		if (palette === currentPalette) return;

		if (showConfirmation) {
			pendingPalette = palette;
			showConfirmDialog = true;
		} else {
			selectedPalette = palette;
			submitForm();
		}
	}

	function confirmChange() {
		if (pendingPalette) {
			selectedPalette = pendingPalette;
			showConfirmDialog = false;
			submitForm();
		}
	}

	function cancelChange() {
		pendingPalette = null;
		showConfirmDialog = false;
	}

	function submitForm() {
		isSubmitting = true;
		const form = document.getElementById('palette-form') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-semibold text-text-primary mb-2">Default Color Palette</h3>
		<p class="text-sm text-text-secondary mb-4">
			This sets the default color palette for new visitors. Visitors can switch palettes themselves
			using the palette switcher.
		</p>
	</div>

	<form id="palette-form" method="POST" action="?/updatePalette" use:enhance>
		<input type="hidden" name="palette" value={selectedPalette} />
	</form>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each PALETTES as palette}
			<button
				type="button"
				on:click={() => handlePaletteClick(palette.id)}
				disabled={isSubmitting}
				class="relative p-4 rounded-lg border-2 transition-all duration-200 text-left
					{currentPalette === palette.id
					? 'border-primary bg-primary/10'
					: 'border-border bg-surface hover:border-primary/50'}
					{isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				"
			>
				<div class="space-y-3">
					<!-- Palette name -->
					<div class="flex items-center justify-between">
						<h4 class="font-semibold text-text-primary text-sm">{palette.name}</h4>
						{#if currentPalette === palette.id}
							<span class="bg-primary text-background px-2 py-0.5 rounded text-xs font-medium">
								Current
							</span>
						{/if}
					</div>

					<!-- Color preview circles -->
					<div class="flex gap-2">
						<div
							class="w-8 h-8 rounded-full border border-border/50"
							style="background-color: {palette.preview.primary}"
							title="Primary"
						></div>
						<div
							class="w-8 h-8 rounded-full border border-border/50"
							style="background-color: {palette.preview.secondary}"
							title="Secondary"
						></div>
						<div
							class="w-8 h-8 rounded-full border border-border/50"
							style="background-color: {palette.preview.accent}"
							title="Accent"
						></div>
					</div>

					<!-- Description -->
					<p class="text-xs text-text-secondary">{palette.description}</p>
				</div>
			</button>
		{/each}
	</div>

	<!-- Live Preview Section -->
	<div class="mt-6 p-6 rounded-lg border border-border bg-surface">
		<h4 class="text-sm font-semibold text-text-primary mb-3">Live Preview</h4>
		<p class="text-xs text-text-secondary mb-4">
			Preview how the selected palette looks on sample components.
		</p>

		<div class="space-y-3">
			<!-- Sample button -->
			<button
				type="button"
				class="px-4 py-2 rounded bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				Primary Button
			</button>

			<!-- Sample card -->
			<div class="p-4 rounded border border-border bg-background">
				<h5 class="text-text-primary font-medium mb-1">Sample Card</h5>
				<p class="text-text-secondary text-sm">
					This is how text and backgrounds will look with the current palette.
				</p>
			</div>

			<!-- Sample badges -->
			<div class="flex gap-2 flex-wrap">
				<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
					Primary
				</span>
				<span class="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
					Secondary
				</span>
				<span class="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
					Accent
				</span>
			</div>
		</div>
	</div>
</div>

<!-- Confirmation Dialog -->
{#if showConfirmDialog}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		on:click={cancelChange}
		on:keydown={(e) => e.key === 'Escape' && cancelChange()}
		role="presentation"
	>
		<div
			class="bg-surface border border-border rounded-lg p-6 max-w-md w-full shadow-xl"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
		>
			<h3 class="text-lg font-semibold text-text-primary mb-2">Confirm Palette Change</h3>
			<p class="text-text-secondary mb-6">
				Are you sure you want to change the default color palette to <strong
					>{pendingPalette ? PALETTES.find((p) => p.id === pendingPalette)?.name : ''}</strong
				>? This will affect all new visitors to your portfolio.
			</p>
			<div class="flex gap-3 justify-end">
				<button
					type="button"
					on:click={cancelChange}
					class="px-4 py-2 rounded bg-surface border border-border text-text-primary hover:bg-background transition-colors"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={confirmChange}
					class="px-4 py-2 rounded bg-primary text-background hover:bg-primary/90 transition-colors"
				>
					Confirm Change
				</button>
			</div>
		</div>
	</div>
{/if}
