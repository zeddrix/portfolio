<script lang="ts">
	import { enhance } from '$app/forms';

	export let maintenanceMode: boolean;

	let showConfirmDialog = false;
	let pendingState: boolean | null = null;
	let isSubmitting = false;

	function handleToggle() {
		pendingState = !maintenanceMode;
		showConfirmDialog = true;
	}

	function confirmChange() {
		if (pendingState !== null) {
			showConfirmDialog = false;
			submitForm(pendingState);
		}
	}

	function cancelChange() {
		pendingState = null;
		showConfirmDialog = false;
	}

	function submitForm(value: boolean) {
		isSubmitting = true;
		const form = document.getElementById('maintenance-form') as HTMLFormElement;
		const input = form?.querySelector('input[name="maintenance_mode"]') as HTMLInputElement;
		if (form && input) {
			input.value = value.toString();
			form.requestSubmit();
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-semibold text-text-primary mb-2">Maintenance Mode</h3>
		<p class="text-sm text-text-secondary mb-4">
			When enabled, the public site will show a maintenance page. Admin access will still work
			normally.
		</p>
	</div>

	<form id="maintenance-form" method="POST" action="?/updateMaintenanceMode" use:enhance>
		<input type="hidden" name="maintenance_mode" value={maintenanceMode.toString()} />
	</form>

	<div
		class="p-6 rounded-lg border-2 {maintenanceMode
			? 'border-warning bg-warning/10'
			: 'border-border bg-surface'}"
	>
		<div class="flex items-start justify-between gap-4">
			<div class="flex-1">
				<div class="flex items-center gap-2 mb-2">
					<span
						class="material-icons text-2xl {maintenanceMode
							? 'text-warning'
							: 'text-text-secondary'}"
					>
						{maintenanceMode ? 'construction' : 'check_circle'}
					</span>
					<h4 class="font-semibold text-text-primary">
						Status: {maintenanceMode ? 'Offline' : 'Online'}
					</h4>
				</div>
				<p class="text-sm text-text-secondary">
					{#if maintenanceMode}
						Your portfolio is currently in maintenance mode. Visitors will see a maintenance page.
					{:else}
						Your portfolio is live and accessible to all visitors.
					{/if}
				</p>
			</div>

			<button
				type="button"
				on:click={handleToggle}
				disabled={isSubmitting}
				class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					{maintenanceMode ? 'bg-warning' : 'bg-text-secondary'}
					{isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				"
				role="switch"
				aria-checked={maintenanceMode}
				aria-label="Toggle maintenance mode"
			>
				<span
					class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform
						{maintenanceMode ? 'translate-x-6' : 'translate-x-1'}
					"
				></span>
			</button>
		</div>

		{#if maintenanceMode}
			<div class="mt-4 p-4 rounded bg-warning/20 border border-warning/30">
				<div class="flex items-start gap-2">
					<span class="material-icons text-warning text-sm">info</span>
					<p class="text-xs text-text-primary">
						<strong>Warning:</strong> Your portfolio is currently offline. Remember to disable maintenance
						mode when you're ready to go live again.
					</p>
				</div>
			</div>
		{/if}
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
			<div class="flex items-start gap-3 mb-4">
				<span class="material-icons text-3xl {pendingState ? 'text-warning' : 'text-success'}">
					{pendingState ? 'warning' : 'check_circle'}
				</span>
				<div>
					<h3 class="text-lg font-semibold text-text-primary mb-2">
						{pendingState ? 'Enable Maintenance Mode?' : 'Disable Maintenance Mode?'}
					</h3>
					<p class="text-text-secondary text-sm">
						{#if pendingState}
							This will take your portfolio offline and show a maintenance page to all visitors.
							Admin access will still work.
						{:else}
							This will make your portfolio live and accessible to all visitors again.
						{/if}
					</p>
				</div>
			</div>
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
					class="px-4 py-2 rounded {pendingState
						? 'bg-warning text-background'
						: 'bg-success text-background'} hover:opacity-90 transition-opacity"
				>
					{pendingState ? 'Enable Maintenance' : 'Go Live'}
				</button>
			</div>
		</div>
	</div>
{/if}
