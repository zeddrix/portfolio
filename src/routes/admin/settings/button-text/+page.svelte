<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { ButtonTextPreset, ProjectCategory } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Modal states
	let showPresetModal = false;
	let editingPreset: ButtonTextPreset | null = null;
	let presetForm = { text: '' };

	let showCategoryModal = false;
	let editingCategory: ProjectCategory | null = null;
	let categoryForm = { name: '', display_name: '', default_button_text: '' };

	let showDeleteConfirm = false;
	let deleteType: 'preset' | 'category' = 'preset';
	let deleteId: string | null = null;

	function openPresetModal(preset?: ButtonTextPreset) {
		editingPreset = preset || null;
		presetForm = { text: preset?.text || '' };
		showPresetModal = true;
	}

	function openCategoryModal(category?: ProjectCategory) {
		editingCategory = category || null;
		categoryForm = {
			name: category?.name || '',
			display_name: category?.display_name || '',
			default_button_text: category?.default_button_text || ''
		};
		showCategoryModal = true;
	}

	function confirmDelete(type: 'preset' | 'category', id: string) {
		deleteType = type;
		deleteId = id;
		showDeleteConfirm = true;
	}

	function closeModals() {
		showPresetModal = false;
		showCategoryModal = false;
		showDeleteConfirm = false;
		editingPreset = null;
		editingCategory = null;
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
	<title>Button Text - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Button Text', href: '/admin/settings/button-text' }
		]}
	/>

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-text-primary mb-2">Button Text</h1>
		<p class="text-text-secondary">Manage button text presets and project categories.</p>
	</div>

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

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Button Text Presets -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Button Text Presets</h2>
				<button
					type="button"
					on:click={() => openPresetModal()}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Preset
				</button>
			</div>

			{#if data.presets.length === 0}
				<p class="text-text-secondary text-center py-8">No presets yet.</p>
			{:else}
				<div class="space-y-2">
					{#each data.presets as preset (preset.id)}
						<div
							class="flex items-center gap-3 p-3 bg-background rounded-lg border border-border
							{!preset.is_active ? 'opacity-50' : ''}"
						>
							<span class="flex-1 text-text-primary">{preset.text}</span>
							<button
								type="button"
								on:click={() => openPresetModal(preset)}
								class="p-2 text-text-secondary hover:text-primary"
							>
								<span class="material-icons text-sm">edit</span>
							</button>
							<button
								type="button"
								on:click={() => confirmDelete('preset', preset.id)}
								class="p-2 text-text-secondary hover:text-error"
							>
								<span class="material-icons text-sm">delete</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Project Categories -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Project Categories</h2>
				<button
					type="button"
					on:click={() => openCategoryModal()}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Category
				</button>
			</div>

			{#if data.categories.length === 0}
				<p class="text-text-secondary text-center py-8">No categories yet.</p>
			{:else}
				<div class="space-y-2">
					{#each data.categories as category (category.id)}
						<div class="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
							<div class="flex-1">
								<span class="font-medium text-text-primary">{category.display_name}</span>
								<span class="text-text-secondary text-sm ml-2">({category.name})</span>
								<span class="text-text-secondary text-sm ml-2"
									>→ {category.default_button_text}</span
								>
							</div>
							<button
								type="button"
								on:click={() => openCategoryModal(category)}
								class="p-2 text-text-secondary hover:text-primary"
							>
								<span class="material-icons text-sm">edit</span>
							</button>
							<button
								type="button"
								on:click={() => confirmDelete('category', category.id)}
								class="p-2 text-text-secondary hover:text-error"
							>
								<span class="material-icons text-sm">delete</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>

	<!-- Preset Modal -->
	{#if showPresetModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingPreset ? 'Edit Preset' : 'Add Preset'}
				</h3>
				<form
					method="POST"
					action={editingPreset ? '?/updatePreset' : '?/createPreset'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingPreset}
						<input type="hidden" name="id" value={editingPreset.id} />
						<input type="hidden" name="is_active" value={editingPreset.is_active.toString()} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Button Text</label>
							<input
								type="text"
								name="text"
								bind:value={presetForm.text}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., View Project"
							/>
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

	<!-- Category Modal -->
	{#if showCategoryModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-md mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingCategory ? 'Edit Category' : 'Add Category'}
				</h3>
				<form
					method="POST"
					action={editingCategory ? '?/updateCategory' : '?/createCategory'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingCategory}
						<input type="hidden" name="id" value={editingCategory.id} />
					{/if}

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Category ID</label>
							<input
								type="text"
								name="name"
								bind:value={categoryForm.name}
								required
								pattern="[a-z0-9_]+"
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., web_application"
							/>
							<p class="text-xs text-text-secondary mt-1">
								Lowercase letters, numbers, underscores only
							</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
							<input
								type="text"
								name="display_name"
								bind:value={categoryForm.display_name}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Web Application"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1"
								>Default Button Text</label
							>
							<input
								type="text"
								name="default_button_text"
								bind:value={categoryForm.default_button_text}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Launch App"
							/>
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
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete {deleteType}?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action={deleteType === 'preset' ? '?/deletePreset' : '?/deleteCategory'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deleteId} />
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
