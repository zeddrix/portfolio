<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Breadcrumb from '$lib/components/admin/Breadcrumb.svelte';
	import type { PageData, ActionData } from './$types';
	import type { ColorCombination } from '$lib/types/database';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showNotification = false;
	let notificationMessage = '';
	let notificationType: 'success' | 'error' = 'success';

	// Preview mode
	let previewMode: 'light' | 'dark' = 'dark';
	let selectedCombination: ColorCombination | null = null;

	// Modal states
	let showModal = false;
	let editingCombination: ColorCombination | null = null;
	let combinationForm = {
		name: '',
		primary_color: '#3b82f6',
		secondary_color: '#8b5cf6',
		accent_color: '#10b981',
		background_dark: '#0a0a0a',
		background_light: '#ffffff',
		surface_dark: '#1a1a1a',
		surface_light: '#f5f5f5',
		text_primary_dark: '#ffffff',
		text_primary_light: '#0a0a0a',
		text_secondary_dark: '#a3a3a3',
		text_secondary_light: '#525252',
		border_dark: '#262626',
		border_light: '#e5e5e5'
	};

	let showDeleteConfirm = false;
	let deletingCombinationId: string | null = null;

	function openAddModal() {
		editingCombination = null;
		combinationForm = {
			name: '',
			primary_color: '#3b82f6',
			secondary_color: '#8b5cf6',
			accent_color: '#10b981',
			background_dark: '#0a0a0a',
			background_light: '#ffffff',
			surface_dark: '#1a1a1a',
			surface_light: '#f5f5f5',
			text_primary_dark: '#ffffff',
			text_primary_light: '#0a0a0a',
			text_secondary_dark: '#a3a3a3',
			text_secondary_light: '#525252',
			border_dark: '#262626',
			border_light: '#e5e5e5'
		};
		showModal = true;
	}

	function openEditModal(combination: ColorCombination) {
		editingCombination = combination;
		combinationForm = {
			name: combination.name,
			primary_color: combination.primary_color,
			secondary_color: combination.secondary_color,
			accent_color: combination.accent_color,
			background_dark: combination.background_dark,
			background_light: combination.background_light,
			surface_dark: combination.surface_dark,
			surface_light: combination.surface_light,
			text_primary_dark: combination.text_primary_dark,
			text_primary_light: combination.text_primary_light,
			text_secondary_dark: combination.text_secondary_dark,
			text_secondary_light: combination.text_secondary_light,
			border_dark: combination.border_dark,
			border_light: combination.border_light
		};
		showModal = true;
	}

	function closeModals() {
		showModal = false;
		showDeleteConfirm = false;
		editingCombination = null;
	}

	function confirmDelete(id: string) {
		deletingCombinationId = id;
		showDeleteConfirm = true;
	}

	function selectCombination(combination: ColorCombination) {
		selectedCombination = combination;
	}

	// Auto-select the default combination for preview
	$: {
		if (!selectedCombination && data.combinations.length > 0) {
			selectedCombination = data.combinations.find((c) => c.is_default) || data.combinations[0];
		}
	}

	$: previewColors = selectedCombination
		? {
				primary: selectedCombination.primary_color,
				secondary: selectedCombination.secondary_color,
				accent: selectedCombination.accent_color,
				background:
					previewMode === 'dark'
						? selectedCombination.background_dark
						: selectedCombination.background_light,
				surface:
					previewMode === 'dark'
						? selectedCombination.surface_dark
						: selectedCombination.surface_light,
				textPrimary:
					previewMode === 'dark'
						? selectedCombination.text_primary_dark
						: selectedCombination.text_primary_light,
				textSecondary:
					previewMode === 'dark'
						? selectedCombination.text_secondary_dark
						: selectedCombination.text_secondary_light,
				border:
					previewMode === 'dark'
						? selectedCombination.border_dark
						: selectedCombination.border_light
			}
		: null;

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
	<title>{data.palette.display_name} - Color Palettes - Admin</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<Breadcrumb
		items={[
			{ label: 'Dashboard', href: '/admin' },
			{ label: 'Settings', href: '/admin/settings' },
			{ label: 'Color Palettes', href: '/admin/settings/palettes' },
			{ label: data.palette.display_name, href: `/admin/settings/palettes/${data.palette.id}` }
		]}
	/>

	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-text-primary mb-2">{data.palette.display_name}</h1>
			<p class="text-text-secondary">
				{data.palette.description || 'Manage color combinations for this palette.'}
			</p>
		</div>
		<div class="flex items-center gap-2">
			{#if data.palette.is_system}
				<span
					class="px-3 py-1 bg-background border border-border rounded text-sm text-text-secondary"
				>
					System Palette
				</span>
			{/if}
			{#if data.palette.is_active}
				<span class="px-3 py-1 bg-primary text-white rounded text-sm">Active</span>
			{/if}
		</div>
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

	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Color Combinations List -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Color Combinations</h2>
				<button
					type="button"
					on:click={openAddModal}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
				>
					<span class="material-icons">add</span>
					Add Combination
				</button>
			</div>

			{#if data.combinations.length === 0}
				<p class="text-text-secondary text-center py-8">
					No color combinations yet. Add your first one!
				</p>
			{:else}
				<div class="space-y-3">
					{#each data.combinations as combination (combination.id)}
						<button
							type="button"
							on:click={() => selectCombination(combination)}
							class="w-full flex items-center gap-4 p-4 bg-background rounded-lg border-2 transition-all
							{selectedCombination?.id === combination.id
								? 'border-primary'
								: 'border-border hover:border-primary/50'}"
						>
							<!-- Color swatches -->
							<div class="flex gap-1">
								<div
									class="w-6 h-6 rounded-full border border-border"
									style="background-color: {combination.primary_color}"
								></div>
								<div
									class="w-6 h-6 rounded-full border border-border"
									style="background-color: {combination.secondary_color}"
								></div>
								<div
									class="w-6 h-6 rounded-full border border-border"
									style="background-color: {combination.accent_color}"
								></div>
							</div>

							<div class="flex-1 text-left">
								<span class="font-medium text-text-primary">{combination.name}</span>
								{#if combination.is_default}
									<span class="ml-2 text-xs text-primary">Default</span>
								{/if}
							</div>

							<div class="flex gap-1" on:click|stopPropagation>
								{#if !combination.is_default}
									<form
										method="POST"
										action="?/setDefaultCombination"
										use:enhance={() => {
											loading = true;
											return async ({ update }) => {
												await update();
												loading = false;
											};
										}}
									>
										<input type="hidden" name="id" value={combination.id} />
										<button
											type="submit"
											disabled={loading}
											class="p-1.5 text-text-secondary hover:text-success rounded"
											title="Set as default"
										>
											<span class="material-icons text-sm">star_border</span>
										</button>
									</form>
								{/if}
								<button
									type="button"
									on:click={() => openEditModal(combination)}
									class="p-1.5 text-text-secondary hover:text-primary rounded"
									title="Edit"
								>
									<span class="material-icons text-sm">edit</span>
								</button>
								{#if !combination.is_default}
									<button
										type="button"
										on:click={() => confirmDelete(combination.id)}
										class="p-1.5 text-text-secondary hover:text-error rounded"
										title="Delete"
									>
										<span class="material-icons text-sm">delete</span>
									</button>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Live Preview -->
		<section class="bg-surface rounded-lg border border-border p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-text-primary">Preview</h2>
				<div class="flex gap-2">
					<button
						type="button"
						on:click={() => (previewMode = 'light')}
						class="px-3 py-1 rounded text-sm transition-all
						{previewMode === 'light'
							? 'bg-primary text-white'
							: 'bg-background text-text-secondary hover:text-text-primary'}"
					>
						Light
					</button>
					<button
						type="button"
						on:click={() => (previewMode = 'dark')}
						class="px-3 py-1 rounded text-sm transition-all
						{previewMode === 'dark'
							? 'bg-primary text-white'
							: 'bg-background text-text-secondary hover:text-text-primary'}"
					>
						Dark
					</button>
				</div>
			</div>

			{#if previewColors}
				<div
					data-testid="palette-preview"
					class="rounded-lg border overflow-hidden"
					style="background-color: {previewColors.background}; border-color: {previewColors.border}"
				>
					<!-- Preview header -->
					<div
						class="p-4 border-b"
						style="background-color: {previewColors.surface}; border-color: {previewColors.border}"
					>
						<h3 class="font-semibold" style="color: {previewColors.textPrimary}">Preview Header</h3>
						<p class="text-sm" style="color: {previewColors.textSecondary}">
							This is what your color scheme looks like
						</p>
					</div>

					<!-- Preview content -->
					<div class="p-4 space-y-4">
						<p style="color: {previewColors.textPrimary}">
							Primary text content appears with the main text color.
						</p>
						<p style="color: {previewColors.textSecondary}">
							Secondary text uses a softer color for less important information.
						</p>

						<!-- Preview buttons -->
						<div class="flex gap-2 flex-wrap">
							<button
								type="button"
								class="px-4 py-2 rounded font-medium"
								style="background-color: {previewColors.primary}; color: white"
							>
								Primary
							</button>
							<button
								type="button"
								class="px-4 py-2 rounded font-medium"
								style="background-color: {previewColors.secondary}; color: white"
							>
								Secondary
							</button>
							<button
								type="button"
								class="px-4 py-2 rounded font-medium"
								style="background-color: {previewColors.accent}; color: white"
							>
								Accent
							</button>
						</div>

						<!-- Preview card -->
						<div
							class="p-4 rounded border"
							style="background-color: {previewColors.surface}; border-color: {previewColors.border}"
						>
							<h4 class="font-medium mb-1" style="color: {previewColors.textPrimary}">
								Card Title
							</h4>
							<p class="text-sm" style="color: {previewColors.textSecondary}">
								A sample card with surface background.
							</p>
						</div>
					</div>
				</div>

				<!-- Color swatches reference -->
				<div class="mt-4 grid grid-cols-4 gap-2 text-xs">
					<div class="text-center">
						<div
							class="w-full h-8 rounded border border-border mb-1"
							style="background-color: {previewColors.primary}"
						></div>
						<span class="text-text-secondary">Primary</span>
					</div>
					<div class="text-center">
						<div
							class="w-full h-8 rounded border border-border mb-1"
							style="background-color: {previewColors.secondary}"
						></div>
						<span class="text-text-secondary">Secondary</span>
					</div>
					<div class="text-center">
						<div
							class="w-full h-8 rounded border border-border mb-1"
							style="background-color: {previewColors.accent}"
						></div>
						<span class="text-text-secondary">Accent</span>
					</div>
					<div class="text-center">
						<div
							class="w-full h-8 rounded border border-border mb-1"
							style="background-color: {previewColors.background}"
						></div>
						<span class="text-text-secondary">Background</span>
					</div>
				</div>
			{:else}
				<div class="text-center py-12 text-text-secondary">
					<span class="material-icons text-4xl mb-2">palette</span>
					<p>Select a color combination to preview</p>
				</div>
			{/if}
		</section>
	</div>

	<!-- Add/Edit Modal -->
	{#if showModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8"
		>
			<div class="bg-surface rounded-lg border border-border p-6 w-full max-w-2xl mx-4">
				<h3 class="text-xl font-semibold text-text-primary mb-4">
					{editingCombination ? 'Edit Combination' : 'Add Combination'}
				</h3>
				<form
					method="POST"
					action={editingCombination ? '?/updateCombination' : '?/createCombination'}
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					{#if editingCombination}
						<input type="hidden" name="id" value={editingCombination.id} />
					{/if}

					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-text-secondary mb-1">Name</label>
							<input
								type="text"
								name="name"
								bind:value={combinationForm.name}
								required
								class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary"
								placeholder="e.g., Default, Vibrant, Muted"
							/>
						</div>

						<!-- Primary Colors -->
						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Primary Colors</h4>
							<div class="grid grid-cols-3 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Primary</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="primary_color"
											bind:value={combinationForm.primary_color}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.primary_color}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Secondary</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="secondary_color"
											bind:value={combinationForm.secondary_color}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.secondary_color}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Accent</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="accent_color"
											bind:value={combinationForm.accent_color}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.accent_color}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- Background Colors -->
						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Background</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Dark Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="background_dark"
											bind:value={combinationForm.background_dark}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.background_dark}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Light Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="background_light"
											bind:value={combinationForm.background_light}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.background_light}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- Surface Colors -->
						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Surface</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Dark Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="surface_dark"
											bind:value={combinationForm.surface_dark}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.surface_dark}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Light Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="surface_light"
											bind:value={combinationForm.surface_light}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.surface_light}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- Text Colors -->
						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Text Primary</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Dark Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="text_primary_dark"
											bind:value={combinationForm.text_primary_dark}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.text_primary_dark}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Light Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="text_primary_light"
											bind:value={combinationForm.text_primary_light}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.text_primary_light}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Text Secondary</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Dark Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="text_secondary_dark"
											bind:value={combinationForm.text_secondary_dark}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.text_secondary_dark}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Light Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="text_secondary_light"
											bind:value={combinationForm.text_secondary_light}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.text_secondary_light}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- Border Colors -->
						<div>
							<h4 class="text-sm font-medium text-text-secondary mb-3">Border</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-xs text-text-secondary mb-1">Dark Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="border_dark"
											bind:value={combinationForm.border_dark}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.border_dark}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
								<div>
									<label class="block text-xs text-text-secondary mb-1">Light Mode</label>
									<div class="flex gap-2">
										<input
											type="color"
											name="border_light"
											bind:value={combinationForm.border_light}
											class="w-10 h-10 rounded border border-border cursor-pointer"
										/>
										<input
											type="text"
											bind:value={combinationForm.border_light}
											class="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary text-sm"
										/>
									</div>
								</div>
							</div>
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
							{loading ? 'Saving...' : 'Save'}
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
				<h3 class="text-xl font-semibold text-text-primary mb-2">Delete Combination?</h3>
				<p class="text-text-secondary mb-6">This action cannot be undone.</p>
				<form
					method="POST"
					action="?/deleteCombination"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="id" value={deletingCombinationId} />
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
