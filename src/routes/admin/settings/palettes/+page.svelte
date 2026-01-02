<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { ColorPaletteRow } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Modal states
	let showCreateModal = false;
	let showEditModal = false;
	let editingPalette: ColorPaletteRow | null = null;
	let paletteForm = { name: '', display_name: '', description: '' };

	let showDeleteConfirm = false;
	let deletingPaletteId: string | null = null;

	function openCreateModal() {
		paletteForm = { name: '', display_name: '', description: '' };
		showCreateModal = true;
	}

	function openEditModal(palette: ColorPaletteRow) {
		editingPalette = palette;
		paletteForm = {
			name: palette.name,
			display_name: palette.display_name,
			description: palette.description || ''
		};
		showEditModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showEditModal = false;
		showDeleteConfirm = false;
		editingPalette = null;
	}

	function confirmDelete(id: string) {
		deletingPaletteId = id;
		showDeleteConfirm = true;
	}

	function navigateToPalette(palette: ColorPaletteRow) {
		goto(`/admin/settings/palettes/${palette.id}`);
	}

	$: if (form) {
		if (form.success) {
			showNotification = true;
			notificationMessage = form.message || 'Success';
			notificationType = 'success';
			invalidateAll();
			closeModals();
			setTimeout(() => (showNotification = false), 5000);
		} else if (form.error) {
			showNotification = true;
			notificationMessage = form.error;
			notificationType = 'error';
			setTimeout(() => (showNotification = false), 5000);
		}
	}
</script>

<svelte:head>
	<title>Color Palettes - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Color Palettes', href: '/admin/settings/palettes' }
		]}
	/>

	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-text-primary mb-2">Color Palettes</h1>
			<p class="text-text-secondary">Manage color palettes and their combinations.</p>
		</div>
		<button
			type="button"
			on:click={openCreateModal}
			class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
		>
			<span class="material-icons">add</span>
			Create Palette
		</button>
	</div>

	<!-- Notification -->
	{#if showNotification}
		<div class="fixed top-4 right-4 z-50 max-w-md" role="alert">
			<div
				class="p-4 rounded-lg shadow-xl border flex items-start gap-3
				{notificationType === 'success'
					? 'bg-success/10 border-success text-success'
					: 'bg-error/10 border-error text-error'}"
			>
				<span class="material-icons"
					>{notificationType === 'success' ? 'check_circle' : 'error'}</span
				>
				<p class="font-medium">{notificationMessage}</p>
				<button type="button" on:click={() => (showNotification = false)} class="ml-auto">
					<span class="material-icons text-sm">close</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Palettes Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.palettes as palette (palette.id)}
			<button
				type="button"
				data-testid="palette-card"
				data-active={palette.is_active}
				on:click={() => navigateToPalette(palette)}
				class="relative bg-surface rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50
				{palette.is_active ? 'border-primary ring-2 ring-primary/20' : 'border-border'}"
			>
				{#if palette.is_active}
					<span
						class="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full"
					>
						Active
					</span>
				{/if}

				<div class="flex items-start gap-3 mb-3">
					<span class="material-icons text-3xl text-text-secondary">palette</span>
					<div class="flex-1 min-w-0">
						<h3 class="font-semibold text-text-primary truncate">{palette.display_name}</h3>
						<p class="text-sm text-text-secondary truncate">{palette.name}</p>
					</div>
				</div>

				{#if palette.description}
					<p class="text-sm text-text-secondary line-clamp-2 mb-3">{palette.description}</p>
				{/if}

				<div class="flex items-center gap-2 text-xs text-text-secondary">
					{#if palette.is_system}
						<span class="px-2 py-0.5 bg-background rounded">System</span>
					{:else}
						<span class="px-2 py-0.5 bg-background rounded">Custom</span>
					{/if}
				</div>

				<!-- Action buttons -->
				<div
					class="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
				>
					{#if !palette.is_active}
						<form
							method="POST"
							action="?/activatePalette"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
							on:click|stopPropagation
						>
							<input type="hidden" name="id" value={palette.id} />
							<button
								type="submit"
								disabled={loading}
								class="p-1.5 text-text-secondary hover:text-success rounded"
								title="Activate palette"
							>
								<span class="material-icons text-sm">check_circle</span>
							</button>
						</form>
					{/if}
					<button
						type="button"
						on:click|stopPropagation={() => openEditModal(palette)}
						class="p-1.5 text-text-secondary hover:text-primary rounded"
						title="Edit palette"
					>
						<span class="material-icons text-sm">edit</span>
					</button>
					{#if !palette.is_system && !palette.is_active}
						<button
							type="button"
							on:click|stopPropagation={() => confirmDelete(palette.id)}
							class="p-1.5 text-text-secondary hover:text-error rounded"
							title="Delete palette"
						>
							<span class="material-icons text-sm">delete</span>
						</button>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if data.palettes.length === 0}
		<div class="bg-surface rounded-lg border border-border p-8 text-center">
			<span class="material-icons text-6xl text-text-secondary mb-4">palette</span>
			<h2 class="text-xl font-semibold text-text-primary mb-2">No Palettes</h2>
			<p class="text-text-secondary">Create your first color palette to get started.</p>
		</div>
	{/if}

	<!-- Create Modal -->
	{#if showCreateModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">New Palette</h3>
				<form
					method="POST"
					action="?/createPalette"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Name (ID)</label>
							<input
								type="text"
								name="name"
								bind:value={paletteForm.name}
								required
								pattern="[a-z0-9-]+"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., ocean-blue"
							/>
							<p class="text-xs text-text-secondary mt-1">
								Lowercase letters, numbers, hyphens only
							</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
							<input
								type="text"
								name="display_name"
								bind:value={paletteForm.display_name}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Ocean Blue"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Description (optional)</label
							>
							<textarea
								name="description"
								bind:value={paletteForm.description}
								rows="2"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
								placeholder="A brief description of this palette"
							></textarea>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button type="button" on:click={closeModals} class="px-4 py-2 text-text-secondary">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Edit Modal -->
	{#if showEditModal && editingPalette}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">Edit Palette</h3>
				<form
					method="POST"
					action="?/updatePalette"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={editingPalette.id} />

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Name (ID)</label>
							<input
								type="text"
								value={editingPalette.name}
								disabled
								class="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-text-secondary cursor-not-allowed"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
							<input
								type="text"
								name="display_name"
								bind:value={paletteForm.display_name}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Description (optional)</label
							>
							<textarea
								name="description"
								bind:value={paletteForm.description}
								rows="2"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary resize-none"
							></textarea>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6">
						<button type="button" on:click={closeModals} class="px-4 py-2 text-text-secondary">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Delete Confirmation -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-sm mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete Palette?</h3>
				<p class="text-text-secondary mb-6">
					This will also delete all color combinations in this palette. This action cannot be
					undone.
				</p>
				<form
					method="POST"
					action="?/deletePalette"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deletingPaletteId} />
					<div class="flex justify-end gap-3">
						<button type="button" on:click={closeModals} class="px-4 py-2 text-text-secondary">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							class="px-4 py-2 bg-error text-white rounded-lg disabled:opacity-50"
						>
							Delete
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
