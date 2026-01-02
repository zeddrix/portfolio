<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Location options
	const locationOptions = [
		{ value: 'nav', label: 'Navigation', description: 'Show in the main navigation bar' },
		{ value: 'about', label: 'About Section', description: 'Show in the about/intro section' },
		{ value: 'footer', label: 'Footer', description: 'Show in the site footer' },
		{ value: 'contact', label: 'Contact Section', description: 'Show in the contact form area' }
	];

	// Initialize selected locations from data
	let selectedLocations = new Set(data.settings.profile_picture_locations || []);

	function toggleLocation(value: string) {
		const newSet = new Set(selectedLocations);
		if (newSet.has(value)) {
			newSet.delete(value);
		} else {
			newSet.add(value);
		}
		selectedLocations = newSet;
	}

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
	<title>Profile Display - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Profile Display', href: '/admin/settings/profile-display' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Profile Display</h1>
		<p class="text-text-secondary">Choose where your profile picture appears across the site.</p>
	</div>

	<!-- Notification -->
	{#if showNotification}
		<div class="fixed top-4 right-4 z-50 max-w-md animate-slide-in" role="alert" aria-live="polite">
			<div
				class="p-4 rounded-lg shadow-xl border flex items-start gap-3
				{notificationType === 'success'
					? 'bg-success/10 border-success text-success'
					: 'bg-error/10 border-error text-error'}"
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

	<form
		method="POST"
		action="?/updateProfileDisplay"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="space-y-8">
			<!-- Location Checkboxes -->
			<section class="bg-surface rounded-lg border border-border p-6">
				<h2 class="text-xl font-semibold text-text-primary mb-2">Display Locations</h2>
				<p class="text-text-secondary text-sm mb-6">
					Select where you want your profile picture to be displayed.
				</p>

				<div class="grid gap-4 sm:grid-cols-2">
					{#each locationOptions as location}
						<label
							class="relative flex items-start p-4 cursor-pointer rounded-lg border-2 transition-all
							{selectedLocations.has(location.value)
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'}"
						>
							<input
								type="checkbox"
								name="locations"
								value={location.value}
								checked={selectedLocations.has(location.value)}
								on:change={() => toggleLocation(location.value)}
								class="sr-only"
							/>
							<div
								class="flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center transition-colors
								{selectedLocations.has(location.value) ? 'bg-primary border-primary' : 'border-border'}"
							>
								{#if selectedLocations.has(location.value)}
									<span class="material-icons text-white text-sm">check</span>
								{/if}
							</div>
							<div class="flex-1">
								<span class="text-lg font-medium text-text-primary">{location.label}</span>
								<p class="text-sm text-text-secondary mt-1">{location.description}</p>
							</div>
						</label>
					{/each}
				</div>
			</section>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<button
					type="submit"
					disabled={loading}
					class="px-6 py-3 bg-primary text-white font-semibold rounded-lg
						   hover:bg-primary/90 transition-colors
						   disabled:opacity-50 disabled:cursor-not-allowed
						   flex items-center gap-2"
				>
					{#if loading}
						<span class="material-icons animate-spin">refresh</span>
						Saving...
					{:else}
						<span class="material-icons">save</span>
						Save Settings
					{/if}
				</button>
			</div>
		</div>
	</form>
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
