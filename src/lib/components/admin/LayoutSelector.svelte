<script lang="ts">
	import { enhance } from '$app/forms';
	import type { LayoutType } from '$lib/types/layout';

	export let currentLayout: LayoutType;
	export let showConfirmation: boolean = false;

	const layouts = [
		{
			value: 'case_study' as LayoutType,
			name: 'Modern Case Study',
			description: 'Full-width case studies with detailed project showcases',
			icon: 'article'
		},
		{
			value: 'single_page' as LayoutType,
			name: 'Single-Page Scrolling',
			description: 'Traditional portfolio with smooth scrolling sections',
			icon: 'view_day'
		},
		{
			value: 'bento_grid' as LayoutType,
			name: 'Bento Grid',
			description: 'Modern masonry layout with interactive cards',
			icon: 'grid_view'
		}
	];

	let selectedLayout: LayoutType = currentLayout;
	let showConfirmDialog = false;
	let pendingLayout: LayoutType | null = null;
	let isSubmitting = false;

	function handleLayoutClick(layout: LayoutType) {
		if (layout === currentLayout) return;

		if (showConfirmation) {
			pendingLayout = layout;
			showConfirmDialog = true;
		} else {
			selectedLayout = layout;
			submitForm();
		}
	}

	function confirmChange() {
		if (pendingLayout) {
			selectedLayout = pendingLayout;
			showConfirmDialog = false;
			submitForm();
		}
	}

	function cancelChange() {
		pendingLayout = null;
		showConfirmDialog = false;
	}

	function submitForm() {
		isSubmitting = true;
		const form = document.getElementById('layout-form') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-semibold text-text-primary mb-2">Default Layout</h3>
		<p class="text-sm text-text-secondary mb-4">
			This sets the default layout for new visitors. Visitors can switch layouts themselves using
			the layout switcher.
		</p>
	</div>

	<form id="layout-form" method="POST" action="?/updateLayout" use:enhance>
		<input type="hidden" name="layout" value={selectedLayout} />
	</form>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		{#each layouts as layout}
			<button
				type="button"
				on:click={() => handleLayoutClick(layout.value)}
				disabled={isSubmitting}
				class="relative p-6 rounded-lg border-2 transition-all duration-200 text-left
					{currentLayout === layout.value
					? 'border-primary bg-primary/10'
					: 'border-border bg-surface hover:border-primary/50'}
					{isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				"
			>
				<div class="flex flex-col items-center text-center space-y-3">
					<span class="material-icons text-4xl text-primary">
						{layout.icon}
					</span>
					<div>
						<h4 class="font-semibold text-text-primary mb-1">{layout.name}</h4>
						<p class="text-xs text-text-secondary">{layout.description}</p>
					</div>
				</div>

				{#if currentLayout === layout.value}
					<div
						class="absolute top-2 right-2 bg-primary text-background px-2 py-1 rounded text-xs font-medium"
					>
						Current
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<!-- Confirmation Dialog -->
{#if showConfirmDialog}
	<div
		class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		on:click={cancelChange}
		on:keydown={(e) => e.key === 'Escape' && cancelChange()}
		role="button"
		tabindex="-1"
	>
		<div
			class="bg-surface border border-border rounded-lg p-6 max-w-md w-full shadow-xl"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
		>
			<h3 class="text-lg font-semibold text-text-primary mb-2">Confirm Layout Change</h3>
			<p class="text-text-secondary mb-6">
				Are you sure you want to change the default layout to <strong
					>{layouts.find((l) => l.value === pendingLayout)?.name}</strong
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
