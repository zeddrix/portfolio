<script lang="ts">
	import { palette, PALETTES, type ColorPalette } from '$lib/stores/palette';
	import { onMount } from 'svelte';

	let mounted = false;
	let isOpen = false;

	onMount(() => {
		mounted = true;
		palette.initialize();
	});

	function selectPalette(paletteId: ColorPalette) {
		palette.set(paletteId);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function handlePaletteKeydown(event: KeyboardEvent, paletteId: ColorPalette) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectPalette(paletteId);
		}
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.palette-switcher')) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

{#if mounted}
	<div class="palette-switcher relative">
		<button
			type="button"
			on:click={toggleDropdown}
			on:keydown={handleKeydown}
			class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
			aria-label="Choose color palette"
			aria-expanded={isOpen}
			title="Choose color palette"
		>
			<!-- Color Palette Icon -->
			<svg
				class="h-5 w-5 text-text-primary"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
				/>
			</svg>
		</button>

		{#if isOpen}
			<div
				class="absolute right-0 mt-2 w-64 rounded-lg bg-surface border border-border shadow-lg z-50"
				role="menu"
				aria-label="Color palette options"
			>
				<div class="p-3">
					<p class="text-sm font-medium text-text-primary mb-3">Choose Color Palette</p>
					<div class="grid grid-cols-1 gap-2">
						{#each PALETTES as paletteOption (paletteOption.id)}
							<button
								type="button"
								on:click={() => selectPalette(paletteOption.id)}
								on:keydown={(e) => handlePaletteKeydown(e, paletteOption.id)}
								class="flex items-center gap-3 p-2 rounded-md hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
								class:bg-background={$palette === paletteOption.id}
								role="menuitem"
								tabindex="0"
							>
								<!-- Color Preview Circle -->
								<div
									class="flex-shrink-0 h-6 w-6 rounded-full border border-border"
									style="background-color: rgb({paletteOption.primaryColor});"
									aria-hidden="true"
								></div>

								<!-- Palette Info -->
								<div class="flex-1 text-left">
									<p
										class="text-sm font-medium"
										class:text-primary={$palette === paletteOption.id}
										class:text-text-primary={$palette !== paletteOption.id}
									>
										{paletteOption.name}
									</p>
									<p class="text-xs text-text-secondary">{paletteOption.description}</p>
								</div>

								<!-- Active Indicator -->
								{#if $palette === paletteOption.id}
									<svg
										class="h-5 w-5 text-primary flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
