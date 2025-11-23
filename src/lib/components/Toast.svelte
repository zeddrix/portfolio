<script lang="ts">
	/**
	 * Toast Component
	 *
	 * A notification toast with auto-dismiss, manual dismiss, and different types.
	 * Slides in from the corner with smooth animations.
	 */

	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let message: string = '';
	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let duration: number = 5000;
	export let dismissible: boolean = true;
	export let visible: boolean = true;

	let timeoutId: number | undefined;

	function dismiss() {
		visible = false;
	}

	onMount(() => {
		if (duration > 0) {
			// eslint-disable-next-line no-undef
			timeoutId = window.setTimeout(() => {
				dismiss();
			}, duration);
		}

		return () => {
			if (timeoutId) {
				// eslint-disable-next-line no-undef
				clearTimeout(timeoutId);
			}
		};
	});

	$: typeStyles = {
		success: {
			bg: 'bg-success/10',
			border: 'border-success/20',
			text: 'text-successDark',
			icon: 'text-success'
		},
		error: {
			bg: 'bg-error/10',
			border: 'border-error/20',
			text: 'text-errorDark',
			icon: 'text-error'
		},
		warning: {
			bg: 'bg-warning/10',
			border: 'border-warning/20',
			text: 'text-warningDark',
			icon: 'text-warning'
		},
		info: {
			bg: 'bg-info/10',
			border: 'border-info/20',
			text: 'text-infoDark',
			icon: 'text-info'
		}
	}[type];

	$: iconPath = {
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	}[type];
</script>

{#if visible}
	<div
		class="fixed bottom-4 right-4 z-50 max-w-sm w-full"
		transition:fly={{ x: 300, duration: 300 }}
		role="alert"
	>
		<div
			class="flex items-start gap-3 p-4 rounded-lg shadow-lg border {typeStyles.bg} {typeStyles.border}"
		>
			<!-- Icon -->
			<div class="flex-shrink-0 {typeStyles.icon}">
				<svg
					class="w-6 h-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath} />
				</svg>
			</div>

			<!-- Message -->
			<div class="flex-1 {typeStyles.text}">
				<p class="text-sm font-medium">{message}</p>
				<slot />
			</div>

			<!-- Dismiss Button -->
			{#if dismissible}
				<button
					type="button"
					on:click={dismiss}
					class="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
					aria-label="Dismiss"
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
	</div>
{/if}
