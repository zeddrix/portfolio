<script lang="ts" context="module">
	export interface MenuItem {
		label: string;
		href: string;
		active?: boolean;
	}
</script>

<script lang="ts">
	/**
	 * MobileMenu Component
	 *
	 * A slide-in mobile menu with backdrop overlay.
	 * Handles body scroll locking and escape key to close.
	 */

	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	export let open: boolean = false;
	export let items: MenuItem[] = [];

	function close() {
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
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
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 md:hidden">
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-black/50"
			transition:fade={{ duration: 300 }}
			on:click={close}
			on:keydown={(e) => e.key === 'Enter' && close()}
			role="button"
			tabindex="0"
			aria-label="Close menu"
		/>

		<!-- Menu Panel -->
		<div
			class="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl"
			transition:fly={{ x: 300, duration: 300 }}
		>
			<div class="flex flex-col h-full">
				<!-- Header -->
				<div class="flex items-center justify-between p-4 border-b border-neutral-200">
					<h2 class="text-lg font-semibold text-neutral-900">Menu</h2>
					<button
						type="button"
						on:click={close}
						class="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
						aria-label="Close menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
				</div>

				<!-- Menu Items -->
				<nav class="flex-1 overflow-y-auto p-4">
					<ul class="space-y-2">
						{#each items as item}
							<li>
								<a
									href={item.href}
									on:click={close}
									class="block px-4 py-3 text-base font-medium rounded-lg transition-colors
										{item.active
										? 'text-primary-600 bg-primary-50'
										: 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'}"
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
					<div class="mt-4">
						<slot />
					</div>
				</nav>
			</div>
		</div>
	</div>
{/if}
