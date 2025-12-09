<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import ColorPaletteSelector from '$lib/components/admin/ColorPaletteSelector.svelte';
	import ThemeSelector from '$lib/components/admin/ThemeSelector.svelte';
	import MaintenanceModeToggle from '$lib/components/admin/MaintenanceModeToggle.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Show notification when form action completes
	$: if (form) {
		if (form.success) {
			showNotification = true;
			notificationMessage = form.message || 'Settings updated successfully';
			notificationType = 'success';
			invalidateAll();
			setTimeout(() => {
				showNotification = false;
			}, 5000);
		} else if (form.error) {
			showNotification = true;
			notificationMessage = form.error;
			notificationType = 'error';
			setTimeout(() => {
				showNotification = false;
			}, 5000);
		}
	}
</script>

<svelte:head>
	<title>Site Settings - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Site Settings</h1>
		<p class="text-text-secondary">
			Manage your portfolio's appearance and functionality. Changes affect the default experience
			for new visitors.
		</p>
	</div>

	<!-- Success/Error Notification -->
	{#if showNotification}
		<div class="fixed top-4 right-4 z-50 max-w-md animate-slide-in" role="alert" aria-live="polite">
			<div
				class="p-4 rounded-lg shadow-xl border flex items-start gap-3
				{notificationType === 'success'
					? 'bg-success/10 border-success text-success'
					: 'bg-error/10 border-error text-error'}
			"
			>
				<span class="material-icons">
					{notificationType === 'success' ? 'check_circle' : 'error'}
				</span>
				<div class="flex-1">
					<p class="font-medium">{notificationMessage}</p>
				</div>
				<button
					type="button"
					on:click={() => (showNotification = false)}
					class="text-current hover:opacity-70 transition-opacity"
				>
					<span class="material-icons text-sm">close</span>
				</button>
			</div>
		</div>
	{/if}

	<div class="space-y-8">
		<!-- Color Palette Settings -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<ColorPaletteSelector currentPalette={data.settings.active_palette} showConfirmation={true} />
		</section>

		<!-- Theme Settings -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<ThemeSelector currentTheme={data.settings.theme_mode} />
		</section>

		<!-- Maintenance Mode -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<MaintenanceModeToggle maintenanceMode={data.settings.maintenance_mode} />
		</section>

		<!-- Information Card -->
		<section class="bg-primary/5 border border-primary/20 rounded-lg p-6">
			<div class="flex items-start gap-3">
				<span class="material-icons text-primary text-2xl">info</span>
				<div class="flex-1">
					<h3 class="font-semibold text-text-primary mb-2">About These Settings</h3>
					<ul class="space-y-2 text-sm text-text-secondary">
						<li class="flex items-start gap-2">
							<span class="material-icons text-xs mt-0.5">arrow_right</span>
							<span
								><strong>Default Palette:</strong> This sets the initial color scheme for new visitors.
								Visitors can always switch to their preferred colors using the palette switcher on the
								site.</span
							>
						</li>
						<li class="flex items-start gap-2">
							<span class="material-icons text-xs mt-0.5">arrow_right</span>
							<span
								><strong>Visitor Preferences:</strong> Once a visitor selects their preferred palette,
								their choice is saved locally and will override these defaults on future visits.</span
							>
						</li>
						<li class="flex items-start gap-2">
							<span class="material-icons text-xs mt-0.5">arrow_right</span>
							<span
								><strong>Maintenance Mode:</strong> Use this when you need to take the site offline for
								updates. Admin access will continue to work.</span
							>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
