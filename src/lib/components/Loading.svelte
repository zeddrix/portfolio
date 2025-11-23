<script lang="ts">
	/**
	 * Loading Component
	 *
	 * A loading spinner with multiple sizes and optional fullscreen overlay.
	 * Smooth rotation animation.
	 */

	import { fade } from 'svelte/transition';

	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let color: string = 'text-primary-500';
	export let fullscreen: boolean = false;
	export let text: string = '';

	$: sizeClasses = {
		small: 'w-4 h-4',
		medium: 'w-8 h-8',
		large: 'w-12 h-12'
	}[size];
</script>

{#if fullscreen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	>
		<div class="flex flex-col items-center gap-4">
			<svg
				class="animate-spin {sizeClasses} {color}"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			{#if text}
				<p class="text-sm text-neutral-600">{text}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="inline-flex items-center gap-3" {...$$restProps}>
		<svg
			class="animate-spin {sizeClasses} {color}"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
		{#if text}
			<span class="text-sm text-neutral-600">{text}</span>
		{/if}
		<slot />
	</div>
{/if}
