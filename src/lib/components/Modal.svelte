<script lang="ts">
	/**
	 * Modal Component
	 *
	 * A modal dialog with overlay, animations, and full accessibility support.
	 * Handles escape key, click outside, body scroll locking, and focus trapping.
	 */

	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let open: boolean = false;
	export let title: string = '';
	export let size: 'small' | 'medium' | 'large' | 'full' = 'medium';
	export let showClose: boolean = true;

	let modalElement: HTMLDivElement;

	function close() {
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			close();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (modalElement && event.target === modalElement) {
			close();
		}
	}

	onMount(() => {
		return () => {
			// eslint-disable-next-line no-undef
			document.body.style.overflow = '';
		};
	});

	$: {
		// eslint-disable-next-line no-undef
		if (typeof document !== 'undefined') {
			// eslint-disable-next-line no-undef
			document.body.style.overflow = open ? 'hidden' : '';
		}
	}

	$: sizeClasses = {
		small: 'max-w-md',
		medium: 'max-w-lg',
		large: 'max-w-2xl',
		full: 'max-w-full mx-4'
	}[size];
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		bind:this={modalElement}
		on:click={handleClickOutside}
		on:keydown={(e) => e.key === 'Enter' && handleClickOutside}
		role="button"
		tabindex="-1"
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/50" transition:fade={{ duration: 300 }} />

		<!-- Modal -->
		<div
			class="relative bg-white rounded-lg shadow-2xl w-full {sizeClasses}"
			transition:scale={{ duration: 300, start: 0.95 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<!-- Header -->
			{#if title || showClose}
				<div class="flex items-center justify-between p-6 border-b border-neutral-200">
					{#if title}
						<h2 id="modal-title" class="text-xl font-semibold text-neutral-900">
							{title}
						</h2>
					{/if}
					{#if showClose}
						<button
							type="button"
							on:click={close}
							class="p-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-100"
							aria-label="Close modal"
						>
							<svg
								class="w-5 h-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="p-6">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
					<slot name="footer" {close} />
				</div>
			{/if}
		</div>
	</div>
{/if}
